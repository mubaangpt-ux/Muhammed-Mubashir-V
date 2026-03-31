import { useState, useRef } from "react";
import { creativeWorkAssets, type Company } from "../data";

type Props = {
  company: Company;
};

export default function ReelsTab({ company }: Props) {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  
  // Define 6 mock reels for the grid view
  const reels = Array.from({ length: 6 }, (_, index) => ({
    video: creativeWorkAssets.reel(company, index),
    cover: creativeWorkAssets.reelCover(company, index),
  }));

  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <>
      {/* Instagram Reels Grid View (3 columns, 9:16 aspect ratio) */}
      <div className="grid grid-cols-3 gap-1 md:gap-2">
        {reels.map((reel, index) => (
          <div
            key={index}
            className="group relative aspect-[9/16] cursor-pointer overflow-hidden bg-white/5 active:opacity-75"
            onClick={() => setPlayingIdx(index)}
          >
            <img
              src={reel.cover}
              alt={`Reel ${index + 1} cover`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                 // Fallback if cover doesn't exist placeholder
                 (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${company.id}-reel-${index}/400/700`;
              }}
            />
            
            {/* Play icon overlay */}
            <div className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center justify-center text-white drop-shadow-md">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2 md:p-3">
               <span className="text-white text-xs font-semibold flex items-center gap-1">
                 <svg className="w-3.5 h-3.5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                 </svg>
                 {(Math.random() * 100 + 10).toFixed(1)}K
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Screen Cinematic Video Player Modal */}
      {playingIdx !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300"
          onClick={() => setPlayingIdx(null)}
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            onClick={(e) => {
              e.stopPropagation();
              setPlayingIdx(null);
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Video Container - 9:16 matching mobile dimensions */}
          <div 
            className="relative h-full max-h-[90vh] aspect-[9/16] bg-black/50 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] flex items-center justify-center transform scale-95 md:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
             {/* If video doesn't exist locally, it will fail to load but user should place their MP4s here! */}
            <video 
              ref={videoRef}
              src={reels[playingIdx].video}
              autoPlay
              controls
              playsInline
              loop
              className="absolute inset-0 w-full h-full object-cover"
              poster={reels[playingIdx].cover}
            />
          </div>
        </div>
      )}
    </>
  );
}
