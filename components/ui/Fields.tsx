import { cn } from '@/lib/utils';

export function FieldLabel({ htmlFor, children, optional }: { htmlFor?: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[13.5px] font-medium text-ink">
      {children}
      {optional && <span className="ml-2 font-normal text-faint">(optional)</span>}
    </label>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[13px] text-[#C0392B]">
      {error}
    </p>
  );
}

export function TextField({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required,
  autoComplete,
  optional,
}: {
  id: string;
  name?: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn('field', error && 'field-error')}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        required={required}
        autoComplete={autoComplete}
      />
      <FieldError id={`${id}-err`} error={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  rows = 5,
  hint,
}: {
  id: string;
  name?: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {hint && <p className="-mt-1 mb-2 text-[13px] text-faint">{hint}</p>}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={cn('field resize-y', error && 'field-error')}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        required={required}
      />
      <FieldError id={`${id}-err`} error={error} />
    </div>
  );
}

export function SelectField({
  id,
  name,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select id={id} name={name} value={value} onChange={onChange} className="field appearance-none bg-surface">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Option chip used across the wizard */
export function OptionChip({
  selected,
  onClick,
  children,
  sub,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className="opt">
      <span className="block font-medium">{children}</span>
      {sub && <span className="opt-sub mt-0.5 block text-[13px] text-soft">{sub}</span>}
      <span className="opt-check" aria-hidden />
    </button>
  );
}
