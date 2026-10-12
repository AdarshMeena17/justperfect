import { useEffect, useRef } from 'react';
import { gsap, prefersReduced } from './gsap';
import { scrollToId } from './scroll';

/** Splits text into masked characters for GSAP. Accessible: real text is in .sr */
export function Chars({ text, className = '' }) {
  return (
    <>
      <span className="sr">{text}</span>
      <span className={`chars ${className}`} aria-hidden="true">
        {[...text].map((c, i) => (
          <span className="ch" key={i}>
            <span className="ch__i">{c === ' ' ? '\u00A0' : c}</span>
          </span>
        ))}
      </span>
    </>
  );
}

/** In-page anchor that uses Lenis when available */
export function Anchor({ id, children, className, onClick, ...rest }) {
  return (
    <a
      href={`#${id}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick();
        scrollToId(id);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Subtle magnetic pull on fine-pointer devices only */
export function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (prefersReduced() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = ref.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.set(el, { clearProps: 'transform' });
    };
  }, [strength]);
  return (
    <span className="mag" ref={ref}>
      {children}
    </span>
  );
}
