import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            AI compliance platform helping UK regulated brands verify, monitor and optimise every promotional campaign.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Product</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-foreground">Pricing</Link></li>
            <li><Link to="/products" className="hover:text-foreground">Compare Solutions</Link></li>
            <li><Link to="/industries" className="hover:text-foreground">Industries</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
            <li><Link to="/casestudy" className="hover:text-foreground">Case Study</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Book a Demo</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Industries</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/industries" className="hover:text-foreground">Financial Advisors</Link></li>
            <li><Link to="/industries" className="hover:text-foreground">Private Healthcare</Link></li>
            <li><Link to="/industries" className="hover:text-foreground">Legal Services</Link></li>
            <li><Link to="/industries" className="hover:text-foreground">Gambling & Affiliates</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} ComplyStep · London, UK · Founded by Janki Rathod
      </div>
    </footer>
  );
}

