import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, BellRing, CheckCheck, CheckCircle2, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { notifications as seed, type Notification } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — RegPromo Lens" },
      {
        name: "description",
        content: "Approval alerts, generated reports and compliance score changes across your campaigns.",
      },
      { property: "og:title", content: "Notifications — RegPromo Lens" },
      { property: "og:description", content: "Stay on top of compliance changes as they happen." },
    ],
  }),
  component: Notifications,
});

const icons = {
  approval: CheckCircle2,
  report: FileText,
  score: TrendingUp,
  alert: AlertTriangle,
} as const;

function Notifications() {
  const [items, setItems] = useState<Notification[]>(seed);
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unread} unread of {items.length} notifications.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setItems((n) => n.map((x) => ({ ...x, read: true })));
            toast.success("All notifications marked as read.");
          }}
        >
          <CheckCheck /> Mark all as read
        </Button>
      </div>

      <Card className="border-border/70">
        <CardContent className="divide-y divide-border/60 p-0">
          {items.map((n) => {
            const Icon = icons[n.type];
            return (
              <button
                key={n.id}
                onClick={() =>
                  setItems((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
                }
                className={cn(
                  "flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-secondary/50",
                  !n.read && "bg-primary/4",
                )}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
                  <Icon className="size-4 text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{n.title}</p>
                    {!n.read && <span className="size-2 rounded-full bg-brand-gradient" />}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                </div>
              </button>
            );
          })}
          {items.length === 0 && (
            <div className="flex flex-col items-center gap-2 p-12 text-center">
              <BellRing className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">You&apos;re all caught up.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
