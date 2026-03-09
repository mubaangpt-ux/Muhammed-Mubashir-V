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
  orbitronDataUri: string;
  interRegularDataUri: string;
  interMediumDataUri: string;
  monoRegularDataUri: string;
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

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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

function mulberry32(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function wrapText(text: string, maxCharsPerLine: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
      continue;
    }
    current = next;
  }

  if (current) lines.push(current);
  return lines;
}

function buildStars(tokens: RootTokens) {
  const random = mulberry32(74);
  const stars: string[] = [];
  const palette = [tokens.textMain, tokens.accentSoft, tokens.accent];

  for (let index = 0; index < 260; index += 1) {
    const x = Math.round(random() * STAGE.width * 10) / 10;
    const y = Math.round(random() * STAGE.height * 10) / 10;
    const radius = 0.35 + random() * 1.35;
    const opacity = 0.2 + random() * 0.62;
    const color = palette[Math.floor(random() * palette.length)] || tokens.textMain;

    stars.push(
      `<circle cx="${x}" cy="${y}" r="${radius.toFixed(2)}" fill="${rgba(color, Number(opacity.toFixed(2)))}" />`,
    );

    if (random() > 0.86) {
      const bloomRadius = radius * (2.4 + random() * 2.3);
      const bloomOpacity = 0.03 + random() * 0.08;
      stars.push(
        `<circle cx="${x}" cy="${y}" r="${bloomRadius.toFixed(2)}" fill="${rgba(color, Number(bloomOpacity.toFixed(2)))}" />`,
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
      const orbitronPath = path.resolve(process.cwd(), "public/fonts/orbitron.woff2");
      const interRegularPath = path.resolve(
        process.cwd(),
        "node_modules/@fontsource/inter/files/inter-latin-400-normal.woff",
      );
      const interMediumPath = path.resolve(
        process.cwd(),
        "node_modules/@fontsource/inter/files/inter-latin-500-normal.woff",
      );
      const monoRegularPath = path.resolve(
        process.cwd(),
        "node_modules/@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff",
      );

      const [
        portraitDataUri,
        orbitronDataUri,
        interRegularDataUri,
        interMediumDataUri,
        monoRegularDataUri,
      ] = await Promise.all([
        readFileAsDataUri(portraitPath, "image/png"),
        readFileAsDataUri(orbitronPath, "font/woff2"),
        readFileAsDataUri(interRegularPath, "font/woff"),
        readFileAsDataUri(interMediumPath, "font/woff"),
        readFileAsDataUri(monoRegularPath, "font/woff"),
      ]);

      return {
        ...tokens,
        portraitDataUri,
        orbitronDataUri,
        interRegularDataUri,
        interMediumDataUri,
        monoRegularDataUri,
      };
    })();
  }

  return cachedAssetsPromise;
}

function buildHomeOgSvg(assets: OgAssets) {
  const supportLines = wrapText(SUPPORT_LABEL, 34);
  const stars = buildStars(assets);
  const headlineSize = profile.name.length > 18 ? 48 : 54;
  const headlineTracking = profile.name.length > 18 ? 3.4 : 4.6;
  const portraitX = SAFE.left - 16;
  const portraitY = SAFE.top + 29;
  const textBlockX = SAFE.left + 470;
  const textBlockY = SAFE.top + 85;
  const dividerY = 470;
  const footerY = STAGE.height - SAFE.bottom - 33;
  const roleY = 240;
  const supportStartY = 292;

  return `
<svg width="${STAGE.width}" height="${STAGE.height}" viewBox="0 0 ${STAGE.width} ${STAGE.height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Orbitron';
        font-style: normal;
        font-weight: 700;
        src: url('${assets.orbitronDataUri}') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        src: url('${assets.interRegularDataUri}') format('woff');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        src: url('${assets.interMediumDataUri}') format('woff');
      }
      @font-face {
        font-family: 'DM Mono';
        font-style: normal;
        font-weight: 400;
        src: url('${assets.monoRegularDataUri}') format('woff');
      }
      .display {
        font-family: 'Orbitron', sans-serif;
        font-weight: 700;
        fill: ${assets.textMain};
      }
      .body {
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        fill: ${rgba(assets.textMain, 0.76)};
      }
      .body-medium {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        fill: ${rgba(assets.textMain, 0.88)};
      }
      .mono {
        font-family: 'DM Mono', monospace;
        font-weight: 400;
        text-transform: uppercase;
        fill: ${rgba(assets.accentSoft, 0.82)};
      }
    </style>
    <linearGradient id="bgLinear" x1="600" y1="0" x2="600" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${assets.bgSecondary}" />
      <stop offset="100%" stop-color="${assets.bgPrimary}" />
    </linearGradient>
    <radialGradient id="bodyGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(120 30) rotate(24) scale(782 456)">
      <stop offset="0%" stop-color="${rgba(assets.accent, 0.24)}" />
      <stop offset="52%" stop-color="${rgba(assets.accent, 0.08)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </radialGradient>
    <radialGradient id="topHalo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(592 -40) rotate(90) scale(270 500)">
      <stop offset="0%" stop-color="${rgba(assets.accent, 0.55)}" />
      <stop offset="34%" stop-color="${rgba(assets.accent, 0.18)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </radialGradient>
    <radialGradient id="centerHalo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(620 110) rotate(90) scale(180 260)">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0.22)}" />
      <stop offset="100%" stop-color="${rgba(assets.accentSoft, 0)}" />
    </radialGradient>
    <radialGradient id="portraitHalo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(278 288) rotate(90) scale(240 250)">
      <stop offset="0%" stop-color="${rgba(assets.accent, 0.28)}" />
      <stop offset="44%" stop-color="${rgba(assets.accentSoft, 0.18)}" />
      <stop offset="100%" stop-color="${rgba(assets.accent, 0)}" />
    </radialGradient>
    <radialGradient id="contentShade" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(640 305) rotate(90) scale(205 760)">
      <stop offset="0%" stop-color="${rgba(assets.bgPrimary, 0.64)}" />
      <stop offset="36%" stop-color="${rgba(assets.bgPrimary, 0.52)}" />
      <stop offset="72%" stop-color="${rgba(assets.bgPrimary, 0.16)}" />
      <stop offset="100%" stop-color="${rgba(assets.bgPrimary, 0)}" />
    </radialGradient>
    <linearGradient id="groundFade" x1="600" y1="364" x2="600" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.bgPrimary, 0)}" />
      <stop offset="20%" stop-color="${rgba(assets.bgPrimary, 0.18)}" />
      <stop offset="56%" stop-color="${rgba(assets.bgPrimary, 0.62)}" />
      <stop offset="100%" stop-color="${rgba(assets.bgPrimary, 0.94)}" />
    </linearGradient>
    <linearGradient id="divider" x1="${SAFE.left}" y1="470" x2="${STAGE.width - SAFE.right}" y2="470" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${rgba(assets.accentSoft, 0)}" />
      <stop offset="18%" stop-color="${rgba(assets.accentSoft, 0.42)}" />
      <stop offset="50%" stop-color="${rgba(assets.textMain, 0.92)}" />
      <stop offset="82%" stop-color="${rgba(assets.accentSoft, 0.42)}" />
      <stop offset="100%" stop-color="${rgba(assets.accentSoft, 0)}" />
    </linearGradient>
    <linearGradient id="portraitMask" x1="0" y1="85" x2="0" y2="610" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="white" stop-opacity="1" />
      <stop offset="66%" stop-color="white" stop-opacity="1" />
      <stop offset="82%" stop-color="white" stop-opacity="0.72" />
      <stop offset="96%" stop-color="white" stop-opacity="0.15" />
      <stop offset="100%" stop-color="white" stop-opacity="0" />
    </linearGradient>
    <mask id="portraitFade">
      <rect x="0" y="0" width="${STAGE.width}" height="${STAGE.height}" fill="url(#portraitMask)" />
    </mask>
    <pattern id="gridPattern" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" stroke="${rgba(assets.textMain, 0.04)}" stroke-width="1" />
    </pattern>
    <radialGradient id="gridMaskFill" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 30) rotate(90) scale(210 520)">
      <stop offset="0%" stop-color="white" />
      <stop offset="100%" stop-color="black" />
    </radialGradient>
    <mask id="gridMask">
      <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#gridMaskFill)" />
    </mask>
    <filter id="blurSoft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="24" />
    </filter>
    <filter id="portraitGlow" x="-35%" y="-20%" width="190%" height="170%">
      <feGaussianBlur stdDeviation="18" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
    </filter>
    <filter id="nameGlow" x="-40%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="2" stdDeviation="9" flood-color="${rgba(assets.bgPrimary, 0.92)}" />
      <feDropShadow dx="0" dy="4" stdDeviation="18" flood-color="${rgba(assets.bgPrimary, 0.72)}" />
      <feDropShadow dx="0" dy="0" stdDeviation="16" flood-color="${rgba(assets.accent, 0.18)}" />
    </filter>
    <filter id="dividerGlow" x="-10%" y="-3000%" width="120%" height="6000%">
      <feGaussianBlur stdDeviation="4.2" />
    </filter>
  </defs>

  <rect width="${STAGE.width}" height="${STAGE.height}" fill="${assets.bgPrimary}" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#bgLinear)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#bodyGlow)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#topHalo)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#centerHalo)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#portraitHalo)" />
  <rect width="${STAGE.width}" height="${STAGE.height}" fill="url(#gridPattern)" mask="url(#gridMask)" opacity="0.62" />
  <rect x="299" y="0" width="1" height="290" fill="${rgba(assets.accentSoft, 0.62)}" opacity="0.54" />
  ${stars}

  <g transform="translate(280 290)">
    <circle cx="0" cy="0" r="210" fill="none" stroke="${rgba(assets.accentSoft, 0.18)}" stroke-width="1.2" />
    <circle cx="0" cy="0" r="151" fill="none" stroke="${rgba(assets.accent, 0.28)}" stroke-width="1.2" />
    <circle cx="0" cy="0" r="92" fill="none" stroke="${rgba(assets.accentSoft, 0.14)}" stroke-width="1.1" stroke-dasharray="5 8" />
    <circle cx="-202.8" cy="-54.4" r="4.6" fill="${assets.accentSoft}" />
    <circle cx="128.4" cy="-79.3" r="4.1" fill="${assets.textMain}" />
    <circle cx="74.4" cy="54.1" r="3.8" fill="${rgba(assets.accentSoft, 0.86)}" />
  </g>

  <image href="${assets.portraitDataUri}" x="${portraitX - 18}" y="${portraitY - 2}" width="442" height="518" preserveAspectRatio="xMidYMax meet" opacity="0.22" filter="url(#portraitGlow)" />
  <g mask="url(#portraitFade)">
    <image href="${assets.portraitDataUri}" x="${portraitX}" y="${portraitY}" width="422" height="514" preserveAspectRatio="xMidYMax meet" />
  </g>

  <rect x="0" y="126" width="${STAGE.width}" height="350" fill="url(#contentShade)" filter="url(#blurSoft)" opacity="0.95" />
  <rect x="0" y="352" width="${STAGE.width}" height="278" fill="url(#groundFade)" />

  <g transform="translate(${textBlockX} ${textBlockY})">
    <text x="0" y="0" class="display" font-size="${headlineSize}" letter-spacing="${headlineTracking}" filter="url(#nameGlow)">${escapeXml(profile.name)}</text>
    <text x="0" y="${roleY}" class="body-medium" font-size="28" letter-spacing="0.6">${escapeXml(ROLE_LABEL)}</text>
    ${supportLines
      .map((line, index) => `<text x="0" y="${supportStartY + index * 38}" class="body" font-size="22">${escapeXml(line)}</text>`)
      .join("")}
  </g>

  <rect x="${SAFE.left}" y="${dividerY - 1}" width="${STAGE.width - SAFE.left - SAFE.right}" height="1.2" rx="1" fill="url(#divider)" />
  <rect x="${SAFE.left}" y="${dividerY - 1.5}" width="${STAGE.width - SAFE.left - SAFE.right}" height="2.4" rx="2" fill="url(#divider)" filter="url(#dividerGlow)" opacity="0.56" />

  <g transform="translate(${SAFE.left} ${footerY})">
    <text x="0" y="0" class="mono" font-size="19" letter-spacing="1.7">${escapeXml(DOMAIN_LABEL)}</text>
  </g>
  <g transform="translate(${STAGE.width - SAFE.right - 238} ${footerY})">
    <circle cx="0" cy="-7" r="5" fill="${assets.accentSoft}" />
    <circle cx="0" cy="-7" r="11" fill="${rgba(assets.accentSoft, 0.16)}" />
    <text x="20" y="0" class="mono" font-size="19" letter-spacing="1.4">${escapeXml(STATUS_LABEL)}</text>
  </g>
</svg>`;
}

export async function renderHomeOgPng() {
  const assets = await loadAssets();
  const svg = buildHomeOgSvg(assets);

  return sharp(Buffer.from(svg), { density: 144 })
    .resize(STAGE.width, STAGE.height)
    .png({ compressionLevel: 9, palette: false, quality: 100 })
    .toBuffer();
}
