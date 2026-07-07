import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import { showToast } from '../store/toastSlice';
import { useDispatch } from 'react-redux';
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

export default function AdminForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const labelClass =
    'block font-sans font-semibold text-[12px] text-ink3 uppercase tracking-[0.04em] mb-1.5';
  const inputClass =
    'w-full px-3.5 py-2.5 rounded-md bg-white border border-border focus:border-amber focus:ring-2 focus:ring-amber/15 font-sans text-[13px] text-ink placeholder:text-muted outline-none transition-colors duration-150';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSent(true);
      dispatch(showToast(data.message || 'Reset email sent.', 'success'));
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to send reset email.';
      dispatch(showToast(message, 'error', 5000));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-smoke flex items-center justify-center px-4 pt-20 pb-10">
      <div className="bg-white rounded-xl border border-border p-8 w-full max-w-[400px]">
        <div className="text-center mb-6">
          <p className="font-condensed font-extrabold text-[24px]">
            <span className="text-amber">⚡ ADDIS</span>
            <span className="text-ink"> ELECTRIC</span>
          </p>
          <p className="text-muted font-sans font-semibold text-[12px] uppercase tracking-[0.12em] mt-1">
            Forgot Password
          </p>
        </div>

        <div className="current-rule" style={{ margin: '20px 0 24px' }} />

        {sent ? (
          <div className="text-center">
            <p className="text-[13px] text-ink leading-relaxed mb-5">
              If an account exists for this email, a password reset link has been sent. Check your
              inbox and spam folder.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber hover:text-amber2"
            >
              <IconArrowLeft size={16} /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-[13px] text-muted mb-4 leading-relaxed">
              Enter your admin email and we will send you a reset link.
            </p>

            <div className="mb-4">
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-11 text-ink font-condensed font-bold text-[17px] uppercase tracking-[0.05em] rounded-md transition-colors duration-150 flex items-center justify-center ${
                loading ? 'bg-amber/70 cursor-wait' : 'bg-amber hover:bg-amber2'
              }`}
            >
              {loading ? <Spinner /> : 'Send Reset Link'}
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
        )}
      </div>
    </div>
  );
}
