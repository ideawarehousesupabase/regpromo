import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Plug, Search, Users, Music2, Workflow, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { socialIntegrations } from "@/data/integrations";

export const Route = createFileRoute("/dashboard/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — ComplyStep" },
      {
        name: "description",
        content:
          "Connect ComplyStep to your ad and social platforms for real-time compliance drift monitoring.",
      },
      { property: "og:title", content: "Integrations — ComplyStep" },
      {
        property: "og:description",
        content: "Live compliance monitoring across every channel you publish to.",
      },
    ],
  }),
  component: IntegrationsPage,
});

const ICONS: Record<string, LucideIcon> = {
  "google-ads": Search,
  "meta-ads": Users,
  tiktok: Music2,
  hubspot: Workflow,
};

function IntegrationsPage() {
  const [connected, setConnected] = useState<Set<string>>(new Set());

  const connect = (id: string, name: string) => {
    setConnected((prev) => new Set(prev).add(id));
    toast.success(`${name} connected (mock)`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect the channels you publish to so ComplyStep can watch approved campaigns for
          unauthorized edits after they go live — this is the core of the platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {socialIntegrations.map((integration) => {
          const Icon = ICONS[integration.id] ?? Plug;
          const isConnected = connected.has(integration.id);
          return (
            <Card key={integration.id} className="border-border/70">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-display font-semibold">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">{integration.category}</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn("shrink-0", isConnected && "bg-success/12 text-success")}
                  >
                    {isConnected ? "Connected" : "Not connected"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
                <Button
                  variant={isConnected ? "secondary" : "outline"}
                  className="w-full"
                  disabled={isConnected}
                  onClick={() => connect(integration.id, integration.name)}
                >
                  {isConnected && <CheckCircle2 className="size-4" />}
                  {isConnected ? "Connected" : "Connect"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
