import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

const svgBuffer = readFileSync(join(publicDir, 'icon.svg'));

// Generate favicon.ico (32x32)
await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile(join(publicDir, 'favicon-32.png'));

// Generate apple-touch-icon (180x180)
await sharp(svgBuffer)
  .resize(180, 180)
  .png()
  .toFile(join(publicDir, 'apple-touch-icon.png'));

// Generate various sizes for manifest
await sharp(svgBuffer)
  .resize(192, 192)
  .png()
  .toFile(join(publicDir, 'icon-192.png'));

await sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile(join(publicDir, 'icon-512.png'));

console.log('Icons generated successfully!');
