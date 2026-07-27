import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageSquare } from "lucide-react";
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
      { title: "Contact RegPromo Lens — Talk to the Team" },
      {
        name: "description",
        content:
          "Get in touch with the RegPromo Lens team about AI-assisted campaign compliance verification for your regulated business.",
      },
      { property: "og:title", content: "Contact RegPromo Lens" },
      {
        property: "og:description",
        content: "Questions about compliance checks, plans or the Year 1 MVP? Send us a message.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Message received — this prototype does not send email.");
    setForm({ name: "", email: "", company: "", message: "" });
  };

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Contact"
        title="Talk to us about your compliance workflow"
        subtitle="Tell us which sector you advertise in and where campaigns currently get stuck."
      />

      <section className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[
            { icon: Mail, title: "Email", body: "hello@regpromolens.com" },
            { icon: MessageSquare, title: "Product questions", body: "Ask about the MVP scope and sector coverage." },
            { icon: MapPin, title: "Working remotely", body: "Serving regulated marketing teams across Europe." },
          ].map((c) => (
            <div key={c.title} className="surface-glass flex gap-4 rounded-2xl p-5">
              <c.icon className="size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">{c.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              </div>
            </div>
          ))}
        </div>

        <Card className="border-border/70">
          <CardContent className="p-7">
            <form className="space-y-4" onSubmit={submit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="c-name">Full name</Label>
                  <Input
                    id="c-name"
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-company">Company</Label>
                  <Input
                    id="c-company"
                    maxLength={100}
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email">Email</Label>
                <Input
                  id="c-email"
                  type="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-message">Message</Label>
                <Textarea
                  id="c-message"
                  rows={6}
                  maxLength={1000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                Send message
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}
