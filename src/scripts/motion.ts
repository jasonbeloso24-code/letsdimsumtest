import { animate } from 'motion/mini';
import { inView, scroll, stagger } from 'motion';

// GSAP easings from the approved build, as cubic-bezier curves.
const POWER2_OUT = [0.33, 1, 0.68, 1] as const;

/** Fade-up reveals: 24px, 0.8s, 60ms stagger for elements entering together. */
function reveals() {
  const below = [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter(
    (el) => el.getBoundingClientRect().top > window.innerHeight,
  );
  // Start states are set only here, and only for elements still off screen, so nothing can stay hidden.
  below.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
  });

  let batch: HTMLElement[] = [];
  inView(
    below,
    (el) => {
      batch.push(el as HTMLElement);
      if (batch.length > 1) return;
      requestAnimationFrame(() => {
        animate(batch, { opacity: [0, 1], transform: ['translateY(24px)', 'none'] }, { duration: 0.8, delay: stagger(0.06), ease: POWER2_OUT });
        batch = [];
      });
    },
    { margin: '0px 0px -12% 0px' },
  );
}

/** About paragraph: words fill from faint to full as it scrolls through the viewport. */
function wordFill() {
  const words = [...document.querySelectorAll<HTMLElement>('[data-word-fill] .word')];
  const text = document.querySelector('[data-word-fill]');
  if (!text || !words.length) return;
  // Same timing as the GSAP version: each word 0.5 units, staggered 0.1, scrubbed over the range.
  const total = 0.5 + 0.1 * (words.length - 1);
  scroll(
    (progress: number) => {
      const t = progress * total;
      words.forEach((w, i) => {
        const local = Math.min(1, Math.max(0, (t - i * 0.1) / 0.5));
        w.style.opacity = String(0.16 + 0.84 * local);
      });
    },
    { target: text, offset: ['start 0.8', 'end 0.45'] },
  );
}

/** Interior photos drift 8% inside their frames. */
function parallax() {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((img) => {
    scroll(animate(img, { transform: ['translateY(-8%)', 'translateY(8%)'] }, { ease: 'linear' }), {
      target: img.closest('.parallax')!,
      offset: ['start end', 'end start'],
    });
  });
}

/** Hero photo widens: frame scales 0.84 to 1 while the photo counter-scales, so it reads like the old clip reveal. */
function heroScale() {
  const frame = document.querySelector<HTMLElement>('[data-hero-media]');
  const img = frame?.querySelector('img');
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!frame || !img || !hero) return;
  const offset = ['start start', 'end 0.3'];
  scroll(animate(frame, { transform: ['scale(0.84)', 'none'] }, { ease: 'linear' }), { target: hero, offset });
  scroll(animate(img, { transform: [`scale(${1 / 0.84})`, 'none'] }, { ease: 'linear' }), { target: hero, offset });
}

export function animatePanel(panel: HTMLElement) {
  animate(
    panel.querySelectorAll('.menu__heading, .menu__item'),
    { opacity: [0, 1], transform: ['translateY(12px)', 'none'] },
    { duration: 0.6, delay: stagger(0.03), ease: POWER2_OUT },
  );
}

export function initMotion() {
  reveals();
  wordFill();
  parallax();
  heroScale();
}
