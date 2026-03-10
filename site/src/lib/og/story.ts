import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { profile } from "../../data/profile";
import { projects } from "../../data/projects";

type RootTokens = {
  bgPrimary: string;
  bgSecondary: string;
  surfaceGlass: string;
  surfaceBorder: string;
  textMain: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
};

type StoryAssets = RootTokens & {
  portraitDataUri: string;
  orbitronTtfPath: string;
  interRegularTtfPath: string;
  interMediumTtfPath: string;
  dmMonoRegularTtfPath: string;
};

type TextLayerOptions = {
  text: string;
  width: number;
  top: number;
  left: number;
  font: string;
  fontfile?: string;
  spacing?: number;
  align?: "left" | "center" | "centre" | "right";
};

const STAGE = { width: 1080, height: 1920 };
const DOMAIN_LABEL = new URL(profile.siteUrl).host;
const ROLE_LABEL = "Digital Operations & Growth Manager";
const SUPPORT_LABEL = "Helping you build, optimize, and grow your business";
const DISCIPLINE_LABEL = "DIGITAL MARKETING • PERFORMANCE • WEB SYSTEMS";
const heroProject = projects.find((project) => project.slug === "bluemark-real-estate-leadgen") ?? projects[0];
const relatedProjects = projects.filter((project) =>
  ["180-degree-meal-planner", "multi-company-digital-ops"].includes(project.slug),
);

let cachedAssetsPromise: Promise<StoryAssets> | undefined;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeMarkup(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function hexToRgb(hex: string) {
  const normalized = hex.trim().replace(/^#/, "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    throw new Error(`Expected a 3 or 6 digit hex value, received "${hex}".`);
  }

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function withOpacity(color: string, alpha: number) {
  const normalized = color.trim();

  if (normalized.startsWith("rgba(") || normalized.startsWith("rgb(")) {
    const values = normalized
      .replace(/rgba?\(/, "")
      .replace(")", "")
      .split(",")
      .map((part) => part.trim());

    if (values.length >= 3) {
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
    }
  }

  return rgba(color, alpha);
}

function hexWithAlpha(hex: string, alpha: number) {
  const normalized = hex.trim().replace(/^#/, "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized;
  const clamped = Math.max(0, Math.min(1, alpha));
  const alphaHex = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${expanded}${alphaHex}`;
}

function mulberry32(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function wrapText(text: string, maxCharsPerLine: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      continue;
    }
    currentLine = candidate;
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function nameLines(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return [name.toUpperCase()];
  return [words[0].toUpperCase(), words.slice(1).join(" ").toUpperCase()];
}

function shortenText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}…`;
}

function buildStars(tokens: RootTokens) {
  const random = mulberry32(119);
  const stars: string[] = [];
  const palette = [tokens.textMain, tokens.accentSoft, tokens.accent];

  for (let index = 0; index < 520; index += 1) {
    const x = Math.round(random() * STAGE.width * 10) / 10;
    const y = Math.round(random() * STAGE.height * 10) / 10;
    const radius = 0.35 + random() * 1.65;
    const opacity = 0.16 + random() * 0.7;
    const color = palette[Math.floor(random() * palette.length)] || tokens.textMain;

    stars.push(
      `<circle cx="${x}" cy="${y}" r="${radius.toFixed(2)}" fill="${rgba(color, Number(opacity.toFixed(2)))}" />`,
    );

    if (random() > 0.91) {
      const glowRadius = radius * (2.8 + random() * 2.4);
      const glowOpacity = 0.03 + random() * 0.08;
      stars.push(
        `<circle cx="${x}" cy="${y}" r="${glowRadius.toFixed(2)}" fill="${rgba(color, Number(glowOpacity.toFixed(2)))}" />`,
      );
    }
  }

  return stars.join("");
}

async function readRootTokens(): Promise<RootTokens> {
  const cssPath = path.resolve(process.cwd(), "src/styles/global.css");
  const css = await fs.readFile(cssPath, "utf8");
  const rootMatch = css.match(/:root\s*{([\s\S]*?)}/);

  if (!rootMatch) {
    throw new Error(`Could not find :root design tokens in ${cssPath}.`);
  }

  const rootBlock = rootMatch[1];
  const readVar = (name: string) => {
    const tokenMatch = rootBlock.match(new RegExp(`${escapeRegex(name)}\\s*:\\s*([^;]+);`));
    if (!tokenMatch) {
      throw new Error(`Missing CSS token "${name}" in ${cssPath}.`);
    }
    return tokenMatch[1].trim();
  };

  return {
    bgPrimary: readVar("--bg-primary"),
    bgSecondary: readVar("--bg-secondary"),
    surfaceGlass: readVar("--surface-glass"),
    surfaceBorder: readVar("--surface-border"),
    textMain: readVar("--text-main"),
    textMuted: readVar("--text-muted"),
    accent: readVar("--accent"),
    accentSoft: readVar("--accent-soft"),
  };
}

async function readFileAsDataUri(filePath: string, mimeType: string) {
  const fileBuffer = await fs.readFile(filePath);
  return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
}

async function loadAssets(): Promise<StoryAssets> {
  if (!cachedAssetsPromise) {
    cachedAssetsPromise = (async () => {
      const tokens = await readRootTokens();
      const portraitPath = path.resolve(process.cwd(), "public/profile.png");
      const orbitronTtfPath = path.resolve(process.cwd(), "public/fonts/orbitron-700.ttf");
      const interRegularTtfPath = path.resolve(process.cwd(), "public/fonts/inter-400.ttf");
      const interMediumTtfPath = path.resolve(process.cwd(), "public/fonts/inter-500.ttf");
      const dmMonoRegularTtfPath = path.resolve(process.cwd(), "public/fonts/dm-mono-400.ttf");
      const portraitDataUri = await readFileAsDataUri(portraitPath, "image/png");

      return {
        ...tokens,
        portraitDataUri,
        orbitronTtfPath,
        interRegularTtfPath,
        interMediumTtfPath,
        dmMonoRegularTtfPath,
      };
    })();
  }

  return cachedAssetsPromise;
}

async function renderTextLayer(options: TextLayerOptions) {
  const {
    text,
    width,
    font,
    fontfile,
    spacing = 0,
    align = "left",
  } = options;

  const buffer = await sharp({
    text: {
      text,
      width,
      font,
      fontfile,
      spacing,
      align,
      rgba: true,
    },
  }).png().toBuffer();

  return { input: buffer, top: options.top, left: options.left };
}

function buildStoryBackgroundSvg(assets: StoryAssets) {
  const stars = buildStars(assets);

  return `
<svg width="${STAGE.width}" height="${STAGE.height}" viewBox="0 0 ${STAGE.width} ${STAGE.height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgLinear" x1="540" y1="0" x2="540" y2="1920" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${assets.bgSecondary}" />
      <stop offset="100%" stop-color="${assets.bgPrimary}" />
    </linearGradient>
    <radialGradient id="topHalo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(540 120) rotate(90) scale(580 820)">
      <stop offset="0%" stop-color="${rgba(assets.accent, 0.44)}" />
      <stop offset="42%" stop-color="${rgba(assets.accent, 0.16)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </radialGradient>
    <radialGradient id="leftNebula" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(180 1160) rotate(90) scale(480 440)">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0.16)}" />
      <stop offset="44%" stop-color="${rgba(assets.accent, 0.08)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </radialGradient>
    <radialGradient id="rightNebula" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(860 960) rotate(90) scale(560 420)">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0.12)}" />
      <stop offset="52%" stop-color="${rgba(assets.accent, 0.06)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </radialGradient>
    <linearGradient id="cardTop" x1="58" y1="54" x2="1022" y2="824" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.bgSecondary, 0.88)}" />
      <stop offset="100%" stop-color="${rgba(assets.bgPrimary, 0.96)}" />
    </linearGradient>
    <linearGradient id="cardGlass" x1="58" y1="856" x2="1022" y2="1790" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.bgSecondary, 0.82)}" />
      <stop offset="100%" stop-color="${rgba(assets.bgPrimary, 0.94)}" />
    </linearGradient>
    <linearGradient id="buttonPrimary" x1="114" y1="725" x2="506" y2="798" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.accent, 0.98)}" />
      <stop offset="100%" stop-color="${rgba(assets.accentSoft, 0.64)}" />
    </linearGradient>
    <linearGradient id="buttonSecondary" x1="574" y1="725" x2="966" y2="798" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.bgSecondary, 0.88)}" />
      <stop offset="100%" stop-color="${rgba(assets.bgPrimary, 0.98)}" />
    </linearGradient>
    <linearGradient id="beamLine" x1="222" y1="561" x2="858" y2="561" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0)}" />
      <stop offset="18%" stop-color="${rgba(assets.accentSoft, 0.28)}" />
      <stop offset="50%" stop-color="${rgba(assets.textMain, 0.92)}" />
      <stop offset="82%" stop-color="${rgba(assets.accentSoft, 0.28)}" />
      <stop offset="100%" stop-color="${rgba(assets.accentSoft, 0)}" />
    </linearGradient>
    <pattern id="gridPattern" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" stroke="${rgba(assets.textMain, 0.025)}" stroke-width="1" />
    </pattern>
    <radialGradient id="gridMaskFill" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(540 180) rotate(90) scale(860 640)">
      <stop offset="0%" stop-color="white" />
      <stop offset="100%" stop-color="black" />
    </radialGradient>
    <mask id="gridMask">
      <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#gridMaskFill)" />
    </mask>
    <linearGradient id="outerGlow" x1="0" y1="0" x2="1080" y2="1920" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0.12)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </linearGradient>
    <radialGradient id="portraitGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(540 255) rotate(90) scale(228 228)">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0.44)}" />
      <stop offset="54%" stop-color="${rgba(assets.accent, 0.18)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </radialGradient>
    <clipPath id="portraitClip">
      <circle cx="540" cy="255" r="132" />
    </clipPath>
    <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18" />
    </filter>
    <filter id="beamGlowFilter" x="-10%" y="-3000%" width="120%" height="6000%">
      <feGaussianBlur stdDeviation="4.8" />
    </filter>
  </defs>

  <rect width="${STAGE.width}" height="${STAGE.height}" fill="${assets.bgPrimary}" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#bgLinear)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#topHalo)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#leftNebula)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#rightNebula)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#outerGlow)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#gridPattern)" mask="url(#gridMask)" opacity="0.52" />
  ${stars}

  <rect x="58" y="54" width="964" height="770" rx="56" fill="url(#cardTop)" stroke="${withOpacity(assets.surfaceBorder, 0.9)}" stroke-width="1.6" />
  <rect x="74" y="70" width="932" height="738" rx="46" stroke="${rgba(assets.textMain, 0.08)}" stroke-width="1" />
  <circle cx="540" cy="255" r="172" fill="url(#portraitGlow)" filter="url(#softBlur)" />
  <circle cx="540" cy="255" r="182" fill="none" stroke="${rgba(assets.accentSoft, 0.20)}" stroke-width="2.1" />
  <circle cx="540" cy="255" r="150" fill="none" stroke="${rgba(assets.accent, 0.22)}" stroke-width="1.5" />
  <circle cx="540" cy="255" r="132" fill="${rgba(assets.bgPrimary, 0.82)}" stroke="${rgba(assets.textMain, 0.94)}" stroke-width="4" />
  <circle cx="540" cy="255" r="146" fill="none" stroke="${rgba(assets.textMain, 0.24)}" stroke-width="1.2" />
  <image href="${assets.portraitDataUri}" x="408" y="94" width="264" height="330" preserveAspectRatio="xMidYMin slice" clip-path="url(#portraitClip)" />

  <circle cx="228" cy="218" r="96" fill="${rgba(assets.bgPrimary, 0.32)}" />
  <circle cx="852" cy="218" r="96" fill="${rgba(assets.bgPrimary, 0.32)}" />
  <rect x="168" y="545" width="744" height="1.4" rx="1" fill="url(#beamLine)" />
  <rect x="168" y="544.2" width="744" height="3" rx="2" fill="url(#beamLine)" filter="url(#beamGlowFilter)" opacity="0.66" />
  <rect x="114" y="724" width="392" height="74" rx="37" fill="url(#buttonPrimary)" />
  <rect x="114" y="724" width="392" height="74" rx="37" stroke="${rgba(assets.accentSoft, 0.32)}" stroke-width="1.2" />
  <rect x="574" y="724" width="392" height="74" rx="37" fill="url(#buttonSecondary)" />
  <rect x="574" y="724" width="392" height="74" rx="37" stroke="${withOpacity(assets.surfaceBorder, 0.7)}" stroke-width="1.2" />

  <rect x="58" y="856" width="426" height="394" rx="44" fill="url(#cardGlass)" stroke="${withOpacity(assets.surfaceBorder, 0.85)}" stroke-width="1.5" />
  <rect x="516" y="856" width="506" height="394" rx="44" fill="url(#cardGlass)" stroke="${withOpacity(assets.surfaceBorder, 0.85)}" stroke-width="1.5" />
  <rect x="548" y="956" width="442" height="250" rx="34" fill="${rgba(assets.accent, 0.14)}" stroke="${withOpacity(assets.surfaceBorder, 0.55)}" stroke-width="1.2" />
  <rect x="578" y="984" width="382" height="194" rx="26" fill="${rgba(assets.bgPrimary, 0.42)}" />
  <path d="M610 1124C670 1076 724 1052 780 1046C834 1040 892 1056 938 1098" stroke="${rgba(assets.accentSoft, 0.48)}" stroke-width="4.5" stroke-linecap="round" />
  <path d="M612 1160C678 1110 734 1096 784 1098C852 1100 900 1126 940 1168" stroke="${rgba(assets.textMain, 0.18)}" stroke-width="2.2" stroke-linecap="round" />
  <circle cx="736" cy="1074" r="10" fill="${rgba(assets.accentSoft, 0.42)}" />
  <circle cx="868" cy="1128" r="7.5" fill="${rgba(assets.textMain, 0.42)}" />

  <rect x="58" y="1284" width="964" height="534" rx="48" fill="url(#cardGlass)" stroke="${withOpacity(assets.surfaceBorder, 0.85)}" stroke-width="1.5" />
  <rect x="94" y="1382" width="420" height="344" rx="34" fill="${rgba(assets.bgPrimary, 0.42)}" stroke="${withOpacity(assets.surfaceBorder, 0.48)}" stroke-width="1.1" />
  <rect x="566" y="1382" width="420" height="344" rx="34" fill="${rgba(assets.bgPrimary, 0.42)}" stroke="${withOpacity(assets.surfaceBorder, 0.48)}" stroke-width="1.1" />
  <rect x="122" y="1568" width="364" height="126" rx="26" fill="${rgba(assets.accent, 0.12)}" />
  <rect x="594" y="1568" width="364" height="126" rx="26" fill="${rgba(assets.accent, 0.12)}" />
  <path d="M152 1610H454" stroke="${rgba(assets.accentSoft, 0.24)}" stroke-width="1.3" />
  <path d="M624 1610H926" stroke="${rgba(assets.accentSoft, 0.24)}" stroke-width="1.3" />
  <circle cx="164" cy="1660" r="7" fill="${rgba(assets.accentSoft, 0.7)}" />
  <circle cx="636" cy="1660" r="7" fill="${rgba(assets.accentSoft, 0.7)}" />
  <circle cx="876" cy="1764" r="7" fill="${rgba(assets.accentSoft, 0.86)}" />
  <circle cx="876" cy="1764" r="14" fill="${rgba(assets.accentSoft, 0.16)}" />
</svg>`;
}

export async function renderStoryPng() {
  const assets = await loadAssets();
  const titleLines = nameLines(profile.name);
  const storyBackground = buildStoryBackgroundSvg(assets);
  const background = await sharp(Buffer.from(storyBackground), { density: 144 })
    .resize(STAGE.width, STAGE.height)
    .png()
    .toBuffer();

  const overlays = await Promise.all([
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.88)}" letter_spacing="2200">${escapeMarkup(DOMAIN_LABEL)}</span>`,
      width: 300,
      top: 102,
      left: 112,
      font: "DM Mono 20",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}">${escapeMarkup(profile.impactMetrics[0]?.value ?? "100+")}</span>`,
      width: 180,
      top: 164,
      left: 138,
      font: "Inter 36",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.54)}">${escapeMarkup("AI-assisted\nbuilds")}</span>`,
      width: 180,
      top: 224,
      left: 138,
      font: "Inter 18",
      fontfile: assets.interRegularTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}">${escapeMarkup(profile.impactMetrics[3]?.value ?? "4+")}</span>`,
      width: 180,
      top: 164,
      left: 762,
      font: "Inter 36",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.54)}">${escapeMarkup("years in\ndigital ops")}</span>`,
      width: 180,
      top: 224,
      left: 762,
      font: "Inter 18",
      fontfile: assets.interRegularTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}" letter_spacing="6400">${escapeMarkup(titleLines[0])}</span>`,
      width: 730,
      top: 418,
      left: 175,
      font: "Orbitron 58",
      fontfile: assets.orbitronTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}" letter_spacing="6400">${escapeMarkup(titleLines[1] ?? "")}</span>`,
      width: 760,
      top: 500,
      left: 160,
      font: "Orbitron 64",
      fontfile: assets.orbitronTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.90)}">${escapeMarkup(ROLE_LABEL)}</span>`,
      width: 720,
      top: 610,
      left: 180,
      font: "Inter 25",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.76)}" letter_spacing="1600">${escapeMarkup(DISCIPLINE_LABEL)}</span>`,
      width: 720,
      top: 650,
      left: 180,
      font: "DM Mono 16",
      fontfile: assets.dmMonoRegularTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.78)}">${escapeMarkup(wrapText(SUPPORT_LABEL, 38).join("\n"))}</span>`,
      width: 620,
      top: 682,
      left: 230,
      font: "Inter 18",
      fontfile: assets.interRegularTtfPath,
      align: "center",
      spacing: 4,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.bgPrimary, 0.98)}">${escapeMarkup("View Work")}</span>`,
      width: 392,
      top: 746,
      left: 114,
      font: "Inter 22",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.96)}">${escapeMarkup("WhatsApp")}</span>`,
      width: 392,
      top: 746,
      left: 574,
      font: "Inter 22",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.78)}" letter_spacing="1800">${escapeMarkup("HOME HERO")}</span>`,
      width: 190,
      top: 906,
      left: 96,
      font: "DM Mono 15",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}">${escapeMarkup("Cinematic home system")}</span>`,
      width: 260,
      top: 972,
      left: 96,
      font: "Inter 30",
      fontfile: assets.interMediumTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.70)}">${escapeMarkup("Orbit rings, glass UI, and a branded hero frame built to feel premium in motion and static.")}</span>`,
      width: 286,
      top: 1040,
      left: 96,
      font: "Inter 18",
      fontfile: assets.interRegularTtfPath,
      spacing: 4,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.86)}">${escapeMarkup(DOMAIN_LABEL)}</span>`,
      width: 286,
      top: 1188,
      left: 96,
      font: "Inter 22",
      fontfile: assets.interMediumTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.78)}" letter_spacing="1800">${escapeMarkup("WORK HIGHLIGHT")}</span>`,
      width: 250,
      top: 906,
      left: 548,
      font: "DM Mono 15",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}">${escapeMarkup(shortenText(heroProject.client, 26))}</span>`,
      width: 330,
      top: 968,
      left: 548,
      font: "Inter 30",
      fontfile: assets.interMediumTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.54)}">${escapeMarkup(heroProject.category.toUpperCase())}</span>`,
      width: 260,
      top: 1014,
      left: 548,
      font: "DM Mono 14",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.80)}">${escapeMarkup(shortenText(heroProject.results[0] ?? heroProject.overview, 74))}</span>`,
      width: 330,
      top: 1062,
      left: 548,
      font: "Inter 18",
      fontfile: assets.interRegularTtfPath,
      spacing: 4,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.92)}">${escapeMarkup("Performance Marketing")}</span>`,
      width: 160,
      top: 1180,
      left: 548,
      font: "Inter 15",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.92)}">${escapeMarkup("WhatsApp Funnel")}</span>`,
      width: 160,
      top: 1180,
      left: 726,
      font: "Inter 15",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.78)}" letter_spacing="1800">${escapeMarkup("RELATED CASES")}</span>`,
      width: 260,
      top: 1328,
      left: 96,
      font: "DM Mono 15",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}">${escapeMarkup(shortenText(relatedProjects[0]?.client ?? "180 Degree", 24))}</span>`,
      width: 308,
      top: 1432,
      left: 122,
      font: "Inter 28",
      fontfile: assets.interMediumTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.56)}">${escapeMarkup((relatedProjects[0]?.category ?? "Web App / Growth Ops").toUpperCase())}</span>`,
      width: 308,
      top: 1478,
      left: 122,
      font: "DM Mono 13",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.74)}">${escapeMarkup(shortenText(relatedProjects[0]?.overview ?? "", 96))}</span>`,
      width: 304,
      top: 1568,
      left: 146,
      font: "Inter 17",
      fontfile: assets.interRegularTtfPath,
      spacing: 4,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}">${escapeMarkup(shortenText(relatedProjects[1]?.client ?? "Multi-Company Ops", 24))}</span>`,
      width: 308,
      top: 1432,
      left: 594,
      font: "Inter 28",
      fontfile: assets.interMediumTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.56)}">${escapeMarkup((relatedProjects[1]?.category ?? "Digital Operations").toUpperCase())}</span>`,
      width: 308,
      top: 1478,
      left: 594,
      font: "DM Mono 13",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.74)}">${escapeMarkup(shortenText(relatedProjects[1]?.overview ?? "", 94))}</span>`,
      width: 304,
      top: 1568,
      left: 618,
      font: "Inter 17",
      fontfile: assets.interRegularTtfPath,
      spacing: 4,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.82)}">${escapeMarkup(DOMAIN_LABEL)}</span>`,
      width: 280,
      top: 1752,
      left: 122,
      font: "Inter 20",
      fontfile: assets.interMediumTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.84)}">${escapeMarkup("Open to New Mandates")}</span>`,
      width: 280,
      top: 1752,
      left: 700,
      font: "Inter 20",
      fontfile: assets.interMediumTtfPath,
      align: "right",
    }),
  ]);

  return sharp(background)
    .composite(overlays)
    .png({ compressionLevel: 9, palette: false, quality: 100 })
    .toBuffer();
}
