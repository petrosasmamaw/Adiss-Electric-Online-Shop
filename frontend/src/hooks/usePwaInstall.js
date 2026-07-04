import { useCallback, useEffect, useState } from 'react';

function isStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function isIosDevice() {
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
}

export default function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(isStandaloneMode());
  const [isIos] = useState(isIosDevice);

  useEffect(() => {
    if (isStandaloneMode()) {
      setIsInstalled(true);
    }

    const onBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const onDisplayModeChange = () => {
      setIsInstalled(isStandaloneMode());
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', onDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', onDisplayModeChange);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return 'manual';

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      return 'accepted';
    }

    return 'dismissed';
  }, [deferredPrompt]);

  const showInstallButton = !isInstalled;
  const canNativeInstall = Boolean(deferredPrompt);

  return { showInstallButton, canNativeInstall, isInstalled, isIos, install };
};
