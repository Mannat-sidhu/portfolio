// Interface craft: one treatment per role. Everything is registered once and runs per page via onPage().
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, isTouch, onPage, onScroll, prefersReducedMotion, startScroll, stopScroll } from '../engine';

// The header (and tally) follow the tone of the section under them, through one variable on <html>.
export const tone = () => onPage(() => {
  document.querySelectorAll<HTMLElement>('[data-tone]').forEach((s) => {
    ScrollTrigger.create({
      trigger: s, start: 'top 56px', end: 'bottom 56px',
      onToggle: (self) => { if (self.isActive) document.documentElement.dataset.tone = s.dataset.tone; },
    });
  });
});

// Header steps aside on scroll down, returns on scroll up.
export function frameAway() {
  let last = 0;
  onScroll(({ y }) => {
    if (Math.abs(y - last) < 4) return;
    document.documentElement.classList.toggle('frame-away', y > 160 && y > last);
    last = y;
  });
}

// Mobile menu overlay: focus trap, Escape closes, focus returns to the button.
export const menu = () => onPage(() => {
  const btn = document.querySelector<HTMLButtonElement>('.hdr__menu');
  const m = document.getElementById('menu');
  if (!btn || !m) return;
  const links = [...m.querySelectorAll<HTMLAnchorElement>('a')];
  let isOpen = false;
  const set = (v: boolean) => {
    if (v === isOpen) return;
    isOpen = v;
    btn.setAttribute('aria-expanded', String(v));
    btn.textContent = v ? 'Close' : 'Menu';
    document.documentElement.classList.toggle('menu-open', v);
    if (v) {
      m.classList.add('is-open'); stopScroll();
      gsap.to(m, { clipPath: 'inset(0 0 0% 0)', duration: prefersReducedMotion() ? 0.01 : 0.8, ease: ease.inOut, overwrite: true });
      if (!prefersReducedMotion()) gsap.fromTo(links.map((a) => a.firstElementChild), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: ease.out, delay: 0.25 });
      links[0]?.focus();
    } else {
      startScroll();
      gsap.to(m, { clipPath: 'inset(0 0 100% 0)', duration: prefersReducedMotion() ? 0.01 : 0.6, ease: ease.inOut, overwrite: true, onComplete: () => m.classList.remove('is-open') });
    }
  };
  const onBtn = () => set(!isOpen);
  const onKey = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { set(false); btn.focus(); }
    if (e.key === 'Tab') {
      const f = [btn, ...links]; const i = f.indexOf(document.activeElement as HTMLAnchorElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  };
  const onLink = () => set(false);
  btn.addEventListener('click', onBtn); document.addEventListener('keydown', onKey);
  links.forEach((a) => a.addEventListener('click', onLink));
  return () => {
    btn.removeEventListener('click', onBtn); document.removeEventListener('keydown', onKey);
    links.forEach((a) => a.removeEventListener('click', onLink));
    document.documentElement.classList.remove('menu-open'); if (isOpen) startScroll();
  };
});

// Primary buttons: a fill floods in from the side the pointer entered.
export const buttonFill = () => onPage(() => {
  if (isTouch() || prefersReducedMotion()) return;
  const off: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('[data-fill]').forEach((btn) => {
    const fill = btn.querySelector<HTMLElement>('.btn__fill');
    if (!fill) return;
    const from = (e: PointerEvent) => { const r = btn.getBoundingClientRect(); return `${e.clientX - r.left}px ${e.clientY - r.top}px`; };
    let closed = true;
    const open = (at: string) => {
      if (closed) gsap.set(fill, { clipPath: `circle(0% at ${at})` });
      closed = false; btn.classList.add('is-filled');
      gsap.to(fill, { clipPath: `circle(150% at ${at})`, duration: 0.6, ease: ease.soft, overwrite: true });
    };
    const close = (at: string) => {
      btn.classList.remove('is-filled');
      gsap.to(fill, { clipPath: `circle(0% at ${at})`, duration: 0.5, ease: ease.soft, overwrite: true, onComplete: () => { closed = true; } });
    };
    const enter = (e: PointerEvent) => open(from(e));
    const leave = (e: PointerEvent) => close(from(e));
    const focus = () => btn.matches(':focus-visible') && open('50% 50%');
    const blur = () => close('50% 50%');
    btn.addEventListener('pointerenter', enter); btn.addEventListener('pointerleave', leave);
    btn.addEventListener('focus', focus); btn.addEventListener('blur', blur);
    off.push(() => { btn.removeEventListener('pointerenter', enter); btn.removeEventListener('pointerleave', leave); btn.removeEventListener('focus', focus); btn.removeEventListener('blur', blur); });
  });
  return () => off.forEach((f) => f());
});

// Vow index: a cover follows the pointer and leans with its speed.
export const indexPreview = () => onPage(() => {
  const list = document.querySelector('[data-index]');
  const box = document.querySelector<HTMLElement>('.preview');
  if (!list || !box || isTouch()) return;
  const img = box.querySelector('img')!;
  const x = gsap.quickTo(box, 'x', { duration: 0.6, ease: 'power3.out' });
  const y = gsap.quickTo(box, 'y', { duration: 0.6, ease: 'power3.out' });
  const rot = gsap.quickTo(box, 'rotate', { duration: 0.8, ease: 'power3.out' });
  let lastX = 0, px = 0, py = 0;
  const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; x(px); y(py); rot(gsap.utils.clamp(-12, 12, (px - lastX) * 0.6)); lastX = px; };
  const show = (e: Event) => {
    const src = (e.currentTarget as HTMLElement).dataset.preview!;
    if (!img.src.endsWith(src)) img.src = src;
    gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
  };
  const hide = () => gsap.to(box, { autoAlpha: 0, scale: 0.85, duration: 0.4, ease: 'expo.out' });
  gsap.set(box, { scale: 0.85 });
  list.querySelectorAll<HTMLAnchorElement>('a[data-preview]').forEach((a) => { a.addEventListener('pointerenter', show); a.addEventListener('focus', show); a.addEventListener('blur', hide); });
  list.addEventListener('pointerleave', hide);
  addEventListener('pointermove', move);
  const offS = onScroll(() => { if (!list.contains(document.elementFromPoint(px, py))) hide(); });
  return () => { removeEventListener('pointermove', move); offS(); };
});

// One velocity marquee.
export const marquee = () => onPage(() => {
  const track = document.querySelector<HTMLElement>('[data-marquee] [data-track]');
  if (!track || prefersReducedMotion()) return;
  const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 30, repeat: -1 });
  const offS = onScroll(({ velocity }) => {
    const dir = velocity < 0 ? -1 : 1;
    gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(velocity) / 8, 5)), duration: 0.4, overwrite: true });
  });
  return () => { offS(); };
});
