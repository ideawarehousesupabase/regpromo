import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { PricingGrid } from "@/components/pricing-grid";
import { pricingPlans } from "@/data/pricing";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — RegPromo Lens Compliance Plans" },
      {
        name: "description",
        content:
          "Compliance Core, Performance Architect and Enterprise Sovereign plans for AI-assisted campaign compliance verification.",
      },
      { property: "og:title", content: "Pricing — RegPromo Lens" },
      {
        property: "og:description",
        content: "Three plans for regulated marketing teams, from first validation to enterprise scale.",
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Pricing"
        title="Plans that scale with campaign volume"
        subtitle="Feature comparison only — this prototype contains no billing, subscriptions or payment processing."
      />
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <PricingGrid plans={pricingPlans} />
        <p className="mt-10 text-center text-sm text-muted-foreground">
          All plans include the four-step workflow: create campaign, run compliance check, review
          the AI report, publish confidently.
        </p>
      </section>
    </PublicLayout>
  );
}
