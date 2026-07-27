import { useEffect } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/use-session";
import { logout } from "@/lib/auth";
import { notifications } from "@/data/mock";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const { user, ready } = useSession();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login" });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar
          onLogout={() => {
            logout();
            navigate({ to: "/" });
          }}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/85 px-3 backdrop-blur-xl sm:px-5">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-3">
              <span className="relative grid size-9 place-items-center rounded-lg border border-border">
                <Bell className="size-4 text-muted-foreground" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unread}
                  </span>
                )}
              </span>
              <div className="hidden text-right sm:block">
                <p className="text-sm leading-tight font-semibold">{user.name}</p>
                <p className="text-xs leading-tight text-muted-foreground">{user.company}</p>
              </div>
              <span className="grid size-9 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-primary-foreground">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
