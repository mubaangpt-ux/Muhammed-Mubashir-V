import { useState, useRef } from "react";
import { creativeWorkAssets, type Company } from "../data";

type Props = {
  company: Company;
};

export default function ReelsTab({ company }: Props) {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const count = company.reelCount ?? 6;

  const reels = Array.from({ length: count }, (_, index) => ({
    video: creativeWorkAssets.reel(company, index),
    cover: creativeWorkAssets.reelCover(company, index),
    label: `Reel ${String(index + 1).padStart(2, "0")}`,
  }));

  return (
    <>
      {/* Instagram Reels 3-column grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-1.5">
        {reels.map((reel, index) => (
          <div
            key={index}
            className="group relative aspect-[9/16] cursor-pointer overflow-hidden bg-white/5 active:opacity-75"
            onClick={() => setPlayingIdx(index)}
          >
            <img
              src={reel.cover}
              alt={reel.label}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            {/* Play icon */}
            <div className="absolute top-2 right-2 text-white drop-shadow">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {/* Bottom gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
              <span className="text-white text-[10px] font-semibold font-mono">{reel.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen video player */}
      {playingIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
          onClick={() => setPlayingIdx(null)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); setPlayingIdx(null); }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative max-h-[80vh] aspect-[9/16] overflow-hidden rounded-[28px] shadow-[0_20px_80px_rgba(0,0,0,0.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={reels[playingIdx].video}
              autoPlay
              controls
              playsInline
              loop
              className="h-full w-full object-cover"
              poster={reels[playingIdx].cover}
            />
          </div>
        </div>
      )}
    </>
  );
}
