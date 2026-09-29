import Button from './Button';
import Magnetic from './Magnetic';
import Reveal from './Reveal';

interface Props {
  title?: string;
  text?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTASection({
  title = 'Have a problem worth solving?',
  text = 'Tell us what you’re trying to improve, automate or build. A short conversation is enough to know whether we can help — and if we can’t, we’ll say so.',
  primaryLabel = 'Start a Project',
  primaryHref = '/start-project',
  secondaryLabel = 'Talk to Our Team',
  secondaryHref = '/contact',
}: Props) {
  return (
    <section className="relative overflow-hidden bg-coal" aria-labelledby="cta-title">
      <div className="pointer-events-none absolute inset-0 gridlines opacity-[0.13]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(700px 320px at 78% 115%, rgba(228,87,46,0.20), transparent 65%)' }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-shell px-6 py-28 md:py-36">
        <Reveal>
          <span className="label-tech inline-flex items-center gap-2.5 text-paper/45">
            <span className="h-[5px] w-[5px] bg-accent" aria-hidden />
            NEXT STEP
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h2 id="cta-title" className="display-tight mt-6 max-w-[760px] font-display text-[clamp(2.2rem,5.2vw,4rem)] font-semibold leading-[1.04] text-paper">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-paper/60">{text}</p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic className="inline-flex" >
              <span data-cursor="start" className="contents">
              <Button href={primaryHref} variant="inverse" size="lg">
                {primaryLabel}
              </Button>
              </span>
            </Magnetic>
            <Button href={secondaryHref} variant="ghost" size="lg" className="text-paper/80 hover:bg-paper/10 hover:text-paper">
              {secondaryLabel}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
