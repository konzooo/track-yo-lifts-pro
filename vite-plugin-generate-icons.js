// Vite plugin to generate icons from SVG
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export default function generateIconsPlugin() {
  return {
    name: 'generate-icons',
    buildStart() {
      const publicDir = join(process.cwd(), 'public');
      const svgPath = join(publicDir, 'icon.svg');
      
      if (!existsSync(svgPath)) {
        console.warn('icon.svg not found, skipping icon generation');
        return;
      }

      // Check if icons already exist
      const requiredIcons = [
        'apple-touch-icon.png',
        'icon-192.png',
        'icon-512.png'
      ];
      
      const allExist = requiredIcons.every(icon => 
        existsSync(join(publicDir, icon))
      );
      
      if (allExist) {
        console.log('Icons already exist, skipping generation');
        return;
      }

      console.log('⚠️  Icons need to be generated. Please:');
      console.log('   1. Open http://localhost:8080/generate-icons.html in your browser');
      console.log('   2. Click "Generate All Icons"');
      console.log('   3. Save the downloaded files to the public/ folder');
    }
  };
}
