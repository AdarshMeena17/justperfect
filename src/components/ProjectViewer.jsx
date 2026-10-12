import { useEffect, useRef } from 'react';
import { lockScroll } from '../lib/scroll';
import { Poster } from './MediaCard';
import { media } from '../data/media';

export default function ProjectViewer({ item, onClose }) {
  const closeRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!item) return;
    const prev = document.activeElement;
    lockScroll(true);
    closeRef.current && closeRef.current.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab' || !boxRef.current) return;
      const f = boxRef.current.querySelectorAll('button, a[href], video[controls]');
      if (!f.length) return;
      const first = f[0];
      const lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
      prev && prev.focus && prev.focus();
    };
  }, [item, onClose]);

  if (!item) return null;
  const hasVideo = Boolean(item.src);

  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <div className="viewer__box" ref={boxRef} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="viewer__close btn btn--ghost btn--sm" ref={closeRef} onClick={onClose}>
          Close ✕
        </button>
        <div className={`viewer__media viewer__media--${item.orientation}`}>
          {hasVideo ? (
            <video controls playsInline loop poster={item.poster || undefined} src={item.src} aria-label={item.alt} />
          ) : (
            <div className="viewer__poster">
              <Poster item={item} index={media.indexOf(item)} />
              <p className="viewer__soon mono">Footage coming soon</p>
            </div>
          )}
        </div>
        <div className="viewer__info">
          <p className="mono">{item.category}</p>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </div>
    </div>
  );
}
