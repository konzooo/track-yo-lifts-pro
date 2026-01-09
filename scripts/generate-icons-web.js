// Generate icons using a web-based SVG to PNG converter
// This script uses an online API to convert SVG to PNG

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

const svgPath = join(publicDir, 'icon.svg');
const svgContent = readFileSync(svgPath, 'utf-8');

// Use reimg API (free SVG to PNG converter)
const apiUrl = 'https://reimg.app/api/v1/convert';

const sizes = [
  { size: 32, name: 'favicon-32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' }
];

async function generateIcon(size, filename) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: 'svg',
        output: 'png',
        width: size,
        height: size,
        data: svgContent
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    writeFileSync(join(publicDir, filename), Buffer.from(buffer));
    console.log(`✓ Generated ${filename} (${size}x${size})`);
  } catch (error) {
    console.error(`Error generating ${filename}:`, error.message);
    throw error;
  }
}

async function generateAll() {
  console.log('Generating icons using web API...');
  for (const { size, name } of sizes) {
    await generateIcon(size, name);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.log('\nAll icons generated successfully!');
}

generateAll().catch(console.error);
