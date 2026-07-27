import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileText,
  Megaphone,
  Plus,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RiskBadge, StatusBadge } from "@/components/compliance-ui";
import { campaigns, dashboardStats, recentActivity, reports, scoreTrend } from "@/data/mock";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Dashboard — RegPromo Lens" },
      {
        name: "description",
        content: "Campaign compliance overview: totals, approvals, pending reviews and high-risk campaigns.",
      },
      { property: "og:title", content: "Dashboard — RegPromo Lens" },
      { property: "og:description", content: "Your campaign compliance overview." },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  const { user } = useSession();

  const stats = [
    {
      label: "Total Campaigns",
      value: dashboardStats.totalCampaigns,
      icon: Megaphone,
      note: "across all channels",
    },
    {
      label: "Approved Campaigns",
      value: dashboardStats.approvedCampaigns,
      icon: CheckCircle2,
      note: "cleared to publish",
    },
    {
      label: "Pending Review",
      value: dashboardStats.pendingReview,
      icon: Clock,
      note: "awaiting sign-off",
    },
    {
      label: "High Risk Campaigns",
      value: dashboardStats.highRisk,
      icon: AlertTriangle,
      note: "need revision now",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome back, {user?.name.split(" ")[0] ?? "there"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s the compliance position across your campaigns.
          </p>
        </div>
        <Button asChild variant="hero">
          <Link to="/dashboard/campaigns/new">
            <Plus /> New campaign
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/70">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <span className="grid size-9 place-items-center rounded-xl bg-secondary">
                  <s.icon className="size-4 text-primary" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="border-border/70">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold">Average compliance score</h2>
                <p className="text-sm text-muted-foreground">
                  Trending up — currently {dashboardStats.averageScore}%
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-xs font-semibold text-success">
                <ArrowUpRight className="size-3" /> +21 pts
              </span>
            </div>
            <div className="mt-6 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreTrend} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="score-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis domain={[40, 100]} tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fill="url(#score-fill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              <h2 className="font-display text-lg font-semibold">Recent activity</h2>
            </div>
            <ul className="mt-5 space-y-4">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-gradient" />
                  <div>
                    <p className="text-sm">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Recent campaigns</h2>
              <Link
                to="/dashboard/campaigns"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-border/60">
              {campaigns.slice(0, 5).map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.industry} · {c.platform}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <RiskBadge risk={c.risk} />
                    <StatusBadge status={c.status} />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Recent reports</h2>
              <Link
                to="/dashboard/reports"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-border/60">
              {reports.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.campaignName}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.id} · {r.createdAt}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard/reports/$reportId"
                    params={{ reportId: r.id }}
                    className="shrink-0 text-sm font-semibold text-primary hover:underline"
                  >
                    {r.score}%
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
