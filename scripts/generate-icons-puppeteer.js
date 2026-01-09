import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

const svgContent = readFileSync(join(publicDir, 'icon.svg'), 'utf-8');

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 20px; }
    canvas { border: 1px solid #ddd; margin: 10px; }
  </style>
</head>
<body>
  <div id="results"></div>
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
      document.getElementById('results').textContent = 'Generated ' + results.length + ' icons';
    }
    
    generateAll();
  </script>
</body>
</html>`;

async function generateIcons() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setContent(htmlContent);
  await page.waitForFunction(() => window.results && window.results.length === 4, { timeout: 10000 });
  
  const results = await page.evaluate(() => window.results);
  
  for (const { name, data } of results) {
    const base64Data = data.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    writeFileSync(join(publicDir, name), buffer);
    console.log(`✓ Generated ${name}`);
  }
  
  await browser.close();
  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
