import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, Search, Scale } from "lucide-react";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | ComplyStep" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="About Us"
        title="Turning regulatory complexity into compliance equity."
        subtitle="ComplyStep is an AI compliance platform built for UK regulated marketing. We help financial, healthcare, legal and gambling brands verify every campaign before it publishes, and catch drift the moment it happens after."
      />

      {/* Mission & Vision */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/70">
            <CardContent className="p-8">
              <div className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
                <span className="size-1.5 rounded-full bg-primary" /> Mission
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold">Verify, monitor, optimise.</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We help UK regulated SMEs verify, monitor and optimise every campaign, maximising conversion while eliminating regulatory violations.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardContent className="p-8">
              <div className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
                <span className="size-1.5 rounded-full bg-primary" /> Vision
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold">The standard for regulated marketing.</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                A future where every regulated brand can publish with complete compliance certainty and real-time risk prevention, at digital speed.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Value */}
        <div className="mt-20">
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary" /> What We Value
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">The principles behind the platform.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Innovation",
                icon: Lightbulb,
                desc: "Continuously refined to stay ahead of evolving FCA policy and consumer-law reform.",
              },
              {
                title: "Accuracy",
                icon: Search,
                desc: "Absolute regulatory data integrity: no unverified claims, no compliance drift.",
              },
              {
                title: "Consumer Protection",
                icon: Scale,
                desc: "Shielding vulnerable audiences from misleading or predatory promotions.",
              },
            ].map((team) => (
              <Card key={team.title} className="border-border/70 transition-shadow hover:shadow-lg">
                <CardContent className="p-8">
                  <team.icon className="mb-4 size-6 text-primary" />
                  <h3 className="font-display text-lg font-bold">{team.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {team.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Founder */}
        <div id="founder-section" className="mt-20 rounded-3xl border border-border/70 bg-card p-8 sm:p-12">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
            <span className="size-1.5 rounded-full bg-primary" /> Founder
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Meet Janki Rathod.</h2>
          
          <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              JR
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Janki Rathod</h3>
              <p className="text-sm font-semibold text-primary">Founder & CEO, ComplyStep</p>
            </div>
          </div>
          
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground leading-relaxed">
            Janki brings over 11 years of senior digital marketing experience across PPC, SEO and SMO, alongside an MSc in Data Science and postgraduate research in NLP and sentiment analysis. That dual background of hands-on campaign execution and applied machine learning is exactly what informs ComplyStep's compliance engine.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
