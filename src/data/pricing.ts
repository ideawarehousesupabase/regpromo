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
    tagline: "Pre-publication screening for solo founders and boutique agencies.",
    price: "£100",
    cadence: "per month",
    features: [
      "Pre-publication creative screening",
      "Compliance metrics & audit logs",
      "Browser extension access",
      "Email support",
    ],
  },
  {
    name: "Performance Architect",
    tagline: "Semantic checking and live drift detection for high-volume firms.",
    price: "£380",
    cadence: "per month",
    highlight: true,
    features: [
      "Everything in Compliance Core",
      "Consumer Understanding Engine",
      "Google & Meta Ads API integration",
      "Priority support",
    ],
  },
  {
    name: "Enterprise Sovereign",
    tagline: "Multi-channel monitoring for multi-site brands and networks.",
    price: "£250",
    cadence: "+/mo",
    features: [
      "Everything in Performance Architect",
      "Regulatory Logic Drift Detector",
      "Secure Compliance Ledger Nodes",
      "Dedicated compliance support",
    ],
  },
];
