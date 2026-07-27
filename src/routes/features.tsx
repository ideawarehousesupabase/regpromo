import { createFileRoute } from "@tanstack/react-router";
import {
  Brain,
  ClipboardCheck,
  FileText,
  History,
  ShieldAlert,
} from "lucide-react";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — RegPromo Lens Campaign Compliance Platform" },
      {
        name: "description",
        content:
          "AI compliance analysis, campaign validation, compliance reports, risk detection and full compliance history for regulated marketing teams.",
      },
      { property: "og:title", content: "Features — RegPromo Lens" },
      {
        property: "og:description",
        content:
          "See how RegPromo Lens analyses campaigns, detects risk and produces exportable compliance reports.",
      },
    ],
  }),
  component: Features,
});

const features = [
  {
    icon: Brain,
    title: "AI Compliance Analysis",
    body: "Ad copy, landing page text and disclaimers are analysed against the advertising rules that apply to your sector and channel. Every finding is tied back to the rule that produced it, so the result is explainable rather than a black-box verdict.",
    points: [
      "Sector-aware analysis across financial services, healthcare, legal and gambling",
      "Channel-aware checks for Google Ads, Meta Ads, TikTok, website and email",
      "Weighted compliance score from 0–100",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Campaign Validation",
    body: "A campaign is validated as a single object rather than as loose fragments of copy, so mismatches between the ad, the landing page and the disclaimer are caught before publication.",
    points: [
      "Structured campaign record with industry and platform",
      "Draft and check states with clear approval status",
      "Re-run a check after edits and compare the outcome",
    ],
  },
  {
    icon: FileText,
    title: "Compliance Reports",
    body: "Every check produces a report you can read, share and export: score, risk breakdown, issues, recommendations and a timeline of what happened when.",
    points: ["Category-level risk breakdown", "Clause references for each issue", "PDF export"],
  },
  {
    icon: ShieldAlert,
    title: "Risk Detection",
    body: "Missing disclaimers, guaranteed-outcome claims, unsubstantiated performance wording and vulnerable-audience risks are surfaced with a severity level.",
    points: ["Low / Medium / High severity per issue", "Overall campaign risk level", "Highest-risk campaigns pinned on the dashboard"],
  },
  {
    icon: History,
    title: "Compliance History",
    body: "All previous reports remain accessible, so you can show what was checked, when, and what the result was — long after the campaign has ended.",
    points: ["Chronological report archive", "Score trend over time", "Per-campaign check history"],
  },
];

function Features() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Features"
        title="Everything a regulated campaign needs before launch"
        subtitle="A focused feature set built around one job: getting marketing campaigns verified quickly and consistently."
      />

      <section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-16 sm:px-6">
        {features.map((f) => (
          <Card key={f.title} className="border-border/70">
            <CardContent className="grid gap-6 p-7 md:grid-cols-[auto_1fr]">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient">
                <f.icon className="size-6 text-primary-foreground" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold">{f.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{f.body}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                  {f.points.map((p) => (
                    <li
                      key={p}
                      className="rounded-xl bg-secondary/60 px-3 py-2 text-xs text-secondary-foreground"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </PublicLayout>
  );
}
