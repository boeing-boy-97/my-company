// ============================================================
// SITE CONFIGURATION — single source of truth for brand data.
// Change the company name / contact details here and everywhere
// on the site updates.
// ============================================================

export const site = {
  name: 'Kiln',
  /** Editable status line shown in the footer — set false when fully booked. */
  acceptingProjects: true,
  /** Micro announcement shown above the header. Empty string hides it. */
  announcement: 'Independent technology studio · India → Worldwide',
  legalName: 'Kiln Technology Studio',
  descriptor: 'Technology Studio',
  tagline: 'Bring us the problem. We’ll build the technology.',
  altTagline: 'From idea to production.',
  url:
    process.env.BASE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'),
  location: { city: 'Nagpur', region: 'Maharashtra', country: 'India' },
  contact: {
    email: 'hello@kiln.studio',
    phone: '+91 98765 43210',
    phoneRaw: '+919876543210',
    whatsapp: '+91 98765 43210',
    whatsappRaw: '919876543210',
    hours: 'Monday – Saturday, 10:00 – 19:00 IST',
  },
  // Only list socials you actually use — the footer hides empty ones.
  socials: [
    { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/your-company' },
    { id: 'github', label: 'GitHub', url: 'https://github.com/your-company' },
    { id: 'x', label: 'X', url: 'https://x.com/your-company' },
  ],
  regions: [
    { name: 'North America', tz: 'America/New_York', city: 'New York' },
    { name: 'Europe', tz: 'Europe/London', city: 'London' },
    { name: 'Middle East', tz: 'Asia/Dubai', city: 'Dubai' },
    { name: 'India HQ', tz: 'Asia/Kolkata', city: 'Nagpur' },
    { name: 'Southeast Asia', tz: 'Asia/Singapore', city: 'Singapore' },
    { name: 'Australia', tz: 'Australia/Sydney', city: 'Sydney' },
  ],
  currencies: ['USD', 'INR', 'EUR', 'GBP', 'AED'] as const,
};

// ------------------------------------------------------------
// Placeholder detection. Until the values above are replaced
// with real company data, the site must not present fake phone
// numbers or dead social links as if they were real. Anything
// matching these patterns is treated as "not configured yet"
// and the corresponding UI is hidden (not rendered with an X).
// ------------------------------------------------------------
const PLACEHOLDER_PATTERNS = [
  '9876543210',
  '98765 43210',
  'your-company',
  'example.com',
  'johndoe',
  'janedoe',
  'acme',
];

/** True when a config value looks like a real, human-entered value. */
export function isConfigured(value: string | undefined | null): boolean {
  if (!value) return false;
  const v = value.toLowerCase().replace(/\s+/g, '');
  return v.length > 0 && !PLACEHOLDER_PATTERNS.some((p) => v.includes(p.replace(/\s+/g, '')));
}

/** Contact channels safe to show publicly right now. */
export const hasRealPhone = isConfigured(site.contact.phoneRaw);
export const hasRealWhatsapp = isConfigured(site.contact.whatsappRaw);
export const publicSocials = site.socials.filter((s) => isConfigured(s.url));

// Primary navigation — single source of truth for the site's route map.
export const navLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Approach', href: '/approach' },
  { label: 'Industries', href: '/industries' },
  { label: 'Studio', href: '/studio' },
  { label: 'Insights', href: '/insights' },
];

export const servicesMenu = [
  { num: '01', label: 'AI Automation', href: '/services/ai-automation', note: 'Remove repetitive work' },
  { num: '02', label: 'AI Agents', href: '/services/ai-agents', note: 'Voice, support, sales & internal agents' },
  { num: '03', label: 'Custom Software', href: '/services/custom-software', note: 'Platforms, tools, SaaS, dashboards' },
  { num: '04', label: 'Web & Mobile', href: '/services/web-mobile', note: 'Websites, web apps, mobile apps' },
  { num: '05', label: 'AI Product Development', href: '/services/ai-products', note: 'Idea to production AI product' },
  { num: '06', label: 'System Integration', href: '/services/system-integration', note: 'Connected systems, one source of truth' },
];
