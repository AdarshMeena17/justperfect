import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced } from '../lib/gsap';
import { Chars } from '../lib/ui';

export default function ManifestoSection() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const st = (trigger, start = 'top 75%') => ({ trigger, start, toggleActions: 'play none none reverse' });

      // Card-like reveal from the hero: the light section opens up as it arrives.
      gsap.fromTo(
        ref.current,
        { clipPath: 'inset(14% 6% 0% 6% round 28px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'top 15%', scrub: true },
        }
      );

      // Each line enters differently on purpose.
      gsap.from('.m1 .ch__i', { yPercent: 110, duration: 1, stagger: 0.035, ease: 'power4.out', scrollTrigger: st('.m1') });
      gsap.from('.m2 .m__in', { scale: 1.5, yPercent: 30, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: st('.m2') });
      gsap.from('.m3 .ch__i', { xPercent: 120, duration: 1, stagger: { each: 0.05, from: 'end' }, ease: 'power3.out', scrollTrigger: st('.m3') });
      gsap.from('.manifesto__note > *', { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, scrollTrigger: st('.manifesto__note', 'top 90%') });
    },
    { scope: ref }
  );

  return (
    <section className="manifesto" ref={ref} aria-labelledby="manifesto-h">
      <p className="eyebrow mono">(01) Philosophy</p>
      <h2 id="manifesto-h" className="manifesto__h">
        <span className="sr">Not just content. A feeling that stays.</span>
        <span className="m m1" aria-hidden="true"><Chars text="NOT JUST CONTENT." /></span>
        <span className="m m2" aria-hidden="true"><span className="m__in">A FEELING</span></span>
        <span className="m m3" aria-hidden="true"><Chars text="THAT STAYS." className="accent" /></span>
      </h2>
      <div className="manifesto__note">
        <p>
          Two people. One frame. JUSTPERFECT shoots, directs and edits in Indore. Bring a rough idea or a drive full of footage, and we shape it into something you want to watch twice.
        </p>
        <p className="mono">Two people · One frame</p>
      </div>
    </section>
  );
}
