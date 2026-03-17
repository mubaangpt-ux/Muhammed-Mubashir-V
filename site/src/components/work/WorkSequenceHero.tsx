import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
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
  const [loadedCount, setLoadedCount] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [allFramesReady, setAllFramesReady] = useState(false);
  const reduceMotion = useReducedMotion();

  const sectionHeight = useMemo(
    () => (reduceMotion ? "180svh" : "min(320svh, 4200px)"),
    [reduceMotion],
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 240 : 160,
    damping: reduceMotion ? 36 : 28,
    mass: 0.22,
  });
  const progressScale = useTransform(smoothProgress, [0, 1], [0, 1]);

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

    const backdrop = ctx.createRadialGradient(width * 0.52, height * 0.2, 0, width * 0.52, height * 0.44, Math.max(width, height) * 0.75);
    backdrop.addColorStop(0, `${accentSoft}30`);
    backdrop.addColorStop(0.45, `${accent}14`);
    backdrop.addColorStop(1, `${background}00`);
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, width, height);

    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;
    const scale = Math.min(width / imageWidth, height / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    const offsetX = (width - drawWidth) * 0.5;
    const offsetY = (height - drawHeight) * 0.5;

    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

    const topFade = ctx.createLinearGradient(0, 0, 0, height * 0.34);
    topFade.addColorStop(0, `${background}e8`);
    topFade.addColorStop(1, `${background}00`);
    ctx.fillStyle = topFade;
    ctx.fillRect(0, 0, width, height * 0.34);

    const bottomFade = ctx.createLinearGradient(0, height * 0.62, 0, height);
    bottomFade.addColorStop(0, `${background}00`);
    bottomFade.addColorStop(1, `${background}f5`);
    ctx.fillStyle = bottomFade;
    ctx.fillRect(0, height * 0.62, width, height * 0.38);

    const sideFadeLeft = ctx.createLinearGradient(0, 0, width * 0.18, 0);
    sideFadeLeft.addColorStop(0, `${background}d8`);
    sideFadeLeft.addColorStop(1, `${background}00`);
    ctx.fillStyle = sideFadeLeft;
    ctx.fillRect(0, 0, width * 0.18, height);

    const sideFadeRight = ctx.createLinearGradient(width, 0, width * 0.82, 0);
    sideFadeRight.addColorStop(0, `${background}d8`);
    sideFadeRight.addColorStop(1, `${background}00`);
    ctx.fillStyle = sideFadeRight;
    ctx.fillRect(width * 0.82, 0, width * 0.18, height);
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

      if (
        loadedCountRef.current === WORK_HERO_FRAME_COUNT ||
        loadedCountRef.current === 1 ||
        loadedCountRef.current % 6 === 0
      ) {
        setLoadedCount(loadedCountRef.current);
      }

      if (loadedCountRef.current === WORK_HERO_FRAME_COUNT) {
        setAllFramesReady(true);
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

  const progressPercent = Math.round((loadedCount / WORK_HERO_FRAME_COUNT) * 100);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-clip"
      style={{ height: sectionHeight }}
      aria-labelledby="work-sequence-heading"
      aria-describedby="work-sequence-summary work-sequence-caption"
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
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
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full bg-[var(--bg-primary)]"
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.24),transparent_52%),linear-gradient(180deg,rgba(7,9,15,0.1),rgba(7,9,15,0.74)_75%,rgba(7,9,15,0.96))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,15,0.82)_0%,rgba(7,9,15,0.3)_18%,rgba(7,9,15,0.08)_50%,rgba(7,9,15,0.3)_82%,rgba(7,9,15,0.82)_100%)]" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-4 pb-8 pt-28 md:px-6 md:pb-10 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft/80 backdrop-blur-xl">
              <span className="inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(59,130,246,0.75)]" />
              Work Sequence
            </div>

            <h1
              id="work-sequence-heading"
              className="max-w-4xl text-balance font-display font-bold text-white"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.4rem)", letterSpacing: "-0.045em", lineHeight: 0.94 }}
            >
              Dubai systems rising from circuit-grade detail.
            </h1>

            <p
              id="work-sequence-summary"
              className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg"
            >
              A pinned canvas sequence that moves from motherboard logic into skyline scale, then hands into
              case studies across web development, technical SEO, GEO, AI systems, and growth operations.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work-cases"
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,rgba(59,130,246,0.96),rgba(147,197,253,0.65))] px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_10px_40px_rgba(59,130,246,0.35)] transition-transform duration-300 hover:scale-[1.02]"
              >
                Explore case studies
              </a>
              <a
                href="https://wa.me/971529144135"
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/20 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur-xl transition-colors duration-300 hover:border-accent-soft/40 hover:text-white"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-3 md:grid-cols-[1.2fr_0.95fr_0.95fr]"
          >
            <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_22px_80px_rgba(2,6,23,0.35)] backdrop-blur-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft/70">Sequence Engine</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                239 JPG frames, RAF-only drawing, mathematically consistent contain-fit, and a pinned canvas tuned for
                mobile and desktop scroll.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_22px_80px_rgba(2,6,23,0.35)] backdrop-blur-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft/70">Sequence Ready</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-3xl font-display font-semibold text-white">{progressPercent}%</span>
                <span className="mb-1 text-xs font-mono uppercase tracking-[0.24em] text-slate-500">
                  {loadedCount}/{WORK_HERO_FRAME_COUNT} frames
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/6">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(59,130,246,0.95),rgba(147,197,253,0.85))]"
                  style={{ scaleX: progressScale, transformOrigin: "0% 50%" }}
                />
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_22px_80px_rgba(2,6,23,0.35)] backdrop-blur-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft/70">Scroll Cue</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Scroll through the skyline build, then drop into the work archive below.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-slate-500">
                <span className="inline-block h-2 w-2 rounded-full bg-accent-soft/80" />
                Pinned canvas hero
              </div>
            </div>
          </motion.div>
        </div>

        {!firstFrameReady && (
          <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center px-4">
            <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-slate-300 backdrop-blur-xl">
              Preparing skyline sequence
            </div>
          </div>
        )}

        {allFramesReady && (
          <div className="pointer-events-none absolute right-4 top-24 z-20 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.26em] text-emerald-300 md:right-6 md:top-28">
            Sequence cached
          </div>
        )}

        <p id="work-sequence-caption" className="sr-only">
          {WORK_HERO_IMAGE_CAPTION}
        </p>
      </div>
    </section>
  );
}
