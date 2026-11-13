// Small interactions that work without motion: the skill-pair accordion and the resume filters.
import { gsap } from 'gsap';
import { onPage, prefersReducedMotion } from '../engine';

const redraw = () => document.dispatchEvent(new Event('threads:redraw'));

// "How design skills transfer to management": one pair open at a time; its thread pulls taut.
export const bridges = () => onPage(() => {
  const list = document.querySelector<HTMLElement>('[data-bridges]');
  if (!list) return;
  const buttons = [...list.querySelectorAll<HTMLButtonElement>('button[aria-controls]')];
  const open = (btn: HTMLButtonElement) => {
    buttons.forEach((b) => {
      const isIt = b === btn;
      const panel = document.getElementById(b.getAttribute('aria-controls')!)!;
      const was = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(isIt));
      if (isIt && !was) {
        panel.hidden = false;
        if (!prefersReducedMotion()) gsap.fromTo(panel, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: 0.6, ease: 'expo.out' });
      } else if (!isIt && was) {
        if (prefersReducedMotion()) panel.hidden = true;
        else gsap.to(panel, { height: 0, autoAlpha: 0, duration: 0.4, ease: 'power3.out', onComplete: () => { panel.hidden = true; gsap.set(panel, { clearProps: 'height,opacity,visibility' }); } });
      }
    });
    redraw();
  };
  const handlers = buttons.map((b) => {
    const h = () => open(b);
    b.addEventListener('click', h);
    return () => b.removeEventListener('click', h);
  });
  return () => handlers.forEach((f) => f());
});

// Resume filters: All, Management, Business, Design. State lives in the URL hash so a link can be shared.
export const resumeFilters = () => onPage(() => {
  const bar = document.querySelector<HTMLElement>('[data-filters]');
  if (!bar) return;
  const chips = [...bar.querySelectorAll<HTMLButtonElement>('button[data-filter]')];
  const entries = [...document.querySelectorAll<HTMLElement>('[data-tags]')];
  const status = document.querySelector<HTMLElement>('[data-filter-status]');
  const apply = (f: string) => {
    if (!chips.some((c) => c.dataset.filter === f)) f = 'all';
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === f)));
    let n = 0;
    entries.forEach((e) => {
      const match = f === 'all' || (e.dataset.tags || '').split(' ').includes(f);
      e.classList.toggle('is-dim', !match);
      if (match) n++;
    });
    if (status) status.textContent = f === 'all' ? `Showing all ${entries.length} entries` : `Showing ${n} ${f} entries, others dimmed`;
    redraw();
  };
  const onClick = (e: Event) => {
    const f = (e.currentTarget as HTMLButtonElement).dataset.filter!;
    history.replaceState(null, '', f === 'all' ? location.pathname : `#${f}`);
    apply(f);
  };
  chips.forEach((c) => c.addEventListener('click', onClick));
  apply(location.hash.slice(1) || 'all');
  return () => chips.forEach((c) => c.removeEventListener('click', onClick));
});
