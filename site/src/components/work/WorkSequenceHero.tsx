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
  const [loadedCount, setLoadedCount] = useState(0);
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
    <>
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
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full bg-[var(--bg-primary)]"
          aria-hidden="true"
        />

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.16),transparent_48%),linear-gradient(180deg,rgba(7,9,15,0.04),rgba(7,9,15,0.18)_55%,rgba(7,9,15,0.82))]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,15,0.62)_0%,rgba(7,9,15,0.12)_18%,rgba(7,9,15,0.02)_50%,rgba(7,9,15,0.12)_82%,rgba(7,9,15,0.62)_100%)]" />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[44%] opacity-80 mix-blend-screen"
            style={{
              backgroundImage: [
                "radial-gradient(circle at 9% 18%, rgba(147,197,253,0.95) 0 1.1px, transparent 1.9px)",
                "radial-gradient(circle at 16% 10%, rgba(255,255,255,0.78) 0 0.9px, transparent 1.6px)",
                "radial-gradient(circle at 24% 24%, rgba(96,165,250,0.88) 0 1.2px, transparent 2.2px)",
                "radial-gradient(circle at 33% 12%, rgba(255,255,255,0.72) 0 0.85px, transparent 1.5px)",
                "radial-gradient(circle at 42% 7%, rgba(147,197,253,0.95) 0 1.1px, transparent 1.8px)",
                "radial-gradient(circle at 53% 19%, rgba(255,255,255,0.8) 0 1px, transparent 1.7px)",
                "radial-gradient(circle at 61% 11%, rgba(96,165,250,0.9) 0 1.15px, transparent 2px)",
                "radial-gradient(circle at 72% 16%, rgba(255,255,255,0.76) 0 0.95px, transparent 1.6px)",
                "radial-gradient(circle at 81% 9%, rgba(147,197,253,0.92) 0 1.05px, transparent 1.8px)",
                "radial-gradient(circle at 89% 21%, rgba(255,255,255,0.74) 0 0.9px, transparent 1.5px)"
              ].join(", "),
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-[radial-gradient(ellipse_at_top,rgba(147,197,253,0.10),rgba(7,9,15,0)_70%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(7,9,15,0)_0%,rgba(7,9,15,0.36)_35%,rgba(7,9,15,0.94)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-[-6%] h-20 bg-[radial-gradient(ellipse_at_center,rgba(7,9,15,0.72)_0%,rgba(7,9,15,0)_72%)] blur-2xl" />

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

      <section
        className="relative z-10 -mt-10 px-4 pb-10 pt-0 md:-mt-14 md:px-6 md:pb-12"
        aria-labelledby="work-sequence-heading"
        aria-describedby="work-sequence-summary"
      >
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_24px_80px_rgba(2,6,23,0.28)] backdrop-blur-2xl md:p-7"
        >
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.9fr)] lg:gap-8">
            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft/80 backdrop-blur-xl">
                <span className="inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(59,130,246,0.75)]" />
                Work Hero Case Study
              </div>

              <h1
                id="work-sequence-heading"
                className="max-w-3xl text-balance font-display font-bold text-white"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)", letterSpacing: "-0.04em", lineHeight: 0.97 }}
              >
                Dubai systems rising from circuit-grade detail.
              </h1>

              <p
                id="work-sequence-summary"
                className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base"
              >
                A pinned canvas sequence that moves from motherboard logic into skyline scale, then hands into
                case studies across web development, technical SEO, GEO, AI systems, and growth operations.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="#work-cases"
                  className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,rgba(59,130,246,0.96),rgba(147,197,253,0.65))] px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_10px_40px_rgba(59,130,246,0.35)] transition-transform duration-300 hover:scale-[1.02]"
                >
                  Explore case studies
                </a>
                <a
                  href="https://wa.me/971529144135"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/20 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-xl transition-colors duration-300 hover:border-accent-soft/40 hover:text-white"
                >
                  WhatsApp
                </a>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-accent-soft/75">
                  Web Development
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-accent-soft/75">
                  Technical SEO
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-accent-soft/75">
                  GEO
                </span>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-soft/70">Sequence Snapshot</p>
              <div className="mt-4 grid gap-4">
                <div>
                  <div className="flex items-end gap-3">
                    <span className="text-3xl font-display font-semibold text-white">{progressPercent}%</span>
                    <span className="mb-1 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
                      {loadedCount}/{WORK_HERO_FRAME_COUNT} frames
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/6">
                    <motion.div
                      className="h-full rounded-full bg-[linear-gradient(90deg,rgba(59,130,246,0.95),rgba(147,197,253,0.85))]"
                      style={{ scaleX: progressScale, transformOrigin: "0% 50%" }}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.1rem] border border-white/8 bg-black/10 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">Sequence Engine</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      239 JPG frames, RAF-only drawing, and mathematically consistent contain-fit.
                    </p>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/8 bg-black/10 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">Scroll Cue</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      Scroll the skyline build, then continue into the work archive below.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      </section>
    </>
  );
}
