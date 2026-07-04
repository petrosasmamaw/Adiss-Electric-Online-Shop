import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconMenu2, IconX, IconHome, IconLock, IconArrowLeft, IconDownload } from '@tabler/icons-react';
import BrandLogo from './BrandLogo';
import usePwaInstall from '../hooks/usePwaInstall';

const actionButtonClass =
  'inline-flex items-center gap-1.5 bg-transparent border border-border text-muted hover:border-ink hover:text-ink px-4 py-1.5 rounded-md text-xs font-semibold transition-colors duration-150';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');
  const { canInstall, install } = usePwaInstall();

  const handleInstall = async () => {
    await install();
    closeDrawer();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-10 h-14 bg-white border-b border-border px-4 md:px-6 flex items-center justify-between">
        <BrandLogo />

        <div className="hidden md:flex items-center gap-2">
          {canInstall && (
            <button type="button" onClick={install} className={actionButtonClass}>
              <IconDownload size={15} />
              INSTALL APP
            </button>
          )}
          {isAdminArea ? (
            <Link to="/" className={actionButtonClass}>
              <IconArrowLeft size={15} /> BACK TO SHOP
            </Link>
          ) : (
            <Link to="/admin/login" className={actionButtonClass}>
              ADMIN
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="md:hidden w-11 h-11 -mr-2 flex items-center justify-center rounded-md text-ink hover:bg-smoke transition-colors duration-150"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
        >
          <IconMenu2 size={22} />
        </button>
      </nav>

      <div className="md:hidden">
        <div
          className={`fixed inset-0 z-[49] bg-black/40 transition-opacity duration-[250ms] ease-out ${
            drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeDrawer}
          aria-hidden="true"
        />
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-full h-screen bg-white flex flex-col transform transition-transform duration-[250ms] ease-out ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="h-14 flex items-center justify-between px-4 border-b border-border">
            <BrandLogo small />
            <button
              type="button"
              onClick={closeDrawer}
              className="w-11 h-11 -mr-2 flex items-center justify-center rounded-md text-muted hover:bg-smoke transition-colors duration-150"
              aria-label="Close menu"
            >
              <IconX size={22} />
            </button>
          </div>

          <nav className="flex flex-col">
            <Link
              to="/"
              onClick={closeDrawer}
              className="h-12 flex items-center gap-2.5 px-4 font-sans text-base font-semibold text-ink border-b border-border hover:bg-smoke transition-colors duration-150"
            >
              <IconHome size={18} /> Shop
            </Link>
            {canInstall && (
              <button
                type="button"
                onClick={handleInstall}
                className="h-12 flex items-center gap-2.5 px-4 font-sans text-base font-semibold text-ink border-b border-border hover:bg-smoke transition-colors duration-150 text-left"
              >
                <IconDownload size={18} /> Install App
              </button>
            )}
            <Link
              to="/admin/login"
              onClick={closeDrawer}
              className="h-12 flex items-center gap-2.5 px-4 font-sans text-base font-semibold text-amber border-b border-border hover:bg-smoke transition-colors duration-150"
            >
              <IconLock size={18} /> Admin
            </Link>
          </nav>
        </aside>
      </div>
    </>
  );
}
