// Builds public/og.png (1200x630) with Satori + resvg. Runs before `astro build`.
import fs from 'node:fs/promises';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const font = (pkg, file) => fs.readFile(new URL(`../node_modules/@fontsource/${pkg}/files/${file}`, import.meta.url));
const [fraunces, figtree, mascot, hero] = await Promise.all([
  font('fraunces', 'fraunces-latin-300-normal.woff'),
  font('figtree', 'figtree-latin-500-normal.woff'),
  fs.readFile(new URL('../public/icons/mascot.svg', import.meta.url), 'utf8'),
  sharp(fileURLToPath(new URL('../src/assets/photos/hero-table.jpg', import.meta.url)))
    .resize(460, 550, { fit: 'cover' })
    .jpeg({ quality: 82 })
    .toBuffer(),
]);

const GREEN = '#0F5A48';
const h = (type, style, children) => ({ type, props: { style, children } });
const img = (src, style) => ({ type: 'img', props: { src, style } });

const tree = h(
  'div',
  { width: 1200, height: 630, display: 'flex', alignItems: 'center', padding: '40px 64px', background: '#F5F0E6' },
  [
    h('div', { display: 'flex', flexDirection: 'column', width: 560 }, [
      img(`data:image/svg+xml;base64,${Buffer.from(mascot).toString('base64')}`, { width: 92, height: 92, marginBottom: 36 }),
      h('div', { fontFamily: 'Fraunces', fontSize: 76, lineHeight: 1.04, color: GREEN, letterSpacing: -1 }, 'Steamed fresh, served warm.'),
      h('div', { fontFamily: 'Figtree', fontSize: 28, color: '#8A6440', marginTop: 32 }, "Let's Dimsum · San Pablo City, Laguna"),
    ]),
    h('div', { display: 'flex', position: 'absolute', top: 40, right: 64, width: 460, height: 550, borderRadius: 28, overflow: 'hidden' }, [
      img(`data:image/jpeg;base64,${hero.toString('base64')}`, { width: 460, height: 550 }),
    ]),
  ],
);

const svg = await satori(tree, {
  width: 1200,
  height: 630,
  fonts: [
    { name: 'Fraunces', data: fraunces, weight: 300, style: 'normal' },
    { name: 'Figtree', data: figtree, weight: 500, style: 'normal' },
  ],
});
// Palette PNG keeps the file small enough for social previews.
const png = await sharp(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng())
  .png({ palette: true, quality: 90, compressionLevel: 9 })
  .toBuffer();
await fs.writeFile(new URL('../public/og.png', import.meta.url), png);
console.log(`og.png ${Math.round(png.length / 1024)} KB`);
