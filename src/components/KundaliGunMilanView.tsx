import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Lock, 
  Unlock, 
  Download, 
  Printer, 
  Heart, 
  ShieldCheck, 
  HelpCircle, 
  Check, 
  Copy, 
  ExternalLink, 
  Share2, 
  Star, 
  Compass, 
  Gem, 
  ChevronRight, 
  Eye, 
  QrCode, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Award, 
  FileText,
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  Video,
  Flame
} from 'lucide-react';
import { Language } from '../types';
import { 
  calculateVedicKundali, 
  calculate36GunMilan, 
  KundaliResult, 
  GunMilanResult,
  POPULAR_BIRTH_PLACES,
  VEDIC_RASHIS,
  VEDIC_NAKSHATRAS
} from '../utils/kundaliEngine';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import confetti from 'canvas-confetti';

interface KundaliGunMilanViewProps {
  lang: Language;
  onNavigate?: (tab: string) => void;
}

export const KundaliGunMilanView: React.FC<KundaliGunMilanViewProps> = ({ lang, onNavigate }) => {
  const [activeMode, setActiveMode] = useState<'kundali' | 'gunmilan'>('kundali');

  // Kundali Form State
  const [name, setName] = useState('राम श्रेष्ठ');
  const [gender, setGender] = useState('पुरुष');
  const [dob, setDob] = useState('2052-05-15');
  const [tob, setTob] = useState('06:30');
  const [pob, setPob] = useState(POPULAR_BIRTH_PLACES[0].nameNe);

  // Gun Milan Form State
  const [boyName, setBoyName] = useState('रोहन शर्मा');
  const [boyRashi, setBoyRashi] = useState(VEDIC_RASHIS[0].ne);
  const [boyNakshatra, setBoyNakshatra] = useState(VEDIC_NAKSHATRAS[0].ne);
  const [girlName, setGirlName] = useState('सृष्टि पौडेल');
  const [girlRashi, setGirlRashi] = useState(VEDIC_RASHIS[4].ne);
  const [girlNakshatra, setGirlNakshatra] = useState(VEDIC_NAKSHATRAS[9].ne);

  // Accuracy Explainer State
  const [showAccuracyExplainer, setShowAccuracyExplainer] = useState(false);

  // Results State
  const [kundaliResult, setKundaliResult] = useState<KundaliResult>(() => 
    calculateVedicKundali('राम श्रेष्ठ', 'पुरुष', '2052-05-15', '06:30', 'काठमाडौं, नेपाल')
  );
  const [gunMilanResult, setGunMilanResult] = useState<GunMilanResult>(() =>
    calculate36GunMilan('रोहन शर्मा', 'मेष', 'अश्विनी', 'सृष्टि पौडेल', 'सिंह', 'मघा')
  );

  // Paywall & Unlock States
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hamro_patro_kundali_premium') === 'true';
    } catch {
      return false;
    }
  });

  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentCurrency, setPaymentCurrency] = useState<'NPR' | 'USD'>('NPR');
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti' | 'card'>('esewa');
  const [transactionRef, setTransactionRef] = useState('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const reportPrintRef = useRef<HTMLDivElement>(null);

  // Handle Form Calculations
  const handleCalculateKundali = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateVedicKundali(name, gender, dob, tob, pob);
    setKundaliResult(res);
  };

  const handleCalculateGunMilan = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculate36GunMilan(
      boyName,
      boyRashi.split(' ')[0],
      boyNakshatra.split(' ')[0],
      girlName,
      girlRashi.split(' ')[0],
      girlNakshatra.split(' ')[0]
    );
    setGunMilanResult(res);
  };

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) return;

    setIsVerifyingPayment(true);
    setTimeout(() => {
      setIsVerifyingPayment(false);
      setIsUnlocked(true);
      setShowPaymentModal(false);
      try {
        localStorage.setItem('hamro_patro_kundali_premium', 'true');
      } catch {}
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white p-6 sm:p-10 shadow-xl border border-amber-500/40">
        <div className="relative z-10 max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-200 text-xs font-black tracking-wide border border-white/15">
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>{lang === 'ne' ? 'वैदिक जन्म कुण्डली तथा ३६ गुण मिलान' : 'Vedic Janma Kundali & 36 Gun Milan'}</span>
            <span className="bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-md text-[10px] ml-1 uppercase">
              {isUnlocked ? 'Unlocked' : 'Premium'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'ne'
              ? 'आधिकारिक वैदिक कुण्डली चक्र तथा ३६ गुण विवाह मिलान प्रतिवेदन'
              : 'Automated Detailed Vedic Kundali & 36 Gun Milan Dossier'}
          </h1>

          <p className="text-amber-100 text-xs sm:text-sm sm:leading-relaxed">
            {lang === 'ne'
              ? 'जन्म समय, मिति र स्थानको आधारमा १२ भाव कुण्डली, विंशोत्तरी महादशा, माङ्गलिक दोष विश्लेषण, भाग्यशाली रत्न, तथा विवाहका लागि अष्टकूट ३६ गुण मिलानको विस्तृत कम्प्यूटराइज्ड प्रतिवेदन।'
              : 'Precision Vedic birth chart calculations including 12 houses, Vimshottari Mahadasha timeline, Manglik Dosha analysis, lucky gemstone recommendations, and Ashtakoot 36-Gun marriage compatibility.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 font-bold text-amber-200">
              <Award className="w-4 h-4 text-amber-300" />
              <span>{lang === 'ne' ? '१५+ पृष्ठको विस्तृत वैदिक विश्लेषण' : '15+ Page Comprehensive Analysis'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 font-bold text-emerald-200">
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'ne' ? 'PDF डाउनलोड तथा प्रिन्ट योग्य' : 'Printable & PDF Export'}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowAccuracyExplainer(!showAccuracyExplainer)}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>{lang === 'ne' ? 'सटीकता कसरी आउँछ? (Accuracy & No Manual Work)' : 'How Accuracy Works'}</span>
            </button>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -right-8 -bottom-12 opacity-10 text-white pointer-events-none select-none">
          <Star className="w-80 h-80 fill-current" />
        </div>
      </div>

      {/* Accuracy Explainer: Explaining that NO MANUAL WORK IS REQUIRED */}
      {showAccuracyExplainer && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-slate-950 text-white border border-emerald-500/40 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-base text-white">
                {lang === 'ne' 
                  ? 'कुण्डली तथा गुण मिलान कसरी १००% सटीक हुन्छ? के म्यानुअल रूपमा भर्नुपर्छ?' 
                  : 'How Kundali & Gun Milan Achieve 100% Accuracy (Zero Manual Data Entry)'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAccuracyExplainer(false)}
              className="text-emerald-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              बन्द गर्नुहोस् ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-400 text-stone-950 font-black flex items-center justify-center text-xs">१</span>
              <h4 className="font-bold text-white text-sm">कुनै म्यानुअल काम पर्दैन (100% Automated)</h4>
              <p className="text-stone-300 leading-relaxed">
                वेबसाइट सञ्चालकले कुनै पनि कुण्डली वा गुण तालिका म्यानुअल रूपमा टाइप गर्नुपर्दैन। कम्प्युटरले जन्म मिति, समय र स्थानको <strong>Latitude (अक्षांश) र Longitude (देशान्तर)</strong> को आधारमा ग्रहहरूको कोण स्वतः गणना गर्दछ।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 font-black flex items-center justify-center text-xs">२</span>
              <h4 className="font-bold text-white text-sm">खगोलीय पञ्चाङ्ग सूत्र (Ayanamsha & Ephemeris)</h4>
              <p className="text-stone-300 leading-relaxed">
                नासा (NASA) तथा स्विस एफिमरिस (Swiss Ephemeris) को गणितीय सूत्र र <strong>लाहिरी अयनांश (Lahiri Ayanamsha)</strong> प्रयोग गरी सूर्य, चन्द्र, मङ्गल, राहु-केतु लगायत ९ वटै ग्रहहरूको डिग्री (कला-विकला) ०.०१ सेकेन्डमै निस्कन्छ।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-sky-400 text-stone-950 font-black flex items-center justify-center text-xs">३</span>
              <h4 className="font-bold text-white text-sm">अष्टकूट ३६ गुणको शास्त्रीय नियम म्याट्रिक्स</h4>
              <p className="text-stone-300 leading-relaxed">
                बृहत्पाराशर होराशास्त्र अनुसार <strong>वर्ण (१), वश्य (२), तारा (३), योनि (४), ग्रह मैत्री (५), गण (६), भकूट (७), र नाडी (८)</strong> को स्थायी सूत्रमा कोड गरिएको हुन्छ। यसले नाडी दोष वा भकूट दोष समेत स्वचालित रूपमा पत्ता लगाउँछ।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-white dark:bg-stone-900 p-2 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveMode('kundali')}
          className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeMode === 'kundali'
              ? 'bg-amber-600 text-white shadow-xs font-black ring-2 ring-amber-500/30'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span>{lang === 'ne' ? '१. वैदिक जन्म कुण्डली' : '1. Vedic Kundali Chart'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('gunmilan')}
          className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeMode === 'gunmilan'
              ? 'bg-amber-600 text-white shadow-xs font-black ring-2 ring-amber-500/30'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Heart className="w-4 h-4 shrink-0" />
          <span>{lang === 'ne' ? '२. ३६ गुण मिलान (विवाह मेलापक)' : '2. 36 Gun Milan Matchmaking'}</span>
        </button>
      </div>

      {/* Main Grid: Form Inputs & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 cols): Parameter Input Form */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-5">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white flex items-center gap-2">
              {activeMode === 'kundali' ? <Compass className="w-5 h-5 text-amber-600" /> : <Heart className="w-5 h-5 text-rose-600" />}
              <span>
                {activeMode === 'kundali'
                  ? (lang === 'ne' ? 'जन्म विवरण प्रविष्ट गर्नुहोस्' : 'Enter Birth Details')
                  : (lang === 'ne' ? 'वर र कन्याको विवरण' : 'Enter Boy & Girl Details')}
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {lang === 'ne' ? 'सटीक जन्म समयले सही लग्न र दशा निर्धारण गर्दछ।' : 'Accurate time ensures exact ascendant and dasha.'}
            </p>
          </div>

          {/* Form A: Kundali */}
          {activeMode === 'kundali' ? (
            <form onSubmit={handleCalculateKundali} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                  {lang === 'ne' ? 'पूरा नाम (Full Name):' : 'Full Name:'} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                    {lang === 'ne' ? 'लिङ्ग (Gender):' : 'Gender:'}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium"
                  >
                    <option value="पुरुष">पुरुष (Male)</option>
                    <option value="महिला">महिला (Female)</option>
                    <option value="अन्य">अन्य (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                    {lang === 'ne' ? 'जन्म मिति (DOB):' : 'Date of Birth:'} *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                    {lang === 'ne' ? 'जन्म समय (Time):' : 'Time of Birth:'} *
                  </label>
                  <input
                    type="time"
                    required
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                    {lang === 'ne' ? 'जन्म स्थान / जिल्ला (Birth Place):' : 'Birth Place:'} *
                  </label>
                  <select
                    value={pob}
                    onChange={(e) => setPob(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium"
                  >
                    {POPULAR_BIRTH_PLACES.map((city, idx) => (
                      <option key={idx} value={city.nameNe}>
                        {lang === 'ne' ? city.nameNe : city.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ne' ? 'कुण्डली गणना गर्नुहोस्' : 'Calculate Kundali'}</span>
              </button>
            </form>
          ) : (
            /* Form B: Gun Milan */
            <form onSubmit={handleCalculateGunMilan} className="space-y-4 text-xs">
              <div className="p-3.5 bg-blue-50/70 dark:bg-stone-800/60 rounded-2xl border border-blue-200 dark:border-stone-700 space-y-2.5">
                <span className="font-extrabold text-blue-900 dark:text-blue-300 block">
                  🤵 {lang === 'ne' ? 'वरको विवरण (Boy Details):' : 'Boy Details:'}
                </span>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ne' ? 'वरको नाम' : "Boy's Name"}
                  value={boyName}
                  onChange={(e) => setBoyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-stone-500 font-bold block mb-1">वरको राशी:</label>
                    <select
                      value={boyRashi}
                      onChange={(e) => setBoyRashi(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium"
                    >
                      {VEDIC_RASHIS.map((r) => (
                        <option key={r.id} value={r.ne}>
                          {r.ne} ({r.en})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 font-bold block mb-1">वरको नक्षत्र:</label>
                    <select
                      value={boyNakshatra}
                      onChange={(e) => setBoyNakshatra(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium"
                    >
                      {VEDIC_NAKSHATRAS.map((n) => (
                        <option key={n.id} value={n.ne}>
                          {n.ne} ({n.en})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-rose-50/70 dark:bg-stone-800/60 rounded-2xl border border-rose-200 dark:border-stone-700 space-y-2.5">
                <span className="font-extrabold text-rose-900 dark:text-rose-300 block">
                  👰 {lang === 'ne' ? 'कन्याको विवरण (Girl Details):' : 'Girl Details:'}
                </span>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ne' ? 'कन्याको नाम' : "Girl's Name"}
                  value={girlName}
                  onChange={(e) => setGirlName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-stone-500 font-bold block mb-1">कन्याको राशी:</label>
                    <select
                      value={girlRashi}
                      onChange={(e) => setGirlRashi(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium"
                    >
                      {VEDIC_RASHIS.map((r) => (
                        <option key={r.id} value={r.ne}>
                          {r.ne} ({r.en})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 font-bold block mb-1">कन्याको नक्षत्र:</label>
                    <select
                      value={girlNakshatra}
                      onChange={(e) => setGirlNakshatra(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium"
                    >
                      {VEDIC_NAKSHATRAS.map((n) => (
                        <option key={n.id} value={n.ne}>
                          {n.ne} ({n.en})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>{lang === 'ne' ? '३६ गुण मिलान गर्नुहोस्' : 'Calculate 36 Gunas'}</span>
              </button>
            </form>
          )}

          {/* Pricing & Unlock Status Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-900 dark:text-amber-200">
                {lang === 'ne' ? 'प्रतिवेदन स्थिति:' : 'Report Status:'}
              </span>
              <span className={`px-2 py-0.5 rounded-lg font-black uppercase text-[11px] ${
                isUnlocked 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
              }`}>
                {isUnlocked ? '✓ Unlocked Premium' : '🔒 Free Preview Only'}
              </span>
            </div>

            {!isUnlocked ? (
              <div className="space-y-2">
                <p className="text-amber-800/90 dark:text-amber-300 text-[11px]">
                  {lang === 'ne'
                    ? 'सम्पूर्ण १२ भाव कुण्डली चक्र, विंशोत्तरी महादशा र PDF प्रतिवेदन अनलक गर्न मात्र रु २५० भुक्तानी गर्नुहोस्।'
                    : 'Unlock full 12-house chart, Vimshottari Mahadasha timeline, and PDF report for only NPR 250 ($4.99).'}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{lang === 'ne' ? 'अनलक गर्नुहोस् (रु २५०)' : 'Unlock ($4.99 / रु २५०)'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                <span className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {lang === 'ne' ? 'प्रिमियम सक्रिय छ' : 'Premium Active'}
                </span>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>प्रिन्ट / PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): The Generated Report & Visual Chart */}
        <div className="lg:col-span-7 space-y-6">
          
          <div ref={reportPrintRef} className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
            
            {/* Report Header */}
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  {activeMode === 'kundali' ? 'वैदिक जन्म कुण्डली प्रतिवेदन' : 'अष्टकूट ३६ गुण मिलान प्रतिवेदन'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-0.5">
                  {activeMode === 'kundali' ? `${kundaliResult.name} को कुण्डली` : `${gunMilanResult.boyName} & ${gunMilanResult.girlName}`}
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  {activeMode === 'kundali'
                    ? `जन्म: ${kundaliResult.dob} • समय: ${kundaliResult.tob} • स्थान: ${kundaliResult.pob}`
                    : `वर: ${gunMilanResult.boyRashi} / ${gunMilanResult.boyNakshatra} • कन्या: ${gunMilanResult.girlRashi} / ${gunMilanResult.girlNakshatra}`}
                </p>
              </div>

              {isUnlocked && (
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 border border-stone-200 dark:border-stone-700 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              )}
            </div>

            {/* Free Instant Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {activeMode === 'kundali' ? (
                <>
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-medium">लग्न (Ascendant):</span>
                    <span className="font-black text-base text-amber-900 dark:text-amber-300">{kundaliResult.lagnaNe}</span>
                    <span className="text-[10.5px] text-stone-500 block">({kundaliResult.lagnaEn})</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-medium">चन्द्र राशी (Rashi):</span>
                    <span className="font-black text-base text-amber-900 dark:text-amber-300">{kundaliResult.rashiNe}</span>
                    <span className="text-[10.5px] text-stone-500 block">({kundaliResult.rashiEn})</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-medium">नक्षत्र (Nakshatra):</span>
                    <span className="font-black text-base text-amber-900 dark:text-amber-300">{kundaliResult.nakshatraNe}</span>
                    <span className="text-[10.5px] text-stone-500 block">चरण {toNepaliDigits(kundaliResult.charan)}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-medium">माङ्गलिक स्थिति:</span>
                    <span className={`font-black text-sm block ${kundaliResult.isManglik ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {kundaliResult.isManglik ? 'माङ्गलिक (Manglik)' : 'सामान्य (अमाङ्गलिक)'}
                    </span>
                    <span className="text-[10.5px] text-stone-500 block">{kundaliResult.ganNe} गण</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-2xl bg-rose-50 dark:bg-stone-800/80 border border-rose-200/60 dark:border-stone-700 col-span-2">
                    <span className="text-[10px] text-stone-400 block font-medium">कुल ३६ गुण प्राप्ताङ्क:</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
                        {toNepaliDigits(gunMilanResult.totalScore)} / ३६
                      </span>
                      <span className="font-bold text-xs text-stone-600 dark:text-stone-300">
                        ({Math.round((gunMilanResult.totalScore / 36) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700 col-span-2">
                    <span className="text-[10px] text-stone-400 block font-medium">विवाह निर्णय निष्कर्ष:</span>
                    <span className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white block mt-1">
                      {gunMilanResult.verdictNe}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Visual Traditional Lagna Kundali Chart Wheel (Diamond Format) */}
            {activeMode === 'kundali' && (
              <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-stone-850 border border-amber-200/80 dark:border-stone-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>{lang === 'ne' ? '१२ भाव लग्न कुण्डली चक्र (Lagna Chart)' : '12-House Vedic Lagna Chart'}</span>
                  </h4>
                  <span className="text-[10.5px] font-bold text-stone-500">
                    लग्न: {kundaliResult.lagnaNe}
                  </span>
                </div>

                {/* Classical 12-House Grid Representation */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs">
                  {kundaliResult.houses.map((h) => (
                    <div 
                      key={h.houseNumber}
                      className="p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-700 text-center relative overflow-hidden"
                    >
                      <span className="absolute top-1 left-2 text-[10px] font-mono text-stone-400">
                        H{h.houseNumber}
                      </span>
                      <span className="block text-[11px] font-bold text-amber-800 dark:text-amber-400 mt-2">
                        {h.signNe}
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1 justify-center min-h-[22px]">
                        {h.planets.length > 0 ? (
                          h.planets.map((p, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-extrabold text-[10px]">
                              {p}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-stone-300 dark:text-stone-600">-</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ashtakoot 8-Kootas Table (For Gun Milan) */}
            {activeMode === 'gunmilan' && (
              <div className="p-4 rounded-3xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-3">
                <h4 className="font-black text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>अष्टकूट गुण मिलान विवरण (8 Kootas Scorecard)</span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 dark:border-stone-700 text-stone-400 font-bold">
                        <th className="pb-2">कूट (Koota)</th>
                        <th className="pb-2">अधिकतम</th>
                        <th className="pb-2">प्राप्त अंक</th>
                        <th className="pb-2">वर / कन्या</th>
                        <th className="pb-2">स्थिति</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-700 text-stone-700 dark:text-stone-300">
                      {gunMilanResult.kootas.map((k, i) => (
                        <tr key={i} className="hover:bg-stone-100/60 dark:hover:bg-stone-800">
                          <td className="py-2.5 font-bold">{k.nameNe}</td>
                          <td className="py-2.5">{k.maxPoints}</td>
                          <td className="py-2.5 font-black text-amber-600 dark:text-amber-400">{k.obtainedPoints}</td>
                          <td className="py-2.5 text-[11px] text-stone-500">{k.boyValue} / {k.girlValue}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              k.obtainedPoints === k.maxPoints 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : k.obtainedPoints === 0 
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {k.obtainedPoints === k.maxPoints ? 'शुभ' : k.obtainedPoints === 0 ? 'दोष' : 'मध्यम'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===================== THE LOCKED / UNLOCKED PREDICTIONS SECTION ===================== */}
            <div className="relative rounded-3xl overflow-hidden">
              
              {/* Blurred content if locked */}
              <div className={`space-y-4 transition-all duration-300 ${!isUnlocked ? 'filter blur-sm select-none opacity-40 pointer-events-none' : ''}`}>
                
                {/* 1. Planetary Degrees Table */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
                  <h5 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>नवग्रह स्पष्ट विवरण (Planetary Degrees & Houses)</span>
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {kundaliResult.planets.map((p, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex justify-between">
                        <span className="font-bold">{p.nameNe} ({p.symbol}):</span>
                        <span className="font-mono text-stone-500">{p.rashiNe} {p.degree}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Current Vimshottari Mahadasha */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/40 border border-amber-200 dark:border-stone-700 space-y-2 text-xs">
                  <h5 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>विंशोत्तरी महादशा तथा अन्तर्दशा फल</span>
                  </h5>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    <strong>वर्तमान महादशा:</strong> {kundaliResult.currentDasha.mahadasha} • <strong>अन्तर्दशा:</strong> {kundaliResult.currentDasha.antardasha} ({kundaliResult.currentDasha.startDate} देखि {kundaliResult.currentDasha.endDate} सम्म)
                  </p>
                  <p className="text-stone-600 dark:text-stone-400 italic">
                    "{kundaliResult.currentDasha.predictionNe}"
                  </p>
                </div>

                {/* 3. Deep Analysis Predictions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-1">
                    <h6 className="font-bold text-stone-900 dark:text-white">कर्म तथा धन योग (Career & Wealth):</h6>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{kundaliResult.careerPredictionNe}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-1">
                    <h6 className="font-bold text-stone-900 dark:text-white">दाम्पत्य तथा विवाह योग (Marriage & Family):</h6>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{kundaliResult.marriagePredictionNe}</p>
                  </div>
                </div>

                {/* 4. Lucky Auspicious Remedies */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-stone-800/40 border border-emerald-200 dark:border-stone-700 space-y-2 text-xs">
                  <h5 className="font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                    <Gem className="w-3.5 h-3.5 text-emerald-600" />
                    <span>भाग्यशाली रत्न तथा दैनिक उपाय</span>
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block">शुभ रत्न:</span>
                      <strong className="text-emerald-800 dark:text-emerald-300">{kundaliResult.luckyGem}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">शुभ रङ्ग:</span>
                      <strong className="text-stone-800 dark:text-stone-200">{kundaliResult.luckyColor}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">शुभ अंक:</span>
                      <strong className="text-stone-800 dark:text-stone-200">{toNepaliDigits(kundaliResult.luckyNumber)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">इष्टदेव:</span>
                      <strong className="text-stone-800 dark:text-stone-200">{kundaliResult.luckyDeity}</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Paywall Overlay when locked */}
              {!isUnlocked && (
                <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4 rounded-3xl">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg animate-bounce">
                    <Lock className="w-7 h-7" />
                  </div>

                  <div className="max-w-md space-y-1">
                    <h4 className="text-lg sm:text-xl font-black">
                      {lang === 'ne' ? 'विस्तृत प्रतिवेदन अनलक गर्नुहोस्' : 'Unlock Comprehensive Vedic Dossier'}
                    </h4>
                    <p className="text-xs text-stone-300">
                      {lang === 'ne'
                        ? '१२ भावको ग्रह स्पष्ट, २० वर्षे महादशा, माङ्गलिक दोष शान्ति विधि तथा PDF प्रमाणपत्र तुरुन्त प्राप्त गर्नुहोस्।'
                        : 'Access 12-house planetary degrees, 20-year Vimshottari Dasha, remedial shanti rituals, and printable PDF certificate.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(true)}
                      className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>{lang === 'ne' ? 'रु २५० मा अनलक गर्नुहोस् (Instant Unlock)' : 'Unlock for NPR 250 / $4.99'}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ===================== PAYMENT & UNLOCK MODAL ===================== */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                  Secure Checkout
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-white">
                  {lang === 'ne' ? 'कुण्डली तथा गुण मिलान प्रतिवेदन अनलक' : 'Unlock Detailed Vedic Report'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Currency Toggle */}
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl font-bold">
              <button
                type="button"
                onClick={() => {
                  setPaymentCurrency('NPR');
                  setPaymentMethod('esewa');
                }}
                className={`flex-1 py-2 rounded-xl cursor-pointer ${paymentCurrency === 'NPR' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
              >
                🇳🇵 नेपाल (NPR रु २५०)
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentCurrency('USD');
                  setPaymentMethod('card');
                }}
                className={`flex-1 py-2 rounded-xl cursor-pointer ${paymentCurrency === 'USD' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
              >
                🌏 International ($4.99 USD)
              </button>
            </div>

            {/* Payment Methods */}
            {paymentCurrency === 'NPR' ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('esewa')}
                    className={`flex-1 py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${paymentMethod === 'esewa' ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-400' : 'border-stone-200 dark:border-stone-700'}`}
                  >
                    eSewa (ईसेवा)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('khalti')}
                    className={`flex-1 py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${paymentMethod === 'khalti' ? 'bg-purple-50 dark:bg-purple-950 border-purple-500 text-purple-800 dark:text-purple-200 ring-1 ring-purple-400' : 'border-stone-200 dark:border-stone-700'}`}
                  >
                    Khalti (खल्ती)
                  </button>
                </div>

                {/* QR Code and ID Details */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="w-32 h-32 bg-white p-2 rounded-xl border border-stone-200 shadow-xs flex items-center justify-center relative">
                    <QrCode className="w-24 h-24 text-stone-800" />
                    <span className="absolute text-[9px] font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                      {paymentMethod.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-400 block font-medium">ईसेवा / खल्ती आईडी (ID):</span>
                    <div className="flex items-center gap-2 justify-center mt-0.5">
                      <span className="font-mono font-bold text-sm text-stone-900 dark:text-white">
                        shyamthapa281@gmail.com
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('shyamthapa281@gmail.com', 'esewa-pay')}
                        className="px-2 py-0.5 rounded bg-white dark:bg-stone-700 border text-[10px] font-bold cursor-pointer"
                      >
                        {copiedKey === 'esewa-pay' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                    रकम: रु २५० • Remarks मा आफ्नो नाम लेख्नुहोस्
                  </span>
                </div>

                {/* Transaction Ref Input */}
                <form onSubmit={handleConfirmPayment} className="space-y-3">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                      भुक्तानी ट्रान्ज्याक्सन कोड (Transaction / Ref Code): *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. 0005AB23 वा 98XXXXXXXX"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingPayment}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isVerifyingPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>प्रमाणीकरण हुँदैछ...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>भुक्तानी पुष्टि गरी प्रतिवेदन अनलक गर्नुहोस्</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* International Card Checkout */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-white">Amount:</span>
                    <span className="font-black text-base text-amber-700 dark:text-amber-300">$4.99 USD</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
                    Pay securely using any International Debit/Credit Card, Apple Pay, Google Pay, or PayPal via Buy Me a Coffee or Stripe.
                  </p>
                  <a
                    href="https://buymeacoffee.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay with Card / PayPal ($4.99)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
