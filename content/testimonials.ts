// ============================================================
// CMS CONTENT — Testimonials. RULE: only `published: true`
// entries render on the site. Records below are structural
// placeholders — replace with real, permissioned quotes.
// Until then the site shows an honest "references on request"
// state instead of fabricated praise.
// ============================================================

export interface Testimonial {
  quote: string;
  person: string;
  role: string;
  company: string;
  published: boolean;
}

export const testimonials: Testimonial[] = [
  { quote: '', person: '', role: '', company: '', published: false },
  { quote: '', person: '', role: '', company: '', published: false },
  { quote: '', person: '', role: '', company: '', published: false },
];

export const publishedTestimonials = testimonials.filter((t) => t.published && t.quote.trim().length > 0);
