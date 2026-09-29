// Server-side: builds the flat index that powers the global search overlay.
import { services } from '@/content/services';
import { industries } from '@/content/industries';
import { cmsPublished, type CaseStudyRecord, type PostRecord } from '@/lib/store';
import type { SearchEntry } from '@/components/layout/GlobalSearch';

export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const [cases, posts] = await Promise.all([
    cmsPublished<CaseStudyRecord>('caseStudies'),
    cmsPublished<PostRecord>('posts'),
  ]);

  const entries: SearchEntry[] = [];

  for (const s of services) {
    entries.push({ title: s.title, category: 'Services', href: `/services/${s.slug}`, text: `${s.short || ''} ${s.problemsSolved.join(' ')}` });
  }
  for (const i of industries) {
    entries.push({ title: i.name, category: 'Industries', href: `/industries/${i.slug}`, text: `${i.tagline || ''} ${i.problems.join(' ')} ${i.solutions.join(' ')}` });
  }
  for (const c of cases) {
    entries.push({ title: c.title, category: 'Work', href: `/work/${c.slug}`, text: `${c.summary || ''} ${c.industry || ''} ${c.client || ''}` });
  }
  for (const p of posts) {
    entries.push({ title: p.title, category: 'Insights', href: `/insights/${p.slug}`, text: p.excerpt || '' });
  }
  // key static pages
  entries.push(
    { title: 'Our process', category: 'Pages', href: '/approach', text: 'Eight stages from discovery to support' },
    { title: 'About the studio', category: 'Pages', href: '/studio', text: 'Who we are and how we work' },
    { title: 'Start a project', category: 'Pages', href: '/start-project', text: 'Send a project brief' },
    { title: 'Contact', category: 'Pages', href: '/contact', text: 'Email, WhatsApp, phone' },
    { title: 'Careers', category: 'Pages', href: '/careers', text: 'Open roles' },
  );

  return entries;
}
