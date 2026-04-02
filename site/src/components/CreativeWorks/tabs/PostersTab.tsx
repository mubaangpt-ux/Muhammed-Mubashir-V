import { useState } from "react";
import { creativeWorkAssets, type Company } from "../data";
import Lightbox from "../Lightbox";

type Props = {
  company: Company;
};

export default function PostersTab({ company }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  
  // Instagram typically shows rows of 3. We'll show 9 mock posters.
  const count = company.posterCount ?? 9;
  const images = Array.from({ length: count }, (_, index) => creativeWorkAssets.poster(company, index));

  return (
    <>
      {/* Instagram Profile Grid Look (3 columns, 2px gap) */}
      <div className="grid grid-cols-3 gap-1 md:gap-2">
        {images.map((src, index) => (
          <div
            key={src}
            className="group relative aspect-square cursor-pointer overflow-hidden bg-white/5 active:opacity-75"
            onClick={() => setLightboxIdx(index)}
          >
            <img
              src={src}
              alt={`Poster ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100">
               <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
               </svg>
            </div>
          </div>
        ))}
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}
