export const WORK_HERO_SEQUENCE_DIR = "/sequences/work-hero";
export const WORK_HERO_SEQUENCE_VERSION = "20260330c";
export const WORK_HERO_FRAME_COUNT = 239;
export const WORK_HERO_PREWARM_CONCURRENCY = 6;
export const WORK_HERO_PREWARM_MOBILE_CONCURRENCY = 3;
export const WORK_HERO_POSTER_FRAME_INDEX = 119;
export const WORK_HERO_IMAGE_WIDTH = 1280;
export const WORK_HERO_IMAGE_HEIGHT = 720;

export const getWorkHeroFrameSrc = (frameIndex: number) =>
  `${WORK_HERO_SEQUENCE_DIR}/${String(frameIndex + 1).padStart(6, "0")}.jpg?v=${WORK_HERO_SEQUENCE_VERSION}`;

export const WORK_HERO_POSTER_SRC = getWorkHeroFrameSrc(WORK_HERO_POSTER_FRAME_INDEX);

export const WORK_HERO_IMAGE_ALT =
  "Dubai skyline rising out of a motherboard circuit in a cinematic web development and digital marketing sequence by Muhammed Mubashir V";

export const WORK_HERO_IMAGE_CAPTION =
  "Cinematic work hero sequence showing a Dubai skyline growing from motherboard circuitry, representing web development, digital marketing systems, technical SEO, GEO, AI workflows, and growth operations.";
