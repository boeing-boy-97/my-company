import Reveal from './Reveal';
import { cn } from '@/lib/utils';

interface Props {
  index?: string;
  label: string;
  title: React.ReactNode;
  lede?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function TechLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('label-tech inline-flex items-center gap-2.5', className)}>
      <span className="h-[5px] w-[5px] bg-accent" aria-hidden />
      {children}
    </span>
  );
}

export default function SectionHeader({ index, label, title, lede, align = 'left', className }: Props) {
  return (
    <div className={cn('max-w-[820px]', align === 'center' && 'mx-auto text-center', className)}>
      <Reveal>
        <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
          <TechLabel>{label}</TechLabel>
          {index && <span className="font-mono text-[11px] text-faint">( {index} )</span>}
        </div>
      </Reveal>
      <Reveal delay={70}>
        <h2 className="display-tight mt-5 font-display text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold leading-[1.06] text-ink">{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={140}>
          <p className={cn('mt-5 max-w-[620px] text-[17px] leading-[1.65] text-soft', align === 'center' && 'mx-auto')}>{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
