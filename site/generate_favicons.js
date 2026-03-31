import sharp from 'sharp';
import fs from 'fs';

async function generate() {
  const input = 'public/m-logo.png';
  if (!fs.existsSync(input)) {
    console.error('m-logo.png not found');
    return;
  }
  
  await sharp(input).resize(192, 192).toFile('public/icon-192.png');
  await sharp(input).resize(512, 512).toFile('public/icon-512.png');
  await sharp(input).resize(180, 180).toFile('public/apple-touch-icon.png');
  await sharp(input).resize(32, 32).toFile('public/favicon.png');
  
  // A simplistic ICO hack: just copy the 32x32 PNG to .ico for fallback
  fs.copyFileSync('public/favicon.png', 'public/favicon.ico');
  
  console.log('Successfully generated all icons based on m-logo.png');
}

generate().catch(console.error);
