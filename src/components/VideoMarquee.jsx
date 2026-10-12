import { useState } from 'react';
import { marqueeItems } from '../data/media';
import MediaCard from './MediaCard';

const SIZE = { portrait: 'tall', landscape: 'wide', square: 'sq' };

export default function VideoMarquee({ onOpen }) {
  const [paused, setPaused] = useState(false);

  // The set is rendered twice; translating the track by -50% loops seamlessly.
  const half = (ghost) => (
    <ul className="mq__half" aria-hidden={ghost ? "true" : undefined} inert={ghost ? "" : undefined}>
      {marqueeItems.map((item, i) => (
        <li key={item.id} className={`mq__item mq__item--${SIZE[item.orientation]}`}>
          <MediaCard item={item} index={i} caption onOpen={onOpen} />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="reel" aria-labelledby="reel-h">
      <header className="sec-head sec-head--row" data-reveal>
        <div>
          <p className="eyebrow mono">(04) Reel</p>
          <h2 id="reel-h" className="sec-title">In motion</h2>
        </div>
        <button type="button" className="btn btn--ghost btn--sm" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          {paused ? 'Play marquee' : 'Pause marquee'}
        </button>
      </header>
      <div className="mq" data-paused={paused}>
        <div className="mq__track">
          {half(false)}
          {half(true)}
        </div>
      </div>
    </section>
  );
}
