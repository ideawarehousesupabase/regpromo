import { createFileRoute } from "@tanstack/react-router";
import { BadgePoundSterling, Stethoscope, Scale, Dice5, Megaphone, Building2 } from "lucide-react";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries | ComplyStep" },
    ],
  }),
  component: Industries,
});

function Industries() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Industries"
        title="Built for the UK's most regulated sectors."
        subtitle="Purpose-built for the SMEs currently underserved by slow, enterprise-only RegTech tools."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Financial Advisors & Wealth Managers",
              icon: BadgePoundSterling,
              desc: "Automated review against FCA Consumer Duty for every PPC, social and web promotion.",
            },
            {
              title: "Private Healthcare & Aesthetics",
              icon: Stethoscope,
              desc: "Screening for CAP and ASA rules on medical claims and dynamic creative.",
            },
            {
              title: "Legal Services",
              icon: Scale,
              desc: "Audit-ready promotional records that satisfy consumer-protection codes.",
            },
            {
              title: "Gambling & Affiliate Networks",
              icon: Dice5,
              desc: "Real-time tracking to prevent unauthorised affiliate promotional claims.",
            },
            {
              title: "Digital Marketing Agencies",
              icon: Megaphone,
              desc: "Consistent compliance management across every regulated client account.",
            },
            {
              title: "Banking & Financial Groups",
              icon: Building2,
              desc: "Centralised compliance tracking across multi-site regional teams.",
            },
          ].map((industry) => (
            <Card key={industry.title} className="group border-border/70 transition-shadow hover:shadow-lg">
              <CardContent className="p-8">
                <industry.icon className="mb-4 size-6 text-primary" />
                <h3 className="font-display text-lg font-bold">{industry.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {industry.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Market Section */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary" /> Market
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">A $45.3B global RegTech market by 2030.</h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              The global AI-in-RegTech market is forecast to grow from $15.8B in 2025 to $45.3B by 2030, at a 23.5% CAGR, with the UK the most dominant RegTech ecosystem in Europe.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/70">
              <CardContent className="p-8">
                <h4 className="font-display text-lg font-bold">Top Compliance Pain Points</h4>
                <p className="text-sm text-muted-foreground">% across UK regulated marketing teams</p>
                <div className="mt-6 flex h-64 items-end gap-4">
                  {/* Simplified mock chart representation */}
                  {[
                    { label: "Manual Review Hrs", value: 52.8 },
                    { label: "FCA Withdrawals Surge", value: 97.5 },
                    { label: "No In-House Legal", value: 80 },
                    { label: "Post-Launch Drift", value: 64.2 },
                  ].map((bar) => (
                    <div key={bar.label} className="group flex flex-1 flex-col items-center justify-end gap-2">
                      <div className="text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">{bar.value}%</div>
                      <div 
                        className="w-full rounded-t-sm bg-primary/20 transition-colors group-hover:bg-primary/40" 
                        style={{ height: `${bar.value}%` }} 
                      />
                      <div className="h-10 text-center text-[10px] leading-tight text-muted-foreground">
                        {bar.label}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/70">
              <CardContent className="p-8">
                <h4 className="font-display text-lg font-bold">Global AI-RegTech Market Growth</h4>
                <p className="text-sm text-muted-foreground">$ Billions, 2025 to 2030 (23.5% CAGR)</p>
                <div className="mt-6 flex h-64 items-center justify-center rounded-xl bg-secondary/30">
                  <p className="text-sm font-medium text-muted-foreground">
                    Market growth trend (15.8B → 45.3B)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
