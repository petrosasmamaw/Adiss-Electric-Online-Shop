import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconPhone } from '@tabler/icons-react';
import { closeContactModal } from '../store/modalSlice';
import ModalShell from './ModalShell';

const CONTACT_PHONE =
  import.meta.env.VITE_CONTACT_PHONE || '+251 91 000 0000';

export default function ContactModal() {
  const dispatch = useDispatch();
  const { open, item } = useSelector((state) => state.modal.contactModal);
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    dispatch(closeContactModal());
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_PHONE.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <ModalShell isOpen={open} onClose={handleClose}>
      {({ onClose }) => (
        <div className="bg-white rounded-t-[20px] md:rounded-xl border border-border overflow-hidden">
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 rounded-full bg-border" />
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-condensed font-bold text-[20px] text-ink pr-4 leading-tight">
              {item?.name}
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

          <div className="px-5 py-6 text-center">
            <IconPhone size={28} className="text-amber mx-auto" />
            <p className="font-condensed font-extrabold text-[32px] text-amber tracking-wide mt-2">
              {CONTACT_PHONE}
            </p>
            <p className="text-muted text-[13px] mt-1 font-normal">
              Call or WhatsApp us to ask about this product
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className={`mt-4 px-5 py-2 rounded-md border bg-transparent text-[13px] font-semibold transition-colors duration-150 ${
                copied
                  ? 'border-success text-success bg-[#E8F5EE]'
                  : 'border-border text-ink hover:border-ink'
              }`}
            >
              {copied ? 'Copied!' : 'Copy Number'}
            </button>
          </div>

          <div className="px-5 py-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-10 bg-smoke text-ink font-semibold text-sm rounded-md hover:bg-border transition-colors duration-150"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
