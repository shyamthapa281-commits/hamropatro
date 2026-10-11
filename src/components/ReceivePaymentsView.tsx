import React, { useState, useEffect, useRef } from 'react';
import { 
  CreditCard, 
  Lock, 
  Unlock, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Printer, 
  Search, 
  FileSpreadsheet, 
  AlertCircle, 
  Wallet, 
  HeartHandshake, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  RefreshCw,
  HelpCircle,
  Smartphone,
  Phone,
  Mail,
  Receipt,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { PaymentConfig, ReceivedPayment, PaymentStatus } from '../types/payment';

interface ReceivePaymentsViewProps {
  lang: 'ne' | 'en';
  onNavigate?: (tab: string) => void;
  initialPurpose?: string;
}

const DEFAULT_CONFIG: PaymentConfig = {
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
  currencyAccepted: ['AUD', 'NPR', 'USD', 'EUR', 'GBP']
};

export const ReceivePaymentsView: React.FC<ReceivePaymentsViewProps> = ({
  lang,
  onNavigate,
  initialPurpose
}) => {
  // Public vs Owner Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // Merchant Config
  const [config, setConfig] = useState<PaymentConfig>(DEFAULT_CONFIG);
  const [editConfigForm, setEditConfigForm] = useState<PaymentConfig>(DEFAULT_CONFIG);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSaveSuccess, setConfigSaveSuccess] = useState(false);

  // Received Payments Ledger (For Owner Only)
  const [paymentsList, setPaymentsList] = useState<ReceivedPayment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [adminActiveTab, setAdminActiveTab] = useState<'ledger' | 'settings'>('ledger');

  // Customer Payer Form State
  const [selectedPurpose, setSelectedPurpose] = useState<string>(initialPurpose || 'vedic_kundali');
  const [selectedCurrency, setSelectedCurrency] = useState<'AUD' | 'NPR' | 'USD' | 'EUR'>('AUD');
  const [selectedAmount, setSelectedAmount] = useState<number>(38);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Available tailored channels:
  // 'stripe' (International cards/Apple Pay) | 'paypal' | 'nepal_bank' | 'aus_bank'
  const [selectedChannel, setSelectedChannel] = useState<'stripe' | 'paypal' | 'nepal_bank' | 'aus_bank'>('stripe');

  // Submission / Verification form
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [payerNotes, setPayerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<ReceivedPayment | null>(null);

  // Dynamic QR Code Canvas URL for bank or paypal
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Services Catalog
  const SERVICE_OPTIONS = [
    {
      id: 'vedic_kundali',
      nameNe: 'वैदिक कुण्डली तथा जन्मपत्रिका परामर्श',
      nameEn: 'Vedic Kundali & Horoscope Consultation',
      defaultAud: 38,
      defaultNpr: 1999,
      defaultUsd: 25,
      icon: '🔮',
      badgeNe: 'लोकप्रिय',
      badgeEn: 'Popular'
    },
    {
      id: 'temple_pooja',
      nameNe: 'पशुपतिनाथ मन्दिर विशेष पूजा सङ्कल्प',
      nameEn: 'Pashupatinath Temple Puja Sankalpa',
      defaultAud: 60,
      defaultNpr: 3499,
      defaultUsd: 40,
      icon: '🪔',
      badgeNe: 'विशेष',
      badgeEn: 'Sacred'
    },
    {
      id: 'gun_milan',
      nameNe: '३६ गुण मिलान तथा विवाह साइत',
      nameEn: 'Marriage 36 Gun Milan & Muhurta',
      defaultAud: 22,
      defaultNpr: 999,
      defaultUsd: 15,
      icon: '💍',
      badgeNe: 'वैदिक',
      badgeEn: 'Vedic'
    },
    {
      id: 'platform_support',
      nameNe: 'शुभ पात्रो प्लेटफर्म सञ्चालन तथा विकास सहयोग',
      nameEn: 'Shubha Patro Platform & Server Patronage',
      defaultAud: 15,
      defaultNpr: 500,
      defaultUsd: 10,
      icon: '🙏',
      badgeNe: 'पुण्य कार्य',
      badgeEn: 'Goodwill'
    },
    {
      id: 'other',
      nameNe: 'अन्य धार्मिक अनुष्ठान वा ऐच्छिक दक्षिणा',
      nameEn: 'Other Ritual or Custom Dakshina',
      defaultAud: 25,
      defaultNpr: 1000,
      defaultUsd: 20,
      icon: '✨',
      badgeNe: 'ऐच्छिक',
      badgeEn: 'Custom'
    }
  ];

  // Fetch Payment Configuration
  const fetchConfig = async () => {
    try {
      const headers: Record<string, string> = {};
      if (isAdminLoggedIn && adminPinInput) {
        headers['x-admin-pin'] = adminPinInput;
      }
      const res = await fetch('/api/payments/config', { headers });
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
        setEditConfigForm(data.config);
      }
    } catch (err) {
      console.warn('Error fetching payment config, using defaults:', err);
    }
  };

  // Fetch Ledger (only called if admin is logged in)
  const fetchPayments = async () => {
    if (!isAdminLoggedIn) return;
    setIsLoadingPayments(true);
    try {
      const res = await fetch('/api/payments/list');
      const data = await res.json();
      if (data.success && Array.isArray(data.payments)) {
        setPaymentsList(data.payments);
      }
    } catch (err) {
      console.error('Error fetching ledger:', err);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [isAdminLoggedIn]);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchPayments();
    }
  }, [isAdminLoggedIn]);

  // Update default amount when purpose or currency changes
  useEffect(() => {
    const s = SERVICE_OPTIONS.find(item => item.id === selectedPurpose);
    if (s && !customAmount) {
      if (selectedCurrency === 'AUD') {
        setSelectedAmount(s.defaultAud);
      } else if (selectedCurrency === 'NPR') {
        setSelectedAmount(s.defaultNpr);
      } else {
        setSelectedAmount(s.defaultUsd);
      }
    }
  }, [selectedPurpose, selectedCurrency]);

  const activeAmount = customAmount ? Number(customAmount) : selectedAmount;

  // Generate QR code for payment
  useEffect(() => {
    const generateQr = async () => {
      let qrPayload = '';
      if (selectedChannel === 'paypal') {
        qrPayload = config.paypalMeUrl ? `${config.paypalMeUrl}/${activeAmount}` : `mailto:${config.paypalEmail}`;
      } else if (selectedChannel === 'stripe') {
        qrPayload = config.stripePaymentLink || 'https://buy.stripe.com';
      } else if (selectedChannel === 'aus_bank') {
        qrPayload = `PayID: ${config.australiaPayId || config.supportEmail} | Amount: A$ ${activeAmount}`;
      } else {
        qrPayload = `Bank: ${config.nepalBankName} | A/C: ${config.nepalAccountNumber} | Name: ${config.nepalAccountHolder} | Amount: NPR ${activeAmount}`;
      }

      try {
        const url = await QRCode.toDataURL(qrPayload, {
          width: 280,
          margin: 2,
          color: {
            dark: '#1e293b',
            light: '#ffffff'
          }
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('QR code generation error:', err);
      }
    };

    generateQr();
  }, [selectedChannel, activeAmount, config]);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Verify Admin PIN
  const handleVerifyAdminPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPinInput.trim()) {
      setAdminPinError(lang === 'ne' ? 'कृपया पिन कोड प्रविष्ट गर्नुहोस्' : 'Please enter PIN code');
      return;
    }
    setIsVerifyingPin(true);
    setAdminPinError('');

    try {
      const res = await fetch('/api/payments/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: adminPinInput.trim() })
      });
      const data = await res.json();
      if (data.success && data.authorized) {
        setIsAdminLoggedIn(true);
        setShowAdminPinModal(false);
        setAdminPinError('');
      } else {
        setAdminPinError(data.error || (lang === 'ne' ? 'गलत पिन कोड! कृपया पुनः प्रयास गर्नुहोस्।' : 'Invalid PIN code! Please try again.'));
      }
    } catch (err) {
      setAdminPinError(lang === 'ne' ? 'प्रमाणीकरणमा समस्या आयो।' : 'Failed to verify PIN.');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminPinInput('');
    setPaymentsList([]);
  };

  // Submit payment verification by customer
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      alert(lang === 'ne' ? 'कृपया भुक्तानी ट्रान्ज्याक्सन आइडी / कारोबार नम्बर प्रविष्ट गर्नुहोस्।' : 'Please enter your Transaction Reference / Receipt ID.');
      return;
    }

    setIsSubmitting(true);
    const currentService = SERVICE_OPTIONS.find(s => s.id === selectedPurpose);

    const payload = {
      senderName: payerName.trim() || (lang === 'ne' ? 'शुभचिन्तक (भक्तजन)' : 'Anonymous Supporter'),
      senderPhone: payerPhone.trim() || 'Not specified',
      senderEmail: payerEmail.trim() || 'Not specified',
      servicePurpose: selectedPurpose,
      serviceName: lang === 'ne' ? currentService?.nameNe : currentService?.nameEn,
      amount: activeAmount,
      currency: selectedCurrency,
      paymentMethod: selectedChannel,
      transactionRef: transactionRef.trim(),
      notes: payerNotes.trim()
    };

    try {
      const res = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.payment) {
        setSubmittedReceipt(data.payment);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Submit payment error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin save configuration
  const handleSaveMerchantConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    setConfigSaveSuccess(false);

    try {
      const res = await fetch('/api/payments/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-pin': adminPinInput || config.adminPin
        },
        body: JSON.stringify(editConfigForm)
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setConfigSaveSuccess(true);
        setTimeout(() => setConfigSaveSuccess(false), 3500);
      } else {
        alert(data.error || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Save config error:', err);
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Admin toggling status of a payment in ledger
  const handleUpdateStatus = async (id: string, newStatus: PaymentStatus) => {
    try {
      const res = await fetch('/api/payments/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchPayments();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  // Export ledger to CSV
  const exportToCsv = () => {
    if (paymentsList.length === 0) return;
    const headers = ['Receipt No', 'Date', 'Sender Name', 'Phone', 'Email', 'Purpose', 'Amount', 'Currency', 'Method', 'Transaction Ref', 'Status', 'Notes'];
    const rows = paymentsList.map(p => [
      p.receiptNumber,
      new Date(p.createdAt).toLocaleDateString(),
      `"${p.senderName.replace(/"/g, '""')}"`,
      p.senderPhone,
      p.senderEmail,
      `"${p.serviceName.replace(/"/g, '""')}"`,
      p.amount,
      p.currency,
      p.paymentMethod.toUpperCase(),
      `"${p.transactionRef}"`,
      p.status.toUpperCase(),
      `"${(p.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shubhapatro_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered payments for ledger
  const filteredPayments = paymentsList.filter(p => {
    const matchesSearch = 
      p.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.transactionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.senderPhone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalNpr = paymentsList
    .filter(p => p.currency === 'NPR')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalAud = paymentsList
    .filter(p => p.currency === 'AUD')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalUsd = paymentsList
    .filter(p => p.currency === 'USD')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const currentService = SERVICE_OPTIONS.find(s => s.id === selectedPurpose);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* ========================================================= */}
      {/* 1. PUBLIC HERO HEADER BANNER                              */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-900 via-sky-850 to-indigo-950 text-white p-6 sm:p-10 shadow-2xl border border-sky-600/30">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold tracking-wide border border-white/10">
            <Wallet className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>{lang === 'ne' ? 'सुरक्षित सहयोग केन्द्र' : 'Official Secure Support Portal'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'ne'
              ? 'शुभ पात्रो सहयोग (Support)'
              : 'Shubha Patro Support Our Work'}
          </h1>

          <p className="text-sky-100 text-xs sm:text-sm sm:leading-relaxed max-w-3xl">
            {lang === 'ne'
              ? 'वैदिक कुण्डली विश्लेषण, पशुपतिनाथ मन्दिर विशेष पूजा सङ्कल्प, ३६ गुण मिलान तथा शुभ पात्रो प्लेटफर्म सेवाका लागि अष्ट्रेलिया, नेपाल तथा विश्वभरबाट सजिलै भुक्तानी गर्नुहोस्। Stripe (अन्तर्राष्ट्रिय कार्ड, Apple Pay, Google Pay), PayPal, नेपाल बैंक खाता ट्रान्सफर र अष्ट्रेलिया स्थानीय PayID उपलब्ध छ।'
              : 'Directly pay or offer sacred Dakshina for Vedic Kundali consultation, temple puja sankalpa, 36 Gun Milan, or platform server patronage. Accepts instant Stripe Cards (Apple Pay & Google Pay), PayPal, Direct Nepal Bank Transfer, and Australia PayID/BSB.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-sky-200">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ne' ? '१००% सुरक्षित र तत्काल रसिद' : '100% Secure & Instant Digital Receipt'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <CreditCard className="w-4 h-4 text-amber-300" />
              <span>{lang === 'ne' ? 'Stripe कार्ड / Apple Pay / Google Pay' : 'Stripe Cards / Apple Pay / Google Pay'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Globe className="w-4 h-4 text-sky-300" />
              <span>{lang === 'ne' ? 'अष्ट्रेलिया, नेपाल र विश्वभरबाट मान्य' : 'Australia, Nepal & Global Diaspora'}</span>
            </div>
          </div>
        </div>

        {/* Top-Right Owner Logged-in Notice (Only if admin is active) */}
        {isAdminLoggedIn && (
          <div className="relative z-10 mt-6 pt-4 border-t border-sky-700/50 flex flex-wrap items-center justify-between gap-3 bg-amber-500/10 p-3 rounded-2xl border border-amber-400/30">
            <div className="flex items-center gap-2 text-amber-300 text-xs sm:text-sm font-bold">
              <Unlock className="w-4 h-4 text-amber-300" />
              <span>{lang === 'ne' ? 'व्यवस्थापक सत्र सक्रिय छ (Owner Admin Active)' : 'Owner Admin Session Active'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdminActiveTab('ledger')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${adminActiveTab === 'ledger' ? 'bg-amber-400 text-stone-950 font-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {lang === 'ne' ? 'लेजर हेर्नुहोस्' : 'View Ledger'}
              </button>
              <button
                type="button"
                onClick={() => setAdminActiveTab('settings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${adminActiveTab === 'settings' ? 'bg-amber-400 text-stone-950 font-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {lang === 'ne' ? 'खाता सेटिङ' : 'Account Settings'}
              </button>
              <button
                type="button"
                onClick={handleLogoutAdmin}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600/80 hover:bg-rose-600 text-white transition-all flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>{lang === 'ne' ? 'लगआउट' : 'Lock'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. ADMIN DASHBOARD (IF OWNER IS LOGGED IN)                */}
      {/* ========================================================= */}
      {isAdminLoggedIn ? (
        <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
          {/* Admin Header Bar */}
          <div className="bg-gradient-to-r from-amber-900/90 via-stone-900 to-amber-950 text-white p-5 rounded-2xl border border-amber-500/30 shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-300 border border-amber-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <span>{lang === 'ne' ? 'निजी व्यवस्थापक खाता तथा लेजर' : 'Owner Admin Ledger & Configuration'}</span>
                  <span className="text-xs bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-black">
                    {lang === 'ne' ? 'गोप्य' : 'Private'}
                  </span>
                </h2>
                <p className="text-xs text-amber-200/80">
                  {lang === 'ne' 
                    ? 'यो खण्ड तपाईंका लागि मात्र हो, ग्राहकलाई यो देखिँदैन।' 
                    : 'This section is strictly for the owner and hidden from customers.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-stone-950/80 p-1 rounded-xl border border-amber-500/20">
                <button
                  type="button"
                  onClick={() => setAdminActiveTab('ledger')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${adminActiveTab === 'ledger' ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-300 hover:text-white'}`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 inline mr-1.5" />
                  {lang === 'ne' ? 'प्राप्त भुक्तानी लेजर' : 'Received Ledger'}
                </button>
                <button
                  type="button"
                  onClick={() => setAdminActiveTab('settings')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${adminActiveTab === 'settings' ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-300 hover:text-white'}`}
                >
                  <Building2 className="w-3.5 h-3.5 inline mr-1.5" />
                  {lang === 'ne' ? 'खाता विवरण परिवर्तन' : 'Payment Accounts'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogoutAdmin}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 flex items-center gap-1.5 transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ne' ? 'बन्द गर्नुहोस्' : 'Exit Admin'}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: RECEIVED TRANSACTIONS LEDGER */}
          {adminActiveTab === 'ledger' && (
            <div className="space-y-6">
              {/* Ledger Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <div className="text-xs text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider">
                    {lang === 'ne' ? 'कुल कारोबार सङ्ख्या' : 'Total Transactions'}
                  </div>
                  <div className="mt-2 text-2xl font-black text-stone-900 dark:text-white">
                    {paymentsList.length} <span className="text-xs text-stone-500 font-normal">items</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <div className="text-xs text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider">
                    {lang === 'ne' ? 'कुल अष्ट्रेलिया डलर (AUD)' : 'Total Collected (AUD)'}
                  </div>
                  <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    A$ {totalAud.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <div className="text-xs text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider">
                    {lang === 'ne' ? 'कुल नेपाली रुपैयाँ (NPR)' : 'Total Collected (NPR)'}
                  </div>
                  <div className="mt-2 text-2xl font-black text-sky-600 dark:text-sky-400">
                    रु {totalNpr.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <div className="text-xs text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider">
                    {lang === 'ne' ? 'अमेरिकी डलर (USD)' : 'Total Collected (USD)'}
                  </div>
                  <div className="mt-2 text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    $ {totalUsd.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Ledger Table & Controls */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1 min-w-[260px] relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      placeholder={lang === 'ne' ? 'नाम, फोन, कारोबार नम्बर खोजी गर्नुहोस्...' : 'Search by sender, phone, ref...'}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 focus:outline-none"
                    >
                      <option value="all">{lang === 'ne' ? 'सबै स्थिति (All Status)' : 'All Status'}</option>
                      <option value="verified">{lang === 'ne' ? 'प्रमाणित (Verified)' : 'Verified'}</option>
                      <option value="pending">{lang === 'ne' ? 'पेन्डिङ (Pending)' : 'Pending'}</option>
                      <option value="completed">{lang === 'ne' ? 'सम्पन्न (Completed)' : 'Completed'}</option>
                    </select>

                    <button
                      type="button"
                      onClick={fetchPayments}
                      className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-all"
                      title="Reload"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={exportToCsv}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === 'ne' ? 'Excel / CSV निर्यात' : 'Export CSV'}</span>
                    </button>
                  </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 font-semibold border-b border-stone-200 dark:border-stone-800">
                      <tr>
                        <th className="py-3 px-4">Receipt & Date</th>
                        <th className="py-3 px-4">Sender Details</th>
                        <th className="py-3 px-4">Purpose</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Method & Ref</th>
                        <th className="py-3 px-4">Status & Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                      {filteredPayments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-stone-500 dark:text-stone-400">
                            {lang === 'ne' ? 'कुनै कारोबार भेटिएन।' : 'No payment records found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredPayments.map(payment => (
                          <tr key={payment.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                            <td className="py-3.5 px-4 font-mono">
                              <span className="font-bold text-sky-600 dark:text-sky-400">{payment.receiptNumber}</span>
                              <div className="text-[11px] text-stone-400 mt-0.5">
                                {new Date(payment.createdAt).toLocaleString()}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-stone-900 dark:text-white">{payment.senderName}</div>
                              <div className="text-xs text-stone-500 dark:text-stone-400">{payment.senderPhone}</div>
                              <div className="text-[11px] text-stone-400">{payment.senderEmail}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300">
                                {payment.serviceName}
                              </span>
                              {payment.notes && (
                                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 italic line-clamp-1">
                                  "{payment.notes}"
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">
                              {payment.currency} {payment.amount.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-block uppercase px-2 py-0.5 rounded text-[10px] font-black tracking-wide bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                                {payment.paymentMethod}
                              </span>
                              <div className="font-mono text-xs text-stone-600 dark:text-stone-300 mt-1">
                                Ref: {payment.transactionRef}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  payment.status === 'verified'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : payment.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                }`}>
                                  {payment.status.toUpperCase()}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(payment.id, payment.status === 'verified' ? 'completed' : 'verified')}
                                  className="text-[11px] text-stone-500 hover:text-amber-600 underline cursor-pointer"
                                  title="Toggle Status"
                                >
                                  {lang === 'ne' ? 'स्थिति बदल्नुहोस्' : 'Toggle'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OWNER SETTINGS FORM */}
          {adminActiveTab === 'settings' && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                    {lang === 'ne' ? 'तपाईंका भुक्तानी खाता विवरण (Payment Credentials)' : 'Your Payment Account Credentials'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                    {lang === 'ne'
                      ? 'तपाईं अष्ट्रेलियामा बस्नुहुने भएकाले र १ नेपाल बैंक खाता, १ Stripe खाता तथा १ PayPal खाता भएकाले सोही अनुसार यहाँ अपडेट गर्नुहोस्।'
                      : 'Configured for your exact situation: living in Australia with 1 Nepal Bank Account, Stripe, and PayPal.'}
                  </p>
                </div>

                {configSaveSuccess && (
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{lang === 'ne' ? 'विवरण सुरक्षित रूपमा सेभ भयो!' : 'Settings successfully saved!'}</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveMerchantConfig} className="space-y-8">
                {/* 1. Australia Local Banking */}
                <div className="bg-stone-50 dark:bg-stone-800/40 p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-700/60 space-y-4">
                  <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold text-base">
                    <Building2 className="w-5 h-5 text-amber-500" />
                    <span>{lang === 'ne' ? '१. अष्ट्रेलिया स्थानीय बैंक विवरण (Australia Bank / PayID)' : '1. Australia Local Banking (PayID / BSB)'}</span>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                      {lang === 'ne' ? 'अष्ट्रेलियाका ग्राहकका लागि ० शुल्क' : 'Zero Fee for Australian Clients'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        Bank Name (बैंकको नाम)
                      </label>
                      <input
                        type="text"
                        value={editConfigForm.australiaBankName || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, australiaBankName: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Commonwealth Bank of Australia (CBA)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        PayID (Mobile or Email)
                      </label>
                      <input
                        type="text"
                        value={editConfigForm.australiaPayId || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, australiaPayId: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="shyamthapa281@gmail.com or 0400000000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        Account Holder Name (खातावालाको नाम)
                      </label>
                      <input
                        type="text"
                        value={editConfigForm.australiaAccountHolder || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, australiaAccountHolder: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Shyam Thapa"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        BSB Number
                      </label>
                      <input
                        type="text"
                        value={editConfigForm.australiaBsb || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, australiaBsb: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="062-000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={editConfigForm.australiaAccountNumber || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, australiaAccountNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="1234 5678"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Stripe Account (Cards / Apple Pay / Google Pay) */}
                <div className="bg-stone-50 dark:bg-stone-800/40 p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-700/60 space-y-4">
                  <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold text-base">
                    <CreditCard className="w-5 h-5 text-indigo-500" />
                    <span>{lang === 'ne' ? '२. Stripe कार्ड भुक्तानी (Stripe Payment Link)' : '2. Stripe Card Checkout (Stripe Payment Link)'}</span>
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                      Visa, Master, Amex, Apple Pay, Google Pay
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        Stripe Payment Link URL (तपाईंको स्ट्राइप पेमेन्ट लिङ्क)
                      </label>
                      <input
                        type="url"
                        value={editConfigForm.stripePaymentLink || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, stripePaymentLink: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="https://buy.stripe.com/..."
                      />
                      <p className="text-[11px] text-stone-500 mt-1">
                        {lang === 'ne' 
                          ? 'तपाईंको Stripe Dashboard > More > Payment Links बाट सिर्जना गरिएको लिंक राख्नुहोस्।' 
                          : 'Get this from your Stripe Dashboard > More > Payment Links.'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        Stripe Account Email
                      </label>
                      <input
                        type="email"
                        value={editConfigForm.stripeAccountEmail || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, stripeAccountEmail: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="shyamthapa281@gmail.com"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. PayPal Account */}
                <div className="bg-stone-50 dark:bg-stone-800/40 p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-700/60 space-y-4">
                  <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold text-base">
                    <Globe className="w-5 h-5 text-sky-500" />
                    <span>{lang === 'ne' ? '३. PayPal खाता विवरण (PayPal.Me)' : '3. PayPal Account (PayPal.Me)'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        PayPal Email
                      </label>
                      <input
                        type="email"
                        value={editConfigForm.paypalEmail || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, paypalEmail: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="shyamthapa281@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        PayPal.Me URL
                      </label>
                      <input
                        type="url"
                        value={editConfigForm.paypalMeUrl || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, paypalMeUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="https://paypal.me/shubhapatro"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Nepal Bank Account */}
                <div className="bg-stone-50 dark:bg-stone-800/40 p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-700/60 space-y-4">
                  <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold text-base">
                    <Building2 className="w-5 h-5 text-emerald-500" />
                    <span>{lang === 'ne' ? '४. नेपाल बैंक खाता विवरण (Nepal Bank Account)' : '4. Nepal Bank Account (Domestic & ConnectIPS)'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        Bank Name (बैंकको नाम)
                      </label>
                      <input
                        type="text"
                        value={editConfigForm.nepalBankName || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, nepalBankName: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Nabil Bank Limited / Global IME Bank"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        Account Number (खाता नम्बर)
                      </label>
                      <input
                        type="text"
                        value={editConfigForm.nepalAccountNumber || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, nepalAccountNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="01201010023456"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        Account Holder Name (खातावालाको नाम)
                      </label>
                      <input
                        type="text"
                        value={editConfigForm.nepalAccountHolder || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, nepalAccountHolder: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Shyam Thapa"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        Branch Name (शाखा)
                      </label>
                      <input
                        type="text"
                        value={editConfigForm.nepalBranch || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, nepalBranch: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Kathmandu, Nepal"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        SWIFT Code (for wire transfers)
                      </label>
                      <input
                        type="text"
                        value={editConfigForm.nepalSwiftCode || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, nepalSwiftCode: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="NARBNPKA"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Security PIN & Notification */}
                <div className="bg-stone-50 dark:bg-stone-800/40 p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-700/60 space-y-4">
                  <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold text-base">
                    <KeyRound className="w-5 h-5 text-rose-500" />
                    <span>{lang === 'ne' ? '५. व्यवस्थापक सुरक्षा पिन र सूचना इमेल' : '5. Security PIN & Notification'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        Admin Secret PIN (गोप्य पिन कोड)
                      </label>
                      <input
                        type="password"
                        value={editConfigForm.adminPin || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, adminPin: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="1234"
                      />
                      <p className="text-[11px] text-stone-500 mt-1">Default PIN is 1234. Change it anytime to protect your ledger.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                        Notification Email (भुक्तानी सूचना आउने इमेल)
                      </label>
                      <input
                        type="email"
                        value={editConfigForm.notificationEmail || ''}
                        onChange={e => setEditConfigForm({ ...editConfigForm, notificationEmail: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="shyamthapa281@gmail.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSavingConfig}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {isSavingConfig ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{lang === 'ne' ? 'सेभ हुँदैछ...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{lang === 'ne' ? 'परिवर्तनहरू सुरक्षित गर्नुहोस् (Save Settings)' : 'Save Settings'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : null}

      {/* ========================================================= */}
      {/* 3. CUSTOMER / PUBLIC MAKE PAYMENT INTERFACE               */}
      {/* ========================================================= */}
      <div className="space-y-8">
        
        {/* Step A: Choose Service Purpose & Amount */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-black text-sm">
                  १
                </span>
                <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
                  {lang === 'ne' ? 'सेवा वा सहयोग छान्नुहोस् (Select Service / Purpose)' : '1. Select Service or Dakshina Purpose'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 pl-9">
                {lang === 'ne'
                  ? 'तपाईंले लिन चाहेको सेवा वा शुभ पात्रो सञ्चालन सहयोग छान्नुहोस्'
                  : 'Choose the Vedic consultation, sacred puja, or goodwill donation you are paying for.'}
              </p>
            </div>

            {/* Currency Switcher (AUD, NPR, USD, EUR) */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-700">
              <span className="text-xs font-bold px-2 text-stone-500 dark:text-stone-400">
                {lang === 'ne' ? 'मुद्रा:' : 'Currency:'}
              </span>
              {(['AUD', 'NPR', 'USD', 'EUR'] as const).map(curr => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => {
                    setSelectedCurrency(curr);
                    setCustomAmount('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedCurrency === curr
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {SERVICE_OPTIONS.map(srv => {
              const isSelected = selectedPurpose === srv.id;
              const defaultAmt = selectedCurrency === 'AUD' ? srv.defaultAud : selectedCurrency === 'NPR' ? srv.defaultNpr : srv.defaultUsd;
              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => {
                    setSelectedPurpose(srv.id);
                    setCustomAmount('');
                    setSelectedAmount(defaultAmt);
                  }}
                  className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-sky-600 bg-sky-50/70 dark:bg-sky-950/40 shadow-md ring-2 ring-sky-600/20'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl">{srv.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-stone-700/80 text-stone-700 dark:text-stone-200">
                      {lang === 'ne' ? srv.badgeNe : srv.badgeEn}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white leading-snug">
                      {lang === 'ne' ? srv.nameNe : srv.nameEn}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between">
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                      {lang === 'ne' ? 'अनुमानित दक्षिणा:' : 'Dakshina:'}
                    </span>
                    <span className="text-sm font-black text-sky-700 dark:text-sky-300">
                      {selectedCurrency === 'AUD' ? `A$ ${srv.defaultAud}` : selectedCurrency === 'NPR' ? `रु ${srv.defaultNpr}` : `$ ${srv.defaultUsd}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Amount input & presets */}
          <div className="bg-stone-50 dark:bg-stone-800/40 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-700/60 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-stone-700 dark:text-stone-300">
                {lang === 'ne' ? 'भुक्तानी / दक्षिणा रकम (Amount to Pay):' : 'Amount to Pay:'}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-sky-800 dark:text-sky-300 mt-1">
                {selectedCurrency === 'AUD' ? `A$ ${activeAmount}` : selectedCurrency === 'NPR' ? `रु ${activeAmount.toLocaleString()}` : `${selectedCurrency} ${activeAmount}`}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                {lang === 'ne' ? 'अन्य रकम:' : 'Custom Amount:'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-bold">{selectedCurrency}</span>
                <input
                  type="number"
                  min="1"
                  placeholder="Custom"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  className="w-32 pl-12 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step B: Choose Payment Channel (Stripe, PayPal, Nepal Bank, Australia Bank) */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-black text-sm">
                २
              </span>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
                {lang === 'ne' ? 'भुक्तानी माध्यम छान्नुहोस् (Select Payment Method)' : '2. Select Payment Method'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 pl-9">
              {lang === 'ne'
                ? 'तपाईं जहाँ भए पनि (अष्ट्रेलिया, नेपाल वा विदेश) सजिलै भुक्तानी गर्नुहोस्'
                : 'Choose the most convenient payment channel for your current location.'}
            </p>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Stripe / Card */}
            <button
              type="button"
              onClick={() => setSelectedChannel('stripe')}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                selectedChannel === 'stripe'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-600/20'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                  Instant
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                  Stripe / Card Payment
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {lang === 'ne' ? 'अन्तर्राष्ट्रिय कार्ड, Apple Pay, Google Pay' : 'All Cards, Apple Pay, Google Pay'}
                </p>
              </div>
            </button>

            {/* 2. PayPal */}
            <button
              type="button"
              onClick={() => setSelectedChannel('paypal')}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                selectedChannel === 'paypal'
                  ? 'border-sky-600 bg-sky-50/70 dark:bg-sky-950/40 shadow-md ring-2 ring-sky-600/20'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Globe className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300">
                  Global
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                  PayPal / PayPal.Me
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {lang === 'ne' ? 'पेपाल खाता वा PayPal.Me लिङ्क' : 'Direct PayPal & PayPal.Me'}
                </p>
              </div>
            </button>

            {/* 3. Australia Local Bank / PayID */}
            <button
              type="button"
              onClick={() => setSelectedChannel('aus_bank')}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                selectedChannel === 'aus_bank'
                  ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-md ring-2 ring-amber-500/20'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Building2 className="w-6 h-6 text-amber-500" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                  0 Fee
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                  {lang === 'ne' ? 'अष्ट्रेलिया बैंक / PayID' : 'Australia Bank / PayID'}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {lang === 'ne' ? 'PayID वा BSB स्थानीय ट्रान्सफर' : 'Instant PayID & BSB Transfer'}
                </p>
              </div>
            </button>

            {/* 4. Nepal Bank Account */}
            <button
              type="button"
              onClick={() => setSelectedChannel('nepal_bank')}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                selectedChannel === 'nepal_bank'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-600/20'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  Nepal
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                  {lang === 'ne' ? 'नेपाल बैंक खाता' : 'Nepal Bank Transfer'}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {lang === 'ne' ? 'ConnectIPS / मोबाइल बैंकिङ' : 'ConnectIPS & Mobile Banking'}
                </p>
              </div>
            </button>
          </div>

          {/* CHANNEL SPECIFIC DETAILS CONTAINER */}
          <div className="bg-gradient-to-br from-stone-50 to-stone-100/70 dark:from-stone-800/60 dark:to-stone-850 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-700/80 space-y-6">
            
            {/* 1. STRIPE DETAILS */}
            {selectedChannel === 'stripe' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      <span>{lang === 'ne' ? 'Stripe मार्फत सुरक्षित कार्ड भुक्तानी' : 'Secure Card Payment via Stripe'}</span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {lang === 'ne'
                        ? 'अन्तर्राष्ट्रिय भिसा, मास्टरकार्ड, अमेरिकन एक्सप्रेस, एप्पल पे तथा गुगल पे मार्फत भुक्तानी गर्नुहोस्।'
                        : 'Supports all international Debit/Credit cards, Apple Pay, and Google Pay with bank-grade encryption.'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                    256-bit SSL Secure
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                  <div>
                    <div className="text-xs text-stone-500 font-semibold">{lang === 'ne' ? 'भुक्तानी गर्नुपर्ने रकम' : 'Amount'}</div>
                    <div className="text-xl sm:text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-0.5">
                      {selectedCurrency} {activeAmount}
                    </div>
                  </div>

                  <a
                    href={config.stripePaymentLink || 'https://buy.stripe.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
                  >
                    <span>{lang === 'ne' ? 'Stripe पेमेन्ट लिंक खोल्नुहोस्' : 'Pay via Stripe Checkout'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="text-xs text-stone-500 dark:text-stone-400 flex items-start gap-2 bg-indigo-50/50 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-200/50 dark:border-indigo-800/40">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>
                    {lang === 'ne'
                      ? 'Stripe मा भुक्तानी सम्पन्न भएपछि प्राप्त हुने Transaction ID तल चरण ३ मा राखी तत्काल आधिकारिक डिजिटल रसिद प्राप्त गर्नुहोस्।'
                      : 'After completing payment in Stripe, copy the Transaction/Charge ID into Step 3 below to receive your official verified receipt.'}
                  </span>
                </div>
              </div>
            )}

            {/* 2. PAYPAL DETAILS */}
            {selectedChannel === 'paypal' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-sky-600" />
                      <span>{lang === 'ne' ? 'PayPal वा PayPal.Me मार्फत भुक्तानी' : 'Pay via PayPal or PayPal.Me'}</span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {lang === 'ne'
                        ? 'विश्वभरबाट तपाईंको पेपाल खाता वा कार्ड मार्फत तत्काल सुरक्षित भुक्तानी गर्नुहोस्।'
                        : 'Instantly send payment worldwide using your PayPal account balance or linked card.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: PayPal.me link */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col justify-between gap-4">
                    <div>
                      <div className="text-xs text-stone-500 font-semibold">{lang === 'ne' ? 'PayPal.Me प्रत्यक्ष लिंक' : 'Direct PayPal.Me Link'}</div>
                      <div className="font-mono text-sm font-bold text-sky-600 dark:text-sky-400 mt-1 break-all">
                        {config.paypalMeUrl || `https://paypal.me/shubhapatro`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={config.paypalMeUrl ? `${config.paypalMeUrl}/${activeAmount}` : `https://paypal.me/shubhapatro`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <span>{lang === 'ne' ? 'PayPal मा तिर्नुहोस्' : 'Open in PayPal'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(config.paypalMeUrl, 'paypal-url')}
                        className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-all"
                        title="Copy Link"
                      >
                        {copiedKey === 'paypal-url' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Option 2: Direct PayPal Email */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col justify-between gap-4">
                    <div>
                      <div className="text-xs text-stone-500 font-semibold">{lang === 'ne' ? 'PayPal इमेल ठेगाना' : 'PayPal Email Address'}</div>
                      <div className="font-mono text-sm font-bold text-stone-900 dark:text-white mt-1">
                        {config.paypalEmail}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(config.paypalEmail, 'paypal-email')}
                      className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      {copiedKey === 'paypal-email' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedKey === 'paypal-email' ? 'इमेल प्रतिलिपि भयो!' : 'Copy PayPal Email'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. AUSTRALIA LOCAL BANKING DETAILS */}
            {selectedChannel === 'aus_bank' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-500" />
                      <span>{lang === 'ne' ? 'अष्ट्रेलिया स्थानीय बैंक तथा PayID' : 'Australia Local Bank (PayID / BSB)'}</span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {lang === 'ne'
                        ? 'अष्ट्रेलियामा रहनुहुने भक्तजन तथा शुभचिन्तकहरूले कुनै शुल्क बिना तत्काल PayID वा Osko/BSB मार्फत रकम पठाउन सक्नुहुन्छ।'
                        : 'If you reside in Australia, pay instantly with zero international fees via PayID or BSB transfer.'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                    AUD Local Transfer
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* PayID Card */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        ⚡ Quick PayID (Mobile / Email)
                      </div>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                        Instant Osko
                      </span>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-stone-500">PayID Identifier:</div>
                        <div className="font-mono text-sm font-black text-stone-900 dark:text-white">
                          {config.australiaPayId || config.supportEmail}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(config.australiaPayId || config.supportEmail, 'payid')}
                        className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 text-stone-700 dark:text-stone-300"
                        title="Copy PayID"
                      >
                        {copiedKey === 'payid' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-500">
                      Open CommBank, ANZ, NAB, Westpac, or any AU Banking App &gt; Pay Someone &gt; By PayID.
                    </div>
                  </div>

                  {/* BSB & Account Number Card */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm space-y-3">
                    <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      🏦 Bank Account & BSB
                    </div>

                    <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300 font-medium">
                      <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                        <span className="text-stone-500">Bank:</span>
                        <span className="font-bold">{config.australiaBankName || 'Commonwealth Bank of Australia'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                        <span className="text-stone-500">Account Name:</span>
                        <span className="font-bold">{config.australiaAccountHolder || 'Shyam Thapa'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                        <span className="text-stone-500">BSB:</span>
                        <span className="font-mono font-bold">{config.australiaBsb || '062-000'}</span>
                      </div>
                      <div className="flex justify-between py-1 items-center">
                        <span className="text-stone-500">Account No:</span>
                        <span className="font-mono font-bold">{config.australiaAccountNumber || '1234 5678'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(`BSB: ${config.australiaBsb} Acc: ${config.australiaAccountNumber} Name: ${config.australiaAccountHolder}`, 'aus-acc')}
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      {copiedKey === 'aus-acc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'aus-acc' ? 'विवरण प्रतिलिपि भयो!' : 'Copy Bank Details'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. NEPAL BANK ACCOUNT DETAILS */}
            {selectedChannel === 'nepal_bank' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                      <span>{lang === 'ne' ? 'नेपाल बैंक खाता प्रत्यक्ष ट्रान्सफर' : 'Direct Nepal Bank Transfer'}</span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {lang === 'ne'
                        ? 'नेपालका कुनै पनि मोबाइल बैंकिङ एप, ConnectIPS वा बैंक काउन्टरबाट सीधा खातामा जम्मा गर्नुहोस्।'
                        : 'Transfer directly using ConnectIPS, Nepal Mobile Banking, or bank counter.'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                    ConnectIPS / Mobile Banking
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bank Info Table Card */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm space-y-3">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      📋 बैंक खाता विवरण (Account Details)
                    </div>

                    <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                      <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
                        <span className="text-stone-500">{lang === 'ne' ? 'बैंकको नाम:' : 'Bank Name:'}</span>
                        <span className="font-bold">{config.nepalBankName}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
                        <span className="text-stone-500">{lang === 'ne' ? 'खातावालाको नाम:' : 'Account Holder:'}</span>
                        <span className="font-bold">{config.nepalAccountHolder}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800 items-center">
                        <span className="text-stone-500">{lang === 'ne' ? 'खाता नम्बर:' : 'Account Number:'}</span>
                        <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-400">
                          {config.nepalAccountNumber}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
                        <span className="text-stone-500">{lang === 'ne' ? 'शाखा:' : 'Branch:'}</span>
                        <span className="font-semibold">{config.nepalBranch}</span>
                      </div>
                      {config.nepalSwiftCode && (
                        <div className="flex justify-between py-1.5">
                          <span className="text-stone-500">SWIFT Code:</span>
                          <span className="font-mono">{config.nepalSwiftCode}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(`Bank: ${config.nepalBankName}\nA/C: ${config.nepalAccountNumber}\nName: ${config.nepalAccountHolder}\nBranch: ${config.nepalBranch}`, 'nepal-bank-all')}
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      {copiedKey === 'nepal-bank-all' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'nepal-bank-all' ? 'विवरण प्रतिलिपि भयो!' : 'Copy Bank Details'}</span>
                    </button>
                  </div>

                  {/* QR Code Card */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
                    <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      📱 Scan to Pay / QR कोड
                    </div>
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Bank QR Code"
                        className="w-44 h-44 rounded-xl border border-stone-200 dark:border-stone-700 p-1 shadow-inner bg-white"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center bg-stone-100 dark:bg-stone-800 rounded-xl">
                        <RefreshCw className="w-6 h-6 animate-spin text-stone-400" />
                      </div>
                    )}
                    <p className="text-[11px] text-stone-500">
                      {lang === 'ne' ? 'कुनै पनि बैंकिङ वा वालेट एपबाट स्क्यान गर्न सक्नुहुन्छ।' : 'Scan using your mobile banking application.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step C: Submit Confirmation & Get Instant Verifiable Receipt */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-black text-sm">
                ३
              </span>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
                {lang === 'ne' ? 'भुक्तानी पुष्टि र रसिद प्राप्त गर्नुहोस् (Confirm & Get Official Receipt)' : '3. Payment Confirmation & Instant Receipt'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 pl-9">
              {lang === 'ne'
                ? 'भुक्तानी गरिसकेपछि प्राप्त कारोबार नम्बर (Transaction ID / Reference) यहाँ राखेर आधिकारिक डिजिटल रसिद तुरुन्तै डाउनलोड गर्नुहोस्।'
                : 'Enter your transaction reference / receipt number to instantly generate your verified digital receipt.'}
            </p>
          </div>

          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ne' ? 'तपाईंको नाम (Full Name) *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={payerName}
                  onChange={e => setPayerName(e.target.value)}
                  placeholder={lang === 'ne' ? 'उदा: राम प्रसाद शर्मा' : 'e.g. John Doe / Ram Sharma'}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ne' ? 'सम्पर्क फोन / WhatsApp *' : 'Phone / WhatsApp *'}
                </label>
                <input
                  type="text"
                  required
                  value={payerPhone}
                  onChange={e => setPayerPhone(e.target.value)}
                  placeholder="+61 400 000 000 / +977 9841..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ne' ? 'इमेल ठेगाना (Email)' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={payerEmail}
                  onChange={e => setPayerEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ne' ? 'कारोबार नम्बर (Transaction Ref / ID / Slip No) *' : 'Transaction Ref / ID / Receipt Number *'}
                </label>
                <input
                  type="text"
                  required
                  value={transactionRef}
                  onChange={e => setTransactionRef(e.target.value)}
                  placeholder={lang === 'ne' ? 'उदा: ch_3Nxxx, TXN-998234, वा भौचर नं' : 'e.g. ch_3Nxxx, TXN-88210, Ref ID'}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ne' ? 'विशेष सङ्कल्प सन्देश / कैफियत (Optional Note)' : 'Special Prayer Sankalpa or Note (Optional)'}
                </label>
                <input
                  type="text"
                  value={payerNotes}
                  onChange={e => setPayerNotes(e.target.value)}
                  placeholder={lang === 'ne' ? 'गोत्र, नाम, मनोकामना वा पूजा मिति...' : 'Gotra, prayer intention, or puja date...'}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>
                  {lang === 'ne' 
                    ? 'तपाईंको भुक्तानी अभिलेख शुभ पात्रो प्रणालीमा सुरक्षित रहनेछ।' 
                    : 'Your payment will be securely recorded in Shubha Patro system.'}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm shadow-lg shadow-sky-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === 'ne' ? 'प्रमाणीकरण हुँदैछ...' : 'Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-amber-300" />
                    <span>{lang === 'ne' ? 'भुक्तानी पुष्टि र रसिद प्राप्त गर्नुहोस्' : 'Confirm & Generate Digital Receipt'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* GENERATED DIGITAL RECEIPT MODAL / DISPLAY */}
          {submittedReceipt && (
            <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-850 border-2 border-amber-300 dark:border-amber-600/60 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-200 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                    🙏
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400">
                      {lang === 'ne' ? 'शुभ पात्रो आधिकारिक डिजिटल रसिद' : 'Official Verified Digital Receipt'}
                    </span>
                    <h3 className="text-lg sm:text-2xl font-black text-stone-900 dark:text-white">
                      {submittedReceipt.receiptNumber}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ne' ? 'प्रमाणित (VERIFIED)' : 'VERIFIED'}</span>
                  </span>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="space-y-2 bg-white/70 dark:bg-stone-900/70 p-4 rounded-2xl border border-amber-200/60 dark:border-stone-800">
                  <div className="text-stone-500 text-xs">{lang === 'ne' ? 'भक्तजन / दाताको नाम:' : 'Payer Name:'}</div>
                  <div className="font-bold text-stone-900 dark:text-white text-base">{submittedReceipt.senderName}</div>
                  <div className="text-stone-500 text-xs mt-2">{lang === 'ne' ? 'सम्पर्क नम्बर:' : 'Contact:'} {submittedReceipt.senderPhone}</div>
                  {submittedReceipt.senderEmail && (
                    <div className="text-stone-500 text-xs">{lang === 'ne' ? 'इमेल:' : 'Email:'} {submittedReceipt.senderEmail}</div>
                  )}
                </div>

                <div className="space-y-2 bg-white/70 dark:bg-stone-900/70 p-4 rounded-2xl border border-amber-200/60 dark:border-stone-800">
                  <div className="text-stone-500 text-xs">{lang === 'ne' ? 'सेवा / दक्षिणा प्रयोजन:' : 'Purpose:'}</div>
                  <div className="font-bold text-sky-800 dark:text-sky-300 text-base">{submittedReceipt.serviceName}</div>
                  <div className="text-stone-500 text-xs mt-2">
                    {lang === 'ne' ? 'कारोबार नम्बर:' : 'Transaction Ref:'} <span className="font-mono font-bold text-stone-900 dark:text-white">{submittedReceipt.transactionRef}</span>
                  </div>
                  <div className="text-stone-500 text-xs">
                    {lang === 'ne' ? 'माध्यम:' : 'Method:'} <span className="uppercase font-semibold">{submittedReceipt.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold">{lang === 'ne' ? 'कुल भुक्तानी रकम' : 'Total Amount Received'}</div>
                  <div className="text-2xl font-black text-amber-900 dark:text-amber-200">
                    {submittedReceipt.currency} {submittedReceipt.amount.toLocaleString()}
                  </div>
                </div>

                <div className="text-right text-xs text-stone-500">
                  <div>Date: {new Date(submittedReceipt.createdAt).toLocaleDateString()}</div>
                  <div className="font-mono text-[11px] text-stone-400">Time: {new Date(submittedReceipt.createdAt).toLocaleTimeString()}</div>
                </div>
              </div>

              {/* Receipt Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{lang === 'ne' ? 'प्रिन्ट गर्नुहोस्' : 'Print Receipt'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittedReceipt(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
                >
                  <span>{lang === 'ne' ? 'बन्द गर्नुहोस्' : 'Done'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. DISCREET FOOTER OWNER / ADMIN PORTAL TRIGGER           */}
      {/* ========================================================= */}
      <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between text-xs text-stone-500 dark:text-stone-400 gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Shubha Patro Payments &copy; {new Date().getFullYear()} &bull; 100% Encrypted & Private</span>
        </div>

        <div>
          {isAdminLoggedIn ? (
            <button
              type="button"
              onClick={handleLogoutAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'व्यवस्थापक सत्र सक्रिय (लगआउट गर्नुहोस्)' : 'Owner Active (Click to Lock)'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowAdminPinModal(true)}
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer"
              title="Shyam Thapa Admin Access"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'व्यवस्थापक पहुँच (Owner Admin)' : 'Owner Login'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. ADMIN PIN AUTHENTICATION MODAL                         */}
      {/* ========================================================= */}
      {showAdminPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900 dark:text-white font-black text-lg">
                <KeyRound className="w-5 h-5 text-amber-500" />
                <span>{lang === 'ne' ? 'व्यवस्थापक प्रमाणीकरण' : 'Owner Admin Verification'}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAdminPinModal(false);
                  setAdminPinError('');
                }}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400">
              {lang === 'ne'
                ? 'प्राप्त भुक्तानी लेजर तथा बैंक/Stripe/PayPal खाता परिवर्तन गर्न आफ्नो गोप्य पिन कोड प्रविष्ट गर्नुहोस्।'
                : 'Enter your secret owner PIN code to access the private transaction ledger and payment settings.'}
            </p>

            <form onSubmit={handleVerifyAdminPin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'ne' ? 'पिन कोड (Passcode / PIN):' : 'Admin PIN:'}
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={adminPinInput}
                  onChange={e => {
                    setAdminPinInput(e.target.value);
                    setAdminPinError('');
                  }}
                  placeholder="••••"
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-center text-xl tracking-widest font-mono font-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="text-[11px] text-stone-400 mt-1 text-center">
                  {lang === 'ne' ? 'प्रारम्भिक पिन: 1234' : 'Initial default PIN: 1234'}
                </div>
              </div>

              {adminPinError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{adminPinError}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminPinModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
                >
                  {lang === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingPin}
                  className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isVerifyingPin ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                  <span>{lang === 'ne' ? 'प्रवेश गर्नुहोस्' : 'Unlock'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
