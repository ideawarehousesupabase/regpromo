import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileText, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ComplianceMeter, RiskBadge, StatusBadge } from "@/components/compliance-ui";
import { getCampaigns, getReports, saveCampaign, type Campaign, type ComplianceReport } from "@/data/mock";

export const Route = createFileRoute("/dashboard/campaigns/$campaignId")({
  validateSearch: (search: Record<string, unknown>) => ({
    edit: search.edit === true || search.edit === "true",
  }),
  loader: ({ params }) => {
    const campaign = getCampaigns().find((c) => c.id === params.campaignId);
    if (!campaign) throw notFound();
    return { campaign, report: getReports().find((r) => r.campaignId === campaign.id) ?? null };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Campaign unavailable — RegPromo Lens" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.campaign.name} — RegPromo Lens`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.campaign.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.campaign.description },
      ],
    };
  },
  component: CampaignDetail,
});

function CampaignDetail() {
  const { campaign, report } = Route.useLoaderData() as { campaign: Campaign; report: ComplianceReport | null };
  const { edit } = Route.useSearch();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(campaign);

  useEffect(() => {
    setDraft(campaign);
  }, [campaign]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/dashboard/campaigns" })}>
          <ArrowLeft />
        </Button>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold sm:text-3xl">{campaign.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {campaign.id} · {campaign.industry} · {campaign.platform} · updated {campaign.updatedAt}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <RiskBadge risk={campaign.risk} />
          <StatusBadge status={campaign.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-border/70">
          <CardContent className="space-y-5 p-6">
            <h2 className="font-display text-lg font-semibold">
              {edit ? "Edit campaign assets" : "Campaign assets"}
            </h2>
            {edit ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="e-name">Campaign name</Label>
                  <Input
                    id="e-name"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-copy">Advertisement copy</Label>
                  <Textarea
                    id="e-copy"
                    rows={4}
                    value={draft.adCopy}
                    onChange={(e) => setDraft({ ...draft, adCopy: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-landing">Landing page text</Label>
                  <Textarea
                    id="e-landing"
                    rows={3}
                    value={draft.landingPageText}
                    onChange={(e) => setDraft({ ...draft, landingPageText: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-disc">Disclaimer</Label>
                  <Textarea
                    id="e-disc"
                    rows={3}
                    value={draft.disclaimer}
                    onChange={(e) => setDraft({ ...draft, disclaimer: e.target.value })}
                  />
                </div>
                <Button
                  variant="hero"
                  onClick={() => {
                    const updated = {
                      ...campaign,
                      ...draft,
                      updatedAt: new Date().toISOString().split("T")[0],
                    };
                    saveCampaign(updated);
                    toast.success("Campaign updated.");
                    navigate({ to: "/dashboard/campaigns/$campaignId", params: { campaignId: campaign.id }, search: { edit: false } });
                  }}
                >
                  <Save /> Save changes
                </Button>
              </>
            ) : (
              <dl className="space-y-5 text-sm">
                {[
                  ["Description", campaign.description],
                  ["Advertisement copy", campaign.adCopy],
                  ["Landing page text", campaign.landingPageText],
                  ["Disclaimer", campaign.disclaimer || "— none provided —"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
                    <dd className="mt-1 rounded-xl bg-secondary/60 p-3 leading-relaxed">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-semibold">Latest compliance result</h2>
            <div className="mt-4">
              <ComplianceMeter score={campaign.score} risk={campaign.risk} />
            </div>
            {report ? (
              <Button asChild variant="outline" className="mt-6 w-full">
                <Link to="/dashboard/reports/$reportId" params={{ reportId: report.id }}>
                  <FileText /> View full report
                </Link>
              </Button>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">
                No compliance report has been generated for this campaign yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
