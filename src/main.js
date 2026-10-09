import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './styles/main.css';

// PLACEHOLDER: paste the full URL of the "LET'S Dimsum - San Pablo City" Facebook page here.
const FACEBOOK_URL = '';

const root = document.documentElement;
const reduceMotion = !root.classList.contains('motion');
window.__motionReady = true;

gsap.registerPlugin(ScrollTrigger);

/* ---------- Content setup (runs with or without motion) ---------- */

function setupFacebookLinks() {
  document.querySelectorAll('[data-facebook-link]').forEach((link) => {
    if (FACEBOOK_URL) {
      link.href = FACEBOOK_URL;
    } else {
      // Until the URL is filled in, fall back to a Facebook search for the page name.
      link.href = 'https://www.facebook.com/search/top?q=' + encodeURIComponent("LET'S Dimsum - San Pablo City");
    }
  });
}

// Closing time from the visitor's day of the week (Sat/Sun close at 10 PM, weekdays at 9 PM).
function setupOpenNote() {
  const day = new Date().getDay();
  const weekend = day === 0 || day === 6;
  const el = document.querySelector('[data-close-time]');
  if (el) el.textContent = weekend ? '10 PM' : '9 PM';

  const todayRow = document.querySelector(weekend ? '.hours tr[data-days="0,6"]' : '.hours tr[data-days="1-5"]');
  todayRow?.classList.add('is-today');
}

function setupNav() {
  const nav = document.querySelector('[data-nav]');
  const toggle = nav.querySelector('.nav__toggle');
  const label = toggle.querySelector('.visually-hidden');

  const setOpen = (open) => {
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

function setupMarquee() {
  const track = document.querySelector('[data-marquee]');
  const group = track?.querySelector('.marquee__group');
  if (!group) return;
  const copy = group.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  track.appendChild(copy);
}

function setupMenu() {
  const tabs = [...document.querySelectorAll('[data-menu-tabs] [role="tab"]')];
  if (!tabs.length) return;

  const show = (index) => {
    tabs.forEach((t, i) => {
      const active = i === index;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !active;
    });

    if (!reduceMotion) {
      const panel = document.getElementById(tabs[index].getAttribute('aria-controls'));
      gsap.from(panel.querySelectorAll('.menu__heading, .menu__item'), {
        opacity: 0,
        y: 12,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power2.out',
      });
    }
    // Panel height changes, so trigger positions further down need a refresh.
    ScrollTrigger.refresh();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => show(i));
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      tabs[next].focus();
      show(next);
    });
  });
}

// Split the about paragraph into word spans for the scroll fill.
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute('aria-label', words.join(' '));
  el.innerHTML = words.map((w) => `<span class="word" aria-hidden="true">${w}</span>`).join(' ');
  return el.querySelectorAll('.word');
}

/* ---------- Motion ---------- */

function setupLenis() {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  if (import.meta.env.DEV) window.__lenis = lenis;

  // Smooth in-page anchor links, offset for the fixed nav
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(id === '#top' ? 0 : target, { offset: -72, duration: 1.4 });
      history.replaceState(null, '', id);
    });
  });

  return lenis;
}

function introAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero__title .line__inner', { y: 0, duration: 1.1, stagger: 0.12 }, 0.15)
    .fromTo('[data-hero-fade]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.45)
    // Mascot rays: one by one, once.
    .to('.mascot .ray', { opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power1.out' }, 0.3);
}

function heroScroll() {
  gsap.fromTo(
    '[data-hero-media]',
    { clipPath: 'inset(8% 8% 8% 8% round 2rem)' },
    {
      clipPath: 'inset(0% 0% 0% 0% round 2rem)',
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 30%', scrub: true },
    },
  );
}

function reveals() {
  gsap.set('[data-reveal]', { y: 24 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'power2.out', overwrite: true }),
  });
}

function wordFill(words) {
  gsap.to(words, {
    opacity: 1,
    ease: 'none',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '[data-word-fill]',
      start: 'top 80%',
      end: 'bottom 45%',
      scrub: true,
    },
  });
}

function parallax() {
  document.querySelectorAll('[data-parallax]').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}

/* ---------- Init ---------- */

setupFacebookLinks();
setupOpenNote();
setupNav();
setupMarquee();
setupMenu();

const fillEl = document.querySelector('[data-word-fill]');
const words = fillEl ? splitWords(fillEl) : [];

if (!reduceMotion) {
  setupLenis();
  introAnimation();
  heroScroll();
  reveals();
  wordFill(words);
  parallax();

  // Images and fonts change layout after load; re-measure triggers.
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
