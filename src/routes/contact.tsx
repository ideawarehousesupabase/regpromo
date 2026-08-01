import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, ShieldHalf, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us & Book a Demo | ComplyStep" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", businessType: "Financial Advisor / Wealth Manager", message: "" });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    toast.success("Demo Request Sent!");
    setForm({ name: "", email: "", businessType: "Financial Advisor / Wealth Manager", message: "" });
  };

  const faqs = [
    {
      q: "What does ComplyStep actually do?",
      a: "We review promotions before they go live and monitor them continuously once published, combining AI compliance checks with UK-specific regulatory rules."
    },
    {
      q: "Do I need to replace my marketing stack?",
      a: "No. ComplyStep sits above Google Ads, Meta Ads Manager, TikTok and your CMS; you keep your current tools."
    },
    {
      q: "How is this different from ChatGPT or Claude?",
      a: "Generic AI platforms lack UK-specific regulatory training. ComplyStep is trained on FCA, CAP and DMCC Act data, with a closed-loop verification architecture."
    },
    {
      q: "How long does onboarding take?",
      a: "Once your first ad account is connected, onboarding for further campaigns and teams drops from weeks to hours."
    }
  ];

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Get In Touch"
        title="Book a demo of ComplyStep."
        subtitle="Let's protect your compliance equity. Our team will walk you through how ComplyStep fits your campaigns."
      />

      <section className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-border/70 shadow-elevated">
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={submit}>
              <div className="space-y-2">
                <Label htmlFor="c-name">Full Name</Label>
                <Input
                  id="c-name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email">Business Email</Label>
                <Input
                  id="c-email"
                  type="email"
                  placeholder="you@company.co.uk"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-business">Business Type</Label>
                <select 
                  id="c-business" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={form.businessType}
                  onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                >
                  <option>Financial Advisor / Wealth Manager</option>
                  <option>Private Healthcare / Aesthetics</option>
                  <option>Legal Services Firm</option>
                  <option>Gambling Operator / Affiliate Network</option>
                  <option>Digital Marketing Agency</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-message">Message</Label>
                <Textarea
                  id="c-message"
                  rows={4}
                  placeholder="Tell us about your campaigns"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                Send Demo Request
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:pl-6">
          <div>
            <h3 className="font-display text-2xl font-bold">Let's protect your compliance equity.</h3>
            <p className="mt-2 text-muted-foreground">Our team will walk you through how ComplyStep fits your campaigns.</p>
          </div>
          
          <div className="mt-8 space-y-6">
            {[
              { icon: Mail, label: "Email", value: "hello@complystep.co.uk" },
              { icon: MapPin, label: "Location", value: "London, United Kingdom" },
              { icon: ShieldHalf, label: "Compliance", value: "UK GDPR · FCA-Aligned" },
            ].map((info) => (
              <div key={info.label} className="flex gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10">
                  <info.icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{info.label}</p>
                  <p className="text-muted-foreground">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary" /> FAQ
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Frequently asked questions.</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-border/70 bg-background transition-colors hover:border-primary/30">
                <button 
                  className="flex w-full items-center justify-between p-6 text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <h4 className="font-display text-lg font-bold">{faq.q}</h4>
                  <ChevronDown className={`size-5 text-muted-foreground transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="px-6 pb-6 text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
