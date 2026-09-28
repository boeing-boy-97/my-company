import type { Metadata } from 'next';
import { site } from './site';

type PageSeo = {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  publishedTime?: string;
};

export function pageSeo({ title, description, path, type = 'website', publishedTime }: PageSeo): Metadata {
  const url = `${site.url}${path}`;
  const fullTitle = title.includes(site.name) ? title : `${title} — ${site.name}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      type,
      images: [{ url: `${site.url}/og.jpg`, width: 1200, height: 630, alt: site.name }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`${site.url}/og.jpg`],
    },
  };
}

export function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    url: site.url,
    logo: `${site.url}/favicon.svg`,
    description: site.tagline,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: 'IN',
    },
    sameAs: site.socials.map((s) => s.url),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: { '@type': 'Organization', name: site.legalName, url: site.url },
    areaServed: 'Worldwide',
    url: `${site.url}${path}`,
  };
}
