import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { AppStoreModal } from './AppStoreModal';
import { Language } from '../types';
import { hapticFeedback } from '../utils/haptics';

interface PWAInstallButtonProps {
  lang: Language;
  variant?: 'header' | 'floating' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang,
  variant = 'header',
  className = '',
}) => {
  const { isInstallable, isInstalled, isStandalone, isIOS, canPromptDirectly, install } = usePWAInstall();
  const [showModal, setShowModal] = useState<boolean>(false);

  // If already running as an installed PWA in standalone mode, suppress ambient prompt
  if (isStandalone && variant !== 'header') {
    return null;
  }

  const handleClick = async () => {
    hapticFeedback.medium();
    if (canPromptDirectly) {
      const outcome = await install();
      if (outcome !== 'accepted') {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (variant === 'header') {
    return (
      <>
        <button
          id="header-pwa-install-btn"
          type="button"
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 ${
            isStandalone
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/80 shadow-xs'
          } ${className}`}
          title={isStandalone 
            ? (lang === 'ne' ? 'एप इन्स्टल भइसकेको छ' : 'App Installed') 
            : (lang === 'ne' ? 'शुभ पात्रो एप इन्स्टल गर्नुहोस्' : 'Install Shubha Patro App')}
        >
          {isStandalone ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">{lang === 'ne' ? 'इन्स्टल भयो' : 'Installed'}</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-white" />
              <span>{lang === 'ne' ? 'एप इन्स्टल' : 'Install App'}</span>
            </>
          )}
        </button>

        <AppStoreModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          lang={lang}
        />
      </>
    );
  }

  // Floating or Banner variant
  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-800 text-white px-4 py-2 text-xs font-black shadow-lg hover:shadow-xl transition-all active:scale-95 border border-emerald-400/30 ${className}`}
      >
        <Download className="w-4 h-4 text-emerald-200" />
        <span>{lang === 'ne' ? 'शुभ पात्रो एप डाउनलोड / इन्स्टल गर्नुहोस्' : 'Download / Install Shubha Patro Native App'}</span>
      </button>

      <AppStoreModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        lang={lang}
      />
    </>
  );
};
