import type { RiskLevel } from "@/data/mock";
import { cn } from "@/lib/utils";

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const map: Record<RiskLevel, string> = {
    Low: "bg-success/12 text-success",
    Medium: "bg-warning/18 text-warning-foreground",
    High: "bg-destructive/12 text-destructive",
    Critical: "bg-destructive text-destructive-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        map[risk],
      )}
    >
      {risk}
    </span>
  );
}

export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-24 rounded-full bg-secondary">
        <div className="h-2 rounded-full bg-brand-gradient" style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-semibold">{score}%</span>
    </div>
  );
}

export function ComplianceMeter({ score, risk }: { score: number; risk: RiskLevel }) {
  const radius = 68;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 160 90" className="w-52">
        <path
          d="M12 82 A68 68 0 0 1 148 82"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="meter-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.45 0.24 264)" />
            <stop offset="100%" stopColor="oklch(0.58 0.19 264)" />
          </linearGradient>
        </defs>
        <path
          d="M12 82 A68 68 0 0 1 148 82"
          fill="none"
          stroke="url(#meter-grad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <p className="-mt-6 font-display text-4xl font-bold">{score}%</p>
      <p className="mt-2 text-xs tracking-wide text-muted-foreground uppercase">
        Compliance score · {risk} risk
      </p>
    </div>
  );
}
