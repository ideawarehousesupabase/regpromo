import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { Brain, RefreshCw, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [{ title: "Product | ComplyStep" }],
  }),
  component: Product,
});

function Product() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Product"
        title="More than just a compliance checker."
        subtitle="Our core pillars turn regulatory obligations into a competitive advantage for your marketing."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 md:gap-16">
          {/* Pillar 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Brain className="h-6 w-6" />
              </div>
              <h2 className="font-display text-3xl font-bold">Depth of Intelligence</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Not a generic AI checker. We provide a sector-specific regulatory knowledge graph with explainable, multi-agent AI reasoning tailored to FCA, ASA, MHRA, and CAP Code rules.
              </p>
            </div>
            <div className="flex-1 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elevated">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?fm=jpg&q=60&w=900&auto=format&fit=crop" alt="AI regulatory knowledge graph" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h2 className="font-display text-3xl font-bold">Full Lifecycle Coverage</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The only platform covering pre-publication review, approval workflow, post-publication live monitoring, affiliate surveillance, audit evidence, and performance analytics all together.
              </p>
            </div>
            <div className="flex-1 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elevated">
              <img src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?fm=jpg&q=60&w=900&auto=format&fit=crop" alt="Full lifecycle compliance coverage" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h2 className="font-display text-3xl font-bold">Compliance as a Growth Tool</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Uniquely connects risk controls to commercial performance, turning compliance from a blocker into a competitive advantage for marketing teams.
              </p>
            </div>
            <div className="flex-1 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elevated">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?fm=jpg&q=60&w=900&auto=format&fit=crop" alt="Compliance driving growth and performance" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <ScreenshotGallery />
    </PublicLayout>
  );
}
