import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ComplianceMeter, RiskBadge } from "@/components/compliance-ui";
import { getReports, type ComplianceReport } from "@/data/mock";

export const Route = createFileRoute("/dashboard/reports/$reportId")({
  loader: ({ params }): { report: ComplianceReport } => {
    const report = getReports().find((r) => r.id === params.reportId);
    if (!report) throw notFound();
    return { report };
  },

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Report unavailable — ComplyStep" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.report.campaignName} report — ComplyStep`;
    const description = `Compliance report ${loaderData.report.id}: ${loaderData.report.score}% score, ${loaderData.report.risk.toLowerCase()} risk.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ReportDetail,
});

function ReportDetail() {
  const { report } = Route.useLoaderData() as { report: ComplianceReport };
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/dashboard/reports" })}>
          <ArrowLeft />
        </Button>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold sm:text-3xl">{report.campaignName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Report {report.id} · {report.platform} · generated {report.createdAt}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            onClick={() => toast.success("Report link copied (demo only).")}
          >
            <Share2 /> Share
          </Button>
          <Button variant="hero" onClick={() => toast.success("PDF export queued (demo only).")}>
            <Download /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <Card className="border-border/70">
          <CardContent className="p-6">
            <ComplianceMeter score={report.score} risk={report.risk} />
            <div className="mt-4 flex justify-center gap-2">
              <RiskBadge risk={report.risk} />
            </div>
            <div className="mt-6 space-y-3">
              {report.breakdown.map((b) => (
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
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link
                to="/dashboard/campaigns/$campaignId"
                params={{ campaignId: report.campaignId }}
              >
                View campaign
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/70">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Flagged issues</h2>
              <ul className="mt-4 space-y-3">
                {report.issues.length === 0 && (
                  <li className="text-sm text-muted-foreground">No issues detected.</li>
                )}
                {report.issues.map((i) => (
                  <li key={i.id} className="rounded-xl border border-border/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{i.title}</p>
                      <RiskBadge risk={i.severity} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{i.detail}</p>
                    {i.matched && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Matched: <span className="font-mono">&ldquo;{i.matched}&rdquo;</span>
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {i.category} · −{i.impact} pts
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Recommendation: </span>
                      <span className="text-muted-foreground">{i.recommendation}</span>
                    </p>
                    <p className="mt-2 text-xs font-semibold text-primary">{i.clause}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Recommendations</h2>
              <ul className="mt-4 space-y-2">
                {report.recommendations.map((r) => (
                  <li key={r} className="flex gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Audit timeline</h2>
              <ol className="mt-4 space-y-4 border-l border-border pl-5">
                {report.timeline.map((t) => (
                  <li key={t.label} className="relative">
                    <span className="absolute top-1.5 -left-[27px] size-2.5 rounded-full bg-brand-gradient" />
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.time}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
