import { site } from './site';
import { getSettings } from './store';

/** Site contact values with admin-settings overrides applied. */
export async function getSiteContact() {
  const s = await getSettings();
  return {
    email: s.contactEmail?.trim() || site.contact.email,
    phone: s.phone?.trim() || site.contact.phone,
    phoneRaw: (s.phone?.trim() || site.contact.phone).replace(/[^\d+]/g, ''),
    whatsapp: s.whatsapp?.trim() || site.contact.whatsapp,
    whatsappRaw: (s.whatsapp?.trim() || site.contact.whatsapp).replace(/[^\d]/g, ''),
    hours: s.hours?.trim() || site.contact.hours,
  };
}
