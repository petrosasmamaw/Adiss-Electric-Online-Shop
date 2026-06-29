import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { closeOrderModal } from '../store/modalSlice';
import { submitOrder, resetOrderState } from '../store/ordersSlice';
import { showToast } from '../store/toastSlice';
import { formatPrice } from '../utils/formatPrice';
import ModalShell from './ModalShell';

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 mx-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

const initialForm = {
  customerName: '',
  phone: '',
  address: '',
  quantity: 1,
};

export default function OrderModal() {
  const dispatch = useDispatch();
  const { open, item } = useSelector((state) => state.modal.orderModal);
  const { submitting, success, error, lastOrder } = useSelector((state) => state.orders);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setErrors({});
      dispatch(resetOrderState());
      setShowSuccessAnim(false);
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (success) {
      requestAnimationFrame(() => setShowSuccessAnim(true));
      dispatch(showToast('Order placed successfully!', 'success'));
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(showToast(`Error: ${error}`, 'error', 5000));
    }
  }, [error, dispatch]);

  const handleClose = () => {
    dispatch(closeOrderModal());
    dispatch(resetOrderState());
    setForm(initialForm);
    setErrors({});
    setShowSuccessAnim(false);
  };

  const validate = () => {
    const next = {};
    if (!form.customerName.trim()) next.customerName = 'Name is required';
    if (!form.phone.trim()) {
      next.phone = 'Phone number is required';
    } else if (form.phone.replace(/\s/g, '').length !== 10) {
      next.phone = 'Phone must be 10 digits';
    }
    if (!form.address.trim()) next.address = 'Delivery address is required';
    if (!form.quantity || form.quantity < 1) next.quantity = 'Quantity must be at least 1';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || !item) return;

    dispatch(
      submitOrder({
        item_id: item.id,
        customer_name: form.customerName.trim(),
        customer_phone: form.phone.replace(/\s/g, ''),
        customer_address: form.address.trim(),
        quantity: Number(form.quantity),
      })
    );
  };

  const total = item ? parseFloat(item.price) * (Number(form.quantity) || 1) : 0;

  const inputBase =
    'w-full px-3.5 py-2.5 rounded-md bg-white font-sans text-[13px] text-ink placeholder:text-muted outline-none transition-colors duration-150';
  const inputClass = (hasError) =>
    `${inputBase} border ${
      hasError
        ? 'border-danger focus:border-danger'
        : 'border-border focus:border-amber focus:ring-2 focus:ring-amber/15'
    }`;
  const labelClass =
    'block font-sans font-semibold text-[12px] text-ink3 uppercase tracking-[0.04em] mb-1.5';

  return (
    <ModalShell isOpen={open} onClose={handleClose}>
      {({ onClose }) => (
        <div className="bg-white rounded-t-[20px] md:rounded-xl border border-border overflow-hidden">
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 rounded-full bg-border" />
          </div>
          {success && lastOrder ? (
            <div className="text-center py-8 px-5">
              <div
                className={`w-16 h-16 mx-auto rounded-full bg-[#E8F5EE] flex items-center justify-center mb-4 transition-transform duration-300 ease-out delay-100 ${
                  showSuccessAnim ? 'scale-100' : 'scale-0'
                }`}
              >
                <IconCheck size={28} className="text-success" />
              </div>
              <h2 className="font-condensed font-extrabold text-[28px] text-ink mb-4">
                Order Placed!
              </h2>
              <div className="bg-smoke rounded-xl p-4 text-left space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted text-[12px] font-semibold uppercase tracking-wide">
                    Item
                  </span>
                  <span className="text-ink text-[13px] font-medium">{lastOrder.item_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted text-[12px] font-semibold uppercase tracking-wide">
                    Qty
                  </span>
                  <span className="text-ink text-[13px] font-medium">{lastOrder.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted text-[12px] font-semibold uppercase tracking-wide">
                    Total
                  </span>
                  <span className="text-amber text-[13px] font-bold">
                    {formatPrice(lastOrder.total_price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted text-[12px] font-semibold uppercase tracking-wide">
                    Contact
                  </span>
                  <span className="text-ink text-[13px] font-medium">
                    {lastOrder.customer_phone}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full h-10 bg-amber text-ink font-bold rounded-md hover:bg-amber2 transition-colors duration-150"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-condensed font-bold text-[20px] text-ink pr-4 leading-tight">
                  Order — {item?.name}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-smoke hover:bg-border transition-colors duration-150 text-muted text-sm font-bold flex items-center justify-center shrink-0"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {error && (
                <div className="mx-5 mt-4 px-4 py-3 rounded-md bg-[#FDEAEA] border border-danger/20 text-danger text-[13px] font-medium flex items-center gap-2">
                  <IconAlertCircle size={16} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="px-5 py-5">
                <div className="mb-3.5">
                  <label className={labelClass}>Customer Name</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className={inputClass(errors.customerName)}
                  />
                  {errors.customerName && (
                    <p className="text-danger text-[11px] mt-1 font-medium">{errors.customerName}</p>
                  )}
                </div>

                <div className="mb-3.5">
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="09XX XXX XXXX"
                    className={inputClass(errors.phone)}
                  />
                  {errors.phone && (
                    <p className="text-danger text-[11px] mt-1 font-medium">{errors.phone}</p>
                  )}
                </div>

                <div className="mb-3.5">
                  <label className={labelClass}>Delivery Address</label>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={`${inputClass(errors.address)} resize-none`}
                  />
                  {errors.address && (
                    <p className="text-danger text-[11px] mt-1 font-medium">{errors.address}</p>
                  )}
                </div>

                <div className="mb-4 flex items-end justify-between gap-4">
                  <div className="w-24">
                    <label className={labelClass}>Quantity</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      className={inputClass(errors.quantity)}
                    />
                  </div>
                  <p className="font-condensed font-bold text-[18px] text-amber text-right pb-2.5">
                    Total: {formatPrice(total)}
                  </p>
                </div>
                {errors.quantity && (
                  <p className="text-danger text-[11px] -mt-3 mb-3 font-medium">{errors.quantity}</p>
                )}

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="flex-1 h-10 bg-transparent border border-border text-muted text-sm font-semibold rounded-md hover:border-ink hover:text-ink transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 h-10 border-none text-ink text-sm font-bold rounded-md transition-colors duration-150 flex items-center justify-center ${
                      submitting ? 'bg-amber/70 cursor-wait' : 'bg-amber hover:bg-amber2'
                    }`}
                  >
                    {submitting ? <Spinner /> : 'Place Order →'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </ModalShell>
  );
}
