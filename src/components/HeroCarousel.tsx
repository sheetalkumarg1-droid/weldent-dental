import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type HeroImage = {
  src: string;
  srcSet: string;
  alt: string;
};

export function HeroCarousel({ images }: { images: readonly HeroImage[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % images.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <div
      className="relative aspect-[1200/674] overflow-hidden rounded-2xl bg-primary/5"
      role="region"
      aria-label="Weldent Dental Clinic photographs"
    >
      <img
        key={images[active]!.src}
        src={images[active]!.src}
        srcSet={images[active]!.srcSet}
        sizes="(max-width: 1023px) calc(100vw - 40px), 45vw"
        width="1600"
        height="674"
        loading="eager"
        fetchPriority={active === 0 ? "high" : "auto"}
        decoding="async"
        alt={images[active]!.alt}
        className="absolute inset-0 size-full animate-[carousel-fade_500ms_ease-out] object-cover"
      />
      <div
        className="absolute inset-x-0 bottom-3 flex justify-center gap-2"
        aria-label="Choose clinic photograph"
      >
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show clinic photograph ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
            className="grid size-7 place-items-center rounded-pill transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span
              className={cn(
                "h-2 rounded-full shadow-sm transition-all",
                index === active ? "w-6 bg-white" : "w-2 bg-white/65 hover:bg-white",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
