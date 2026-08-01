import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, PublicLayout } from "@/components/public-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog | ComplyStep" },
    ],
  }),
  component: Blog,
});

function Blog() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Blog"
        title="Insights on UK marketing compliance."
        subtitle="Practical breakdowns of FCA, CAP, and DMCC Act updates and what they mean for your next launch."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              category: "Compliance · 2026",
              title: "What the DMCC Act 2024 means for digital marketers",
              desc: "A practical breakdown of the CMA's direct-fine powers and what it means for your next launch.",
              img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?fm=jpg&q=60&w=900&auto=format&fit=crop",
            },
            {
              category: "FCA · 2026",
              title: "Consumer Understanding: beyond the disclaimer checklist",
              desc: "Why keyword-matching tools miss the point of Outcome 3.",
              img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?fm=jpg&q=60&w=900&auto=format&fit=crop",
            },
            {
              category: "Financial Promotions · 2026",
              title: "Inside the 97.5% surge in FCA interventions",
              desc: "What 19,766 amended promotions tell us about where marketing gets caught out.",
              img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?fm=jpg&q=60&w=900&auto=format&fit=crop",
            },
          ].map((post) => (
            <Card key={post.title} className="group overflow-hidden border-border/70 transition-shadow hover:shadow-lg">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img 
                  src={post.img} 
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="text-xs font-semibold tracking-wide text-primary uppercase">
                  {post.category}
                </div>
                <h3 className="mt-3 font-display text-xl font-bold leading-tight">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {post.desc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-primary/80">
                  Read Article <ArrowRight className="size-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
