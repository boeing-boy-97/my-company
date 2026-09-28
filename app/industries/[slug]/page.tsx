import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import CTASection from '@/components/ui/CTASection';
import { industries, industryBySlug } from '@/content/industries';
import { pageSeo, breadcrumbJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) return {};
  return pageSeo({
    title: `${ind.name} — Technology systems for ${ind.name.toLowerCase()}`,
    description: `${ind.tagline} See the problems we solve, the systems we build and how ${ind.name.toLowerCase()} teams use them.`,
    path: `/industries/${ind.slug}`,
  });
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) notFound();

  const others = industries.filter((i) => i.slug !== ind.slug).slice(0, 4);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Industries', path: '/industries' }, { name: ind.name, path: `/industries/${ind.slug}` }])) }} />
      <PageHero
        label={ind.name}
        title={ind.tagline}
        lede={`The ${ind.name.toLowerCase()} teams we work with share a pattern: real operational friction, hidden in routine. Here's what that looks like — and what we build to fix it.`}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Industries', href: '/industries' }, { label: ind.name }]}
      />

      {/* problems → systems */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <Reveal>
                <span className="font-mono text-[12px] text-accent">01 / 02</span>
                <h2 className="display-tight mt-3 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold tracking-tight text-ink">Where the hours go</h2>
              </Reveal>
              <ul className="mt-7 space-y-4">
                {ind.problems.map((p, i) => (
                  <Reveal key={p} delay={i * 60}>
                    <li className="flex items-start gap-3.5 rounded-xl border border-line bg-surface px-5 py-4 text-[14.5px] leading-relaxed text-ink">
                      <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rotate-45 bg-accent" aria-hidden />
                      {p}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
            <div>
              <Reveal>
                <span className="font-mono text-[12px] text-accent">02 / 02</span>
                <h2 className="display-tight mt-3 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold tracking-tight text-ink">What we build instead</h2>
              </Reveal>
              <ul className="mt-7 space-y-4">
                {ind.solutions.map((s, i) => (
                  <Reveal key={s} delay={i * 60}>
                    <li className="flex items-start gap-3.5 rounded-xl border border-ok/25 bg-ok/5 px-5 py-4 text-[14.5px] leading-relaxed text-ink">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-[6px] shrink-0 text-ok">
                        <path d="M2 7.4 5.2 10.5 12 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {s}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>

          <Reveal delay={120}>
            <div className="mt-16 rounded-2xl border border-line bg-surface p-8">
              <p className="label-tech">Systems that make it work</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {ind.systems.map((s) => (
                  <span key={s} className="rounded-full border border-line bg-paper px-4 py-2 text-[13.5px] text-soft">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* other industries */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-shell px-6 py-16 md:py-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-[17px] font-semibold text-ink">Other industries</h2>
            <Link href="/industries" className="link-underline text-[12.5px] text-faint hover:text-ink">All industries →</Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <Link key={o.slug} href={`/industries/${o.slug}`} className="group rounded-xl border border-line bg-paper px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/25">
                <p className="text-[14px] font-medium text-ink transition-colors group-hover:text-accentdeep">{o.name}</p>
                <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-faint">{o.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection title={`Working in ${ind.name.toLowerCase()}?`} text="Tell us the problem in your own words — we'll tell you honestly whether a system is the right answer." />
    </main>
  );
}
