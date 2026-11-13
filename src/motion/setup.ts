// Global motion for Mannat v2. Runs once on the client, before the first page initializes.
import { gsap } from 'gsap';
import { ease, isMobile, setLoaderExit, setLoaderFormat, setTransition } from '../engine';
import { startThread } from './thread';
import { startThreads } from './threads';
import { bridges, resumeFilters } from './interact';
import { buttonFill, frameAway, menu, tone } from './ui';

export function setupMotion() {
  // Phones skip the loader: the hero paints as soon as the JS arrives.
  if (isMobile()) document.getElementById('loader')?.remove();

  setLoaderFormat((p) => String(Math.round(p)).padStart(3, '0'));
  // The loader is a jaali screen: name and counter lift away, then the screen slides off to the right.
  setLoaderExit((root) =>
    gsap.timeline()
      .to(root.querySelectorAll('[data-loader-out]'), { yPercent: -110, duration: 0.3, ease: ease.inOut, stagger: 0.03 })
      .to(root, { xPercent: 100, duration: 0.6, ease: ease.inOut }, '-=0.05'),
  );

  // Page transition: a jaali screen slides across, then away.
  setTransition({
    leave: (c) => gsap.timeline()
      .set(c, { autoAlpha: 1 })
      .fromTo(c.querySelector('.curtain__panel'), { xPercent: -100 }, { xPercent: 0, duration: 0.6, ease: ease.inOut }),
    enter: (c) => gsap.timeline()
      .to(c.querySelector('.curtain__panel'), { xPercent: 100, duration: 0.6, ease: ease.inOut })
      .set(c, { autoAlpha: 0 }),
  });

  frameAway();
  startThreads();
  startThread();
  tone();
  menu();
  buttonFill();
  bridges();
  resumeFilters();
}
