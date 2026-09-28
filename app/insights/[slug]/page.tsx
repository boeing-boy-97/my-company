import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { ReadingProgress, ArticleToc, ShareRow } from '@/components/insights/ArticleChrome';
import { cmsGet, cmsPublished, type PostRecord } from '@/lib/store';
import { pageSeo, breadcrumbJsonLd } from '@/lib/seo';
import { site } from '@/lib/site';
import { formatDate, readingTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await cmsGet<PostRecord>('posts', slug);
  if (!post || post.status !== 'published') notFound();
  return pageSeo({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/insights/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
  });
}

function words(post: PostRecord) {
  return post.sections.reduce((acc, s) => acc + s.paragraphs.join(' ').split(/\s+/).length, 0);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await cmsGet<PostRecord>('posts', slug);
  if (!post || post.status !== 'published') notFound();
  const allPosts = await cmsPublished<PostRecord>('posts');

  const minutes = readingTime(words(post));
  const related = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category).concat(allPosts.filter((p) => p.slug !== post.slug && p.category !== post.category)).slice(0, 3);
  const url = `${site.url}/insights/${post.slug}`;

  return (
    <main>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            author: { '@type': 'Organization', name: post.author },
            publisher: { '@type': 'Organization', name: site.legalName, url: site.url },
            datePublished: post.publishedAt,
            mainEntityOfPage: url,
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights' }, { name: post.title, path: `/insights/${post.slug}` }])) }} />

      <header className="toplight relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 gridlines gridlines-fade" aria-hidden />
        <div className="relative mx-auto max-w-shell px-6 pb-14 pt-36 md:pt-44">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-tech text-faint">
              <li><Link href="/" className="hover:text-ink">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/insights" className="hover:text-ink">Insights</Link></li>
              <li aria-hidden>/</li>
              <li className="text-soft">{post.category}</li>
            </ol>
          </nav>
          <Reveal>
            <span className="rounded-full border border-accent/25 bg-accenthalo px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-wide text-accentdeep">{post.category}</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display-tight mt-6 max-w-[880px] font-display text-[clamp(2rem,5vw,3.8rem)] font-semibold leading-[1.06] text-ink">{post.title}</h1>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-faint">
              <span className="font-medium text-soft">{post.author}</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span>{minutes} min read</span>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto grid max-w-shell gap-12 px-6 py-14 md:py-20 lg:grid-cols-[1fr_240px] lg:gap-16">
        <article className="max-w-[720px]">
          {post.sections.map((section) => (
            <section key={section.id} id={`sec-${section.id}`} className="scroll-mt-32 py-6">
              <Reveal>
                <h2 className="display-tight font-display text-[clamp(1.35rem,2.6vw,1.85rem)] font-semibold tracking-tight text-ink">{section.heading}</h2>
              </Reveal>
              {section.paragraphs.map((p, i) => (
                <Reveal key={i} delay={60 + i * 50}>
                  <p className="mt-5 text-[16.5px] leading-[1.8] text-[#3c414b]">{p}</p>
                </Reveal>
              ))}
            </section>
          ))}

          <div className="mt-10 border-t border-line pt-8">
            <ShareRow title={post.title} url={url} />
          </div>

          <div className="mt-10 rounded-2xl bg-coal p-8 text-paper md:p-10">
            <p className="label-tech text-paper/45">Put this into practice</p>
            <p className="display-tight mt-3 font-display text-[clamp(1.3rem,2.4vw,1.8rem)] font-semibold leading-[1.2]">Have a version of this problem in your business?</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button href="/start-project" variant="inverse">Start a Project</Button>
              <Button href="/contact" variant="ghost" className="text-paper/75 hover:bg-paper/10 hover:text-paper">Talk to Our Team</Button>
            </div>
          </div>
        </article>

        <ArticleToc sections={post.sections.map((s) => ({ id: s.id, heading: s.heading }))} />
      </div>

      {/* related */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-shell px-6 py-16 md:py-20">
          <p className="label-tech">Related reading</p>
          <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/insights/${r.slug}`} className="group flex h-full flex-col bg-surface p-7 transition-colors duration-300 hover:bg-paper">
                <span className="font-mono text-[10px] uppercase tracking-tech text-accentdeep">{r.category}</span>
                <h3 className="display-tight mt-3 flex-1 font-display text-[17px] font-semibold leading-[1.3] text-ink transition-colors group-hover:text-accentdeep">{r.title}</h3>
                <span className="mt-5 text-[12px] text-faint">{readingTime(words(r))} min read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
