// THE DRIVER: one thread, one variable (scroll depth). It draws down the left spine, ties a knot at every
// [data-knot], and a knot unties when its [data-untie] container is hovered or focused.
// data-knot="untied" means the knot is already untied when the thread reaches it (a promise kept).
import { gsap } from 'gsap';
import { onPage, onScroll, prefersReducedMotion } from '../engine';

const NS = 'http://www.w3.org/2000/svg';
const mk = <T extends SVGElement>(n: string, a: Record<string, string | number> = {}) => {
  const e = document.createElementNS(NS, n) as T;
  for (const k in a) e.setAttribute(k, String(a[k]));
  return e;
};

type Knot = {
  a: HTMLElement; g: SVGGElement; breathe: SVGGElement; inner: SVGGElement;
  ca: SVGCircleElement; cb: SVGCircleElement; y: number; shown: boolean; hover: boolean; keptByDefault: boolean;
};

function setTally(tied: number, total: number) {
  const t = document.querySelector<HTMLElement>('[data-tally]');
  if (!t) return;
  const text = total ? `Knots tied ${tied} / ${total}` : '';
  if (t.textContent !== text) t.textContent = text;
}

export function startThread() {
  onPage(() => {
    const page = document.querySelector<HTMLElement>('.page');
    const anchors = [...document.querySelectorAll<HTMLElement>('[data-knot]')];
    if (!page || !anchors.length) return void setTally(0, 0);

    const reduced = prefersReducedMotion();
    const layer = document.createElement('div');
    layer.className = 'thread';
    layer.setAttribute('aria-hidden', 'true');
    const svg = mk<SVGSVGElement>('svg');
    const path = mk<SVGPathElement>('path');
    svg.appendChild(path);
    layer.appendChild(svg);
    page.appendChild(layer);

    const off: (() => void)[] = [];
    const knots: Knot[] = anchors.map((a) => {
      const g = mk<SVGGElement>('g', { class: 'knot' });
      const breathe = mk<SVGGElement>('g');
      const inner = mk<SVGGElement>('g');
      const ca = mk<SVGCircleElement>('circle');
      const cb = mk<SVGCircleElement>('circle');
      inner.append(ca, cb);
      if (a.dataset.knot === 'tangle') {
        // the hard part: the thread snarls into loops before it runs straight again
        g.classList.add('knot--tangle');
        inner.append(mk('path', { d: 'M0 -26 C 18 -22, 20 -6, 4 -4 S -20 8, -6 14 S 22 12, 10 24 S -16 30, 0 34 M0 -26 C -16 -20, -18 -2, -2 2 S 18 16, 2 20' }));
      }
      breathe.appendChild(inner); g.appendChild(breathe); svg.appendChild(g);
      const k: Knot = { a, g, breathe, inner, ca, cb, y: 0, shown: false, hover: false, keptByDefault: a.dataset.knot === 'untied' };
      const box = a.closest<HTMLElement>('[data-untie]');
      if (box) {
        const on = () => { k.hover = true; spread(k); };
        const out = () => { k.hover = false; spread(k); };
        box.addEventListener('pointerenter', on); box.addEventListener('pointerleave', out);
        box.addEventListener('focusin', on); box.addEventListener('focusout', out);
        off.push(() => { box.removeEventListener('pointerenter', on); box.removeEventListener('pointerleave', out); box.removeEventListener('focusin', on); box.removeEventListener('focusout', out); });
      }
      return k;
    });

    let W = 0, H = 0, x0 = 0, r = 9, dx = 5, L = 1, top = 0;
    let samples: [number, number][] = [];

    const gap = (k: Knot) => (k.keptByDefault || k.hover ? 2.6 : 1);
    function spread(k: Knot, instant = false) {
      const d = dx * gap(k);
      if (instant || reduced) { k.ca.setAttribute('cx', String(-d)); k.cb.setAttribute('cx', String(d)); return; }
      gsap.to(k.ca, { attr: { cx: -d }, duration: 0.8, ease: 'expo.out', overwrite: 'auto' });
      gsap.to(k.cb, { attr: { cx: d }, duration: 0.8, ease: 'expo.out', overwrite: 'auto' });
    }

    function measure() {
      const pr = page!.getBoundingClientRect();
      top = pr.top + scrollY;
      W = layer.offsetWidth; H = page!.offsetHeight; x0 = W / 2;
      r = Math.max(6, Math.min(11, W * 0.17)); dx = r * 0.55;
      svg.setAttribute('width', String(W)); svg.setAttribute('height', String(H)); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      knots.forEach((k) => { const b = k.a.getBoundingClientRect(); k.y = b.top - pr.top + b.height / 2; });
      let d = `M ${x0} 0`; let py = 0; const sw = W * 0.28;
      knots.forEach((k, i) => {
        const dy = k.y - py; const s = (i % 2 ? -1 : 1) * sw;
        d += ` C ${x0 + s} ${py + dy * 0.3}, ${x0 - s} ${py + dy * 0.7}, ${x0} ${k.y}`; py = k.y;
      });
      path.setAttribute('d', d);
      L = path.getTotalLength() || 1;
      samples = [];
      for (let i = 0; i <= 400; i++) { const l = (L * i) / 400; samples.push([l, path.getPointAtLength(l).y]); }
      path.style.strokeDasharray = String(L);
      knots.forEach((k) => {
        k.g.setAttribute('transform', `translate(${x0} ${k.y})`);
        k.ca.setAttribute('r', String(r)); k.cb.setAttribute('r', String(r));
        spread(k, true);
      });
    }

    function lenAtY(y: number) {
      if (y <= 0) return 0;
      if (y >= H) return L;
      let lo = 0, hi = samples.length - 1;
      while (lo < hi) { const m = (lo + hi) >> 1; if (samples[m][1] < y) lo = m + 1; else hi = m; }
      return samples[lo][0];
    }

    function reveal(k: Knot) {
      if (reduced) { gsap.set(k.inner, { scale: k.shown ? 1 : 0 }); return; }
      if (k.shown) gsap.fromTo(k.inner, { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'expo.out', overwrite: 'auto' });
      else gsap.to(k.inner, { scale: 0, rotation: 60, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    }

    let lastTied = -1;
    function update() {
      const tip = reduced ? H + 1 : scrollY + innerHeight * 0.74 - top;
      path.style.strokeDashoffset = String(L - lenAtY(tip));
      let tied = 0;
      knots.forEach((k) => {
        const should = tip >= k.y;
        if (should) tied++;
        if (should !== k.shown) { k.shown = should; reveal(k); }
      });
      if (tied !== lastTied) { lastTied = tied; setTally(tied, knots.length); }
    }

    knots.forEach((k) => gsap.set(k.inner, { scale: 0 }));
    measure(); update();
    off.push(onScroll(update));
    const ro = new ResizeObserver(() => { measure(); update(); });
    ro.observe(page);
    document.fonts?.ready.then(() => { measure(); update(); });

    // idle: the thread sways and the knots breathe while nothing else moves
    const tick = (t: number) => {
      layer.style.translate = `${Math.sin(t * 0.9) * 1.4}px 0`;
      knots.forEach((k, i) => { if (k.shown) gsap.set(k.breathe, { rotation: Math.sin(t * 0.8 + i * 1.3) * 7 }); });
    };
    if (!reduced) gsap.ticker.add(tick);

    return () => { gsap.ticker.remove(tick); ro.disconnect(); off.forEach((f) => f()); layer.remove(); };
  });
}
