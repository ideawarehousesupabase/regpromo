import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { pricingPlans } from "@/data/pricing";

export const Route = createFileRoute("/pricing")({
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
          {pricingPlans.map((plan, i) => {
            const categories = ["Foundation", "Growth", "Corporate"];
            const isGrowth = plan.highlight;
            
            return (
              <div
                key={plan.name}
                className={`flex flex-col rounded-3xl p-8 ${
                  isGrowth
                    ? "relative border-2 border-primary bg-card shadow-elevated"
                    : "border border-border/70 bg-card shadow-sm"
                }`}
              >
                {isGrowth && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-primary-foreground uppercase shadow-sm">
                    Most Popular
                  </div>
                )}
                <span
                  className={`text-sm font-semibold tracking-wide uppercase ${
                    isGrowth ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {categories[i]}
                </span>
                <h3 className="mt-2 font-display text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                  {plan.price}
                  <span className="ml-1 text-xl font-medium text-muted-foreground">
                    {plan.cadence === "per month" ? "/mo" : plan.cadence === "annual agreement" ? "/yr" : plan.cadence}
                  </span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{plan.tagline}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm">
                      <Check
                        className={`size-5 shrink-0 ${isGrowth ? "text-primary" : "text-success"}`}
                      />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-8"
                  variant={isGrowth ? "hero" : "outline"}
                >
                  <Link to="/contact">
                    {plan.name === "Enterprise Sovereign" ? "Talk to Sales" : "Get Started"}
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Onboarding from £500 one-time · Regulatory Health Diagnostics from £550 one-time
        </p>
      </section>

    </PublicLayout>
  );
}
