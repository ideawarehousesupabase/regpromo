import { Link } from "@tanstack/react-router";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img
        src="/logo-transparent.png"
        alt="ComplyStep"
        className="h-9 w-auto"
      />
    </Link>
  );
}

