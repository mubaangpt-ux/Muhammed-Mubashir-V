import { useState } from "react";
import { creativeWorkAssets, type Company } from "../data";
import Lightbox from "../Lightbox";

type Props = {
  company: Company;
};

export default function PostersTab({ company }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const count = company.posterCount ?? 9;
  const images = Array.from({ length: count }, (_, index) => ({
    src: creativeWorkAssets.poster(company, index),
    alt: `${company.name} poster ${String(index + 1).padStart(2, "0")}`,
  }));

  return (
    <>
      <div className="columns-2 gap-2 sm:columns-3 lg:columns-4">
        {images.map(({ src, alt }, index) => (
          <div
            key={src}
            className="group relative mb-2 break-inside-avoid cursor-pointer overflow-hidden rounded-[22px] bg-white/5 active:opacity-75 md:mb-3"
            onClick={() => setLightboxIdx(index)}
          >
            <img
              src={src}
              alt={alt}
              className="block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors group-hover:bg-black/18 group-hover:opacity-100">
              <svg className="h-6 w-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          images={images.map((image) => image.src)}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}
