import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import {
  DEFAULT_SITE_URL,
  GOOGLE_SITE_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_IMAGE_PATH,
  SITE_OG_DESCRIPTION,
  SITE_SHORT_NAME,
  SITE_TITLE,
  buildStructuredData,
} from './seo.config.mjs';

function seoHtmlPlugin(siteUrl) {
  const structuredDataJson = JSON.stringify(buildStructuredData(siteUrl));
  const siteOgImage = `${siteUrl}${SITE_OG_IMAGE_PATH}`;

  return {
    name: 'html-seo-inject',
    transformIndexHtml(html) {
      return html
        .replaceAll('%%SITE_TITLE%%', SITE_TITLE)
        .replaceAll('%%SITE_DESCRIPTION%%', SITE_DESCRIPTION)
        .replaceAll('%%SITE_OG_DESCRIPTION%%', SITE_OG_DESCRIPTION)
        .replaceAll('%%SITE_KEYWORDS%%', SITE_KEYWORDS)
        .replaceAll('%%SITE_NAME%%', SITE_NAME)
        .replaceAll('%%SITE_URL%%', siteUrl)
        .replaceAll('%%SITE_OG_IMAGE%%', siteOgImage)
        .replaceAll('%%GOOGLE_SITE_VERIFICATION%%', GOOGLE_SITE_VERIFICATION)
        .replace('%%STRUCTURED_DATA_JSON%%', structuredDataJson);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');

  return {
    plugins: [
      seoHtmlPlugin(siteUrl),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: [
          'card.jpg',
          'whitelogo.png',
          'favicon-32x32.png',
          'favicon-48x48.png',
          'favicon-192x192.png',
          'robots.txt',
          'sitemap.xml',
          'googlef09ba43e106a21ff.html',
          'pwa/apple-touch-icon.png',
        ],
        manifest: {
          name: SITE_NAME,
          short_name: SITE_SHORT_NAME,
          description: SITE_OG_DESCRIPTION,
          theme_color: '#0F172A',
          background_color: '#F4F7FF',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: 'pwa/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'pwa/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'pwa/pwa-512x512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,woff,woff2}'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api/],
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith('/api'),
              handler: 'NetworkOnly',
            },
            {
              urlPattern: /\/api\/.*/i,
              handler: 'NetworkOnly',
            },
            {
              urlPattern: ({ url }) =>
                url.hostname.includes('onrender.com') && url.pathname.startsWith('/api'),
              handler: 'NetworkOnly',
            },
            {
              urlPattern: ({ url }) =>
                url.hostname === 'localhost' && url.pathname.startsWith('/api'),
              handler: 'NetworkOnly',
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
  };
});
