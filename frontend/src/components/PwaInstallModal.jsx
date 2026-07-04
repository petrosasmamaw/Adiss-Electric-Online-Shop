import ModalShell from './ModalShell';

export default function PwaInstallModal({ isOpen, onClose, isIos }) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose}>
      {({ onClose: close }) => (
        <div className="bg-white rounded-t-[20px] md:rounded-xl border border-border overflow-hidden max-w-md mx-auto">
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 rounded-full bg-border" />
          </div>
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-condensed font-bold text-[20px] text-ink">Install Addis Electric</h2>
            <p className="text-muted text-[13px] mt-1">
              Add the app to your home screen for quick access.
            </p>
          </div>

          <div className="px-5 py-5 space-y-3 text-[13px] text-ink leading-relaxed">
            {isIos ? (
              <>
                <p className="font-semibold">On iPhone / iPad (Safari):</p>
                <ol className="list-decimal list-inside space-y-2 text-muted">
                  <li>Tap the <strong className="text-ink">Share</strong> button at the bottom of Safari</li>
                  <li>Scroll and tap <strong className="text-ink">Add to Home Screen</strong></li>
                  <li>Tap <strong className="text-ink">Add</strong> in the top right</li>
                </ol>
              </>
            ) : (
              <>
                <p className="font-semibold">On Chrome or Edge (desktop / Android):</p>
                <ol className="list-decimal list-inside space-y-2 text-muted">
                  <li>Look for the <strong className="text-ink">install</strong> icon in the address bar, or</li>
                  <li>Open the browser menu (⋮) and choose <strong className="text-ink">Install app</strong> / <strong className="text-ink">Add to Home screen</strong></li>
                </ol>
                <p className="text-muted text-[12px] pt-1">
                  Tip: Install works best over HTTPS after the site has loaded once.
                </p>
              </>
            )}
          </div>

          <div className="px-5 py-4 border-t border-border">
            <button
              type="button"
              onClick={close}
              className="w-full h-10 bg-smoke text-ink font-semibold text-sm rounded-md hover:bg-border transition-colors duration-150"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
