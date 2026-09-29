import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: 'Kiln',
    description: 'Technology studio for ambitious businesses — AI automation, agents, custom software and system integration.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F5F1',
    theme_color: '#F7F5F1',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
