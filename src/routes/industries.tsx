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


    </PublicLayout>
  );
}
