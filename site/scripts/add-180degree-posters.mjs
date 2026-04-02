import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = path.resolve(__dirname, "../public/creative-works/180degree/posters");

const bg = "#ea580c";
const accent = "#fb923c";
const name = "180 Degree";

function makeSvg(label) {
  return Buffer.from(
    `<svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1350" fill="url(#g)"/>
  <rect x="1" y="1" width="1078" height="1348" fill="none" stroke="${accent}" stroke-opacity="0.25" stroke-width="2" rx="4"/>
  <text x="540" y="660" font-family="system-ui,sans-serif" font-size="48px" font-weight="700" fill="white" fill-opacity="0.9" text-anchor="middle">${name}</text>
  <text x="540" y="720" font-family="system-ui,sans-serif" font-size="28px" fill="${accent}" fill-opacity="0.7" text-anchor="middle">${label}</text>
  <text x="540" y="1320" font-family="monospace" font-size="18px" fill="white" fill-opacity="0.25" text-anchor="middle">REPLACE WITH REAL FILE - 1080x1350</text>
</svg>`
  );
}

await fs.promises.mkdir(base, { recursive: true });

for (const i of [10, 11, 12]) {
  const num = String(i).padStart(2, "0");
  const dest = path.join(base, `poster-${num}.jpg`);
  if (fs.existsSync(dest)) {
    console.log("already exists:", dest);
    continue;
  }
  await sharp(makeSvg(`Poster ${num}`)).resize(1080, 1350).jpeg({ quality: 90 }).toFile(dest);
  console.log("created:", dest);
}

console.log("Done — poster-10, poster-11, poster-12 ready for 180degree.");
