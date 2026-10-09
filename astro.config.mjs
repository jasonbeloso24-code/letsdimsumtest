import { defineConfig } from 'astro/config';

export default defineConfig({
  // Keep source whitespace: minifying it shifts inline spacing in the approved design.
  compressHTML: false,
});
