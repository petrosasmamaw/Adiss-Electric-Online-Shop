import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconBell, IconEye, IconEyeOff } from '@tabler/icons-react';
import { setAdminToken } from '../store/authSlice';
import { showToast } from '../store/toastSlice';
import api from '../api/axiosConfig';
import {
  enableOrderNotifications,
  isNotificationSupported,
} from '../utils/browserNotifications';

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 mx-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(setAdminToken(data.data.token));

      if (enableNotifications && isNotificationSupported()) {
        const result = await enableOrderNotifications({ requestIfNeeded: true });
        if (result.permission === 'granted' && result.push) {
          dispatch(showToast('Order notifications enabled for web and PWA.', 'success'));
        } else if (result.permission === 'granted') {
          dispatch(showToast('Order notifications enabled.', 'success'));
        } else if (result.permission === 'denied') {
          dispatch(showToast('Notifications blocked in browser settings.', 'info', 4000));
        }
      }

      navigate('/admin/dashboard');
    } catch {
      setError(true);
      dispatch(showToast('Invalid credentials', 'error', 5000));
    } finally {
      setLoading(false);
    }
  };

  const labelClass =
    'block font-sans font-semibold text-[12px] text-ink3 uppercase tracking-[0.04em] mb-1.5';
  const inputClass =
    'w-full px-3.5 py-2.5 rounded-md bg-white border border-border focus:border-amber focus:ring-2 focus:ring-amber/15 font-sans text-[13px] text-ink placeholder:text-muted outline-none transition-colors duration-150';

  return (
    <div className="min-h-screen bg-smoke flex items-center justify-center px-4 pt-20 pb-10">
      <div className="bg-white rounded-xl border border-border p-8 w-full max-w-[400px]">
        <div className="text-center mb-6">
          <p className="font-condensed font-extrabold text-[24px]">
            <span className="text-amber">⚡ ADDIS</span>
            <span className="text-ink"> ELECTRIC</span>
          </p>
          <p className="text-muted font-sans font-semibold text-[12px] uppercase tracking-[0.12em] mt-1">
            Admin
          </p>
        </div>

        <div className="current-rule" style={{ margin: '20px 0 24px' }} />

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-3 px-4 py-3 rounded-md bg-[#FDEAEA] border border-danger/20 text-danger text-[13px] font-medium text-center">
              Invalid credentials
            </div>
          )}

          <div className="mb-3.5">
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-3.5">
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors duration-150"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <div className="mb-1 text-right">
            <Link
              to="/admin/forgot-password"
              className="text-[12px] font-semibold text-amber hover:text-amber2"
            >
              Forgot password?
            </Link>
          </div>

          {isNotificationSupported() && (
            <label className="mt-4 mb-1 flex items-start gap-3 p-3 rounded-lg border border-border bg-smoke/70 cursor-pointer">
              <input
                type="checkbox"
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="mt-0.5 accent-amber"
              />
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  <IconBell size={16} className="text-amber" />
                  Enable order notifications
                </span>
                <span className="block text-[11px] text-muted mt-1 leading-relaxed">
                  Get instant alerts in the browser and installed PWA, even when the app is in the background.
                </span>
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-11 mt-5 text-ink font-condensed font-bold text-[17px] uppercase tracking-[0.05em] rounded-md transition-colors duration-150 flex items-center justify-center ${
              loading ? 'bg-amber/70 cursor-wait' : 'bg-amber hover:bg-amber2'
            }`}
          >
            {loading ? <Spinner /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
