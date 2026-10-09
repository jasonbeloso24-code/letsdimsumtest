// Cloudflare Pages builds (CF_PAGES=1) serve the "dist" folder as static files, but the Workers adapter
// puts the static site in dist/client. On Pages only, move it up so Pages keeps serving the static site
// (no Keystatic there; that runs on the Workers project). Workers builds and local builds are untouched.
import fs from 'node:fs';

if (process.env.CF_PAGES !== '1') process.exit(0);

fs.rmSync('dist/server', { recursive: true, force: true });
for (const entry of fs.readdirSync('dist/client')) fs.renameSync(`dist/client/${entry}`, `dist/${entry}`);
fs.rmdirSync('dist/client');
console.log('Cloudflare Pages: static site moved to dist/');
