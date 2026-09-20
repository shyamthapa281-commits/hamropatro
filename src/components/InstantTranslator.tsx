import React, { useState, useEffect } from 'react';
import {
  ArrowRightLeft,
  Volume2,
  Copy,
  Check,
  Sparkles,
  Loader2,
  X,
  Clipboard,
  History,
  Trash2,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Globe
} from 'lucide-react';
import { Language } from '../types';
import { translateOffline, TranslationResult } from '../utils/nepaliTranslator';

interface InstantTranslatorProps {
  lang: Language;
}

interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  from: 'ne' | 'en';
  to: 'ne' | 'en';
  timestamp: string;
  provider?: string;
}

const QUICK_TRANSLATE_PRESETS = [
  {
    categoryNe: 'अभिवादन (Greetings)',
    categoryEn: 'Greetings',
    items: [
      { ne: 'नमस्ते, सञ्चै हुनुहुन्छ?', en: 'Hello, how are you?', roman: 'Namaste, sanchai hunuhunchha?' },
      { ne: 'शुभ प्रभात, आजको दिन शुभ रहोस्।', en: 'Good morning, have a great day.', roman: 'Shubha prabhat, aajako din shubha rahos.' },
      { ne: 'तपाईंलाई भेटेर धेरै खुसी लाग्यो।', en: 'It was very nice meeting you.', roman: 'Tapailai bhetera dherai khusi laagyo.' },
      { ne: 'धेरै धेरै धन्यवाद!', en: 'Thank you very much!', roman: 'Dherai dherai dhanyabad!' }
    ]
  },
  {
    categoryNe: 'यात्रा र बाटो (Travel & Directions)',
    categoryEn: 'Travel & Directions',
    items: [
      { ne: 'विमानस्थल कहाँ छ?', en: 'Where is the airport?', roman: 'Bimansthal kaha chha?' },
      { ne: 'बसपार्क जाने बाटो कुन हो?', en: 'Which is the way to the bus park?', roman: 'Bus park jaane baato kun ho?' },
      { ne: 'पोखरा जाने गाडी कति बजे छुट्छ?', en: 'What time does the bus to Pokhara leave?', roman: 'Pokhara jaane gaadi kati baje chhutchha?' },
      { ne: 'नजिकैको होटल कहाँ छ?', en: 'Where is the nearest hotel?', roman: 'Najikaiko hotel kaha chha?' }
    ]
  },
  {
    categoryNe: 'खाना र रेस्टुरेन्ट (Food & Dining)',
    categoryEn: 'Food & Dining',
    items: [
      { ne: 'मलाई एक प्लेट तातो म:म दिनुहोस्।', en: 'Please give me one plate of hot Mo:Mo.', roman: 'Malai ek plate taato Mo:Mo dinuhos.' },
      { ne: 'खाना धेरै मिठो छ!', en: 'The food is very delicious!', roman: 'Khaana dherai mitho chha!' },
      { ne: 'कृपया पिउने पानी दिनुहोस्।', en: 'Please provide drinking water.', roman: 'Kripaya piune paani dinuhos.' },
      { ne: 'बिल ल्याइदिनुहोस् न।', en: 'Please bring the bill.', roman: 'Bill lyaaidinuhos na.' }
    ]
  },
  {
    categoryNe: 'किनमेल र मोलमोलाइ (Shopping & Bargain)',
    categoryEn: 'Shopping & Bargaining',
    items: [
      { ne: 'यसको मूल्य कति पर्छ?', en: 'How much does this cost?', roman: 'Yasko mulya kati parchha?' },
      { ne: 'धेरै महँगो भयो, अलिकति मिलाइदिनुहोस्।', en: 'That is too expensive, please give a little discount.', roman: 'Dherai mahango bhayo, alikati milaaidinuhos.' },
      { ne: 'के तपाईं अनलाइन पेमेन्ट लिनुहुन्छ?', en: 'Do you accept online QR payment?', roman: 'Ke tapai online payment linuhunchha?' }
    ]
  },
  {
    categoryNe: 'सहयोग र आपतकालीन (Help & Emergency)',
    categoryEn: 'Help & Emergency',
    items: [
      { ne: 'कृपया मलाई सहयोग गर्नुहोस्!', en: 'Please help me!', roman: 'Kripaya malai sahyog garnuhos!' },
      { ne: 'डाक्टरलाई तुरुन्तै बोलाउनुहोस्!', en: 'Please call a doctor immediately!', roman: 'Doctor lai turuntai bolaaunuhos!' },
      { ne: 'म बाटो हराएँ, मलाई मद्दत गर्नुहोस्।', en: 'I am lost, please help me.', roman: 'Ma baato haraaye, malai maddat garnuhos.' }
    ]
  }
];

export const InstantTranslator: React.FC<InstantTranslatorProps> = ({ lang }) => {
  const [sourceText, setSourceText] = useState<string>('नमस्ते, सञ्चै हुनुहुन्छ?');
  const [direction, setDirection] = useState<'neToEn' | 'enToNe'>('neToEn');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedPresetTab, setSelectedPresetTab] = useState<number>(0);

  const debounceTimerRef = React.useRef<any>(null);

  // Initialize with default translation
  useEffect(() => {
    handleTranslate('नमस्ते, सञ्चै हुनुहुन्छ?', 'neToEn');
    try {
      const savedHistory = localStorage.getItem('hamro_patro_trans_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn('Could not load translation history');
    }
  }, []);

  const saveToHistory = (item: HistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.sourceText.trim() !== item.sourceText.trim());
      const updated = [item, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('hamro_patro_trans_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('hamro_patro_trans_history');
    } catch (e) {}
  };

  const handleSwapDirection = () => {
    const newDir = direction === 'neToEn' ? 'enToNe' : 'neToEn';
    setDirection(newDir);
    const newSource = result?.translatedText || sourceText;
    setSourceText(newSource);
    handleTranslate(newSource, newDir);
  };

  const handleTranslate = async (
    textToTranslate?: string,
    currentDir?: 'neToEn' | 'enToNe'
  ) => {
    const text = (textToTranslate !== undefined ? textToTranslate : sourceText).trim();
    const dir = currentDir || direction;

    if (!text) {
      setResult(null);
      return;
    }

    const fromLang = dir === 'neToEn' ? 'ne' : 'en';
    const toLang = dir === 'neToEn' ? 'en' : 'ne';

    // Fetch directly from Google Translate / Neural API
    setIsLoading(true);
    try {
      const res = await fetch('/api/translate/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          from: fromLang,
          to: toLang,
        }),
      });
      const data = await res.json();
      if (data.success && data.result && data.result.translatedText) {
        const accurateResult: TranslationResult = {
          translatedText: data.result.translatedText,
          transliteration: data.result.transliteration || '',
          wordBreakdown: data.result.wordBreakdown || [],
          grammarNote: data.result.grammarNote || `Google Translate (${fromLang.toUpperCase()} → ${toLang.toUpperCase()})`,
          exampleUsage: data.result.exampleUsage || `Original: ${text} -> Translated: ${data.result.translatedText}`,
          sourceText: text,
          fromLang,
          toLang,
        };
        setResult(accurateResult);

        // Save to history
        saveToHistory({
          id: Date.now().toString(),
          sourceText: text,
          translatedText: data.result.translatedText,
          from: fromLang,
          to: toLang,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: 'Google Translate',
        });
      } else {
        const fallback = translateOffline(text, fromLang, toLang);
        setResult(fallback);
      }
    } catch (e) {
      const fallback = translateOffline(text, fromLang, toLang);
      setResult(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setSourceText(clipText);
        handleTranslate(clipText, direction);
      }
    } catch (e) {
      console.warn('Clipboard access denied');
    }
  };

  const speakText = (text: string, langCode: 'ne' | 'en') => {
    if (!text) return;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode === 'ne' ? 'ne-NP' : 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const googleTranslateWebUrl = `https://translate.google.com/?sl=${direction === 'neToEn' ? 'ne' : 'en'}&tl=${direction === 'neToEn' ? 'en' : 'ne'}&text=${encodeURIComponent(sourceText)}&op=translate`;

  return (
    <div className="space-y-6">
      {/* Direction & Engine Header Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Languages Switcher */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 ${
              direction === 'neToEn' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-stone-100 text-stone-700'
            }`}>
              <span>🇳🇵</span>
              <span>{lang === 'ne' ? 'नेपाली (Nepali)' : 'Nepali'}</span>
            </div>

            <button
              onClick={handleSwapDirection}
              className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-red-700 border border-stone-300 transition-all cursor-pointer shadow-xs active:scale-95"
              title={lang === 'ne' ? 'भाषा बदल्नुहोस्' : 'Swap languages'}
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <div className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 ${
              direction === 'enToNe' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-stone-100 text-stone-700'
            }`}>
              <span>🇬🇧</span>
              <span>{lang === 'ne' ? 'अंग्रेजी (English)' : 'English'}</span>
            </div>
          </div>

          {/* Engine Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl text-xs font-bold">
            <Globe className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Google Translate Engine</span>
          </div>
        </div>
      </div>

      {/* Dual Translation Workspace Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left: Source Input Box */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col justify-between focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                {direction === 'neToEn' ? '🇳🇵 नेपाली स्रोत पाठ' : '🇬🇧 English Source Text'}
              </span>
              <div className="flex items-center gap-1">
                {sourceText && (
                  <button
                    onClick={() => {
                      setSourceText('');
                      setResult(null);
                    }}
                    className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                    title={lang === 'ne' ? 'सबै मेटाउनुहोस्' : 'Clear text'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handlePaste}
                  className="px-2 py-1 text-stone-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title={lang === 'ne' ? 'टाँस्नुहोस्' : 'Paste clipboard'}
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>{lang === 'ne' ? 'पेस्ट' : 'Paste'}</span>
                </button>
                {sourceText && (
                  <button
                    onClick={() => speakText(sourceText, direction === 'neToEn' ? 'ne' : 'en')}
                    className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                    title={lang === 'ne' ? 'उच्चारण सुन्नुहोस्' : 'Listen speech'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <textarea
              rows={5}
              value={sourceText}
              onChange={(e) => {
                const val = e.target.value;
                setSourceText(val);
                if (debounceTimerRef.current) {
                  clearTimeout(debounceTimerRef.current);
                }
                if (val.trim()) {
                  debounceTimerRef.current = setTimeout(() => {
                    handleTranslate(val, direction);
                  }, 400);
                } else {
                  setResult(null);
                }
              }}
              placeholder={
                direction === 'neToEn'
                  ? 'यहाँ नेपाली शब्द, वाक्य वा अनुच्छेद टाइप गर्नुहोस्...'
                  : 'Type English words, phrases, or sentences here...'
              }
              className="w-full text-base sm:text-lg font-medium text-stone-900 bg-transparent border-0 focus:outline-none resize-none placeholder-stone-400"
            />
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-stone-100 text-xs">
            <span className="text-[11px] font-semibold text-stone-400">
              {sourceText.length} {lang === 'ne' ? 'अक्षरहरू' : 'characters'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTranslate(sourceText, direction)}
                disabled={isLoading || !sourceText.trim()}
                className="px-3 py-1.5 bg-red-700 hover:bg-red-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{lang === 'ne' ? 'अनुवाद गर्नुहोस्' : 'Translate'}</span>
              </button>
              <a
                href={googleTranslateWebUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-1"
                title="Open directly in Google Translate"
              >
                <span>Google Translate</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => handleTranslate(sourceText, direction)}
                disabled={isLoading || !sourceText.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                <span>{lang === 'ne' ? 'अनुवाद गर्नुहोस्' : 'Translate'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Translated Target Box */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-blue-950 text-white rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between border border-stone-800">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  {direction === 'neToEn' ? '🇬🇧 अंग्रेजी अनुवाद (English Translation)' : '🇳🇵 नेपाली अनुवाद (Nepali Translation)'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Google Translate
                </span>
              </div>
              <div className="flex items-center gap-2">
                {result?.translatedText && (
                  <>
                    <button
                      onClick={() => speakText(result.translatedText, direction === 'neToEn' ? 'en' : 'ne')}
                      className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                      title={lang === 'ne' ? 'उच्चारण सुन्नुहोस्' : 'Listen audio'}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(result.translatedText)}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      title={lang === 'ne' ? 'प्रतिलिपि गर्नुहोस्' : 'Copy result'}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? (lang === 'ne' ? 'कपी भयो' : 'Copied!') : (lang === 'ne' ? 'कपी' : 'Copy')}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {result?.translatedText ? (
              <div className="space-y-3">
                <div className="text-lg sm:text-2xl font-extrabold text-white leading-relaxed">
                  {result.translatedText}
                </div>
                {result.transliteration && (
                  <div className="text-xs sm:text-sm text-blue-200/90 font-medium italic">
                    Phonetics: {result.transliteration}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-stone-400 text-sm">
                {lang === 'ne' ? 'अनुवाद यहाँ प्रदर्शित हुनेछ...' : 'Translation will appear here instantly...'}
              </div>
            )}
          </div>

          {result?.grammarNote && (
            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-300 flex items-start gap-1.5">
              <span className="text-blue-400 shrink-0">🌐</span>
              <span>{result.grammarNote}</span>
            </div>
          )}
        </div>
      </div>

      {/* Morphological Word-by-Word Breakdown (When available) */}
      {result?.wordBreakdown && result.wordBreakdown.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-700" />
            <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">
              {lang === 'ne' ? 'शब्दगत विश्लेषण तथा अर्थ (Word by Word Meaning)' : 'Word-by-Word Breakdown'}
            </h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {result.wordBreakdown.map((w, idx) => (
              <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 hover:border-blue-200 transition-all text-xs">
                <div className="font-extrabold text-stone-900 text-sm mb-0.5">{w.word}</div>
                <div className="text-stone-600 font-medium mb-1">{w.meaning}</div>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                  {w.partOfSpeech}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Try Presets */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">
              {lang === 'ne' ? '⚡ द्रुत व्यावहारिक उदाहरणहरू (Quick Examples):' : '⚡ Quick Practical Phrases:'}
            </h4>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_TRANSLATE_PRESETS.map((cat, cIdx) => (
            <button
              key={cIdx}
              onClick={() => setSelectedPresetTab(cIdx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedPresetTab === cIdx
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {lang === 'ne' ? cat.categoryNe : cat.categoryEn}
            </button>
          ))}
        </div>

        {/* Preset Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {QUICK_TRANSLATE_PRESETS[selectedPresetTab].items.map((item, iIdx) => (
            <div
              key={iIdx}
              onClick={() => {
                const text = direction === 'neToEn' ? item.ne : item.en;
                setSourceText(text);
                handleTranslate(text, direction);
              }}
              className="p-3 bg-stone-50 hover:bg-blue-50/60 rounded-2xl border border-stone-200 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div>
                <div className="font-bold text-xs text-stone-900 group-hover:text-blue-800">
                  {direction === 'neToEn' ? item.ne : item.en}
                </div>
                <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                  {direction === 'neToEn' ? item.en : item.ne}
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Translation History */}
      {history.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-stone-500" />
              <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">
                {lang === 'ne' ? 'हालै गरिएका अनुवादहरू (Recent Translations)' : 'Recent Translation History'}
              </h4>
            </div>
            <button
              onClick={clearHistory}
              className="text-[11px] font-bold text-stone-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>{lang === 'ne' ? 'इतिहास मेटाउनुहोस्' : 'Clear'}</span>
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {history.map((h) => (
              <div
                key={h.id}
                onClick={() => {
                  setDirection(h.from === 'ne' ? 'neToEn' : 'enToNe');
                  setSourceText(h.sourceText);
                  handleTranslate(h.sourceText, h.from === 'ne' ? 'neToEn' : 'enToNe');
                }}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-stone-50 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-xs font-bold text-stone-900 truncate">{h.sourceText}</span>
                  <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="text-xs font-medium text-stone-600 truncate">{h.translatedText}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-stone-400">{h.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
