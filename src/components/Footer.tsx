import React from 'react';
import { Calendar, Heart, Compass, Shield, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-700 text-white flex items-center justify-center font-extrabold shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">हाम्रो पात्रो (Hamro Patro)</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              {lang === 'ne'
                ? 'नेपाली क्यालेन्डर (बिक्रम संवत्), दैनिक वैदिक राशिफल, ज्योतिष परामर्श, ताजा नेपाली समाचार र विदेशी मुद्रा विनिमय दरको भरपर्दो डिजिटल सेवा।'
                : 'Your trusted Nepali digital companion for Bikram Sambat calendar, Panchanga, Vedic horoscopes, live news and currency rates.'}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold pt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'नेपालको सांस्कृतिक र सामाजिक पञ्चाङ्ग' : 'Nepali Cultural & Social Calendar'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {lang === 'ne' ? 'द्रुत सेवाहरू' : 'Quick Features'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('weather')} className="hover:text-amber-300 transition-colors cursor-pointer text-sky-400 font-medium flex items-center gap-1">
                  <span>{lang === 'ne' ? '• मौसम पूर्वानुमान (नेपालका शहरहरू)' : '• Weather Forecast (Nepal Cities)'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('worldclock')} className="hover:text-amber-300 transition-colors cursor-pointer text-amber-300/90 font-medium flex items-center gap-1">
                  <span>{lang === 'ne' ? '• विश्व घडी (नेपाल समय NPT)' : '• World Clock (Nepal Time NPT)'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('health')} className="hover:text-amber-300 transition-colors cursor-pointer text-rose-400 font-medium flex items-center gap-1">
                  <span>{lang === 'ne' ? '• स्वास्थ्य तथा कल्याण (योग र ऋतुचर्या)' : '• Health & Wellness (Yoga & Ritucharya)'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('games')} className="hover:text-amber-300 transition-colors cursor-pointer text-amber-300 font-semibold flex items-center gap-1">
                  <span>{lang === 'ne' ? '• सुडोकू र खेल केन्द्र (Sudoku & Mind Games)' : '• Sudoku & Activity Games Centre'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calendar')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {lang === 'ne' ? '• नेपाली पात्रो र पञ्चाङ्ग' : '• Nepali Calendar & Panchanga'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {lang === 'ne' ? '• क्याल्कुलेटर र साइन्टिफिक' : '• Standard & Scientific Calculator'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('converter')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {lang === 'ne' ? '• नाप, जग्गा र मिति रूपान्तरण' : '• Measurement & Date Converter'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('language')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {lang === 'ne' ? '• नेपाली-अंग्रेजी भाषा सिकाई' : '• Language Learning Hub'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('govhelp')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {lang === 'ne' ? '• सरकारी सेवा र आपतकालीन हटलाइन' : '• Government Portals & Emergency'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('forex')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {lang === 'ne' ? '• विनिमय दर र सुनको मूल्य' : '• Forex Rates & Bullion'}
                </button>
              </li>
            </ul>
          </div>

          {/* Info & Disclaimer */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {lang === 'ne' ? 'पञ्चाङ्ग जानकारी' : 'Panchanga Reference'}
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed mb-3">
              {lang === 'ne'
                ? 'नेपाल पञ्चाङ्ग निर्णायक विकास समिति द्वारा स्वीकृत मान र वैदिक सूर्यसिद्धान्त अनुसार गणना गरिएको।'
                : 'Computed in accordance with traditional Vedic Surya Siddhanta and Nepal Panchanga authorities.'}
            </p>
            <span className="inline-block text-[10px] bg-stone-800 text-stone-300 px-2.5 py-1 rounded-lg border border-stone-700">
              Version 2.0 • BS 2081-2084
            </span>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Hamro Patro. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Nepal & the Global Nepali Diaspora</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
