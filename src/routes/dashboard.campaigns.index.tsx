import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiskBadge, ScoreBar } from "@/components/compliance-ui";
import { deleteCampaign, getCampaigns, INDUSTRIES } from "@/data/mock";

export const Route = createFileRoute("/dashboard/campaigns/")({
  head: () => ({
    meta: [
      { title: "Campaigns — ComplyStep" },
      {
        name: "description",
        content:
          "All marketing campaigns with industry, platform, risk level and compliance score.",
      },
      { property: "og:title", content: "Campaigns — ComplyStep" },
      {
        property: "og:description",
        content: "Manage and review every regulated campaign in one table.",
      },
    ],
  }),
  component: CampaignList,
});

function CampaignList() {
  const [rows, setRows] = useState(() => getCampaigns());

  useEffect(() => {
    setRows(getCampaigns());
  }, []);
  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState("all");

  const filtered = useMemo(
    () =>
      rows.filter(
        (c) =>
          c.name.toLowerCase().includes(q.trim().toLowerCase()) &&
          (industry === "all" || c.industry === industry),
      ),
    [rows, q, industry],
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Campaigns</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} of {rows.length} campaigns shown.
          </p>
        </div>
        <Button asChild variant="hero">
          <Link to="/dashboard/campaigns/new">
            <Plus /> New campaign
          </Link>
        </Button>
      </div>

      <Card className="border-border/70">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-56 flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns"
                className="pl-9"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All industries</SelectItem>
                {INDUSTRIES.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-5 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Compliance Score</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium whitespace-nowrap">{c.name}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {c.industry}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {c.platform}
                    </TableCell>
                    <TableCell>
                      <RiskBadge risk={c.risk} />
                    </TableCell>
                    <TableCell>
                      <ScoreBar score={c.score} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {c.updatedAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" title="View">
                          <Link to="/dashboard/campaigns/$campaignId" params={{ campaignId: c.id }}>
                            <Eye />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon" title="Edit">
                          <Link
                            to="/dashboard/campaigns/$campaignId"
                            params={{ campaignId: c.id }}
                            search={{ edit: true }}
                          >
                            <Pencil />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          onClick={() => {
                            deleteCampaign(c.id);
                            setRows(getCampaigns());
                            toast.success(`${c.name} deleted.`);
                          }}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      No campaigns match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
