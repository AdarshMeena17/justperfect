import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '../lib/gsap';
import { Chars, Anchor, Magnetic } from '../lib/ui';
import { site } from '../config/site';

export default function HeroExperience() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const state = useRef({ progress: 0, reveal: 0, intro: 0 }).current;
  const [fallback, setFallback] = useState(false);

  // ── 3D scene (single canvas, dynamically imported so three.js is its own chunk) ──
  useEffect(() => {
    let scene = null;
    let cancelled = false;
    let ro = null;
    let io = null;
    const mobile = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches;
    const reduced = prefersReduced();
    const onMove = (e) => scene && scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);

    import('./hero/scene.js')
      .then(({ createScene }) => {
        if (cancelled) return;
        try {
          scene = createScene(canvasRef.current, state, { mobile, reduced });
        } catch (err) {
          console.warn('WebGL unavailable, using CSS fallback.', err);
          setFallback(true);
          state.reveal = 1;
          state.intro = 1;
          return;
        }
        ro = new ResizeObserver(() => scene && scene.resize());
        ro.observe(canvasRef.current.parentElement);
        io = new IntersectionObserver(([e]) => scene && scene.setActive(e.isIntersecting));
        io.observe(rootRef.current);
        if (!mobile && !reduced) window.addEventListener('pointermove', onMove, { passive: true });
      })
      .catch(() => setFallback(true));

    return () => {
      cancelled = true;
      window.removeEventListener('pointermove', onMove);
      ro && ro.disconnect();
      io && io.disconnect();
      scene && scene.dispose();
    };
  }, [state]);

  // ── Entrance + scroll choreography (GSAP context auto-cleans) ──
  useGSAP(
    () => {
      const reduced = prefersReduced();
      if (reduced) {
        state.reveal = 1;
        state.intro = 1;
        gsap.set('.hero .ch__i', { yPercent: 0 });
        gsap.set('.hero__tag, .hero__meta, .hero__cta', { opacity: 1, y: 0 });
      } else {
        gsap
          .timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 })
          .fromTo('.hero__word .ch__i', { yPercent: 115 }, { yPercent: 0, duration: 1.25, stagger: 0.06 }, 0.35)
          .to(state, { reveal: 1, duration: 2.6, ease: 'power2.inOut' }, 0)
          .to(state, { intro: 1, duration: 2.4, ease: 'power3.out' }, 0)
          .fromTo('.hero__tag, .hero__meta', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12 }, 1.1)
          .fromTo('.hero__cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, 1.4);
      }

      // Scroll out of the hero: object fragments + recedes (see scene.js), type lifts away.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
              state.progress = self.progress;
            },
          },
        })
        .to('.hero__word', { yPercent: -28, scale: 1.06, opacity: 0, ease: 'none' }, 0.25)
        .to('.hero__text', { y: -80, opacity: 0, ease: 'none' }, 0.05)
        .to('.hero__scroll', { opacity: 0, ease: 'none' }, 0);
    },
    { scope: rootRef }
  );

  return (
    <section className="hero" id="top" ref={rootRef} aria-label="JUSTPERFECT introduction">
      <div className="hero__stick">
        <div className="hero__stage" aria-hidden="true">
          {!fallback && <canvas ref={canvasRef} className="hero__canvas" />}
          {fallback && (
            <div className="hero__fallback">
              <i />
              <i />
              <i />
            </div>
          )}
          <div className="hero__vignette" />
          <div className="grain" />
        </div>

        <div className="hero__text">
          <div className="hero__top">
            <p className="hero__tag">WE MAKE REALITY LOOK DIFFERENT.</p>
            <div className="hero__meta mono">
              <span>Independent creative production</span>
              <span>Indore, India</span>
            </div>
          </div>
        </div>

        <div className="hero__bottom">
          <div className="hero__ctas">
            <Magnetic>
              <Anchor id="work" className="btn btn--ghost hero__cta">
                Explore the work
              </Anchor>
            </Magnetic>
            <Magnetic>
              <Anchor id="contact" className="btn btn--accent hero__cta">
                Start a project
              </Anchor>
            </Magnetic>
          </div>
          <h1 className="hero__word">
            <Chars text={site.name} />
          </h1>
        </div>

        <div className="hero__scroll mono" aria-hidden="true">
          Scroll ↓
        </div>
      </div>
    </section>
  );
}
