import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from '../config/site';

const ADMIN_TITLE = `Admin — ${SITE_NAME}`;

const TITLES = {
  admin: ADMIN_TITLE,
  forgotPassword: `Forgot Password — ${SITE_NAME}`,
  resetPassword: `Reset Password — ${SITE_NAME}`,
};

function setMetaTag(attr, key, content) {
  if (!content) return;

  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export default function usePageTitle() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (location.pathname === '/admin/forgot-password') {
      document.title = TITLES.forgotPassword;
      setMetaTag('name', 'robots', 'noindex, nofollow');
      return;
    }

    if (location.pathname === '/admin/reset-password') {
      document.title = TITLES.resetPassword;
      setMetaTag('name', 'robots', 'noindex, nofollow');
      return;
    }

    document.title = isAdmin ? TITLES.admin : SITE_TITLE;

    if (isAdmin) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
      return;
    }

    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large');
    setMetaTag('name', 'description', SITE_DESCRIPTION);
    setMetaTag('name', 'keywords', SITE_KEYWORDS);
    setMetaTag('property', 'og:title', SITE_TITLE);
    setMetaTag('property', 'og:description', SITE_OG_DESCRIPTION);
    setMetaTag('property', 'og:url', `${SITE_URL}/`);
    setMetaTag('name', 'twitter:title', SITE_TITLE);
    setMetaTag('name', 'twitter:description', SITE_OG_DESCRIPTION);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${SITE_URL}/`);
  }, [isAdmin, location.pathname]);
}
