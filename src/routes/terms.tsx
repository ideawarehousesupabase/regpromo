import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | ComplyStep" },
    ],
  }),
  component: TermsOfService,
});

function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Last updated July 2026. These Terms govern use of ComplyStep by UK regulated firms and authorised staff. Plans are billed monthly or annually per the tier selected. ComplyStep provides compliance recommendations as decision support; final publishing decisions remain the operator's responsibility. Either party may terminate with 30 days' written notice.
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
