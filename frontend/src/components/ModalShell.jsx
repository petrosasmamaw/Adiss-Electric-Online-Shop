import { useEffect, useState } from 'react';

export default function ModalShell({
  isOpen,
  onClose,
  children,
  maxWidthClass = 'md:max-w-[420px]',
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end justify-center p-0 md:items-center md:p-4 transition-opacity duration-200 ease-out ${
        visible ? 'opacity-100' : 'opacity-0 duration-150'
      }`}
      onClick={handleClose}
      role="presentation"
    >
      <div className="absolute inset-0 bg-black/65" aria-hidden="true" />
      <div
        className={`relative z-10 w-full max-w-none fixed bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto md:static md:bottom-auto md:left-auto md:right-auto ${maxWidthClass} md:max-h-none md:overflow-visible transition-all ease-out ${
          visible
            ? 'opacity-100 translate-y-0 md:scale-100 duration-300 md:duration-200'
            : 'opacity-0 translate-y-full md:translate-y-0 md:scale-[0.97] duration-200 md:duration-150'
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children({ onClose: handleClose })}
      </div>
    </div>
  );
}
