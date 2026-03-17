import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  WORK_HERO_FRAME_COUNT,
  WORK_HERO_IMAGE_ALT,
  WORK_HERO_IMAGE_CAPTION,
  WORK_HERO_IMAGE_HEIGHT,
  WORK_HERO_IMAGE_WIDTH,
  WORK_HERO_POSTER_SRC,
  getWorkHeroFrameSrc,
} from "../../lib/work-sequence";

declare global {
  interface Window {
    __mubWorkSequenceWarm?: {
      started?: boolean;
      loaded?: number;
      total?: number;
      done?: boolean;
    };
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const HEADER_OFFSET = 88;

const findNearestLoadedFrame = (frames: Array<HTMLImageElement | null>, target: number) => {
  if (frames[target]) return target;

  for (let offset = 1; offset < frames.length; offset += 1) {
    const previous = target - offset;
    const next = target + offset;

    if (previous >= 0 && frames[previous]) return previous;
    if (next < frames.length && frames[next]) return next;
  }

  return -1;
};

export default function WorkSequenceHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dprRef = useRef(1);
  const framesRef = useRef<Array<HTMLImageElement | null>>(Array(WORK_HERO_FRAME_COUNT).fill(null));
  const drawRafRef = useRef<number | null>(null);
  const targetFrameRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const lastVisibleFrameRef = useRef(-1);
  const loadedCountRef = useRef(0);
  const firstFrameReadyRef = useRef(false);
  const destroyedRef = useRef(false);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const reduceMotion = useReducedMotion();

  const sectionHeight = useMemo(
    () =>
      reduceMotion
        ? `calc(140svh + ${HEADER_OFFSET}px)`
        : `calc(min(240svh, 3200px) + ${HEADER_OFFSET}px)`,
    [reduceMotion],
  );
  const stageHeight = useMemo(() => `calc(100svh - ${HEADER_OFFSET}px)`, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 240 : 160,
    damping: reduceMotion ? 36 : 28,
    mass: 0.22,
  });

  const drawFrame = (frameIndex: number, force = false) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const nearestFrame = findNearestLoadedFrame(framesRef.current, frameIndex);
    const fallbackIndex = nearestFrame >= 0 ? nearestFrame : lastVisibleFrameRef.current;

    if (fallbackIndex < 0) return;
    if (!force && lastDrawnFrameRef.current === fallbackIndex) return;

    const image = framesRef.current[fallbackIndex];
    if (!image) return;

    const width = canvas.width / dprRef.current;
    const height = canvas.height / dprRef.current;
    const rootStyles = getComputedStyle(document.documentElement);
    const background = rootStyles.getPropertyValue("--bg-primary").trim() || "#07090f";
    const accent = rootStyles.getPropertyValue("--accent").trim() || "#3b82f6";
    const accentSoft = rootStyles.getPropertyValue("--accent-soft").trim() || "#93c5fd";

    ctx.save();
    ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;
    const scale = Math.min(width / imageWidth, height / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    const offsetX = (width - drawWidth) * 0.5;
    const offsetY = (height - drawHeight) * 0.5;

    const coverScale = Math.max(width / imageWidth, height / imageHeight);
    const coverWidth = imageWidth * coverScale;
    const coverHeight = imageHeight * coverScale;
    const coverX = (width - coverWidth) * 0.5;
    const coverY = (height - coverHeight) * 0.5;

    ctx.save();
    ctx.globalAlpha = 0.26;
    ctx.filter = "blur(28px) saturate(1.1)";
    ctx.drawImage(image, coverX, coverY, coverWidth, coverHeight);
    ctx.restore();

    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

    const topFade = ctx.createLinearGradient(0, 0, 0, height * 0.24);
    topFade.addColorStop(0, `${background}c8`);
    topFade.addColorStop(1, `${background}00`);
    ctx.fillStyle = topFade;
    ctx.fillRect(0, 0, width, height * 0.24);

    const bottomFade = ctx.createLinearGradient(0, height * 0.68, 0, height);
    bottomFade.addColorStop(0, `${background}00`);
    bottomFade.addColorStop(1, `${background}f5`);
    ctx.fillStyle = bottomFade;
    ctx.fillRect(0, height * 0.68, width, height * 0.32);

    const skyHalo = ctx.createRadialGradient(width * 0.5, height * 0.18, 0, width * 0.5, height * 0.16, width * 0.48);
    skyHalo.addColorStop(0, `${accentSoft}20`);
    skyHalo.addColorStop(0.45, `${accent}10`);
    skyHalo.addColorStop(1, `${background}00`);
    ctx.fillStyle = skyHalo;
    ctx.fillRect(0, 0, width, height * 0.56);
    ctx.restore();

    lastDrawnFrameRef.current = fallbackIndex;
    lastVisibleFrameRef.current = fallbackIndex;
  };

  const scheduleDraw = (frameIndex: number, force = false) => {
    targetFrameRef.current = frameIndex;
    if (drawRafRef.current !== null) return;

    drawRafRef.current = window.requestAnimationFrame(() => {
      drawRafRef.current = null;
      drawFrame(targetFrameRef.current, force);
    });
  };

  useMotionValueEvent(smoothProgress, "change", (value) => {
    const nextFrame = clamp(Math.round(value * (WORK_HERO_FRAME_COUNT - 1)), 0, WORK_HERO_FRAME_COUNT - 1);
    scheduleDraw(nextFrame);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const setCanvasSize = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctxRef.current = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });
      if (!ctxRef.current) return;
      ctxRef.current.imageSmoothingEnabled = true;
      drawFrame(targetFrameRef.current, true);
    };

    setCanvasSize();
    const observer = new ResizeObserver(() => setCanvasSize());
    observer.observe(stage);
    window.addEventListener("orientationchange", setCanvasSize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", setCanvasSize);
    };
  }, []);

  useEffect(() => {
    destroyedRef.current = false;
    const concurrency = window.matchMedia("(pointer: coarse)").matches ? 4 : 8;
    const priorityFrames = Array.from({ length: Math.min(24, WORK_HERO_FRAME_COUNT) }, (_, index) => index);
    const remainingFrames = Array.from(
      { length: WORK_HERO_FRAME_COUNT - priorityFrames.length },
      (_, index) => index + priorityFrames.length,
    );
    const queue = [...priorityFrames, ...remainingFrames];
    let active = 0;
    let cursor = 0;

    const onFrameReady = (frameIndex: number, image: HTMLImageElement) => {
      if (destroyedRef.current) return;
      if (!framesRef.current[frameIndex]) {
        framesRef.current[frameIndex] = image;
        loadedCountRef.current += 1;
      }

      if (frameIndex === 0 && !firstFrameReadyRef.current) {
        firstFrameReadyRef.current = true;
        setFirstFrameReady(true);
      }

      scheduleDraw(targetFrameRef.current, frameIndex === 0);
    };

    const loadOne = (frameIndex: number) =>
      new Promise<void>((resolve) => {
        const image = new Image();
        image.decoding = "async";
        image.loading = "eager";
        if ("fetchPriority" in image) {
          image.fetchPriority = frameIndex < 24 ? "high" : "low";
        }

        image.onload = async () => {
          try {
            if (typeof image.decode === "function") {
              await image.decode();
            }
          } catch {}
          onFrameReady(frameIndex, image);
          resolve();
        };

        image.onerror = () => resolve();
        image.src = getWorkHeroFrameSrc(frameIndex);
      });

    const pump = () => {
      if (destroyedRef.current) return;
      while (active < concurrency && cursor < queue.length) {
        const frameIndex = queue[cursor];
        cursor += 1;
        active += 1;
        loadOne(frameIndex).finally(() => {
          active -= 1;
          if (!destroyedRef.current) pump();
        });
      }
    };

    pump();

    return () => {
      destroyedRef.current = true;
      if (drawRafRef.current !== null) {
        window.cancelAnimationFrame(drawRafRef.current);
        drawRafRef.current = null;
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative -mt-[88px] overflow-clip"
      style={{ height: sectionHeight }}
      aria-describedby="work-sequence-caption"
    >
      <div
        ref={stageRef}
        className="sticky top-[88px] overflow-hidden"
        style={{ height: stageHeight }}
      >
        <img
          src={WORK_HERO_POSTER_SRC}
          alt={WORK_HERO_IMAGE_ALT}
          width={WORK_HERO_IMAGE_WIDTH}
          height={WORK_HERO_IMAGE_HEIGHT}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className={`absolute inset-0 block h-full w-full bg-[var(--bg-primary)] object-contain object-center transition-opacity duration-500 ${
            firstFrameReady ? "opacity-0" : "opacity-100"
          }`}
          style={{ filter: "drop-shadow(0 0 28px rgba(7, 9, 15, 0.55))" }}
        />
        <img
          src={WORK_HERO_POSTER_SRC}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 block h-full w-full scale-[1.08] object-cover object-center opacity-30 blur-2xl transition-opacity duration-500 ${
            firstFrameReady ? "opacity-0" : "opacity-30"
          }`}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full bg-[var(--bg-primary)]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-x-[4%] top-[2%] h-[48%] opacity-90 mix-blend-screen"
          style={{
            backgroundImage: [
              "radial-gradient(circle at 4% 10%, rgba(147,197,253,0.95) 0 1.15px, transparent 2px)",
              "radial-gradient(circle at 8% 28%, rgba(255,255,255,0.82) 0 0.95px, transparent 1.65px)",
              "radial-gradient(circle at 13% 18%, rgba(96,165,250,0.88) 0 1.25px, transparent 2.2px)",
              "radial-gradient(circle at 18% 7%, rgba(255,255,255,0.72) 0 0.9px, transparent 1.55px)",
              "radial-gradient(circle at 23% 24%, rgba(147,197,253,0.95) 0 1.1px, transparent 1.95px)",
              "radial-gradient(circle at 29% 14%, rgba(255,255,255,0.76) 0 0.9px, transparent 1.55px)",
              "radial-gradient(circle at 35% 6%, rgba(96,165,250,0.92) 0 1.18px, transparent 2.05px)",
              "radial-gradient(circle at 41% 22%, rgba(255,255,255,0.84) 0 1px, transparent 1.75px)",
              "radial-gradient(circle at 47% 11%, rgba(147,197,253,0.9) 0 1.12px, transparent 1.95px)",
              "radial-gradient(circle at 53% 4%, rgba(255,255,255,0.72) 0 0.85px, transparent 1.45px)",
              "radial-gradient(circle at 58% 19%, rgba(96,165,250,0.88) 0 1.1px, transparent 1.95px)",
              "radial-gradient(circle at 63% 9%, rgba(255,255,255,0.8) 0 0.98px, transparent 1.7px)",
              "radial-gradient(circle at 69% 25%, rgba(147,197,253,0.95) 0 1.16px, transparent 2.05px)",
              "radial-gradient(circle at 74% 13%, rgba(255,255,255,0.76) 0 0.9px, transparent 1.55px)",
              "radial-gradient(circle at 79% 6%, rgba(96,165,250,0.9) 0 1.16px, transparent 2.02px)",
              "radial-gradient(circle at 84% 21%, rgba(255,255,255,0.86) 0 1px, transparent 1.7px)",
              "radial-gradient(circle at 90% 12%, rgba(147,197,253,0.92) 0 1.08px, transparent 1.88px)",
              "radial-gradient(circle at 96% 27%, rgba(255,255,255,0.74) 0 0.88px, transparent 1.5px)"
            ].join(", "),
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[52%] bg-[radial-gradient(ellipse_at_top,rgba(147,197,253,0.10),rgba(7,9,15,0)_68%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,rgba(7,9,15,0)_0%,rgba(7,9,15,0.26)_34%,rgba(7,9,15,0.84)_78%,rgba(7,9,15,1)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-[-8%] h-24 bg-[radial-gradient(ellipse_at_center,rgba(7,9,15,0.78)_0%,rgba(7,9,15,0.28)_42%,rgba(7,9,15,0)_72%)] blur-3xl" />

        {!firstFrameReady && (
          <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center px-4">
            <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-slate-300 backdrop-blur-xl">
              Preparing skyline sequence
            </div>
          </div>
        )}

        <p id="work-sequence-caption" className="sr-only">
          {WORK_HERO_IMAGE_CAPTION}
        </p>
      </div>
    </section>
  );
}
