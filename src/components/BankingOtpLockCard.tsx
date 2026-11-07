import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  Mail, 
  Phone,
  Clock, 
  AlertCircle, 
  RefreshCw,
  User,
  Send,
  ExternalLink,
  ShieldAlert,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BankingOtpLockCardProps {
  lang: 'ne' | 'en';
  selectedChannel: 'aus_bank' | 'nepal_bank';
  onUnlocked: (unlockedUntil: number, remainingSeconds: number) => void;
  defaultEmail?: string;
  defaultName?: string;
}

interface StoredRequestItem {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerNote?: string;
  channel: string;
  code: string;
  createdAt: number;
  expiresAt: number;
  status: 'pending' | 'used' | 'expired';
}

export const BankingOtpLockCard: React.FC<BankingOtpLockCardProps> = ({
  lang,
  selectedChannel,
  onUnlocked,
  defaultEmail = '',
  defaultName = '',
}) => {
  const [nameInput, setNameInput] = useState<string>(defaultName);
  const [emailInput, setEmailInput] = useState<string>(defaultEmail);
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [noteInput, setNoteInput] = useState<string>('');
  const [otpCodeInput, setOtpCodeInput] = useState<string>('');

  const [isSendingRequest, setIsSendingRequest] = useState<boolean>(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);

  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const [ownerInfo, setOwnerInfo] = useState<{ name: string; email: string; phone: string }>({
    name: 'Shubha Patro Administrator',
    email: 'shyamthapa281@gmail.com',
    phone: '+61 416 045 056',
  });

  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  const [expirySeconds, setExpirySeconds] = useState<number>(0);

  // Owner Admin Panel State (Accessible only with secret Admin PIN)
  const [showOwnerLoginModal, setShowOwnerLoginModal] = useState<boolean>(false);
  const [adminPinInput, setAdminPinInput] = useState<string>('');
  const [adminPinError, setAdminPinError] = useState<string | null>(null);
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState<boolean>(false);
  const [ownerRequestsList, setOwnerRequestsList] = useState<StoredRequestItem[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState<boolean>(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Timer for resend cooldown and code expiration
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Step 1: Customer sends request to the Owner
  const handleSendRequestToOwner = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage(
        lang === 'ne' 
          ? 'कृपया आफ्नो मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस् ताकी व्यवस्थापकले तपाईंलाई कोड पठाउन सकुन्।' 
          : 'Please enter a valid email address so the administrator can send you the code.'
      );
      return;
    }

    setIsSendingRequest(true);
    setErrorMessage(null);
    setServerMessage(null);

    try {
      const res = await fetch('/api/payments/banking-otp/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput.trim(),
          email: cleanEmail,
          phone: phoneInput.trim(),
          note: noteInput.trim(),
          channel: selectedChannel,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch request to owner');
      }

      setRequestSubmitted(true);
      setSubmittedEmail(cleanEmail);
      if (data.ownerEmail) {
        setOwnerInfo({
          name: data.ownerName || 'Shyam Thapa',
          email: data.ownerEmail,
          phone: data.ownerPhone || '+61 416 045 056',
        });
      }
      setServerMessage(data.message);
      setCooldownSeconds(60); // 60s cooldown before allowing re-request
      setExpirySeconds(data.expiresInSeconds || 1800); // 30 minutes

      // Dispatch direct browser-side email notification to owner
      try {
        const destOwnerEmail = data.ownerEmail || ownerInfo.email || 'shyamthapa281@gmail.com';
        fetch(`https://formsubmit.co/ajax/${encodeURIComponent(destOwnerEmail)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `🚨 [Shubha Patro] बैंक विवरण अनलक अनुरोध - ${nameInput.trim() || 'ग्राहक'}`,
            _template: 'table',
            _captcha: 'false',
            "ग्राहकको नाम (Customer Name)": nameInput.trim() || 'Valued Patron',
            "ग्राहकको इमेल (Customer Email)": cleanEmail,
            "सम्पर्क नम्बर (Phone)": phoneInput.trim() || 'Not specified',
            "च्यानल (Requested Bank)": selectedChannel === 'aus_bank' ? 'Australia Bank (CBA / PayID)' : 'Nepal Bank (NMB Bank)',
            "सहयोग उद्देश्य (Note)": noteInput.trim() || 'Shubha Patro Support',
            "अनुरोध समय (Time)": new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' }),
            "जानकारी (Action)": "ग्राहकले बैंक विवरण हेर्न अनुरोध गर्नुभएको छ। कृपया Shubha Patro Owner Portal मा लगइन गरी ६-अङ्के कोड हेर्नुहोस् र ग्राहकलाई उपलब्ध गराउनुहोस्।"
          }),
        }).catch(() => {});
      } catch (_) {}
    } catch (err: any) {
      setErrorMessage(err.message || 'Error sending request to owner');
    } finally {
      setIsSendingRequest(false);
    }
  };

  // Step 2: Customer enters the 6-digit code received from the Owner
  const handleVerifyOwnerCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetEmail = submittedEmail || emailInput.trim();
    if (!targetEmail) {
      setErrorMessage(
        lang === 'ne' 
          ? 'कृपया पहिले व्यवस्थापकसँग कोड अनुरोध पठाउनुहोस्।' 
          : 'Please send an unlock request to the owner first.'
      );
      return;
    }
    const cleanCode = otpCodeInput.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setErrorMessage(
        lang === 'ne' 
          ? 'कृपया व्यवस्थापकले दिनुभएको पूरा ६-अङ्कको कोड प्रविष्ट गर्नुहोस्।' 
          : 'Please enter the complete 6-digit code provided by the owner.'
      );
      return;
    }

    setIsVerifyingCode(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/payments/banking-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          code: cleanCode,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Verification failed');
      }

      // Success! Trigger celebratory confetti and inform parent component to unlock bank details
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      onUnlocked(data.unlockedUntil, data.expiresInSeconds || 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Owner Portal Verification & Data Fetching
  const handleFetchOwnerRequests = async (pinToUse?: string) => {
    const pin = pinToUse || adminPinInput.trim();
    if (!pin) {
      setAdminPinError('कृपया व्यवस्थापक PIN प्रविष्ट गर्नुहोस्');
      return;
    }

    setIsLoadingRequests(true);
    setAdminPinError(null);

    try {
      const res = await fetch('/api/payments/banking-otp/requests', {
        headers: { 'x-admin-pin': pin },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid Admin PIN');
      }

      setIsOwnerLoggedIn(true);
      setOwnerRequestsList(data.requests || []);
    } catch (err: any) {
      setAdminPinError(err.message || 'Verification failed');
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleCopyCodeToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const customerWhatsappUrl = `https://wa.me/61416045056?text=${encodeURIComponent(
    `Hello Shubha Patro Administrator, I am ${nameInput.trim() || 'a patron'} (${emailInput.trim()}). I have submitted a request on Shubha Patro to view your banking details. Please provide my 6-digit unlock code. Thank you!`
  )}`;

  const customerMailtoUrl = `mailto:${ownerInfo.email}?subject=${encodeURIComponent(
    `Banking Unlock Request - ${nameInput.trim() || 'Patron'}`
  )}&body=${encodeURIComponent(
    `Hello Shubha Patro Administrator,\n\nI have requested the 6-digit unlock code to view the banking details for Shubha Patro patronage.\n\nMy Details:\nName: ${nameInput.trim() || 'Patron'}\nEmail: ${emailInput.trim()}\nPhone: ${phoneInput.trim() || 'Not provided'}\nNote: ${noteInput.trim() || 'Patronage Support'}\n\nPlease reply with my 6-digit unlock code so I can unlock the banking details on the site.\n\nThank you!`
  )}`;

  return (
    <div className="bg-gradient-to-br from-amber-50/90 via-white to-sky-50/70 dark:from-stone-900 dark:via-stone-900/95 dark:to-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 dark:border-amber-700/70 shadow-xl space-y-6 relative">
      {/* Security Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 dark:border-stone-800 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center font-bold shadow-md shadow-red-700/30 shrink-0 ring-2 ring-red-400/30">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                {selectedChannel === 'aus_bank'
                  ? (lang === 'ne' ? 'अष्ट्रेलिया बैंक (CBA / PayID) सुरक्षित विवरण' : 'Australian Bank (CBA / PayID) Protected Details')
                  : (lang === 'ne' ? 'नेपाल बैंक (NMB Bank / QR) सुरक्षित विवरण' : 'Nepal Bank (NMB Bank / QR) Protected Details')}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800">
                {lang === 'ne' ? 'व्यवस्थापक अनुमति आवश्यक' : 'Owner Approval Required'}
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
              {lang === 'ne'
                ? 'सुरक्षा तथा वित्तीय गोपनीयताका लागि बैंक खाता नम्बरहरू सुरक्षित लक गरिएको छ। तलको बटनबाट व्यवस्थापक (Owner) सँग अनलक कोड अनुरोध गर्नुहोस्। व्यवस्थापकबाट प्राप्त ६-अङ्कको कोड राखी १५ मिनेटका लागि विवरण अनलक गर्नुहोस्।'
                : 'For financial security and privacy, bank accounts are locked. Request an unlock code from the owner below. Enter the code received from the owner to unlock the banking info for 15 minutes.'}
            </p>
          </div>
        </div>

        {/* Owner Secret Login Button */}
        <div className="shrink-0 flex items-center self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowOwnerLoginModal(true)}
            className="text-[11px] font-bold text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-red-400 transition-colors cursor-pointer"
            title="Owner / Administrator Access"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'ne' ? 'व्यवस्थापक लगइन (Owner)' : 'Owner Portal'}</span>
          </button>
        </div>
      </div>

      {/* Owner Contact Information Snapshot */}
      <div className="bg-amber-100/60 dark:bg-stone-800/80 border border-amber-300/80 dark:border-amber-700/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block">
              {lang === 'ne' ? 'आधिकारिक व्यवस्थापक (Platform Owner):' : 'Platform Administrator:'}
            </span>
            <span className="font-extrabold text-stone-900 dark:text-white text-xs sm:text-sm">
              {ownerInfo.name} • <span className="font-mono text-sky-700 dark:text-sky-400">{ownerInfo.email}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={customerMailtoUrl}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-50 text-[11px] font-bold flex items-center gap-1 transition-colors"
          >
            <Mail className="w-3 h-3 text-red-600" />
            <span>{lang === 'ne' ? 'इमेल पठाउनुहोस्' : 'Email Owner'}</span>
          </a>
          <a
            href={customerWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Grid: Step 1 (Request from Owner) and Step 2 (Enter Owner-Provided Code) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Step 1: Customer Requests Code from Owner */}
        <div className={`space-y-4 p-5 rounded-2xl border transition-all ${
          !requestSubmitted 
            ? 'bg-white dark:bg-stone-900 border-amber-300 dark:border-amber-700 shadow-md ring-1 ring-amber-400/20' 
            : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-90'
        }`}>
          <div className="flex items-center justify-between">
            <div className="text-xs font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{lang === 'ne' ? 'चरण १: व्यवस्थापकसँग कोड अनुरोध पठाउनुहोस्' : 'Step 1: Request Code from Owner'}</span>
            </div>
            {requestSubmitted && (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{lang === 'ne' ? 'अनुरोध दर्ता भयो' : 'Dispatched'}</span>
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ne' ? 'तपाईंको नाम (Customer Full Name) *' : 'Your Full Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder={lang === 'ne' ? 'उदा. राम श्रेष्ठ / John Smith' : 'e.g. John Smith'}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ne' ? 'तपाईंको इमेल ठेगाना (Your Email Address) *' : 'Your Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ne' ? 'मोबाइल वा WhatsApp नम्बर (Optional)' : 'Phone or WhatsApp Number (Optional)'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="e.g. +61 400 123 456 / 9800000000"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'ne' ? 'सहयोग विवरण वा सन्देश (Optional)' : 'Short Note / Contribution Intent (Optional)'}
              </label>
              <input
                type="text"
                placeholder={lang === 'ne' ? 'उदा. अष्ट्रेलिया बैंकबाट $५० सहयोग गर्न चाहेको' : 'e.g. Contributing $50 via bank transfer'}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSendRequestToOwner}
              disabled={isSendingRequest || cooldownSeconds > 0}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                cooldownSeconds > 0
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-500 hover:to-red-600 active:scale-98 text-white font-black'
              }`}
            >
              {isSendingRequest ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'ne' ? 'व्यवस्थापकलाई अनुरोध पठाइँदैछ...' : 'Dispatching Request to Owner...'}</span>
                </>
              ) : cooldownSeconds > 0 ? (
                <span>
                  {lang === 'ne' ? `पुनः अनुरोध गर्न बाँकी: ${cooldownSeconds} सेकेन्ड` : `Re-request in ${cooldownSeconds}s`}
                </span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>
                    {requestSubmitted
                      ? (lang === 'ne' ? 'व्यवस्थापकलाई पुनः अनुरोध पठाउनुहोस्' : 'Resend Unlock Request to Owner')
                      : (lang === 'ne' ? 'व्यवस्थापकसँग अनलक कोड अनुरोध गर्नुहोस्' : 'Request Unlock Code from Owner')}
                  </span>
                </>
              )}
            </button>

            {serverMessage && (
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50/70 dark:from-emerald-950/40 dark:to-teal-950/30 border-2 border-emerald-400 dark:border-emerald-700 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs space-y-2.5 shadow-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">{serverMessage}</p>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5 leading-relaxed">
                      {lang === 'ne'
                        ? `अनुरोध व्यवस्थापक ${ownerInfo.name} (${ownerInfo.email}) लाई दर्ता गरिएको छ। तत्काल कोड प्राप्त गर्न तलको बटनबाट व्यवस्थापकलाई सोझै सम्पर्क गर्नुहोस्:`
                        : `Your request has been registered for ${ownerInfo.name} (${ownerInfo.email}). To receive your code immediately, reach out to the owner directly below:`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-200 dark:border-emerald-800/60">
                  <a
                    href={customerMailtoUrl}
                    className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{lang === 'ne' ? '✉️ व्यवस्थापकलाई इमेल पठाउनुहोस्' : 'Email Owner Directly'}</span>
                  </a>
                  <a
                    href={customerWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{lang === 'ne' ? '💬 WhatsApp मा कोड माग्नुहोस्' : 'WhatsApp for Code'}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Customer Enters the 6-Digit Code Provided by Owner to Unlock */}
        <div className={`space-y-4 p-5 rounded-2xl border transition-all ${
          requestSubmitted 
            ? 'bg-white dark:bg-stone-900 border-emerald-400 dark:border-emerald-700 shadow-lg ring-2 ring-emerald-500/20' 
            : 'bg-white/80 dark:bg-stone-900/80 border-stone-200 dark:border-stone-800 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Unlock className="w-4 h-4" />
              <span>{lang === 'ne' ? 'चरण २: व्यवस्थापकबाट प्राप्त कोड राखी अनलक गर्नुहोस्' : 'Step 2: Enter Owner Code & Unlock'}</span>
            </div>
            {expirySeconds > 0 && (
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900">
                <Clock className="w-3 h-3" />
                <span>{formatTimer(expirySeconds)}</span>
              </span>
            )}
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {lang === 'ne'
              ? `व्यवस्थापक (${ownerInfo.name} • ${ownerInfo.email}) ले तपाईंलाई प्रदान गर्नुभएको ६-अङ्कको गोप्य अनलक कोड तल राख्नुहोस्:`
              : `Enter the 6-digit unlock code provided by the administrator (${ownerInfo.name}):`}
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                {lang === 'ne' ? '६-अङ्कको अनलक कोड (Enter 6-Digit Unlock Code) *' : '6-Digit Unlock Code *'}
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                value={otpCodeInput}
                onChange={(e) => setOtpCodeInput(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center font-mono text-2xl sm:text-3xl tracking-[0.4em] font-black py-3 rounded-2xl border-2 border-amber-400 dark:border-amber-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/20 shadow-inner"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleVerifyOwnerCode}
              disabled={isVerifyingCode || !otpCodeInput.trim() || otpCodeInput.trim().length < 6}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                !otpCodeInput.trim() || otpCodeInput.trim().length < 6
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black shadow-lg shadow-emerald-900/20'
              }`}
            >
              {isVerifyingCode ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'ne' ? 'कोड जाँच गरिँदैछ...' : 'Verifying Owner Code...'}</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>{lang === 'ne' ? 'बैंक विवरण अनलक गर्नुहोस् (Unlock Details)' : 'Unlock Banking Details'}</span>
                </>
              )}
            </button>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-center space-y-1">
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                🔒 {lang === 'ne' ? 'कोड प्रमाणीकरण भएपछि १५ मिनेटको लागि बैंक विवरण खुला रहनेछ।' : 'Unlocked details remain active for 15 minutes.'}
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {lang === 'ne' ? 'कोड प्राप्त भएन भने व्यवस्थापकसँग सिधै सम्पर्क गर्नुहोस्:' : 'If you have not received a code, contact the owner directly:'}{' '}
                <a href={`mailto:${ownerInfo.email}`} className="text-sky-600 dark:text-sky-400 font-bold underline">
                  {ownerInfo.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Admin Secret Modal */}
      {showOwnerLoginModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowOwnerLoginModal(false)}
        >
          <div 
            className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-300 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-700 via-red-800 to-red-900 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-black text-base">
                    {lang === 'ne' ? 'व्यवस्थापक अधिकृत प्यानल (Owner Dashboard)' : 'Owner Authorization Portal'}
                  </h4>
                  <p className="text-xs text-red-100">
                    {ownerInfo.name} ({ownerInfo.email})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowOwnerLoginModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {!isOwnerLoggedIn ? (
                <div className="space-y-4 max-w-sm mx-auto py-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-stone-900 dark:text-white text-sm">
                      {lang === 'ne' ? 'व्यवस्थापक PIN प्रविष्ट गर्नुहोस्' : 'Enter Admin PIN'}
                    </h5>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {lang === 'ne' ? 'ग्राहकहरूले पठाएका अनलक अनुरोध र कोड हेर्न आफ्नो PIN राख्नुहोस्।' : 'Enter your admin PIN to view customer unlock requests and 6-digit codes.'}
                    </p>
                  </div>

                  <input
                    type="password"
                    maxLength={8}
                    placeholder="••••••••"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFetchOwnerRequests()}
                    className="w-full text-center font-mono text-xl font-black py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />

                  {adminPinError && (
                    <div className="text-xs text-red-600 font-bold">
                      {adminPinError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleFetchOwnerRequests()}
                    disabled={isLoadingRequests || !adminPinInput.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isLoadingRequests ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                    <span>{lang === 'ne' ? 'अनुरोधहरू हेर्नुहोस् (View Requests)' : 'Unlock Owner Requests'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      {lang === 'ne' ? 'हालका ग्राहक अनलक अनुरोधहरू:' : 'Recent Customer Unlock Requests:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFetchOwnerRequests(adminPinInput)}
                      className="text-xs text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{lang === 'ne' ? 'ताजा गर्नुहोस्' : 'Refresh'}</span>
                    </button>
                  </div>

                  {ownerRequestsList.length === 0 ? (
                    <div className="p-8 text-center bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs text-stone-500">
                      {lang === 'ne' ? 'हाल कुनै अनलक अनुरोध फेला परेन।' : 'No unlock requests found yet.'}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ownerRequestsList.map((req) => {
                        const isExpired = Date.now() > req.expiresAt;
                        const isUsed = req.status === 'used';
                        return (
                          <div 
                            key={req.id} 
                            className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-extrabold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                                  <span>{req.customerName}</span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isUsed
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                      : isExpired
                                      ? 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-300'
                                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                                  }`}>
                                    {isUsed ? 'अनलक भइसकेको (Used)' : isExpired ? 'म्याद सकिएको (Expired)' : 'सक्रिय (Pending)'}
                                  </span>
                                </div>
                                <div className="text-xs text-stone-600 dark:text-stone-300 font-mono mt-0.5">
                                  {req.customerEmail} {req.customerPhone ? `• ${req.customerPhone}` : ''}
                                </div>
                                {req.customerNote && (
                                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 italic">
                                    "{req.customerNote}"
                                  </div>
                                )}
                              </div>

                              {/* Highlighted 6-Digit Code for the Owner */}
                              <div className="text-right shrink-0">
                                <span className="text-[10px] font-bold text-stone-400 block uppercase">
                                  {lang === 'ne' ? 'अनलक कोड' : 'Unlock Code'}
                                </span>
                                <span className="font-mono font-black text-xl text-red-600 dark:text-red-400 tracking-wider">
                                  {req.code}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons to share with Customer */}
                            <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2 flex-wrap">
                              <span className="text-[10px] text-stone-400">
                                ⏰ {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleCopyCodeToClipboard(req.code, req.id)}
                                  className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedCodeId === req.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedCodeId === req.id ? 'कपी भयो' : 'Copy Code'}</span>
                                </button>

                                <a
                                  href={`mailto:${req.customerEmail}?subject=Shubha%20Patro%20Banking%20Unlock%20Code&body=Hello%20${encodeURIComponent(req.customerName)},%0D%0A%0D%0AYour%206-digit%20unlock%20code%20for%20Shubha%20Patro%20banking%20details%20is:%20${req.code}%0D%0A%0D%0AValid%20for%2030%20minutes.%20Thank%20you%20for%20your%20kind%20patronage!`}
                                  className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold flex items-center gap-1"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Email</span>
                                </a>

                                {req.customerPhone && (
                                  <a
                                    href={`https://wa.me/${req.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${req.customerName}, your Shubha Patro banking unlock code is: ${req.code}. Valid for 30 minutes.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
