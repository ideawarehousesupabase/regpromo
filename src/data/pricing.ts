export interface PricingPlan {
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  highlight?: boolean;
  features: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "Compliance Core",
    tagline: "For small marketing teams validating their first regulated campaigns.",
    price: "£149",
    cadence: "per month",
    features: [
      "Up to 25 campaign compliance checks per month",
      "AI regulation intelligence across 4 regulated sectors",
      "Standard compliance report with score and risk level",
      "Issue detection and plain-language recommendations",
      "90-day compliance history",
      "Single workspace, email support",
    ],
  },
  {
    name: "Performance Architect",
    tagline: "For growing brands publishing across multiple regulated channels.",
    price: "£449",
    cadence: "per month",
    highlight: true,
    features: [
      "Up to 150 campaign compliance checks per month",
      "Sector and platform-specific rule coverage",
      "Detailed risk breakdown with clause-level references",
      "Suggested improvements and rewrite guidance",
      "Analytics and reporting dashboard",
      "Unlimited compliance history and PDF export",
      "Priority support",
    ],
  },
  {
    name: "Enterprise Sovereign",
    tagline: "For regulated enterprises with high campaign volume and audit needs.",
    price: "Custom",
    cadence: "annual agreement",
    features: [
      "Unlimited campaign compliance checks",
      "Custom regulation libraries per business unit",
      "Full audit trail and evidence retention",
      "Advanced compliance insights and benchmarking",
      "Dedicated onboarding and compliance advisory",
      "Data residency and security review support",
    ],
  },
];
