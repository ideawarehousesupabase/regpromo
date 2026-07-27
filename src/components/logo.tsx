import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-brand-gradient shadow-soft">
        <ShieldCheck className="size-5 text-primary-foreground" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-base font-semibold ${inverted ? "text-sidebar-foreground" : "text-foreground"}`}
        >
          RegPromo Lens
        </span>
        <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          AI RegTech
        </span>
      </span>
    </Link>
  );
}
