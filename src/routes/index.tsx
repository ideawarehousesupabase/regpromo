import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileSearch,
  Megaphone,
  RadioTower,
  ShieldCheck,
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";
import { PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ComplyStep — AI Compliance Checks for Marketing Campaigns" },
      {
        name: "description",
        content:
          "ComplyStep verifies marketing campaigns against regulatory rules before they go live, replacing slow manual compliance reviews with an AI-assisted check.",
      },
      { property: "og:title", content: "ComplyStep — AI Campaign Compliance Verification" },
      {
        property: "og:description",
        content:
          "Validate regulated marketing campaigns in minutes with AI-assisted compliance scoring, risk detection and publish-ready reports.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="grid-backdrop relative overflow-hidden border-b border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            <span className="size-1.5 rounded-full bg-primary" /> AI Compliance Platform for UK Regulated Marketing
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
            Ship compliant campaigns <span className="text-brand-gradient">without the bottleneck.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            ComplyStep reviews financial, health, legal and gambling promotions before they go live, and monitors them continuously once published, so marketing moves fast and compliance stays in control.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline" size="lg">
              <Link to="/products">See the Platform</Link>
            </Button>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {["FCA Consumer Duty", "CAP & ASA Codes", "DMCC Act 2024", "UK GDPR Aligned"].map((badge) => (
              <div key={badge} className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm">
                <CheckCircle2 className="size-4 text-primary" />
                {badge}
              </div>
            ))}
          </div>

          <div className="mt-20 w-full max-w-4xl">
            <div className="grid grid-cols-2 gap-px border-y border-border/60 bg-border/60 sm:grid-cols-4">
              {[
                ["90%+", "Compliance accuracy"],
                ["70%+", "Fewer live compliance risks"],
                ["60%+", "Faster approval turnaround"],
                ["30%+", "Lower penalty exposure"],
              ].map(([v, l]) => (
                <div key={l} className="bg-background py-8 text-center">
                  <dt className="font-display text-3xl font-bold text-primary sm:text-4xl">{v}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{l}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Platform */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
            <span className="size-1.5 rounded-full bg-primary" /> The Platform
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Everything you need to launch with confidence.</h2>
        </div>

        <div className="grid gap-20">
          {/* Row 1 */}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="mb-5 grid size-12 place-items-center rounded-xl bg-primary/10">
                <FileSearch className="size-6 text-primary" />
              </span>
              <h3 className="font-display text-2xl font-bold sm:text-3xl">Pre-publication review</h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Every creative is scored against FCA Consumer Duty, CAP and DMCC standards before it goes live, not after a regulator flags it.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Automated semantic compliance scoring",
                  "Clear, actionable fix suggestions",
                  "Approvals in hours, not weeks",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 font-medium text-foreground">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elevated">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?fm=jpg&q=60&w=900&auto=format&fit=crop" alt="team reviewing compliance dashboard" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="order-2 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elevated lg:order-1">
              <img src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?fm=jpg&q=60&w=900&auto=format&fit=crop" alt="live monitoring dashboard on screen" className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <span className="mb-5 grid size-12 place-items-center rounded-xl bg-primary/10">
                <RadioTower className="size-6 text-primary" />
              </span>
              <h3 className="font-display text-2xl font-bold sm:text-3xl">Live compliance monitoring</h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Once published, we continuously scan your site, social and affiliate channels for unauthorised edits, so drift never becomes a fine.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Real-time drift alerts across every channel",
                  "Affiliate & third-party monitoring",
                  "Full audit trail for regulators",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 font-medium text-foreground">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="mb-5 grid size-12 place-items-center rounded-xl bg-primary/10">
                <TrendingUp className="size-6 text-primary" />
              </span>
              <h3 className="font-display text-2xl font-bold sm:text-3xl">Compliance that grows revenue</h3>
              <p className="mt-4 text-lg text-muted-foreground">
                We link every approved, compliant layout back to its conversion performance, so your safest campaigns are also your best-performing ones.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Compliance-to-ROI benchmarking",
                  "Anonymised industry benchmarking",
                  "Works with your existing ad stack",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 font-medium text-foreground">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elevated">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?fm=jpg&q=60&w=900&auto=format&fit=crop" alt="analytics charts on laptop screen" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Built For Your Team */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary" /> Built For Your Team
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">One platform, three teams.</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Compliance Teams",
                icon: ShieldCheck,
                desc: "Set the rules once. Let automation handle repetitive review, and focus your time on genuine edge cases.",
              },
              {
                title: "Marketing Teams",
                icon: Megaphone,
                desc: "Get clear, fast feedback inside the tools you already use, no more waiting days for a legal sign-off.",
              },
              {
                title: "Agencies",
                icon: Users,
                desc: "Manage compliance consistently across every regulated client account, from one dashboard.",
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
      </section>

      {/* FAQs */}
      <section className="border-y border-border/60 bg-card/50" id="faqs">
        <div className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6">
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary" /> FAQs
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Questions we hear most often.</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-display text-lg">How is ComplyStep different from a generic AI content checker?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                ComplyStep runs on a sector-specific regulatory knowledge graph trained on FCA, ASA, MHRA and CAP Code sources, with explainable multi-agent reasoning, so every flag cites the rule behind it.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-display text-lg">Does ComplyStep only review campaigns before they go live?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                No. We cover the full lifecycle: pre-publication review, approval workflow, post-publication live monitoring, affiliate surveillance, audit evidence and performance analytics.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-display text-lg">Which industries do you support?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                UK financial advisors, private healthcare, legal services, and gambling and affiliate brands, plus adjacent regulated sectors on request.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-display text-lg">How long does onboarding take?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Most teams are live within two weeks. We import your existing rules and brand guidelines, then calibrate scoring against your recent campaigns.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left font-display text-lg">Will compliance slow my marketing team down?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                The opposite. Approvals move from weeks to hours, and we link approved layouts to conversion performance so compliance becomes a growth lever.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left font-display text-lg">Is my campaign data secure?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Yes. Data is processed in line with UK GDPR, access is role-based, and every review is stored in an immutable audit trail you can export for regulators.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl bg-foreground px-6 py-16 text-center sm:py-24 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-background sm:text-4xl">
            See ComplyStep in action.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Join UK financial, healthcare, legal and gambling brands using ComplyStep to launch faster, with less risk.
          </p>
          <Button asChild variant="hero" size="lg" className="mt-8">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
