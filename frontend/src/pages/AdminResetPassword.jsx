import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IconArrowLeft, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/toastSlice';
import api from '../api/axiosConfig';

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

export default function AdminResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const labelClass =
    'block font-sans font-semibold text-[12px] text-ink3 uppercase tracking-[0.04em] mb-1.5';
  const inputClass =
    'w-full px-3.5 py-2.5 rounded-md bg-white border border-border focus:border-amber focus:ring-2 focus:ring-amber/15 font-sans text-[13px] text-ink placeholder:text-muted outline-none transition-colors duration-150';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      dispatch(showToast('Password must be at least 8 characters.', 'error', 5000));
      return;
    }

    if (password !== confirmPassword) {
      dispatch(showToast('Passwords do not match.', 'error', 5000));
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/reset-password', { token, password });
      dispatch(showToast(data.message || 'Password updated.', 'success'));
      navigate('/admin/login');
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to reset password.';
      dispatch(showToast(message, 'error', 5000));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-smoke flex items-center justify-center px-4 pt-20 pb-10">
        <div className="bg-white rounded-xl border border-border p-8 w-full max-w-[400px] text-center">
          <p className="text-[13px] text-danger font-medium mb-4">
            Invalid reset link. Request a new password reset email.
          </p>
          <Link
            to="/admin/forgot-password"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber hover:text-amber2"
          >
            Request reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-smoke flex items-center justify-center px-4 pt-20 pb-10">
      <div className="bg-white rounded-xl border border-border p-8 w-full max-w-[400px]">
        <div className="text-center mb-6">
          <p className="font-condensed font-extrabold text-[24px]">
            <span className="text-amber">⚡ ADDIS</span>
            <span className="text-ink"> ELECTRIC</span>
          </p>
          <p className="text-muted font-sans font-semibold text-[12px] uppercase tracking-[0.12em] mt-1">
            Reset Password
          </p>
        </div>

        <div className="current-rule" style={{ margin: '20px 0 24px' }} />

        <form onSubmit={handleSubmit}>
          <div className="mb-3.5">
            <label className={labelClass}>New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
                autoComplete="new-password"
                minLength={8}
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

          <div className="mb-4">
            <label className={labelClass}>Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-11 text-ink font-condensed font-bold text-[17px] uppercase tracking-[0.05em] rounded-md transition-colors duration-150 flex items-center justify-center ${
              loading ? 'bg-amber/70 cursor-wait' : 'bg-amber hover:bg-amber2'
            }`}
          >
            {loading ? <Spinner /> : 'Update Password'}
          </button>

          <div className="mt-4 text-center">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink"
            >
              <IconArrowLeft size={16} /> Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
