import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

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

type OgAssets = RootTokens & {
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

const STAGE = { width: 1200, height: 630 };
const SAFE = { left: 70, right: 70, top: 55, bottom: 50 };
const DOMAIN_LABEL = new URL(profile.siteUrl).host;
const ROLE_LABEL = "Digital Operations & Growth Manager";
const SUPPORT_LABEL = "Helping you build, optimize, and grow your business";
const STATUS_LABEL = "Open to New Mandates";

let cachedAssetsPromise: Promise<OgAssets> | undefined;

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

function buildStars(tokens: RootTokens) {
  const random = mulberry32(74);
  const stars: string[] = [];
  const palette = [tokens.textMain, tokens.accentSoft, tokens.accent];

  for (let index = 0; index < 300; index += 1) {
    const x = Math.round(random() * STAGE.width * 10) / 10;
    const y = Math.round(random() * STAGE.height * 10) / 10;
    const radius = 0.35 + random() * 1.4;
    const opacity = 0.18 + random() * 0.66;
    const color = palette[Math.floor(random() * palette.length)] || tokens.textMain;

    stars.push(
      `<circle cx="${x}" cy="${y}" r="${radius.toFixed(2)}" fill="${rgba(color, Number(opacity.toFixed(2)))}" />`,
    );

    if (random() > 0.88) {
      const glowRadius = radius * (2.4 + random() * 2.2);
      const glowOpacity = 0.03 + random() * 0.07;
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

async function loadAssets(): Promise<OgAssets> {
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

function buildBackgroundSvg(assets: OgAssets) {
  const stars = buildStars(assets);
  const portraitCenterX = 276;
  const portraitCenterY = 292;
  const dividerWidth = STAGE.width - SAFE.left - SAFE.right;

  return `
<svg width="${STAGE.width}" height="${STAGE.height}" viewBox="0 0 ${STAGE.width} ${STAGE.height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgLinear" x1="600" y1="0" x2="600" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${assets.bgSecondary}" />
      <stop offset="100%" stop-color="${assets.bgPrimary}" />
    </linearGradient>
    <radialGradient id="upperHalo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(594 -28) rotate(90) scale(268 520)">
      <stop offset="0%" stop-color="${rgba(assets.accent, 0.54)}" />
      <stop offset="36%" stop-color="${rgba(assets.accent, 0.18)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </radialGradient>
    <radialGradient id="leftHalo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${portraitCenterX} ${portraitCenterY - 6}) rotate(90) scale(238 255)">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0.36)}" />
      <stop offset="45%" stop-color="${rgba(assets.accent, 0.20)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </radialGradient>
    <radialGradient id="rightNebula" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(914 126) rotate(25) scale(330 170)">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0.11)}" />
      <stop offset="46%" stop-color="${rgba(assets.accent, 0.08)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </radialGradient>
    <linearGradient id="titleBeam" x1="608" y1="288" x2="1064" y2="288" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0)}" />
      <stop offset="28%" stop-color="${rgba(assets.accentSoft, 0.34)}" />
      <stop offset="50%" stop-color="${rgba(assets.textMain, 0.96)}" />
      <stop offset="72%" stop-color="${rgba(assets.accentSoft, 0.34)}" />
      <stop offset="100%" stop-color="${rgba(assets.accentSoft, 0)}" />
    </linearGradient>
    <linearGradient id="footerDivider" x1="${SAFE.left}" y1="474" x2="${STAGE.width - SAFE.right}" y2="474" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0)}" />
      <stop offset="18%" stop-color="${rgba(assets.accentSoft, 0.32)}" />
      <stop offset="50%" stop-color="${rgba(assets.textMain, 0.90)}" />
      <stop offset="82%" stop-color="${rgba(assets.accentSoft, 0.32)}" />
      <stop offset="100%" stop-color="${rgba(assets.accentSoft, 0)}" />
    </linearGradient>
    <linearGradient id="portraitMask" x1="0" y1="92" x2="0" y2="612" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="white" stop-opacity="1" />
      <stop offset="68%" stop-color="white" stop-opacity="1" />
      <stop offset="82%" stop-color="white" stop-opacity="0.68" />
      <stop offset="96%" stop-color="white" stop-opacity="0.12" />
      <stop offset="100%" stop-color="white" stop-opacity="0" />
    </linearGradient>
    <mask id="portraitFade">
      <rect x="0" y="0" width="${STAGE.width}" height="${STAGE.height}" fill="url(#portraitMask)" />
    </mask>
    <pattern id="gridPattern" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" stroke="${rgba(assets.textMain, 0.035)}" stroke-width="1" />
    </pattern>
    <radialGradient id="gridMaskFill" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(602 28) rotate(90) scale(220 540)">
      <stop offset="0%" stop-color="white" />
      <stop offset="100%" stop-color="black" />
    </radialGradient>
    <mask id="gridMask">
      <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#gridMaskFill)" />
    </mask>
    <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="22" />
    </filter>
    <filter id="portraitGlow" x="-35%" y="-25%" width="190%" height="175%">
      <feGaussianBlur stdDeviation="20" />
    </filter>
    <filter id="beamGlow" x="-10%" y="-3000%" width="120%" height="6000%">
      <feGaussianBlur stdDeviation="4.2" />
    </filter>
  </defs>

  <rect width="${STAGE.width}" height="${STAGE.height}" fill="${assets.bgPrimary}" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#bgLinear)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#upperHalo)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#leftHalo)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#rightNebula)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#gridPattern)" mask="url(#gridMask)" opacity="0.60" />
  <rect x="299" y="0" width="1" height="298" fill="${rgba(assets.accentSoft, 0.56)}" opacity="0.46" />
  ${stars}

  <g transform="translate(${portraitCenterX} ${portraitCenterY})">
    <circle cx="0" cy="0" r="208" fill="none" stroke="${rgba(assets.accentSoft, 0.18)}" stroke-width="1.15" />
    <circle cx="0" cy="0" r="152" fill="none" stroke="${rgba(assets.accent, 0.24)}" stroke-width="1.1" />
    <circle cx="0" cy="0" r="96" fill="none" stroke="${rgba(assets.accentSoft, 0.12)}" stroke-width="1" stroke-dasharray="5 8" />
    <circle cx="-199" cy="-51" r="4.3" fill="${assets.accentSoft}" />
    <circle cx="131" cy="-75" r="3.8" fill="${assets.textMain}" />
    <circle cx="70" cy="56" r="3.5" fill="${rgba(assets.accentSoft, 0.85)}" />
  </g>

  <image
    href="${assets.portraitDataUri}"
    x="30"
    y="90"
    width="468"
    height="522"
    preserveAspectRatio="xMidYMax meet"
    opacity="0.20"
    filter="url(#portraitGlow)"
  />
  <g mask="url(#portraitFade)">
    <image
      href="${assets.portraitDataUri}"
      x="48"
      y="92"
      width="448"
      height="520"
      preserveAspectRatio="xMidYMax meet"
    />
  </g>

  <rect x="548" y="291" width="516" height="1.4" rx="1" fill="url(#titleBeam)" />
  <rect x="548" y="290.4" width="516" height="2.8" rx="2" fill="url(#titleBeam)" filter="url(#beamGlow)" opacity="0.76" />

  <rect x="${SAFE.left}" y="473" width="${dividerWidth}" height="1.2" rx="1" fill="url(#footerDivider)" />
  <rect x="${SAFE.left}" y="472.4" width="${dividerWidth}" height="2.5" rx="2" fill="url(#footerDivider)" filter="url(#beamGlow)" opacity="0.48" />

  <circle cx="897" cy="540" r="5" fill="${assets.accentSoft}" />
  <circle cx="897" cy="540" r="11" fill="${rgba(assets.accentSoft, 0.15)}" />

  <rect x="0" y="360" width="${STAGE.width}" height="270" fill="url(#bgLinear)" opacity="0.26" />
  <rect x="0" y="350" width="${STAGE.width}" height="280" fill="${rgba(assets.bgPrimary, 0.30)}" />
</svg>`;
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

export async function renderHomeOgPng() {
  const assets = await loadAssets();
  const titleLines = nameLines(profile.name);
  const supportLines = wrapText(SUPPORT_LABEL, 34).slice(0, 2);
  const titleLineOneMarkup = `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}" letter_spacing="7600">${escapeMarkup(titleLines[0])}</span>`;
  const titleLineTwoMarkup = `<span foreground="${hexWithAlpha(assets.textMain, 0.98)}" letter_spacing="7600">${escapeMarkup(titleLines[1] ?? "")}</span>`;
  const roleMarkup = `<span foreground="${hexWithAlpha(assets.textMain, 0.90)}">${escapeMarkup(ROLE_LABEL)}</span>`;
  const supportMarkup = `<span foreground="${hexWithAlpha(assets.textMain, 0.82)}">${escapeMarkup(supportLines.join("\n"))}</span>`;
  const domainMarkup = `<span foreground="${hexWithAlpha(assets.accentSoft, 0.84)}" letter_spacing="2200">${escapeMarkup(DOMAIN_LABEL)}</span>`;
  const statusMarkup = `<span foreground="${hexWithAlpha(assets.accentSoft, 0.84)}" letter_spacing="1800">${escapeMarkup(STATUS_LABEL)}</span>`;

  const backgroundSvg = buildBackgroundSvg(assets);
  const background = await sharp(Buffer.from(backgroundSvg), { density: 144 })
    .resize(STAGE.width, STAGE.height)
    .png()
    .toBuffer();

  const titleLineOne = await sharp({
    text: {
      text: titleLineOneMarkup,
      width: 666,
      font: "Orbitron 70",
      fontfile: assets.orbitronTtfPath,
      align: "left",
      rgba: true,
    },
  }).png().toBuffer();

  const titleLineTwo = await sharp({
    text: {
      text: titleLineTwoMarkup,
      width: 676,
      font: "Orbitron 74",
      fontfile: assets.orbitronTtfPath,
      align: "left",
      rgba: true,
    },
  }).png().toBuffer();

  const titleLineOneGlow = await sharp(titleLineOne)
    .tint(assets.accentSoft)
    .blur(5)
    .png()
    .toBuffer();

  const titleLineTwoGlow = await sharp(titleLineTwo)
    .tint(assets.accentSoft)
    .blur(6)
    .png()
    .toBuffer();

  const roleBase = await renderTextLayer({
    text: roleMarkup,
    width: 560,
    top: 322,
    left: 548,
    font: "Inter 25",
    fontfile: assets.interMediumTtfPath,
  });

  const supportBase = await renderTextLayer({
    text: supportMarkup,
    width: 492,
    top: 378,
    left: 548,
    font: "Inter 18",
    fontfile: assets.interRegularTtfPath,
    spacing: 6,
  });

  const roleGlow = await sharp(roleBase.input)
    .tint(assets.accentSoft)
    .blur(3.5)
    .png()
    .toBuffer();

  const supportGlow = await sharp(supportBase.input)
    .tint(assets.accentSoft)
    .blur(4)
    .png()
    .toBuffer();

  const overlays = await Promise.all([
    renderTextLayer({
      text: domainMarkup,
      width: 280,
      top: 523,
      left: SAFE.left + 2,
      font: "DM Mono 18",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
    renderTextLayer({
      text: statusMarkup,
      width: 260,
      top: 523,
      left: 915,
      font: "DM Mono 18",
      fontfile: assets.dmMonoRegularTtfPath,
    }),
  ]);

  return sharp(background)
    .composite([
      { input: titleLineOneGlow, top: 96, left: 540, blend: "screen" },
      { input: titleLineTwoGlow, top: 184, left: 542, blend: "screen" },
      { input: titleLineOne, top: 104, left: 548 },
      { input: titleLineTwo, top: 192, left: 548 },
      { input: roleGlow, top: 322, left: 548, blend: "screen" },
      { input: supportGlow, top: 378, left: 548, blend: "screen" },
      roleBase,
      supportBase,
      ...overlays,
    ])
    .png({ compressionLevel: 9, palette: false, quality: 100 })
    .toBuffer();
}

export async function renderHomeOgJpeg() {
  const pngBuffer = await renderHomeOgPng();

  return sharp(pngBuffer)
    .jpeg({
      quality: 84,
      mozjpeg: true,
      chromaSubsampling: "4:4:4",
    })
    .toBuffer();
}
