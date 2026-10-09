import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  CreditCard, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Calculator, 
  DollarSign, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  Briefcase, 
  ArrowRight, 
  Copy, 
  Check, 
  Share2, 
  Landmark, 
  FileText,
  BadgeCheck,
  Send,
  Coins
} from 'lucide-react';
import { Language } from '../types';
import { 
  CURRENT_IPO_ISSUES, 
  NRN_COMMERCIAL_BANKS, 
  IPO_GUIDE_STEPS, 
  NRN_FAQS, 
  IpoIssue, 
  NrnBankDeposit,
  QUOTA_QUALIFICATION_CHECKLIST,
  NRN_BANK_PORTALS
} from '../data/nrnBankingData';
import { toNepaliDigits } from '../utils/nepaliCalendar';

interface NrnBankingIpoViewProps {
  lang: Language;
  onNavigate?: (tab: string) => void;
}

export const NrnBankingIpoView: React.FC<NrnBankingIpoViewProps> = ({ lang, onNavigate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'ipos' | 'guide' | 'rates' | 'assistance'>('ipos');
  const [selectedIpoFilter, setSelectedIpoFilter] = useState<'all' | 'open' | 'upcoming'>('all');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // FD Calculator States
  const [depositAmount, setDepositAmount] = useState<number>(500000);
  const [depositCurrency, setDepositCurrency] = useState<'NPR' | 'AUD' | 'USD'>('NPR');
  const [depositTenureYears, setDepositTenureYears] = useState<number>(1);
  const [selectedBankId, setSelectedBankId] = useState<string>(NRN_COMMERCIAL_BANKS[0].id);

  // Simulator and Checklist States
  const [simulatorKitta, setSimulatorKitta] = useState<number>(10);
  const [completedChecklist, setCompletedChecklist] = useState<string[]>(['shram', 'remit_account']);

  // FAQ Accordion State
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Lead Generation form state (for user wanting assistance to open an NRN account)
  const [leadName, setLeadName] = useState('');
  const [leadCountry, setLeadCountry] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [leadBankChoice, setLeadBankChoice] = useState('Nabil Bank');
  const [leadSuccess, setLeadSuccess] = useState(false);

  const selectedBank = NRN_COMMERCIAL_BANKS.find(b => b.id === selectedBankId) || NRN_COMMERCIAL_BANKS[0];

  // Calculation Logic
  const effectiveAnnualRate = depositTenureYears === 1 
    ? selectedBank.fixedDeposit1YrRate 
    : selectedBank.fixedDeposit2to5YrRate;

  const totalGrossInterest = (depositAmount * (effectiveAnnualRate / 100)) * depositTenureYears;
  const taxWithholding = totalGrossInterest * 0.05; // 5% TDS in Nepal
  const netInterest = totalGrossInterest - taxWithholding;
  const totalMaturityAmount = depositAmount + netInterest;
  const monthlyEquivalent = netInterest / (depositTenureYears * 12);

  const filteredIpos = CURRENT_IPO_ISSUES.filter(ipo => {
    if (selectedIpoFilter === 'open') return ipo.status === 'open';
    if (selectedIpoFilter === 'upcoming') return ipo.status === 'upcoming';
    return true;
  });

  const handleCopyLink = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(id);
      setTimeout(() => setCopiedLink(null), 2500);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadContact.trim()) return;

    // Smooth on-page lead registration
    try {
      const storedLeads = JSON.parse(localStorage.getItem('shubhapatro_nrn_inquiries') || '[]');
      storedLeads.unshift({
        id: Date.now().toString(),
        name: leadName.trim(),
        country: leadCountry,
        contact: leadContact.trim(),
        bank: leadBankChoice,
        date: new Date().toISOString()
      });
      localStorage.setItem('shubhapatro_nrn_inquiries', JSON.stringify(storedLeads.slice(0, 30)));
    } catch (_) {}

    setLeadSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-950 text-white p-6 sm:p-10 shadow-xl border border-sky-500/30">
        <div className="relative z-10 max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-black tracking-wide border border-white/10">
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>{lang === 'ne' ? '१०% वैदेशिक रोजगार IPO कोटा र NRN बैंकिङ' : '10% Foreign Employment IPO Quota & NRN Banking'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'ne'
              ? 'विदेशमा रहेका नेपालीहरूका लागि सुरक्षित सेयर लगानी तथा उच्च ब्याजदर'
              : 'Invest in Nepal from Abroad: Guaranteed 10% IPO Quota & High-Yield Deposits'}
          </h1>

          <p className="text-sky-100 text-xs sm:text-sm sm:leading-relaxed">
            {lang === 'ne'
              ? 'नेपाल धितोपत्र बोर्ड (SEBON) र नेपाल सरकारको नीतिअनुसार वैदेशिक रोजगारीमा रहेका नेपालीहरूका लागि प्रत्येक IPO मा १०% कोटा सुरक्षित गरिएको छ। साथै वाणिज्य बैंकहरूमा सामान्यभन्दा १% देखि २% सम्म अतिरिक्त ब्याजदरको रेमिट्यान्स मुद्दती खाता विदेशबाटै भिडियो KYC मार्फत खोल्न सकिन्छ।'
              : 'According to SEBON and Government of Nepal directives, 10% of every public IPO is legally reserved for Nepalis working abroad. Additionally, top commercial banks offer 1% to 2% extra interest on remittance deposits with 100% online Video-KYC account opening.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 font-bold text-amber-200">
              <BadgeCheck className="w-4 h-4 text-amber-300" />
              <span>{lang === 'ne' ? '१०% अनिवार्य आरक्षण कोटा' : '10% Reserved Quota'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 font-bold text-emerald-200">
              <Landmark className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'ne' ? '+१.००% देखि +२.००% अतिरिक्त ब्याज' : '+1% to +2% Extra FD Yield'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 font-bold text-sky-200">
              <ShieldCheck className="w-4 h-4 text-sky-300" />
              <span>{lang === 'ne' ? 'अनलाइन भिडियो KYC बाट सक्रिय' : 'Online Video-KYC'}</span>
            </div>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="absolute -right-10 -bottom-16 opacity-10 text-white pointer-events-none select-none">
          <TrendingUp className="w-96 h-96" />
        </div>
      </div>

      {/* Sub-Tab Navigation Switcher */}
      <div className="bg-white dark:bg-stone-900 p-2 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center gap-2">
        <button
          type="button"
          id="nrn-tab-ipos"
          onClick={() => setActiveSubTab('ipos')}
          className={`flex-1 min-w-[140px] py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'ipos'
              ? 'bg-sky-600 text-white shadow-xs font-black'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{lang === 'ne' ? '१. जारी तथा आगामी IPO' : '1. Live & Upcoming IPOs'}</span>
          <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.5 rounded-md">
            १०%
          </span>
        </button>

        <button
          type="button"
          id="nrn-tab-guide"
          onClick={() => setActiveSubTab('guide')}
          className={`flex-1 min-w-[140px] py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'guide'
              ? 'bg-sky-600 text-white shadow-xs font-black'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{lang === 'ne' ? '२. डिम्याट र C-ASBA प्रक्रिया' : '2. Demat & C-ASBA Guide'}</span>
        </button>

        <button
          type="button"
          id="nrn-tab-rates"
          onClick={() => setActiveSubTab('rates')}
          className={`flex-1 min-w-[140px] py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'rates'
              ? 'bg-sky-600 text-white shadow-xs font-black'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{lang === 'ne' ? '३. मुद्दती निक्षेप क्याल्कुलेटर' : '3. FD Rate Calculator'}</span>
        </button>

        <button
          type="button"
          id="nrn-tab-assistance"
          onClick={() => setActiveSubTab('assistance')}
          className={`flex-1 min-w-[140px] py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'assistance'
              ? 'bg-sky-600 text-white shadow-xs font-black'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{lang === 'ne' ? '४. खाता खोल्न सहायता' : '4. Account Assistance'}</span>
          <span className="text-[10px] bg-emerald-400 text-stone-950 font-black px-1.5 py-0.5 rounded-md">
            {lang === 'ne' ? 'निःशुल्क' : 'Free'}
          </span>
        </button>
      </div>

      {/* ===================== SUB-TAB 1: LIVE & UPCOMING IPOS ===================== */}
      {activeSubTab === 'ipos' && (
        <div className="space-y-6">
          
          {/* Filter Pills & Quota Alert */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold text-stone-700 dark:text-stone-300">
                {lang === 'ne' ? 'फिल्टर:' : 'Filter:'}
              </span>
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedIpoFilter('all')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    selectedIpoFilter === 'all' ? 'bg-sky-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {lang === 'ne' ? 'सबै (All)' : 'All Issues'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIpoFilter('open')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    selectedIpoFilter === 'open' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  🟢 {lang === 'ne' ? 'आवेदन खुला (Open)' : 'Open Now'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIpoFilter('upcoming')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    selectedIpoFilter === 'upcoming' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  ⏳ {lang === 'ne' ? 'आगामी (Upcoming)' : 'Upcoming'}
                </button>
              </div>
            </div>

            <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'ne' ? 'MeroShare मा सिधै आवेदन दिनुहोस्' : 'Direct application via MeroShare C-ASBA'}</span>
            </div>
          </div>

          {/* IPO Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredIpos.map((ipo) => {
              const isOpen = ipo.status === 'open';
              const isUpcoming = ipo.status === 'upcoming';

              return (
                <div 
                  key={ipo.id} 
                  className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 bg-white dark:bg-stone-900 shadow-sm flex flex-col justify-between space-y-5 ${
                    isOpen 
                      ? 'border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-500/20 shadow-md' 
                      : 'border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Header Row: Symbol & Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white px-2.5 py-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
                            {ipo.symbol}
                          </span>
                          <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400">
                            {lang === 'ne' ? ipo.sectorNe : ipo.sectorEn}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-white mt-1 leading-snug">
                          {lang === 'ne' ? ipo.companyNameNe : ipo.companyNameEn}
                        </h3>
                      </div>

                      <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-full shrink-0 ${
                        isOpen 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 animate-pulse'
                          : isUpcoming 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                          : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                      }`}>
                        {isOpen ? (lang === 'ne' ? 'खुला छ' : 'Open') : isUpcoming ? (lang === 'ne' ? 'चाँडै आउँदै' : 'Upcoming') : (lang === 'ne' ? 'बन्द' : 'Closed')}
                      </span>
                    </div>

                    {/* Key IPO Metric Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                        <span className="text-[10px] text-stone-400 block font-medium">प्रति कित्ता मूल्य:</span>
                        <span className="font-black text-sm text-stone-900 dark:text-white">
                          रु {toNepaliDigits(ipo.pricePerShare)}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                        <span className="text-[10px] text-stone-400 block font-medium">न्यूनतम कित्ता:</span>
                        <span className="font-black text-sm text-stone-900 dark:text-white">
                          {toNepaliDigits(ipo.minimumKitta)} कित्ता (रु {toNepaliDigits(ipo.minimumKitta * ipo.pricePerShare)})
                        </span>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-amber-800 dark:text-amber-400 block font-bold">विदेश कोटा:</span>
                        <span className="font-extrabold text-xs text-amber-900 dark:text-amber-200">
                          {ipo.foreignQuotaShares}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Info */}
                    <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 dark:text-stone-400">निष्कासन मिति:</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {ipo.openingDateBs} देखि {ipo.closingDateBs}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 dark:text-stone-400">निष्कासन प्रबन्धक:</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {lang === 'ne' ? ipo.issueManagerNe : ipo.issueManagerEn}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 dark:text-stone-400">क्रेडिट रेटिङ:</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {lang === 'ne' ? ipo.ratingNe : ipo.ratingEn}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {lang === 'ne' ? ipo.descriptionNe : ipo.descriptionEn}
                    </p>
                  </div>

                  {/* Action Button: Apply on MeroShare */}
                  <div className="pt-2 flex items-center gap-3">
                    <a
                      href={ipo.meroshareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
                        isOpen
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
                          : 'bg-sky-600 hover:bg-sky-500 text-white'
                      }`}
                    >
                      <span>{lang === 'ne' ? 'MeroShare मा आवेदन दिनुहोस्' : 'Apply on MeroShare'}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(ipo.meroshareUrl, ipo.id)}
                      className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                      title="MeroShare लिङ्क प्रतिलिपि गर्नुहोस्"
                    >
                      {copiedLink === ipo.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quota Advantage Notice */}
          <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 font-black shadow-xs">
              १०%
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-black text-sm sm:text-base text-amber-950 dark:text-amber-200">
                {lang === 'ne' ? 'वैदेशिक रोजगार १०% कोटाको फाइदा के हो?' : 'What is the big advantage of the 10% Foreign Quota?'}
              </h4>
              <p className="text-amber-900/90 dark:text-amber-300 leading-relaxed">
                {lang === 'ne'
                  ? 'सर्वसाधारण कोटामा २० लाखभन्दा बढी मानिसले आवेदन गर्दा भाग्यशाली गोलाप्रथाबाट ५% देखि १०% ले मात्र सेयर पाउँछन्। तर वैदेशिक रोजगार कोटामा सिमित आवेदक मात्र हुने भएकाले आवेदन दिने प्रायः १००% मानिसहरूलाई न्यूनतम १० देखि ५० कित्ता सेयर पर्ने उच्च सम्भावना रहन्छ।'
                  : 'In the general public quota, over 2 million applicants compete for lottery selection with less than a 7% hit rate. In the Foreign Employment quota, verified applicant numbers are much lower, resulting in nearly 100% successful allotments!'}
              </p>
            </div>
          </div>

          {/* Interactive IPO Allotment Odds Simulator */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-black">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{lang === 'ne' ? 'प्रत्यक्ष तुलना सिमुलेटर' : 'Live Allotment Odds Simulator'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white mt-1.5">
                  {lang === 'ne' ? 'वैदेशिक रोजगार कोटा (१०%) vs सर्वसाधारण लटरी तुलना' : 'Foreign Employment (10%) vs General Public Lottery'}
                </h3>
              </div>

              {/* Kitta Selector */}
              <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-bold">
                <span className="text-stone-500 px-2">{lang === 'ne' ? 'आवेदन कित्ता:' : 'Applied Kitta:'}</span>
                {[10, 20, 30, 50].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSimulatorKitta(k)}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                      simulatorKitta === k
                        ? 'bg-sky-600 text-white font-black shadow-xs'
                        : 'text-stone-600 dark:text-stone-300 hover:text-sky-600'
                    }`}
                  >
                    {toNepaliDigits(k)} {lang === 'ne' ? 'कित्ता' : 'Kitta'}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Cards: Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option A: Foreign Employment Quota (Green Winner) */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/40 to-stone-50 dark:from-stone-900 dark:via-emerald-950/30 dark:to-stone-900 border-2 border-emerald-500 dark:border-emerald-700 shadow-sm space-y-4 relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-2xs">
                  {lang === 'ne' ? 'उच्च सम्भावना (Win)' : 'Guaranteed Tier'}
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                    {lang === 'ne' ? 'विकल्प १: वैदेशिक रोजगार कोटा' : 'Option 1: Foreign Employment Quota'}
                  </span>
                  <h4 className="text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-1">
                    १००% {lang === 'ne' ? 'निश्चित सेयर पर्ने सम्भावना' : 'Allotment Probability'}
                  </h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-emerald-200/60 dark:border-emerald-900/60">
                    <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'औसत कुल आवेदक संख्या:' : 'Average Verified Applicants:'}</span>
                    <span className="font-bold text-stone-900 dark:text-white">~४०,००० देखि ५०,०००</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-200/60 dark:border-emerald-900/60">
                    <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? '१०% सुरक्षित सेयर संख्या:' : 'Reserved 10% Shares:'}</span>
                    <span className="font-bold text-stone-900 dark:text-white">१,५०,००० देखि ३,००,०००</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-200/60 dark:border-emerald-900/60">
                    <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'आवेदक प्रति सेयर अनुपात:' : 'Shares per Applicant:'}</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">१० देखि ५० कित्तासम्म पक्का</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-100/70 dark:bg-emerald-950/80 rounded-2xl text-xs text-emerald-950 dark:text-emerald-200 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {lang === 'ne'
                      ? `रु ${toNepaliDigits(simulatorKitta * 100)} लगानीमा प्रायः सबै ${toNepaliDigits(simulatorKitta)} कित्ता नै हात पर्दछ!`
                      : `At NPR ${simulatorKitta * 100} invested, you are practically guaranteed the full ${simulatorKitta} shares!`}
                  </span>
                </div>
              </div>

              {/* Option B: General Public Quota (Red Risk) */}
              <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                    {lang === 'ne' ? 'विकल्प २: सर्वसाधारण लटरी कोटा' : 'Option 2: General Public Quota'}
                  </span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full">
                    {lang === 'ne' ? 'गोलाप्रथा जोखिम' : 'Pure Lottery'}
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl font-black text-rose-700 dark:text-rose-400">
                    ~६.५% {lang === 'ne' ? 'मात्र गोलाप्रथा सम्भावना' : 'Hit Probability'}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {lang === 'ne' ? '९३.५% भन्दा धेरै आवेदकको हात रित्तो हुन्छ' : 'Over 93.5% of applicants get 0 shares'}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-200/80 dark:border-stone-700">
                    <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'कुल आवेदक संख्या:' : 'Average Applicants:'}</span>
                    <span className="font-bold text-stone-900 dark:text-white">२२,००,००० देखि २५,००,०००+</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/80 dark:border-stone-700">
                    <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? '१० कित्ता पाउने भाग्यशाली:' : 'Lottery Winners:'}</span>
                    <span className="font-bold text-stone-900 dark:text-white">१,३५,००० देखि १,५०,००० जना</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/80 dark:border-stone-700">
                    <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'नतिजा:' : 'Outcome:'}</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">अधिकांशलाई पर्दैन</span>
                  </div>
                </div>

                <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-xs text-stone-600 dark:text-stone-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>
                    {lang === 'ne'
                      ? 'त्यसैले विदेशमा रहेका नेपालीले आफ्नो C-ASBA लाई वैदेशिक रोजगार कोटामा प्रमाणित गर्नु अनिवार्य छ!'
                      : 'This is why tagging your C-ASBA account under Foreign Employment is essential!'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ===================== SUB-TAB 2: STEP-BY-STEP DEMAT & C-ASBA GUIDE ===================== */}
      {activeSubTab === 'guide' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                {lang === 'ne' 
                  ? 'विदेशबाटै डिम्याट र १०% IPO कोटा प्राप्त गर्ने ४ सजिला चरणहरू' 
                  : '4 Simple Steps to Open NRN Demat & Qualify for 10% IPO Quota'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                {lang === 'ne'
                  ? 'कुनै पनि भौतिक रूपमा नेपाल पुग्नु पर्दैन, सम्पूर्ण प्रक्रिया मोबाइल र इन्टरनेटबाटै पूरा हुन्छ।'
                  : 'No physical presence in Nepal is required. The entire procedure is completed digitally via online video KYC.'}
              </p>
            </div>

            <div className="space-y-6">
              {IPO_GUIDE_STEPS.map((step) => (
                <div 
                  key={step.stepNumber}
                  className="p-5 sm:p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white font-black flex items-center justify-center shrink-0 shadow-md shadow-sky-900/20 text-sm">
                      {step.stepNumber}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-white">
                        {lang === 'ne' ? step.titleNe : step.titleEn}
                      </h3>
                      <p className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                        {lang === 'ne' ? step.taglineNe : step.taglineEn}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 pl-1 sm:pl-13">
                    {(lang === 'ne' ? step.detailsNe : step.detailsEn).map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  {step.proTipNe && (
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-200/80 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 ml-0 sm:ml-13">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong>{lang === 'ne' ? 'विशेष सुझाव (Pro Tip):' : 'Pro Tip:'}</strong>{' '}
                        <span>{lang === 'ne' ? step.proTipNe : step.proTipEn}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Direct Links to Merchant Capitals for Demat */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300">
                {lang === 'ne' ? 'अनलाइन डिम्याट खोल्ने प्रमुख क्यापिटलहरू:' : 'Popular Merchant Capitals with Online Demat:'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
                <a
                  href="https://nabilinvest.com.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-sky-500 flex items-center justify-between text-stone-800 dark:text-stone-200 transition-colors"
                >
                  <span>Nabil Invest</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>

                <a
                  href="https://globalimecapital.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-sky-500 flex items-center justify-between text-stone-800 dark:text-stone-200 transition-colors"
                >
                  <span>Global IME Capital</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>

                <a
                  href="https://nicasiacapital.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-sky-500 flex items-center justify-between text-stone-800 dark:text-stone-200 transition-colors"
                >
                  <span>NIC Asia Capital</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>

                <a
                  href="https://sanimacapital.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-sky-500 flex items-center justify-between text-stone-800 dark:text-stone-200 transition-colors"
                >
                  <span>Sanima Capital</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>
            </div>

            {/* Interactive Quota Qualification Checklist */}
            <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-xs font-black">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'ne' ? 'अनिवार्य ५ बुँदे चेकलिस्ट' : 'Mandatory 5-Step Verification Checklist'}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white mt-1.5">
                    {lang === 'ne' ? '१०% कोटामा आवेदन दिन तपाईं तयार हुनुहुन्छ?' : 'Are You Ready for the 10% Foreign Quota?'}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl">
                  <span>{lang === 'ne' ? 'तयारी अवस्था:' : 'Readiness:'}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">
                    {Math.round((completedChecklist.length / QUOTA_QUALIFICATION_CHECKLIST.length) * 100)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {QUOTA_QUALIFICATION_CHECKLIST.map((item) => {
                  const isChecked = completedChecklist.includes(item.id);
                  const toggleCheck = () => {
                    if (isChecked) {
                      setCompletedChecklist(completedChecklist.filter(id => id !== item.id));
                    } else {
                      setCompletedChecklist([...completedChecklist, item.id]);
                    }
                  };

                  return (
                    <div
                      key={item.id}
                      onClick={toggleCheck}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isChecked
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                          : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 hover:border-sky-300'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked ? 'bg-emerald-600 text-white' : 'border-2 border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900'
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1 text-xs flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-extrabold text-stone-900 dark:text-white text-xs sm:text-sm">
                            {lang === 'ne' ? item.titleNe : item.titleEn}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            item.status === 'mandatory'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : item.status === 'critical'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                          }`}>
                            {item.status === 'mandatory' ? (lang === 'ne' ? 'अनिवार्य' : 'Mandatory') : item.status === 'critical' ? (lang === 'ne' ? 'महत्वपूर्ण' : 'Critical') : (lang === 'ne' ? 'अनलाइन' : 'Online')}
                          </span>
                        </div>

                        <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                          {lang === 'ne' ? item.requirementNe : item.requirementEn}
                        </p>

                        <p className="text-[10px] text-sky-700 dark:text-sky-400 font-semibold pt-0.5">
                          💡 {lang === 'ne' ? item.verificationTipNe : item.verificationTipEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SUB-TAB 3: BANK REMITTANCE FD RATES & CALCULATOR ===================== */}
      {activeSubTab === 'rates' && (
        <div className="space-y-8">
          
          {/* Interactive Calculator Section */}
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-sky-600" />
                  <span>{lang === 'ne' ? 'NRN रेमिट्यान्स मुद्दती निक्षेप क्याल्कुलेटर' : 'NRN Remittance Fixed Deposit Calculator'}</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {lang === 'ne'
                    ? 'रेमिट्यान्स मुद्दती निक्षेपमा सामान्य बचतभन्दा १% देखि २% सम्म बढी ब्याज प्राप्त हुन्छ।'
                    : 'Remittance fixed deposits yield 1% to 2% higher interest compared to standard domestic deposits.'}
                </p>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDepositCurrency('NPR')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer ${depositCurrency === 'NPR' ? 'bg-sky-600 text-white' : 'text-stone-500'}`}
                >
                  NPR (रु)
                </button>
                <button
                  type="button"
                  onClick={() => setDepositCurrency('AUD')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer ${depositCurrency === 'AUD' ? 'bg-sky-600 text-white' : 'text-stone-500'}`}
                >
                  AUD (A$)
                </button>
                <button
                  type="button"
                  onClick={() => setDepositCurrency('USD')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer ${depositCurrency === 'USD' ? 'bg-sky-600 text-white' : 'text-stone-500'}`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Inputs (7 cols) */}
              <div className="lg:col-span-7 space-y-4 text-xs">
                
                {/* Bank Selector */}
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1.5">
                    {lang === 'ne' ? 'बैंक चयन गर्नुहोस् (Select Commercial Bank):' : 'Select Bank:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {NRN_COMMERCIAL_BANKS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBankId(b.id)}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer font-bold ${
                          selectedBankId === b.id
                            ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-500 ring-2 ring-sky-400 text-sky-950 dark:text-sky-100'
                            : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-sky-300'
                        }`}
                      >
                        <span className="block text-xs truncate">{b.bankLogoText}</span>
                        <span className="text-[10px] text-emerald-600 font-black">
                          {b.fixedDeposit1YrRate}% (1Yr)
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Slider & Input */}
                <div>
                  <div className="flex justify-between font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    <span>{lang === 'ne' ? 'निक्षेप रकम (Deposit Amount):' : 'Deposit Amount:'}</span>
                    <span className="font-mono text-sm text-sky-600 font-black">
                      {depositCurrency === 'NPR' ? 'रु ' : depositCurrency === 'AUD' ? 'A$ ' : '$ '}
                      {depositAmount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={depositCurrency === 'NPR' ? 50000 : 1000}
                    max={depositCurrency === 'NPR' ? 5000000 : 100000}
                    step={depositCurrency === 'NPR' ? 50000 : 1000}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <div className="flex gap-2 mt-2">
                    {[100000, 500000, 1000000, 2500000].map((amt) => {
                      const displayAmt = depositCurrency === 'NPR' ? amt : amt / 100;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDepositAmount(displayAmt)}
                          className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-sky-100 dark:hover:bg-sky-950 text-[11px] font-bold text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                        >
                          {depositCurrency === 'NPR' ? `रु ${displayAmt / 100000} लाख` : `$${displayAmt.toLocaleString()}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tenure Selector */}
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1.5">
                    {lang === 'ne' ? 'मुद्दती अवधि (Tenure):' : 'Tenure Duration:'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 5].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setDepositTenureYears(yr)}
                        className={`py-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                          depositTenureYears === yr
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {toNepaliDigits(yr)} {lang === 'ne' ? 'वर्ष' : yr === 1 ? 'Year' : 'Years'}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Outputs Calculation Card (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-sky-50 to-indigo-50/80 dark:from-stone-800 dark:to-stone-850 p-6 rounded-3xl border border-sky-200 dark:border-stone-700 space-y-4 shadow-sm">
                <div className="border-b border-sky-200 dark:border-stone-700 pb-3">
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider block">
                    {selectedBank.bankNameNe}
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">ब्याजदर (Annual Rate):</span>
                    <span className="text-xl font-black text-sky-700 dark:text-sky-400">
                      {effectiveAnnualRate}% p.a.
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                    ✨ {selectedBank.extraRemittanceBonus}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-600 dark:text-stone-400">कुल आर्जित ब्याज:</span>
                    <span className="font-bold text-stone-900 dark:text-white">
                      {depositCurrency === 'NPR' ? 'रु ' : '$ '}
                      {Math.round(totalGrossInterest).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-stone-500">
                    <span>५% कर कट्टी (5% TDS):</span>
                    <span>- {depositCurrency === 'NPR' ? 'रु ' : '$ '}{Math.round(taxWithholding).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                    <span>खुद ब्याज आम्दानी (Net Interest):</span>
                    <span>{depositCurrency === 'NPR' ? 'रु ' : '$ '}{Math.round(netInterest).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sky-800 dark:text-sky-300 font-semibold text-[11px] pt-1 border-t border-sky-200/50 dark:border-stone-700">
                    <span>मासिक औसत आम्दानी:</span>
                    <span>{depositCurrency === 'NPR' ? 'रु ' : '$ '}{Math.round(monthlyEquivalent).toLocaleString()} / महिना</span>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-2xl border border-sky-300 dark:border-stone-600 text-center">
                  <span className="text-[11px] text-stone-400 font-medium block">
                    {depositTenureYears} वर्ष पछिको कुल भुक्तानी (Total Maturity):
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-0.5 block">
                    {depositCurrency === 'NPR' ? 'रु ' : '$ '}
                    {Math.round(totalMaturityAmount).toLocaleString()}
                  </span>
                </div>

                <a
                  href={selectedBank.onlineAccountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span>{selectedBank.bankLogoText} अनलाइन खाता खोल्नुहोस्</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>

          {/* Bank Comparative Table */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-sky-600" />
              <span>{lang === 'ne' ? 'नेपालका प्रमुख बैंकहरूको NRN मुद्दती ब्याजदर तुलना' : 'Commercial Banks NRN Remittance Deposit Rates Comparison'}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300 font-black">
                    <th className="p-3">वाणिज्य बैंक</th>
                    <th className="p-3">रेमिट्यान्स बचत</th>
                    <th className="p-3">१ वर्षे मुद्दती</th>
                    <th className="p-3">२-५ वर्षे मुद्दती</th>
                    <th className="p-3">USD डलर मुद्दती</th>
                    <th className="p-3">अनलाइन आवेदन</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                  {NRN_COMMERCIAL_BANKS.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-850 transition-colors">
                      <td className="p-3 font-bold text-stone-900 dark:text-white">
                        <div>{lang === 'ne' ? b.bankNameNe : b.bankNameEn}</div>
                        <span className="text-[10px] text-emerald-600 font-semibold">{b.extraRemittanceBonus}</span>
                      </td>
                      <td className="p-3 font-semibold">{b.remittanceSavingsRate}%</td>
                      <td className="p-3 font-black text-sky-700 dark:text-sky-400">{b.fixedDeposit1YrRate}%</td>
                      <td className="p-3 font-black text-indigo-700 dark:text-indigo-400">{b.fixedDeposit2to5YrRate}%</td>
                      <td className="p-3 font-semibold">{b.fcyDepositRateUSD}%</td>
                      <td className="p-3">
                        <a
                          href={b.onlineAccountUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Direct Bank NRN Online Portals & Video-KYC Links */}
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 text-xs font-black">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{lang === 'ne' ? 'प्रत्यक्ष अनलाइन भिडियो KYC पोर्टलहरू' : 'Direct Online Video-KYC Portals'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white mt-1.5">
                  {lang === 'ne' ? 'विदेशबाटै सिधै खाता खोल्ने आधिकारिक बैंक पोर्टल' : 'Open NRN Remittance Account Online Without Middlemen'}
                </h3>
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {lang === 'ne' ? 'शून्य मौज्दात (Zero Balance) • सुरक्षित' : 'Zero Balance • 100% Digital'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {NRN_BANK_PORTALS.map((portal) => (
                <div
                  key={portal.id}
                  className="p-5 rounded-2xl border border-stone-200 dark:border-stone-700/80 bg-stone-50/60 dark:bg-stone-800/40 hover:border-sky-400 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-black text-stone-900 dark:text-white text-sm">
                          {lang === 'ne' ? portal.nameNe : portal.nameEn}
                        </h4>
                        <p className="text-[11px] font-bold text-sky-700 dark:text-sky-400">
                          {lang === 'ne' ? portal.schemeNe : portal.schemeEn}
                        </p>
                      </div>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full shrink-0">
                        {portal.fdRate}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {portal.fcyCurrencies.map((c) => (
                        <span key={c} className="px-1.5 py-0.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded font-semibold text-stone-700 dark:text-stone-300">
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{portal.videoKycTime}</span>
                    </div>

                    <ul className="space-y-1 text-[11px] text-stone-600 dark:text-stone-300">
                      {(lang === 'ne' ? portal.featuresNe : portal.featuresEn).map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={portal.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <span>{lang === 'ne' ? 'बैंक पोर्टलमा खाता खोल्नुहोस्' : 'Open Account on Bank Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ===================== SUB-TAB 4: ACCOUNT OPENING ASSISTANCE FOR PUBLIC USERS ===================== */}
      {activeSubTab === 'assistance' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-sky-800 via-blue-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-sky-500/30 shadow-xl space-y-4">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? 'निःशुल्क सेवा तथा परामर्श' : 'Free Assistance & Guidance'}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white">
                {lang === 'ne' 
                  ? 'विदेशबाट NRN रेमिट्यान्स खाता, डिम्याट र C-ASBA लिन सहायता चाहिन्छ?' 
                  : 'Need Assistance Opening an NRN Remittance Account & C-ASBA from Abroad?'}
              </h2>
              <p className="text-sky-100 text-xs sm:text-sm leading-relaxed">
                {lang === 'ne'
                  ? 'यदि तपाईंलाई कुन बैंक उपयुक्त हुन्छ, अनलाइन भिडियो KYC कसरी प्रमाणित गर्ने, वा १०% IPO कोटाको लागि CRN नम्बर कसरी लिने भन्नेमा कुनै अलमल छ भने तलको फारम भर्नुहोस्। हाम्रो टिमले तपाईंलाई बैंकका आधिकारिक पोर्टलहरूसँग समन्वय गरी निःशुल्क प्राविधिक सहजीकरण गर्नेछ।'
                  : 'If you have questions about selecting the best bank, completing online Video-KYC, or obtaining your verified CRN for the 10% Foreign Employment IPO Quota, submit your inquiry below for guidance.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{lang === 'ne' ? '१००% आधिकारिक बैंक लिङ्क' : 'Direct Official Bank Portals'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-2.5">
                <BadgeCheck className="w-5 h-5 text-amber-300 shrink-0" />
                <span>{lang === 'ne' ? '१०% कोटा प्रमाणीकरण' : '10% Quota Verification Guide'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-sky-300 shrink-0" />
                <span>{lang === 'ne' ? '२४ घण्टाभित्र सम्पर्क' : 'Response Within 24 Hours'}</span>
              </div>
            </div>
          </div>

          {/* Lead Capture Form: User Requests Bank Account Assistance */}
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-5">
            <div>
              <h3 className="text-lg font-black text-stone-900 dark:text-white">
                {lang === 'ne' ? 'NRN खाता तथा डिम्याट सहजीकरण अनुरोध फारम' : 'Request NRN Banking & Demat Assistance'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {lang === 'ne'
                  ? 'यदि तपाईंलाई विदेशबाट खाता खोल्न कुनै प्राविधिक कठिनाई छ भने आफ्नो विवरण छाड्नुहोस्, हाम्रो टिमले बैंकसँग सहजीकरण गरिदिनेछ।'
                  : 'Leave your details to receive personalized assistance with opening your verified Remittance Demat and bank account.'}
              </p>
            </div>

            {leadSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>धन्यवाद! तपाईंको अनुरोध प्राप्त भयो। हामी छिट्टै सम्पर्क गर्नेछौं।</span>
              </div>
            )}

            <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                  तपाईंको नाम (Full Name): *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राम गुरुङ"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                  हाल बसोबास गरिरहेको देश (Current Country): *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. अष्ट्रेलिया / कतार / अमेरिका"
                  value={leadCountry}
                  onChange={(e) => setLeadCountry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                  सम्पर्क (Email वा WhatsApp नम्बर): *
                </label>
                <input
                  type="text"
                  required
                  placeholder="email@example.com वा +61 4XX XXX XXX"
                  value={leadContact}
                  onChange={(e) => setLeadContact(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                  इच्छुक बैंक (Preferred Bank):
                </label>
                <select
                  value={leadBankChoice}
                  onChange={(e) => setLeadBankChoice(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                >
                  <option value="Nabil Bank">नबिल बैंक (Nabil Bank)</option>
                  <option value="Global IME Bank">ग्लोबल आइएमई बैंक (Global IME)</option>
                  <option value="NIC Asia Bank">एनआईसी एशिया बैंक (NIC Asia)</option>
                  <option value="Everest Bank">एभरेष्ट बैंक (Everest Bank)</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer text-xs sm:text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>सहायता अनुरोध पठाउनुहोस् (Submit Lead)</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* ===================== FAQ ACCORDION ===================== */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-sky-600" />
          <span>{lang === 'ne' ? 'प्रायः सोधिने प्रश्नहरू (Frequently Asked Questions)' : 'NRN Banking & Demat FAQs'}</span>
        </h3>

        <div className="divide-y divide-stone-200 dark:divide-stone-800">
          {NRN_FAQS.map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-left font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                >
                  <span>{lang === 'ne' ? faq.qNe : faq.qEn}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0 text-stone-400" />}
                </button>

                {isExpanded && (
                  <p className="mt-2.5 text-xs text-stone-600 dark:text-stone-300 leading-relaxed animate-in fade-in">
                    {lang === 'ne' ? faq.aNe : faq.aEn}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
