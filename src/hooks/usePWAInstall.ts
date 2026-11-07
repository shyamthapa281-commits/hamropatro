import { useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && (window as unknown as { __deferredInstallPrompt?: BeforeInstallPromptEvent }).__deferredInstallPrompt) {
      return (window as unknown as { __deferredInstallPrompt: BeforeInstallPromptEvent }).__deferredInstallPrompt;
    }
    return null;
  });
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isFromQRScan, setIsFromQRScan] = useState<boolean>(false);
  const [isWebView, setIsWebView] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 0. Detect if arrived via QR code scan or install link
    const params = new URLSearchParams(window.location.search);
    if (params.get('install') === '1' || params.get('source') === 'qr' || params.get('source') === 'pwa_qr') {
      setIsFromQRScan(true);
    }

    // 1. Detect standalone mode (already installed as PWA or launched from homescreen)
    const checkStandalone = () => {
      const isDisplayStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const runningStandalone = isDisplayStandalone || isIOSStandalone;
      setIsStandalone(runningStandalone);
      setIsInstalled(runningStandalone);
    };

    checkStandalone();

    // 2. Detect iOS devices and In-App WebViews
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    const isInternalWebView = /wv|fbav|fban|instagram|line|micromessenger|tiktok|snapchat|gsa/i.test(userAgent);
    setIsWebView(isInternalWebView);

    // Check if early captured prompt exists
    const win = window as unknown as { __deferredInstallPrompt?: BeforeInstallPromptEvent };
    if (win.__deferredInstallPrompt) {
      setDeferredPrompt(win.__deferredInstallPrompt);
    }

    // 3. Listen to beforeinstallprompt event for Android, Chrome, Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      win.__deferredInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handlePromptReady = () => {
      if (win.__deferredInstallPrompt) {
        setDeferredPrompt(win.__deferredInstallPrompt);
      }
    };

    // 4. Listen to appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      win.__deferredInstallPrompt = undefined;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-prompt-ready', handlePromptReady);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-prompt-ready', handlePromptReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Trigger installation prompt
  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | 'ios' | 'unavailable'> => {
    if (isIOS) {
      return 'ios';
    }

    const activePrompt = deferredPrompt || (typeof window !== 'undefined' ? (window as unknown as { __deferredInstallPrompt?: BeforeInstallPromptEvent }).__deferredInstallPrompt : null);

    if (!activePrompt) {
      return 'unavailable';
    }

    try {
      await activePrompt.prompt();
      const { outcome } = await activePrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        if (typeof window !== 'undefined') {
          (window as unknown as { __deferredInstallPrompt?: undefined }).__deferredInstallPrompt = undefined;
        }
        return 'accepted';
      }
      return 'dismissed';
    } catch (err) {
      console.error('PWA install prompt error:', err);
      return 'unavailable';
    }
  }, [deferredPrompt, isIOS]);

  return {
    isInstallable: !!deferredPrompt || (isIOS && !isStandalone) || !isStandalone,
    isInstalled,
    isStandalone,
    isIOS,
    isFromQRScan,
    isWebView,
    canPromptDirectly: !!deferredPrompt || (typeof window !== 'undefined' && !!(window as unknown as { __deferredInstallPrompt?: BeforeInstallPromptEvent }).__deferredInstallPrompt),
    install,
  };
}
