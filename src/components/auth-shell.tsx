import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-brand-gradient p-12 lg:flex">
        <div className="text-primary-foreground">
          <Link to="/" className="font-display text-lg font-semibold">
            RegPromo Lens
          </Link>
        </div>
        <div className="max-w-md text-primary-foreground">
          <h2 className="font-display text-3xl leading-tight font-bold">
            Verify campaigns against the rules before your audience ever sees them.
          </h2>
          <p className="mt-4 text-sm opacity-85">
            Compliance score, risk level, issues and recommendations — generated in minutes and
            archived automatically as evidence.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/70">
          Prototype build — all campaign data is mock data.
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-14 sm:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-8 text-3xl font-bold lg:mt-0">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
