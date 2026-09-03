import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Screenshot = {
  src: string;
  caption: string;
};

const screenshots: Screenshot[] = [
  { src: "/screenshots/dashboard.png", caption: "Dashboard" },
  { src: "/screenshots/campaigns.png", caption: "Campaigns" },
  { src: "/screenshots/campaign-detail.png", caption: "Campaign detail" },
  { src: "/screenshots/new-campaign.png", caption: "New campaign" },
  { src: "/screenshots/compliance-reports.png", caption: "Compliance reports" },
  { src: "/screenshots/integrations.png", caption: "Integrations" },
  { src: "/screenshots/notifications.png", caption: "Notifications" },
];

export function ScreenshotGallery() {
  const [active, setActive] = useState<Screenshot | null>(null);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setActive(null);
      document.body.classList.remove("lightbox-open");
    }
  }

  function openLightbox(shot: Screenshot) {
    setActive(shot);
    document.body.classList.add("lightbox-open");
  }

  return (
    <section className="border-t border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold">See it in action</h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            A closer look at the ComplyStep interface, from campaign creation to live compliance monitoring.
          </p>
        </div>

        <Carousel
          opts={{ align: "start" }}
          className="mt-12"
        >
          <CarouselContent className="-ml-0 gap-6">
            {screenshots.map((shot) => (
              <CarouselItem
                key={shot.src}
                className="basis-[85%] pl-0 sm:basis-1/2 lg:basis-1/3"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(shot)}
                  className="group block w-full overflow-hidden rounded-2xl border border-border/60 bg-card text-left shadow-soft transition-shadow hover:shadow-elevated cursor-pointer"
                >
                  <div className="overflow-hidden">
                    <img
                      src={shot.src}
                      alt={shot.caption}
                      className="aspect-[4/3] w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{shot.caption}</p>
                  </div>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>

      <Dialog open={active !== null} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl border-border/60 bg-card p-4 sm:p-6">
          <DialogTitle className="sr-only">{active?.caption ?? "Screenshot"}</DialogTitle>
          <DialogDescription className="sr-only">
            Enlarged screenshot of the {active?.caption} screen.
          </DialogDescription>
          {active && (
            <div className="overflow-hidden rounded-xl border border-border/60">
              <img
                src={active.src}
                alt={active.caption}
                className="max-h-[75vh] w-full object-contain bg-background"
              />
              <p className="border-t border-border/60 bg-card px-4 py-3 text-center text-sm font-medium text-foreground">
                {active.caption}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
