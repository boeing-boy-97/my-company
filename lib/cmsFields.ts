// Field descriptors for the admin CMS editor.
// The editor renders forms from these configs and serializes values
// back into the store record shapes on save.

export type CmsKind = 'caseStudies' | 'posts' | 'testimonials' | 'team' | 'jobs';

export interface CmsField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'lines' | 'sections' | 'stats' | 'select' | 'date' | 'checkbox';
  hint?: string;
  options?: string[];
  full?: boolean;
}

export const CMS_KINDS: Array<{ kind: CmsKind; route: string; singular: string; plural: string; titleKey: string }> = [
  { kind: 'caseStudies', route: '/admin/case-studies', singular: 'Case study', plural: 'Case studies', titleKey: 'title' },
  { kind: 'posts', route: '/admin/insights', singular: 'Insight', plural: 'Insights', titleKey: 'title' },
  { kind: 'testimonials', route: '/admin/testimonials', singular: 'Testimonial', plural: 'Testimonials', titleKey: 'person' },
  { kind: 'team', route: '/admin/team', singular: 'Team member', plural: 'Team', titleKey: 'name' },
  { kind: 'jobs', route: '/admin/jobs', singular: 'Job', plural: 'Jobs', titleKey: 'title' },
];

export const cmsKindMeta = (kind: CmsKind) => CMS_KINDS.find((k) => k.kind === kind)!;

const STATUS_OPTIONS = ['draft', 'published', 'archived'];

export const cmsFields: Record<CmsKind, CmsField[]> = {
  caseStudies: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'slug', label: 'Slug', type: 'text', hint: 'URL path under /work/' },
    { key: 'client', label: 'Client', type: 'text' },
    { key: 'industry', label: 'Industry', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'year', label: 'Year', type: 'text' },
    { key: 'summary', label: 'Summary', type: 'textarea', full: true },
    { key: 'challenge', label: 'The challenge', type: 'lines', hint: 'One paragraph per line', full: true },
    { key: 'approach', label: 'The approach', type: 'lines', hint: 'One paragraph per line', full: true },
    { key: 'results', label: 'Results', type: 'lines', hint: 'One item per line, e.g. "38% fewer manual updates"', full: true },
    { key: 'services', label: 'Services', type: 'lines', hint: 'Comma or line separated', full: true },
    { key: 'stack', label: 'Stack', type: 'lines', hint: 'Comma or line separated', full: true },
    { key: 'stats', label: 'Stats', type: 'stats', hint: 'One per line: Label = Value', full: true },
    { key: 'featured', label: 'Featured on homepage', type: 'checkbox' },
    { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
    { key: 'seoTitle', label: 'SEO title override', type: 'text', hint: 'Optional' },
    { key: 'seoDescription', label: 'SEO description override', type: 'textarea', hint: 'Optional' },
  ],
  posts: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'slug', label: 'Slug', type: 'text', hint: 'URL path under /insights/' },
    { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
    { key: 'category', label: 'Category', type: 'select', options: ['Strategy', 'Automation', 'AI', 'Engineering', 'Product'] },
    { key: 'publishedAt', label: 'Publish date', type: 'date' },
    { key: 'author', label: 'Author', type: 'text' },
    { key: 'authorRole', label: 'Author role', type: 'text' },
    { key: 'body', label: 'Body', type: 'sections', hint: 'Start each section with a plain-text heading on its own line, then paragraphs on following lines. Separate sections with a line of three dashes (---).', full: true },
    { key: 'featured', label: 'Featured', type: 'checkbox' },
    { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
    { key: 'seoTitle', label: 'SEO title override', type: 'text', hint: 'Optional' },
    { key: 'seoDescription', label: 'SEO description override', type: 'textarea', hint: 'Optional' },
  ],
  testimonials: [
    { key: 'quote', label: 'Quote', type: 'textarea', full: true },
    { key: 'person', label: 'Person', type: 'text' },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, hint: 'Only published testimonials appear on the site.' },
  ],
  team: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'title', label: 'Role / title', type: 'text' },
    { key: 'bio', label: 'Bio', type: 'textarea', full: true },
    { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, hint: 'Only published members appear on the site. Placeholder profiles should stay drafts.' },
  ],
  jobs: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'slug', label: 'Slug', type: 'text', hint: 'URL path under /careers/' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'type', label: 'Type', type: 'select', options: ['Full-time', 'Contract', 'Internship'] },
    { key: 'summary', label: 'Summary', type: 'textarea', full: true },
    { key: 'responsibilities', label: 'Responsibilities', type: 'lines', hint: 'One per line', full: true },
    { key: 'requirements', label: 'Requirements', type: 'lines', hint: 'One per line', full: true },
    { key: 'perks', label: 'Perks', type: 'lines', hint: 'One per line', full: true },
    { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
  ],
};

export function blankRecord(kind: CmsKind): Record<string, unknown> {
  const base: Record<string, unknown> = { status: 'draft' };
  if (kind === 'caseStudies') Object.assign(base, { slug: '', title: '', client: '', industry: '', category: '', year: String(new Date().getFullYear()), summary: '', challenge: [], approach: [], results: [], services: [], stack: [], stats: [], featured: false });
  if (kind === 'posts') Object.assign(base, { slug: '', title: '', excerpt: '', category: 'Engineering', publishedAt: new Date().toISOString().slice(0, 10), author: 'Kiln Studio', authorRole: '', sections: [], featured: false });
  if (kind === 'testimonials') Object.assign(base, { quote: '', person: '', role: '', company: '' });
  if (kind === 'team') Object.assign(base, { name: '', title: '', bio: '' });
  if (kind === 'jobs') Object.assign(base, { slug: '', title: '', location: 'Remote / Nagpur', type: 'Full-time', summary: '', responsibilities: [], requirements: [], perks: [] });
  return base;
}

/** Convert a store record into flat editor values. */
export function recordToForm(kind: CmsKind, record: Record<string, unknown>): Record<string, string> {
  const form: Record<string, string> = {};
  for (const field of cmsFields[kind]) {
    const value = field.key === 'body' ? record.sections : record[field.key];
    switch (field.type) {
      case 'checkbox':
        form[field.key] = value ? '1' : '';
        break;
      case 'lines':
        form[field.key] = Array.isArray(value) ? (value as string[]).join('\n') : '';
        break;
      case 'stats':
        form[field.key] = Array.isArray(value) ? (value as Array<{ label: string; value: string }>).map((s) => `${s.label} = ${s.value}`).join('\n') : '';
        break;
      case 'sections': {
        const sections = Array.isArray(value) ? (value as Array<{ heading?: string; paragraphs?: string[] }>) : [];
        form[field.key] = sections
          .map((s) => [s.heading || '', ...(s.paragraphs || [])].filter(Boolean).join('\n'))
          .join('\n\n---\n\n');
        break;
      }
      case 'date':
        form[field.key] = typeof value === 'string' ? value.slice(0, 10) : '';
        break;
      default:
        form[field.key] = typeof value === 'string' ? value : value == null ? '' : String(value);
    }
  }
  return form;
}

/** Convert flat editor values into a store record. */
export function formToRecord(kind: CmsKind, form: Record<string, string>): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  const lines = (v: string) => v.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  for (const field of cmsFields[kind]) {
    const raw = form[field.key] ?? '';
    switch (field.type) {
      case 'checkbox':
        record[field.key] = raw === '1';
        break;
      case 'lines':
        record[field.key] = field.key === 'services' || field.key === 'stack' ? lines(raw) : raw.split('\n').map((s) => s.trim()).filter(Boolean);
        break;
      case 'stats':
        record.stats = raw.split('\n').map((s) => s.trim()).filter(Boolean).map((s) => {
          const [label, ...rest] = s.split('=');
          return { label: (label || '').trim(), value: rest.join('=').trim() };
        }).filter((s) => s.label && s.value);
        break;
      case 'sections': {
        const sections = raw.split(/^\s*---\s*$/m).map((block) => {
          const linesArr = block.split('\n').map((s) => s.trim()).filter(Boolean);
          if (linesArr.length === 0) return null;
          const heading = linesArr.length > 1 ? linesArr[0] : '';
          const paragraphs = linesArr.length > 1 ? linesArr.slice(1) : linesArr;
          return { heading, paragraphs };
        }).filter(Boolean);
        record.sections = sections;
        break;
      }
      case 'date':
        record[field.key] = raw || new Date().toISOString().slice(0, 10);
        break;
      case 'select':
        record[field.key] = raw || (field.key === 'status' ? 'draft' : field.options?.[0]);
        break;
      default:
        record[field.key] = raw;
    }
  }
  // slug safety: default from title
  if (!record.slug && typeof record.title === 'string' && record.title) {
    record.slug = record.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  return record;
}
