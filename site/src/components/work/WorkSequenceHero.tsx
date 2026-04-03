import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
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
const DESKTOP_CACHE_RADIUS = 128;
const MOBILE_CACHE_RADIUS = 72;
const DESKTOP_ANCHOR_COUNT = 48;
const MOBILE_ANCHOR_COUNT = 28;
const DESKTOP_FALLBACK_RADIUS = 64;
const MOBILE_FALLBACK_RADIUS = 32;

const buildDistributedFrameSet = (count: number, total: number) => {
  if (count >= total) {
    return Array.from({ length: total }, (_, index) => index);
  }

  const frameSet = new Set<number>();
  for (let index = 0; index < count; index += 1) {
    const ratio = count === 1 ? 0 : index / (count - 1);
    frameSet.add(Math.round(ratio * (total - 1)));
  }

  return Array.from(frameSet).sort((a, b) => a - b);
};

const buildBalancedFrameOrder = (frames: number[]) => {
  if (frames.length <= 1) return frames;

  const ordered: number[] = [frames[0]];
  const visit = (segment: number[]) => {
    if (!segment.length) return;
    const middleIndex = Math.floor(segment.length / 2);
    ordered.push(segment[middleIndex]);
    visit(segment.slice(0, middleIndex));
    visit(segment.slice(middleIndex + 1));
  };

  visit(frames.slice(1));
  return ordered.filter((frameIndex, index, list) => list.indexOf(frameIndex) === index);
};

const buildUrgentFrameSet = (frameIndex: number, total: number, lowPower: boolean) => {
  const offsets = lowPower ? [0, -1, 1, -2, 2, -3, 3] : [0, -1, 1, -2, 2, -3, 3, -4, 4];
  return offsets
    .map((offset) => frameIndex + offset)
    .filter((candidate, index, list) => candidate >= 0 && candidate < total && list.indexOf(candidate) === index);
};

const findNearestLoadedFrame = (
  frames: Array<HTMLImageElement | null>,
  target: number,
  maxDistance = Number.POSITIVE_INFINITY,
) => {
  if (frames[target]) return target;

  for (let offset = 1; offset <= maxDistance; offset += 1) {
    const previous = target - offset;
    const next = target + offset;

    if (previous >= 0 && frames[previous]) return previous;
    if (next < frames.length && frames[next]) return next;
    if (previous < 0 && next >= frames.length) break;
  }

  return -1;
};

const pickRenderableFrame = (
  frames: Array<HTMLImageElement | null>,
  target: number,
  lastVisible: number,
  maxDistance: number,
) => {
  if (frames[target]) return target;
  const nearestLoaded = findNearestLoadedFrame(frames, target, maxDistance);
  if (nearestLoaded >= 0) return nearestLoaded;
  const nearestGlobal = findNearestLoadedFrame(frames, target);
  if (nearestGlobal >= 0) return nearestGlobal;
  if (lastVisible >= 0 && frames[lastVisible]) return lastVisible;
  return -1;
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
  const currentFrameFloatRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const lastVisibleFrameRef = useRef(-1);
  const loadedCountRef = useRef(0);
  const canvasReadyRef = useRef(false);
  const destroyedRef = useRef(false);
  const lowPowerRef = useRef(false);
  const concurrencyRef = useRef(6);
  const activeLoadsRef = useRef(0);
  const urgentLoadsRef = useRef(0);
  const priorityQueueRef = useRef<number[]>([]);
  const backgroundQueueRef = useRef<number[]>([]);
  const queuedFramesRef = useRef<Set<number>>(new Set());
  const loadingFramesRef = useRef<Set<number>>(new Set());
  const lastRequestedFrameRef = useRef(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const reduceMotion = useReducedMotion();
  const sequenceMask =
    "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 68%, rgba(0,0,0,0.95) 76%, rgba(0,0,0,0.76) 84%, rgba(0,0,0,0.36) 93%, rgba(0,0,0,0) 100%)";

  const sectionHeight = useMemo(
    () =>
      reduceMotion
        ? `calc(${isMobileViewport ? "116svh" : "140svh"} + ${HEADER_OFFSET}px)`
        : `calc(${isMobileViewport ? "170svh" : "min(240svh, 3200px)"} + ${HEADER_OFFSET}px)`,
    [isMobileViewport, reduceMotion],
  );
  const stageHeight = useMemo(
    () =>
      isMobileViewport
        ? `calc(min(76svh, 760px) - ${HEADER_OFFSET}px)`
        : `calc(100svh - ${HEADER_OFFSET}px)`,
    [isMobileViewport],
  );

  const registerLoadedFrame = (frameIndex: number, image: HTMLImageElement) => {
    if (destroyedRef.current || framesRef.current[frameIndex]) return;
    framesRef.current[frameIndex] = image;
    loadedCountRef.current += 1;
    const isCurrentFocus = Math.abs(frameIndex - targetFrameRef.current) <= (lowPowerRef.current ? 2 : 3);
    scheduleDraw(targetFrameRef.current, frameIndex === 0 || isCurrentFocus);
  };

  const requestFrameLoad = (frameIndex: number, urgent = false) => {
    if (frameIndex < 0 || frameIndex >= WORK_HERO_FRAME_COUNT) return;
    if (framesRef.current[frameIndex]) return;
    if (loadingFramesRef.current.has(frameIndex)) return;

    loadingFramesRef.current.add(frameIndex);
    if (urgent) {
      urgentLoadsRef.current += 1;
    } else {
      activeLoadsRef.current += 1;
    }

    const image = new Image();
    image.decoding = "async";
    image.loading = urgent || frameIndex <= 8 ? "eager" : "lazy";
    if ("fetchPriority" in image) {
      image.fetchPriority =
        urgent || Math.abs(frameIndex - targetFrameRef.current) <= 2 || frameIndex <= 8 ? "high" : "low";
    }

    const finalize = () => {
      loadingFramesRef.current.delete(frameIndex);
      if (urgent) {
        urgentLoadsRef.current = Math.max(0, urgentLoadsRef.current - 1);
      } else {
        activeLoadsRef.current = Math.max(0, activeLoadsRef.current - 1);
      }
      pumpLoadQueue();
    };

    image.onload = () => {
      registerLoadedFrame(frameIndex, image);
      finalize();
    };

    image.onerror = () => {
      finalize();
    };

    image.src = getWorkHeroFrameSrc(frameIndex);
  };

  const drawFrame = (frameIndex: number, force = false) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const fallbackIndex = pickRenderableFrame(
      framesRef.current,
      frameIndex,
      lastVisibleFrameRef.current,
      lowPowerRef.current ? MOBILE_FALLBACK_RADIUS : DESKTOP_FALLBACK_RADIUS,
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
    const useMobileFit = isMobileViewport || width / height < 1.08;
    const scale = useMobileFit
      ? Math.max(width / imageWidth, height / imageHeight)
      : Math.min(width / imageWidth, height / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    const offsetX = (width - drawWidth) * 0.5;
    const offsetY = useMobileFit
      ? (height - drawHeight) * 0.6
      : Math.max(0, height - drawHeight + height * 0.012);

    if (!useMobileFit) {
      const sideBleedWidth = Math.max(48, offsetX + drawWidth * 0.065);

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
      ctx.restore();
    }

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
      if (useMobileFit) {
        horizontalMask.addColorStop(0, "rgba(255,255,255,0.08)");
        horizontalMask.addColorStop(0.08, "rgba(255,255,255,0.98)");
        horizontalMask.addColorStop(0.92, "rgba(255,255,255,0.98)");
        horizontalMask.addColorStop(1, "rgba(255,255,255,0.08)");
      } else {
        horizontalMask.addColorStop(0, "rgba(255,255,255,0)");
        horizontalMask.addColorStop(0.1, "rgba(255,255,255,0.94)");
        horizontalMask.addColorStop(0.9, "rgba(255,255,255,0.94)");
        horizontalMask.addColorStop(1, "rgba(255,255,255,0)");
      }
      blendCtx.fillStyle = horizontalMask;
      blendCtx.fillRect(offsetX, offsetY, drawWidth, drawHeight);

      const verticalMask = blendCtx.createLinearGradient(0, offsetY, 0, offsetY + drawHeight);
      verticalMask.addColorStop(0, "rgba(255,255,255,1)");
      verticalMask.addColorStop(useMobileFit ? 0.86 : 0.8, "rgba(255,255,255,0.98)");
      verticalMask.addColorStop(useMobileFit ? 0.94 : 0.92, "rgba(255,255,255,0.72)");
      verticalMask.addColorStop(useMobileFit ? 0.992 : 0.985, "rgba(255,255,255,0.16)");
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

    const skyHalo = ctx.createRadialGradient(width * 0.5, height * 0.18, 0, width * 0.5, height * 0.16, width * 0.52);
    skyHalo.addColorStop(0, `${accentSoft}20`);
    skyHalo.addColorStop(0.45, `${accent}10`);
    skyHalo.addColorStop(1, `${background}00`);
    ctx.fillStyle = skyHalo;
    ctx.fillRect(0, 0, width, height * 0.56);
    ctx.restore();

    lastDrawnFrameRef.current = fallbackIndex;
    lastVisibleFrameRef.current = fallbackIndex;

    if (!canvasReadyRef.current) {
      canvasReadyRef.current = true;
      setCanvasReady(true);
    }
  };

  const scheduleDraw = (frameIndex: number, force = false) => {
    targetFrameRef.current = frameIndex;
    const shouldSnapToLoadedFrame =
      !force &&
      Boolean(framesRef.current[frameIndex]) &&
      Math.abs(frameIndex - currentFrameFloatRef.current) > (lowPowerRef.current ? 12 : 18);

    if (force || shouldSnapToLoadedFrame) {
      currentFrameFloatRef.current = frameIndex;
      drawFrame(frameIndex, true);
    }
  };

  const rebuildQueuedSet = () => {
    const nextQueued = new Set<number>();
    priorityQueueRef.current.forEach((frameIndex) => nextQueued.add(frameIndex));
    backgroundQueueRef.current.forEach((frameIndex) => nextQueued.add(frameIndex));
    queuedFramesRef.current = nextQueued;
  };

  const replacePriorityFrames = (frameIndices: number[]) => {
    priorityQueueRef.current = frameIndices.filter((frameIndex) => {
      if (frameIndex < 0 || frameIndex >= WORK_HERO_FRAME_COUNT) return false;
      if (framesRef.current[frameIndex]) return false;
      if (loadingFramesRef.current.has(frameIndex)) return false;
      return true;
    });
    rebuildQueuedSet();
  };

  const replaceBackgroundFrames = (frameIndices: number[]) => {
    backgroundQueueRef.current = frameIndices.filter((frameIndex, index, list) => {
      if (frameIndex < 0 || frameIndex >= WORK_HERO_FRAME_COUNT) return false;
      if (framesRef.current[frameIndex]) return false;
      if (loadingFramesRef.current.has(frameIndex)) return false;
      if (priorityQueueRef.current.includes(frameIndex)) return false;
      return list.indexOf(frameIndex) === index;
    });
    rebuildQueuedSet();
  };

  const pumpLoadQueue = () => {
    if (destroyedRef.current) return;

    while (activeLoadsRef.current < concurrencyRef.current) {
      const nextFrame =
        priorityQueueRef.current.length > 0
          ? priorityQueueRef.current.shift()
          : backgroundQueueRef.current.shift();

      if (typeof nextFrame !== "number") break;
      if (framesRef.current[nextFrame] || loadingFramesRef.current.has(nextFrame)) {
        queuedFramesRef.current.delete(nextFrame);
        continue;
      }

      queuedFramesRef.current.delete(nextFrame);
      requestFrameLoad(nextFrame, false);
    }
  };

  const trimFrameCache = (frameIndex: number) => {
    const anchorFrames = new Set(
      buildDistributedFrameSet(
        lowPowerRef.current ? MOBILE_ANCHOR_COUNT : DESKTOP_ANCHOR_COUNT,
        WORK_HERO_FRAME_COUNT,
      ),
    );
    const keepRadius = lowPowerRef.current ? MOBILE_CACHE_RADIUS : DESKTOP_CACHE_RADIUS;

    framesRef.current.forEach((image, index) => {
      if (!image) return;
      if (index === frameIndex || index === lastVisibleFrameRef.current) return;
      if (anchorFrames.has(index)) return;
      if (Math.abs(index - frameIndex) <= keepRadius) return;
      framesRef.current[index] = null;
    });
  };

  const primeFrameWindow = (frameIndex: number) => {
    const neighborOffsets = lowPowerRef.current
      ? [0, -1, 1, -2, 2, -3, 3, -4, 4, -6, 6, -8, 8, -12, 12]
      : [0, -1, 1, -2, 2, -3, 3, -4, 4, -6, 6, -8, 8, -12, 12, -18, 18, -24, 24];

    const prioritizedFrames = neighborOffsets
      .map((offset) => frameIndex + offset)
      .filter((candidate, index, list) => candidate >= 0 && candidate < WORK_HERO_FRAME_COUNT && list.indexOf(candidate) === index);

    const contiguousSupportFrames: number[] = [];
    for (let distance = 1; distance < WORK_HERO_FRAME_COUNT; distance += 1) {
      const previous = frameIndex - distance;
      const next = frameIndex + distance;

      if (previous >= 0) contiguousSupportFrames.push(previous);
      if (next < WORK_HERO_FRAME_COUNT) contiguousSupportFrames.push(next);
    }

    const bridgeFrames: number[] = [];
    const previousRequestedFrame = lastRequestedFrameRef.current;
    if (previousRequestedFrame !== frameIndex) {
      const direction = previousRequestedFrame < frameIndex ? 1 : -1;
      const step = lowPowerRef.current ? 4 : 3;
      for (
        let candidate = previousRequestedFrame;
        direction > 0 ? candidate <= frameIndex : candidate >= frameIndex;
        candidate += direction * step
      ) {
        if (candidate < 0 || candidate >= WORK_HERO_FRAME_COUNT) continue;
        bridgeFrames.push(candidate);
      }
    }

    const anchorFrames = buildBalancedFrameOrder(
      buildDistributedFrameSet(
        lowPowerRef.current ? MOBILE_ANCHOR_COUNT : DESKTOP_ANCHOR_COUNT,
        WORK_HERO_FRAME_COUNT,
      ),
    );
    const supportFrames = [
      ...bridgeFrames,
      ...contiguousSupportFrames,
      ...anchorFrames.filter((candidate) => !prioritizedFrames.includes(candidate)),
    ];

    trimFrameCache(frameIndex);
    buildUrgentFrameSet(frameIndex, WORK_HERO_FRAME_COUNT, lowPowerRef.current).forEach((urgentFrame) => {
      if (urgentLoadsRef.current >= 2 && !loadingFramesRef.current.has(urgentFrame)) return;
      requestFrameLoad(urgentFrame, true);
    });
    replacePriorityFrames(prioritizedFrames);
    replaceBackgroundFrames(supportFrames);
    lastRequestedFrameRef.current = frameIndex;
    pumpLoadQueue();
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsMobileViewport(media.matches);
    syncViewport();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", syncViewport);
      return () => media.removeEventListener("change", syncViewport);
    }

    media.addListener(syncViewport);
    return () => media.removeListener(syncViewport);
  }, []);

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
  }, [isMobileViewport]);

  useEffect(() => {
    destroyedRef.current = false;
    const coarsePointer =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches;
    const lowMemory = (navigator.deviceMemory || 8) <= 4;
    const lowCoreCount = (navigator.hardwareConcurrency || 8) <= 4;
    lowPowerRef.current = coarsePointer || lowMemory || lowCoreCount || Boolean(reduceMotion);
    concurrencyRef.current = lowPowerRef.current ? 6 : 12;
    activeLoadsRef.current = 0;
    urgentLoadsRef.current = 0;
    currentFrameFloatRef.current = 0;
    priorityQueueRef.current = [];
    backgroundQueueRef.current = [];
    queuedFramesRef.current.clear();
    loadingFramesRef.current.clear();
    primeFrameWindow(0);

    const animate = () => {
      if (destroyedRef.current) return;

      const targetFrame = targetFrameRef.current;
      const currentFrame = currentFrameFloatRef.current;
      const smoothing = reduceMotion ? 1 : lowPowerRef.current ? 0.34 : 0.22;
      const nextFrame =
        smoothing >= 1 ? targetFrame : currentFrame + (targetFrame - currentFrame) * smoothing;

      currentFrameFloatRef.current =
        Math.abs(targetFrame - nextFrame) <= 0.02 ? targetFrame : nextFrame;

      drawFrame(
        clamp(
          Math.round(currentFrameFloatRef.current),
          0,
          WORK_HERO_FRAME_COUNT - 1,
        ),
      );

      drawRafRef.current = window.requestAnimationFrame(animate);
    };

    drawRafRef.current = window.requestAnimationFrame(animate);

    return () => {
      destroyedRef.current = true;
      if (drawRafRef.current !== null) {
        window.cancelAnimationFrame(drawRafRef.current);
        drawRafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId: number | null = null;

    const updateFromScroll = () => {
      rafId = null;
      const rect = section.getBoundingClientRect();
      const totalScrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
      const scrolled = clamp(-rect.top, 0, totalScrollable);
      const progress = totalScrollable <= 1 ? 0 : scrolled / totalScrollable;
      const frameStep = lowPowerRef.current ? 2 : 1;
      const rawFrame = clamp(
        Math.round(progress * (WORK_HERO_FRAME_COUNT - 1)),
        0,
        WORK_HERO_FRAME_COUNT - 1,
      );
      const nextFrame = clamp(
        Math.round(rawFrame / frameStep) * frameStep,
        0,
        WORK_HERO_FRAME_COUNT - 1,
      );

      primeFrameWindow(nextFrame);
      scheduleDraw(nextFrame);
    };

    const requestUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateFromScroll);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    window.addEventListener("orientationchange", requestUpdate, { passive: true });

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("orientationchange", requestUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative -mt-[88px]"
      style={{ height: sectionHeight }}
      aria-describedby="work-sequence-caption"
    >
      <div
        ref={stageRef}
        className="sticky top-[88px]"
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
          className={`absolute inset-0 block h-full w-full transition-opacity duration-500 ${
            canvasReady ? "opacity-0" : "opacity-100"
          }`}
          style={{
            objectFit: isMobileViewport ? "cover" : "contain",
            objectPosition: isMobileViewport ? "center 60%" : "center",
            filter: "drop-shadow(0 0 12px rgba(7, 9, 15, 0.28))",
            WebkitMaskImage: sequenceMask,
            maskImage: sequenceMask,
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
          style={{
            WebkitMaskImage: sequenceMask,
            maskImage: sequenceMask,
          }}
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

        {!canvasReady && (
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
