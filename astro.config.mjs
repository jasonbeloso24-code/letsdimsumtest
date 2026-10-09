import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';

// [CLIENT TO CONFIRM] Production URL. Set SITE_URL in the Cloudflare build variables;
// the fallback is a guess at the pages.dev name and must be replaced before launch.
const site = process.env.SITE_URL || 'https://letsdimsumtest.pages.dev';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  // Every public page is prerendered; only Keystatic's /keystatic and /api/keystatic run on the Worker.
  // Images are compiled to AVIF/WebP at build (no paid Cloudflare Images); no sessions, so no KV namespace.
  adapter: cloudflare({ imageService: 'compile' }),
  session: false,
  integrations: [
    react(),
    keystatic(),
    sitemap({ filter: (page) => !page.includes('/keystatic') }),
  ],
  // Keep source whitespace: minifying it shifts inline spacing in the approved design.
  compressHTML: false,
  build: {
    // External stylesheets only, so the CSP can stay strict (no inline styles).
    inlineStylesheets: 'never',
  },
});
