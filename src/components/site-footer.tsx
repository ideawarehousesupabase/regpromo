import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";
import { MessageSquare, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "./ui/button";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/60 relative">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            AI compliance platform helping UK regulated brands verify, monitor and optimise every promotional campaign.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Industries</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/industries" hash="seg-finance" className="hover:text-foreground">Financial Advisors</Link></li>
            <li><Link to="/industries" hash="seg-healthcare" className="hover:text-foreground">Private Healthcare</Link></li>
            <li><Link to="/industries" hash="seg-legal" className="hover:text-foreground">Legal Services</Link></li>
            <li><Link to="/industries" hash="seg-gambling" className="hover:text-foreground">Gambling & Affiliates</Link></li>
            <li><Link to="/industries" className="hover:text-foreground">All Industries</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
            <li><Link to="/about" hash="founder-section" className="hover:text-foreground">Founder</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/casestudy" className="hover:text-foreground">Case Studies</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
            <li><Link to="/sitemap" className="hover:text-foreground">Sitemap</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Connect Us</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-foreground">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-foreground">
                <Twitter className="h-4 w-4" /> X
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-foreground">
                <Facebook className="h-4 w-4" /> Facebook
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-foreground">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t border-border/60 px-4 py-6 sm:flex-row sm:px-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ComplyStep · London, UK · Founded by Janki Rathod
        </p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
          <Link to="/regulatory-compliance" className="hover:text-foreground">Regulatory Compliance</Link>
        </div>
      </div>
    </footer>
  );
}
