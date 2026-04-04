import { useEffect, useMemo, useRef, useState } from "react";
import { creativeWorkAssets, type Company, type CreativeImageItem } from "../data";
import Lightbox from "../Lightbox";

type Props = {
  company: Company;
};

type LightboxState = {
  images: string[];
  initialIndex: number;
} | null;

type NormalizedPosterItem =
  | {
      type: "single";
      alt: string;
      slides: CreativeImageItem[];
    }
  | {
      type: "carousel";
      alt: string;
      slides: CreativeImageItem[];
    };

function normalizePosterItems(company: Company): NormalizedPosterItem[] {
  if (company.posterGallery?.length) {
    return company.posterGallery
      .map((item): NormalizedPosterItem | null => {
        if (item.type === "carousel" && item.slides?.length) {
          return {
            type: "carousel",
            alt: item.alt,
            slides: item.slides,
          };
        }

        if (item.type === "single" && item.src) {
          return {
            type: "single",
            alt: item.alt,
            slides: [{ src: item.src, alt: item.alt, variant: "portrait" }],
          };
        }

        return null;
      })
      .filter((item): item is NormalizedPosterItem => item !== null);
  }

  const count = company.posterCount ?? 9;
  return Array.from({ length: count }, (_, index) => ({
    type: "single" as const,
    alt: `${company.name} poster ${String(index + 1).padStart(2, "0")}`,
    slides: [
      {
        src: creativeWorkAssets.poster(company, index),
        alt: `${company.name} poster ${String(index + 1).padStart(2, "0")}`,
        variant: "portrait",
      },
    ],
  }));
}

function PosterTile({
  item,
  onOpen,
}: {
  item: NormalizedPosterItem;
  onOpen: (initialIndex: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startXRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const slideCount = item.slides.length;
  const isCarousel = item.type === "carousel" && slideCount > 1;

  useEffect(() => {
    setCurrentIndex(0);
  }, [item.alt, slideCount]);

  useEffect(() => {
    if (!isCarousel) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [isCarousel, slideCount]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!isCarousel) return;
    startXRef.current = event.clientX;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!isCarousel || startXRef.current === null) return;
    const delta = event.clientX - startXRef.current;
    startXRef.current = null;

    if (Math.abs(delta) < 30) return;

    suppressClickRef.current = true;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 120);

    setCurrentIndex((prev) => {
      if (delta < 0) return (prev + 1) % slideCount;
      return (prev - 1 + slideCount) % slideCount;
    });
  }

  function handleClick() {
    if (suppressClickRef.current) return;
    onOpen(currentIndex);
  }

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-[22px] bg-white/5 active:opacity-75"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 14px 36px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        touchAction: isCarousel ? "pan-y" : "auto",
      }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_55%),linear-gradient(180deg,rgba(9,13,24,0.82),rgba(6,8,16,0.94))]">
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {item.slides.map((slide) => (
            <div key={slide.src} className="h-full w-full shrink-0">
              <img
                src={slide.src}
                alt={slide.alt}
                className="block h-full w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {isCarousel && (
          <>
            <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-white/70 backdrop-blur-md">
              Carousel
            </div>
            <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-white/70 backdrop-blur-md">
              {currentIndex + 1} / {slideCount}
            </div>
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
              {item.slides.map((_, dotIndex) => (
                <button
                  key={`${item.alt}-dot-${dotIndex}`}
                  type="button"
                  aria-label={`View slide ${dotIndex + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    dotIndex === currentIndex ? "w-5 bg-white" : "w-1.5 bg-white/35"
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setCurrentIndex(dotIndex);
                  }}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors group-hover:bg-black/18 group-hover:opacity-100">
          <svg className="h-6 w-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function PostersTab({ company }: Props) {
  const [lightboxState, setLightboxState] = useState<LightboxState>(null);
  const posterItems = useMemo(() => normalizePosterItems(company), [company]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {posterItems.map((item) => (
          <PosterTile
            key={`${item.alt}-${item.slides[0]?.src ?? "empty"}`}
            item={item}
            onOpen={(initialIndex) =>
              setLightboxState({
                images: item.slides.map((slide) => slide.src),
                initialIndex,
              })
            }
          />
        ))}
      </div>

      {lightboxState && (
        <Lightbox
          images={lightboxState.images}
          initialIndex={lightboxState.initialIndex}
          onClose={() => setLightboxState(null)}
        />
      )}
    </>
  );
}
