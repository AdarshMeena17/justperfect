import { useMemo, useState } from 'react';
import { CATEGORIES, media } from '../data/media';
import MediaCard from './MediaCard';

// Editorial rhythm: each trio of cards sums to 12 columns, with deliberate vertical offsets.
const PATTERN = [
  { span: 5, ratio: '4 / 3', off: 0 },
  { span: 3, ratio: '3 / 4', off: 56 },
  { span: 4, ratio: '1 / 1', off: 18 },
  { span: 3, ratio: '3 / 4', off: 28 },
  { span: 5, ratio: '16 / 10', off: 0 },
  { span: 4, ratio: '4 / 5', off: 64 },
];

export default function WorkGallery({ onOpen }) {
  const [cat, setCat] = useState('All');
  const list = useMemo(() => (cat === 'All' ? media : media.filter((m) => m.category === cat)), [cat]);

  return (
    <section className="work" id="work" aria-labelledby="work-h">
      <header className="sec-head" data-reveal>
        <p className="eyebrow mono">(05) Selected work</p>
        <h2 id="work-h" className="sec-title">The work</h2>
      </header>

      <div className="chips" role="group" aria-label="Filter by category" data-reveal>
        {['All', ...CATEGORIES].map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
        <span className="mono chips__count" aria-live="polite">
          {String(list.length).padStart(2, '0')} items
        </span>
      </div>

      <ul className="grid" key={cat}>
        {list.map((item, i) => {
          const p = PATTERN[i % PATTERN.length];
          return (
            <li key={item.id} className="grid__cell" style={{ '--span': p.span, '--ratio': p.ratio, '--off': `${p.off}px` }}>
              <MediaCard item={item} index={media.indexOf(item)} onOpen={onOpen} className="grid__card" />
              <p className="grid__cap">
                <span className="mono">{item.category}</span>
                <span>{item.title}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
