import { useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

export default function Lightbox({ images, initialIndex, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Scroll to initial index on mount
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      // Scroll to the exact position based on viewport width
      container.scrollLeft = container.clientWidth * initialIndex;
    }
  }, [initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      if (event.key === "ArrowRight") {
        containerRef.current.scrollBy({ left: width, behavior: "smooth" });
      }
      if (event.key === "ArrowLeft") {
        containerRef.current.scrollBy({ left: -width, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Track the current visible slide to update the dot indicators
  const handleScroll = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const scrollLeft = containerRef.current.scrollLeft;
    // Calculate which slide is most visible
    const index = Math.round(scrollLeft / width);
    if (index !== currentIndex && index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl"
      onClick={onClose}
    >
      {/* Top Bar Navigation */}
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-end px-6 z-10 pointer-events-none">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/30 pointer-events-auto shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          aria-label="Close lightbox"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Swipeable Carousel (Instagram Post Style) */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-x-contain"
        style={{ scrollBehavior: "smooth" }}
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((img, idx) => (
          <div key={idx} className="min-w-full h-full flex items-center justify-center snap-center px-4 md:px-12 py-16">
            <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
              <img
                src={img}
                alt={`Slide ${idx + 1}`}
                className="max-h-full max-w-full rounded-[24px] md:rounded-[32px] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Instagram-style Carousel Dots indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex 
                ? "w-2.5 h-2.5 bg-[#2563eb] shadow-[0_0_10px_rgba(37,99,235,0.8)]" 
                : "w-2.5 h-2.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
