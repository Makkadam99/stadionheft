// Verkleinert heruntergeladene Vereinswappen für die App: node scripts/club-logos.mjs <Quellordner>
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const src = process.argv[2];
if (!src) throw new Error('Quellordner fehlt');
const dest = 'assets/clubs';
fs.mkdirSync(dest, { recursive: true });

let total = 0;
for (const file of fs.readdirSync(src).filter((f) => f.endsWith('.png'))) {
  const out = path.join(dest, file);
  await sharp(path.join(src, file))
    .trim({ threshold: 1 })
    .resize(96, 96, { fit: 'inside', withoutEnlargement: true })
    .png({ palette: true, quality: 90, compressionLevel: 9 })
    .toFile(out);
  total += fs.statSync(out).size;
}
console.log(`${fs.readdirSync(dest).length} Wappen, zusammen ${(total / 1024).toFixed(0)} KB`);
