import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconPhone } from '@tabler/icons-react';
import { closeContactModal } from '../store/modalSlice';
import { formatPhoneDisplay } from '../utils/phone';
import ModalShell from './ModalShell';

export default function ContactModal() {
  const dispatch = useDispatch();
  const { open, item } = useSelector((state) => state.modal.contactModal);
  const contactPhones = useSelector((state) => state.controls.contact_phones);
  const [copiedPhone, setCopiedPhone] = useState(null);

  const handleClose = () => {
    dispatch(closeContactModal());
    setCopiedPhone(null);
  };

  const handleCopy = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 2000);
    } catch {
      setCopiedPhone(null);
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

          <div className="px-5 py-6">
            <p className="text-center text-muted text-[13px] mb-4 font-normal">
              Call or WhatsApp us to ask about this product
            </p>
            {contactPhones.length === 0 ? (
              <p className="text-center text-muted text-[13px]">
                No contact numbers available right now.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {contactPhones.map((phone) => (
                <li
                  key={phone}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-smoke"
                >
                  <IconPhone size={20} className="text-[#0056B3] shrink-0" stroke={2} />
                  <a
                    href={`tel:${phone}`}
                    className="flex-1 min-w-0 font-condensed font-bold text-[18px] text-[#0056B3] tracking-wide hover:text-[#004494] transition-colors duration-150"
                  >
                    {formatPhoneDisplay(phone)}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(phone)}
                    className={`shrink-0 px-3 py-1.5 rounded-md border text-[11px] font-semibold transition-colors duration-150 ${
                      copiedPhone === phone
                        ? 'border-success text-success bg-[#E8F5EE]'
                        : 'border-border text-ink hover:border-[#0056B3] hover:text-[#0056B3]'
                    }`}
                  >
                    {copiedPhone === phone ? 'Copied!' : 'Copy'}
                  </button>
                </li>
                ))}
              </ul>
            )}
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
