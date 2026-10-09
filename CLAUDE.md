# Let's Dimsum: project guide

This file has three parts: the Let's Dimsum project notes, how to install the tools we use, and the agency standards that apply to every site.

---

## 1. Let's Dimsum project

**Client:** LET'S DIMSUM (Let's Dimsum, 来点心), a Chinese dim sum restaurant in San Rafael, San Pablo City, Laguna, Philippines.

**Status:** The design is built and approved by Christian. Do not change the look, layout, copy, images or animation timing unless Christian asks.

**Stack:** Astro, static output, on Cloudflare Pages, because it's a restaurant marketing site with no logins and it's the agency default. Motion (lazy-loaded) for animation and Lenis for smooth scrolling. The Cloudflare project `letsdimsumtest` is a Workers project with static assets (Workers Builds, git-connected; production https://letsdimsumtest.jasonbeloso24.workers.dev, previews per branch). Keystatic's admin runs on that same Worker through `@astrojs/cloudflare`, since the adapter no longer supports Pages. List any standard the build doesn't meet instead of fixing it silently.

**Folders**
- `public/`: client branding (logo and mascot), place photos (storefront and interiors) and images (food photos and two printed menu boards).
- `reference/reference site.png`: riteora.framer.website. Extract qualities only (smooth inertia scroll, section pacing). It's too bold for this brand; this site is calmer and softer.

**Brand**
- Green #0F5A48: headings, buttons, footer
- Yellow #E1A507: tiny accents only (mascot rays, hover underlines)
- Paper #F5F0E6: page background
- Wood #B98A5A: hairlines and small labels
- Ink #23201B: body text
- Feel: like sitting in the dining room. Warm wood, soft daylight, lots of space.

**Client facts.** These come from public listings, not the owners. Keep them marked [CLIENT TO CONFIRM] until the owners check them.
- Address: San Rafael, San Pablo City, Laguna (plus code 38C4+92Q). Full street address needed.
- Hours: Monday to Friday 11 AM to 9 PM, Saturday and Sunday 11 AM to 10 PM (from a Facebook post). Holiday hours unknown.
- Phone: none listed anywhere yet.
- Price range: ₱500 to ₱1,000 per person (Google, user-reported).
- Google rating: 4.4 from 52 reviews. This changes, so link to the listing instead of hard-coding it.
- Facebook page: "LET'S Dimsum - San Pablo City". URL needed.
- Ordering and booking links (Grab, Foodpanda, reservations): unknown.
- Allergen information: unknown.
- Guest quotes: none. Use real reviews only, with permission.

**Analytics events for this site:** `order_click`, `reservation_click` (conversions); `menu_view`, `call_click`, `directions_click` (engagement).

---

## 2. Tools: install sources

Run these in Claude Code, one command at a time, then restart Claude Code.

| Tool | Install |
| --- | --- |
| Ponytail | `/plugin marketplace add DietrichGebert/ponytail` then `/plugin install ponytail@ponytail` |
| frontend-design | `/plugin install frontend-design@claude-plugins-official` |
| Superpowers | `/plugin install superpowers@claude-plugins-official` |
| ui-ux-pro-max | `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` then `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill` |
| Context7 | In a terminal: `claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp`. Optional: add `--api-key YOUR_KEY` (free key at context7.com/dashboard) for higher rate limits. |
| Playwright MCP | Already installed |
| minimalist-ui, brandkit | Already available as skills |

After installing, check `/ponytail` reports a level (turn it on with `/ponytail full` if it's off). The Ponytail commands are `/ponytail-review` (current diff), `/ponytail-audit` (whole repo) and `/ponytail-debt` (deferred shortcuts).

---

## 3. Web design agency standards

Apply these to every website we build. The client brief overrides them only where it explicitly says so.

### Quality
- Industry-level, custom output. No templates, lorem ipsum, placeholder images or "Company Name" in delivered work.
- Mobile-first. Test at 375, 768 and 1440px.
- Never claim Lighthouse, speed or security results unless measured.

### Client facts
- Never invent prices, hours, addresses, licences, reviews, team names or years in business. Mark unknowns [CLIENT TO CONFIRM].
- Use real reviews only, with permission.
- Check every number, address and hours block against the client's source before launch.

### Stack
- Default: Astro, static output, hosted on Cloudflare Pages.
- Next.js only for logged-in portals, account-based booking or complex client state. Say why in the brief.
- State the stack choice and reason at the start of each project.

### Performance
- Mobile Lighthouse performance 95+. LCP under 2.5s, INP under 200ms, CLS under 0.1.
- Prerender everything possible. Near-zero JS on marketing pages.
- Images: AVIF/WebP, explicit width and height, lazy-load below the fold, high priority on the LCP image.
- Fonts: self-host, subset, font-display swap, two families max.
- Design tokens as CSS custom properties in one tokens file.

### Motion
- Default library: Motion (lazy-loaded). GSAP only where a timeline truly needs it, justified in the brief. Lenis only where it suits the brand, never on form-heavy pages.
- Animate only transform and opacity.
- Always honour prefers-reduced-motion: static content, no parallax, pinning or looping.
- Content must be readable without JavaScript.

### Security
- `_headers` file on Cloudflare Pages: CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options.
- Forms: server-side validation, Cloudflare Turnstile (not reCAPTCHA), honeypot, minimum fill time, rate limiting, WAF rules on.
- Secrets only in Cloudflare or GitHub secrets. Never in the repo.
- npm audit before handover. Client email with SPF, DKIM and DMARC.
- CMS access via GitHub login with 2FA enforced.

### Forms
- Forms post to a Pages Function or Worker on our domain, never directly to a third party.
- Destinations per client: email (Resend or Email Routing), Google Sheets via Apps Script, or HubSpot.
- Every form: privacy consent line, success message, error message, keyboard-accessible labels, tested failure path.

### SEO
- Unique title (50 to 60 chars) and meta description (120 to 160 chars) per page.
- One h1, semantic HTML, descriptive link text, alt text on every meaningful image.
- Canonical URL, Open Graph and Twitter tags, unique OG image per key page (1200x630).
- sitemap.xml, robots.txt, custom 404. Submit to Search Console and Bing.
- JSON-LD matched to the niche, validated with the Rich Results Test.
- Redirect map for any redesign. Never lose rankings silently.
- Google Business Profile with NAP identical across the site, the profile and directories.

### Analytics
- GTM installed once. GA4 loaded through GTM.
- Consent Mode v2 defaults. GTM loads after consent where the market requires it.
- Events in snake_case. Only real business outcomes are conversions.
- Exclude staff traffic. Verify in GA4 DebugView before launch.
- Restaurant conversions: reservation_click, order_click. Engagement: menu_view, call_click, directions_click.
- Home services conversions: quote_submit, call_click. Engagement: service_page_view, whatsapp_click.

### Legal
- Pages from templates: privacy policy, cookie notice, terms, accessibility statement, niche disclaimers (allergens for restaurants).
- Markets: Singapore PDPA, Philippines RA 10173, EU/UK GDPR, US CCPA where applicable.
- Cookie banner only when non-essential trackers exist.
- Every legal page is a template only. The client's lawyer must review it before launch.

### Images and assets
- Astro Image with Sharp. Source files max 2400px long edge. Strip EXIF location data from client photos.
- OG images generated at build time with Satori and resvg.
- Favicon set from the logo: 16/32/48 ico, 180 apple-touch, 192 and 512 PNG, webmanifest.

### CMS
- Default: Keystatic (free, Git-based, Astro-native). Admin at /keystatic, GitHub login, 2FA.
- Fallback: Decap CMS. No paid CMS unless the client explicitly needs one.
- Limit editable fields to what the client needs. Validate prices, phones and image sizes.

### Git
- One repo per project. main is protected.
- Branches: feat/, fix/, content/, chore/, design/. Short-lived, rebased on main.
- Conventional Commits. Every commit builds.
- PRs: summary, screenshots at 375 and 1440px, preview URL, /ponytail-review result, QA checklist.
- Squash merge. Delete the branch after merge.
- CI on GitHub Actions: build, type-check, link check, Lighthouse CI, npm audit. Failing checks block merge.
- Every branch gets a Cloudflare Pages preview. main is production. Clients review branch aliases only.
- Tag releases (v1.0.0 at launch). Roll back via Cloudflare deployments.

### Tools
- Skills: frontend-design at project start. brandkit when the client has no brand. ui-ux-pro-max for components and interaction. minimalist-ui for editorial briefs.
- Context7: check current library docs before writing code that uses them.
- Playwright: screenshots at 375, 768 and 1440px. Check console errors, broken links, form failure paths, reduced motion and keyboard focus.
- Superpowers: planning, implementation and verification discipline.
- Ponytail: at project start, confirm /ponytail is active. Run /ponytail-review before every PR, /ponytail-audit at QA, /ponytail-debt before launch. Never accept a cut that removes validation, security, accessibility or SEO.

### Process
1. Intake: brief, niche, market, goals, references, branding, content, domain and account access, approvers.
2. Direction: visual direction, stack, niche playbook, sitemap, content ownership.
3. Build: repo, tokens, components, Keystatic collections, form endpoint, first preview.
4. QA: Playwright, Lighthouse, accessibility, headers, forms, links, images, /ponytail-audit.
5. SEO and analytics: meta, schema, sitemap, redirects, GTM events, Search Console.
6. Client review on the branch preview. One feedback round where possible.
7. Launch: merge to main, DNS, SSL, redirects, uptime monitoring, tag.
8. Handover: README, CMS guide, event list, legal status, DNS records, credentials via password manager, retainer plan.

### Niche playbooks
- Restaurant: menu as structured data with PDF fallback, third-party booking, hours with holidays, map and click-to-call, photo-led hero, allergens. Schema: Restaurant, Menu.
- Home services: sticky click-to-call on mobile, short quote form, unique service-area pages, trust signals, emergency CTA. Schema: LocalBusiness.
- Clinic: appointment booking, staff bios, medical disclaimers.
- Law: consultation form, practice-area pages, no outcome guarantees.
- Portfolio: work-first layout, case study structure.

### Design and brand
- Reference sites: extract qualities (layout, type scale, motion, colour mood). Never copy.
- Client branding overrides ours. No brand: use brandkit and write a short brand brief first.
- Redesigns: crawl the existing site first. Keep working URLs or redirect them.

### Maintenance
- Uptime monitoring every 5 minutes (UptimeRobot or Better Stack).
- Monthly: PageSpeed check, form test, Search Console errors.
- Renovate weekly. Security patches within 7 days. npm audit each release.
- Backups: Git for code and content, form submissions synced to their destination, DNS exported monthly.
- Retainers: Care (checks, updates, one small edit a month), Growth (adds an SEO report and four edits), Partner (adds new pages and campaigns).

### Working rules
- Ask only blocking questions. Otherwise choose sensibly and state the assumption.
- Never commit to main. Keep changes scoped.
- Never claim something works, is fast or is secure without checking.
- When a request conflicts with these standards, explain the trade-off and offer a compliant alternative.
- End each task with a one or two sentence summary of what changed.

---

## Let's Dimsum: build reference

**Stack:** Astro 7 with `@astrojs/cloudflare` (Workers). Every public page is prerendered; only `/keystatic` and `/api/keystatic` run on the Worker. `compressHTML: false` keeps the approved inline spacing; `inlineStylesheets: 'never'` keeps the CSP strict. Motion (`motion/mini` animate + `inView`/`scroll`) loads lazily from `src/scripts/motion.ts`; Lenis (`lerp: 0.1`) and everything else is in `src/scripts/site.ts`. Hero load motion is CSS keyframes. With `prefers-reduced-motion`, Lenis, parallax, the hero scale and the marquee are off.

**Brand in code** (`src/styles/tokens.css`, the single tokens file)
- Colors: green `#0F5A48`, yellow `#E1A507`, paper `#F5F0E6`, wood `#B98A5A` (hairlines), ink `#23201B`.
- Derived: `--color-wood-text #8A6440` (small labels), `--color-ochre #94671F` (Chinese names), `--color-paper-deep`, `--color-paper-soft`, `--color-ink-muted`.
- Fonts, self-hosted (`src/styles/fonts.css`, files in `src/assets/fonts/` from `scripts/subset_fonts.py`): Fraunces (display, SOFT 100, 300 to 400) and Figtree (body, 400 to 600), latin + latin-ext only. Chinese uses the system stack PingFang SC, Microsoft YaHei, Noto Sans CJK SC.

**Pages:** `/` (nav, hero, dish marquee, about, signature dishes, full menu, our place, visit, footer), `/menu/`, `/privacy/`, `/cookies/`, `/terms/`, `/accessibility/`, `/allergens/`, 404. Sections are components in `src/components/`.

**Content and data**
- Keystatic (`keystatic.config.ts`, GitHub mode, repo `jasonbeloso24-code/letsdimsumtest`): menu items `src/content/menu/`, signature dishes `src/content/dishes/`, photos `src/content/photos/`, hours with holidays `src/content/hours.yaml`. Read through `src/content.config.ts`.
- Business facts and link slots: `src/data/business.ts` (`FACEBOOK_URL`, `PHONE`, `ORDER_URL`, `BOOKING_URL`, `GOOGLE_LISTING_URL`, address, price). Empty values hide their button.
- Photos: originals in `source-assets/` (not shipped); `npm run images` crops them into `src/assets/photos/`; Astro `<Picture>` makes AVIF/WebP. `npm run menu-pdf` builds `public/menu/lets-dimsum-menu.pdf`. `npm run favicons` builds the favicon set. `public/og.png` is generated on every build.
- Env: `SITE_URL` (canonical/OG/sitemap), `PUBLIC_GTM_ID` (analytics + cookie banner appear only when set), Keystatic secrets (Cloudflare secrets, never the repo).

**Checks:** `npm run check` (types), `npm test`, `npm run build`, `npm run check:dist` (CSP hashes, title/description lengths, one h1). CI runs these plus lychee and Lighthouse CI on every PR.

**[CLIENT TO CONFIRM]**
- Custom domain (then set `SITE_URL`; currently https://letsdimsumtest.jasonbeloso24.workers.dev)
- Full street address (currently San Rafael, San Pablo City, Laguna, plus code 38C4+92Q)
- Phone number
- Hours and holiday hours (Keystatic "Confirmed by the owners" box is unticked)
- Price range (₱500 to ₱1,000 per person, user-reported on Google)
- Google listing link (found by search, CID 2382240538264847043)
- Ordering and booking links (Grab, Foodpanda, reservations)
- Allergen information per dish
- Facebook page URL
- GTM container ID
- Guest reviews, real and with permission (none on the site now)
- Legal pages: business name, DPO contact, retention periods, lawyer review
