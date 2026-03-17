export const WORK_HERO_SEQUENCE_DIR = "/sequences/work-hero";
export const WORK_HERO_FRAME_COUNT = 239;
export const WORK_HERO_PREWARM_CONCURRENCY = 6;
export const WORK_HERO_PREWARM_MOBILE_CONCURRENCY = 4;
export const WORK_HERO_POSTER_FRAME_INDEX = 119;
export const WORK_HERO_IMAGE_WIDTH = 5120;
export const WORK_HERO_IMAGE_HEIGHT = 2880;

export const getWorkHeroFrameSrc = (frameIndex: number) =>
  `${WORK_HERO_SEQUENCE_DIR}/${String(frameIndex + 1).padStart(6, "0")}.jpg`;

export const WORK_HERO_POSTER_SRC = getWorkHeroFrameSrc(WORK_HERO_POSTER_FRAME_INDEX);

export const WORK_HERO_IMAGE_ALT =
  "Dubai skyline rising out of a motherboard circuit in a cinematic web development and digital marketing sequence by Muhammed Mubashir V";

export const WORK_HERO_IMAGE_CAPTION =
  "Cinematic work hero sequence showing a Dubai skyline growing from motherboard circuitry, representing web development, digital marketing systems, technical SEO, GEO, AI workflows, and growth operations.";
