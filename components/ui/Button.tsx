import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost' | 'accent' | 'inverse';
type Size = 'md' | 'lg';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}

const base =
  'group/btn inline-flex items-center justify-center gap-2.5 rounded-full font-medium transition-all duration-300 ease-out focus-visible:outline-2 active:scale-[0.985]';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-coal hover:shadow-[0_10px_30px_-12px_rgba(23,25,30,0.45)]',
  accent: 'bg-accent text-white hover:bg-accentdeep hover:shadow-[0_10px_30px_-12px_rgba(228,87,46,0.5)]',
  outline: 'border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper',
  ghost: 'text-ink hover:bg-ink/[0.05]',
  inverse: 'bg-paper text-ink hover:bg-white',
};

const sizes: Record<Size, string> = {
  md: 'px-6 py-3 text-[14.5px]',
  lg: 'px-8 py-4 text-[15.5px]',
};

function Arrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Button({ href, onClick, type = 'button', variant = 'primary', size = 'md', arrow = true, className, children, ariaLabel }: ButtonProps) {
  const cls = cn(base, variants[variant], sizes[size], className);
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}
