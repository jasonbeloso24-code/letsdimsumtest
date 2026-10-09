# Let's Dimsum

One-page website for Let's Dimsum (来点心), an authentic Chinese dim sum restaurant in San Rafael, San Pablo City, Laguna.

Built with Astro (static output), Lenis smooth scrolling and GSAP ScrollTrigger animations.

## Requirements

- Node.js 22.12 or newer
- Python 3 with Pillow (only for re-processing images)

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:4321.

## Build and preview

```sh
npm run build     # outputs the static site to dist/
npm run preview   # serves dist/ locally to check the production build
```

## Images

```sh
npm run images
```

Crops and converts the original photos in `public/` to WebP in `public/img/`. Crop boxes are in `scripts/optimize_images.py`.

## Where to edit

| What | File |
| --- | --- |
| Page content and sections | `src/pages/index.astro` |
| Colors, fonts, spacing | `src/styles/tokens.css` |
| Styles | `src/styles/main.css` |
| Menu items (rendered at build time) | `src/menu-data.js` |
| Animations, menu tabs, Facebook URL | `src/main.js` |
| Astro settings | `astro.config.mjs` |

See `CLAUDE.md` for project notes, standards and items still to confirm with the client.
