import Lenis from 'lenis';

const root = document.documentElement;
const motionOn = root.classList.contains('motion');

/* ---------- Analytics (GTM after consent only, Consent Mode v2) ---------- */

type DataLayer = unknown[];
declare global {
  interface Window {
    dataLayer: DataLayer;
  }
}

const CONSENT_KEY = 'ld-consent';
const banner = document.querySelector<HTMLElement>('[data-consent]');
const gtmId = banner?.dataset.gtmId;

function readConsent(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

let analyticsOn = false;

function gtag(..._args: unknown[]) {
  // GTM expects the arguments object itself, not an array.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

function loadGtm() {
  if (analyticsOn || !gtmId) return;
  analyticsOn = true;
  window.dataLayer = window.dataLayer || [];
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });
  gtag('consent', 'update', { analytics_storage: 'granted' });
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(s);
}

/** Pushes a dataLayer event, but only once the visitor has accepted analytics. */
export function track(event: string) {
  if (analyticsOn) window.dataLayer.push({ event });
}

function setupConsent() {
  if (!banner || !gtmId) return;
  const show = (open: boolean) => {
    banner.hidden = !open;
    root.classList.toggle('consent-open', open);
  };
  const choice = readConsent();
  if (choice === 'granted') loadGtm();
  if (!choice) show(true);

  banner.addEventListener('click', (e) => {
    const value = (e.target as HTMLElement).closest<HTMLElement>('[data-consent-choice]')?.dataset.consentChoice;
    if (!value) return;
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* storage blocked: the choice applies to this page view only */
    }
    show(false);
    if (value === 'granted') loadGtm();
    // Declining after accepting needs a reload to unload GTM.
    else if (analyticsOn) location.reload();
  });
  document.querySelector('[data-consent-open]')?.addEventListener('click', () => {
    show(true);
    banner.querySelector<HTMLElement>('[data-consent-choice="granted"]')?.focus();
  });
}

function setupTracking() {
  document.addEventListener('click', (e) => {
    const name = (e.target as HTMLElement).closest<HTMLElement>('[data-track]')?.dataset.track;
    if (name) track(name);
  });
  const menu = document.querySelector('[data-menu-section]');
  if (!menu) return;
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      track('menu_view');
      io.disconnect();
    }
  });
  io.observe(menu);
}

/* ---------- Nav ---------- */

function setupNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]')!;
  const toggle = nav.querySelector<HTMLButtonElement>('.nav__toggle')!;
  const label = toggle.querySelector('.visually-hidden')!;

  const setOpen = (open: boolean) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Close navigation' : 'Open navigation';
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.querySelectorAll('.nav__menu a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// "Open today until" uses the visitor's day of the week; also marks today's row in the hours table.
function setupOpenNote() {
  const day = String(new Date().getDay());
  const el = document.querySelector<HTMLElement>('[data-close-time]');
  const closes = el ? (JSON.parse(el.dataset.closes || '{}') as Record<string, string>) : {};
  if (el && closes[day]) el.textContent = closes[day];
  document.querySelectorAll<HTMLElement>('.hours tr[data-days]').forEach((row) => {
    row.classList.toggle('is-today', row.dataset.days!.split(',').includes(day));
  });
}

/* ---------- Menu tabs ---------- */

let animatePanel: ((panel: HTMLElement) => void) | null = null;

function setupMenuTabs() {
  const tabs = [...document.querySelectorAll<HTMLElement>('[data-menu-tabs] [role="tab"]')];
  const panelOf = (tab: HTMLElement) => document.getElementById(tab.getAttribute('aria-controls')!)!;

  const show = (index: number) => {
    tabs.forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === index));
      t.tabIndex = i === index ? 0 : -1;
      panelOf(t).hidden = i !== index;
    });
    animatePanel?.(panelOf(tabs[index]));
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => show(i));
    tab.addEventListener('keydown', (e) => {
      const keys: Record<string, number> = {
        ArrowRight: (i + 1) % tabs.length,
        ArrowLeft: (i - 1 + tabs.length) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      if (!(e.key in keys)) return;
      e.preventDefault();
      tabs[keys[e.key]].focus();
      show(keys[e.key]);
    });
  });
}

/* ---------- Smooth scroll ---------- */

function setupLenis() {
  const lenis = new Lenis({ lerp: 0.1, autoRaf: true });
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!;
      const target = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(id === '#top' ? 0 : target, { offset: -72, duration: 1.4 });
      history.replaceState(null, '', id);
    });
  });
}

/* ---------- Init ---------- */

setupConsent();
setupTracking();
setupNav();
setupOpenNote();
setupMenuTabs();

if (motionOn) {
  setupLenis();
  // Motion is only needed for scroll effects, so it loads after everything above is interactive.
  import('./motion').then((m) => {
    m.initMotion();
    animatePanel = m.animatePanel;
  });
}
