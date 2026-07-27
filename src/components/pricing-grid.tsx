import { Check, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { PricingPlan } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingGrid({ plans }: { plans: PricingPlan[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={cn(
            "relative flex flex-col rounded-3xl border border-border/70 bg-card p-7 transition-shadow",
            plan.highlight && "border-primary/40 shadow-elevated ring-1 ring-primary/20",
          )}
        >
          {plan.highlight && (
            <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-brand-gradient px-3 py-1 text-[11px] font-semibold text-primary-foreground">
              <Sparkles className="size-3" /> Most popular
            </span>
          )}
          <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
          <p className="mt-2 min-h-10 text-sm text-muted-foreground">{plan.tagline}</p>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold">{plan.price}</span>
            <span className="text-sm text-muted-foreground">{plan.cadence}</span>
          </div>
          <ul className="mt-6 flex-1 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>
          <Button
            asChild
            variant={plan.highlight ? "hero" : "outline"}
            className="mt-7"
            size="lg"
          >
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
