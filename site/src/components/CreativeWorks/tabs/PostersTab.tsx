import { useState } from "react";

import { creativeWorkAssets, type Company } from "../data";
import Lightbox from "../Lightbox";

type Props = {
  company: Company;
};

export default function PostersTab({ company }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const images = Array.from({ length: 9 }, (_, index) => creativeWorkAssets.poster(company, index));

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {images.map((src, index) => (
          <div
            key={src}
            className="group aspect-square cursor-zoom-in overflow-hidden rounded-2xl"
            onClick={() => setLightboxIdx(index)}
          >
            <img
              src={src}
              alt={`Poster ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
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
