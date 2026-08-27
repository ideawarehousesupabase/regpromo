import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/public-layout";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap | ComplyStep" },
    ],
  }),
  component: Sitemap,
});

function Sitemap() {
  return (
    <PublicLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <h1 className="mb-12 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Every page on ComplyStep.
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Platform */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="mb-6 font-semibold text-foreground">Platform</h2>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Home</Link></li>
              <li><Link to="/products" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Product</Link></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</Link></li>
              <li><Link to="/industries" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Industries</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="mb-6 font-semibold text-foreground">Company</h2>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">About Us</Link></li>
              <li><Link to="/about" hash="founder-section" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Founder</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Blog</Link></li>
              <li><Link to="/casestudy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Case Studies</Link></li>
              <li><Link to="/sitemap" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Sitemap</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>

          {/* Industries */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="mb-6 font-semibold text-foreground">Industries</h2>
            <ul className="space-y-4">
              <li><Link to="/industries" hash="seg-finance" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Financial Advisors</Link></li>
              <li><Link to="/industries" hash="seg-healthcare" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Private Healthcare</Link></li>
              <li><Link to="/industries" hash="seg-legal" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Legal Services</Link></li>
              <li><Link to="/industries" hash="seg-gambling" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Gambling & Affiliates</Link></li>
              <li><Link to="/industries" className="text-sm text-muted-foreground transition-colors hover:text-foreground">All Industries</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="mb-6 font-semibold text-foreground">Legal</h2>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/regulatory-compliance" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Regulatory Compliance</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
