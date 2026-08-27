import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/regulatory-compliance")({
  head: () => ({
    meta: [
      { title: "Regulatory Compliance | ComplyStep" },
    ],
  }),
  component: RegulatoryCompliance,
});

function RegulatoryCompliance() {
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
            Regulatory Compliance
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            ComplyStep helps UK regulated marketers stay aligned with FCA, CAP, ASA and DMCC Act requirements. Every approval decision is logged with a timestamped, exportable audit trail, ready for regulator enquiries, though the operator remains legally responsible for final publishing decisions.
          </p>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to="/contact">Ask About Compliance Features</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
