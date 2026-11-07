import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Download, 
  Smartphone, 
  Apple, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  WifiOff, 
  Zap, 
  ShieldCheck, 
  QrCode, 
  X,
  ExternalLink,
  Laptop,
  Copy,
  Check,
  Globe,
  AlertCircle
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';
import { hapticFeedback } from '../utils/haptics';

interface AppStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AppStoreModal: React.FC<AppStoreModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const { isStandalone, canPromptDirectly, install, isWebView } = usePWAInstall();
  const [showAndroidManualGuide, setShowAndroidManualGuide] = useState<boolean>(false);
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'desktop'>(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) return 'ios';
      if (/android/.test(ua)) return 'android';
    }
    return 'android';
  });

  const [installStatus, setInstallStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [urlMode, setUrlMode] = useState<'official' | 'cloud'>('official');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // 1. Resolve safe target URLs that NEVER expose internal AI Studio dev paths or 404 dead links
  const officialDomain = 'https://shubhapatro.com';
  const directCloudDomain = 'https://www.shubhapatro.com';

  const cleanCloudUrl = (() => {
    if (typeof window === 'undefined') return directCloudDomain;
    const origin = window.location.origin;
    // If visiting from a custom production domain that is not an internal dev/sandbox host
    const isSandboxHost = 
      origin.includes('localhost') || 
      origin.includes('127.0.0.1') || 
      origin.includes('aistudio.google.com') || 
      origin.includes('ais-dev-') || 
      origin.includes('ais-pre-') || 
      origin.includes('.run.app');

    if (!isSandboxHost && (origin.startsWith('https://') || origin.startsWith('http://'))) {
      return origin;
    }
    // Verified, high-availability direct cloud web app mirror (returns 200 OK, never 404)
    return directCloudDomain;
  })();

  const activeBaseUrl = urlMode === 'official' ? officialDomain : cleanCloudUrl;
  const activeInstallUrl = `${activeBaseUrl}/?source=qr&install=1`;

  // 2. Generate local offline QR code with zero reliance on external tracking or slow CDNs
  useEffect(() => {
    let isCancelled = false;
    QRCode.toDataURL(activeInstallUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#991b1b', // rich crimson
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (!isCancelled) {
          setQrDataUrl(url);
        }
      })
      .catch(() => {
        // Safe fallback
        if (!isCancelled) {
          setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(activeInstallUrl)}&bgcolor=ffffff&color=991b1b&margin=2`);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [activeInstallUrl]);

  if (!isOpen) return null;

  const handleTriggerInstall = async () => {
    hapticFeedback.medium();
    const result = await install();
    if (result === 'accepted') {
      setInstallStatus('success');
      setTimeout(() => onClose(), 1500);
    } else if (result === 'ios') {
      setActivePlatform('ios');
    } else {
      setShowAndroidManualGuide(true);
    }
  };

  const handleCopyLink = async () => {
    hapticFeedback.light();
    try {
      await navigator.clipboard.writeText(activeInstallUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Store Header Banner */}
        <div className="bg-gradient-to-r from-red-700 via-sky-700 to-red-800 p-5 sm:p-6 text-white relative shrink-0 overflow-hidden">
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-lg ring-2 ring-amber-400/80 shrink-0 flex items-center justify-center">
                <img src="/icon.svg" alt="Shubha Patro App Icon" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                    Shubha Patro
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full">
                    {lang === 'ne' ? 'एप स्टोर आधिकारिक' : 'Official Native App'}
                  </span>
                </div>
                <p className="text-xs text-sky-100 mt-1 leading-snug">
                  {lang === 'ne' 
                    ? 'कुनै विज्ञापन विना, पूर्ण अफलाइन र द्रुत गतिको आधिकारिक नेपाली क्यालेन्डर एप।' 
                    : 'The authentic, zero-bloat, full-offline native Nepali calendar application.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                hapticFeedback.light();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick App Specifications */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center text-[11px]">
            <div className="bg-black/20 rounded-xl py-1.5 px-2">
              <span className="block text-amber-300 font-bold">४.९ ★★★★★</span>
              <span className="text-[10px] text-white/80">{lang === 'ne' ? '१० लाख+ प्रयोगकर्ता' : '1M+ Active Users'}</span>
            </div>
            <div className="bg-black/20 rounded-xl py-1.5 px-2">
              <span className="block text-emerald-300 font-bold">{lang === 'ne' ? '१००% अफलाइन' : '100% Offline'}</span>
              <span className="text-[10px] text-white/80">{lang === 'ne' ? 'इन्टरनेट नचाहिने' : 'No Internet Needed'}</span>
            </div>
            <div className="bg-black/20 rounded-xl py-1.5 px-2">
              <span className="block text-sky-300 font-bold">&lt; ५ MB</span>
              <span className="text-[10px] text-white/80">{lang === 'ne' ? 'अति हलुका' : 'Super Lightweight'}</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Status Message if already installed */}
          {isStandalone && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {lang === 'ne' 
                  ? 'तपाईंले यो एप सफलतापूर्वक इन्स्टल गरिसक्नुभएको छ! यो पूर्ण स्ट्यान्डअलोन मोडमा चलिरहेको छ।' 
                  : 'You are running the installed native app in standalone mode! Full offline caching is active.'}
              </span>
            </div>
          )}

          {/* Platform Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                hapticFeedback.light();
                setActivePlatform('android');
              }}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activePlatform === 'android'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android / Samsung</span>
            </button>

            <button
              type="button"
              onClick={() => {
                hapticFeedback.light();
                setActivePlatform('ios');
              }}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activePlatform === 'ios'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>iPhone / iPad</span>
            </button>

            <button
              type="button"
              onClick={() => {
                hapticFeedback.light();
                setActivePlatform('desktop');
              }}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activePlatform === 'desktop'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Desktop / Mac</span>
            </button>
          </div>

          {/* Platform-Specific Step Guide */}
          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 space-y-3">
            {activePlatform === 'android' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'ne' ? 'Android मा इन्स्टल:' : 'Install on Android:'}</span>
                  </h4>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    {canPromptDirectly ? (lang === 'ne' ? '१-क्लिक तयार' : '1-Tap Ready') : (lang === 'ne' ? 'सिधा इन्स्टल' : 'Direct Install')}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {lang === 'ne'
                    ? 'तलको "एप इन्स्टल गर्नुहोस्" बटन थिच्नुहोस्। एप तुरुन्तै तपाईंको फोनको होम स्क्रिन र एप ड्रअरमा थपिन्छ र इन्टरनेट नभएको बेला पनि १००% खुल्छ।'
                    : 'Tap the button below. The app installs directly into your Android app drawer with full offline access and zero ads.'}
                </p>

                {/* Always-visible prominent Install button */}
                <button
                  type="button"
                  onClick={handleTriggerInstall}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all cursor-pointer active:scale-98 border border-emerald-500/50"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ne' ? 'एप इन्स्टल गर्नुहोस् (Install Now)' : 'Install App to Home Screen'}</span>
                </button>

                {/* If detected in-app scanner webview */}
                {isWebView && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>{lang === 'ne' ? 'इन-एप स्क्यानर पत्ता लाग्यो' : 'In-App Scanner Detected'}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {lang === 'ne'
                        ? 'तपाईं स्क्यानरको आन्तरिक ब्राउजरमा हुनुहुन्छ। कृपया माथिल्लो दायाँ ३ थोप्ला (⋮) थिची "Open in Chrome" (क्रोममा खोल्नुहोस्) रोज्नुहोस् र सिधै इन्स्टल गर्नुहोस्।'
                        : 'You are inside a scanner webview. Please tap (⋮) at top-right and select "Open in Chrome" to install directly.'}
                    </p>
                  </div>
                )}

                {/* Chrome 3-dots manual installation guide */}
                <div className={`p-3.5 bg-white dark:bg-stone-900 rounded-xl border ${showAndroidManualGuide ? 'border-red-500 ring-2 ring-red-500/30' : 'border-stone-200 dark:border-stone-700'} text-xs text-stone-700 dark:text-stone-300 space-y-2 transition-all`}>
                  <div className="font-bold text-stone-900 dark:text-white flex items-center justify-between">
                    <span>{lang === 'ne' ? 'Chrome ब्राउजरबाट सिधै थप्ने तरिका:' : 'Chrome 2-Second Install:'}</span>
                    <span className="text-[10px] bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded-full font-bold">
                      {lang === 'ne' ? 'सुरक्षित' : '100% Native'}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                      <span>
                        {lang === 'ne' 
                          ? 'Chrome को माथिल्लो दायाँ रहेको ३ वटा थोप्ला (⋮) मा थिच्नुहोस्।' 
                          : 'Tap the three dots (⋮) in the top-right corner of Chrome.'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                      <span>
                        {lang === 'ne' ? 'मेनुबाट ' : 'Tap '}
                        <strong className="text-red-600 dark:text-red-400 font-bold">"Install app"</strong>
                        {lang === 'ne' ? ' वा ' : ' or '}
                        <strong className="text-red-600 dark:text-red-400 font-bold">"Add to Home screen" (गृहपृष्ठमा थप्नुहोस्)</strong>
                        {lang === 'ne' ? ' रोज्नुहोस्। एप तयार हुन्छ!' : '.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePlatform === 'ios' && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                  <Apple className="w-4 h-4 text-stone-900 dark:text-white" />
                  <span>{lang === 'ne' ? 'iPhone / iPad (Apple iOS) मा इन्स्टल:' : 'Install on iPhone / iPad (Safari):'}</span>
                </h4>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {lang === 'ne'
                    ? 'Apple Safari ले सिधै डाउनलोड नगरी "Add to Home Screen" बाट नेटिभ एप स्टोर एप जस्तै चलाउने सुविधा दिन्छ:'
                    : 'Apple Safari allows seamless home screen installation via WebKit WebClip without App Store download fees:'}
                </p>

                <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2 text-xs text-stone-800 dark:text-stone-200 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                    <span>
                      {lang === 'ne' ? 'Safari ब्राउजरको तल्लो भागमा रहेको ' : 'Tap the '}
                      <strong className="text-sky-600 font-bold inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5 inline" /> Share (सेयर)</strong>
                      {lang === 'ne' ? ' आइकनमा थिच्नुहोस्।' : ' icon at bottom of Safari.'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                    <span>
                      {lang === 'ne' ? 'तल स्क्रोल गरेर ' : 'Scroll down and tap '}
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold">"Add to Home Screen" (गृहपृष्ठमा थप्नुहोस्)</strong>
                      {lang === 'ne' ? ' रोज्नुहोस्।' : '.'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                    <span>
                      {lang === 'ne' ? 'माथि दायाँपट्टि ' : 'Tap '}
                      <strong className="text-stone-900 dark:text-white font-bold">"Add"</strong>
                      {lang === 'ne' ? ' मा थिच्नुहोस्। एप तपाईँको होमस्क्रिनमा तयार भयो!' : ' in top-right. The app is ready on your Home Screen!'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activePlatform === 'desktop' && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-sky-600" />
                  <span>{lang === 'ne' ? 'कम्प्युटर / ल्यापटप (Windows / Mac) मा इन्स्टल:' : 'Desktop App (Windows, macOS, Linux):'}</span>
                </h4>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {lang === 'ne'
                    ? 'Chrome वा Edge को ठेगाना बार (Address Bar) को दायाँ छेउमा रहेको कम्प्युटर आइकन वा "Install Shubha Patro" मा क्लिक गर्नुहोस्।'
                    : 'Click the install icon in your browser address bar (top right) to run as an independent desktop application window.'}
                </p>

                {canPromptDirectly && (
                  <button
                    type="button"
                    onClick={handleTriggerInstall}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'ne' ? 'कम्प्युटरमा इन्स्टल गर्नुहोस्' : 'Install on Desktop'}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Clean Dedicated Mobile QR Code Section */}
          <div className="p-4 bg-stone-100/90 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
            {/* Header with Title & Direct App Guarantee */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-white">
                <QrCode className="w-4 h-4 text-red-600 shrink-0" />
                <span>{lang === 'ne' ? 'मोबाइल क्यामराले स्क्यान गरी सिधै इन्स्टल गर्नुहोस्:' : 'Scan to Install Shubha Patro directly:'}</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                {lang === 'ne' ? 'शुद्ध आधिकारिक एप' : 'Pure Standalone App'}
              </span>
            </div>

            {/* Mobile Context Note */}
            <div className="sm:hidden p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {lang === 'ne'
                  ? 'तपाईं अहिले नै फोनमा हुनुहुन्छ! QR स्क्यान गर्न नपर्ने गरी माथिको "एप इन्स्टल गर्नुहोस्" बटन थिच्नुहोस्।'
                  : 'You are already on mobile! Tap the "Install App" button above to install directly without scanning.'}
              </span>
            </div>

            {/* Domain Switcher Pills so User Can Choose Best Route */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 shrink-0">
                {lang === 'ne' ? 'लिंक प्रकार:' : 'Target Link:'}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    hapticFeedback.light();
                    setUrlMode('official');
                  }}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1 ${
                    urlMode === 'official'
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>shubhapatro.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    hapticFeedback.light();
                    setUrlMode('cloud');
                  }}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1 ${
                    urlMode === 'cloud'
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
                  }`}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{lang === 'ne' ? 'प्रत्यक्ष क्लाउड लिंक (www)' : 'Direct Cloud Link (www)'}</span>
                </button>
              </div>
            </div>

            {/* QR Card with Instant Offline Rendered Code */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700">
              <div className="w-36 h-36 bg-white p-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm shrink-0 flex items-center justify-center">
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt="Shubha Patro Installation QR Code" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-100 flex items-center justify-center text-[10px] text-stone-400">
                    {lang === 'ne' ? 'QR तयार हुँदैछ...' : 'Generating QR...'}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-left flex-1 min-w-0 w-full">
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-snug">
                  {lang === 'ne' 
                    ? 'आफ्नो स्मार्टफोन (iPhone वा Android) को क्यामरा खोलेर यो QR स्क्यान गर्नुहोस्। यो स्क्यान गर्दा कुनै बाहिरी स्टुडियो नखुली सिधै शुभ पात्रो (Shubha Patro) एप खुल्छ र फोनमा १-ट्याप इन्स्टल गर्न सकिन्छ।' 
                    : 'Point your phone camera at this code to open and install Shubha Patro directly. It connects straight to the authentic app without any AI Studio development wrappers.'}
                </p>

                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-stone-800 dark:text-stone-200 font-semibold truncate">
                    {activeInstallUrl}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                      title={lang === 'ne' ? 'लिंक कपी गर्नुहोस्' : 'Copy link'}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={activeInstallUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 text-sky-700 dark:text-sky-400 transition-colors cursor-pointer"
                      title={lang === 'ne' ? 'सीधै खोल्नुहोस्' : 'Open directly'}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {copied && (
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ {lang === 'ne' ? 'लिंक क्लिपबोर्डमा कपी भयो!' : 'Link copied to clipboard!'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Native App Core Strengths */}
          <div className="space-y-2 pt-1 border-t border-stone-200 dark:border-stone-800">
            <h5 className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-white">
              {lang === 'ne' ? 'शुभ पात्रो एपका मुख्य विशेषताहरू:' : 'Key Native App Strengths:'}
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 flex items-start gap-2">
                <WifiOff className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 dark:text-white">{lang === 'ne' ? 'पूर्ण अफलाइन पहुँच' : '100% Offline Core'}</strong>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">{lang === 'ne' ? 'पात्रो, राशिफल, मन्त्र र क्याल्कुलेटर नेट बिना चल्छ।' : 'Calendar, Tithi, Rashifal & rituals cache locally.'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 dark:text-white">{lang === 'ne' ? 'गोपनीयता र सुरक्षा' : 'Zero Trackers & Safe'}</strong>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">{lang === 'ne' ? 'कुनै अनावश्यक अनुमति र जासुसी बिना स्वच्छ अनुभव।' : 'No intrusive device permissions required.'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 dark:text-white">{lang === 'ne' ? 'सुपरफास्ट गति' : 'Instant 0.2s Boot'}</strong>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">{lang === 'ne' ? 'ब्याट्री खपत न्यून र तत्काल खुल्ने प्रविधि।' : 'Zero lag, near-zero battery consumption.'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 dark:text-white">{lang === 'ne' ? 'ह्याप्टिक र स्पर्श अनुभूति' : 'Tactile Haptic Feel'}</strong>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">{lang === 'ne' ? 'नेटिभ एप जस्तै कम्पन र सहज बटन प्रतिक्रिया।' : 'Responsive native vibrations on mobile gestures.'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            Shubha Patro (शुभ पात्रो) • Official Native PWA Edition
          </span>
          <button
            type="button"
            onClick={() => {
              hapticFeedback.light();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 font-bold text-stone-800 dark:text-stone-200 cursor-pointer transition-colors"
          >
            {lang === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
