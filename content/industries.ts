// ============================================================
// CMS CONTENT — Industries. Edit freely.
// ============================================================

export interface Industry {
  slug: string;
  name: string;
  tagline: string;
  problems: string[];
  solutions: string[];
  systems: string[];
}

export const industries: Industry[] = [
  { slug: 'healthcare', name: 'Healthcare', tagline: 'Clinics, practices and care teams drowning in admin.', problems: ['Appointment booking consumes front-desk hours', 'Patient enquiries go unanswered after hours', 'Records spread across tools and paper'], solutions: ['AI receptionist & appointment agents', 'Enquiry automation across channels', 'Secure internal tools & dashboards'], systems: ['Booking systems', 'Patient communication', 'Document handling'] },
  { slug: 'education', name: 'Education', tagline: 'Institutions modernizing admissions and operations.', problems: ['Admission enquiries handled manually', 'Student support doesn’t scale', 'Internal processes run on spreadsheets'], solutions: ['Admissions enquiry agents', 'Student support automation', 'Operations platforms'], systems: ['Admission pipelines', 'Communication automation', 'Reporting dashboards'] },
  { slug: 'finance', name: 'Finance', tagline: 'Firms that need speed without losing control.', problems: ['Document processing is manual and slow', 'Compliance checks consume skilled staff', 'Client reporting assembled by hand'], solutions: ['Document intelligence pipelines', 'Workflow automation with audit trails', 'Client reporting automation'], systems: ['Document processing', 'KYC assistance', 'Reporting engines'] },
  { slug: 'retail', name: 'Retail', tagline: 'Multi-location retail running on better data.', problems: ['No single view of store performance', 'Stock and sales data in separate systems', 'Repetitive head-office reporting'], solutions: ['Business intelligence dashboards', 'POS & inventory integrations', 'Automated reporting'], systems: ['Operational dashboards', 'Data synchronization', 'Alert systems'] },
  { slug: 'ecommerce', name: 'E-commerce', tagline: 'Brands scaling support and operations.', problems: ['Support volume spikes with growth', 'Order issues handled too slowly', 'Returns and refunds tie up staff'], solutions: ['AI support agents', 'Order & returns automation', 'Channel integrations'], systems: ['Helpdesk automation', 'Order workflows', 'Marketplace integration'] },
  { slug: 'logistics', name: 'Logistics', tagline: 'Movement businesses with information problems.', problems: ['Status enquiries consume coordinators', 'Documents travel slower than cargo', 'Visibility gaps between systems'], solutions: ['AI operations assistants', 'Document automation', 'System integration'], systems: ['Tracking communication', 'Document pipelines', 'TMS integration'] },
  { slug: 'real-estate', name: 'Real Estate', tagline: 'Agencies where response time wins deals.', problems: ['Leads from portals handled too slowly', 'Viewings scheduled with email ping-pong', 'Pipeline invisible to management'], solutions: ['Lead response automation', 'Viewing scheduling agents', 'Pipeline dashboards'], systems: ['Lead pipelines', 'Calendar automation', 'CRM integration'] },
  { slug: 'manufacturing', name: 'Manufacturing', tagline: 'Operations ready for connected systems.', problems: ['Production data trapped in machines and paper', 'Maintenance handled reactively', 'Quoting and orders move slowly'], solutions: ['Data collection & dashboards', 'Maintenance workflow automation', 'Order processing systems'], systems: ['Production dashboards', 'Workflow engines', 'ERP integration'] },
  { slug: 'hospitality', name: 'Hospitality', tagline: 'Guest-facing businesses with back-office drag.', problems: ['Bookings and enquiries across channels', 'Guest questions answered slowly', 'Staff scheduling is manual'], solutions: ['Booking & enquiry automation', 'Guest communication agents', 'Scheduling tools'], systems: ['Channel managers', 'Communication automation', 'Internal tools'] },
  { slug: 'professional-services', name: 'Professional Services', tagline: 'Firms billing hours that shouldn’t be spent on admin.', problems: ['Proposals and documents assembled manually', 'Client updates consume senior time', 'Knowledge lives in people’s heads'], solutions: ['Document automation', 'Client communication workflows', 'Internal knowledge agents'], systems: ['Proposal tools', 'Knowledge systems', 'Practice dashboards'] },
  { slug: 'startups', name: 'Startups', tagline: 'Founders who need a product, not just advice.', problems: ['An idea with no technical path', 'No engineering team in-house', 'Pressure to launch with limited budget'], solutions: ['MVP design & development', 'AI product development', 'Fractional engineering partnership'], systems: ['SaaS platforms', 'Mobile apps', 'AI products'] },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
