// Post-build checks on dist/client: CSP covers every inline script, SEO lengths, one h1, no inline styles.
// Run after `npm run build`: node scripts/check-dist.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DIST = 'dist/client';
const headers = fs.readFileSync('public/_headers', 'utf8');
const csp = headers.match(/Content-Security-Policy: (.+)/)?.[1] ?? '';
const errors = [];

const htmlFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
  });

for (const file of htmlFiles(DIST)) {
  const html = fs.readFileSync(file, 'utf8');
  const page = path.relative(DIST, file);

  for (const [, attrs, body] of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    if (/\ssrc=/.test(attrs ?? '') || /application\/ld\+json/.test(attrs ?? '')) continue;
    const hash = `'sha256-${crypto.createHash('sha256').update(body).digest('base64')}'`;
    if (!csp.includes(hash)) errors.push(`${page}: inline script not allowed by CSP, add ${hash} to public/_headers`);
  }
  if (/\sstyle="/.test(html)) errors.push(`${page}: inline style attribute (blocked by CSP style-src)`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1].replace(/&#39;/g, "'").replace(/&amp;/g, '&') ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1].replace(/&#39;/g, "'").replace(/&amp;/g, '&') ?? '';
  if (title.length < 50 || title.length > 60) errors.push(`${page}: title is ${title.length} chars (50 to 60): ${title}`);
  if (desc.length < 120 || desc.length > 160) errors.push(`${page}: description is ${desc.length} chars (120 to 160)`);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) errors.push(`${page}: ${h1s} h1 elements (needs exactly 1)`);
}

if (fs.existsSync(path.join(DIST, 'source-assets'))) errors.push('original photos were copied into dist');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('dist checks passed');
