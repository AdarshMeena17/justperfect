import { site } from '../config/site';

export const waLink = (msg) =>
  site.phone ? `https://wa.me/${site.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}` : '';

export const mailLink = (msg, subject = 'Project enquiry — JUSTPERFECT') =>
  site.email ? `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}` : '';

export function buildMessage(v) {
  const line = (k, val) => (val && val.trim() ? `${k}: ${val.trim()}` : null);
  return [
    `Hi ${site.name}, I'd like to enquire about a project.`,
    '',
    line('Name', v.name),
    line('Contact number', v.phone),
    line('Instagram', v.instagram),
    line('Project type', v.type),
    line('Preferred date', v.date),
    line('Shoot location', v.location),
    line('Estimated budget', v.budget),
    '',
    'About the project:',
    v.brief.trim(),
  ].filter((l) => l !== null).join('\n');
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
}
