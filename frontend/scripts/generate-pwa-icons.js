import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'public', 'card.jpg');
const outDir = path.join(root, 'public', 'pwa');

const INK = { r: 15, g: 23, b: 42, alpha: 1 };

async function writeSquareIcon(name, size, { maskable = false } = {}) {
  const logoSize = maskable ? Math.round(size * 0.62) : size;
  const logo = await sharp(src)
    .resize(logoSize, logoSize, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  if (maskable) {
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: INK,
      },
    })
      .composite([{ input: logo, gravity: 'center' }])
      .png()
      .toFile(path.join(outDir, name));
    return;
  }

  await sharp(logo).resize(size, size, { fit: 'cover' }).png().toFile(path.join(outDir, name));
}

async function main() {
  if (!fs.existsSync(src)) {
    throw new Error(`Logo source not found: ${src}`);
  }

  fs.mkdirSync(outDir, { recursive: true });

  await writeSquareIcon('apple-touch-icon.png', 180);
  await writeSquareIcon('pwa-192x192.png', 192);
  await writeSquareIcon('pwa-512x512.png', 512);
  await writeSquareIcon('pwa-512x512-maskable.png', 512, { maskable: true });

  console.log('PWA icons generated in public/pwa/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
