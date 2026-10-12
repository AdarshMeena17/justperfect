import { useEffect, useState } from 'react';
import { nav, site } from '../config/site';
import { Anchor, Magnetic } from '../lib/ui';
import { lockScroll } from '../lib/scroll';

function useClock() {
  const fmt = () =>
    new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 30000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const time = useClock();

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [open]);

  return (
    <header className="hdr">
      <Anchor id="top" className="hdr__word blend" aria-label={`${site.name} — back to top`}>
        {site.name}
      </Anchor>

      <nav className="hdr__nav blend" aria-label="Primary">
        {nav.map((n) => (
          <Anchor key={n.id} id={n.id}>
            {n.label}
          </Anchor>
        ))}
      </nav>

      <div className="hdr__right">
        <span className="hdr__clock mono blend">
          {site.city} · {time} IST
        </span>
        <Magnetic>
          <Anchor id="contact" className="btn btn--accent btn--sm">
            Start a project
          </Anchor>
        </Magnetic>
        <button
          type="button"
          className="hdr__burger blend"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <div id="mobile-menu" className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <ul>
          {nav.map((n) => (
            <li key={n.id}>
              <Anchor
                id={n.id}
                onClick={() => {
                  lockScroll(false);
                  setOpen(false);
                }}
              >
                {n.label}
              </Anchor>
            </li>
          ))}
        </ul>
        <p className="mono">{site.location}</p>
      </div>
    </header>
  );
}
