import { useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export default function PwaUpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const updateRef = useRef(null);

  useEffect(() => {
    updateRef.current = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true);
      },
    });
  }, []);

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[60] bg-white border border-border rounded-xl shadow-dropdown p-4">
      <p className="font-sans font-semibold text-[13px] text-ink">Update available</p>
      <p className="text-muted text-[12px] mt-1">
        A new version of Addis Electric is ready. Refresh to get the latest changes.
      </p>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => updateRef.current?.(true)}
          className="flex-1 h-9 rounded-md bg-amber text-ink text-[12px] font-bold uppercase tracking-[0.03em] hover:bg-amber2 transition-colors"
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="flex-1 h-9 rounded-md border border-border text-muted text-[12px] font-semibold hover:border-ink hover:text-ink transition-colors"
        >
          Later
        </button>
      </div>
    </div>
  );
}
