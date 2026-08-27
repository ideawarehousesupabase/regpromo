import { Link } from "@tanstack/react-router";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img
        src="/ComplyStep.png"
        alt="ComplyStep"
        className="h-10 w-auto py-1"
      />
    </Link>
  );
}

