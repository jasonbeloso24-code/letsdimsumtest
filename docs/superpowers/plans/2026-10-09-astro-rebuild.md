# Let's Dimsum Phase 2: Astro rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Stack decision:** Astro, static output, on Cloudflare Pages, because it is a restaurant marketing site with no logins and it is the agency default. Every public page is prerendered HTML. The only on-demand routes are Keystatic's `/keystatic` admin and `/api/keystatic`, which need a server; `@astrojs/cloudflare` v13+ no longer supports Pages, so per Christian's decision (2026-10-09) a new Cloudflare **Workers** project (static assets + adapter) is added alongside the existing Pages project. Pages keeps serving production until the Workers preview is approved and the domain is moved.

**Goal:** Rebuild the approved one-page site as a component-based Astro site that meets the CLAUDE.md standards, with no visual change beyond the 17 listed fixes.

**Architecture:** `src/layouts/Base.astro` (head, SEO, fonts, nav, footer, consent banner) wraps pages in `src/pages/`. Each home section is a component in `src/components/`. Content lives in Keystatic-managed YAML under `src/content/` (read through Astro content collections) plus `src/data/business.ts` for business facts. JS is two small modules: `src/scripts/site.ts` (nav, open-today note, Lenis, analytics) and `src/scripts/motion.ts` (lazy-loaded Motion animations). Entrance start states for the hero are CSS keyframes gated by a `motion` class set in `<head>`; scroll reveals hide only elements that are still below the fold when JS runs, so nothing can get stuck invisible.

**Tech Stack:** Astro 7, @astrojs/cloudflare 14 (Workers), Keystatic 0.6 (+ @astrojs/react, React 19, admin route only), Motion 14, Lenis 1.3, Fontsource (Fraunces Variable, Figtree Variable), Astro Image + Sharp, Satori + resvg (OG image), @astrojs/sitemap, @astrojs/check, Lighthouse CI, lychee.

**Spec:** Christian's Phase 2 brief (conversation, 2026-10-09) and `CLAUDE.md` part 3 standards.

## Global Constraints

- Design lock: `qa/baseline/*.png` is the source of truth. Allowed visible changes are only those in brief items 1 to 17.
- Never push to `main`. Work on `feat/astro-rebuild`. Conventional Commits; every commit builds.
- Motion values copied from the approved build: reveal y 24px, 0.8s, 60ms stagger, ease GSAP `power2.out` = cubic-bezier(0.33, 1, 0.68, 1); hero lines 1.1s, 0.12s stagger, 0.15s delay, `power3.out` = cubic-bezier(0.25, 1, 0.5, 1); hero fades 0.8s, 0.06s stagger, 0.45s delay; rays 0.5s, 0.12s stagger, 0.3s delay, `power1.out` = cubic-bezier(0.5, 1, 0.89, 1); parallax -8% to 8%; menu tab items y 12, 0.6s, 0.03s stagger; Lenis `lerp: 0.1`; marquee 40s.
- Animate only transform and opacity.
- prefers-reduced-motion: no Lenis, no parallax, no marquee loop, no scroll-linked scale, everything static.
- Unknown client facts are marked `[CLIENT TO CONFIRM]` in data and are not rendered as fake content. No invented reviews, phone, links or prices beyond the confirmed-to-be-checked public facts already in CLAUDE.md.
- Fonts: two families max (Fraunces Variable display, Figtree Variable body), self-hosted, latin + latin-ext only, `font-display: swap`. Chinese uses `"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`.
- CSP allows only what the site loads; inline scripts allowed by hash, verified in CI.
- Secrets never in the repo. Keystatic secrets live in Cloudflare.

## Review Focus

1. JavaScript disabled: every section, the full menu (all 7 categories) and all images are visible; no blank reveal areas. Test: Playwright with `javaScriptEnabled: false` asserts `[data-reveal]` opacity 1 and 7 visible `.menu__panel`.
2. A module fails to load or loads late: the hero headline must still appear (CSS keyframes, not JS). Test: block `/_astro/*.js` in Playwright and assert `.line__inner` transform resolves to none after 2s.
3. Visitor on a weekend: open-today note says 10 PM; weekday 9 PM. Test: Playwright `clock.setFixedTime` on a Saturday and a Tuesday.
4. Consent declined or never given: no request to googletagmanager.com, no dataLayer events beyond consent defaults. Test: Playwright counts requests to `googletagmanager.com` before and after Decline.
5. CSP drift: a new inline script without its hash would be silently blocked in production. Test: `scripts/check-csp.mjs` hashes every inline script in `dist/**/*.html` and fails if any hash is missing from `public/_headers`.

---

### Task 1: Astro structure, content and components (design-locked port)

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/{Nav,Hero,Marquee,About,Signature,Menu,Place,Visit,Footer,Mascot,CookieBanner}.astro`, `src/pages/index.astro` (rewritten), `src/pages/menu.astro`, `src/pages/404.astro`
- Create: `src/content.config.ts`, `keystatic.config.ts`, `src/content/menu/*.yaml`, `src/content/dishes/*.yaml`, `src/content/photos/*.yaml`, `src/content/hours.yaml`, `src/data/business.ts`
- Delete: `src/menu-data.js`, `src/main.js`, `public/img/`, `public/favicon.svg` (replaced in Task 4)
- Move: `public/{branding,images,place}/` to `source-assets/` (not shipped); crops to `src/assets/photos/*.jpg` via `scripts/optimize_images.py` (crop only, q92)

- [ ] Port each section's markup verbatim into its component; read menu, dishes, photos and hours from content collections; render the marquee's second copy and the about word spans in Astro (no JS).
- [ ] Replace `<img>` with `<Picture formats={['avif','webp']}>` with explicit widths; hero `loading="eager" fetchpriority="high"`, all others lazy.
- [ ] Build; diff against `qa/baseline` at 375/768/1440 (reduced motion full page + above fold). Expected: only font and image re-encode noise.
- [ ] Commit `feat: rebuild page as Astro components with Keystatic content`.

### Task 2: Motion, Lenis and CSS motion fixes (items 2, 3, 4)

**Files:** Create `src/scripts/site.ts`, `src/scripts/motion.ts`; modify `src/styles/main.css`, `src/layouts/Base.astro`.

- [ ] `site.ts`: nav toggle and scrolled state, open-today note, menu tabs, Lenis (`lerp: 0.1`, `autoRaf: true`, anchor links with offset -72), then `import('./motion')` when motion is allowed.
- [ ] `motion.ts`: `inView` + `animate` reveals (start state set only for elements below the fold), word fill and parallax and hero scale via `scroll()`, menu item stagger.
- [ ] CSS: hero lines, hero fades and rays become keyframes under `.motion`; hero clip-path becomes frame `scale(0.84)` with inner image counter-scale; link underlines become `::after` `scaleX`. Remove the 4-second fallback and the `.motion [data-reveal] { opacity: 0 }` rule.
- [ ] Verify: Review Focus 1 to 3 tests pass; screenshot diff unchanged.
- [ ] Commit `refactor: replace GSAP with lazy-loaded Motion and CSS keyframes`.

### Task 3: Fonts, content fixes, playbook slots (items 5, 6, 7, 13, 17)

- [ ] Fontsource `@font-face` for latin + latin-ext only; preload the latin Fraunces file.
- [ ] Remove placeholder quotes; Facebook link renders only when `FACEBOOK_URL` is set.
- [ ] Rating line becomes "See our reviews on Google" linking to the listing.
- [ ] `business.ts` holds phone, order, booking, Facebook, Google listing, Maps links, price, address, each `[CLIENT TO CONFIRM]`; Visit renders call/order/booking buttons and holiday hours only when data exists; menu PDF link in Menu section and /menu.
- [ ] `scripts/make_menu_pdf.py` writes `public/menu/lets-dimsum-menu.pdf` from the two boards.
- [ ] Wonton card at 768px: feature figure stacks image above text between 40rem and 60rem.
- [ ] Commit `feat: self-host fonts and add restaurant data slots`.

### Task 4: SEO, OG, favicons, headers (items 8, 9, 10)

- [ ] `Base.astro` props `title`, `description`, `path`; canonical + OG + Twitter from `SITE_URL` env.
- [ ] `scripts/og.mjs` (Satori + resvg) writes `public/og.png` 1200x630; `scripts/favicons.mjs` (resvg) writes 16/32/48 ico, 180, 192, 512 PNGs and `site.webmanifest`.
- [ ] JSON-LD Restaurant + Menu (no priceRange, phone, rating).
- [ ] `public/robots.txt`, `@astrojs/sitemap`, `404.astro`.
- [ ] `public/_headers` with CSP (hash of the head script), HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options; `scripts/check-csp.mjs` (Review Focus 5).
- [ ] Commit `feat: add SEO metadata, OG image, favicons and security headers`.

### Task 5: Analytics and consent, legal pages (items 11, 12)

- [ ] `CookieBanner.astro` rendered only when `PUBLIC_GTM_ID` is set; consent stored in localStorage; GTM injected only after Accept with Consent Mode v2 defaults denied then granted; footer "Cookie settings" reopens it.
- [ ] `track(event)` pushes to dataLayer only after consent; `menu_view`, `directions_click`, `call_click`, `order_click`, `reservation_click`.
- [ ] `src/layouts/Legal.astro` and `/privacy`, `/cookies`, `/terms`, `/accessibility`, `/allergens`, each with the lawyer-review note; footer links.
- [ ] Verify Review Focus 4.
- [ ] Commit `feat: add consent-gated analytics and legal page templates`.

### Task 6: Keystatic and Cloudflare Workers (items 14, 15)

- [ ] `astro.config.mjs`: `adapter: cloudflare()`, `integrations: [react(), keystatic(), sitemap()]`, `site: SITE_URL`; public pages stay prerendered.
- [ ] `wrangler.jsonc` with assets directory and `nodejs_compat`.
- [ ] Verify `/keystatic` loads in `astro dev`; `npm run build` passes; dist contains no `source-assets` originals.
- [ ] Commit `feat: add Keystatic admin on Cloudflare Workers`.

### Task 7: CI, measurement, docs, PR

- [ ] `.github/workflows/ci.yml` on pull_request: `npm ci`, build, `astro check`, CSP check, lychee link check on `dist`, Lighthouse CI on `/` and `/menu/`, `npm audit --audit-level=high`.
- [ ] Lighthouse mobile locally for `/` and `/menu/`; record measured numbers only.
- [ ] Update CLAUDE.md part 1 stack line; replace the Vite-era build reference; README.
- [ ] `/ponytail-review`; Playwright every page at 375/768/1440, JS off, reduced motion; screenshots to `qa/after/`.
- [ ] Push `feat/astro-rebuild`, open PR with summary, preview URL, screenshots, Lighthouse, review result, visual changes, `[CLIENT TO CONFIRM]` list. Do not merge.
