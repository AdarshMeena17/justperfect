import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '../lib/gsap';
import { site } from '../config/site';

/** Modular panel: pass `portrait` in site.founders to swap in a real photo later. */
function DuoPanel({ person, idx }) {
  const insta = site.instagram[person.id];
  return (
    <article className={`duo__panel duo__panel--${idx}`}>
      <div className="duo__art">
        {person.portrait ? (
          <img src={person.portrait} alt={person.name} loading="lazy" decoding="async" />
        ) : (
          <div className="duo__proc" aria-hidden="true">
            <span className="duo__init">{person.initials}</span>
            <span className="duo__stripes" />
          </div>
        )}
        <span className="duo__flash" aria-hidden="true" />
        <span className="duo__label mono">{person.treatment}</span>
      </div>
      <h3 className="duo__name">{person.name}</h3>
      <p className="mono duo__role">Filmmaker · Video editor</p>
      {insta && (
        <a className="link mono" href={insta} target="_blank" rel="noopener noreferrer">
          Instagram ↗
        </a>
      )}
    </article>
  );
}

export default function DuoSection() {
  const ref = useRef(null);
  useGSAP(
    () => {
      if (prefersReduced()) return;
      const panels = ref.current.querySelector('.duo__panels');
      const panelElements = gsap.utils.toArray('.duo__panel');
      const reveal = gsap.timeline();

      panelElements.forEach((el, i) => {
        const art = el.querySelector('.duo__art');
        const image = art.querySelector('img');
        const flash = art.querySelector('.duo__flash');
        const wipe = 'polygon(0 0, 0 0, 0 100%, 0 100%)';

        gsap.set(art, { clipPath: wipe });
        gsap.set(image || art.children[0], {
          scale: 1.35,
          filter: 'grayscale(1) contrast(1.15)',
        });
        gsap.set(flash, { xPercent: -120, autoAlpha: 1 });

        reveal
          .to(art, {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 1,
            ease: 'none',
          }, 0)
          .to(image || art.children[0], {
            scale: 1,
            filter: 'grayscale(0) contrast(1)',
            duration: 1,
            ease: 'none',
          }, 0)
          .to(flash, {
            xPercent: 120,
            autoAlpha: 0,
            duration: 1,
            ease: 'none',
          }, 0);

        gsap.fromTo(el, { yPercent: i ? 8 : 4 }, {
          yPercent: i ? -6 : -2,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      ScrollTrigger.create({
        trigger: panels,
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.5}`,
        pin: panels,
        scrub: 1,
        animation: reveal,
        invalidateOnRefresh: true,
      });
    },
    { scope: ref }
  );

  return (
    <section className="duo" id="duo" ref={ref} aria-labelledby="duo-h">
      <div className="duo__intro" data-reveal>
        <p className="eyebrow mono">(03) The duo</p>
        <h2 id="duo-h" className="sec-title">Two people behind every frame</h2>
        <p className="duo__copy">
          Harshit Thakur and Deepesh Solanki are a two-person team of filmmakers and video editors based in Indore, Madhya Pradesh. They report having worked with {site.clientsReported} clients, cutting in {site.tools.join(' and ')}.
        </p>
      </div>
      <div className="duo__panels">
        {site.founders.map((p, i) => (
          <DuoPanel key={p.id} person={p} idx={i} />
        ))}
      </div>
    </section>
  );
}
