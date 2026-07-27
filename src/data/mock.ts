export type RiskLevel = "Low" | "Medium" | "High";
export type CampaignStatus = "Approved" | "Pending Review" | "Needs Revision" | "Draft";

export interface Campaign {
  id: string;
  name: string;
  industry: string;
  platform: string;
  status: CampaignStatus;
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
}

export interface ComplianceReport {
  id: string;
  campaignId: string;
  campaignName: string;
  industry: string;
  platform: string;
  score: number;
  risk: RiskLevel;
  status: CampaignStatus;
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
  type: "approval" | "report" | "score" | "alert";
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
    status: "Approved",
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
    status: "Pending Review",
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
    status: "Needs Revision",
    risk: "High",
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
    status: "Needs Revision",
    risk: "High",
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
    status: "Approved",
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
    status: "Pending Review",
    risk: "Medium",
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
    status: "Draft",
    risk: "Medium",
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
    status: "Approved",
    createdAt: "2026-07-21",
    breakdown: [
      { label: "Disclosure completeness", score: 96 },
      { label: "Claim substantiation", score: 93 },
      { label: "Consumer clarity", score: 92 },
      { label: "Platform policy fit", score: 95 },
    ],
    issues: [
      {
        id: "i1",
        title: "Rate variability wording could be clearer",
        detail: "The variable-rate note appears only in the landing page footer.",
        severity: "Low",
        clause: "Financial promotions — fair, clear and not misleading",
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
      { label: "Approved for publishing", time: "2026-07-21 15:40" },
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
    status: "Pending Review",
    createdAt: "2026-07-19",
    breakdown: [
      { label: "Disclosure completeness", score: 71 },
      { label: "Claim substantiation", score: 76 },
      { label: "Consumer clarity", score: 84 },
      { label: "Platform policy fit", score: 80 },
    ],
    issues: [
      {
        id: "i1",
        title: "Implied speed-of-care claim",
        detail: "\"in minutes\" implies a guaranteed wait time that is not substantiated.",
        severity: "Medium",
        clause: "Health advertising — substantiation of performance claims",
      },
      {
        id: "i2",
        title: "Missing clinician registration reference",
        detail: "Regulator registration details are not surfaced in the creative.",
        severity: "Low",
        clause: "Healthcare provider identification",
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
    risk: "High",
    status: "Needs Revision",
    createdAt: "2026-07-16",
    breakdown: [
      { label: "Disclosure completeness", score: 38 },
      { label: "Claim substantiation", score: 44 },
      { label: "Consumer clarity", score: 61 },
      { label: "Platform policy fit", score: 65 },
    ],
    issues: [
      {
        id: "i1",
        title: "Absolute guarantee of outcome",
        detail: "\"Guaranteed compensation\" cannot be substantiated for legal services.",
        severity: "High",
        clause: "Legal services advertising — prohibited guarantees",
      },
      {
        id: "i2",
        title: "Missing disclaimer",
        detail: "No fee-structure or eligibility disclaimer is present.",
        severity: "High",
        clause: "Mandatory consumer disclosure",
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
      { label: "Returned for revision", time: "2026-07-16 09:10" },
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
    status: "Approved",
    createdAt: "2026-07-11",
    breakdown: [
      { label: "Disclosure completeness", score: 93 },
      { label: "Claim substantiation", score: 90 },
      { label: "Consumer clarity", score: 88 },
      { label: "Platform policy fit", score: 93 },
    ],
    issues: [
      {
        id: "i1",
        title: "Advice boundary wording",
        detail: "Educational framing should be repeated in the email preheader.",
        severity: "Low",
        clause: "Advice vs. guidance boundary",
      },
    ],
    recommendations: [
      "Add \"educational only\" to the preheader text.",
      "Link to the full risk warning in every message of the sequence.",
    ],
    timeline: [
      { label: "Campaign created", time: "2026-07-09 14:02" },
      { label: "Compliance check run", time: "2026-07-11 09:20" },
      { label: "Report generated", time: "2026-07-11 09:21" },
      { label: "Approved for publishing", time: "2026-07-11 12:00" },
    ],
  },
];

export const dashboardStats = {
  totalCampaigns: 24,
  approvedCampaigns: 15,
  pendingReview: 6,
  highRisk: 3,
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
  { id: "a1", text: "Q3 High-Yield Savings Launch approved for publishing", time: "2 hours ago" },
  { id: "a2", text: "Compliance report generated for Telehealth Autumn Awareness", time: "6 hours ago" },
  { id: "a3", text: "Injury Claims Retargeting returned for revision", time: "Yesterday" },
  { id: "a4", text: "Compliance score updated for Weekend Free Spins Promo", time: "2 days ago" },
  { id: "a5", text: "Pension Transfer Explainer archived to compliance history", time: "4 days ago" },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "Campaign approved",
    message: "Q3 High-Yield Savings Launch reached a 94% compliance score and is cleared to publish.",
    type: "approval",
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
    title: "High risk detected",
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

/** Deterministic mock "AI" analysis used by the Run Compliance Check flow. */
export function buildMockAnalysis(input: {
  name: string;
  industry: string;
  platform: string;
  adCopy: string;
  disclaimer: string;
}) {
  const risky = /guarantee|risk[- ]free|win big|instant|best ever|no risk/i;
  let score = 91;
  const issues: ComplianceIssue[] = [];

  if (!input.disclaimer.trim()) {
    score -= 22;
    issues.push({
      id: "missing-disclaimer",
      title: "Missing disclaimer",
      detail: "No mandatory consumer disclaimer was supplied for this campaign.",
      severity: "High",
      clause: "Mandatory consumer disclosure",
    });
  } else if (input.disclaimer.trim().length < 40) {
    score -= 8;
    issues.push({
      id: "thin-disclaimer",
      title: "Disclaimer lacks detail",
      detail: "The disclaimer is short and may not cover all required conditions.",
      severity: "Medium",
      clause: "Mandatory consumer disclosure",
    });
  }

  if (risky.test(input.adCopy)) {
    score -= 18;
    issues.push({
      id: "absolute-claim",
      title: "Unsubstantiated promotional wording",
      detail: "The advertisement copy contains absolute or outcome-guaranteeing language.",
      severity: "High",
      clause: "Fair, clear and not misleading promotions",
    });
  }

  if (input.industry === "Gambling" || input.industry === "Legal") {
    score -= 6;
    issues.push({
      id: "sector-scrutiny",
      title: "Heightened sector scrutiny",
      detail: `${input.industry} promotions require additional vulnerability safeguards.`,
      severity: "Medium",
      clause: `${input.industry} sector advertising rules`,
    });
  }

  if (input.platform === "TikTok" || input.platform === "Meta Ads") {
    score -= 3;
    issues.push({
      id: "platform-policy",
      title: "Platform policy nuance",
      detail: `${input.platform} restricts certain regulated-sector creative formats.`,
      severity: "Low",
      clause: "Platform advertising policy",
    });
  }

  score = Math.max(28, Math.min(98, score));
  const risk: RiskLevel = score >= 85 ? "Low" : score >= 65 ? "Medium" : "High";
  const status: CampaignStatus =
    score >= 85 ? "Approved" : score >= 65 ? "Pending Review" : "Needs Revision";

  const recommendations = [
    ...(issues.some((i) => i.id.includes("disclaimer"))
      ? ["Add a complete, prominent disclaimer above the fold."]
      : []),
    ...(issues.some((i) => i.id === "absolute-claim")
      ? ["Replace guarantees with qualified, evidence-backed language."]
      : []),
    "Simplify language to improve consumer understanding.",
    "Keep a versioned record of substantiation for every claim.",
  ];

  return {
    score,
    risk,
    status,
    issues,
    recommendations,
    breakdown: [
      { label: "Disclosure completeness", score: Math.max(20, score - 5) },
      { label: "Claim substantiation", score: Math.min(99, score + 2) },
      { label: "Consumer clarity", score: Math.max(25, score - 2) },
      { label: "Platform policy fit", score: Math.min(99, score + 4) },
    ],
  };
}

const CAMPAIGNS_STORAGE_KEY = "regpromo_campaigns_v1";
const REPORTS_STORAGE_KEY = "regpromo_reports_v1";

export function getCampaigns(): Campaign[] {
  if (typeof window === "undefined") return campaigns;
  try {
    const stored = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
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
    } catch {}
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
    } catch {}
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
  } catch {}
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
    } catch {}
  }
}
