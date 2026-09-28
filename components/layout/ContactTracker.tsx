'use client';
// Delegated click tracker for WhatsApp + email links (analytics events only).
import { useEffect } from 'react';
import { trackAction } from '@/lib/actions';

export default function ContactTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      const href = a?.getAttribute('href') || '';
      if (href.startsWith('https://wa.me/')) void trackAction('whatsapp_clicked');
      else if (href.startsWith('mailto:')) void trackAction('email_clicked');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
