import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/casestudy")({
  head: () => ({
    meta: [
      { title: "Case Study & Roadmap | ComplyStep" },
    ],
  }),
  component: CaseStudy,
});

function CaseStudy() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Case Study"
        title="An 8-week London pilot, proven results."
        subtitle="ComplyStep ran an 8-week pilot across 5 regulated business locations in London, testing live campaigns from financial advisors, private clinics and boutique agencies."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border/70 bg-border/70 sm:grid-cols-4">
          {[
            ["28%", "Faster campaign launch"],
            ["18%", "Fewer compliance violations"],
            ["14 days", "To publishing proficiency"],
            ["4.3/5", "Compliance equity rating"],
          ].map(([v, l]) => (
            <div key={l} className="bg-card py-12 text-center">
              <dt className="font-display text-4xl font-bold text-primary sm:text-5xl">{v}</dt>
              <dd className="mt-3 text-sm font-medium text-muted-foreground">{l}</dd>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6">
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary" /> Roadmap
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">From pilot to national standard.</h2>
          </div>

          <div className="relative border-l-2 border-primary/20 pl-8 space-y-12 ml-4">
            {[
              {
                year: "Year 1",
                title: "London soft launch",
                desc: "Models trained on UK-specific regulated marketing data. Closed-loop pilots run across 5 to 10 London firms and boutique agencies.",
              },
              {
                year: "Year 2",
                title: "Full UK launch",
                desc: "API connectivity ships across Google Ads, Meta and TikTok. Acquisition extends into Manchester, Birmingham and Leeds.",
              },
              {
                year: "Year 3",
                title: "National scale & EU pilots",
                desc: "Expansion into Scotland, Wales and Northern Ireland, with early pilots in Frankfurt, Paris and Amsterdam.",
              },
            ].map((phase, i) => (
              <div key={phase.year} className="relative">
                <div className="absolute -left-[41px] top-1 flex size-8 items-center justify-center rounded-full border-4 border-background bg-primary text-xs font-bold text-primary-foreground">
                  0{i + 1}
                </div>
                <h4 className="font-display text-xl font-bold">
                  {phase.year} <span className="text-muted-foreground">· {phase.title}</span>
                </h4>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
