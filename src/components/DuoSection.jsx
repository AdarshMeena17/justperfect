import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced } from '../lib/gsap';
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
      gsap.utils.toArray('.duo__panel').forEach((el, i) => {
        gsap.fromTo(el, { yPercent: i ? 8 : 4 }, {
          yPercent: i ? -6 : -2,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
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
