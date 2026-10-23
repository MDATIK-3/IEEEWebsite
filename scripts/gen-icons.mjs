import sharp from 'sharp';

const src = 'public/images/IEEELogo.png'; // source logo
const white = { r: 255, g: 255, b: 255, alpha: 1 };

// standard icons
await sharp(src).resize(192, 192, { fit: 'contain', background: white }).png()
  .toFile('public/favicon/icon-192.png');
await sharp(src).resize(512, 512, { fit: 'contain', background: white }).png()
  .toFile('public/favicon/icon-512.png');

// maskable: logo at ~80% with safe-zone padding (410 + 51*2 = 512)
await sharp(src).resize(410, 410, { fit: 'contain', background: white })
  .extend({ top: 51, bottom: 51, left: 51, right: 51, background: white })
  .png().toFile('public/favicon/icon-512-maskable.png');

console.log('done');
