import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RiskBadge, ScoreBar, StatusBadge } from "@/components/compliance-ui";
import { getReports, type ComplianceReport } from "@/data/mock";

export const Route = createFileRoute("/dashboard/reports/")({
  head: () => ({
    meta: [
      { title: "Compliance Reports — ComplyStep" },
      {
        name: "description",
        content: "Every generated compliance report with score, risk level and audit-ready history.",
      },
      { property: "og:title", content: "Compliance Reports — ComplyStep" },
      { property: "og:description", content: "Audit-ready compliance reports for your campaigns." },
    ],
  }),
  component: ReportsList,
});

function ReportsList() {
  const [reportList, setReportList] = useState<ComplianceReport[]>(() => getReports());

  useEffect(() => {
    setReportList(getReports());
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Compliance reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every scan is archived so you can evidence your review process.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reportList.map((r) => (
          <Card key={r.id} className="border-border/70 transition-shadow hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
                    <FileText className="size-4 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{r.campaignName}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.id} · {r.industry} · {r.createdAt}
                    </p>
                  </div>
                </div>
                <RiskBadge risk={r.risk} />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <ScoreBar score={r.score} />
                <StatusBadge status={r.status} />
              </div>

              <div className="mt-5 flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/dashboard/reports/$reportId" params={{ reportId: r.id }}>
                    View report
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Export"
                  onClick={() => toast.success("Export queued (demo only).")}
                >
                  <Download />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
