import { createFileRoute } from "@tanstack/react-router";
import { Compass, Eye, Target, User } from "lucide-react";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RegPromo Lens — Mission, Vision and Values" },
      {
        name: "description",
        content:
          "RegPromo Lens was founded to remove the manual bottleneck between marketing teams and compliance approval in regulated industries.",
      },
      { property: "og:title", content: "About RegPromo Lens" },
      {
        property: "og:description",
        content: "The mission, vision and values behind AI-assisted campaign compliance verification.",
      },
    ],
  }),
  component: About,
});

const values = [
  { title: "Explainability first", body: "Every finding must point at the rule behind it. No unexplained verdicts." },
  { title: "Speed with rigour", body: "Faster approval is only worth having if the check is genuinely defensible." },
  { title: "Evidence by default", body: "Every check leaves an auditable record, automatically." },
  { title: "Plain language", body: "Compliance output should be readable by marketers, not only by lawyers." },
];

function About() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="About"
        title="Built for the gap between marketing speed and compliance certainty"
        subtitle="RegPromo Lens is an AI RegTech product for teams that advertise in regulated industries."
      />

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <Card className="border-border/70">
          <CardContent className="grid gap-6 p-8 md:grid-cols-[auto_1fr]">
            <span className="grid size-14 place-items-center rounded-2xl bg-brand-gradient">
              <User className="size-7 text-primary-foreground" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-semibold">Founder</h2>
              <p className="mt-3 text-muted-foreground">
                RegPromo Lens was founded by a compliance and marketing technology practitioner who
                spent years watching campaigns stall in review queues. The founding insight was
                simple: most compliance rejections are repeat offences — the same missing
                disclaimer, the same unprovable claim — and repeat problems can be detected before a
                human reviewer ever opens the file.
              </p>
              <p className="mt-3 text-muted-foreground">
                The company is in its Year 1 product validation phase, focused on proving the core
                workflow with marketing teams in financial services, healthcare, legal and gambling.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="border-border/70">
            <CardContent className="p-7">
              <Target className="size-6 text-primary" />
              <h2 className="mt-4 font-display text-xl font-semibold">Mission</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                To make regulatory compliance a fast, routine step in the marketing workflow rather
                than a bottleneck at the end of it — so regulated businesses can publish confidently
                and consumers see clearer, fairer advertising.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardContent className="p-7">
              <Eye className="size-6 text-primary" />
              <h2 className="mt-4 font-display text-xl font-semibold">Vision</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                A market where every regulated campaign is verified against its rules before it
                reaches an audience, and where compliance evidence is produced automatically as a
                by-product of doing the work.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-3">
            <Compass className="size-5 text-primary" />
            <h2 className="font-display text-2xl font-semibold">Core values</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="surface-glass rounded-2xl p-6">
                <h3 className="font-display text-base font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
