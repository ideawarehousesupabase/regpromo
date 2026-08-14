import type { ComplianceIssue, IssueCategory, RiskLevel } from "@/data/mock";

/**
 * Deterministic, rules-based compliance engine.
 *
 * This does NOT call any AI/ML model. A campaign is scored purely by matching
 * curated regulatory phrase rules against the submitted ad copy, landing page
 * text and disclaimer, scoped to the industry the campaign runs in. The same
 * input always produces the same output — there is no randomness and no
 * campaign-specific hardcoding anywhere in this file.
 *
 * Pipeline:
 *   input → rule matching (negation-aware) → de-duplication → category
 *   penalties → weighted raw score → severity cap → final score + risk level
 *
 * Every point deducted is attached to a flagged issue carrying the matched
 * phrase, category, severity, score impact, recommendation and (where one
 * genuinely applies) a regulatory reference.
 */

/* --------------------------------- banding --------------------------------- */

/** Score → risk band. The single source of truth for risk classification. */
export function riskFromScore(score: number): RiskLevel {
  if (score >= 90) return "Low";
  if (score >= 75) return "Medium";
  if (score >= 60) return "High";
  return "Critical";
}

const SEVERITY_RANK: Record<RiskLevel, number> = { Low: 0, Medium: 1, High: 2, Critical: 3 };

/** Category weights — claim and disclosure problems outweigh tone. */
const CATEGORY_WEIGHTS: Record<IssueCategory, number> = {
  "Claim Substantiation": 0.35,
  "Disclosure Completeness": 0.3,
  "Consumer Clarity": 0.2,
  "Platform Policy Fit": 0.15,
};

const CLAIM = "Claim Substantiation";
const DISCLOSURE = "Disclosure Completeness";
const CLARITY = "Consumer Clarity";
const PLATFORM = "Platform Policy Fit";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/* ---------------------------- negation awareness ---------------------------- */

/**
 * A qualifier appearing immediately before a claim word cancels it, so
 * "returns are not guaranteed" is not treated as a guarantee.
 */
const NEGATION_BEFORE =
  /\b(?:not|never|no|none|cannot|can'?t|isn'?t|aren'?t|doesn'?t|don'?t|won'?t|without)\b[^.!?;]*$/i;

const SENTENCE_BREAK = /[.!?;\n]/;

function sentenceStartIndex(text: string, index: number): number {
  for (let i = index - 1; i >= 0; i--) {
    if (SENTENCE_BREAK.test(text[i])) return i + 1;
  }
  return 0;
}

function sentenceEndIndex(text: string, index: number): number {
  for (let i = index; i < text.length; i++) {
    if (SENTENCE_BREAK.test(text[i])) return i;
  }
  return text.length;
}

/** Text between the start of the current sentence and the match. */
function precedingContext(text: string, index: number): string {
  return text.slice(sentenceStartIndex(text, index), index);
}

/**
 * Decides whether a matched claim is cancelled by a negation.
 *
 * When a rule declares an `anchor` (the claim word the rule really turns on,
 * e.g. "guarantee"), every occurrence of that anchor inside the sentence must
 * be negated for the match to be discarded. That way "Guaranteed returns —
 * results are not guaranteed" still flags on the first, un-negated claim.
 */
function isNegated(text: string, matchIndex: number, matchText: string, anchor?: RegExp): boolean {
  if (anchor) {
    const start = sentenceStartIndex(text, matchIndex);
    const sentence = text.slice(start, sentenceEndIndex(text, matchIndex + matchText.length));
    const re = new RegExp(anchor.source, "gi");
    let occurrence: RegExpExecArray | null;
    let sawAnchor = false;
    while ((occurrence = re.exec(sentence)) !== null) {
      sawAnchor = true;
      if (!NEGATION_BEFORE.test(precedingContext(sentence, occurrence.index))) return false;
    }
    if (sawAnchor) return true;
  }
  return NEGATION_BEFORE.test(precedingContext(text, matchIndex));
}

/* ----------------------------------- rules ---------------------------------- */

interface ClaimRule {
  id: string;
  /** Rules sharing a concept describe the same underlying violation. */
  concept: string;
  /** Higher wins when two rules describe the same violation (industry > generic). */
  specificity: number;
  pattern: RegExp;
  /** The claim word negation should be evaluated against. */
  anchor?: RegExp;
  /** Undefined means the rule applies to every industry. */
  industries?: string[];
  category: IssueCategory;
  severity: RiskLevel;
  penalty: number;
  title: string;
  detail: string;
  clause: string;
  recommendation: string;
}

const GUARANTEE_ANCHOR = /\bguarantee\w*/;

/**
 * Cross-industry rules. Regulatory references stay sector-neutral here — the
 * CAP Code applies to UK advertising in every sector, so no FCA/gambling/health
 * clause is ever cited by a generic rule.
 */
const CROSS_INDUSTRY_RULES: ClaimRule[] = [
  {
    id: "generic-guarantee",
    concept: "guaranteed-outcome",
    specificity: 1,
    pattern: /\bguarantee(?:d|s|ing)?\b/i,
    anchor: GUARANTEE_ANCHOR,
    category: CLAIM,
    severity: "High",
    penalty: 45,
    title: "Unqualified guarantee",
    detail:
      "The copy guarantees an outcome without qualification. Outcomes that depend on the customer's circumstances cannot be guaranteed.",
    clause: "CAP Code 3.1 — marketing communications must not materially mislead",
    recommendation:
      "Remove the guarantee or qualify it with the conditions under which it actually applies.",
  },
  {
    id: "generic-risk-free",
    concept: "risk-free",
    specificity: 1,
    pattern: /\brisk[-\s]?free\b|\bzero\s+risk\b|\bno\s+risk\b|\bwithout\s+any\s+risk\b/i,
    category: CLAIM,
    severity: "High",
    penalty: 40,
    title: "Risk-free claim",
    detail: "Describing the offer as risk-free understates genuine risk to the consumer.",
    clause: "CAP Code 3.1 — marketing communications must not materially mislead",
    recommendation: "Remove risk-free wording and state the risks that genuinely apply.",
  },
  {
    id: "generic-absolute",
    concept: "absolute-claim",
    specificity: 1,
    pattern:
      /\b100%\s*(?:safe|secure|effective|success(?:ful)?|guaranteed|risk[-\s]?free)\b|\bcompletely\s+(?:safe|risk[-\s]?free)\b/i,
    category: CLAIM,
    severity: "High",
    penalty: 35,
    title: "Absolute claim",
    detail: "Absolute claims such as 100% safe or 100% effective require robust documentary proof.",
    clause: "CAP Code 3.7 — marketers must hold evidence to prove their claims",
    recommendation: "Replace the absolute claim with a qualified, evidenced statement.",
  },
  {
    id: "generic-superlative",
    concept: "superlative",
    specificity: 1,
    pattern:
      /\b(?:best|cheapest|fastest|safest|leading)\s+(?:ever|deal|rate|price|value|clinic|law\s+firm|provider)\b|\bno\.?\s?1\b|\b#\s?1\b|\buk'?s\s+(?:no\.?\s?1|#\s?1|best|leading|top)\b/i,
    category: CLAIM,
    severity: "Medium",
    penalty: 20,
    title: "Unsubstantiated superlative",
    detail:
      "Superlative and market-leader claims must be backed by documentary evidence held before publication.",
    clause: "CAP Code 3.7 — marketers must hold evidence to prove their claims",
    recommendation:
      "Drop the superlative or cite the independent evidence and time period it is based on.",
  },
  {
    id: "generic-pressure",
    concept: "pressure-selling",
    specificity: 1,
    pattern:
      /\bact now\b|\bhurry\b|\blimited time\b|\bdon'?t miss out\b|\bwhile stocks last\b|\btoday only\b|\blast chance\b/i,
    category: CLARITY,
    severity: "Medium",
    penalty: 15,
    title: "Pressure-selling urgency",
    detail:
      "Artificial urgency pressures consumers into decisions without proper time to consider them.",
    clause: "DMCC Act 2024 — aggressive or misleading commercial practices",
    recommendation: "Remove artificial deadlines, or state the real, verifiable offer end date.",
  },
  {
    id: "generic-instant",
    concept: "instant-outcome",
    specificity: 1,
    pattern:
      /\binstant(?:ly)?\s+(?:approval|approved|cash|payout|results?|relief|win)\b|\bimmediate\s+(?:approval|payout|results?)\b/i,
    category: CLAIM,
    severity: "Medium",
    penalty: 18,
    title: "Unsubstantiated speed claim",
    detail:
      "Promising an instant outcome is rarely true for every customer and is likely to mislead.",
    clause: "CAP Code 3.7 — marketers must hold evidence to prove their claims",
    recommendation: "Qualify with typical timescales rather than promising an instant outcome.",
  },
];

/** Sector rules. These outrank the generic rules describing the same violation. */
const INDUSTRY_RULES: ClaimRule[] = [
  /* ---------------------------- Financial Services --------------------------- */
  {
    id: "fin-guaranteed-return",
    concept: "guaranteed-outcome",
    specificity: 2,
    industries: ["Financial Services"],
    pattern:
      /\bguarantee(?:d|s)?\b[^.!?;]{0,30}?\b(?:returns?|yields?|income|profits?|growth|interest|savings?)\b|\b(?:returns?|yields?|income|profits?|savings?)\b[^.!?;]{0,25}?\bguarantee(?:d|s)?\b/i,
    anchor: GUARANTEE_ANCHOR,
    category: CLAIM,
    severity: "Critical",
    penalty: 60,
    title: "Guaranteed investment return",
    detail:
      "Investment returns cannot be guaranteed. Presenting a return as guaranteed misrepresents the risk the consumer is taking.",
    clause: "FCA COBS 4.2 — financial promotions must be fair, clear and not misleading",
    recommendation:
      "Remove the guarantee and add a prominent capital-at-risk warning alongside the rate.",
  },
  {
    id: "fin-risk-free-investment",
    concept: "risk-free",
    specificity: 2,
    industries: ["Financial Services"],
    pattern:
      /\b(?:risk[-\s]?free|zero\s+risk|no\s+risk)\b[^.!?;]{0,30}?\b(?:investment|savings?|returns?|capital|money|account)\b|\b(?:investment|savings?|capital)\b[^.!?;]{0,25}?\b(?:risk[-\s]?free|zero\s+risk)\b|\bzero\s+risk\b|\brisk[-\s]?free\b/i,
    category: CLAIM,
    severity: "Critical",
    penalty: 55,
    title: "Investment presented as risk-free",
    detail:
      "Presenting an investment or savings product as carrying no risk disguises the risk warning the consumer needs.",
    clause: "FCA COBS 4.2 — financial promotions must be fair, clear and not misleading",
    recommendation: "Remove risk-free wording and state that capital is at risk where it applies.",
  },
  {
    id: "fin-unrealistic-return",
    concept: "unrealistic-return",
    specificity: 2,
    industries: ["Financial Services"],
    pattern:
      /\bdouble\s+your\s+(?:money|investment|savings|capital)\b|\btriple\s+your\s+(?:money|investment|savings)\b|\bget\s+rich\b|\bmake\s+a\s+fortune\b/i,
    category: CLAIM,
    severity: "Critical",
    penalty: 50,
    title: "Unrealistic performance claim",
    detail:
      "Claims of doubling money or getting rich are unsubstantiated performance promises that mislead consumers about likely outcomes.",
    clause: "FCA COBS 4.2 — financial promotions must be fair, clear and not misleading",
    recommendation:
      "Remove the performance promise and present balanced, evidenced information instead.",
  },

  /* --------------------------------- Healthcare ------------------------------ */
  {
    id: "health-cure",
    concept: "health-cure",
    specificity: 2,
    industries: ["Healthcare"],
    pattern: /\bcures?\b|\bcured\b|\bcuring\b|\bmiracle\b/i,
    category: CLAIM,
    severity: "Critical",
    penalty: 60,
    title: "Cure claim",
    detail:
      "Claiming to cure a condition is a serious health claim that requires robust clinical evidence and is prohibited for most treatments.",
    clause: "CAP Code Section 12 — medicines, medical devices, health and beauty",
    recommendation:
      "Replace cure wording with what the treatment may help with, and hold clinical evidence for it.",
  },
  {
    id: "health-absolute-safety",
    concept: "health-absolute-safety",
    specificity: 2,
    industries: ["Healthcare"],
    pattern:
      /\b100%\s*(?:safe|effective|success(?:ful)?)\b|\b(?:zero|no)\s+side[-\s]?effects?\b|\bcompletely\s+safe\b|\btotally\s+safe\b/i,
    category: CLAIM,
    severity: "Critical",
    penalty: 55,
    title: "Absolute safety or efficacy claim",
    detail:
      "Stating a treatment is completely safe, has no side effects, or is 100% effective cannot be substantiated and discourages proper clinical consideration.",
    clause: "CAP Code Section 12 — medicines, medical devices, health and beauty",
    recommendation:
      "State the known risks and side effects, and qualify efficacy with clinical evidence.",
  },
  {
    id: "health-guaranteed-result",
    concept: "guaranteed-outcome",
    specificity: 2,
    industries: ["Healthcare"],
    pattern:
      /\bguarantee(?:d|s)?\b[^.!?;]{0,30}?\b(?:results?|recovery|outcomes?|cure|relief)\b|\b(?:results?|recovery|outcomes?)\b[^.!?;]{0,25}?\bguarantee(?:d|s)?\b/i,
    anchor: GUARANTEE_ANCHOR,
    category: CLAIM,
    severity: "Critical",
    penalty: 55,
    title: "Guaranteed treatment outcome",
    detail:
      "Treatment outcomes depend on the individual patient and cannot be guaranteed to every consumer.",
    clause: "CAP Code Section 12 — medicines, medical devices, health and beauty",
    recommendation:
      "Remove the guarantee and state that outcomes depend on individual clinical assessment.",
  },
  {
    id: "health-permanent",
    concept: "health-permanent",
    specificity: 2,
    industries: ["Healthcare"],
    pattern: /\bpermanent(?:ly)?\b|\bforever\b|\bfor\s+life\b/i,
    category: CLAIM,
    severity: "High",
    penalty: 35,
    title: "Permanence claim",
    detail:
      "Claiming a permanent result implies an outcome that will not change for any patient, which requires long-term clinical evidence.",
    clause: "CAP Code Section 12 — medicines, medical devices, health and beauty",
    recommendation:
      "Describe expected duration of results with evidence, and note that results vary.",
  },
  {
    id: "health-proof",
    concept: "health-proof",
    specificity: 2,
    industries: ["Healthcare"],
    pattern: /\b(?:clinically|scientifically|medically)\s+proven\b/i,
    category: CLAIM,
    severity: "Medium",
    penalty: 22,
    title: "Proof claim requires evidence",
    detail:
      "Clinically or scientifically proven claims must be supported by trials held on file before publication.",
    clause: "CAP Code 3.7 — marketers must hold evidence to prove their claims",
    recommendation: "Cite the study behind the claim, or soften it to what the evidence supports.",
  },

  /* ----------------------------------- Legal --------------------------------- */
  {
    id: "legal-guaranteed-outcome",
    concept: "guaranteed-outcome",
    specificity: 2,
    industries: ["Legal"],
    pattern:
      /\bguarantee(?:d|s)?\b[^.!?;]{0,40}?\b(?:win|winning|won|success|compensation|payout|settlement|outcome|case|claim|result)\b|\b(?:win|compensation|payout|settlement|outcome)\b[^.!?;]{0,25}?\bguarantee(?:d|s)?\b/i,
    anchor: GUARANTEE_ANCHOR,
    category: CLAIM,
    severity: "Critical",
    penalty: 60,
    title: "Guaranteed legal outcome",
    detail:
      "Legal outcomes depend on the facts and evidence of each case and can never be guaranteed to a prospective client.",
    clause: "CAP Code 3.1 / SRA Code of Conduct — publicity must not be misleading",
    recommendation:
      "Remove the guarantee and state that outcomes depend on the circumstances of each case.",
  },
  {
    id: "legal-success-rate",
    concept: "legal-success-rate",
    specificity: 2,
    industries: ["Legal"],
    pattern:
      /\b(?:9\d|100)(?:\.\d+)?%\s*(?:success|win)\s*rate\b|\b(?:success|win)\s*rate\s*(?:of\s*)?(?:9\d|100)(?:\.\d+)?%/i,
    category: CLAIM,
    severity: "High",
    penalty: 35,
    title: "Unsubstantiated success-rate claim",
    detail:
      "A headline success rate must be backed by verifiable case data and state the sample it is drawn from.",
    clause: "CAP Code 3.7 — marketers must hold evidence to prove their claims",
    recommendation: "Publish the methodology and case sample, or remove the success-rate figure.",
  },
  {
    id: "legal-max-compensation",
    concept: "legal-max-compensation",
    specificity: 2,
    industries: ["Legal"],
    pattern:
      /\bmaximum\s+compensation\b|\bguaranteed\s+£\s?[\d,]+|\bfull\s+compensation\s+every\s+time\b/i,
    category: CLAIM,
    severity: "High",
    penalty: 30,
    title: "Fixed or maximum compensation promise",
    detail:
      "Promising a maximum or fixed compensation figure implies an entitlement that depends entirely on the individual claim.",
    clause: "CAP Code 3.1 — marketing communications must not materially mislead",
    recommendation:
      "Remove the figure or present it as an illustrative past result with the facts it relied on.",
  },

  /* ---------------------------------- Gambling ------------------------------- */
  {
    id: "gambling-guaranteed-win",
    concept: "guaranteed-outcome",
    specificity: 2,
    industries: ["Gambling"],
    pattern:
      /\bguarantee(?:d|s)?\b[^.!?;]{0,30}?\b(?:win|wins|winnings?|jackpot|payout|profit)\b|\b(?:win|winnings?|jackpot)\b[^.!?;]{0,25}?\bguarantee(?:d|s)?\b|\bcan'?t\s+lose\b|\bsure\s+thing\b/i,
    anchor: GUARANTEE_ANCHOR,
    category: CLAIM,
    severity: "Critical",
    penalty: 60,
    title: "Guaranteed win claim",
    detail:
      "Gambling advertising must never suggest that winning is guaranteed or that a bet cannot be lost.",
    clause: "CAP Code Section 16 — gambling advertising must be socially responsible",
    recommendation: "Remove any suggestion of a guaranteed or certain win.",
  },
  {
    id: "gambling-risk-free",
    concept: "risk-free",
    specificity: 2,
    industries: ["Gambling"],
    pattern:
      /\brisk[-\s]?free\s+(?:bet|betting|wager|spins?|play)\b|\bfree\s+bet\b[^.!?;]{0,20}?\bno\s+risk\b/i,
    category: CLAIM,
    severity: "High",
    penalty: 40,
    title: "Risk-free betting claim",
    detail:
      "Describing a bet as risk-free misrepresents the stake the consumer actually puts at risk.",
    clause: "CAP Code Section 16 — gambling advertising must be socially responsible",
    recommendation: "Remove risk-free wording and state the stake and any wagering requirement.",
  },
  {
    id: "gambling-financial-harm",
    concept: "gambling-financial-harm",
    specificity: 2,
    industries: ["Gambling"],
    pattern:
      /\bdebts?\b|\bbills?\b|\bfinancial\s+(?:problems?|trouble|difficult\w*|security|freedom)\b|\bmoney\s+(?:problems?|worries|trouble)\b|\bstruggling\b|\bpay\s+(?:off|the)\s+(?:your\s+)?(?:bills?|debts?|mortgage|rent)\b|\bclear\s+(?:your\s+)?(?:bills?|debts?)\b|\bsecond\s+income\b|\bmake\s+a\s+living\b|\bgambling\s+as\s+(?:an?\s+)?income\b/i,
    category: CLAIM,
    severity: "Critical",
    penalty: 70,
    title: "Gambling presented as a solution to financial problems",
    detail:
      "Linking gambling to debt, bills or financial security presents it as a way out of money problems and targets consumers who are most at risk of harm.",
    clause:
      "CAP Code Section 16 — gambling must not be presented as a solution to financial concerns",
    recommendation:
      "Remove all references to debt, bills, income or financial security from gambling creative.",
  },
  {
    id: "gambling-chasing-losses",
    concept: "gambling-chasing-losses",
    specificity: 2,
    industries: ["Gambling"],
    pattern:
      /\bchas(?:e|ing)\s+(?:your\s+)?losses\b|\bwin\s+it\s+back\b|\brecover\s+your\s+losses\b|\bget\s+your\s+money\s+back\b/i,
    category: CLAIM,
    severity: "Critical",
    penalty: 55,
    title: "Encourages chasing losses",
    detail:
      "Encouraging consumers to win back or recover losses promotes socially irresponsible gambling behaviour.",
    clause: "CAP Code Section 16 — gambling advertising must be socially responsible",
    recommendation: "Remove any suggestion of recovering or chasing previous losses.",
  },
  {
    id: "gambling-win-emphasis",
    concept: "gambling-win-emphasis",
    specificity: 2,
    industries: ["Gambling"],
    pattern:
      /\bwin\s+big\b|\bbig\s+wins?\b|\beasy\s+money\b|\bquick\s+cash\b|\bjackpot\s+awaits\b|\blife[-\s]changing\s+(?:win|money|cash)\b/i,
    category: CLAIM,
    severity: "High",
    penalty: 35,
    title: "Exaggerated winning-chance language",
    detail:
      "Emphasising big or easy wins exaggerates the likelihood of winning and trivialises the risk of loss.",
    clause: "CAP Code Section 16 — gambling advertising must be socially responsible",
    recommendation: "Present the offer factually without emphasising the size or ease of winning.",
  },
];

/* ------------------------- claim-driven disclosure -------------------------- */

interface DisclosureRequirement {
  id: string;
  industries: string[];
  /** Undefined trigger means the requirement always applies to the industry. */
  trigger?: RegExp;
  satisfiedBy: RegExp;
  severity: RiskLevel;
  penalty: number;
  title: string;
  detail: string;
  clause: string;
  recommendation: string;
}

/**
 * Qualifications are only required when the campaign actually makes the claim
 * that needs qualifying — a booking invitation with no efficacy claim does not
 * need a results-may-vary notice. Generic filler such as "Terms apply" only
 * satisfies the terms requirement, never a risk or outcome qualification.
 */
const DISCLOSURE_REQUIREMENTS: DisclosureRequirement[] = [
  {
    id: "fin-risk-qualification",
    industries: ["Financial Services"],
    trigger:
      /\b\d+(?:\.\d+)?\s*%|\breturns?\b|\binvest\w*\b|\bsavings?\b|\bapr\b|\baer\b|\bapy\b|\binterest\s+rate\b|\bpension\b/i,
    satisfiedBy:
      /\bvariable\b|\bmay\s+change\b|\bcan\s+(?:go\s+down|fall|change)\b|\bcapital\s+at\s+risk\b|\bpast\s+performance\b|\bvalues?\s+(?:may|can)\s+fall\b|\bnot\s+guaranteed\b|\brates?\s+(?:may|can)\s+vary\b|\bsubject\s+to\s+change\b/i,
    severity: "High",
    penalty: 40,
    title: "Missing risk or rate-variability qualification",
    detail:
      "The campaign promotes a rate, return or investment product without telling the consumer that the rate can change or that their capital is at risk.",
    clause: "FCA COBS 4.2 — financial promotions must give a balanced view of risk",
    recommendation:
      "State clearly whether the rate is variable and whether capital is at risk, next to the headline figure.",
  },
  {
    id: "fin-eligibility-terms",
    industries: ["Financial Services"],
    trigger:
      /\b\d+(?:\.\d+)?\s*%|\breturns?\b|\binvest\w*\b|\bsavings?\b|\bapr\b|\baer\b|\bapy\b|\bloan\b|\bcredit\b|\bpension\b/i,
    satisfiedBy: /\beligib\w*\b|\bterms\b|\bconditions\b|\bsubject\s+to\b|\bcriteria\b|\bt&cs?\b/i,
    severity: "Medium",
    penalty: 25,
    title: "Missing eligibility or significant conditions",
    detail:
      "Significant conditions that affect who can actually get the advertised product are not stated.",
    clause: "CAP Code 3.9 — significant limitations and qualifications must be stated",
    recommendation: "State the eligibility criteria and any conditions that limit the offer.",
  },
  {
    id: "health-results-vary",
    industries: ["Healthcare"],
    trigger:
      /\bresults?\b|\bcures?\b|\beffective\b|\bproven\b|\bpermanent\w*\b|\bguarantee\w*\b|\btransform\w*\b|\beliminat\w*\b|\b\d+%\s*(?:improvement|reduction|success)\b/i,
    satisfiedBy:
      /\bresults?\s+(?:may|can)\s+vary\b|\bindividual\s+results\b|\bvaries?\s+(?:by|between)\s+(?:patient|individual)\b|\bnot\s+suitable\s+for\s+everyone\b|\bindividual\s+circumstances\b/i,
    severity: "High",
    penalty: 40,
    title: "Missing results-vary qualification",
    detail:
      "The campaign makes a treatment outcome claim without telling consumers that results vary between individuals.",
    clause: "CAP Code Section 12 — health claims must be qualified and substantiated",
    recommendation: "Add a clear statement that results vary from patient to patient.",
  },
  {
    id: "health-suitability",
    industries: ["Healthcare"],
    trigger:
      /\bresults?\b|\bcures?\b|\beffective\b|\bproven\b|\bpermanent\w*\b|\bguarantee\w*\b|\btreatment\b|\bprocedure\b|\bsurgery\b/i,
    satisfiedBy:
      /\bassessment\b|\bconsult\w*\b|\bsuitab\w*\b|\bqualified\s+(?:practitioner|clinician|doctor|surgeon)\b|\bindividual\s+circumstances\b|\bmedical\s+advice\b/i,
    severity: "Medium",
    penalty: 22,
    title: "Missing clinical assessment or suitability wording",
    detail:
      "Treatment promotions should direct consumers to a clinical assessment rather than implying the treatment suits everyone.",
    clause: "CAP Code Section 12 — medicines, medical devices, health and beauty",
    recommendation:
      "Point consumers to a consultation or assessment to confirm the treatment is suitable for them.",
  },
  {
    id: "legal-outcome-qualification",
    industries: ["Legal"],
    trigger:
      /\bcompensation\b|\bclaims?\b|\bwin\b|\bsettlement\b|\bpayout\b|\bcase\b|\bsue\b|\bdamages\b/i,
    satisfiedBy:
      /\bdepends?\s+on\b|\bcircumstances\b|\bnot\s+guaranteed\b|\bevery\s+case\s+is\s+different\b|\beligib\w*\b|\bsubject\s+to\b|\bvar(?:y|ies)\b|\bassessment\b/i,
    severity: "High",
    penalty: 40,
    title: "Missing outcome qualification",
    detail:
      "The campaign refers to compensation or winning a case without explaining that the outcome depends on the circumstances and evidence.",
    clause: "CAP Code 3.9 — significant limitations and qualifications must be stated",
    recommendation:
      "State that outcomes depend on the facts of each case and are assessed individually.",
  },
  {
    id: "legal-fee-clarity",
    industries: ["Legal"],
    trigger:
      /\bno\s+win,?\s*no\s+fee\b|\bfees?\b|\bcompensation\b|\bfunding\b|\bfree\s+consultation\b/i,
    satisfiedBy:
      /\bfees?\s+(?:may\s+)?appl\w*\b|\bdeduct\w*\b|\bsuccess\s+fee\b|\b\d+%\s*(?:fee|deduction)\b|\bcosts?\b|\bterms\b|\bconditions\b/i,
    severity: "Medium",
    penalty: 25,
    title: "Unclear fee or charging information",
    detail:
      'Claims such as "no win, no fee" must explain what the client may still pay, including any success fee or deductions.',
    clause: "CAP Code 3.9 / SRA Transparency Rules — costs information must be clear",
    recommendation:
      "State the success fee or deduction that applies and any costs the client could still owe.",
  },
  {
    id: "gambling-age-restriction",
    industries: ["Gambling"],
    satisfiedBy:
      /\b18\s*\+|\bover\s+18\b|\b18\s+years?\s+(?:or\s+)?(?:and\s+)?over\b|\bage\s+restrict\w*\b/i,
    severity: "High",
    penalty: 40,
    title: "Missing age restriction",
    detail: "Gambling advertising must make the 18+ age restriction clear to every consumer.",
    clause: "CAP Code Section 16 / Gambling Commission LCCP — age restriction",
    recommendation: 'Add a prominent "18+" age restriction to the creative.',
  },
  {
    id: "gambling-responsible",
    industries: ["Gambling"],
    satisfiedBy:
      /\bgamble\s+responsibl\w*\b|\bresponsible\s+gambl\w*\b|\bbegambleaware\b|\bgamcare\b|\bgamstop\b|\btake\s+time\s+to\s+think\b/i,
    severity: "High",
    penalty: 35,
    title: "Missing responsible gambling messaging",
    detail:
      "Gambling promotions must carry responsible gambling messaging and a route to support for consumers at risk.",
    clause: "CAP Code Section 16 / Gambling Commission LCCP — socially responsible messaging",
    recommendation:
      "Add responsible gambling wording and a support reference such as BeGambleAware.",
  },
  {
    id: "gambling-wagering-terms",
    industries: ["Gambling"],
    trigger:
      /\bbonus\b|\bfree\s+(?:spins?|bets?)\b|\boffer\b|\bdeposit\b|\bpromo\w*\b|\bwelcome\s+package\b/i,
    satisfiedBy:
      /\bterms\b|\bt&cs?\b|\bconditions\b|\bwagering\b|\bwithdrawal\s+restrict\w*\b|\bqualifying\s+bet\b/i,
    severity: "Medium",
    penalty: 25,
    title: "Missing bonus terms or wagering conditions",
    detail:
      "Bonus and free-bet offers must disclose the wagering requirements and conditions attached to them.",
    clause: "CAP Code 3.9 — significant limitations and qualifications must be stated",
    recommendation: "State the wagering requirement and any withdrawal restrictions on the offer.",
  },
];

/* --------------------------- contradiction checks --------------------------- */

interface ContradictionRule {
  id: string;
  /** A strong claim asserted in the advertisement itself. */
  claim: RegExp;
  claimAnchor?: RegExp;
  /** A qualification living in the landing page or disclaimer that undercuts it. */
  qualifier: RegExp;
  severity: RiskLevel;
  penalty: number;
  title: string;
  detail: string;
  clause: string;
  recommendation: string;
}

const CONTRADICTION_RULES: ContradictionRule[] = [
  {
    id: "contradiction-guarantee",
    claim: /\bguarantee(?:d|s)?\b/i,
    claimAnchor: GUARANTEE_ANCHOR,
    qualifier:
      /\bnot\s+guaranteed\b|\bno\s+guarantee\b|\boutcomes?\s+var(?:y|ies)\b|\bresults?\s+may\s+vary\b|\bcompensation\s+varies\b|\bdepends?\s+on\s+(?:your\s+)?circumstances\b/i,
    severity: "High",
    penalty: 35,
    title: "Claim and qualification conflict",
    detail:
      "The advertisement guarantees an outcome while the landing page or disclaimer states the outcome is not guaranteed. The qualification contradicts the headline claim instead of clarifying it.",
    clause: "CAP Code 3.9 — qualifications must clarify, not contradict, the claim",
    recommendation:
      "Align the advertisement with the qualification — remove the guarantee from the headline claim.",
  },
  {
    id: "contradiction-rate",
    claim: /\bguaranteed\s+[\d.]+\s*%|\bfixed\s+(?:rate|return)\b|\blocked[-\s]?in\s+rate\b/i,
    qualifier:
      /\bvariable\b|\brates?\s+(?:may|can)\s+change\b|\bmay\s+change\b|\bsubject\s+to\s+change\b/i,
    severity: "High",
    penalty: 35,
    title: "Rate claim and variability qualification conflict",
    detail:
      "The advertisement presents the rate as guaranteed or fixed while the landing page or disclaimer states it is variable and may change.",
    clause: "CAP Code 3.9 — qualifications must clarify, not contradict, the claim",
    recommendation:
      "Describe the rate consistently — if it is variable, say so in the advertisement itself.",
  },
];

/* ------------------------------ platform rules ------------------------------ */

/**
 * Platform Policy Fit only moves when a real platform-policy condition is
 * detected. Simply running on Meta Ads or TikTok never costs a campaign points.
 */
interface PlatformRule {
  id: string;
  platforms: string[];
  industries?: string[];
  applies: (ctx: { hasSeriousClaimIssue: boolean; hasAgeGate: boolean }) => boolean;
  severity: RiskLevel;
  penalty: number;
  title: string;
  detail: string;
  clause: string;
  recommendation: string;
}

const PLATFORM_RULES: PlatformRule[] = [
  {
    id: "platform-age-gate",
    platforms: ["Meta Ads", "TikTok"],
    industries: ["Gambling"],
    applies: (ctx) => !ctx.hasAgeGate,
    severity: "High",
    penalty: 45,
    title: "Gambling creative without age gating on a social platform",
    detail:
      "Social platforms require gambling advertising to carry clear age restriction and to be age-targeted. Without it the creative is likely to be rejected or removed.",
    clause: "Platform advertising policy — restricted gambling content",
    recommendation:
      "Add 18+ age restriction and apply age targeting before submitting the creative.",
  },
  {
    id: "platform-restricted-claim",
    platforms: ["Meta Ads", "TikTok"],
    industries: ["Gambling", "Financial Services"],
    applies: (ctx) => ctx.hasSeriousClaimIssue,
    severity: "Medium",
    penalty: 30,
    title: "Restricted-vertical claim likely to breach platform policy",
    detail:
      "Social platforms apply extra review to financial and gambling creative. The claims flagged in this campaign are the kind that trigger rejection or account-level enforcement.",
    clause: "Platform advertising policy — restricted financial and gambling content",
    recommendation:
      "Resolve the flagged claim issues before submitting this creative to the platform.",
  },
];

/* ----------------------------- human-review ceiling -------------------------- */

/**
 * An automated rules pass can prove a campaign breaks a rule, but it can never
 * prove one is fully compliant — that still needs a specialist to sign it off.
 * So the engine never awards a perfect score; the top of the scale is reserved
 * for human sign-off.
 *
 * The remaining headroom is earned by supplying the material a reviewer needs,
 * which keeps the ceiling deterministic and derived from the campaign itself
 * rather than being an arbitrary haircut.
 *
 *   landing page text + disclaimer supplied → 98
 *   disclaimer missing                      → 96
 *   landing page text missing               → 97
 *   both missing                            → 95
 */
const REVIEW_CEILING = 98;

function reviewCeiling(landingPageText: string, disclaimer: string): number {
  let ceiling = REVIEW_CEILING;
  if (!disclaimer.trim()) ceiling -= 2;
  if (!landingPageText.trim()) ceiling -= 1;
  return ceiling;
}

/* --------------------------------- tone check -------------------------------- */

/** Industry acronyms that must never be treated as shouting. */
const ACRONYM_ALLOWLIST = new Set([
  "GAMSTOP",
  "BEGAMBLEAWARE",
  "GAMCARE",
  "HMRC",
  "GDPR",
  "FSCS",
  "LCCP",
  "SIPP",
  "ISA",
]);

/* ----------------------------------- engine --------------------------------- */

export interface ComplianceCheckInput {
  industry: string;
  platform: string;
  adCopy: string;
  landingPageText: string;
  disclaimer: string;
}

export interface ComplianceCheckResult {
  score: number;
  risk: RiskLevel;
  issues: ComplianceIssue[];
  recommendations: string[];
  breakdown: { label: string; score: number }[];
}

interface Candidate {
  rule: ClaimRule;
  field: string;
  start: number;
  end: number;
  matched: string;
}

const FIELD_LABELS: Record<string, string> = {
  adCopy: "advertisement copy",
  landingPageText: "landing page text",
  disclaimer: "disclaimer",
};

function collectCandidates(input: ComplianceCheckInput, rules: ClaimRule[]): Candidate[] {
  const fields: [string, string][] = [
    ["adCopy", input.adCopy],
    ["landingPageText", input.landingPageText],
    ["disclaimer", input.disclaimer],
  ];

  const candidates: Candidate[] = [];
  for (const rule of rules) {
    if (rule.industries && !rule.industries.includes(input.industry)) continue;
    for (const [field, text] of fields) {
      if (!text) continue;
      const re = new RegExp(rule.pattern.source, "gi");
      let match: RegExpExecArray | null;
      while ((match = re.exec(text)) !== null) {
        if (match[0].length === 0) {
          re.lastIndex++;
          continue;
        }
        if (isNegated(text, match.index, match[0], rule.anchor)) continue;
        candidates.push({
          rule,
          field,
          start: match.index,
          end: match.index + match[0].length,
          matched: match[0].trim(),
        });
      }
    }
  }
  return candidates;
}

/**
 * Keeps one issue per underlying violation: a concept can only be flagged once,
 * and two rules whose matched text overlaps in the same field collapse into the
 * more specific / more severe of the two.
 */
function dedupe(candidates: Candidate[]): Candidate[] {
  const ordered = [...candidates].sort((a, b) => {
    if (b.rule.specificity !== a.rule.specificity) return b.rule.specificity - a.rule.specificity;
    const severity = SEVERITY_RANK[b.rule.severity] - SEVERITY_RANK[a.rule.severity];
    if (severity !== 0) return severity;
    if (b.rule.penalty !== a.rule.penalty) return b.rule.penalty - a.rule.penalty;
    return a.start - b.start;
  });

  const accepted: Candidate[] = [];
  const seenConcepts = new Set<string>();

  for (const candidate of ordered) {
    if (seenConcepts.has(candidate.rule.concept)) continue;
    const overlaps = accepted.some(
      (other) =>
        other.field === candidate.field &&
        candidate.start < other.end &&
        other.start < candidate.end,
    );
    if (overlaps) continue;
    accepted.push(candidate);
    seenConcepts.add(candidate.rule.concept);
  }

  return accepted;
}

export function runComplianceCheck(input: ComplianceCheckInput): ComplianceCheckResult {
  const adCopy = input.adCopy ?? "";
  const landingPageText = input.landingPageText ?? "";
  const disclaimer = input.disclaimer ?? "";
  const combined = `${adCopy}\n${landingPageText}\n${disclaimer}`;
  const qualifierSurface = `${landingPageText}\n${disclaimer}`;

  const issues: ComplianceIssue[] = [];
  const penalties: Record<IssueCategory, number> = {
    "Claim Substantiation": 0,
    "Disclosure Completeness": 0,
    "Consumer Clarity": 0,
    "Platform Policy Fit": 0,
  };

  const addIssue = (issue: ComplianceIssue) => {
    penalties[issue.category] += issue.impact;
    issues.push(issue);
  };

  /* ---------------------------- 1. claim matching --------------------------- */

  const matched = dedupe(collectCandidates(input, [...INDUSTRY_RULES, ...CROSS_INDUSTRY_RULES]));

  for (const candidate of matched) {
    const { rule } = candidate;
    addIssue({
      id: rule.id,
      title: rule.title,
      detail: `${rule.detail} Found in the ${FIELD_LABELS[candidate.field]}.`,
      severity: rule.severity,
      clause: rule.clause,
      category: rule.category,
      impact: rule.penalty,
      matched: candidate.matched,
      recommendation: rule.recommendation,
    });
  }

  /* ------------------------ 2. assessable content check --------------------- */

  const promotionalLength = `${adCopy} ${landingPageText}`.trim().length;
  if (promotionalLength < 15) {
    addIssue({
      id: "insufficient-content",
      title: "Insufficient campaign content to assess",
      detail:
        "There is not enough advertisement or landing page copy to run a meaningful compliance assessment against.",
      severity: "High",
      clause: "Internal review standard — assessable content required",
      category: CLAIM,
      impact: 60,
      recommendation:
        "Add the full advertisement copy and landing page text, then re-run the check.",
    });
  }

  /* -------------------------- 3. disclosure checks -------------------------- */

  for (const requirement of DISCLOSURE_REQUIREMENTS) {
    if (!requirement.industries.includes(input.industry)) continue;
    if (requirement.trigger && !requirement.trigger.test(combined)) continue;
    if (requirement.satisfiedBy.test(combined)) continue;

    addIssue({
      id: requirement.id,
      title: requirement.title,
      detail: requirement.detail,
      severity: requirement.severity,
      clause: requirement.clause,
      category: DISCLOSURE,
      impact: requirement.penalty,
      recommendation: requirement.recommendation,
    });
  }

  /* ------------------------- 4. contradiction checks ------------------------ */

  for (const rule of CONTRADICTION_RULES) {
    const claimRe = new RegExp(rule.claim.source, "gi");
    let claimMatch: RegExpExecArray | null;
    let assertedClaim: string | null = null;
    while ((claimMatch = claimRe.exec(adCopy)) !== null) {
      if (claimMatch[0].length === 0) {
        claimRe.lastIndex++;
        continue;
      }
      if (isNegated(adCopy, claimMatch.index, claimMatch[0], rule.claimAnchor)) continue;
      assertedClaim = claimMatch[0].trim();
      break;
    }
    if (!assertedClaim) continue;
    if (!rule.qualifier.test(qualifierSurface)) continue;

    addIssue({
      id: rule.id,
      title: rule.title,
      detail: rule.detail,
      severity: rule.severity,
      clause: rule.clause,
      category: CLARITY,
      impact: rule.penalty,
      matched: assertedClaim,
      recommendation: rule.recommendation,
    });
  }

  /* ----------------------------- 5. tone check ------------------------------ */

  const exclamations = (adCopy.match(/!/g) ?? []).length;
  const shouted = (adCopy.match(/\b[A-Z]{5,}\b/g) ?? []).filter(
    (word) => !ACRONYM_ALLOWLIST.has(word),
  );
  const tonePenalty = clamp(Math.max(0, exclamations - 1) * 6 + shouted.length * 8, 0, 24);

  if (tonePenalty > 0) {
    addIssue({
      id: "tone-pressure",
      title: "Overly promotional tone",
      detail:
        "Repeated exclamation marks or capitalised words make the promotion read as high-pressure and reduce consumer clarity.",
      severity: "Low",
      clause: "CAP Code 3.1 — marketing communications must be clear and not misleading",
      category: CLARITY,
      impact: tonePenalty,
      matched: shouted.length > 0 ? shouted.join(", ") : `${exclamations} exclamation marks`,
      recommendation: "Reduce exclamation marks and capitalised words to keep the tone measured.",
    });
  }

  /* --------------------------- 6. platform checks --------------------------- */

  const hasSeriousClaimIssue = issues.some(
    (issue) => issue.category === CLAIM && SEVERITY_RANK[issue.severity] >= SEVERITY_RANK.High,
  );
  const hasAgeGate = /\b18\s*\+|\bover\s+18\b|\b18\s+years?\s+(?:or\s+)?(?:and\s+)?over\b/i.test(
    combined,
  );

  for (const rule of PLATFORM_RULES) {
    if (!rule.platforms.includes(input.platform)) continue;
    if (rule.industries && !rule.industries.includes(input.industry)) continue;
    if (!rule.applies({ hasSeriousClaimIssue, hasAgeGate })) continue;

    addIssue({
      id: rule.id,
      title: rule.title,
      detail: rule.detail,
      severity: rule.severity,
      clause: rule.clause,
      category: PLATFORM,
      impact: rule.penalty,
      recommendation: rule.recommendation,
    });
  }

  /* ------------------------------- 7. scoring ------------------------------- */

  const breakdown = (Object.keys(CATEGORY_WEIGHTS) as IssueCategory[]).map((category) => ({
    label: category,
    score: clamp(100 - penalties[category], 0, 100),
  }));

  const rawScore = breakdown.reduce(
    (total, entry) => total + entry.score * CATEGORY_WEIGHTS[entry.label as IssueCategory],
    0,
  );

  // Severity caps stop a serious violation from ever landing a high score.
  const criticalCount = issues.filter((i) => i.severity === "Critical").length;
  const highCount = issues.filter((i) => i.severity === "High").length;
  const mediumCount = issues.filter((i) => i.severity === "Medium").length;

  let cap = 100;
  if (criticalCount >= 1) cap = 59;
  else if (highCount >= 2) cap = 64;
  else if (highCount === 1) cap = 74;
  else if (mediumCount >= 2) cap = 79;
  else if (mediumCount === 1) cap = 89;

  const scoreBeforeReview = clamp(Math.min(Math.round(rawScore), cap), 0, 100);
  const ceiling = reviewCeiling(landingPageText, disclaimer);
  const score = Math.min(scoreBeforeReview, ceiling);
  const risk = riskFromScore(score);

  // The ceiling is a real deduction, so it gets a real flagged issue rather than
  // silently shaving points off the total.
  if (score < scoreBeforeReview) {
    const missing: string[] = [];
    if (!landingPageText.trim()) missing.push("no landing page text was supplied");
    if (!disclaimer.trim()) missing.push("no disclaimer was supplied");

    issues.push({
      id: "awaiting-sign-off",
      title: "Awaiting specialist sign-off",
      detail:
        missing.length > 0
          ? `Automated checks found no breaches, but ${missing.join(" and ")}, so a compliance specialist still needs to review this campaign before it can be considered signed off.`
          : "Automated checks found no breaches. The remaining points are reserved for sign-off by a compliance specialist before publication.",
      severity: "Low",
      clause: "Internal review standard — human sign-off before publication",
      category: DISCLOSURE,
      impact: scoreBeforeReview - score,
      recommendation:
        missing.length > 0
          ? "Supply the missing landing page text and disclaimer, then have a compliance specialist confirm sign-off."
          : "Have a compliance specialist confirm sign-off before this campaign goes live.",
    });
  }

  /* --------------------------- 8. recommendations --------------------------- */

  const recommendations = Array.from(new Set(issues.map((issue) => issue.recommendation)));
  if (recommendations.length === 0) {
    recommendations.push(
      "No issues detected. Keep a versioned record of the evidence behind every claim made.",
    );
  }

  const severityOrder = [...issues].sort(
    (a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] || b.impact - a.impact,
  );

  return { score, risk, issues: severityOrder, recommendations, breakdown };
}
