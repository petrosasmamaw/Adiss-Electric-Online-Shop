import { useDispatch, useSelector } from 'react-redux';
import { IconCircleCheck, IconAlertCircle, IconBolt, IconX } from '@tabler/icons-react';
import { removeToast } from '../store/toastSlice';

const variants = {
  success: { border: 'border-l-success', icon: IconCircleCheck, color: 'text-success' },
  error: { border: 'border-l-danger', icon: IconAlertCircle, color: 'text-danger' },
  info: { border: 'border-l-amber', icon: IconBolt, color: 'text-amber' },
};

function resolveVariant(type) {
  if (type === 'success') return variants.success;
  if (type === 'error') return variants.error;
  return variants.info;
}

export default function ToastContainer() {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.toast.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed z-[60] flex flex-col gap-2 pointer-events-none bottom-5 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-5">
      {toasts.map((toast) => {
        const v = resolveVariant(toast.type);
        const Icon = v.icon;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-ink rounded-xl px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-[340px] border-l-[3px] border-transparent toast-enter ${v.border}`}
            role="alert"
          >
            <Icon size={18} className={`shrink-0 ${v.color}`} aria-hidden="true" />
            <span className="font-sans font-medium text-[13px] text-white flex-1">
              {toast.message}
            </span>
            <button
              type="button"
              onClick={() => dispatch(removeToast(toast.id))}
              className="ml-1 text-muted hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss"
            >
              <IconX size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
