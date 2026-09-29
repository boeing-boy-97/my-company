// Small server-side validation helpers — no external deps, strict by default.

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^https?:\/\/[^\s]+$/i;

export function vRequired(value: unknown, msg = 'This field is required') {
  if (value === undefined || value === null) return msg;
  if (typeof value === 'string' && value.trim().length === 0) return msg;
  return null;
}

export function vEmail(value: string, msg = 'Enter a valid email address') {
  if (!value.trim()) return null; // use vRequired separately if mandatory
  return EMAIL_RE.test(value.trim()) ? null : msg;
}

export function vUrl(value: string, msg = 'Enter a valid URL (https://…)') {
  if (!value.trim()) return null;
  const v = value.startsWith('http') ? value : `https://${value}`;
  return URL_RE.test(v) ? null : msg;
}

export function vLen(value: string, max: number, label = 'This') {
  if (value.length > max) return `${label} is too long (max ${max} characters)`;
  return null;
}

export function vPhone(value: string, msg = 'Enter a valid phone number') {
  if (!value.trim()) return null;
  return /^[+\d][\d\s\-().]{6,19}$/.test(value.trim()) ? null : msg;
}

/** Strip control characters & collapse whitespace from arbitrary input. */
export function sanitize(value: string, max = 5000) {
  return value.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, max).trim();
}

export function sanitizeArray(values: string[], maxItems = 12, maxLen = 80) {
  return values.map((v) => sanitize(v, maxLen)).filter(Boolean).slice(0, maxItems);
}

/** True when a bot filled the invisible honeypot field. */
export function honeypotTriggered(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}
