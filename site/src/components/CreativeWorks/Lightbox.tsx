import { useEffect, useState } from "react";

type Props = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

export default function Lightbox({ images, initialIndex, onClose }: Props) {
  const [idx, setIdx] = useState(initialIndex);

  useEffect(() => {
    setIdx(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIdx((current) => Math.min(current + 1, images.length - 1));
      if (event.key === "ArrowLeft") setIdx((current) => Math.max(current - 1, 0));
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="Close lightbox"
      >
        X
      </button>

      {idx > 0 && (
        <button
          type="button"
          className="absolute left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
          onClick={(event) => {
            event.stopPropagation();
            setIdx((current) => current - 1);
          }}
          aria-label="Previous image"
        >
          {"<"}
        </button>
      )}

      <img
        src={images[idx]}
        alt=""
        className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
        style={{ animation: "lightboxIn 0.25s ease forwards" }}
        onClick={(event) => event.stopPropagation()}
      />

      {idx < images.length - 1 && (
        <button
          type="button"
          className="absolute right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
          onClick={(event) => {
            event.stopPropagation();
            setIdx((current) => current + 1);
          }}
          aria-label="Next image"
        >
          {">"}
        </button>
      )}

      <div className="absolute bottom-6 font-mono text-sm text-white/40">
        {idx + 1} / {images.length}
      </div>
    </div>
  );
}
