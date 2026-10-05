"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/types";

interface PhotoGalleryProps {
  groups: { name: string; photos: Photo[] }[];
}

const SWIPE_THRESHOLD = 50;

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

export function PhotoGallery({ groups }: PhotoGalleryProps) {
  const flatPhotos = groups.flatMap((g) => g.photos);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);

  const step = useCallback(
    (delta: number) => {
      setLightboxIndex((current) => {
        if (current === null) return null;
        return wrapIndex(current + delta, flatPhotos.length);
      });
    },
    [flatPhotos.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex, close, step]);

  if (flatPhotos.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-ocean-200 bg-white px-6 py-12 text-center text-ocean-600">
        No photos yet — add images to the trip gallery folder.
      </p>
    );
  }

  let offset = 0;

  return (
    <>
      <div className="space-y-12">
        {groups.map((group) => {
          const startIndex = offset;
          offset += group.photos.length;

          return (
            <section key={group.name}>
              {groups.length > 1 && (
                <h3 className="mb-4 font-[family-name:var(--font-display)] text-xl text-ocean-800">
                  {group.name}
                </h3>
              )}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                {group.photos.map((photo, i) => {
                  const globalIndex = startIndex + i;
                  return (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => setLightboxIndex(globalIndex)}
                      className="group relative aspect-square overflow-hidden rounded-xl bg-ocean-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={flatPhotos}
          index={lightboxIndex}
          onClose={close}
          onStep={step}
        />
      )}
    </>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onStep,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const [dragX, setDragX] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swipeAxis = useRef<"none" | "horizontal" | "vertical">("none");
  const didSwipe = useRef(false);

  const prevIndex = wrapIndex(index - 1, photos.length);
  const nextIndex = wrapIndex(index + 1, photos.length);
  const canSwipe = photos.length > 1;

  const resetTouch = () => {
    touchStart.current = null;
    swipeAxis.current = "none";
  };

  const finishSwipe = useCallback(
    (delta: number) => {
      if (!canSwipe) {
        setAnimating(true);
        setDragX(0);
        window.setTimeout(() => setAnimating(false), 220);
        return;
      }

      if (Math.abs(delta) >= SWIPE_THRESHOLD) {
        const direction = delta < 0 ? 1 : -1;
        didSwipe.current = true;
        setAnimating(true);
        const flyOut = direction === 1 ? -window.innerWidth * 0.4 : window.innerWidth * 0.4;
        setDragX(flyOut);
        window.setTimeout(() => {
          onStep(direction);
          setAnimating(false);
          setDragX(0);
        }, 200);
      } else {
        setAnimating(true);
        setDragX(0);
        window.setTimeout(() => setAnimating(false), 220);
      }
    },
    [canSwipe, onStep],
  );

  const onTouchStart = (e: React.TouchEvent) => {
    if (animating) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    swipeAxis.current = "none";
    didSwipe.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current || animating) return;

    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;

    if (swipeAxis.current === "none") {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      swipeAxis.current = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
    }

    if (swipeAxis.current !== "horizontal") return;

    e.preventDefault();
    const resisted = dx * 0.92;
    setDragX(resisted);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStart.current.x;
    const delta = (endX - touchStart.current.x) * 0.92;
    finishSwipe(delta);
    resetTouch();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (animating || e.pointerType === "touch") return;
    touchStart.current = { x: e.clientX, y: e.clientY };
    swipeAxis.current = "none";
    didSwipe.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!touchStart.current || animating || e.pointerType === "touch") return;

    const dx = e.clientX - touchStart.current.x;
    const dy = e.clientY - touchStart.current.y;

    if (swipeAxis.current === "none") {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      swipeAxis.current = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
    }

    if (swipeAxis.current !== "horizontal") return;
    setDragX(dx * 0.92);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (!touchStart.current) return;
    const delta = (e.clientX - touchStart.current.x) * 0.92;
    finishSwipe(delta);
    resetTouch();
  };

  const handleBackdropClick = () => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    onClose();
  };

  const photoPanels = canSwipe
    ? [
        { photo: photos[prevIndex], key: `prev-${prevIndex}` },
        { photo: photos[index], key: `current-${index}` },
        { photo: photos[nextIndex], key: `next-${nextIndex}` },
      ]
    : [{ photo: photos[index], key: `current-${index}` }];

  const panelCount = photoPanels.length;
  const centerPercent = canSwipe ? 100 / panelCount : 0;

  const slideStyle = {
    transform: `translateX(calc(-${centerPercent}% + ${dragX}px))`,
    transition: animating ? "transform 0.2s ease-out" : "none",
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/97"
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 z-20 rounded-full bg-white/10 px-3 py-1 text-2xl text-white hover:bg-white/20 sm:right-4 sm:top-4"
        aria-label="Close lightbox"
      >
        ×
      </button>
      {canSwipe && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
            className="absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-2xl text-white hover:bg-white/20 sm:left-4"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
            className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-2xl text-white hover:bg-white/20 sm:right-4"
            aria-label="Next photo"
          >
            ›
          </button>
        </>
      )}
      <div
        className="absolute inset-x-0 top-14 bottom-0 touch-none sm:inset-x-6 sm:top-16 sm:bottom-6"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="relative mx-auto size-full overflow-hidden sm:max-w-5xl">
          <div
            className="flex h-full"
            style={{
              width: `${panelCount * 100}%`,
              ...slideStyle,
            }}
          >
            {photoPanels.map(({ photo, key }) => (
              <div
                key={key}
                className="relative h-full shrink-0"
                style={{ width: `${100 / panelCount}%` }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-contain select-none"
                  sizes="100vw"
                  priority={key.startsWith("current")}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {photos[index].caption && (
        <p className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-black/50 px-4 py-3 text-center text-sm text-white/90 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {photos[index].caption}
        </p>
      )}
    </div>
  );
}
