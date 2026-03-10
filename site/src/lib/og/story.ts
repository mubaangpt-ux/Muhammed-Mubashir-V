import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { creativeWorkAssets, companies } from "../../components/CreativeWorks/data";
import { profile } from "../../data/profile";

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
  greenInfinityCoverDataUri: string;
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
const SAFE = { left: 72, right: 72, top: 136, bottom: 152 };
const HERO = { x: SAFE.left, y: SAFE.top, width: 936, height: 786, radius: 54 };
const FEATURE = { y: 978, width: 448, height: 292, gap: 40, radius: 38 };
const FOOT = { x: SAFE.left, y: 1324, width: 936, height: 352, radius: 42 };

const DOMAIN_LABEL = new URL(profile.siteUrl).host;
const ROLE_LABEL = "Digital Operations & Growth Manager";
const SUPPORT_LABEL = "Growth systems, premium web experiences, and operational clarity.";
const DISCIPLINE_LABEL = "WEB • GROWTH • GEO";
const greenInfinity = companies.find((company) => company.id === "luminary") ?? companies[0];

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

function nameLines(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return [name.toUpperCase()];
  return [words[0].toUpperCase(), words.slice(1).join(" ").toUpperCase()];
}

function buildStars(tokens: RootTokens) {
  const random = mulberry32(221);
  const stars: string[] = [];
  const palette = [tokens.textMain, tokens.accentSoft, tokens.accent];

  for (let index = 0; index < 440; index += 1) {
    const x = Math.round(random() * STAGE.width * 10) / 10;
    const y = Math.round(random() * STAGE.height * 10) / 10;
    const radius = 0.35 + random() * 1.35;
    const opacity = 0.18 + random() * 0.58;
    const color = palette[Math.floor(random() * palette.length)] || tokens.textMain;

    stars.push(
      `<circle cx="${x}" cy="${y}" r="${radius.toFixed(2)}" fill="${rgba(color, Number(opacity.toFixed(2)))}" />`,
    );

    if (random() > 0.92) {
      stars.push(
        `<circle cx="${x}" cy="${y}" r="${(radius * 4).toFixed(2)}" fill="${rgba(color, 0.06)}" />`,
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
      const greenInfinityCoverPath = path.resolve(
        process.cwd(),
        `public${creativeWorkAssets.cover(greenInfinity)}`,
      );

      const orbitronTtfPath = path.resolve(process.cwd(), "public/fonts/orbitron-700.ttf");
      const interRegularTtfPath = path.resolve(process.cwd(), "public/fonts/inter-400.ttf");
      const interMediumTtfPath = path.resolve(process.cwd(), "public/fonts/inter-500.ttf");
      const dmMonoRegularTtfPath = path.resolve(process.cwd(), "public/fonts/dm-mono-400.ttf");

      const [portraitDataUri, greenInfinityCoverDataUri] = await Promise.all([
        readFileAsDataUri(portraitPath, "image/png"),
        readFileAsDataUri(greenInfinityCoverPath, "image/jpeg"),
      ]);

      return {
        ...tokens,
        portraitDataUri,
        greenInfinityCoverDataUri,
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
  const buffer = await sharp({
    text: {
      text: options.text,
      width: options.width,
      font: options.font,
      fontfile: options.fontfile,
      spacing: options.spacing ?? 0,
      align: options.align ?? "left",
      rgba: true,
    },
  }).png().toBuffer();

  return { input: buffer, top: options.top, left: options.left };
}

function buildStorySvg(assets: StoryAssets) {
  const stars = buildStars(assets);
  const leftFeatureX = SAFE.left;
  const rightFeatureX = SAFE.left + FEATURE.width + FEATURE.gap;

  return `
<svg width="${STAGE.width}" height="${STAGE.height}" viewBox="0 0 ${STAGE.width} ${STAGE.height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgLinear" x1="540" y1="0" x2="540" y2="1920" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${assets.bgSecondary}" />
      <stop offset="100%" stop-color="${assets.bgPrimary}" />
    </linearGradient>
    <radialGradient id="topHalo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(540 140) rotate(90) scale(560 760)">
      <stop offset="0%" stop-color="${rgba(assets.accent, 0.36)}" />
      <stop offset="42%" stop-color="${rgba(assets.accent, 0.12)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </radialGradient>
    <radialGradient id="portraitHalo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(302 426) rotate(90) scale(290 240)">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0.18)}" />
      <stop offset="56%" stop-color="${rgba(assets.accent, 0.10)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </radialGradient>
    <pattern id="gridPattern" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" stroke="${rgba(assets.textMain, 0.025)}" stroke-width="1" />
    </pattern>
    <radialGradient id="gridMaskFill" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(540 220) rotate(90) scale(840 660)">
      <stop offset="0%" stop-color="white" />
      <stop offset="100%" stop-color="black" />
    </radialGradient>
    <mask id="gridMask">
      <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#gridMaskFill)" />
    </mask>
    <linearGradient id="cardFill" x1="${SAFE.left}" y1="${SAFE.top}" x2="${STAGE.width - SAFE.right}" y2="${STAGE.height - SAFE.bottom}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.bgSecondary, 0.84)}" />
      <stop offset="100%" stop-color="${rgba(assets.bgPrimary, 0.96)}" />
    </linearGradient>
    <linearGradient id="buttonFill" x1="120" y1="0" x2="452" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.accent, 0.96)}" />
      <stop offset="100%" stop-color="${rgba(assets.accentSoft, 0.56)}" />
    </linearGradient>
    <linearGradient id="beamLine" x1="470" y1="524" x2="900" y2="524" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0)}" />
      <stop offset="24%" stop-color="${rgba(assets.accentSoft, 0.2)}" />
      <stop offset="50%" stop-color="${rgba(assets.textMain, 0.92)}" />
      <stop offset="76%" stop-color="${rgba(assets.accentSoft, 0.2)}" />
      <stop offset="100%" stop-color="${rgba(assets.accentSoft, 0)}" />
    </linearGradient>
    <linearGradient id="portraitMask" x1="0" y1="230" x2="0" y2="794" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="white" stop-opacity="1" />
      <stop offset="74%" stop-color="white" stop-opacity="1" />
      <stop offset="91%" stop-color="white" stop-opacity="0.3" />
      <stop offset="100%" stop-color="white" stop-opacity="0" />
    </linearGradient>
    <mask id="portraitFade">
      <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#portraitMask)" />
    </mask>
    <clipPath id="greenInfinityCoverClip">
      <rect x="116" y="1434" width="356" height="122" rx="22" />
    </clipPath>
    <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="18" />
    </filter>
    <filter id="beamGlow" x="-10%" y="-3000%" width="120%" height="6000%">
      <feGaussianBlur stdDeviation="4.2" />
    </filter>
  </defs>

  <rect width="${STAGE.width}" height="${STAGE.height}" fill="${assets.bgPrimary}" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#bgLinear)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#topHalo)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#portraitHalo)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#gridPattern)" mask="url(#gridMask)" opacity="0.56" />
  ${stars}

  <rect x="${HERO.x}" y="${HERO.y}" width="${HERO.width}" height="${HERO.height}" rx="${HERO.radius}" fill="url(#cardFill)" stroke="${withOpacity(assets.surfaceBorder, 0.74)}" stroke-width="1.5" />
  <rect x="${HERO.x + 16}" y="${HERO.y + 16}" width="${HERO.width - 32}" height="${HERO.height - 32}" rx="44" stroke="${rgba(assets.textMain, 0.08)}" stroke-width="1" />

  <circle cx="306" cy="416" r="214" fill="${rgba(assets.accentSoft, 0.07)}" filter="url(#softBlur)" />
  <circle cx="306" cy="416" r="196" fill="none" stroke="${rgba(assets.accentSoft, 0.16)}" stroke-width="1.2" />
  <circle cx="306" cy="416" r="154" fill="none" stroke="${rgba(assets.accent, 0.22)}" stroke-width="1.1" />
  <circle cx="306" cy="416" r="116" fill="none" stroke="${rgba(assets.textMain, 0.10)}" stroke-width="1" />
  <circle cx="110" cy="466" r="4.4" fill="${assets.accentSoft}" />
  <circle cx="438" cy="334" r="3.2" fill="${assets.textMain}" />

  <image href="${assets.portraitDataUri}" x="110" y="250" width="394" height="548" preserveAspectRatio="xMidYMax meet" opacity="0.20" filter="url(#softBlur)" />
  <g mask="url(#portraitFade)">
    <image href="${assets.portraitDataUri}" x="122" y="240" width="380" height="556" preserveAspectRatio="xMidYMax meet" />
  </g>

  <rect x="470" y="524" width="430" height="1.4" rx="1" fill="url(#beamLine)" />
  <rect x="470" y="523.2" width="430" height="2.8" rx="2" fill="url(#beamLine)" filter="url(#beamGlow)" opacity="0.72" />

  <rect x="120" y="814" width="334" height="72" rx="36" fill="url(#buttonFill)" />
  <rect x="626" y="814" width="292" height="72" rx="36" fill="${rgba(assets.bgPrimary, 0.12)}" stroke="${withOpacity(assets.surfaceBorder, 0.72)}" stroke-width="1.4" />

  <rect x="${leftFeatureX}" y="${FEATURE.y}" width="${FEATURE.width}" height="${FEATURE.height}" rx="${FEATURE.radius}" fill="url(#cardFill)" stroke="${withOpacity(assets.surfaceBorder, 0.7)}" stroke-width="1.4" />
  <rect x="${rightFeatureX}" y="${FEATURE.y}" width="${FEATURE.width}" height="${FEATURE.height}" rx="${FEATURE.radius}" fill="url(#cardFill)" stroke="${withOpacity(assets.surfaceBorder, 0.7)}" stroke-width="1.4" />
  <rect x="756" y="1100" width="182" height="94" rx="24" fill="${rgba(assets.accent, 0.08)}" stroke="${withOpacity(assets.surfaceBorder, 0.32)}" stroke-width="1" />
  <path d="M776 1170C810 1136 842 1118 874 1120C902 1122 926 1132 944 1148" stroke="${rgba(assets.accentSoft, 0.42)}" stroke-width="3.4" stroke-linecap="round" />
  <path d="M778 1194C812 1168 846 1156 876 1158C904 1160 928 1170 946 1188" stroke="${rgba(assets.textMain, 0.14)}" stroke-width="1.8" stroke-linecap="round" />
  <circle cx="876" cy="1148" r="5.6" fill="${rgba(assets.textMain, 0.44)}" />

  <rect x="${FOOT.x}" y="${FOOT.y}" width="${FOOT.width}" height="${FOOT.height}" rx="${FOOT.radius}" fill="url(#cardFill)" stroke="${withOpacity(assets.surfaceBorder, 0.72)}" stroke-width="1.4" />
  <rect x="108" y="1406" width="384" height="236" rx="30" fill="${rgba(assets.bgPrimary, 0.42)}" stroke="${withOpacity(assets.surfaceBorder, 0.42)}" stroke-width="1.1" />
  <image href="${assets.greenInfinityCoverDataUri}" x="116" y="1434" width="356" height="122" preserveAspectRatio="xMidYMid slice" clip-path="url(#greenInfinityCoverClip)" />
  <rect x="116" y="1434" width="356" height="122" rx="22" fill="url(#bgLinear)" opacity="0.15" />
  <rect x="586" y="1406" width="386" height="236" rx="30" fill="${rgba(assets.bgPrimary, 0.42)}" stroke="${withOpacity(assets.surfaceBorder, 0.42)}" stroke-width="1.1" />
  <rect x="612" y="1566" width="114" height="42" rx="18" fill="${rgba(assets.accent, 0.10)}" />
  <rect x="736" y="1566" width="132" height="42" rx="18" fill="${rgba(assets.accent, 0.08)}" />
</svg>`;
}

export async function renderStoryPng() {
  const assets = await loadAssets();
  const titleLines = nameLines(profile.name);

  const backgroundSvg = buildStorySvg(assets);
  const background = await sharp(Buffer.from(backgroundSvg), { density: 144 })
    .resize(STAGE.width, STAGE.height)
    .png()
    .toBuffer();

  const overlays = await Promise.all([
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.84)}" letter_spacing="1800">${escapeMarkup(DOMAIN_LABEL)}</span>`,
      width: 240,
      top: 190,
      left: 122,
      font: "DM Mono 16",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.96)}">${escapeMarkup("100+")}</span>`,
      width: 100,
      top: 236,
      left: 124,
      font: "Inter 38",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.54)}">${escapeMarkup("builds")}</span>`,
      width: 100,
      top: 290,
      left: 124,
      font: "Inter 16",
      fontfile: assets.interRegularTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.96)}">${escapeMarkup("4+")}</span>`,
      width: 100,
      top: 236,
      left: 850,
      font: "Inter 38",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.54)}">${escapeMarkup("years")}</span>`,
      width: 100,
      top: 290,
      left: 850,
      font: "Inter 16",
      fontfile: assets.interRegularTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}" letter_spacing="2000">${escapeMarkup(titleLines[0])}</span>`,
      width: 480,
      top: 304,
      left: 450,
      font: "Orbitron 54",
      fontfile: assets.orbitronTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}" letter_spacing="2000">${escapeMarkup(titleLines[1] ?? "")}</span>`,
      width: 500,
      top: 378,
      left: 450,
      font: "Orbitron 60",
      fontfile: assets.orbitronTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.88)}">${escapeMarkup(ROLE_LABEL)}</span>`,
      width: 440,
      top: 564,
      left: 450,
      font: "Inter 22",
      fontfile: assets.interMediumTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.70)}" letter_spacing="1200">${escapeMarkup(DISCIPLINE_LABEL)}</span>`,
      width: 280,
      top: 608,
      left: 450,
      font: "DM Mono 12",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.74)}">${escapeMarkup(SUPPORT_LABEL)}</span>`,
      width: 316,
      top: 648,
      left: 450,
      font: "Inter 15",
      fontfile: assets.interRegularTtfPath,
      spacing: 4,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.bgPrimary, 0.98)}">${escapeMarkup("View Work")}</span>`,
      width: 334,
      top: 838,
      left: 120,
      font: "Inter 21",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.92)}">${escapeMarkup("WhatsApp")}</span>`,
      width: 292,
      top: 838,
      left: 626,
      font: "Inter 20",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.72)}" letter_spacing="1400">${escapeMarkup("REACT SYSTEMS")}</span>`,
      width: 200,
      top: 1020,
      left: 108,
      font: "DM Mono 12",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.96)}">${escapeMarkup("Antigravity\nfrontend")}</span>`,
      width: 256,
      top: 1076,
      left: 108,
      font: "Inter 30",
      fontfile: assets.interMediumTtfPath,
      spacing: 2,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.72)}">${escapeMarkup("Cinematic UI and premium webapp surfaces.")}</span>`,
      width: 260,
      top: 1182,
      left: 108,
      font: "Inter 15",
      fontfile: assets.interRegularTtfPath,
      spacing: 4,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.72)}" letter_spacing="1400">${escapeMarkup("PLUGIN CASE")}</span>`,
      width: 180,
      top: 1020,
      left: 560,
      font: "DM Mono 12",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.96)}">${escapeMarkup("Meal-plan\nplugin")}</span>`,
      width: 220,
      top: 1076,
      left: 560,
      font: "Inter 30",
      fontfile: assets.interMediumTtfPath,
      spacing: 2,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.72)}">${escapeMarkup("Admin UX and structured workflow logic.")}</span>`,
      width: 210,
      top: 1182,
      left: 560,
      font: "Inter 15",
      fontfile: assets.interRegularTtfPath,
      spacing: 4,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.accentSoft, 0.72)}" letter_spacing="1400">${escapeMarkup("SELECTED WORK")}</span>`,
      width: 180,
      top: 1370,
      left: 108,
      font: "DM Mono 12",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}">${escapeMarkup(greenInfinity.name)}</span>`,
      width: 220,
      top: 1578,
      left: 132,
      font: "Inter 24",
      fontfile: assets.interMediumTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.56)}">${escapeMarkup("Brand identity")}</span>`,
      width: 160,
      top: 1618,
      left: 132,
      font: "DM Mono 12",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}">${escapeMarkup("Dubai GEO")}</span>`,
      width: 220,
      top: 1470,
      left: 612,
      font: "Inter 28",
      fontfile: assets.interMediumTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.56)}">${escapeMarkup("5+ brand builds")}</span>`,
      width: 180,
      top: 1516,
      left: 612,
      font: "DM Mono 12",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.92)}">${escapeMarkup("SEO / GEO")}</span>`,
      width: 114,
      top: 1568,
      left: 612,
      font: "Inter 14",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
    renderTextLayer({
      text: `<span foreground="${hexWithAlpha(assets.textMain, 0.92)}">${escapeMarkup("Dubai intent")}</span>`,
      width: 132,
      top: 1568,
      left: 736,
      font: "Inter 14",
      fontfile: assets.interMediumTtfPath,
      align: "center",
    }),
  ]);

  return sharp(background)
    .composite(overlays)
    .png({ compressionLevel: 9, palette: false, quality: 100 })
    .toBuffer();
}
