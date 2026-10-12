import { useRef, useState } from 'react';
import { CATEGORIES } from '../data/media';
import { site } from '../config/site';
import { buildMessage, copyText, mailLink, waLink } from '../lib/contact';

const EMPTY = { name: '', phone: '', instagram: '', type: '', date: '', location: '', budget: '', brief: '' };
const TYPES = [...CATEGORIES, 'Shoot + edit', 'Editing only', 'Something else'];

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Please tell us your name.';
  if (v.phone.replace(/\D/g, '').length < 8) e.phone = 'Enter a contact number with at least 8 digits.';
  if (!v.type) e.type = 'Choose a project type.';
  if (v.brief.trim().length < 10) e.brief = 'Add a short description (at least 10 characters).';
  return e;
}

export default function BookingSection() {
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [locked, setLocked] = useState(false);
  const formRef = useRef(null);

  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setMessage('');
      setStatus('Please fix the highlighted fields.');
      const first = formRef.current.querySelector('[aria-invalid="true"]');
      first && first.focus();
      return;
    }
    setMessage(buildMessage(v));
    setStatus('Your enquiry is ready below. Nothing has been sent yet.');
  };

  const lock = () => {
    setLocked(true);
    setTimeout(() => setLocked(false), 2500);
  };

  const onCopy = async () => {
    setStatus((await copyText(message)) ? 'Enquiry copied to clipboard.' : 'Could not copy. Select the text and copy it manually.');
  };

  const wa = message ? waLink(message) : '';
  const mail = message ? mailLink(message) : '';
  const fld = (k, label, props = {}, req = false) => (
    <div className={`fld ${errors[k] ? 'has-err' : ''}`}>
      <label htmlFor={`f-${k}`}>
        {label}
        {req ? <span aria-hidden="true"> *</span> : <span className="opt"> (optional)</span>}
      </label>
      <input
        id={`f-${k}`}
        value={v[k]}
        onChange={set(k)}
        aria-invalid={errors[k] ? 'true' : undefined}
        aria-describedby={errors[k] ? `e-${k}` : undefined}
        required={req}
        {...props}
      />
      {errors[k] && <p className="err" id={`e-${k}`}>{errors[k]}</p>}
    </div>
  );

  return (
    <section className="book" id="contact" aria-labelledby="book-h">
      <div className="book__lead" data-reveal>
        <p className="eyebrow mono">(06) Booking</p>
        <h2 id="book-h" className="book__h">
          YOU BRING<br />THE IDEA.<br /><em>WE&rsquo;LL MAKE IT MOVE.</em>
        </h2>
        <p className="book__sub">
          Fill in the enquiry, then send it on WhatsApp or by email. Nothing is stored or sent by this website.
        </p>
        {(!site.phone || !site.email) && (
          <p className="notice mono">
            {!site.phone && 'WhatsApp is not set up yet. '}
            {!site.email && 'Email is not set up yet. '}
            You can still copy the enquiry.
          </p>
        )}
      </div>

      <form className="form" ref={formRef} onSubmit={onSubmit} noValidate data-reveal>
        <div className="form__row">
          {fld('name', 'Name', { autoComplete: 'name' }, true)}
          {fld('phone', 'Contact number', { type: 'tel', autoComplete: 'tel', inputMode: 'tel' }, true)}
        </div>
        <div className="form__row">
          {fld('instagram', 'Instagram handle', { placeholder: '@yourhandle' })}
          <div className={`fld ${errors.type ? 'has-err' : ''}`}>
            <label htmlFor="f-type">Type of project<span aria-hidden="true"> *</span></label>
            <select id="f-type" value={v.type} onChange={set('type')} aria-invalid={errors.type ? 'true' : undefined} aria-describedby={errors.type ? 'e-type' : undefined} required>
              <option value="">Select…</option>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            {errors.type && <p className="err" id="e-type">{errors.type}</p>}
          </div>
        </div>
        <div className="form__row">
          {fld('date', 'Preferred date', { type: 'date' })}
          {fld('location', 'Shoot location', { placeholder: 'e.g. Indore' })}
        </div>
        {fld('budget', 'Estimated budget', { placeholder: 'e.g. a range in ₹' })}
        <div className={`fld ${errors.brief ? 'has-err' : ''}`}>
          <label htmlFor="f-brief">Brief project description<span aria-hidden="true"> *</span></label>
          <textarea id="f-brief" rows="4" value={v.brief} onChange={set('brief')} aria-invalid={errors.brief ? 'true' : undefined} aria-describedby={errors.brief ? 'e-brief' : undefined} required />
          {errors.brief && <p className="err" id="e-brief">{errors.brief}</p>}
        </div>

        <button type="submit" className="btn btn--accent">Prepare enquiry</button>
        <p className="status mono" role="status" aria-live="polite">{status}</p>

        {message && (
          <div className="out">
            <pre className="out__msg">{message}</pre>
            <div className="out__actions">
              {wa ? (
                <a className="btn btn--accent btn--sm" href={wa} target="_blank" rel="noopener noreferrer" aria-disabled={locked} onClick={(e) => (locked ? e.preventDefault() : lock())}>
                  Send on WhatsApp
                </a>
              ) : (
                <button type="button" className="btn btn--ghost btn--sm" disabled>WhatsApp not configured</button>
              )}
              {mail ? (
                <a className="btn btn--ghost btn--sm" href={mail} aria-disabled={locked} onClick={(e) => (locked ? e.preventDefault() : lock())}>
                  Send by email
                </a>
              ) : (
                <button type="button" className="btn btn--ghost btn--sm" disabled>Email not configured</button>
              )}
              <button type="button" className="btn btn--ghost btn--sm" onClick={onCopy}>Copy enquiry</button>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}
