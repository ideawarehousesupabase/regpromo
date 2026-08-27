import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/products", label: "Product" },
  { to: "/industries", label: "Industries" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Insights <ChevronDown className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/blog" className="cursor-pointer">
                  Blog
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/casestudy" className="cursor-pointer">
                  Case Studies
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Button asChild variant="hero" size="sm">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild variant="hero" size="sm">
                <Link to="/signup">Free trial</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="grid size-10 place-items-center rounded-lg border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/blog"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              Blog
            </Link>
            <Link
              to="/casestudy"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              Case Studies
            </Link>
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <Button asChild variant="hero" className="w-full">
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button asChild variant="hero" className="flex-1">
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    Free trial
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
