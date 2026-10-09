import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  Laptop
} from 'lucide-react';
import { Language } from '../types';

interface EmailServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  email?: string;
  defaultSubject?: string;
}

export const EmailServerModal: React.FC<EmailServerModalProps> = ({
  isOpen,
  onClose,
  lang,
  email = 'info@shubhapatro.com',
  defaultSubject = 'Inquiry to Shubha Patro'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedSubject = encodeURIComponent(defaultSubject);
  const encodedEmail = encodeURIComponent(email);

  const emailProviders = [
    {
      name: 'Gmail',
      nepaliName: 'गुगल जिमेल (Gmail Web)',
      desc: lang === 'ne' ? 'ब्राउजरमै जिमेल खोलेर सिधै इमेल पठाउनुहोस्' : 'Directly compose in Gmail web in your browser',
      url: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${encodedSubject}`,
      iconBg: 'bg-red-500/10 text-red-500 border-red-500/20',
      tag: 'Google Workspace',
      recommended: true
    },
    {
      name: 'Outlook / Hotmail',
      nepaliName: 'माइक्रोसफ्ट आउटलुक (Outlook Web)',
      desc: lang === 'ne' ? 'माइक्रोसफ्ट आउटलुक वेब सर्भरमा सिधै खोल्नुहोस्' : 'Directly compose in Outlook / Office 365 web',
      url: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedEmail}&subject=${encodedSubject}`,
      iconBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      tag: 'Microsoft 365'
    },
    {
      name: 'Yahoo Mail',
      nepaliName: 'याहू मेल (Yahoo Web)',
      desc: lang === 'ne' ? 'याहू मेल वेब सर्भरमा सिधै खोल्नुहोस्' : 'Directly compose in Yahoo webmail',
      url: `https://compose.mail.yahoo.com/?to=${encodedEmail}&subj=${encodedSubject}`,
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      tag: 'Yahoo Webmail'
    },
    {
      name: lang === 'ne' ? 'कम्प्युटर वा फोनको मेल एप' : 'Default Mail Client',
      nepaliName: 'डिफल्ट इमेल एप (Default App)',
      desc: lang === 'ne' ? 'यन्त्रमा पहिलेदेखि इन्स्टल भएको सफ्टवेयर (Apple Mail, Windows Mail)' : 'Installed system client (Apple Mail, Outlook desktop)',
      url: `mailto:${email}?subject=${encodedSubject}`,
      iconBg: 'bg-stone-700/50 text-stone-300 border-stone-600/30',
      tag: 'System Mailto'
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-stone-900 border border-stone-700 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {lang === 'ne' ? 'इमेल सेवा छान्नुहोस्' : 'Direct to Your Email Server'}
            </h3>
            <p className="text-xs text-stone-400">
              {lang === 'ne' 
                ? 'आफ्नो रोजाइको इमेल सर्भरबाट सिधै सन्देश पठाउनुहोस्' 
                : 'Select your preferred email provider to compose directly'}
            </p>
          </div>
        </div>

        {/* Email Address Bar with Copy Action */}
        <div className="bg-stone-800/90 border border-stone-700/80 rounded-xl p-3 flex items-center justify-between gap-2 mb-4">
          <div className="min-w-0">
            <span className="text-[10px] text-stone-400 block font-medium uppercase tracking-wider">
              {lang === 'ne' ? 'प्रापक (Recipient):' : 'Recipient Address:'}
            </span>
            <span className="text-sm font-bold text-amber-300 font-mono truncate block">
              {email}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200" />
                <span>{lang === 'ne' ? 'कपी भयो!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? 'कपी' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>

        {/* Server Options */}
        <div className="space-y-2 mb-4">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
            {lang === 'ne' ? 'वेब इमेल सर्भरहरू (Direct Webmail):' : 'Choose Your Email Provider:'}
          </span>

          {emailProviders.map((provider) => (
            <a
              key={provider.name}
              href={provider.url}
              target={provider.name.includes('Default') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl bg-stone-800/50 hover:bg-stone-800 border border-stone-700/70 hover:border-amber-400/50 transition-all group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold text-sm shrink-0 ${provider.iconBg}`}>
                  {provider.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {provider.name}
                    </span>
                    {provider.recommended && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-medium">
                        {lang === 'ne' ? 'सिफारिस' : 'Recommended'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 truncate">
                    {provider.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-stone-400 group-hover:text-amber-400 shrink-0 ml-2">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <span>Shubha Patro (shubhapatro.com)</span>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-300 hover:text-white underline cursor-pointer"
          >
            {lang === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
