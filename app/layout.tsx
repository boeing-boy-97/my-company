import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactTracker from '@/components/layout/ContactTracker';
import Cursor from '@/components/layout/Cursor';
import RouteFx from '@/components/layout/RouteFx';
import Consultant from '@/components/layout/Consultant';
import { site } from '@/lib/site';
import { orgJsonLd, websiteJsonLd } from '@/lib/seo';
import { buildSearchIndex } from '@/lib/search-index';
import GlobalSearch from '@/components/layout/GlobalSearch';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import MotionCursor from '@/components/motion/Cursor';
import RouteCue from '@/components/motion/RouteCue';
import CursorTrail from '@/components/motion/CursorTrail';
import ScrollProgress from '@/components/motion/ScrollProgress';
import HoverPreview from '@/components/motion/HoverPreview';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Inter_Tight({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const viewport: Viewport = {
  themeColor: '#F7F5F1',
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Technology for ambitious businesses`,
    template: `%s — ${site.name}`,
  },
  description:
    'We design, build and automate digital systems that help businesses move faster — from AI agents and workflow automation to custom software and complete digital products.',
  openGraph: {
    siteName: site.name,
    images: [{ url: `${site.url}/og.jpg`, width: 1200, height: 630 }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const searchIndex = await buildSearchIndex();
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal,.mask-line>span{opacity:1!important;transform:none!important}.reveal-wipe{clip-path:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
        <AnnouncementBar />
        <MotionCursor />
        <CursorTrail />
        <ScrollProgress />
        <HoverPreview />
        <RouteCue />
        <Header />
        <RouteFx>{children}</RouteFx>
        <ContactTracker />
        <GlobalSearch index={searchIndex} />
        <Footer />
        <Consultant />
        <Cursor />
      </body>
    </html>
  );
}
