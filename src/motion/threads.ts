// THREADS: every red thread tied to a jaali. One module, three kinds, one clock.
//
//   <section data-threads>                 a host; gets an SVG overlay the threads are drawn in
//     data-hang="<jaali id>" data-node="c,r" data-len="2.2"   a tag hanging free from a node (hero, contact)
//     data-bind="<jaali id>" data-node="c,r|auto"              an element tied to a node (cards, resume entries)
//     data-bridge (with [data-a], [data-b], host has [data-strip])  a pair tied across a strip (skills)
//   optional: data-color="pink", data-anchor="top|left|right", data-phone="off"
//
// Motion verb: drop, swing, settle. Threads drop in when their host enters view, sway a little at rest,
// lean away from the pointer, and pull taut when their element is hot (hover, focus, open).
// Reduced motion: drawn once, still. Threads are decorative; every destination is a real link elsewhere.
import { gsap } from 'gsap';
import { onPage, prefersReducedMotion } from '../engine';

const NS = 'http://www.w3.org/2000/svg';
type P = { x: number; y: number };
type Kind = 'hang' | 'bind' | 'bridge';

type Thread = {
  kind: Kind;
  el: HTMLElement;
  a?: HTMLElement; b?: HTMLElement;
  jaali?: HTMLElement;
  node?: Element | null;
  nodeSpec?: string;
  len: number;
  phone: boolean;
  phase: number;
  grow: { v: number };
  hot: boolean;
  lean: number;
  path: SVGPathElement;
  knot: SVGGElement;
  end?: SVGGElement;
};
type Layer = { host: HTMLElement; svg: SVGSVGElement; threads: Thread[]; visible: boolean; grown: boolean };

const mk = <T extends SVGElement>(n: string, attrs: Record<string, string | number> = {}) => {
  const e = document.createElementNS(NS, n) as T;
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  return e;
};

function knotGlyph(cls = 'tk') {
  const g = mk<SVGGElement>('g', { class: cls });
  g.append(mk('circle', { cx: -2.6, cy: 0, r: 3.6 }), mk('circle', { cx: 2.6, cy: 0, r: 3.6 }));
  return g;
}

const center = (r: DOMRect, h: DOMRect): P => ({ x: r.left + r.width / 2 - h.left, y: r.top + r.height / 2 - h.top });
function anchor(el: HTMLElement, side: string, h: DOMRect): P {
  const r = el.getBoundingClientRect();
  const x = r.left - h.left, y = r.top - h.top;
  switch (side) {
    case 'left': return { x, y: y + r.height / 2 };
    case 'right': return { x: x + r.width, y: y + r.height / 2 };
    case 'bottom-left': return { x: x + 6, y: y + r.height };
    case 'top-left': return { x: x + 6, y };
    default: return { x: x + r.width / 2, y };
  }
}

// A rope from P to Q bowed by `sag` px along its normal (gravity side for horizontal ropes).
function rope(p: P, q: P, sag: number) {
  const dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1;
  let nx = -dy / L, ny = dx / L;
  if (ny < 0) { nx = -nx; ny = -ny; }
  const mx = (p.x + q.x) / 2 + nx * sag, my = (p.y + q.y) / 2 + ny * sag;
  return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
}

function tileSize(j?: HTMLElement) {
  const svg = j?.querySelector('svg');
  if (!svg) return 100;
  const vb = svg.viewBox.baseVal;
  return (svg.getBoundingClientRect().width / (vb.width || 1)) * 100;
}

function pickNode(t: Thread, h: DOMRect) {
  if (!t.jaali) return null;
  if (t.nodeSpec && t.nodeSpec !== 'auto') {
    const [c, r] = t.nodeSpec.split(',');
    return t.jaali.querySelector(`.jn[data-c="${c}"][data-r="${r}"]`);
  }
  // auto: the node nearest the element's anchor
  const target = anchor(t.el, t.el.dataset.anchor || 'top', h);
  let best: Element | null = null, bd = Infinity;
  t.jaali.querySelectorAll('.jn').forEach((n) => {
    const p = center(n.getBoundingClientRect(), h);
    const d = Math.hypot(p.x - target.x, (p.y - target.y) * 0.6);
    if (d < bd) { bd = d; best = n; }
  });
  return best;
}

export function startThreads() {
  const pointer = { x: -9999, y: -9999 };
  addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });

  onPage(() => {
    const hosts = [...document.querySelectorAll<HTMLElement>('[data-threads]')];
    if (!hosts.length) return;
    const reduced = prefersReducedMotion();
    const phoneMq = matchMedia('(max-width: 860px)');
    const off: (() => void)[] = [];

    const layers: Layer[] = hosts.map((host) => {
      const svg = mk<SVGSVGElement>('svg', { class: 'tl', 'aria-hidden': 'true' });
      host.appendChild(svg);
      const threads: Thread[] = [];
      host.querySelectorAll<HTMLElement>('[data-hang],[data-bind],[data-bridge]').forEach((el, i) => {
        const kind: Kind = el.hasAttribute('data-hang') ? 'hang' : el.hasAttribute('data-bind') ? 'bind' : 'bridge';
        const id = el.dataset.hang || el.dataset.bind;
        const pink = el.dataset.color === 'pink';
        const path = mk<SVGPathElement>('path', { class: `tp${pink ? ' tp--pink' : ''}`, pathLength: 1 });
        const knot = knotGlyph(`tk${pink ? ' tk--pink' : ''}`);
        svg.append(path, knot);
        const t: Thread = {
          kind, el, path, knot,
          a: el.querySelector<HTMLElement>('[data-a]') ?? undefined,
          b: el.querySelector<HTMLElement>('[data-b]') ?? undefined,
          jaali: id ? document.getElementById(id) ?? undefined : undefined,
          nodeSpec: el.dataset.node,
          len: parseFloat(el.dataset.len || '2'),
          phone: el.dataset.phone !== 'off',
          phase: i * 1.7 + Math.random(),
          grow: { v: reduced ? 1 : 0 },
          hot: false,
          lean: 0,
        };
        if (kind === 'hang') { t.end = mk<SVGGElement>('g', { class: 'te' }); t.end.append(mk('circle', { r: 4 })); svg.append(t.end); }
        const on = () => { t.hot = true; if (reduced) draw(0); };
        const out = () => { t.hot = false; if (reduced) draw(0); };
        el.addEventListener('pointerenter', on); el.addEventListener('pointerleave', out);
        el.addEventListener('focusin', on); el.addEventListener('focusout', out);
        off.push(() => { el.removeEventListener('pointerenter', on); el.removeEventListener('pointerleave', out); el.removeEventListener('focusin', on); el.removeEventListener('focusout', out); });
        threads.push(t);
      });
      return { host, svg, threads, visible: false, grown: reduced };
    });

    const measure = () => layers.forEach((L) => {
      const h = L.host.getBoundingClientRect();
      L.threads.forEach((t) => { t.node = pickNode(t, h); });
    });

    function draw(time: number) {
      const phone = phoneMq.matches;
      for (const L of layers) {
        if (!L.visible && !reduced) continue;
        const h = L.host.getBoundingClientRect();
        const strip = L.host.querySelector<HTMLElement>('[data-strip]');
        const stripX = strip ? center(strip.getBoundingClientRect(), h).x : 0;
        const anyHot = L.threads.some((t) => t.hot || t.el.getAttribute('aria-expanded') === 'true');
        for (const t of L.threads) {
          const hot = t.hot || t.el.getAttribute('aria-expanded') === 'true' || t.el.classList.contains('is-hot');
          const dim = !!t.el.closest('.is-dim');
          const hidden = phone && !t.phone;
          t.path.style.display = t.knot.style.display = hidden ? 'none' : '';
          if (t.end) t.end.style.display = hidden ? 'none' : '';
          if (t.kind === 'hang') t.el.style.visibility = hidden ? 'hidden' : '';
          if (hidden) continue;
          const s = reduced ? 0 : Math.sin(time * 0.9 + t.phase);
          let d = '', K: P;
          if (t.kind === 'hang' && t.node) {
            const A = center(t.node.getBoundingClientRect(), h);
            const len = t.len * tileSize(t.jaali);
            // lean away from the pointer when it comes close to the hanging end
            const B0 = { x: A.x, y: A.y + len };
            const px = pointer.x - h.left, py = pointer.y - h.top;
            let target = 0;
            if (!reduced && Math.abs(px - B0.x) < 120 && py > A.y && py < B0.y + 60) target = gsap.utils.clamp(-0.32, 0.32, -(px - B0.x) / 300);
            if (hot) target = 0;
            t.lean += (target - t.lean) * 0.08;
            const th = t.lean + s * 0.045;
            const B = { x: A.x + Math.sin(th) * len, y: A.y + Math.cos(th) * len };
            d = rope(A, B, reduced ? 0 : Math.sin(time * 0.9 + t.phase + 0.9) * len * 0.035);
            K = A;
            t.end!.setAttribute('transform', `translate(${B.x.toFixed(1)} ${B.y.toFixed(1)})`);
            t.el.style.transform = `translate(${B.x.toFixed(1)}px, ${B.y.toFixed(1)}px)`;
            t.el.style.opacity = String(gsap.utils.clamp(0, 1, (t.grow.v - 0.75) * 4));
          } else if (t.kind === 'bind' && t.node) {
            const A = center(t.node.getBoundingClientRect(), h);
            const B = anchor(t.el, t.el.dataset.anchor || 'top', h);
            const dist = Math.hypot(B.x - A.x, B.y - A.y);
            d = rope(A, B, hot ? 0 : dist * 0.05 * (0.65 + 0.35 * s));
            K = A;
          } else if (t.kind === 'bridge' && t.a && t.b) {
            if (phone) {
              const A = anchor(t.a, 'bottom-left', h), B = anchor(t.b, 'top-left', h);
              A.x -= 14; B.x -= 14;
              d = rope(A, B, hot ? 0 : 6 + 2 * s);
              K = { x: A.x, y: (A.y + B.y) / 2 };
            } else {
              const A = anchor(t.a, 'right', h), B = anchor(t.b, 'left', h);
              A.x += 14; B.x -= 14;
              const V = { x: stripX, y: (A.y + B.y) / 2 };
              const sag = hot ? 1 : 16 + 5 * s;
              d = rope(A, V, sag) + rope(V, B, sag).replace(/^M[^Q]+/, ' ');
              K = V;
            }
          } else continue;
          t.path.setAttribute('d', d);
          t.path.style.strokeDashoffset = String(1 - t.grow.v);
          t.path.classList.toggle('is-hot', hot);
          t.path.classList.toggle('is-dim', dim || (anyHot && !hot && t.kind === 'bridge'));
          t.knot.setAttribute('transform', `translate(${K!.x.toFixed(1)} ${K!.y.toFixed(1)})`);
          t.knot.style.opacity = String(gsap.utils.clamp(0, 1, t.grow.v * 3));
          t.knot.classList.toggle('is-dim', dim);
        }
      }
    }

    // Drop in when a host first comes into view.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const L = layers.find((l) => l.host === e.target);
        if (!L) return;
        L.visible = e.isIntersecting;
        if (L.visible && !L.grown) {
          L.grown = true;
          L.threads.forEach((t, i) => gsap.to(t.grow, { v: 1, duration: 1.3, ease: 'expo.out', delay: 0.15 + i * 0.07 }));
        }
        if (reduced) draw(0);
      });
    }, { rootMargin: '10% 0px' });
    layers.forEach((L) => io.observe(L.host));

    measure();
    const ro = new ResizeObserver(() => { measure(); draw(gsap.ticker.time); });
    layers.forEach((L) => ro.observe(L.host));
    document.fonts?.ready.then(() => { measure(); draw(gsap.ticker.time); });

    const tick = (time: number) => draw(time);
    if (!reduced) gsap.ticker.add(tick);
    else { layers.forEach((L) => (L.visible = true)); draw(0); }

    // expose a redraw for other modules (filters, accordions) under reduced motion
    const redraw = () => draw(gsap.ticker.time);
    document.addEventListener('threads:redraw', redraw);

    return () => {
      gsap.ticker.remove(tick); io.disconnect(); ro.disconnect();
      document.removeEventListener('threads:redraw', redraw);
      off.forEach((f) => f());
      layers.forEach((L) => L.svg.remove());
    };
  });
}
