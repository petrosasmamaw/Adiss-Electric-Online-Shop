import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IconPackage, IconClipboardList, IconLogout, IconArrowLeft } from '@tabler/icons-react';
import { logout } from '../../store/authSlice';

const navItems = [
  { to: '/admin/dashboard', label: 'Items', Icon: IconPackage, end: true },
  { to: '/admin/dashboard/orders', label: 'Orders', Icon: IconClipboardList, end: false },
];

function Logo({ size = 18 }) {
  return (
    <span className="font-condensed font-extrabold tracking-[0.02em]" style={{ fontSize: size }}>
      <span className="text-amber">⚡ ADDIS</span>
      <span className="text-ink"> ELECTRIC</span>
    </span>
  );
}

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-smoke flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[240px] min-h-screen bg-white border-r border-border flex-col">
        <div className="px-5 py-4 border-b border-border">
          <Logo size={18} />
          <p className="text-muted text-[10px] uppercase tracking-wide mt-0.5">Admin</p>
        </div>

        <nav className="flex-1 py-2">
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

        <div className="px-2 pb-2">
          <Link
            to="/"
            className="px-4 py-2.5 mx-2 rounded-lg font-sans font-semibold text-[13px] flex items-center gap-2.5 text-muted border border-border hover:border-ink hover:text-ink hover:bg-smoke transition-colors duration-150"
          >
            <IconArrowLeft size={16} /> Back to Shop
          </Link>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mx-2 mb-3 px-4 py-2.5 rounded-lg font-sans font-semibold text-[13px] flex items-center gap-2.5 text-danger hover:bg-[#FDEAEA] transition-colors duration-150 text-left"
        >
          <IconLogout size={16} /> Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-10 flex items-center justify-between h-[52px] px-4 bg-white border-b border-border">
          <Logo size={16} />
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-muted hover:text-ink text-[11px] font-semibold uppercase tracking-[0.04em] border border-border px-3 py-1.5 rounded-md transition-colors duration-150"
          >
            <IconArrowLeft size={14} /> Shop
          </Link>
        </header>

        <main className="flex-1 bg-smoke p-4 md:p-6 overflow-auto pb-[76px] md:pb-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-border z-40 flex">
        {navItems.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 border-t-2 transition-colors duration-150 ${
                isActive ? 'border-amber text-ink' : 'border-transparent text-muted'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-semibold">{label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 border-t-2 border-transparent text-danger"
        >
          <IconLogout size={20} />
          <span className="text-[10px] font-semibold">Logout</span>
        </button>
      </nav>
    </div>
  );
}
