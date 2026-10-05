"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface HeroCarouselProps {
  images: { src: string; alt: string; focus?: string }[];
  intervalMs?: number;
}

export function HeroCarousel({ images, intervalMs = 5000 }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (delta: number) => {
      setIndex((current) => (current + delta + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const timer = setInterval(() => go(1), intervalMs);
    return () => clearInterval(timer);
  }, [paused, go, intervalMs, images.length]);

  if (images.length === 0) {
    return (
      <div className="flex h-[50vh] min-h-[280px] w-full items-center justify-center bg-ocean-100 text-ocean-700">
        Add hero images to the featured trip
      </div>
    );
  }

  return (
    <section
      className="group relative h-[55vh] min-h-[300px] w-full overflow-hidden bg-ocean-950 sm:h-[65vh] sm:min-h-[380px] lg:h-[78vh] lg:min-h-[480px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured trip photos"
    >
      {images.map((image, i) => (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={i === 0}
            className="object-cover"
            style={{ objectPosition: image.focus ?? "center center" }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/50 via-transparent to-ocean-950/10" />
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-0 backdrop-blur transition hover:bg-white/30 group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-0 backdrop-blur transition hover:bg-white/30 group-hover:opacity-100 focus:opacity-100"
            aria-label="Next photo"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
