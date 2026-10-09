# Let's Dimsum

Website for Let's Dimsum (来点心), an authentic Chinese dim sum restaurant in San Rafael, San Pablo City, Laguna.

Astro (static pages) on Cloudflare, with a Keystatic admin for the menu, dishes, photos and hours. Motion and Lenis for animation and smooth scrolling.

## Requirements

- Node.js 22.12 or newer
- Python 3 with Pillow, only for re-cropping photos or rebuilding the menu PDF (`pip install pillow`); fontTools + brotli only for re-trimming fonts

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:4321. The content editor is at http://localhost:4321/keystatic.

## Build and preview

```sh
npm run build      # generates the OG image, then builds to dist/ (dist/client = static site, dist/server = Worker)
npm run preview    # serves the build in the Cloudflare Workers runtime
```

## Checks

```sh
npm run check        # TypeScript / Astro type-check
npm test             # unit tests
npm run check:dist   # after a build: CSP covers inline scripts, SEO title/description lengths, one h1 per page
```

CI (`.github/workflows/ci.yml`) runs all of these on every pull request, plus an internal link check, Lighthouse CI on `/` and `/menu/`, and `npm audit`.

## Editing content

| What | Where |
| --- | --- |
| Menu items, signature dishes, photos, hours and holiday hours | Keystatic at `/keystatic` (files in `src/content/`) |
| Phone, Facebook, order and booking links, address, price | `src/data/business.ts` (empty values hide the button) |
| Menu categories | `src/data/menu.ts` |
| Page sections | `src/components/` and `src/pages/` |
| Colors, fonts, spacing | `src/styles/tokens.css` |
| Security headers (CSP) | `public/_headers` |

## Assets

```sh
npm run images     # crop originals in source-assets/ into src/assets/photos/
npm run menu-pdf   # rebuild public/menu/lets-dimsum-menu.pdf from the menu boards
npm run favicons   # rebuild the favicon set from public/icons/mascot.svg
python scripts/subset_fonts.py   # re-trim the Fontsource fonts into src/assets/fonts/
```

## Environment variables

| Name | Where | Purpose |
| --- | --- | --- |
| `SITE_URL` | Cloudflare build variable | Production URL for canonical links, OG image and sitemap |
| `PUBLIC_GTM_ID` | Cloudflare build variable | Google Tag Manager container; the cookie banner only appears when it's set |
| `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` | Cloudflare Worker secrets | Keystatic GitHub login |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Cloudflare build variable | Keystatic GitHub app name |

Never commit secrets. Locally they live in `.env` (git-ignored).

See `CLAUDE.md` for project notes, standards and items still to confirm with the client.
