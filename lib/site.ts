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
  url: process.env.BASE_URL || 'http://localhost:3000',
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

// Primary navigation — single source of truth for the site's route map.
export const navLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Industries', href: '/industries' },
  { label: 'Process', href: '/process' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
];

export const servicesMenu = [
  { label: 'AI Automation', href: '/services/ai-automation', note: 'Remove repetitive work' },
  { label: 'AI Agents', href: '/services/ai-agents', note: 'Voice, support, sales & internal agents' },
  { label: 'Custom Software', href: '/services/software', note: 'Platforms, tools, SaaS, dashboards' },
  { label: 'Web & Mobile', href: '/services/web-mobile', note: 'Websites, web apps, mobile apps' },
  { label: 'AI Product Development', href: '/services/ai-products', note: 'Idea to production AI product' },
  { label: 'System Integration', href: '/services/integration', note: 'Connected systems, one source of truth' },
];
