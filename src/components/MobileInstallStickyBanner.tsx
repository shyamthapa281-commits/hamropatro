import React, { useState } from 'react';
import { Download, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';
import { hapticFeedback } from '../utils/haptics';

interface MobileInstallStickyBannerProps {
  lang: Language;
  onOpenModal: () => void;
}

export const MobileInstallStickyBanner: React.FC<MobileInstallStickyBannerProps> = ({
  lang,
  onOpenModal,
}) => {
  const { isStandalone, canPromptDirectly, install, isIOS } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [installing, setInstalling] = useState<boolean>(false);
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);

  // If already installed or explicitly dismissed, do not render
  if (isStandalone || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    hapticFeedback.medium();
    if (isIOS) {
      onOpenModal();
      return;
    }

    if (canPromptDirectly) {
      setInstalling(true);
      try {
        const outcome = await install();
        if (outcome === 'accepted') {
          setInstalledSuccess(true);
          setTimeout(() => setDismissed(true), 2500);
        } else if (outcome !== 'dismissed') {
          onOpenModal();
        }
      } catch {
        onOpenModal();
      } finally {
        setInstalling(false);
      }
    } else {
      // If prompt not yet captured or inside webview, open modal with direct guidance
      onOpenModal();
    }
  };

  return (
    <aside
      aria-label="App installation banner"
      className="fixed bottom-[64px] sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 animate-in slide-in-from-bottom duration-300"
    >
      <div className="bg-stone-900/95 dark:bg-stone-950/95 text-white p-3 rounded-2xl shadow-2xl border border-red-500/40 backdrop-blur-md flex items-center justify-between gap-3 ring-1 ring-black/20">
        {/* App Icon & Details */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-white p-1.5 shadow-md ring-2 ring-red-500/60 shrink-0 flex items-center justify-center">
            <img src="/icon.svg" alt="Shubha Patro" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-black text-sm text-white tracking-tight leading-tight truncate">
                {lang === 'ne' ? 'शुभ पात्रो एप' : 'Shubha Patro App'}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-stone-950 px-1.5 py-0.2 rounded-md">
                {lang === 'ne' ? 'निःशुल्क' : 'Free'}
              </span>
            </div>
            <p className="text-[11px] text-stone-300 truncate mt-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
              <span>
                {lang === 'ne' 
                  ? '१-क्लिकमा फोनमा इन्स्टल (१००% अफलाइन)' 
                  : '1-Tap phone install • 100% Offline'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {installedSuccess ? (
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold px-2 py-1 bg-emerald-950/50 rounded-xl border border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'ne' ? 'इन्स्टल भयो!' : 'Installed!'}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={installing}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-red-900/40 cursor-pointer transition-all border border-red-400/40 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 animate-bounce" />
              <span>{lang === 'ne' ? 'इन्स्टल गर्नुहोस्' : 'Install App'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              hapticFeedback.light();
              setDismissed(true);
            }}
            className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
