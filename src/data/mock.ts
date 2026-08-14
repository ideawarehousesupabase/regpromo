/**
 * Risk bands are driven entirely by the compliance score:
 * 90–100 Low · 75–89 Medium · 60–74 High · 0–59 Critical.
 * See `riskFromScore` in `@/lib/compliance-engine` — the single source of truth.
 */
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

/** The four scored categories that make up a compliance result. */
export type IssueCategory =
  "Claim Substantiation" | "Disclosure Completeness" | "Consumer Clarity" | "Platform Policy Fit";

export interface Campaign {
  id: string;
  name: string;
  industry: string;
  platform: string;
  risk: RiskLevel;
  score: number;
  updatedAt: string;
  description: string;
  adCopy: string;
  landingPageText: string;
  disclaimer: string;
}

export interface ComplianceIssue {
  id: string;
  title: string;
  detail: string;
  severity: RiskLevel;
  clause: string;
  category: IssueCategory;
  /** Points deducted from the category by this issue. */
  impact: number;
  /** The phrase that triggered the rule, where one was matched. */
  matched?: string;
  recommendation: string;
}

export interface ComplianceReport {
  id: string;
  campaignId: string;
  campaignName: string;
  industry: string;
  platform: string;
  score: number;
  risk: RiskLevel;
  createdAt: string;
  breakdown: { label: string; score: number }[];
  issues: ComplianceIssue[];
  recommendations: string[];
  timeline: { label: string; time: string }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "report" | "score" | "alert";
  time: string;
  read: boolean;
}

export const INDUSTRIES = ["Financial Services", "Healthcare", "Legal", "Gambling"];
export const PLATFORMS = ["Google Ads", "Meta Ads", "TikTok", "Website", "Email"];

export const campaigns: Campaign[] = [
  {
    id: "cmp-1041",
    name: "Q3 High-Yield Savings Launch",
    industry: "Financial Services",
    platform: "Google Ads",
    risk: "Low",
    score: 94,
    updatedAt: "2026-07-21",
    description: "Search campaign promoting a 4.6% APY savings product to new retail customers.",
    adCopy: "Earn 4.6% APY on your savings. Open an account in under 3 minutes.",
    landingPageText: "Variable rate accurate as of publication. Terms apply.",
    disclaimer: "Rates variable and subject to change. Deposit protection limits apply.",
  },
  {
    id: "cmp-1039",
    name: "Telehealth Autumn Awareness",
    industry: "Healthcare",
    platform: "Meta Ads",
    risk: "Medium",
    score: 78,
    updatedAt: "2026-07-19",
    description: "Awareness campaign for a remote GP consultation service.",
    adCopy: "Skip the waiting room — talk to a licensed doctor in minutes.",
    landingPageText: "Consultations delivered by registered clinicians.",
    disclaimer: "Not a substitute for emergency care.",
  },
  {
    id: "cmp-1036",
    name: "Injury Claims Retargeting",
    industry: "Legal",
    platform: "Website",
    risk: "Critical",
    score: 52,
    updatedAt: "2026-07-16",
    description: "Retargeting banner set for personal injury claim intake.",
    adCopy: "Guaranteed compensation for your accident claim — no win, no fee!",
    landingPageText: "Thousands of claims settled every year.",
    disclaimer: "",
  },
  {
    id: "cmp-1032",
    name: "Weekend Free Spins Promo",
    industry: "Gambling",
    platform: "TikTok",
    risk: "Critical",
    score: 47,
    updatedAt: "2026-07-14",
    description: "Short-form video promo offering 50 free spins on weekend deposits.",
    adCopy: "Deposit today and win big with 50 free spins!",
    landingPageText: "Offer available to new players only.",
    disclaimer: "18+",
  },
  {
    id: "cmp-1028",
    name: "Pension Transfer Explainer",
    industry: "Financial Services",
    platform: "Email",
    risk: "Low",
    score: 91,
    updatedAt: "2026-07-11",
    description: "Educational email sequence explaining pension consolidation options.",
    adCopy: "Understand your pension options before you consolidate.",
    landingPageText: "Educational content only — not personal financial advice.",
    disclaimer: "Capital at risk. Past performance is not a guide to future performance.",
  },
  {
    id: "cmp-1024",
    name: "Dental Whitening Spring Offer",
    industry: "Healthcare",
    platform: "Meta Ads",
    risk: "High",
    score: 72,
    updatedAt: "2026-07-08",
    description: "Seasonal offer for a cosmetic dentistry clinic.",
    adCopy: "A brighter smile in one visit — 30% off this spring.",
    landingPageText: "Results vary by patient.",
    disclaimer: "Individual results may vary.",
  },
  {
    id: "cmp-1019",
    name: "SME Business Loan Prospecting",
    industry: "Financial Services",
    platform: "Google Ads",
    risk: "High",
    score: 68,
    updatedAt: "2026-07-04",
    description: "Prospecting campaign for unsecured SME lending up to 250k.",
    adCopy: "Fast business funding, decisions in 24 hours.",
    landingPageText: "Subject to credit assessment.",
    disclaimer: "",
  },
];

export const reports: ComplianceReport[] = [
  {
    id: "rep-8842",
    campaignId: "cmp-1041",
    campaignName: "Q3 High-Yield Savings Launch",
    industry: "Financial Services",
    platform: "Google Ads",
    score: 94,
    risk: "Low",
    createdAt: "2026-07-21",
    breakdown: [
      { label: "Claim Substantiation", score: 93 },
      { label: "Disclosure Completeness", score: 96 },
      { label: "Consumer Clarity", score: 92 },
      { label: "Platform Policy Fit", score: 100 },
    ],
    issues: [
      {
        id: "rate-variability-placement",
        title: "Rate variability wording could be clearer",
        detail: "The variable-rate note appears only in the landing page footer.",
        severity: "Low",
        clause: "FCA COBS 4.2 — financial promotions must give a balanced view of risk",
        category: "Disclosure Completeness",
        impact: 4,
        matched: "Variable rate accurate as of publication",
        recommendation: "Repeat the variable-rate note in the advertisement copy itself.",
      },
    ],
    recommendations: [
      "Repeat the variable-rate note in the ad copy itself.",
      "Increase disclaimer font size on mobile breakpoints.",
    ],
    timeline: [
      { label: "Campaign created", time: "2026-07-19 09:14" },
      { label: "Compliance check run", time: "2026-07-21 11:02" },
      { label: "Report generated", time: "2026-07-21 11:03" },
    ],
  },
  {
    id: "rep-8830",
    campaignId: "cmp-1039",
    campaignName: "Telehealth Autumn Awareness",
    industry: "Healthcare",
    platform: "Meta Ads",
    score: 78,
    risk: "Medium",
    createdAt: "2026-07-19",
    breakdown: [
      { label: "Claim Substantiation", score: 76 },
      { label: "Disclosure Completeness", score: 71 },
      { label: "Consumer Clarity", score: 84 },
      { label: "Platform Policy Fit", score: 100 },
    ],
    issues: [
      {
        id: "implied-speed-claim",
        title: "Implied speed-of-care claim",
        detail: '"in minutes" implies a guaranteed wait time that is not substantiated.',
        severity: "Medium",
        clause: "CAP Code 3.7 — marketers must hold evidence to prove their claims",
        category: "Claim Substantiation",
        impact: 18,
        matched: "in minutes",
        recommendation: "Qualify the wait-time claim with typical response times.",
      },
      {
        id: "missing-registration-reference",
        title: "Missing clinician registration reference",
        detail: "Regulator registration details are not surfaced in the creative.",
        severity: "Low",
        clause: "CAP Code Section 12 — medicines, medical devices, health and beauty",
        category: "Disclosure Completeness",
        impact: 9,
        recommendation: "Add the clinician registration body and reference number.",
      },
    ],
    recommendations: [
      "Qualify the wait-time claim with typical response times.",
      "Add clinician registration body and reference number.",
      "Move the emergency-care disclaimer above the fold.",
    ],
    timeline: [
      { label: "Campaign created", time: "2026-07-18 16:22" },
      { label: "Compliance check run", time: "2026-07-19 10:05" },
      { label: "Report generated", time: "2026-07-19 10:06" },
    ],
  },
  {
    id: "rep-8815",
    campaignId: "cmp-1036",
    campaignName: "Injury Claims Retargeting",
    industry: "Legal",
    platform: "Website",
    score: 52,
    risk: "Critical",
    createdAt: "2026-07-16",
    breakdown: [
      { label: "Claim Substantiation", score: 40 },
      { label: "Disclosure Completeness", score: 38 },
      { label: "Consumer Clarity", score: 78 },
      { label: "Platform Policy Fit", score: 100 },
    ],
    issues: [
      {
        id: "legal-guaranteed-outcome",
        title: "Guaranteed legal outcome",
        detail: '"Guaranteed compensation" cannot be substantiated for legal services.',
        severity: "Critical",
        clause: "CAP Code 3.1 / SRA Code of Conduct — publicity must not be misleading",
        category: "Claim Substantiation",
        impact: 60,
        matched: "Guaranteed compensation",
        recommendation:
          "Remove the guarantee and state that outcomes depend on the circumstances of each case.",
      },
      {
        id: "legal-fee-clarity",
        title: "Unclear fee or charging information",
        detail: "No fee-structure or eligibility disclaimer is present.",
        severity: "Medium",
        clause: "CAP Code 3.9 / SRA Transparency Rules — costs information must be clear",
        category: "Disclosure Completeness",
        impact: 25,
        matched: "no win, no fee",
        recommendation:
          "State the success fee or deduction that applies and any costs the client could still owe.",
      },
    ],
    recommendations: [
      "Remove outcome guarantees entirely.",
      "Add a full no-win-no-fee cost disclosure.",
      "State eligibility criteria in plain language.",
    ],
    timeline: [
      { label: "Campaign created", time: "2026-07-15 12:31" },
      { label: "Compliance check run", time: "2026-07-16 08:44" },
      { label: "Report generated", time: "2026-07-16 08:45" },
    ],
  },
  {
    id: "rep-8802",
    campaignId: "cmp-1028",
    campaignName: "Pension Transfer Explainer",
    industry: "Financial Services",
    platform: "Email",
    score: 91,
    risk: "Low",
    createdAt: "2026-07-11",
    breakdown: [
      { label: "Claim Substantiation", score: 90 },
      { label: "Disclosure Completeness", score: 93 },
      { label: "Consumer Clarity", score: 88 },
      { label: "Platform Policy Fit", score: 100 },
    ],
    issues: [
      {
        id: "advice-boundary-wording",
        title: "Advice boundary wording",
        detail: "Educational framing should be repeated in the email preheader.",
        severity: "Low",
        clause: "FCA COBS 4.2 — financial promotions must be fair, clear and not misleading",
        category: "Consumer Clarity",
        impact: 12,
        matched: "not personal financial advice",
        recommendation: 'Add "educational only" to the preheader text.',
      },
    ],
    recommendations: [
      'Add "educational only" to the preheader text.',
      "Link to the full risk warning in every message of the sequence.",
    ],
    timeline: [
      { label: "Campaign created", time: "2026-07-09 14:02" },
      { label: "Compliance check run", time: "2026-07-11 09:20" },
      { label: "Report generated", time: "2026-07-11 09:21" },
    ],
  },
];

export const dashboardStats = {
  totalCampaigns: 24,
  lowRisk: 15,
  highRisk: 6,
  criticalRisk: 3,
  averageScore: 81,
  hoursSaved: 46,
};

export const scoreTrend = [
  { month: "Feb", score: 63 },
  { month: "Mar", score: 68 },
  { month: "Apr", score: 71 },
  { month: "May", score: 76 },
  { month: "Jun", score: 79 },
  { month: "Jul", score: 84 },
];

export const recentActivity = [
  { id: "a1", text: "Q3 High-Yield Savings Launch scored 94% — low risk", time: "2 hours ago" },
  {
    id: "a2",
    text: "Compliance report generated for Telehealth Autumn Awareness",
    time: "6 hours ago",
  },
  { id: "a3", text: "Injury Claims Retargeting flagged as critical risk", time: "Yesterday" },
  { id: "a4", text: "Compliance score updated for Weekend Free Spins Promo", time: "2 days ago" },
  {
    id: "a5",
    text: "Pension Transfer Explainer archived to compliance history",
    time: "4 days ago",
  },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "Low risk result",
    message: "Q3 High-Yield Savings Launch reached a 94% compliance score with no major issues.",
    type: "score",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n2",
    title: "Compliance report generated",
    message: "Report rep-8830 is ready for Telehealth Autumn Awareness.",
    type: "report",
    time: "6 hours ago",
    read: false,
  },
  {
    id: "n3",
    title: "Compliance score updated",
    message: "Weekend Free Spins Promo dropped to 47% after a disclaimer change.",
    type: "score",
    time: "1 day ago",
    read: true,
  },
  {
    id: "n4",
    title: "Critical risk detected",
    message: "Injury Claims Retargeting contains a prohibited outcome guarantee.",
    type: "alert",
    time: "3 days ago",
    read: true,
  },
  {
    id: "n5",
    title: "Compliance report generated",
    message: "Report rep-8802 archived for Pension Transfer Explainer.",
    type: "report",
    time: "1 week ago",
    read: true,
  },
];

const CAMPAIGNS_STORAGE_KEY = "complystep_campaigns_v1";
const REPORTS_STORAGE_KEY = "complystep_reports_v1";

export function getCampaigns(): Campaign[] {
  if (typeof window === "undefined") return campaigns;
  try {
    const stored = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* fall back to the seeded campaigns below */
  }
  return campaigns;
}

export function saveCampaign(newCampaign: Campaign): void {
  const current = getCampaigns();
  const updated = [newCampaign, ...current.filter((c) => c.id !== newCampaign.id)];
  const idx = campaigns.findIndex((c) => c.id === newCampaign.id);
  if (idx >= 0) {
    campaigns[idx] = newCampaign;
  } else {
    campaigns.unshift(newCampaign);
  }
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      /* storage unavailable — in-memory list above still reflects the change */
    }
  }
}

export function deleteCampaign(id: string): void {
  const current = getCampaigns();
  const updated = current.filter((c) => c.id !== id);
  const idx = campaigns.findIndex((c) => c.id === id);
  if (idx >= 0) {
    campaigns.splice(idx, 1);
  }
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      /* storage unavailable — in-memory list above still reflects the change */
    }
  }
}

export function getReports(): ComplianceReport[] {
  if (typeof window === "undefined") return reports;
  try {
    const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* fall back to the seeded reports below */
  }
  return reports;
}

export function saveReport(newReport: ComplianceReport): void {
  const current = getReports();
  const updated = [newReport, ...current.filter((r) => r.id !== newReport.id)];
  const idx = reports.findIndex((r) => r.id === newReport.id);
  if (idx >= 0) {
    reports[idx] = newReport;
  } else {
    reports.unshift(newReport);
  }
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      /* storage unavailable — in-memory list above still reflects the change */
    }
  }
}
