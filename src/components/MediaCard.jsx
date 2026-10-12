import { useEffect, useRef, useState } from 'react';
import { prefersReduced } from '../lib/gsap';

/** Generated artwork used whenever a poster image is missing. */
export function Poster({ item, index }) {
  const num = String((index ?? 0) + 1).padStart(2, '0');
  return (
    <div className={`poster poster--t${item.tone}`} aria-hidden="true">
      <span className="poster__bar" />
      <span className="poster__num">{num}</span>
      <span className="poster__tag">J/P · PLACEHOLDER</span>
    </div>
  );
}

/**
 * One card, three states: generated placeholder → poster image → video.
 * Video only downloads/plays while on (or near) screen and degrades on error.
 */
export default function MediaCard({ item, index, onOpen, caption = false, className = '' }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const [posterFailed, setPosterFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const hasVideo = Boolean(item.src) && !videoFailed;
  const hasPoster = Boolean(item.poster) && !posterFailed;

  useEffect(() => {
    if (!hasVideo) return;
    const v = videoRef.current;
    const el = rootRef.current;
    if (!v || !el) return;
    const reduced = prefersReduced();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) {
            const useWebm = item.srcWebm && v.canPlayType('video/webm');
            v.src = useWebm ? item.srcWebm : item.src;
            v.load();
          }
          if (!reduced) v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.2, rootMargin: '120px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasVideo, item.src, item.srcWebm]);

  return (
    <button
      type="button"
      ref={rootRef}
      className={`mc mc--${item.orientation} ${className}`}
      onClick={() => onOpen && onOpen(item)}
      aria-label={`Open ${item.title}, ${item.category}`}
    >
      {hasPoster ? (
        <img className="mc__img" src={item.poster} alt="" loading="lazy" decoding="async" onError={() => setPosterFailed(true)} />
      ) : (
        <Poster item={item} index={index} />
      )}
      {hasVideo && (
        <video
          ref={videoRef}
          className={`mc__vid ${playing ? 'is-on' : ''}`}
          muted
          loop
          playsInline
          preload="none"
          poster={hasPoster ? item.poster : undefined}
          onPlaying={() => setPlaying(true)}
          onError={() => setVideoFailed(true)}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
      {caption && (
        <span className="mc__cap">
          <span className="mono">{item.category}</span>
          <span className="mc__title">{item.title}</span>
        </span>
      )}
    </button>
  );
}
