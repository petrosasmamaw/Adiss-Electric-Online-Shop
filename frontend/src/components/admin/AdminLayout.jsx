import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IconPackage, IconClipboardList, IconLogout, IconArrowLeft, IconAdjustments } from '@tabler/icons-react';
import { logout } from '../../store/authSlice';
import BrandLogo from '../BrandLogo';
import AdminNotificationBell from './AdminNotificationBell';
import useAdminOrderNotifications from '../../hooks/useAdminOrderNotifications';

const navItems = [
  { to: '/admin/dashboard/control', label: 'Control', Icon: IconAdjustments, end: false },
  { to: '/admin/dashboard', label: 'Items', Icon: IconPackage, end: true },
  { to: '/admin/dashboard/orders', label: 'Orders', Icon: IconClipboardList, end: false },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { unseenCount, unseenOrders, seenOrders } = useAdminOrderNotifications();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-smoke flex">
      <aside className="hidden md:flex w-[240px] shrink-0 sticky top-0 z-40 h-screen bg-white border-r border-border flex-col">
        <div className="px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <BrandLogo small />
              <p className="text-muted text-[10px] uppercase tracking-wide mt-0.5">Admin</p>
            </div>
            <AdminNotificationBell
              unseenCount={unseenCount}
              unseenOrders={unseenOrders}
              seenOrders={seenOrders}
            />
          </div>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto min-h-0">
          <p className="px-5 pt-4 pb-1 text-muted text-[10px] font-bold uppercase tracking-[0.1em]">
            Manage
          </p>
          {navItems.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-4 py-2.5 mx-2 my-0.5 rounded-lg font-sans font-semibold text-[13px] flex items-center gap-2.5 transition-colors duration-150 ${
                  isActive
                    ? 'bg-amber-tint text-ink border-l-[3px] border-amber rounded-l-none rounded-r-lg pl-[calc(1rem-3px)]'
                    : 'text-muted hover:bg-smoke hover:text-ink'
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 mt-2 pt-2 border-t border-border px-2 pb-3 space-y-1">
          <Link
            to="/"
            className="px-4 py-2.5 mx-2 rounded-lg font-sans font-semibold text-[13px] flex items-center gap-2.5 text-muted border border-border hover:border-ink hover:text-ink hover:bg-smoke transition-colors duration-150"
          >
            <IconArrowLeft size={16} /> Back to Shop
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-[calc(100%-1rem)] mx-2 px-4 py-2.5 rounded-lg font-sans font-semibold text-[13px] flex items-center gap-2.5 text-danger hover:bg-[#FDEAEA] transition-colors duration-150 text-left"
          >
            <IconLogout size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-10 flex items-center justify-between gap-3 h-[52px] px-4 bg-white border-b border-border">
          <BrandLogo small />
          <AdminNotificationBell
            unseenCount={unseenCount}
            unseenOrders={unseenOrders}
            seenOrders={seenOrders}
          />
        </header>

        <main className="flex-1 bg-smoke p-4 md:p-6 overflow-auto pb-[118px] md:pb-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border">
        <nav className="flex h-[52px]">
          {navItems.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex-1 flex flex-col items-center justify-center gap-0.5 border-t-2 transition-colors duration-150 ${
                  isActive ? 'border-amber text-ink' : 'border-transparent text-muted'
                }`
              }
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold">{label}</span>
              {label === 'Orders' && unseenCount > 0 && (
                <span className="absolute top-1 right-[calc(50%-22px)] min-w-[16px] h-4 px-1 rounded-full bg-amber text-white text-[9px] font-bold flex items-center justify-center">
                  {unseenCount > 9 ? '9+' : unseenCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex gap-2 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t border-border/60">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-10 rounded-md border border-border text-muted hover:text-ink hover:border-ink text-[11px] font-semibold transition-colors duration-150"
          >
            <IconArrowLeft size={15} /> Back to Shop
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-10 rounded-md text-danger hover:bg-[#FDEAEA] text-[11px] font-semibold transition-colors duration-150"
          >
            <IconLogout size={15} /> Logout
          </button>
        </div>
      </footer>
    </div>
  );
}
