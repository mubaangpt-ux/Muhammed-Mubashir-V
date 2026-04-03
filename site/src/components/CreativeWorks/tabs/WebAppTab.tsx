import { useMemo, useState } from "react";

import Lightbox from "../Lightbox";
import { creativeWorkAssets, type Company, type CreativeImageItem } from "../data";

type Props = {
  company: Company;
};

const variantClasses: Record<NonNullable<CreativeImageItem["variant"]>, string> = {
  portrait: "md:row-span-9",
  "portrait-tall": "md:row-span-12",
  landscape: "md:col-span-2 md:row-span-7",
};

export default function WebAppTab({ company }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const gallery = useMemo<CreativeImageItem[]>(
    () =>
      company.webappGallery ??
      Array.from({ length: 3 }, (_, index) => ({
        src: creativeWorkAssets.webapp(company, index),
        alt: `${company.name} web app screen ${index + 1}`,
        variant: "landscape" as const,
      })),
    [company],
  );

  return (
    <>
      <div className="mb-5 max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">
          Product screens
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300/80">
          Ordered product views covering login, onboarding, delivery setup, client dashboard,
          referral tracking, role permissions, and internal admin operations.
        </p>
      </div>

      <div className="grid auto-rows-[28px] grid-cols-1 gap-3 md:grid-cols-3">
        {gallery.map((item, index) => {
          const variant = item.variant ?? "portrait";
          return (
            <button
              key={item.src}
              type="button"
              onClick={() => setLightboxIdx(index)}
              className={`group relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] text-left transition-transform duration-300 hover:-translate-y-0.5 ${variantClasses[variant]}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-white/[0.03]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </button>
          );
        })}
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          images={gallery.map((item) => item.src)}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}
