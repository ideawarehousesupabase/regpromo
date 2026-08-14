export interface SocialIntegration {
  id: string;
  name: string;
  category: string;
  description: string;
}

/**
 * The ad/social platforms ComplyStep's "Unified Advertising Integration
 * Suite" is scoped to connect with, per the business plan. These are UI
 * previews only in this prototype — no live platform connection exists yet.
 */
export const socialIntegrations: SocialIntegration[] = [
  {
    id: "google-ads",
    name: "Google Ads",
    category: "Search & Display Advertising",
    description:
      "Monitor live search and display ad copy for compliance drift the moment it changes.",
  },
  {
    id: "meta-ads",
    name: "Meta Ads Manager",
    category: "Facebook & Instagram",
    description:
      "Detect unauthorized creative or disclaimer edits on live Facebook and Instagram campaigns.",
  },
  {
    id: "tiktok",
    name: "TikTok Business Center",
    category: "Short-Form Video Advertising",
    description:
      "Track dynamic creative variations and affiliate edits across TikTok ad campaigns.",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "Marketing CMS & Landing Pages",
    description: "Sync approved landing page copy and disclaimers with your published site.",
  },
];
