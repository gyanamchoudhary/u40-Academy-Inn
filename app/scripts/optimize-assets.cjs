const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = process.argv[2] || './public/assets';

const files = fs.readdirSync(ASSETS_DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

const sizes = [
  { suffix: '-sm', width: 640 },
  { suffix: '-md', width: 1024 },
  { suffix: '-lg', width: 1536 },
];

async function convert() {
  for (const file of files) {
    const inputPath = path.join(ASSETS_DIR, file);
    const baseName = path.parse(file).name;
    const metadata = await sharp(inputPath).metadata();

    for (const size of sizes) {
      if (metadata.width && metadata.width < size.width) {
        // Skip up-scaling: only generate sizes smaller than original
        continue;
      }
      const outWebp = path.join(ASSETS_DIR, `${baseName}${size.suffix}.webp`);
      const outAvif = path.join(ASSETS_DIR, `${baseName}${size.suffix}.avif`);
      try {
        await sharp(inputPath)
          .resize({ width: size.width, withoutEnlargement: true })
          .webp({ quality: 82, effort: 4 })
          .toFile(outWebp);
        await sharp(inputPath)
          .resize({ width: size.width, withoutEnlargement: true })
          .avif({ quality: 75, effort: 4 })
          .toFile(outAvif);
        console.log(`Generated ${baseName}${size.suffix}.{webp,avif}`);
      } catch (err) {
        console.error(`Failed ${file} ${size.suffix}:`, err.message);
      }
    }
  }
}

convert().catch(console.error);
