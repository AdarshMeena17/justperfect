import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReduced } from './gsap';

let lenis = null;

export function initScroll() {
  if (prefersReduced()) return () => {};
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t) => lenis && lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis && lenis.destroy();
    lenis = null;
  };
}

export function lockScroll(lock) {
  document.documentElement.style.overflow = lock ? 'hidden' : '';
  if (lenis) (lock ? lenis.stop() : lenis.start());
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' });
  history.replaceState(null, '', `#${id}`);
}
