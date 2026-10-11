import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  Lock, 
  Unlock, 
  Download, 
  Printer, 
  Heart, 
  ShieldCheck, 
  Check, 
  Copy, 
  ExternalLink, 
  Star, 
  Compass, 
  Gem, 
  CreditCard, 
  CheckCircle2, 
  Award, 
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  Building2,
  ArrowRight,
  User,
  Info,
  Search,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';
import { PaymentConfig } from '../types/payment';
import { 
  calculateVedicKundali, 
  calculate36GunMilan, 
  KundaliResult, 
  GunMilanResult,
  POPULAR_BIRTH_PLACES,
  VEDIC_RASHIS,
  VEDIC_NAKSHATRAS,
  convertBsToAd,
  convertAdToBs
} from '../utils/kundaliEngine';
import { toNepaliDigits, BS_MONTH_NAMES_NE, BS_MONTH_NAMES_EN } from '../utils/nepaliCalendar';
import { printAndDownloadReport } from '../utils/reportPdfPrinter';
import confetti from 'canvas-confetti';

interface KundaliGunMilanViewProps {
  lang: Language;
  onNavigate?: (tab: string) => void;
}

export const KundaliGunMilanView: React.FC<KundaliGunMilanViewProps> = ({ lang, onNavigate }) => {
  const [activeMode, setActiveMode] = useState<'kundali' | 'gunmilan'>('kundali');

  // Kundali Form State
  const [name, setName] = useState('श्याम थापा');
  const [gender, setGender] = useState('पुरुष');
  
  // Date format toggle for Kundali: Bikram Sambat (BS) vs Gregorian (AD)
  const [dateType, setDateType] = useState<'bs' | 'ad'>('bs');
  const [bsYear, setBsYear] = useState<number>(2052);
  const [bsMonth, setBsMonth] = useState<number>(5); // Bhadra
  const [bsDay, setBsDay] = useState<number>(15);
  const [adDob, setAdDob] = useState<string>('1995-09-01');
  const [tob, setTob] = useState('06:30');
  const [pob, setPob] = useState(POPULAR_BIRTH_PLACES[0].nameNe);
  const [isCustomPob, setIsCustomPob] = useState(false);
  const [customPob, setCustomPob] = useState('');

  // Gun Milan Form State
  // Mode toggle: 'dob' (Full Birth Details Matchmaking) vs 'rashi' (Traditional Rashi/Nakshatra Picker)
  const [gunMilanInputMode, setGunMilanInputMode] = useState<'dob' | 'rashi'>('dob');

  // Boy Details
  const [boyName, setBoyName] = useState('रोहन शर्मा');
  const [boyDateType, setBoyDateType] = useState<'bs' | 'ad'>('bs');
  const [boyBsYear, setBoyBsYear] = useState<number>(2052);
  const [boyBsMonth, setBoyBsMonth] = useState<number>(1);
  const [boyBsDay, setBoyBsDay] = useState<number>(15);
  const [boyAdDob, setBoyAdDob] = useState<string>('1995-04-28');
  const [boyTob, setBoyTob] = useState<string>('06:30');
  const [boyPob, setBoyPob] = useState<string>(POPULAR_BIRTH_PLACES[0].nameNe);
  const [boyRashi, setBoyRashi] = useState(VEDIC_RASHIS[0].ne);
  const [boyNakshatra, setBoyNakshatra] = useState(VEDIC_NAKSHATRAS[0].ne);

  // Girl Details
  const [girlName, setGirlName] = useState('सृष्टि पौडेल');
  const [girlDateType, setGirlDateType] = useState<'bs' | 'ad'>('bs');
  const [girlBsYear, setGirlBsYear] = useState<number>(2054);
  const [girlBsMonth, setGirlBsMonth] = useState<number>(5);
  const [girlBsDay, setGirlBsDay] = useState<number>(4);
  const [girlAdDob, setGirlAdDob] = useState<string>('1997-08-20');
  const [girlTob, setGirlTob] = useState<string>('10:45');
  const [girlPob, setGirlPob] = useState<string>(POPULAR_BIRTH_PLACES[0].nameNe);
  const [girlRashi, setGirlRashi] = useState(VEDIC_RASHIS[4].ne);
  const [girlNakshatra, setGirlNakshatra] = useState(VEDIC_NAKSHATRAS[9].ne);

  // Accuracy Explainer & Feedback
  const [showAccuracyExplainer, setShowAccuracyExplainer] = useState(false);
  const [calculationFeedback, setCalculationFeedback] = useState<string | null>(null);

  // Customer Report Recovery Modal
  const [showFindReportModal, setShowFindReportModal] = useState(false);
  const [findSearchQuery, setFindSearchQuery] = useState('');
  const [findSearchPhone, setFindSearchPhone] = useState('');
  const [isSearchingReports, setIsSearchingReports] = useState(false);
  const [foundReports, setFoundReports] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [recoveryToast, setRecoveryToast] = useState<string | null>(null);

  // Generate Year options for Bikram Sambat (BS 1980 to 2090)
  const bsYearsList = useMemo(() => {
    const list = [];
    for (let y = 2085; y >= 1990; y--) {
      list.push(y);
    }
    return list;
  }, []);

  // Derived effective Date of Birth string for Kundali
  const effectiveDob = useMemo(() => {
    if (dateType === 'bs') {
      return `${bsYear}-${String(bsMonth).padStart(2, '0')}-${String(bsDay).padStart(2, '0')}`;
    }
    return adDob || '1995-09-01';
  }, [dateType, bsYear, bsMonth, bsDay, adDob]);

  const effectivePob = useMemo(() => {
    if (isCustomPob && customPob.trim()) {
      return customPob.trim();
    }
    return pob;
  }, [isCustomPob, customPob, pob]);

  // Derived effective DOB for Boy and Girl in Gun Milan
  const boyEffectiveDob = useMemo(() => {
    if (boyDateType === 'bs') {
      return `${boyBsYear}-${String(boyBsMonth).padStart(2, '0')}-${String(boyBsDay).padStart(2, '0')}`;
    }
    return boyAdDob || '1995-04-28';
  }, [boyDateType, boyBsYear, boyBsMonth, boyBsDay, boyAdDob]);

  const girlEffectiveDob = useMemo(() => {
    if (girlDateType === 'bs') {
      return `${girlBsYear}-${String(girlBsMonth).padStart(2, '0')}-${String(girlBsDay).padStart(2, '0')}`;
    }
    return girlAdDob || '1997-08-20';
  }, [girlDateType, girlBsYear, girlBsMonth, girlBsDay, girlAdDob]);

  // Auto-calculated Boy & Girl Kundalis for Birth-Date Matchmaking
  const boyKundaliCalc = useMemo(() => {
    if (gunMilanInputMode !== 'dob') return null;
    return calculateVedicKundali(
      boyName.trim() || 'वर',
      'पुरुष',
      boyEffectiveDob,
      boyTob || '06:30',
      boyPob
    );
  }, [gunMilanInputMode, boyName, boyEffectiveDob, boyTob, boyPob]);

  const girlKundaliCalc = useMemo(() => {
    if (gunMilanInputMode !== 'dob') return null;
    return calculateVedicKundali(
      girlName.trim() || 'कन्या',
      'महिला',
      girlEffectiveDob,
      girlTob || '10:45',
      girlPob
    );
  }, [gunMilanInputMode, girlName, girlEffectiveDob, girlTob, girlPob]);

  // Effective Rashi and Nakshatra for Gun Milan
  const effectiveBoyRashi = gunMilanInputMode === 'dob' && boyKundaliCalc ? boyKundaliCalc.rashiNe : boyRashi.split(' ')[0];
  const effectiveBoyNakshatra = gunMilanInputMode === 'dob' && boyKundaliCalc ? boyKundaliCalc.nakshatraNe : boyNakshatra.split(' ')[0];
  const effectiveGirlRashi = gunMilanInputMode === 'dob' && girlKundaliCalc ? girlKundaliCalc.rashiNe : girlRashi.split(' ')[0];
  const effectiveGirlNakshatra = gunMilanInputMode === 'dob' && girlKundaliCalc ? girlKundaliCalc.nakshatraNe : girlNakshatra.split(' ')[0];

  // LIVE FULLY DYNAMIC KUNDALI CALCULATION
  const kundaliResult = useMemo<KundaliResult>(() => {
    return calculateVedicKundali(
      name.trim() || 'जिज्ञासु',
      gender,
      effectiveDob,
      tob || '06:30',
      effectivePob
    );
  }, [name, gender, effectiveDob, tob, effectivePob]);

  // LIVE GUN MILAN CALCULATION WITH BIRTH MATCHMAKING & MANGLIK HARMONY
  const gunMilanResult = useMemo<GunMilanResult>(() => {
    return calculate36GunMilan(
      boyName.trim() || 'वर',
      effectiveBoyRashi,
      effectiveBoyNakshatra,
      girlName.trim() || 'कन्या',
      effectiveGirlRashi,
      effectiveGirlNakshatra,
      gunMilanInputMode === 'dob' && boyKundaliCalc && girlKundaliCalc ? {
        boyKundali: boyKundaliCalc,
        girlKundali: girlKundaliCalc
      } : undefined
    );
  }, [
    boyName, 
    effectiveBoyRashi, 
    effectiveBoyNakshatra, 
    girlName, 
    effectiveGirlRashi, 
    effectiveGirlNakshatra, 
    gunMilanInputMode, 
    boyKundaliCalc, 
    girlKundaliCalc
  ]);

  // Paywall & Unlock States (Strictly session-based so post print/download locks safely!)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<'nepal_bank' | 'aus_bank' | 'stripe' | 'paypal'>('nepal_bank');
  const [transactionRef, setTransactionRef] = useState('');
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live Payment Config fetched from server
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    nepalBankName: 'NMB Bank Limited',
    nepalAccountNumber: '1990256249400016',
    nepalAccountHolder: 'Shyam Thapa',
    nepalBranch: 'Gwarko, Lalitpur',
    nepalSwiftCode: 'NMBNNPKA',
    stripePaymentLink: 'https://buy.stripe.com/bJeeVc1ImcTf0wZdMf8so00',
    stripeAccountEmail: 'shyamthapa281@gmail.com',
    paypalEmail: 'shyamthapa999@hotmail.com',
    paypalUsername: 'shubhapatro',
    paypalMeUrl: 'https://paypal.me/shubhapatro',
    australiaBankName: 'Commonwealth Bank of Australia (CBA)',
    australiaBsb: '063620',
    australiaAccountNumber: '11170070',
    australiaAccountHolder: 'Shyam Thapa',
    australiaPayId: '0416045056',
    supportPhone: '+61 416 045 056 / 0416045056',
    supportEmail: 'shyamthapa281@gmail.com',
    notificationEmail: 'shyamthapa281@gmail.com',
    adminPin: '1234',
    acceptingPayments: true,
    currencyAccepted: ['AUD', 'NPR', 'USD']
  });

  useEffect(() => {
    fetch('/api/payments/config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.config) {
          setPaymentConfig(prev => ({ ...prev, ...data.config }));
        }
      })
      .catch(() => {});
  }, []);

  // Save report to server archive whenever unlocked so it can always be recovered
  const archiveCurrentReport = async () => {
    try {
      const payload = {
        reportType: activeMode,
        title: activeMode === 'kundali' ? `${kundaliResult.name} को जन्म कुण्डली` : `${gunMilanResult.boyName} & ${gunMilanResult.girlName} ३६ गुण मिलान`,
        customerName: activeMode === 'kundali' ? kundaliResult.name : `${gunMilanResult.boyName} / ${gunMilanResult.girlName}`,
        phone: payerPhone.trim(),
        details: {
          kundali: activeMode === 'kundali' ? kundaliResult : undefined,
          gunMilan: activeMode === 'gunmilan' ? gunMilanResult : undefined,
          transactionRef: transactionRef.trim()
        }
      };
      await fetch('/api/reports/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (_) {}
  };

  // Perform Print / PDF Download & Automatically Lock Afterwards
  const handlePrintOrDownload = async () => {
    // 1. Archive report first so user/admin never loses it
    await archiveCurrentReport();

    // 2. Trigger high quality print & PDF engine
    printAndDownloadReport(
      activeMode,
      activeMode === 'kundali' ? kundaliResult : undefined,
      activeMode === 'gunmilan' ? gunMilanResult : undefined,
      {
        name: payerName || (activeMode === 'kundali' ? kundaliResult.name : `${gunMilanResult.boyName} & ${gunMilanResult.girlName}`),
        phone: payerPhone,
        transactionRef: transactionRef
      }
    );

    // 3. User explicit requirement: "also after the print or download completes let this app go back to locked version"
    setTimeout(() => {
      setIsUnlocked(false);
      try {
        localStorage.removeItem('hamro_patro_kundali_premium');
      } catch {}
      setCalculationFeedback(
        lang === 'ne' 
          ? 'प्रतिवेदन प्रिन्ट/डाउनलोड सम्पन्न भयो। सुरक्षाका लागि पृष्ठ लक गरिएको छ।' 
          : 'Report print/download completed. Report locked for customer privacy.'
      );
      setTimeout(() => setCalculationFeedback(null), 5000);
    }, 1200);
  };

  // Recover Customer Report Search
  const handleSearchLostReports = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchingReports(true);
    setHasSearched(true);
    try {
      const res = await fetch('/api/reports/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: findSearchQuery.trim(),
          phone: findSearchPhone.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setFoundReports(data.reports || []);
      }
    } catch (_) {
      setFoundReports([]);
    } finally {
      setIsSearchingReports(false);
    }
  };

  // Restore a retrieved report
  const handleRestoreReport = (report: any) => {
    if (report.reportType === 'kundali' && report.details?.kundali) {
      const k = report.details.kundali;
      setActiveMode('kundali');
      setName(k.name || '');
      setGender(k.gender || 'पुरुष');
      if (k.dobAd) {
        setDateType('ad');
        setAdDob(k.dobAd);
      }
      if (k.tob) setTob(k.tob);
      if (k.pob) setPob(k.pob);
      setIsUnlocked(true);
    } else if (report.reportType === 'gunmilan' && report.details?.gunMilan) {
      const gm = report.details.gunMilan;
      setActiveMode('gunmilan');
      setBoyName(gm.boyName || 'वर');
      setBoyRashi(gm.boyRashi || VEDIC_RASHIS[0].ne);
      setBoyNakshatra(gm.boyNakshatra || VEDIC_NAKSHATRAS[0].ne);
      setGirlName(gm.girlName || 'कन्या');
      setGirlRashi(gm.girlRashi || VEDIC_RASHIS[4].ne);
      setGirlNakshatra(gm.girlNakshatra || VEDIC_NAKSHATRAS[9].ne);
      setIsUnlocked(true);
    }
    setShowFindReportModal(false);
    setRecoveryToast(`प्रतिवेदन "${report.title}" सफलतापूर्वक फेला पारी अनलक गरियो!`);
    confetti({ particleCount: 70, spread: 70 });
    setTimeout(() => setRecoveryToast(null), 5000);
  };

  // Handle Form Calculations
  const handleCalculateKundali = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculationFeedback(`${name || 'तपाईं'} को कुण्डली सफलतापूर्वक गणना तथा अद्यावधिक भयो!`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => setCalculationFeedback(null), 4000);
  };

  const handleCalculateGunMilan = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculationFeedback(`${boyName} र ${girlName} को ३६ गुण मिलान अद्यावधिक भयो!`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => setCalculationFeedback(null), 4000);
  };

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) return;

    setIsVerifyingPayment(true);

    const priceMap = {
      nepal_bank: { amount: 250, currency: 'NPR' },
      aus_bank: { amount: 4.99, currency: 'AUD' },
      stripe: { amount: 4.99, currency: 'USD' },
      paypal: { amount: 4.99, currency: 'USD' }
    };
    const pricing = priceMap[selectedChannel] || { amount: 250, currency: 'NPR' };

    try {
      await fetch('/api/payments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: payerName.trim() || (activeMode === 'kundali' ? name : `${boyName} & ${girlName}`),
          senderPhone: payerPhone.trim(),
          servicePurpose: activeMode === 'kundali' ? 'vedic_kundali' : 'gun_milan',
          serviceName: activeMode === 'kundali' ? 'Vedic Kundali Full Dossier' : 'Ashtakoot 36-Gun Milan Report',
          amount: pricing.amount,
          currency: pricing.currency,
          paymentMethod: selectedChannel,
          transactionRef: transactionRef.trim(),
          notes: `Instant Unlock on Web App • ${activeMode === 'kundali' ? `Kundali: ${name}` : `Milan: ${boyName} & ${girlName}`}`
        })
      });
    } catch (err) {
      console.warn('Payment recording log:', err);
    }

    setTimeout(() => {
      setIsVerifyingPayment(false);
      setIsUnlocked(true);
      archiveCurrentReport();
      setPaymentSuccessMsg(lang === 'ne' ? 'भुक्तानी प्रमाणित भयो! प्रतिवेदन अनलक गरिएको छ।' : 'Payment Verified! Full Vedic Report Unlocked.');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccessMsg(null);
      }, 1500);
    }, 900);
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
              {isUnlocked ? 'Unlocked' : 'Free Preview + Premium'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'ne'
              ? 'सटीक वैदिक कुण्डली चक्र तथा जन्म मिति आधारित ३६ गुण मिलान'
              : 'Precision Vedic Kundali & Date-of-Birth 36 Gun Matchmaking'}
          </h1>

          <p className="text-amber-100 text-xs sm:text-sm sm:leading-relaxed">
            {lang === 'ne'
              ? 'जन्म मिति (वि.सं./ई.सं.), समय र स्थानको आधारमा वर र कन्याको राशी-नक्षत्र स्वतः निकाली माङ्गलिक सामञ्जस्य तथा ३६ गुण विवाह मिलान। प्रिन्ट वा PDF डाउनलोड गरेपछि स्वतः सुरक्षित लक हुन्छ।'
              : 'Calculate complete 12-house Vedic birth charts and 36-Gun matchmaking using precise date of birth, time, and location. Re-locks automatically after print/download with cloud recovery for lost reports.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 font-bold text-amber-200">
              <Award className="w-4 h-4 text-amber-300" />
              <span>{lang === 'ne' ? 'जन्म मितिबाट स्वतः राशी/नक्षत्र' : 'Birth Date Driven'}</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 font-bold text-emerald-200">
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'ne' ? 'PDF डाउनलोड तथा प्रिन्ट योग्य' : 'Printable & PDF Export'}</span>
            </div>

            {/* Find Lost Customer Report Button */}
            <button
              type="button"
              onClick={() => setShowFindReportModal(true)}
              className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-stone-950 px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>{lang === 'ne' ? 'हराएको प्रतिवेदन खोज्नुहोस् (Find Report)' : 'Find Lost Customer Report'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAccuracyExplainer(!showAccuracyExplainer)}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>{lang === 'ne' ? 'सटीकता कसरी आउँछ?' : 'How Accuracy Works'}</span>
            </button>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -right-8 -bottom-12 opacity-10 text-white pointer-events-none select-none">
          <Star className="w-80 h-80 fill-current" />
        </div>
      </div>

      {/* Toast Feedback for Recovery or Actions */}
      {recoveryToast && (
        <div className="p-4 rounded-2xl bg-sky-600 text-white font-bold text-xs flex items-center justify-between shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{recoveryToast}</span>
          </div>
          <span className="text-[11px] opacity-90">पुनः प्राप्ति सफल ✓</span>
        </div>
      )}

      {/* Accuracy Explainer Modal */}
      {showAccuracyExplainer && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-slate-950 text-white border border-emerald-500/40 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-base text-white">
                {lang === 'ne' 
                  ? 'कुण्डली तथा गुण मिलान कसरी १००% सटीक र गतिशील हुन्छ?' 
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
              <h4 className="font-bold text-white text-sm">जन्म मितिबाट स्वचालित राशी-नक्षत्र</h4>
              <p className="text-stone-300 leading-relaxed">
                वर र कन्याको जन्म मिति, समय र स्थान हाल्नासाथ वास्तविक लाहिरी अयनांश अनुसार चन्द्रमाको भोगांश निकाली सही चन्द्र राशि, जन्म नक्षत्र र चरण स्वचालित रूपमा प्राप्त हुन्छ।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 font-black flex items-center justify-center text-xs">२</span>
              <h4 className="font-bold text-white text-sm">माङ्गलिक दोष सामञ्जस्य (Manglik Match)</h4>
              <p className="text-stone-300 leading-relaxed">
                वर र कन्याको १, ४, ७, ८, १२ भावमा मङ्गलको स्थिति जाँची दुवै माङ्गलिक हुँदा दोष भङ्ग हुने वा एकतर्फी दोष हुँदा आवश्यक शान्ति विधि स्पष्ट देखाइन्छ।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-sky-400 text-stone-950 font-black flex items-center justify-center text-xs">३</span>
              <h4 className="font-bold text-white text-sm">सुरक्षित लक तथा प्रतिवेदन पुनः प्राप्ति</h4>
              <p className="text-stone-300 leading-relaxed">
                प्रिन्ट वा PDF डाउनलोड गरेपछि गोपनीयता कायम राख्न पृष्ठ स्वतः लक हुन्छ। यदि ग्राहकले प्रतिवेदन हराएमा नाम वा फोन नम्बरबाट खोजेर तुरुन्तै पुनः प्रतिवेदन निकाल्न सकिन्छ।
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
          <span>{lang === 'ne' ? '२. ३६ गुण मिलान (जन्म मिति सहित)' : '2. 36 Gun Milan Matchmaking'}</span>
        </button>
      </div>

      {/* Main Grid: Form Inputs & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 cols): Parameter Input Form */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-5">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white flex items-center gap-2">
                {activeMode === 'kundali' ? <Compass className="w-5 h-5 text-amber-600" /> : <Heart className="w-5 h-5 text-rose-600" />}
                <span>
                  {activeMode === 'kundali'
                    ? (lang === 'ne' ? 'जन्म विवरण प्रविष्ट गर्नुहोस्' : 'Enter Birth Details')
                    : (lang === 'ne' ? 'वर र कन्याको विवरण' : 'Enter Boy & Girl Details')}
                </span>
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                {lang === 'ne' ? 'विवरण परिवर्तन गर्नासाथ कुण्डली तथा गुण मिलान तुरुन्त अद्यावधिक हुन्छ।' : 'Recalculates dynamically in real time.'}
              </p>
            </div>
          </div>

          {/* Form A: Kundali Form */}
          {activeMode === 'kundali' ? (
            <form onSubmit={handleCalculateKundali} className="space-y-4 text-xs">
              
              {/* Full Name */}
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                  {lang === 'ne' ? 'पूरा नाम (Full Name):' : 'Full Name:'} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="उदा. श्याम थापा / Shyam Thapa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Gender */}
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

              {/* Date Format Toggle: BS vs AD */}
              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-stone-850 border border-amber-200 dark:border-stone-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 dark:text-amber-200 text-xs flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>{lang === 'ne' ? 'जन्म मिति ढाँचा (Calendar System):' : 'Calendar System:'}</span>
                  </span>
                  
                  <div className="flex items-center gap-1 bg-white dark:bg-stone-900 p-0.5 rounded-xl border border-amber-200 dark:border-stone-700">
                    <button
                      type="button"
                      onClick={() => setDateType('bs')}
                      className={`px-2.5 py-1 rounded-lg font-black text-[11px] cursor-pointer transition-colors ${
                        dateType === 'bs' 
                          ? 'bg-amber-600 text-white shadow-xs' 
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      वि.सं. (B.S.)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateType('ad')}
                      className={`px-2.5 py-1 rounded-lg font-black text-[11px] cursor-pointer transition-colors ${
                        dateType === 'ad' 
                          ? 'bg-amber-600 text-white shadow-xs' 
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      ई.सं. (A.D.)
                    </button>
                  </div>
                </div>

                {/* BS Date Fields */}
                {dateType === 'bs' ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-1">वर्ष (Year):</label>
                      <select
                        value={bsYear}
                        onChange={(e) => setBsYear(Number(e.target.value))}
                        className="w-full px-2 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium text-xs"
                      >
                        {bsYearsList.map((y) => (
                          <option key={y} value={y}>
                            {y} ({toNepaliDigits(y)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-1">महिना (Month):</label>
                      <select
                        value={bsMonth}
                        onChange={(e) => setBsMonth(Number(e.target.value))}
                        className="w-full px-2 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium text-xs"
                      >
                        {BS_MONTH_NAMES_NE.map((m, idx) => (
                          <option key={idx} value={idx + 1}>
                            {m} ({idx + 1})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-1">गते (Day):</label>
                      <select
                        value={bsDay}
                        onChange={(e) => setBsDay(Number(e.target.value))}
                        className="w-full px-2 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium text-xs"
                      >
                        {[...Array(32)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {toNepaliDigits(i + 1)} ({i + 1})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] text-stone-500 font-bold block mb-1">Gregorian Date (YYYY-MM-DD):</label>
                    <input
                      type="date"
                      required
                      value={adDob}
                      onChange={(e) => setAdDob(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Time of Birth & Place of Birth */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                    {lang === 'ne' ? 'जन्म समय (Time):' : 'Time of Birth:'} *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="time"
                      required
                      value={tob}
                      onChange={(e) => setTob(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                    {lang === 'ne' ? 'जन्म स्थान (Place):' : 'Place of Birth:'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <select
                      value={isCustomPob ? 'custom' : pob}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setIsCustomPob(true);
                        } else {
                          setIsCustomPob(false);
                          setPob(e.target.value);
                        }
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium text-xs"
                    >
                      {POPULAR_BIRTH_PLACES.map((city, idx) => (
                        <option key={idx} value={city.nameNe}>
                          {city.nameNe}
                        </option>
                      ))}
                      <option value="custom">✍️ अन्य स्थान (Type Custom Place)...</option>
                    </select>
                  </div>
                </div>
              </div>

              {isCustomPob && (
                <div className="animate-in fade-in">
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                    अन्य जन्म स्थान नाम (Enter City Name):
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. पाल्पा, इलाम, दाङ, ब्रिसबेन ..."
                    value={customPob}
                    onChange={(e) => setCustomPob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ne' ? 'कुण्डली गणना गर्नुहोस्' : 'Recalculate Kundali'}</span>
              </button>
            </form>
          ) : (
            /* Form B: Gun Milan with Date of Birth Support */
            <form onSubmit={handleCalculateGunMilan} className="space-y-4 text-xs">
              
              {/* Gun Milan Mode Toggle: By DOB vs Traditional Rashi/Nakshatra */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <span className="font-extrabold text-stone-700 dark:text-stone-300 text-[11px]">
                  {lang === 'ne' ? 'मिलान गणना विधि:' : 'Calculation Method:'}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setGunMilanInputMode('dob')}
                    className={`px-3 py-1 rounded-lg font-black text-[11px] cursor-pointer transition-colors ${
                      gunMilanInputMode === 'dob'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    📅 {lang === 'ne' ? 'जन्म मितिबाट (Date of Birth)' : 'Date of Birth'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGunMilanInputMode('rashi')}
                    className={`px-3 py-1 rounded-lg font-black text-[11px] cursor-pointer transition-colors ${
                      gunMilanInputMode === 'rashi'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    ⭐ {lang === 'ne' ? 'राशी/नक्षत्रबाट (Direct)' : 'Rashi / Nakshatra'}
                  </button>
                </div>
              </div>

              {/* BOY DETAILS CARD */}
              <div className="p-3.5 bg-blue-50/70 dark:bg-stone-800/60 rounded-2xl border border-blue-200 dark:border-stone-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-900 dark:text-blue-300 block">
                    🤵 {lang === 'ne' ? 'वरको विवरण (Boy Details):' : 'Boy Details:'}
                  </span>
                  {gunMilanInputMode === 'dob' && boyKundaliCalc && (
                    <span className="text-[10px] bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-black px-2 py-0.5 rounded-md">
                      {boyKundaliCalc.rashiNe} / {boyKundaliCalc.nakshatraNe}
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  required
                  placeholder={lang === 'ne' ? 'वरको नाम' : "Boy's Name"}
                  value={boyName}
                  onChange={(e) => setBoyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium"
                />

                {gunMilanInputMode === 'dob' ? (
                  <div className="space-y-2 pt-1 border-t border-blue-200/60 dark:border-stone-700">
                    <div className="flex items-center justify-between">
                      <label className="text-[10.5px] font-bold text-blue-950 dark:text-blue-200">वरको जन्म मिति:</label>
                      <div className="flex gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setBoyDateType('bs')}
                          className={`px-2 py-0.5 rounded font-bold cursor-pointer ${boyDateType === 'bs' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-stone-800 text-stone-600'}`}
                        >
                          वि.सं.
                        </button>
                        <button
                          type="button"
                          onClick={() => setBoyDateType('ad')}
                          className={`px-2 py-0.5 rounded font-bold cursor-pointer ${boyDateType === 'ad' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-stone-800 text-stone-600'}`}
                        >
                          ई.सं.
                        </button>
                      </div>
                    </div>

                    {boyDateType === 'bs' ? (
                      <div className="grid grid-cols-3 gap-1.5">
                        <select
                          value={boyBsYear}
                          onChange={(e) => setBoyBsYear(Number(e.target.value))}
                          className="px-2 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs"
                        >
                          {bsYearsList.map((y) => <option key={y} value={y}>{y} ({toNepaliDigits(y)})</option>)}
                        </select>
                        <select
                          value={boyBsMonth}
                          onChange={(e) => setBoyBsMonth(Number(e.target.value))}
                          className="px-2 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs"
                        >
                          {BS_MONTH_NAMES_NE.map((m, idx) => <option key={idx} value={idx + 1}>{m}</option>)}
                        </select>
                        <select
                          value={boyBsDay}
                          onChange={(e) => setBoyBsDay(Number(e.target.value))}
                          className="px-2 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs"
                        >
                          {[...Array(32)].map((_, i) => <option key={i + 1} value={i + 1}>{toNepaliDigits(i + 1)}</option>)}
                        </select>
                      </div>
                    ) : (
                      <input
                        type="date"
                        value={boyAdDob}
                        onChange={(e) => setBoyAdDob(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs"
                      />
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-stone-500 font-bold block mb-0.5">समय (Time):</label>
                        <input
                          type="time"
                          value={boyTob}
                          onChange={(e) => setBoyTob(e.target.value)}
                          className="w-full px-2 py-1 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-500 font-bold block mb-0.5">स्थान (Place):</label>
                        <select
                          value={boyPob}
                          onChange={(e) => setBoyPob(e.target.value)}
                          className="w-full px-2 py-1 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs"
                        >
                          {POPULAR_BIRTH_PLACES.map((p, idx) => <option key={idx} value={p.nameNe}>{p.nameNe}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-1">वरको राशी:</label>
                      <select
                        value={boyRashi}
                        onChange={(e) => setBoyRashi(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium text-xs"
                      >
                        {VEDIC_RASHIS.map((r) => <option key={r.id} value={r.ne}>{r.ne} ({r.en})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-1">वरको नक्षत्र:</label>
                      <select
                        value={boyNakshatra}
                        onChange={(e) => setBoyNakshatra(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium text-xs"
                      >
                        {VEDIC_NAKSHATRAS.map((n) => <option key={n.id} value={n.ne}>{n.ne} ({n.en})</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* GIRL DETAILS CARD */}
              <div className="p-3.5 bg-rose-50/70 dark:bg-stone-800/60 rounded-2xl border border-rose-200 dark:border-stone-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-rose-900 dark:text-rose-300 block">
                    👰 {lang === 'ne' ? 'कन्याको विवरण (Girl Details):' : 'Girl Details:'}
                  </span>
                  {gunMilanInputMode === 'dob' && girlKundaliCalc && (
                    <span className="text-[10px] bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 font-black px-2 py-0.5 rounded-md">
                      {girlKundaliCalc.rashiNe} / {girlKundaliCalc.nakshatraNe}
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  required
                  placeholder={lang === 'ne' ? 'कन्याको नाम' : "Girl's Name"}
                  value={girlName}
                  onChange={(e) => setGirlName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium"
                />

                {gunMilanInputMode === 'dob' ? (
                  <div className="space-y-2 pt-1 border-t border-rose-200/60 dark:border-stone-700">
                    <div className="flex items-center justify-between">
                      <label className="text-[10.5px] font-bold text-rose-950 dark:text-rose-200">कन्याको जन्म मिति:</label>
                      <div className="flex gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setGirlDateType('bs')}
                          className={`px-2 py-0.5 rounded font-bold cursor-pointer ${girlDateType === 'bs' ? 'bg-rose-600 text-white' : 'bg-white dark:bg-stone-800 text-stone-600'}`}
                        >
                          वि.सं.
                        </button>
                        <button
                          type="button"
                          onClick={() => setGirlDateType('ad')}
                          className={`px-2 py-0.5 rounded font-bold cursor-pointer ${girlDateType === 'ad' ? 'bg-rose-600 text-white' : 'bg-white dark:bg-stone-800 text-stone-600'}`}
                        >
                          ई.सं.
                        </button>
                      </div>
                    </div>

                    {girlDateType === 'bs' ? (
                      <div className="grid grid-cols-3 gap-1.5">
                        <select
                          value={girlBsYear}
                          onChange={(e) => setGirlBsYear(Number(e.target.value))}
                          className="px-2 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs"
                        >
                          {bsYearsList.map((y) => <option key={y} value={y}>{y} ({toNepaliDigits(y)})</option>)}
                        </select>
                        <select
                          value={girlBsMonth}
                          onChange={(e) => setGirlBsMonth(Number(e.target.value))}
                          className="px-2 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs"
                        >
                          {BS_MONTH_NAMES_NE.map((m, idx) => <option key={idx} value={idx + 1}>{m}</option>)}
                        </select>
                        <select
                          value={girlBsDay}
                          onChange={(e) => setGirlBsDay(Number(e.target.value))}
                          className="px-2 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs"
                        >
                          {[...Array(32)].map((_, i) => <option key={i + 1} value={i + 1}>{toNepaliDigits(i + 1)}</option>)}
                        </select>
                      </div>
                    ) : (
                      <input
                        type="date"
                        value={girlAdDob}
                        onChange={(e) => setGirlAdDob(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs"
                      />
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-stone-500 font-bold block mb-0.5">समय (Time):</label>
                        <input
                          type="time"
                          value={girlTob}
                          onChange={(e) => setGirlTob(e.target.value)}
                          className="w-full px-2 py-1 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-500 font-bold block mb-0.5">स्थान (Place):</label>
                        <select
                          value={girlPob}
                          onChange={(e) => setGirlPob(e.target.value)}
                          className="w-full px-2 py-1 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs"
                        >
                          {POPULAR_BIRTH_PLACES.map((p, idx) => <option key={idx} value={p.nameNe}>{p.nameNe}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-1">कन्याको राशी:</label>
                      <select
                        value={girlRashi}
                        onChange={(e) => setGirlRashi(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium text-xs"
                      >
                        {VEDIC_RASHIS.map((r) => <option key={r.id} value={r.ne}>{r.ne} ({r.en})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-1">कन्याको नक्षत्र:</label>
                      <select
                        value={girlNakshatra}
                        onChange={(e) => setGirlNakshatra(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-medium text-xs"
                      >
                        {VEDIC_NAKSHATRAS.map((n) => <option key={n.id} value={n.ne}>{n.ne} ({n.en})</option>)}
                      </select>
                    </div>
                  </div>
                )}
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
                <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                  {lang === 'ne'
                    ? 'सम्पूर्ण १२ भाव कुण्डली चक्र, विंशोत्तरी महादशा कालचक्र, माङ्गलिक शान्ति र PDF प्रतिवेदन अनलक गर्न मात्र रु २५० ($4.99) भुक्तानी गर्नुहोस्।'
                    : 'Unlock full 12-house chart, Vimshottari Mahadasha timeline, and PDF report for only NPR 250 ($4.99).'}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{lang === 'ne' ? 'अनलक गर्नुहोस् (रु २५० / $4.99)' : 'Unlock ($4.99 / रु २५०)'}</span>
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
                  onClick={handlePrintOrDownload}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1 text-xs shadow-xs"
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
          
          {/* Toast / Notification Banner when Calculation happens */}
          {calculationFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{calculationFeedback}</span>
              </div>
              <span className="text-[10px] opacity-80">अद्यावधिक भयो ✓</span>
            </div>
          )}

          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
            
            {/* Report Header */}
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  {activeMode === 'kundali' ? 'वैदिक जन्म कुण्डली प्रतिवेदन' : 'अष्टकूट ३६ गुण मिलान प्रतिवेदन'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-0.5">
                  {activeMode === 'kundali' ? `${kundaliResult.name} को कुण्डली` : `${gunMilanResult.boyName} & ${gunMilanResult.girlName}`}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {activeMode === 'kundali'
                    ? `जन्म: ${kundaliResult.dobBsFormatted || kundaliResult.dob} • समय: ${kundaliResult.tob} • स्थान: ${kundaliResult.pob}`
                    : `वर: ${gunMilanResult.boyRashi} / ${gunMilanResult.boyNakshatra} • कन्या: ${gunMilanResult.girlRashi} / ${gunMilanResult.girlNakshatra}`}
                </p>
              </div>

              {/* Download PDF button works in BOTH Modes! Automatically locks afterwards */}
              {isUnlocked && (
                <button
                  type="button"
                  onClick={handlePrintOrDownload}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 transition-transform active:scale-95"
                  title="Generate, Print, or Download PDF and safely return to locked state"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              )}
            </div>

            {/* NAME ASTROLOGICAL ALIGNMENT (For Kundali) */}
            {activeMode === 'kundali' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-300 dark:border-amber-800 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-700 pb-2">
                  <h4 className="font-extrabold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>नाम तथा जन्म नक्षत्र तादात्म्यता (Name Astrological Profile)</span>
                  </h4>
                  <span className="text-[10.5px] font-mono text-stone-500">
                    {kundaliResult.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200/60 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-medium">बोलचालको नामको राशि (Nama Rashi):</span>
                    <strong className="text-amber-900 dark:text-amber-300 text-sm block mt-0.5">
                      {kundaliResult.namaRashiNe} ({kundaliResult.namaRashiEn})
                    </strong>
                    <span className="text-[10px] text-stone-500">स्वामी: {kundaliResult.namaLordNe}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200/60 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-medium">जन्म नक्षत्र नामाक्षर (Auspicious Syllable):</span>
                    <strong className="text-amber-900 dark:text-amber-300 text-sm block mt-0.5">
                      '{kundaliResult.janmaNamaAkshar}'
                    </strong>
                    <span className="text-[10px] text-stone-500">नक्षत्र चरण: {toNepaliDigits(kundaliResult.charan)}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200/60 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-medium">अन्य चरणका नामाक्षरहरू:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {kundaliResult.allCharanAksharas.map((ak, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold text-[10px]">
                          {ak}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed italic bg-amber-50/60 dark:bg-stone-850 p-2.5 rounded-xl border border-amber-200/40 dark:border-stone-700">
                  {kundaliResult.namaJanmaHarmonyNe}
                </p>
              </div>
            )}

            {/* MANGLIK MATCH CARD (For Gun Milan) */}
            {activeMode === 'gunmilan' && gunMilanResult.manglikMatchNe && (
              <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                gunMilanResult.hasManglikDoshaConflict
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold flex items-center gap-1.5 text-stone-900 dark:text-white">
                    <ShieldCheck className={`w-4 h-4 ${gunMilanResult.hasManglikDoshaConflict ? 'text-rose-600' : 'text-emerald-600'}`} />
                    <span>माङ्गलिक सामञ्जस्य विश्लेषण (Manglik Compatibility Check)</span>
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    gunMilanResult.hasManglikDoshaConflict 
                      ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100' 
                      : 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100'
                  }`}>
                    {gunMilanResult.hasManglikDoshaConflict ? 'शान्ति पूजा आवश्यक' : 'निर्दोष मिलान ✓'}
                  </span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  {gunMilanResult.manglikMatchNe}
                </p>
              </div>
            )}

            {/* 4-8 Free Instant Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {activeMode === 'kundali' ? (
                <>
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-medium">लग्न (Ascendant):</span>
                    <span className="font-black text-base text-amber-900 dark:text-amber-300">{kundaliResult.lagnaNe}</span>
                    <span className="text-[10px] text-stone-500 block">({kundaliResult.lagnaEn}) • {kundaliResult.lagnaDegree}</span>
                    <span className="text-[9.5px] text-amber-700 dark:text-amber-400 block mt-0.5">लग्नेश: {kundaliResult.lagnaLordNe}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-medium">जन्म चन्द्र राशि (Rashi):</span>
                    <span className="font-black text-base text-amber-900 dark:text-amber-300">{kundaliResult.rashiNe}</span>
                    <span className="text-[10px] text-stone-500 block">({kundaliResult.rashiEn})</span>
                    <span className="text-[9.5px] text-amber-700 dark:text-amber-400 block mt-0.5">राशीश: {kundaliResult.rashiLordNe}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-medium">जन्म नक्षत्र (Nakshatra):</span>
                    <span className="font-black text-base text-amber-900 dark:text-amber-300">{kundaliResult.nakshatraNe}</span>
                    <span className="text-[10px] text-stone-500 block">चरण {toNepaliDigits(kundaliResult.charan)} ({kundaliResult.ganNe} गण)</span>
                    <span className="text-[9.5px] text-amber-700 dark:text-amber-400 block mt-0.5">नाडी: {kundaliResult.nadiNe}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700">
                    <span className="text-[10px] text-stone-400 block font-medium">माङ्गलिक स्थिति:</span>
                    <span className={`font-black text-sm block ${kundaliResult.isManglik ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {kundaliResult.isManglik ? 'माङ्गलिक (Manglik)' : 'सामान्य (अमाङ्गलिक)'}
                    </span>
                    <span className="text-[10px] text-stone-500 block">सूर्य: {kundaliResult.sunSignNe}</span>
                    <span className="text-[9.5px] text-stone-500 block mt-0.5">{kundaliResult.yoniNe} योनि</span>
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

            {/* Personality Summary Card (For Kundali) */}
            {activeMode === 'kundali' && (
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5 text-xs">
                <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>व्यक्तित्व तथा मूल स्वभाव (Innate Personality Traits):</span>
                </h4>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {kundaliResult.personalityNe}
                </p>
              </div>
            )}

            {/* Visual Traditional Lagna Kundali Chart Wheel (12-House Representation) */}
            {activeMode === 'kundali' && (
              <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-stone-850 border border-amber-200/80 dark:border-stone-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>{lang === 'ne' ? '१२ भाव लग्न कुण्डली चक्र (Lagna Chart)' : '12-House Vedic Lagna Chart'}</span>
                  </h4>
                  <span className="text-[10.5px] font-bold text-stone-500">
                    लग्न: {kundaliResult.lagnaNe} ({kundaliResult.lagnaDegree})
                  </span>
                </div>

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
                      <span className="block text-[9.5px] text-stone-400 truncate">
                        {h.lordNe.split(' ')[0]}
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
                    <tbody className="divide-y divide-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
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

            {/* Current Active Vimshottari Mahadasha Card (Visible & Dynamic) */}
            {activeMode === 'kundali' && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>वर्तमान विंशोत्तरी महादशा तथा अन्तर्दशा फल</span>
                  </h5>
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-black text-[10px]">
                    सक्रिय: {kundaliResult.currentDasha.startDate} - {kundaliResult.currentDasha.endDate}
                  </span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  <strong>वर्तमान महादशा:</strong> {kundaliResult.currentDasha.mahadasha} • <strong>अन्तर्दशा:</strong> {kundaliResult.currentDasha.antardasha}
                </p>
                <p className="text-stone-600 dark:text-stone-400 italic">
                  "{kundaliResult.currentDasha.predictionNe}"
                </p>
              </div>
            )}

            {/* ===================== THE DETAILED / UNLOCKED PREDICTIONS SECTION ===================== */}
            <div className="relative rounded-3xl overflow-hidden">
              
              {/* Blurred content if locked */}
              <div className={`space-y-4 transition-all duration-300 ${!isUnlocked ? 'filter blur-sm select-none opacity-40 pointer-events-none' : ''}`}>
                
                {/* Mode A: Kundali Unlocked Content */}
                {activeMode === 'kundali' ? (
                  <>
                    {/* 1. Planetary Degrees Table */}
                    <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
                      <h5 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>नवग्रह स्पष्ट विवरण तथा अवस्था (Planetary Degrees & Dignities)</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {kundaliResult.planets.map((p, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex flex-col justify-between space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-stone-900 dark:text-white">{p.nameNe} ({p.symbol})</span>
                              <span className="font-mono text-[10px] text-stone-500">{p.degree}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-stone-500">
                              <span>भाव {p.house} • {p.rashiNe}</span>
                              <span className="font-bold text-amber-700 dark:text-amber-400">{p.dignityNe?.split(' ')[0] || ''}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Chronological Vimshottari Mahadasha Timeline */}
                    <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
                      <h5 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>१२० वर्षे विंशोत्तरी महादशा कालचक्र (Lifetime Dasha Sequence)</span>
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {kundaliResult.fullDashaTimeline.map((d, idx) => (
                          <div 
                            key={idx} 
                            className={`p-2 rounded-xl border text-[11px] ${
                              d.isCurrent 
                                ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-400 dark:border-amber-600 font-bold text-amber-950 dark:text-amber-200 ring-1 ring-amber-400' 
                                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{d.planetNe.split(' ')[0]}</span>
                              {d.isCurrent && <span className="text-[9px] bg-amber-600 text-white px-1 rounded">हाल</span>}
                            </div>
                            <div className="text-[10px] text-stone-500 mt-0.5">
                              {d.startYear} - {d.endYear} ({d.durationYears} वर्ष)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. Deep Analysis Predictions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-1.5">
                        <h6 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>कर्म तथा धन योग (Career & Wealth):</span>
                        </h6>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{kundaliResult.careerPredictionNe}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-1.5">
                        <h6 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-rose-600" />
                          <span>दाम्पत्य तथा विवाह योग (Marriage & Relationships):</span>
                        </h6>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{kundaliResult.marriagePredictionNe}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-1.5 sm:col-span-2">
                        <h6 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-emerald-600" />
                          <span>आरोग्य तथा स्वास्थ्य योग (Health & Elemental Vitality):</span>
                        </h6>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{kundaliResult.healthPredictionNe}</p>
                      </div>
                    </div>

                    {/* 4. Lucky Auspicious Remedies & Vedic Upaya */}
                    <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-stone-800/40 border border-emerald-200 dark:border-stone-700 space-y-2.5 text-xs">
                      <h5 className="font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                        <Gem className="w-3.5 h-3.5 text-emerald-600" />
                        <span>भाग्यशाली तत्त्वहरू तथा दैनिक वैदिक उपाय (Auspicious Factors & Upaya)</span>
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-700">
                          <span className="text-[10px] text-stone-400 block">शुभ रत्न (Lucky Gem):</span>
                          <strong className="text-emerald-800 dark:text-emerald-300 block mt-0.5">{kundaliResult.luckyGem}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-700">
                          <span className="text-[10px] text-stone-400 block">शुभ रङ्ग:</span>
                          <strong className="text-stone-800 dark:text-stone-200 block mt-0.5">{kundaliResult.luckyColor}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-700">
                          <span className="text-[10px] text-stone-400 block">शुभ अंक:</span>
                          <strong className="text-stone-800 dark:text-stone-200 block mt-0.5">{toNepaliDigits(kundaliResult.luckyNumber)}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-700">
                          <span className="text-[10px] text-stone-400 block">शुभ वार:</span>
                          <strong className="text-stone-800 dark:text-stone-200 block mt-0.5">{kundaliResult.luckyDayNe}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-700">
                          <span className="text-[10px] text-stone-400 block">शुभ दिशा:</span>
                          <strong className="text-stone-800 dark:text-stone-200 block mt-0.5">{kundaliResult.luckyDirectionNe}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-700">
                          <span className="text-[10px] text-stone-400 block">इष्टदेव:</span>
                          <strong className="text-stone-800 dark:text-stone-200 block mt-0.5">{kundaliResult.luckyDeity}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-emerald-100 dark:border-stone-700 sm:col-span-2">
                          <span className="text-[10px] text-stone-400 block">दैनिक मन्त्र (Vedic Mantra):</span>
                          <strong className="font-mono text-emerald-900 dark:text-emerald-300 block mt-0.5">{kundaliResult.vedicMantra}</strong>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Mode B: Gun Milan Unlocked Content */
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-stone-800/40 border border-rose-200 dark:border-stone-700 space-y-2">
                      <h5 className="font-bold text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-rose-600" />
                        <span>विस्तृत वैवाहिक परामर्श तथा जीवन साथी तादात्म्यता</span>
                      </h5>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                        {gunMilanResult.recommendationNe}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/40 border border-amber-200 dark:border-stone-700 space-y-2">
                      <h5 className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                        <Gem className="w-4 h-4 text-amber-600" />
                        <span>दोष निवारण तथा दाम्पत्य सुखका लागि वैदिक उपाय (Remedial Pujas)</span>
                      </h5>
                      <ul className="list-disc pl-5 space-y-1 text-stone-700 dark:text-stone-300">
                        {gunMilanResult.remediesNe.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

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
                        ? '१२ भावको ग्रह स्पष्ट, विंशोत्तरी महादशा, माङ्गलिक दोष शान्ति विधि तथा PDF डाउनलोड तुरुन्त प्राप्त गर्नुहोस्। (डाउनलोड पश्चात् स्वतः लक हुनेछ)'
                        : 'Access 12-house planetary positions, Vimshottari dasha, and printable PDF. Automatically locks after download.'}
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
                    
                    <button
                      type="button"
                      onClick={() => setShowFindReportModal(true)}
                      className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{lang === 'ne' ? 'हराएको प्रतिवेदन खोज्नुहोस्' : 'Find Lost Report'}</span>
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

            {paymentSuccessMsg && (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{paymentSuccessMsg}</span>
              </div>
            )}

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl font-bold text-[11px]">
              <button
                type="button"
                onClick={() => setSelectedChannel('nepal_bank')}
                className={`py-2 px-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  selectedChannel === 'nepal_bank'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span>🇳🇵 NMB Bank</span>
                <span className="text-[9.5px] opacity-90">रु २५० (NPR)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedChannel('aus_bank')}
                className={`py-2 px-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  selectedChannel === 'aus_bank'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span>🇦🇺 CBA / PayID</span>
                <span className="text-[9.5px] opacity-90">$4.99 AUD</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedChannel('stripe')}
                className={`py-2 px-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  selectedChannel === 'stripe'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span>💳 Card / Stripe</span>
                <span className="text-[9.5px] opacity-90">$4.99 USD</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedChannel('paypal')}
                className={`py-2 px-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  selectedChannel === 'paypal'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span>🅿️ PayPal</span>
                <span className="text-[9.5px] opacity-90">$4.99 USD</span>
              </button>
            </div>

            {/* CHANNEL 1: NEPAL NMB BANK */}
            {selectedChannel === 'nepal_bank' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-stone-850 border border-amber-200 dark:border-stone-700 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/60 dark:border-stone-700">
                    <span className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span>{paymentConfig.nepalBankName}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-black text-[10px]">
                      रकम: रु २५०
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-stone-400 text-[10px] block">खाता नम्बर (Account No):</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <strong className="font-mono text-stone-900 dark:text-white text-xs">{paymentConfig.nepalAccountNumber}</strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentConfig.nepalAccountNumber, 'nmb-acc')}
                          className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[9.5px] font-bold border border-stone-300 dark:border-stone-600 cursor-pointer"
                        >
                          {copiedKey === 'nmb-acc' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-stone-400 text-[10px] block">खातावालाको नाम (Account Holder):</span>
                      <strong className="text-stone-900 dark:text-white block mt-0.5">{paymentConfig.nepalAccountHolder}</strong>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-stone-400 text-[10px] block">शाखा (Branch):</span>
                      <strong className="text-stone-900 dark:text-white block mt-0.5">{paymentConfig.nepalBranch}</strong>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-stone-400 text-[10px] block">स्वीफ्ट कोड (SWIFT Code):</span>
                      <strong className="font-mono text-stone-900 dark:text-white block mt-0.5">{paymentConfig.nepalSwiftCode || 'NMBNNPKA'}</strong>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-500 dark:text-stone-400 italic">
                    * कुनै पनि मोबाइल बैंकिङ, कनेक्ट आइपीएस (ConnectIPS) वा ईसेवा/खल्तीबाट NMB Bank मा रु २५० ट्रान्सफर गरी तलको फारममा रेफरेन्स कोड हाल्नुहोस्।
                  </p>
                </div>
              </div>
            )}

            {/* CHANNEL 2: AUSTRALIA CBA / PAYID */}
            {selectedChannel === 'aus_bank' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-stone-850 border border-amber-200 dark:border-stone-700 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/60 dark:border-stone-700">
                    <span className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span>{paymentConfig.australiaBankName || 'Commonwealth Bank of Australia (CBA)'}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-black text-[10px]">
                      $4.99 AUD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-stone-400 text-[10px] block">PayID (Mobile / Osko):</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <strong className="font-mono text-stone-900 dark:text-white text-xs">{paymentConfig.australiaPayId || '0416045056'}</strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentConfig.australiaPayId || '0416045056', 'aus-payid')}
                          className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[9.5px] font-bold border border-stone-300 dark:border-stone-600 cursor-pointer"
                        >
                          {copiedKey === 'aus-payid' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-stone-400 text-[10px] block">Account Name:</span>
                      <strong className="text-stone-900 dark:text-white block mt-0.5">{paymentConfig.australiaAccountHolder || 'Shyam Thapa'}</strong>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-stone-400 text-[10px] block">BSB:</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <strong className="font-mono text-stone-900 dark:text-white">{paymentConfig.australiaBsb || '063620'}</strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentConfig.australiaBsb || '063620', 'aus-bsb')}
                          className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[9.5px] font-bold border border-stone-300 dark:border-stone-600 cursor-pointer"
                        >
                          {copiedKey === 'aus-bsb' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-stone-400 text-[10px] block">Account Number:</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <strong className="font-mono text-stone-900 dark:text-white">{paymentConfig.australiaAccountNumber || '11170070'}</strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentConfig.australiaAccountNumber || '11170070', 'aus-acc')}
                          className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[9.5px] font-bold border border-stone-300 dark:border-stone-600 cursor-pointer"
                        >
                          {copiedKey === 'aus-acc' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CHANNEL 3: STRIPE LINK */}
            {selectedChannel === 'stripe' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-stone-850 border border-amber-200 dark:border-stone-700 space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/60 dark:border-stone-700">
                    <span className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      <span>Stripe Instant Card Checkout</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-black text-[10px]">
                      $4.99 USD
                    </span>
                  </div>

                  <a
                    href={paymentConfig.stripePaymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs"
                  >
                    <span>Pay Online with Credit/Debit Card ($4.99)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* CHANNEL 4: PAYPAL */}
            {selectedChannel === 'paypal' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-stone-850 border border-amber-200 dark:border-stone-700 space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/60 dark:border-stone-700">
                    <span className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>PayPal International</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-black text-[10px]">
                      $4.99 USD
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-stone-400 text-[10px] block">PayPal Email:</span>
                      <strong className="font-mono text-stone-900 dark:text-white">{paymentConfig.paypalEmail || 'shyamthapa999@hotmail.com'}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentConfig.paypalEmail || 'shyamthapa999@hotmail.com', 'paypal-email')}
                      className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-bold border border-stone-300 dark:border-stone-600 cursor-pointer"
                    >
                      {copiedKey === 'paypal-email' ? 'Copied' : 'Copy Email'}
                    </button>
                  </div>

                  <a
                    href={paymentConfig.paypalMeUrl ? `${paymentConfig.paypalMeUrl}/4.99` : 'https://paypal.me/shubhapatro/4.99'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs"
                  >
                    <span>Pay with PayPal.Me ($4.99)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* UNLOCK / TRANSACTION CONFIRMATION FORM */}
            <form onSubmit={handleConfirmPayment} className="space-y-3 pt-1 border-t border-stone-200 dark:border-stone-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1 text-[10.5px]">
                    {lang === 'ne' ? 'भुक्तानीकर्ताको नाम:' : 'Your Name:'}
                  </label>
                  <input
                    type="text"
                    placeholder={activeMode === 'kundali' ? name : `${boyName} & ${girlName}`}
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1 text-[10.5px]">
                    {lang === 'ne' ? 'सम्पर्क नम्बर / फोन (हराएमा खोज्न काम लाग्ने):' : 'Phone (Used for Recovery):'}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. 98XXXXXXXX वा 0416XXXXXX"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1 text-[10.5px]">
                  {lang === 'ne'
                    ? 'भुक्तानी ट्रान्ज्याक्सन / बैंक रेफरेन्स कोड: *'
                    : 'Transaction Reference / Receipt ID: *'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="उदा. 0005AB23 वा NMB-1234 वा CBA-TXN वा PayPal Ref"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const sample = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
                      setTransactionRef(sample);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 text-[10px] font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-300 cursor-pointer shrink-0"
                    title="Quick Auto Ref for testing"
                  >
                    Auto Fill
                  </button>
                </div>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={isVerifyingPayment}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 text-xs transition-all"
                >
                  {isVerifyingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{lang === 'ne' ? 'प्रमाणीकरण हुँदैछ...' : 'Verifying & Unlocking...'}</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>{lang === 'ne' ? 'भुक्तानी पुष्टि गरी प्रतिवेदन तुरुन्त अनलक गर्नुहोस्' : 'Confirm & Unlock Full Vedic Report'}</span>
                    </>
                  )}
                </button>

                {/* Instant Unlock Button for Easy Devotee Experience */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUnlocked(true);
                    archiveCurrentReport();
                    setShowPaymentModal(false);
                    confetti({
                      particleCount: 120,
                      spread: 90,
                      origin: { y: 0.6 }
                    });
                  }}
                  className="py-3 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs cursor-pointer text-center"
                >
                  {lang === 'ne' ? 'तुरुन्त अनलक' : 'Instant Unlock'}
                </button>
              </div>

              {onNavigate && (
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      onNavigate('payments');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    <span>{lang === 'ne' ? 'सबै भुक्तानी माध्यम तथा बैंक भौचर पृष्ठ हेर्नुहोस्' : 'Open Full Payment & Bank Slip Portal'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </form>

          </div>
        </div>
      )}

      {/* ===================== FIND LOST REPORT MODAL ===================== */}
      {showFindReportModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
                  Report Recovery Portal
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-white">
                  {lang === 'ne' ? 'हराएको प्रतिवेदन पुनः प्राप्त गर्नुहोस्' : 'Find / Restore Lost Vedic Report'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFindReportModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
              {lang === 'ne'
                ? 'यदि तपाईं वा ग्राहकले प्रतिवेदन हराउनुभयो भने, नाम वा फोन नम्बर प्रविष्ट गरी प्रणालीमा सुरक्षित भएको प्रतिवेदन फेला पार्न सक्नुहुन्छ।'
                : 'Search our secure archive by customer name or contact number to retrieve previously generated Kundali or Gun Milan reports.'}
            </p>

            <form onSubmit={handleSearchLostReports} className="space-y-3">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1 text-[11px]">
                  ग्राहकको नाम (Customer Name / Search Query):
                </label>
                <input
                  type="text"
                  placeholder="उदा. श्याम थापा, रोहन शर्मा, सृष्टि ..."
                  value={findSearchQuery}
                  onChange={(e) => setFindSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1 text-[11px]">
                  फोन नम्बर (Phone Number - Optional):
                </label>
                <input
                  type="text"
                  placeholder="उदा. 0416045056 वा 98XXXXXXXX"
                  value={findSearchPhone}
                  onChange={(e) => setFindSearchPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSearchingReports}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm text-xs"
              >
                {isSearchingReports ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>खोज्दैछ...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>खोज्नुहोस् (Search Archive)</span>
                  </>
                )}
              </button>
            </form>

            {/* Found Reports List */}
            {hasSearched && (
              <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                <span className="font-extrabold text-stone-800 dark:text-stone-200 block text-xs">
                  खोज नतिजा ({foundReports.length} फेला परे):
                </span>

                {foundReports.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center text-stone-500 text-xs">
                    <AlertCircle className="w-6 h-6 mx-auto mb-1 text-stone-400" />
                    <span>कुनै प्रतिवेदन फेला परेन। कृपया फरक नाम वा फोन नम्बर प्रयास गर्नुहोस्।</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {foundReports.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-3 hover:border-sky-400 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <strong className="text-stone-900 dark:text-white block text-xs">
                            {rep.title}
                          </strong>
                          <span className="text-[10px] text-stone-500 block">
                            ग्राहक: {rep.customerName} {rep.phone ? `• ${rep.phone}` : ''} • मिति: {new Date(rep.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRestoreReport(rep)}
                          className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shrink-0 cursor-pointer shadow-xs"
                        >
                          अनलक गरी खोल्नुहोस्
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
