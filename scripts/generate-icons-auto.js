// Simple script to generate icons using puppeteer
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

// SVG content
const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="240" fill="url(#gradient)" opacity="0.1"/>
  <g transform="translate(256, 256)">
    <rect x="-180" y="-30" width="60" height="60" rx="8" fill="url(#gradient)" opacity="0.9"/>
    <rect x="-170" y="-20" width="40" height="40" rx="4" fill="white" opacity="0.2"/>
    <rect x="-120" y="-12" width="240" height="24" rx="12" fill="url(#gradient)"/>
    <rect x="120" y="-30" width="60" height="60" rx="8" fill="url(#gradient)" opacity="0.9"/>
    <rect x="130" y="-20" width="40" height="40" rx="4" fill="white" opacity="0.2"/>
    <line x1="-100" y1="0" x2="-60" y2="0" stroke="white" stroke-width="2" opacity="0.3"/>
    <line x1="60" y1="0" x2="100" y2="0" stroke="white" stroke-width="2" opacity="0.3"/>
  </g>
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg>`;

// Create HTML page for puppeteer
const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; }
    canvas { display: none; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    const svg = ${JSON.stringify(svgContent)};
    const sizes = [32, 180, 192, 512];
    const names = ['favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'];
    
    async function generateAll() {
      const results = [];
      for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];
        const canvas = document.getElementById('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        await new Promise((resolve) => {
          img.onload = () => {
            ctx.drawImage(img, 0, 0, size, size);
            const dataUrl = canvas.toDataURL('image/png');
            results.push({ name: names[i], data: dataUrl });
            resolve();
          };
          const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
          img.src = URL.createObjectURL(svgBlob);
        });
      }
      window.results = results;
      console.log('Done');
    }
    
    generateAll();
  </script>
</body>
</html>`;

const htmlPath = join(publicDir, 'temp-icon-gen.html');
writeFileSync(htmlPath, htmlContent);

console.log('Created temporary HTML file. Now run:');
console.log('npx puppeteer scripts/generate-icons-puppeteer.js');
