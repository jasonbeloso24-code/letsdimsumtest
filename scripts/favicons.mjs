// Builds the favicon set from the mascot: favicon.ico (16/32/48), PNGs (32, 180, 192, 512) and site.webmanifest.
// Run with: npm run favicons. Outputs are committed to public/.
import fs from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

const pub = (p) => new URL(`../public/${p}`, import.meta.url);
const mascot = await fs.readFile(pub('icons/mascot.svg'), 'utf8');
const inner = mascot.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

// Rice-paper rounded tile so the line mascot reads on dark and light browser chrome.
const tile = (pad) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#F5F0E6"/>` +
  `<g transform="translate(${pad} ${pad}) scale(${(100 - 2 * pad) / 100})">${inner}</g></svg>`;
const png = (size, pad = 6) => new Resvg(tile(pad), { fitTo: { mode: 'width', value: size } }).render().asPng();

// ICO with embedded PNGs: 6-byte header, 16-byte entry per image, then the PNG data.
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size % 256, e);
    header.writeUInt8(size % 256, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((im) => im.data)]);
}

await fs.writeFile(pub('favicon.ico'), ico([16, 32, 48].map((size) => ({ size, data: png(size, 2) }))));
await fs.writeFile(pub('favicon-32.png'), png(32, 2));
await fs.writeFile(pub('apple-touch-icon.png'), png(180, 12));
await fs.writeFile(pub('icon-192.png'), png(192, 12));
await fs.writeFile(pub('icon-512.png'), png(512, 12));
await fs.writeFile(
  pub('site.webmanifest'),
  JSON.stringify(
    {
      name: "Let's Dimsum",
      short_name: "Let's Dimsum",
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: '#F5F0E6',
      background_color: '#F5F0E6',
      display: 'browser',
    },
    null,
    2,
  ) + '\n',
);
console.log('favicons written');
