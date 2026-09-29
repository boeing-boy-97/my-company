import { MetadataRoute } from 'next';
import { cmsPublished, type CaseStudyRecord, type PostRecord, type JobRecord } from '@/lib/store';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cases, posts, jobs] = await Promise.all([
    cmsPublished<CaseStudyRecord>('caseStudies'),
    cmsPublished<PostRecord>('posts'),
    cmsPublished<JobRecord>('jobs'),
  ]);
  const now = new Date();

  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/work`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${site.url}/approach`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.url}/industries`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.url}/studio`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site.url}/insights`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${site.url}/start-project`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.url}/careers`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site.url}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${site.url}/cookies`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${site.url}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${site.url}/accessibility`, changeFrequency: 'yearly', priority: 0.2 },
    ...cases.map((c) => ({
      url: `${site.url}/work/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/insights/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...jobs.map((j) => ({
      url: `${site.url}/careers/${j.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
