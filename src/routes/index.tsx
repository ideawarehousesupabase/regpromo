import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Gauge,
  Lightbulb,
  Rocket,
  ShieldAlert,
  Workflow,
} from "lucide-react";
import { PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pricingPlans } from "@/data/pricing";
import { PricingGrid } from "@/components/pricing-grid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RegPromo Lens — AI Compliance Checks for Marketing Campaigns" },
      {
        name: "description",
        content:
          "RegPromo Lens verifies marketing campaigns against regulatory rules before they go live, replacing slow manual compliance reviews with an AI-assisted check.",
      },
      { property: "og:title", content: "RegPromo Lens — AI Campaign Compliance Verification" },
      {
        property: "og:description",
        content:
          "Validate regulated marketing campaigns in minutes with AI-assisted compliance scoring, risk detection and publish-ready reports.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: Brain,
    title: "AI Regulation Intelligence",
    body: "A structured view of the advertising rules that apply to your sector, channel and claim type.",
  },
  {
    icon: ClipboardCheck,
    title: "Campaign Validation",
    body: "Check ad copy, landing page text and disclaimers together as one campaign object.",
  },
  {
    icon: ShieldAlert,
    title: "Compliance Checks",
    body: "Automated detection of missing disclosures, unsubstantiated claims and prohibited wording.",
  },
  {
    icon: Workflow,
    title: "Workflow Streamlining",
    body: "Move campaigns from draft to approved without waiting days for a manual legal pass.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    body: "Track compliance scores, risk mix and review turnaround across every campaign you run.",
  },
  {
    icon: Lightbulb,
    title: "Compliance Insights",
    body: "See the recurring issues in your marketing and fix them at the template level.",
  },
];

const steps = [
  { icon: FileSearch, title: "Create Campaign", body: "Add your copy, landing page text and disclaimer." },
  { icon: Gauge, title: "Run Compliance Check", body: "The engine scores the campaign against sector rules." },
  { icon: ClipboardCheck, title: "Review AI Report", body: "Read issues, risk level and suggested improvements." },
  { icon: Rocket, title: "Publish Confidently", body: "Ship with an auditable record of the check you ran." },
];

function Home() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="grid-backdrop relative overflow-hidden border-b border-border/60">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
              AI RegTech · Year 1 MVP
            </span>
            <h1 className="mt-6 text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
              Compliance clearance for campaigns,{" "}
              <span className="text-brand-gradient">before they go live</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              RegPromo Lens reviews your marketing campaigns against the rules of your regulated
              sector and returns a compliance score, risk level and fix list in minutes — not weeks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/signup">
                  Start free <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/features">Explore the product</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {[
                ["4", "regulated sectors"],
                ["5", "marketing channels"],
                ["Minutes", "not review cycles"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-bold">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroPreview />
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">The problem</h2>
            <p className="mt-4 text-muted-foreground">
              Businesses in regulated industries struggle to publish marketing campaigns quickly
              because compliance verification is still manual. Copy is emailed to legal, reviewed by
              hand against dense rulebooks, returned with comments, and rewritten — often several
              times before a single ad goes live.
            </p>
            <p className="mt-4 text-muted-foreground">
              The cost is not only delay. Manual review is inconsistent between reviewers, leaves no
              structured audit trail, and still lets avoidable breaches through.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Slow sign-off", "Campaigns wait days or weeks in a legal review queue."],
              ["Inconsistent calls", "Two reviewers reach two different conclusions."],
              ["No audit trail", "Decisions live in email threads, not records."],
              ["Costly rework", "Creative is rebuilt late, after budget is committed."],
            ].map(([t, b]) => (
              <Card key={t} className="border-border/70">
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Rules made machine-readable", "Sector and platform rules structured into checks."],
              ["One campaign object", "Ad copy, landing page and disclaimer reviewed together."],
              ["Explainable output", "Every issue points at the rule that triggered it."],
              ["Evidence by default", "Each check is stored as a report you can export."],
            ].map(([t, b]) => (
              <div key={t} className="surface-glass rounded-2xl p-5">
                <CheckCircle2 className="size-5 text-primary" />
                <h3 className="mt-3 text-sm font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">The solution</h2>
            <p className="mt-4 text-muted-foreground">
              RegPromo Lens provides AI-powered compliance verification before campaigns go live.
              You describe the campaign once; the platform analyses the creative against the
              regulations that apply to your industry and channel, then returns a compliance score,
              a risk level, the specific issues found, and the changes that would resolve them.
            </p>
            <p className="mt-4 text-muted-foreground">
              Marketing gets a fast, repeatable answer. Compliance gets a consistent, documented
              record of every decision.
            </p>
            <Button asChild variant="hero" className="mt-8">
              <Link to="/signup">
                Run your first check <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">Core features</h2>
          <p className="mt-4 text-muted-foreground">
            Everything needed to take a regulated campaign from draft to publish-ready.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="group border-border/70 transition-shadow hover:shadow-elevated">
              <CardContent className="p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-gradient">
                  <f.icon className="size-5 text-primary-foreground" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">A four-step workflow, end to end.</p>
          <ol className="mt-10 grid gap-5 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="surface-glass relative rounded-2xl p-6">
                <span className="font-display text-4xl font-bold text-primary/20">0{i + 1}</span>
                <s.icon className="mt-3 size-5 text-primary" />
                <h3 className="mt-3 font-display text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">Pricing</h2>
          <p className="mt-4 text-muted-foreground">
            Three plans covering early validation through to enterprise-scale campaign volume.
          </p>
        </div>
        <div className="mt-10">
          <PricingGrid plans={pricingPlans} />
        </div>
      </section>
    </PublicLayout>
  );
}

function HeroPreview() {
  return (
    <div className="surface-glass rounded-3xl p-5 shadow-elevated">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">Compliance report</p>
          <p className="font-display text-lg font-semibold">Q3 High-Yield Savings Launch</p>
        </div>
        <span className="rounded-full bg-success/12 px-3 py-1 text-xs font-semibold text-success">
          Approved
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          ["Score", "94%"],
          ["Risk", "Low"],
          ["Issues", "1"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-border/70 bg-background/60 p-4">
            <p className="text-[11px] text-muted-foreground uppercase">{l}</p>
            <p className="font-display text-xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {[
          ["Disclosure completeness", 96],
          ["Claim substantiation", 93],
          ["Consumer clarity", 92],
          ["Platform policy fit", 95],
        ].map(([label, value]) => (
          <div key={label as string}>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold">{value}%</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-brand-gradient"
                style={{ width: `${value as number}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-xl bg-secondary/60 p-4 text-xs text-muted-foreground">
        Recommendation: repeat the variable-rate note in the ad copy itself and increase disclaimer
        size on mobile.
      </p>
    </div>
  );
}
