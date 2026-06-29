import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITLES = {
  storefront: 'Addis Electric — Ethiopian Electrical Supplier',
  admin: 'Admin — Addis Electric',
};

export default function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      document.title = TITLES.admin;
    } else {
      document.title = TITLES.storefront;
    }
  }, [location.pathname]);
}
