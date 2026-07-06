import {
  DEFAULT_SITE_URL,
  GOOGLE_SITE_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_DESCRIPTION,
  SITE_SHORT_NAME,
  SITE_TITLE,
  buildStructuredData,
} from '../../seo.config.mjs';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
export const SITE_IMAGE = `${SITE_URL}/pwa/pwa-512x512.png`;

export {
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_OG_DESCRIPTION,
  SITE_KEYWORDS,
  GOOGLE_SITE_VERIFICATION,
  buildStructuredData,
};
