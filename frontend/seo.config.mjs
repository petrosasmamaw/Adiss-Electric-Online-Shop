export const SITE_NAME = 'Addis Electric Shop';
export const SITE_SHORT_NAME = 'Addis Electric';

export const SITE_ALTERNATE_NAMES = [
  'Adiss Electric',
  'Addis Electric',
  'Addis Electric Shop',
  'Adiss Electric Shop Online',
  'Addis Electric Shop Online',
  'Addis Electric Online',
  'Adiss Electric Online',
  'Addis Electric Ethiopia',
  'Adiss Electric Ethiopia',
];

export const SITE_KEYWORDS = [
  'adiss electric',
  'adiss electric shop',
  'addis electric',
  'addis electric shop',
  'addis electric shop online',
  'adiss electric shop online',
  'addis electric online',
  'adiss electric online',
  'electrical supplier ethiopia',
  'electrical shop ethiopia',
  'electrical products ethiopia',
  'cables switches bulbs ethiopia',
  'addiselectricshop.online',
].join(', ');

export const SITE_TITLE =
  'Addis Electric Shop | Addis Electric Online — Electrical Supplier Ethiopia';

export const SITE_DESCRIPTION =
  'Addis Electric Shop — Addis Electric Shop Online in Ethiopia. Your trusted electrical supplier for cables, switches, bulbs and quality products for home and business. Shop Addis Electric and Adiss Electric online.';

export const SITE_OG_DESCRIPTION =
  'Addis Electric & Adiss Electric Shop Online — trusted electrical supplier in Ethiopia. Cables, switches, bulbs and more.';

export const DEFAULT_SITE_URL = 'https://addiselectricshop.online';

export const GOOGLE_SITE_VERIFICATION = 'googlef09ba43e106a21ff';

export function buildStructuredData(siteUrl) {
  const image = `${siteUrl}/pwa/pwa-512x512.png`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      description: SITE_DESCRIPTION,
      url: `${siteUrl}/`,
      image,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ET',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      url: `${siteUrl}/`,
      description: SITE_DESCRIPTION,
      inLanguage: 'en-ET',
    },
  ];
}
