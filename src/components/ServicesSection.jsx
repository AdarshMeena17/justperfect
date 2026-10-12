import { services } from '../data/services';

export default function ServicesSection() {
  return (
    <section className="services" id="services" aria-labelledby="services-h">
      <header className="sec-head" data-reveal>
        <p className="eyebrow mono">(02) Capabilities</p>
        <h2 id="services-h" className="sec-title">What we make</h2>
      </header>
      <ul className="svc-list">
        {services.map((s) => (
          <li className="svc" key={s.n} tabIndex={0} data-reveal>
            <span className="svc__n mono">{s.n}</span>
            <h3 className="svc__t">{s.title}</h3>
            <p className="svc__d">{s.text}</p>
            <span className="svc__arrow" aria-hidden="true">↗</span>
            <span className="svc__tex" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </section>
  );
}
