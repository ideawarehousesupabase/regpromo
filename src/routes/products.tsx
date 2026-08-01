import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products & Pricing | ComplyStep" },
    ],
  }),
  component: Products,
});

function Products() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Products & Pricing"
        title="Plans that scale with your compliance needs."
        subtitle="Start with core creative screening. Scale into full cross-channel drift monitoring as your campaign volume grows."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        {/* Pricing Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Foundation */}
          <div className="flex flex-col rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
            <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Foundation
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold">Compliance Core</h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold">
              £100<span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Pre-publication screening for solo founders and boutique agencies.
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {[
                "Pre-publication creative screening",
                "Compliance metrics & audit logs",
                "Browser extension access",
                "Email support",
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-3 text-sm">
                  <Check className="size-5 shrink-0 text-success" />
                  {feat}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8" variant="outline">
              <Link to="/contact">Get Started</Link>
            </Button>
          </div>

          {/* Growth */}
          <div className="relative flex flex-col rounded-3xl border-2 border-primary bg-card p-8 shadow-elevated">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-primary-foreground uppercase shadow-sm">
              Most Popular
            </div>
            <span className="text-sm font-semibold tracking-wide text-primary uppercase">
              Growth
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold">Performance Architect</h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold">
              £380<span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Semantic checking and live drift detection for high-volume firms.
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {[
                "Everything in Compliance Core",
                "Consumer Understanding Engine",
                "Google & Meta Ads API integration",
                "Priority support",
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-3 text-sm">
                  <Check className="size-5 shrink-0 text-primary" />
                  {feat}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8" variant="hero">
              <Link to="/contact">Get Started</Link>
            </Button>
          </div>

          {/* Corporate */}
          <div className="flex flex-col rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
            <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Corporate
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold">Enterprise Sovereign</h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold">
              £250<span className="ml-1 text-xl font-medium text-muted-foreground">+/mo</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Multi-channel monitoring for multi-site brands and networks.
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {[
                "Everything in Performance Architect",
                "Regulatory Logic Drift Detector",
                "Secure Compliance Ledger Nodes",
                "Dedicated compliance support",
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-3 text-sm">
                  <Check className="size-5 shrink-0 text-success" />
                  {feat}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8" variant="outline">
              <Link to="/contact">Talk to Sales</Link>
            </Button>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Onboarding from £500 one-time · Regulatory Health Diagnostics from £550 one-time
        </p>
      </section>

      {/* Comparison */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary" /> Comparison
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Built for compliance, not generic content review.</h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border/70 bg-background shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/70 bg-secondary/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">Capability</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">Generic AI Tools</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">Legacy RegTech</th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">Workflow Tools</th>
                    <th className="bg-primary/5 px-6 py-4 font-bold text-primary">ComplyStep</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    {
                      label: "Pre-publication to live verification",
                      generic: { v: "✗", type: "no" },
                      legacy: { v: "Limited", type: "no" },
                      workflow: { v: "✗", type: "no" },
                      us: { v: "✓", type: "yes" },
                    },
                    {
                      label: "Predictive compliance forecasting",
                      generic: { v: "✗", type: "no" },
                      legacy: { v: "✗", type: "no" },
                      workflow: { v: "✗", type: "no" },
                      us: { v: "✓", type: "yes" },
                    },
                    {
                      label: "UK FCA / CAP / DMCC training",
                      generic: { v: "✗", type: "no" },
                      legacy: { v: "Limited", type: "no" },
                      workflow: { v: "✗", type: "no" },
                      us: { v: "✓", type: "yes" },
                    },
                    {
                      label: "Performance-linked compliance memory",
                      generic: { v: "✗", type: "no" },
                      legacy: { v: "✗", type: "no" },
                      workflow: { v: "✗", type: "no" },
                      us: { v: "✓", type: "yes" },
                    },
                    {
                      label: "SME-friendly pricing",
                      generic: { v: "Per-seat", type: "no" },
                      legacy: { v: "Enterprise-only", type: "no" },
                      workflow: { v: "Seat-based", type: "no" },
                      us: { v: "✓", type: "yes" },
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-secondary/20">
                      <td className="px-6 py-4 font-medium">{row.label}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.generic.v}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.legacy.v}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.workflow.v}</td>
                      <td className="bg-primary/5 px-6 py-4 font-bold text-success">{row.us.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
