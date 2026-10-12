import { nav, site } from '../config/site';
import { Anchor } from '../lib/ui';

export default function SiteFooter() {
  const insta = [
    { n: 'Harshit Thakur', u: site.instagram.harshit },
    { n: 'Deepesh Solanki', u: site.instagram.deepesh },
  ].filter((i) => i.u);
  const hasContact = site.email || site.phoneDisplay || site.phone;

  return (
    <footer className="foot">
      <p className="foot__word" aria-label={site.name}>{site.name}</p>
      <div className="foot__cols">
        <div>
          <p className="mono foot__h">Studio</p>
          <p>{site.name}</p>
          <p>{site.location}</p>
        </div>
        <div>
          <p className="mono foot__h">Explore</p>
          <ul>
            {nav.map((n) => (
              <li key={n.id}><Anchor id={n.id}>{n.label}</Anchor></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mono foot__h">Contact</p>
          {site.email && <p><a href={`mailto:${site.email}`}>{site.email}</a></p>}
          {(site.phoneDisplay || site.phone) && <p><a href={`tel:+${site.phone.replace(/\D/g, '')}`}>{site.phoneDisplay || site.phone}</a></p>}
          {insta.map((i) => (
            <p key={i.n}><a href={i.u} target="_blank" rel="noopener noreferrer">Instagram — {i.n} ↗</a></p>
          ))}
          {!hasContact && !insta.length && <p>Contact details coming soon. Use the enquiry form above.</p>}
        </div>
      </div>
      <div className="foot__ticker" aria-hidden="true">
        <div className="foot__ticker-in">
          {Array.from({ length: 8 }).map((_, i) => <span key={i}>{site.name} ✦ </span>)}
        </div>
      </div>
      <p className="mono foot__legal">© {new Date().getFullYear()} {site.name}. {site.location}.</p>
    </footer>
  );
}
