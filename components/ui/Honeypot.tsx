// Anti-spam honeypot: invisible to humans (CSS + tabindex), tempting to bots.
// If it arrives filled, the submission is silently dropped server-side.
export const HONEYPOT_FIELD = 'website_hp';

export default function Honeypot() {
  return (
    <div className="hp-field" aria-hidden="true">
      <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
      <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
