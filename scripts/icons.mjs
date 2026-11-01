// Erzeugt die App-Icons aus dem Bayern-Wappen: node scripts/icons.mjs
import sharp from 'sharp';

const SRC = 'assets/fcb.png';
const CREAM = { r: 244, g: 236, b: 220, alpha: 1 };

async function icon(file, size, crestRatio, background) {
  const crest = Math.round(size * crestRatio);
  const logo = await sharp(SRC).resize(crest, crest, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile('public/' + file);
}

await icon('icon-192.png', 192, 0.86, CREAM);
await icon('icon-512.png', 512, 0.86, CREAM);
await icon('icon-maskable-512.png', 512, 0.62, CREAM);
await icon('apple-touch-icon.png', 180, 0.8, CREAM);
await icon('favicon.png', 64, 1, { r: 0, g: 0, b: 0, alpha: 0 });
console.log('Icons erzeugt.');
