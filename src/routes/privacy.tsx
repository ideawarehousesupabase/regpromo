import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | ComplyStep" },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <PublicLayout>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary" /> Legal
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Last updated July 2026. ComplyStep is committed to protecting personal data in line with UK GDPR and the Data Protection Act 2018. We do not sell personal data, and it is shared only with sub-processors required to run the platform. Contact hello@regpromolens.co.uk to exercise your data rights.
          </p>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to="/contact">Questions? Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
