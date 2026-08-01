import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, ScanLine, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplianceMeter, RiskBadge, StatusBadge } from "@/components/compliance-ui";
import { buildMockAnalysis, INDUSTRIES, PLATFORMS, saveCampaign, saveReport } from "@/data/mock";

export const Route = createFileRoute("/dashboard/campaigns/new")({
  head: () => ({
    meta: [
      { title: "New Campaign — ComplyStep" },
      {
        name: "description",
        content: "Create a campaign and run a simulated AI compliance check on its ad copy and disclaimers.",
      },
      { property: "og:title", content: "New Campaign — ComplyStep" },
      { property: "og:description", content: "Draft a campaign and scan it for compliance risk." },
    ],
  }),
  component: NewCampaign,
});

type Analysis = ReturnType<typeof buildMockAnalysis>;

function NewCampaign() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    industry: "",
    platform: "",
    description: "",
    adCopy: "",
    landingPageText: "",
    disclaimer: "",
  });
  const [scanning, setScanning] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<Analysis | null>(null);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const steps = [
    "Parsing campaign assets",
    "Matching regulatory clauses",
    "Scoring disclosure completeness",
    "Compiling recommendations",
  ];

  const runCheck = async () => {
    if (!form.name || !form.industry || !form.platform || !form.adCopy) {
      toast.error("Add a name, industry, platform and ad copy before scanning.");
      return;
    }
    setResult(null);
    setScanning(true);
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 650));
    }
    setResult(buildMockAnalysis(form));
    setScanning(false);
    toast.success("Compliance analysis complete.");
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/dashboard/campaigns" })}>
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">New campaign</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your creative assets, then run a simulated compliance check.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="border-border/70">
          <CardContent className="space-y-5 p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Campaign name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  placeholder="Q4 Savings Account Push"
                />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={form.industry} onValueChange={set("industry")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={form.platform} onValueChange={set("platform")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Campaign description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description")(e.target.value)}
                  placeholder="What is this campaign promoting, and to whom?"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="adCopy">Advertisement copy</Label>
                <Textarea
                  id="adCopy"
                  rows={4}
                  value={form.adCopy}
                  onChange={(e) => set("adCopy")(e.target.value)}
                  placeholder="Headline and body copy exactly as it will run."
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="landing">Landing page text</Label>
                <Textarea
                  id="landing"
                  rows={3}
                  value={form.landingPageText}
                  onChange={(e) => set("landingPageText")(e.target.value)}
                  placeholder="Key on-page claims and supporting copy."
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="disclaimer">Disclaimer</Label>
                <Textarea
                  id="disclaimer"
                  rows={3}
                  value={form.disclaimer}
                  onChange={(e) => set("disclaimer")(e.target.value)}
                  placeholder="Risk warnings, eligibility and mandatory disclosures."
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="lg" onClick={runCheck} disabled={scanning}>
                {scanning ? <Loader2 className="animate-spin" /> : <ScanLine />}
                {scanning ? "Analysing…" : "Run compliance check"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (!form.name || !form.industry || !form.platform) {
                    toast.error("Add a name, industry, and platform before saving as draft.");
                    return;
                  }
                  const newId = `cmp-${Math.floor(1000 + Math.random() * 9000)}`;
                  saveCampaign({
                    id: newId,
                    name: form.name,
                    industry: form.industry,
                    platform: form.platform,
                    status: "Draft",
                    risk: "Low",
                    score: 0,
                    updatedAt: new Date().toISOString().split("T")[0],
                    description: form.description,
                    adCopy: form.adCopy,
                    landingPageText: form.landingPageText,
                    disclaimer: form.disclaimer,
                  });
                  toast.success("Campaign saved as draft.");
                  navigate({ to: "/dashboard/campaigns" });
                }}
              >
                Save as draft
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h2 className="font-display text-lg font-semibold">Compliance analysis</h2>
            </div>

            {!scanning && !result && (
              <p className="mt-6 text-sm text-muted-foreground">
                Run a check to see a simulated score, flagged clauses and recommended fixes. This
                MVP uses deterministic rules, not a live model.
              </p>
            )}

            {scanning && (
              <ul className="mt-6 space-y-3">
                {steps.map((s, i) => (
                  <li
                    key={s}
                    className={`flex items-center gap-3 text-sm ${
                      i <= step ? "text-foreground" : "text-muted-foreground/60"
                    }`}
                  >
                    {i < step ? (
                      <span className="size-2 rounded-full bg-success" />
                    ) : i === step ? (
                      <Loader2 className="size-4 animate-spin text-primary" />
                    ) : (
                      <span className="size-2 rounded-full bg-border" />
                    )}
                    {s}
                  </li>
                ))}
              </ul>
            )}

            {result && (
              <div className="mt-6 space-y-6">
                <ComplianceMeter score={result.score} risk={result.risk} />
                <div className="flex justify-center gap-2">
                  <RiskBadge risk={result.risk} />
                  <StatusBadge status={result.status} />
                </div>
                <div className="space-y-3">
                  {result.breakdown.map((b) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{b.label}</span>
                        <span className="font-semibold">{b.score}%</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-secondary">
                        <div
                          className="h-1.5 rounded-full bg-brand-gradient"
                          style={{ width: `${b.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Flagged issues</h3>
                  <ul className="mt-3 space-y-3">
                    {result.issues.length === 0 && (
                      <li className="text-sm text-muted-foreground">No issues detected.</li>
                    )}
                    {result.issues.map((i) => (
                      <li key={i.id} className="rounded-xl border border-border/70 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{i.title}</p>
                          <RiskBadge risk={i.severity} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{i.detail}</p>
                        <p className="mt-2 text-xs font-medium text-primary">{i.clause}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Recommendations</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {result.recommendations.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
                <Button
                  className="w-full"
                  variant="hero"
                  onClick={() => {
                    const newId = `cmp-${Math.floor(1000 + Math.random() * 9000)}`;
                    const today = new Date().toISOString().split("T")[0];
                    saveCampaign({
                      id: newId,
                      name: form.name,
                      industry: form.industry,
                      platform: form.platform,
                      status: result.status,
                      risk: result.risk,
                      score: result.score,
                      updatedAt: today,
                      description: form.description,
                      adCopy: form.adCopy,
                      landingPageText: form.landingPageText,
                      disclaimer: form.disclaimer,
                    });
                    saveReport({
                      id: `rep-${Math.floor(1000 + Math.random() * 9000)}`,
                      campaignId: newId,
                      campaignName: form.name,
                      industry: form.industry,
                      platform: form.platform,
                      score: result.score,
                      risk: result.risk,
                      status: result.status,
                      createdAt: today,
                      breakdown: result.breakdown,
                      issues: result.issues,
                      recommendations: result.recommendations,
                      timeline: [
                        { label: "Campaign created", time: "Just now" },
                        { label: "Compliance check run", time: "Just now" },
                        { label: "Report generated", time: "Just now" },
                      ],
                    });
                    toast.success("Campaign and report saved.");
                    navigate({ to: "/dashboard/campaigns" });
                  }}
                >
                  Save campaign & report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
