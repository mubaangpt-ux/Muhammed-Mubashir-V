/**
 * create-creative-assets.mjs
 * Generates placeholder image files for all Creative Works companies.
 * Run: node scripts/create-creative-assets.mjs
 * 
 * After running, replace each placeholder file with your real design.
 * File paths are printed at the end as a checklist.
 */

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../public/creative-works");

// ─── Company definitions ────────────────────────────────────────────────────
const companies = [
  {
    id: "digibug",
    name: "DigiBug",
    color: "#2563eb",
    accentColor: "#60a5fa",
    assets: {
      cover:    { w: 800,  h: 600  },
      posters:  { count: 9, w: 1080, h: 1350 },
      logos:    { count: 4, w: 600,  h: 600  },
    },
  },
  {
    id: "drsamkotkat",
    name: "Dr. Sam Kotkat",
    color: "#0f766e",
    accentColor: "#2dd4bf",
    assets: {
      cover:   { w: 800,  h: 600  },
      posters: { count: 9, w: 1080, h: 1350 },
    },
  },
  {
    id: "180degree",
    name: "180 Degree",
    color: "#ea580c",
    accentColor: "#fb923c",
    assets: {
      cover:   { w: 800,  h: 600  },
      posters: { count: 9, w: 1080, h: 1350 },
      reels:   { count: 6, coverW: 540, coverH: 960 },
      webapp:  { count: 3, w: 1440, h: 900 },
    },
  },
  {
    id: "raslanbc",
    name: "RaslanBC",
    color: "#1e3a5f",
    accentColor: "#60a5fa",
    assets: {
      cover:   { w: 800,  h: 600  },
      posters: { count: 9, w: 1080, h: 1350 },
      reels:   { count: 6, coverW: 540, coverH: 960 },
      website: { count: 3, w: 1440, h: 900 },
      profile: { w: 720,  h: 1018 },
    },
  },
  {
    id: "raslanrealestate",
    name: "Raslan Real Estate",
    color: "#ca8a04",
    accentColor: "#fbbf24",
    assets: {
      cover:   { w: 800,  h: 600  },
      posters: { count: 9, w: 1080, h: 1350 },
    },
  },
  {
    id: "careezfood",
    name: "Careez Food",
    color: "#16a34a",
    accentColor: "#4ade80",
    assets: {
      cover:   { w: 800,  h: 600  },
      posters: { count: 9, w: 1080, h: 1350 },
    },
  },
  {
    id: "bluemark",
    name: "BlueMark Real Estate",
    color: "#0369a1",
    accentColor: "#38bdf8",
    assets: {
      cover:   { w: 800,  h: 600  },
      reels:   { count: 6, coverW: 540, coverH: 960 },
      posters: { count: 9, w: 1080, h: 1350 },
      website: { count: 3, w: 1440, h: 900 },
    },
  },
  {
    id: "luminary",
    name: "Green Infinity",
    color: "#173523",
    accentColor: "#4ade80",
    skipCover: true, // cover.jpg already exists
    assets: {
      logos:         { count: 4, w: 600,  h: 600  },
      businessCards: { w: 840,   h: 528  },
      profile:       { w: 720,   h: 1018 },
    },
  },
  {
    id: "greenway",
    name: "GreenWay",
    color: "#059669",
    accentColor: "#6ee7b7",
    assets: {
      cover:   { w: 800,  h: 600  },
      posters: { count: 9, w: 1080, h: 1350 },
      reels:   { count: 6, coverW: 540, coverH: 960 },
      website: { count: 3, w: 1440, h: 900 },
    },
  },
  {
    id: "ceeyem",
    name: "CeeYem Co.",
    color: "#475569",
    accentColor: "#94a3b8",
    assets: {
      cover:   { w: 800,  h: 600  },
      posters: { count: 9, w: 1080, h: 1350 },
      website: { count: 3, w: 1440, h: 900 },
    },
  },
  {
    id: "otherworks",
    name: "Creative Lab",
    color: "#7c3aed",
    accentColor: "#c084fc",
    assets: {
      cover:   { w: 800,  h: 600  },
      posters: { count: 9, w: 1080, h: 1350 },
      reels:   { count: 9, coverW: 540, coverH: 960 }, // 9 reels!
    },
  },
];

// ─── SVG placeholder builder ─────────────────────────────────────────────────
function makeSvg(w, h, bg, accent, label, sublabel = "") {
  return Buffer.from(`
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect x="1" y="1" width="${w-2}" height="${h-2}" fill="none" stroke="${accent}" stroke-opacity="0.25" stroke-width="2" rx="4"/>
  <text x="${w/2}" y="${h/2 - 14}" font-family="system-ui,sans-serif" font-size="${Math.max(14, Math.min(28, w/22))}px"
    font-weight="700" fill="white" fill-opacity="0.9" text-anchor="middle">${label}</text>
  <text x="${w/2}" y="${h/2 + 18}" font-family="system-ui,sans-serif" font-size="${Math.max(11, Math.min(18, w/32))}px"
    fill="${accent}" fill-opacity="0.7" text-anchor="middle">${sublabel}</text>
  <text x="${w/2}" y="${h - 18}" font-family="monospace" font-size="${Math.max(9,Math.min(13,w/50))}px"
    fill="white" fill-opacity="0.25" text-anchor="middle">REPLACE WITH REAL FILE • ${w}×${h}</text>
</svg>`);
}

// ─── File creation helpers ───────────────────────────────────────────────────
async function mkdirp(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function writeJpg(svgBuf, destPath, w, h) {
  await mkdirp(path.dirname(destPath));
  if (fs.existsSync(destPath)) return; // never overwrite real files
  await sharp(svgBuf).resize(w, h).jpeg({ quality: 90 }).toFile(destPath);
  console.log("  ✓", path.relative(process.cwd(), destPath));
}

// Creates an empty .mp4 placeholder (user must replace with real video)
async function writeMp4Stub(destPath) {
  await mkdirp(path.dirname(destPath));
  if (fs.existsSync(destPath)) return;
  await fs.promises.writeFile(destPath, "");
  console.log("  ⚠ stub", path.relative(process.cwd(), destPath));
}

function pad(n) { return String(n).padStart(2, "0"); }

// ─── Main ────────────────────────────────────────────────────────────────────
const allFiles = [];

for (const company of companies) {
  const base = path.join(PUBLIC, company.id);
  const { bg, accent, name } = { bg: company.color, accent: company.accentColor, name: company.name };
  console.log(`\n📁 ${company.id}`);

  const a = company.assets;

  // Cover
  if (!company.skipCover && a.cover) {
    const dest = path.join(base, "cover.jpg");
    const svg  = makeSvg(a.cover.w, a.cover.h, bg, accent, name, "Cover Image");
    await writeJpg(svg, dest, a.cover.w, a.cover.h);
    allFiles.push(dest);
  }

  // Posters
  if (a.posters) {
    for (let i = 0; i < a.posters.count; i++) {
      const dest = path.join(base, "posters", `poster-${pad(i + 1)}.jpg`);
      const svg  = makeSvg(a.posters.w, a.posters.h, bg, accent, `${name}`, `Poster ${pad(i + 1)}`);
      await writeJpg(svg, dest, a.posters.w, a.posters.h);
      allFiles.push(dest);
    }
  }

  // Logos
  if (a.logos) {
    for (let i = 0; i < a.logos.count; i++) {
      const dest = path.join(base, "logos", `logo-${pad(i + 1)}.jpg`);
      const svg  = makeSvg(a.logos.w, a.logos.h, bg, accent, `${name}`, `Logo ${pad(i + 1)}`);
      await writeJpg(svg, dest, a.logos.w, a.logos.h);
      allFiles.push(dest);
    }
  }

  // Website screenshots
  if (a.website) {
    for (let i = 0; i < a.website.count; i++) {
      const dest = path.join(base, "website", `website-${pad(i + 1)}.jpg`);
      const svg  = makeSvg(a.website.w, a.website.h, bg, accent, `${name}`, `Website Screenshot ${pad(i + 1)}`);
      await writeJpg(svg, dest, a.website.w, a.website.h);
      allFiles.push(dest);
    }
  }

  // WebApp screenshots
  if (a.webapp) {
    for (let i = 0; i < a.webapp.count; i++) {
      const dest = path.join(base, "webapp", `webapp-${pad(i + 1)}.jpg`);
      const svg  = makeSvg(a.webapp.w, a.webapp.h, bg, accent, `${name}`, `WebApp Screenshot ${pad(i + 1)}`);
      await writeJpg(svg, dest, a.webapp.w, a.webapp.h);
      allFiles.push(dest);
    }
  }

  // Profile
  if (a.profile) {
    const dest = path.join(base, "profile", "profile.jpg");
    const svg  = makeSvg(a.profile.w, a.profile.h, bg, accent, `${name}`, "Company Profile");
    await writeJpg(svg, dest, a.profile.w, a.profile.h);
    allFiles.push(dest);
  }

  // Business cards
  if (a.businessCards) {
    const frontDest = path.join(base, "business-cards", "front.jpg");
    const backDest  = path.join(base, "business-cards", "back.jpg");
    const svgF = makeSvg(a.businessCards.w, a.businessCards.h, bg, accent, `${name}`, "Business Card — Front");
    const svgB = makeSvg(a.businessCards.w, a.businessCards.h, bg, accent, `${name}`, "Business Card — Back");
    await writeJpg(svgF, frontDest, a.businessCards.w, a.businessCards.h);
    await writeJpg(svgB, backDest,  a.businessCards.w, a.businessCards.h);
    allFiles.push(frontDest, backDest);
  }

  // Reels (cover images + mp4 stubs)
  if (a.reels) {
    for (let i = 0; i < a.reels.count; i++) {
      // Cover thumbnail
      const coverDest = path.join(base, "reels", `cover-${pad(i + 1)}.jpg`);
      const svg = makeSvg(a.reels.coverW, a.reels.coverH, bg, accent, `${name}`, `Reel ${pad(i + 1)} Cover`);
      await writeJpg(svg, coverDest, a.reels.coverW, a.reels.coverH);
      allFiles.push(coverDest);

      // MP4 stub (empty — user replaces with real video)
      const mp4Dest = path.join(base, "reels", `reel-${pad(i + 1)}.mp4`);
      await writeMp4Stub(mp4Dest);
      allFiles.push(mp4Dest);
    }
  }
}

// ─── Print checklist ─────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(60)}`);
console.log(`✅  ${allFiles.length} files created`);
console.log(`\n📋  REPLACE THESE WITH YOUR REAL FILES:\n`);

const byCompany = {};
for (const f of allFiles) {
  const rel = path.relative(PUBLIC, f);
  const company = rel.split(path.sep)[0];
  if (!byCompany[company]) byCompany[company] = [];
  byCompany[company].push(`  public/creative-works/${rel.replaceAll(path.sep, "/")}`);
}

for (const [comp, files] of Object.entries(byCompany)) {
  console.log(`\n▸ ${comp}`);
  for (const f of files) console.log(f);
}
