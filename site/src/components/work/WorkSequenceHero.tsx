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

const pickRenderableFrame = (
  frames: Array<HTMLImageElement | null>,
  target: number,
  lastVisible: number,
) => {
  if (frames[target]) return target;
  if (lastVisible >= 0 && frames[lastVisible]) return lastVisible;
  return findNearestLoadedFrame(frames, target);
};

export default function WorkSequenceHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dprRef = useRef(1);
  const framesRef = useRef<Array<HTMLImageElement | null>>(Array(WORK_HERO_FRAME_COUNT).fill(null));
  const blendCanvasRef = useRef<HTMLCanvasElement | null>(null);
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

    const fallbackIndex = pickRenderableFrame(
      framesRef.current,
      frameIndex,
      lastVisibleFrameRef.current,
    );

    if (fallbackIndex < 0) return;
    if (!force && lastDrawnFrameRef.current === fallbackIndex) return;

    const image = framesRef.current[fallbackIndex];
    if (!image) return;

    const width = canvas.width / dprRef.current;
    const height = canvas.height / dprRef.current;
    const rootStyles = getComputedStyle(document.documentElement);
    const background = rootStyles.getPropertyValue("--bg-primary").trim() || "#07090f";
    const backgroundSoft = rootStyles.getPropertyValue("--bg-secondary").trim() || "#0c1220";
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
    const offsetY = Math.max(0, height - drawHeight + height * 0.012);

    const sideBleedWidth = Math.max(48, offsetX + drawWidth * 0.065);
    const bottomBleedTop = offsetY + drawHeight * 0.88;
    const bottomBleedHeight = Math.max(0, height - bottomBleedTop + 92);

    ctx.save();
    ctx.globalAlpha = 0.34;
    ctx.filter = "blur(22px) brightness(0.7) saturate(0.92)";
    ctx.drawImage(
      image,
      imageWidth * 0.02,
      imageHeight * 0.05,
      imageWidth * 0.12,
      imageHeight * 0.86,
      0,
      offsetY - 10,
      sideBleedWidth,
      drawHeight + 20,
    );
    ctx.drawImage(
      image,
      imageWidth * 0.86,
      imageHeight * 0.05,
      imageWidth * 0.12,
      imageHeight * 0.86,
      width - sideBleedWidth,
      offsetY - 10,
      sideBleedWidth,
      drawHeight + 20,
    );
    if (bottomBleedHeight > 0) {
      ctx.drawImage(
        image,
        imageWidth * 0.08,
        imageHeight * 0.8,
        imageWidth * 0.84,
        imageHeight * 0.16,
        offsetX - drawWidth * 0.03,
        bottomBleedTop,
        drawWidth * 1.06,
        bottomBleedHeight,
      );
    }
    ctx.restore();

    let blendCanvas = blendCanvasRef.current;
    if (!blendCanvas) {
      blendCanvas = document.createElement("canvas");
      blendCanvasRef.current = blendCanvas;
    }

    if (blendCanvas.width !== canvas.width || blendCanvas.height !== canvas.height) {
      blendCanvas.width = canvas.width;
      blendCanvas.height = canvas.height;
    }

    const blendCtx = blendCanvas.getContext("2d");
    if (blendCtx) {
      blendCtx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
      blendCtx.clearRect(0, 0, width, height);
      blendCtx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
      blendCtx.globalCompositeOperation = "destination-in";

      const horizontalMask = blendCtx.createLinearGradient(offsetX, 0, offsetX + drawWidth, 0);
      horizontalMask.addColorStop(0, "rgba(255,255,255,0)");
      horizontalMask.addColorStop(0.1, "rgba(255,255,255,0.94)");
      horizontalMask.addColorStop(0.9, "rgba(255,255,255,0.94)");
      horizontalMask.addColorStop(1, "rgba(255,255,255,0)");
      blendCtx.fillStyle = horizontalMask;
      blendCtx.fillRect(offsetX, offsetY, drawWidth, drawHeight);

      const verticalMask = blendCtx.createLinearGradient(0, offsetY, 0, offsetY + drawHeight);
      verticalMask.addColorStop(0, "rgba(255,255,255,0.97)");
      verticalMask.addColorStop(0.74, "rgba(255,255,255,0.94)");
      verticalMask.addColorStop(0.9, "rgba(255,255,255,0.72)");
      verticalMask.addColorStop(0.975, "rgba(255,255,255,0.24)");
      verticalMask.addColorStop(1, "rgba(255,255,255,0)");
      blendCtx.fillStyle = verticalMask;
      blendCtx.fillRect(offsetX, offsetY, drawWidth, drawHeight);

      blendCtx.globalCompositeOperation = "source-over";
      ctx.drawImage(blendCanvas, 0, 0, width, height);
    } else {
      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    }

    const topFade = ctx.createLinearGradient(0, 0, 0, height * 0.18);
    topFade.addColorStop(0, `${background}90`);
    topFade.addColorStop(1, `${background}00`);
    ctx.fillStyle = topFade;
    ctx.fillRect(0, 0, width, height * 0.18);

    const leftFade = ctx.createLinearGradient(0, 0, width * 0.14, 0);
    leftFade.addColorStop(0, `${background}e6`);
    leftFade.addColorStop(0.34, `${backgroundSoft}40`);
    leftFade.addColorStop(1, `${background}00`);
    ctx.fillStyle = leftFade;
    ctx.fillRect(0, 0, width * 0.14, height);

    const rightFade = ctx.createLinearGradient(width, 0, width - width * 0.14, 0);
    rightFade.addColorStop(0, `${background}e6`);
    rightFade.addColorStop(0.34, `${backgroundSoft}40`);
    rightFade.addColorStop(1, `${background}00`);
    ctx.fillStyle = rightFade;
    ctx.fillRect(width - width * 0.14, 0, width * 0.14, height);

    const bottomFade = ctx.createLinearGradient(0, height * 0.56, 0, height);
    bottomFade.addColorStop(0, `${background}00`);
    bottomFade.addColorStop(0.34, `${background}14`);
    bottomFade.addColorStop(0.62, `${backgroundSoft}54`);
    bottomFade.addColorStop(0.86, `${background}c6`);
    bottomFade.addColorStop(1, `${background}ff`);
    ctx.fillStyle = bottomFade;
    ctx.fillRect(0, height * 0.56, width, height * 0.44);

    const skyHalo = ctx.createRadialGradient(width * 0.5, height * 0.18, 0, width * 0.5, height * 0.16, width * 0.52);
    skyHalo.addColorStop(0, `${accentSoft}20`);
    skyHalo.addColorStop(0.45, `${accent}10`);
    skyHalo.addColorStop(1, `${background}00`);
    ctx.fillStyle = skyHalo;
    ctx.fillRect(0, 0, width, height * 0.56);

    const bottomHalo = ctx.createRadialGradient(width * 0.5, height * 1.04, 0, width * 0.5, height * 0.98, width * 0.58);
    bottomHalo.addColorStop(0, `${backgroundSoft}c6`);
    bottomHalo.addColorStop(0.52, `${background}78`);
    bottomHalo.addColorStop(1, `${background}00`);
    ctx.fillStyle = bottomHalo;
    ctx.fillRect(0, height * 0.74, width, height * 0.32);
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
      });
      if (!ctxRef.current) return;
      ctxRef.current.imageSmoothingEnabled = true;
      ctxRef.current.imageSmoothingQuality = "high";
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
          style={{ filter: "drop-shadow(0 0 12px rgba(7, 9, 15, 0.28))" }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full bg-[var(--bg-primary)]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[56%] opacity-90 mix-blend-screen"
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
              "radial-gradient(circle at 96% 27%, rgba(255,255,255,0.74) 0 0.88px, transparent 1.5px)",
              "radial-gradient(circle at 6% 40%, rgba(255,255,255,0.72) 0 0.85px, transparent 1.5px)",
              "radial-gradient(circle at 14% 34%, rgba(96,165,250,0.88) 0 1.1px, transparent 1.95px)",
              "radial-gradient(circle at 21% 44%, rgba(147,197,253,0.82) 0 1px, transparent 1.72px)",
              "radial-gradient(circle at 31% 38%, rgba(255,255,255,0.78) 0 0.9px, transparent 1.55px)",
              "radial-gradient(circle at 39% 46%, rgba(96,165,250,0.9) 0 1.15px, transparent 2px)",
              "radial-gradient(circle at 48% 35%, rgba(255,255,255,0.74) 0 0.88px, transparent 1.52px)",
              "radial-gradient(circle at 57% 43%, rgba(147,197,253,0.84) 0 1px, transparent 1.76px)",
              "radial-gradient(circle at 66% 37%, rgba(255,255,255,0.76) 0 0.9px, transparent 1.55px)",
              "radial-gradient(circle at 75% 45%, rgba(96,165,250,0.88) 0 1.12px, transparent 1.96px)",
              "radial-gradient(circle at 84% 39%, rgba(255,255,255,0.72) 0 0.86px, transparent 1.48px)",
              "radial-gradient(circle at 93% 41%, rgba(147,197,253,0.82) 0 1px, transparent 1.75px)",
              "radial-gradient(circle at 9% 5%, rgba(255,255,255,0.76) 0 0.9px, transparent 1.55px)",
              "radial-gradient(circle at 16% 12%, rgba(147,197,253,0.88) 0 1.05px, transparent 1.85px)",
              "radial-gradient(circle at 27% 9%, rgba(255,255,255,0.72) 0 0.86px, transparent 1.48px)",
              "radial-gradient(circle at 33% 16%, rgba(96,165,250,0.84) 0 1px, transparent 1.78px)",
              "radial-gradient(circle at 44% 8%, rgba(255,255,255,0.78) 0 0.92px, transparent 1.56px)",
              "radial-gradient(circle at 52% 14%, rgba(147,197,253,0.9) 0 1.08px, transparent 1.88px)",
              "radial-gradient(circle at 61% 7%, rgba(255,255,255,0.72) 0 0.86px, transparent 1.5px)",
              "radial-gradient(circle at 68% 15%, rgba(96,165,250,0.86) 0 1.04px, transparent 1.82px)",
              "radial-gradient(circle at 77% 9%, rgba(255,255,255,0.76) 0 0.9px, transparent 1.54px)",
              "radial-gradient(circle at 86% 14%, rgba(147,197,253,0.92) 0 1.08px, transparent 1.9px)",
              "radial-gradient(circle at 94% 8%, rgba(255,255,255,0.7) 0 0.82px, transparent 1.44px)",
              "radial-gradient(circle at 12% 31%, rgba(255,255,255,0.68) 0 0.84px, transparent 1.42px)",
              "radial-gradient(circle at 24% 28%, rgba(147,197,253,0.82) 0 1px, transparent 1.72px)",
              "radial-gradient(circle at 37% 33%, rgba(255,255,255,0.72) 0 0.86px, transparent 1.5px)",
              "radial-gradient(circle at 49% 29%, rgba(96,165,250,0.86) 0 1.04px, transparent 1.82px)",
              "radial-gradient(circle at 62% 34%, rgba(255,255,255,0.74) 0 0.9px, transparent 1.54px)",
              "radial-gradient(circle at 74% 30%, rgba(147,197,253,0.82) 0 1px, transparent 1.75px)",
              "radial-gradient(circle at 88% 32%, rgba(255,255,255,0.68) 0 0.84px, transparent 1.42px)"
            ].join(", "),
            maskImage: "linear-gradient(180deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.95) 62%, rgba(0,0,0,0.24) 90%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[56%] bg-[radial-gradient(ellipse_at_top,rgba(147,197,253,0.10),rgba(7,9,15,0)_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,rgba(12,18,32,0)_0%,rgba(12,18,32,0.12)_26%,rgba(12,18,32,0.34)_54%,rgba(7,9,15,0.82)_84%,rgba(7,9,15,0.96)_100%)]" />
        <div className="pointer-events-none absolute inset-x-[4%] bottom-[-12%] h-48 bg-[radial-gradient(ellipse_at_center,rgba(12,18,32,0.74)_0%,rgba(12,18,32,0.32)_38%,rgba(7,9,15,0.1)_62%,rgba(7,9,15,0)_84%)] blur-[72px]" />

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
