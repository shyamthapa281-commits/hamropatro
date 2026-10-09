import React, { useState } from 'react';
import { 
  Calendar, 
  Heart, 
  Sparkles, 
  Users, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  UserCheck, 
  Award, 
  Code,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  X
} from 'lucide-react';
import { Language } from '../types';
import { EmailServerModal } from './EmailServerModal';
import { FeedbackInboxModal } from './FeedbackInboxModal';
import { Inbox } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  const [adviceName, setAdviceName] = useState('');
  const [adviceEmail, setAdviceEmail] = useState('');
  const [adviceType, setAdviceType] = useState('advice');
  const [adviceMessage, setAdviceMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedNote, setLastSubmittedNote] = useState<{
    name: string;
    email?: string;
    type: string;
    message: string;
    date: string;
  } | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmitAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adviceMessage.trim()) return;

    setIsSubmitting(true);

    const senderName = adviceName.trim() || (lang === 'ne' ? 'अज्ञात (शुभचिन्तक)' : 'Anonymous');
    const senderEmail = adviceEmail.trim() || 'Not specified';
    const noteContent = adviceMessage.trim();
    const noteCategory = adviceType;

    const newFeedback = {
      name: senderName,
      email: senderEmail,
      type: noteCategory,
      category: noteCategory,
      message: noteContent,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // 1. Post to live server-side inbox endpoint
    try {
      await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeedback),
      });
    } catch (err) {
      console.warn('Feedback submit network note:', err);
    }

    // 2. Client-side local storage backup
    try {
      const stored = JSON.parse(localStorage.getItem('shubhapatro_feedbacks') || '[]');
      stored.unshift({
        ...newFeedback,
        id: Date.now().toString(),
        fullDate: new Date().toISOString()
      });
      localStorage.setItem('shubhapatro_feedbacks', JSON.stringify(stored.slice(0, 50)));
    } catch (_) {}

    setLastSubmittedNote(newFeedback);

    // Smooth instant on-page transition
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setAdviceMessage('');
      setAdviceName('');
      setAdviceEmail('');
    }, 350);
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('info@shubhapatro.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Top Grid: Brand & Team Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-extrabold shadow-md shadow-sky-900/40">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white block">Shubha Patro</span>
                <span className="text-xs text-sky-400 font-semibold block">शुभ पात्रो • नेपाली क्यालेन्डर (shubhapatro.com)</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {lang === 'ne'
                ? 'शुभ पात्रो (नेपाली क्यालेन्डर) - बिक्रम संवत्, दैनिक वैदिक राशिफल, चाडपर्व पञ्चाङ्ग, एनआरएन बैंकिङ, विदेशी मुद्रा तथा सुनचाँदी दरको भरपर्दो डिजिटल सेवा।'
                : 'Shubha Patro - Your trusted Nepali digital companion for Bikram Sambat calendar, Panchanga, Vedic horoscopes, NRN banking, and live currency rates.'}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold pt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'नेपालको सांस्कृतिक र सामाजिक पञ्चाङ्ग' : 'Nepali Cultural & Social Calendar'}</span>
            </div>
            
            <div className="pt-2 text-xs text-stone-400 flex flex-wrap items-center gap-2">
              <span className="inline-block text-[11px] bg-stone-800/90 text-stone-300 px-3 py-1.5 rounded-lg border border-stone-700/80">
                Version 2.5 • BS 2080-2084 Live
              </span>
              <button
                type="button"
                onClick={() => setIsInboxOpen(true)}
                className="inline-flex items-center gap-1.5 text-[11px] bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
                title={lang === 'ne' ? 'प्राप्त सल्लाह तथा प्रतिक्रिया इनबक्स हेर्नुहोस्' : 'View received advice and messages inbox'}
              >
                <Inbox className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ne' ? 'सन्देश इनबक्स' : 'Messages Inbox'}</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ne' ? 'द्रुत सेवाहरू' : 'Quick Features'}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  id="footer-quick-calendar"
                  onClick={() => onNavigate('calendar')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-stone-400 hover:underline text-left w-full"
                >
                  {lang === 'ne' ? '• नेपाली क्यालेन्डर र पञ्चाङ्ग' : '• Nepali Calendar & Panchanga'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-quick-festivals"
                  onClick={() => onNavigate('festivals')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-stone-400 hover:underline text-left w-full"
                >
                  {lang === 'ne' ? '• नेपाली चाडपर्वहरू (दशैं, तिहार)' : '• Festivals (Dashain, Tihar)'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-quick-rashifal"
                  onClick={() => onNavigate('rashifal')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-stone-400 hover:underline text-left w-full"
                >
                  {lang === 'ne' ? '• दैनिक वैदिक राशिफल' : '• Daily Vedic Horoscope'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-quick-kundali"
                  onClick={() => onNavigate('kundali')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-stone-400 hover:underline text-left w-full"
                >
                  {lang === 'ne' ? '• जन्म कुण्डली तथा ३६ गुण मिलान' : '• Janma Kundali & 36 Gun Milan'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-quick-weather"
                  onClick={() => onNavigate('weather')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-stone-400 hover:underline text-left w-full"
                >
                  {lang === 'ne' ? '• मौसम पूर्वानुमान' : '• Live Weather Forecast'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-quick-forex"
                  onClick={() => onNavigate('forex')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-stone-400 hover:underline text-left w-full"
                >
                  {lang === 'ne' ? '• विनिमय दर र सुनको मूल्य' : '• Forex Rates & Bullion'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-quick-nrn-banking"
                  onClick={() => onNavigate('nrn-banking')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-stone-400 hover:underline text-left w-full"
                >
                  {lang === 'ne' ? '• NRN बैंकिङ तथा १०% IPO कोटा' : '• NRN Banking & 10% IPO Quota'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-quick-converter"
                  onClick={() => onNavigate('converter')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-stone-400 hover:underline text-left w-full"
                >
                  {lang === 'ne' ? '• नाप, जग्गा र मिति रूपान्तरण' : '• Measurement & Date Converter'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-quick-support"
                  onClick={() => onNavigate('support')}
                  className="text-rose-400 hover:text-rose-300 font-semibold transition-colors cursor-pointer hover:underline text-left w-full flex items-center gap-1.5"
                >
                  <Heart className="w-3 h-3 text-rose-400 fill-current" />
                  <span>{lang === 'ne' ? 'हाम्रो कामलाई सहयोग गर्नुहोस् (Donation)' : 'Support Our Work & Donate'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Teams and Contact Info */}
          <div className="lg:col-span-5 bg-stone-800/50 p-4 sm:p-5 rounded-2xl border border-stone-700/60 shadow-inner">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5 pb-2 border-b border-stone-700">
              <Users className="w-4 h-4 text-sky-400" />
              <span>{lang === 'ne' ? 'नेपाली क्यालेन्डर टिम तथा सम्पर्क' : 'Nepali Calendar Team & Contact'}</span>
            </h4>

            {/* Team Roles */}
            <div className="space-y-2.5 text-xs text-stone-300 mb-4">
              <div className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 block text-[11px]">
                    {lang === 'ne' ? 'निर्देशक तथा संयोजक:' : 'Director & Coordinator:'}
                  </span>
                  <strong className="text-white font-semibold">Shyam Thapa (श्याम थापा)</strong>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 block text-[11px]">
                    {lang === 'ne' ? 'सल्लाहकार:' : 'Advisor:'}
                  </span>
                  <strong className="text-white font-semibold">Mana Magar(मन मगर)</strong>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Code className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 block text-[11px]">
                    {lang === 'ne' ? 'डिजाइन तथा प्राविधिक:' : 'Design & Technical:'}
                  </span>
                  <strong className="text-white font-semibold">Samriddha Thapa (समृद्ध थापा)</strong>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="pt-3 border-t border-stone-700/80 space-y-2 text-xs">
              <div className="flex flex-col gap-1.5 text-stone-300">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="text-stone-400">{lang === 'ne' ? 'इमेल:' : 'Email:'}</span>
                    <button 
                      type="button"
                      onClick={() => setIsEmailModalOpen(true)}
                      className="text-amber-300 hover:text-amber-200 hover:underline transition-colors font-medium cursor-pointer text-left"
                      title={lang === 'ne' ? 'इमेल सर्भर छान्नुहोस् (Gmail, Outlook, Yahoo)' : 'Direct to customer email server'}
                    >
                      info@shubhapatro.com
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors text-[10px] flex items-center gap-1 cursor-pointer shrink-0 border border-stone-700/60"
                    title={lang === 'ne' ? 'इमेल कपी गर्नुहोस्' : 'Copy email address'}
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? (lang === 'ne' ? 'कपी भयो' : 'Copied') : (lang === 'ne' ? 'कपी' : 'Copy')}</span>
                  </button>
                </div>

                {/* Direct Customer Email Server shortcuts */}
                <div className="flex items-center gap-1.5 pl-5 pt-0.5 text-[10px] flex-wrap">
                  <span className="text-stone-500">{lang === 'ne' ? 'सर्भर:' : 'Direct to:'}</span>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=info@shubhapatro.com&su=Inquiry%20to%20Shubha%20Patro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-1.5 py-0.5 rounded bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 hover:border-red-600 transition-colors cursor-pointer font-medium"
                    title={lang === 'ne' ? 'गुगल जिमेल वेब सर्भरमा सिधै खोल्नुहोस्' : 'Direct to Gmail Web'}
                  >
                    Gmail
                  </a>
                  <a
                    href="https://outlook.live.com/mail/0/deeplink/compose?to=info@shubhapatro.com&subject=Inquiry%20to%20Shubha%20Patro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-1.5 py-0.5 rounded bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-800/50 hover:border-blue-600 transition-colors cursor-pointer font-medium"
                    title={lang === 'ne' ? 'माइक्रोसफ्ट आउटलुक वेब सर्भरमा सिधै खोल्नुहोस्' : 'Direct to Outlook Web'}
                  >
                    Outlook
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(true)}
                    className="px-1.5 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
                  >
                    {lang === 'ne' ? 'थप छान्नुहोस्...' : 'More servers...'}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-stone-400 text-[11px] pt-1 border-t border-stone-800/60">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>Lalitpur, Bagmati Province, Nepal 44705</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Craigieburn, Melbourne 3064, Vic, Australia</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Reaction or Advice Form Section */}
        <div className="bg-stone-800/80 rounded-2xl p-5 sm:p-6 border border-stone-700/80 mb-10 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {lang === 'ne' ? 'प्रतिक्रिया वा सल्लाह सुझाव (Reaction & Advice)' : 'Reaction or Advice Field'}
              </h3>
            </div>
            
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              {lang === 'ne'
                ? 'नेपाली क्यालेन्डरलाई थप प्रभावकारी बनाउन तपाईंको सल्लाह, सुझाव वा प्रतिक्रिया हाम्रो लागि अत्यन्त महत्वपूर्ण छ। तलको फारम भरी कुनै पनि इमेल एप नखोली सोझै यसै पृष्ठमा सुरक्षित पठाउन सक्नुहुन्छ।'
                : 'Your feedback, advice, or suggestions help us enhance the Nepali Calendar for the entire community. Submit directly on-page without opening email apps.'}
            </p>

            {isSubmitted ? (
              <div className="bg-gradient-to-br from-emerald-950/60 to-stone-900 border border-emerald-600/40 rounded-xl p-6 text-center space-y-4 text-xs animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                
                <div className="space-y-1.5">
                  <h5 className="font-bold text-emerald-200 text-sm sm:text-base">
                    {lang === 'ne' 
                      ? 'तपाईंको सल्लाह र सुझाव पेश भएकोमा हार्दिक धन्यवाद!' 
                      : 'Thank you for submitting your advice and feedback!'}
                  </h5>
                  <p className="text-stone-300 max-w-md mx-auto text-xs leading-relaxed">
                    {lang === 'ne'
                      ? 'तपाईंको सल्लाह सफलतापूर्वक दर्ता भएको छ। यसले शुभ पात्रोलाई अझ उपयोगी र प्रभावकारी बनाउन मद्दत पुर्‍याउनेछ।'
                      : 'Your advice has been successfully submitted. It will help us continue enhancing Shubha Patro for the entire community.'}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setAdviceMessage('');
                      setAdviceName('');
                      setAdviceEmail('');
                      setLastSubmittedNote(null);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-md"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{lang === 'ne' ? 'बन्द गर्नुहोस् (नयाँ सुझाव लेख्नुहोस्)' : 'Close'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitAdvice} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="advice-name" className="block text-[11px] font-medium text-stone-300 mb-1">
                      {lang === 'ne' ? 'तपाईंको नाम (Name)' : 'Your Name'}
                    </label>
                    <input
                      id="advice-name"
                      type="text"
                      value={adviceName}
                      onChange={(e) => setAdviceName(e.target.value)}
                      placeholder={lang === 'ne' ? 'उदा: राम शर्मा' : 'e.g. Ram Sharma'}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="advice-email" className="block text-[11px] font-medium text-stone-300 mb-1">
                      {lang === 'ne' ? 'तपाईंको इमेल (Email)' : 'Your Email'}
                    </label>
                    <input
                      id="advice-email"
                      type="email"
                      value={adviceEmail}
                      onChange={(e) => setAdviceEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="advice-type" className="block text-[11px] font-medium text-stone-300 mb-1">
                      {lang === 'ne' ? 'वर्ग (Category)' : 'Category'}
                    </label>
                    <select
                      id="advice-type"
                      value={adviceType}
                      onChange={(e) => setAdviceType(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="advice">{lang === 'ne' ? '💡 सल्लाह / सुझाव (Advice)' : '💡 Advice / Suggestion'}</option>
                      <option value="reaction">{lang === 'ne' ? '❤️ प्रतिक्रिया / प्रशंसा (Reaction)' : '❤️ Reaction / Appreciation'}</option>
                      <option value="correction">{lang === 'ne' ? '✏️ चाडपर्व / मिति सुधार (Correction)' : '✏️ Date Correction'}</option>
                      <option value="general">{lang === 'ne' ? '✉️ सामान्य सोधपुछ (General)' : '✉️ General Inquiry'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="advice-message" className="block text-[11px] font-medium text-stone-300 mb-1">
                    {lang === 'ne' ? 'तपाईंको प्रतिक्रिया वा सल्लाह सुझाव (Message) *' : 'Your Reaction or Advice *'}
                  </label>
                  <textarea
                    id="advice-message"
                    required
                    rows={3}
                    value={adviceMessage}
                    onChange={(e) => setAdviceMessage(e.target.value)}
                    placeholder={
                      lang === 'ne'
                        ? 'यहाँ आफ्नो प्रतिक्रिया वा क्यालेन्डर सम्बन्धी कुनै सल्लाह लेख्नुहोस् (सिधै यसै पृष्ठबाट सब्मिट हुनेछ)...'
                        : 'Write your reaction, advice, or suggestions here (submits smoothly on-page)...'
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-y"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 flex-wrap">
                    <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{lang === 'ne' ? 'सिधै इमेल:' : 'Direct email:'}</span>
                    <button
                      type="button"
                      onClick={() => setIsEmailModalOpen(true)}
                      className="text-amber-400 hover:text-amber-300 font-semibold hover:underline cursor-pointer"
                      title={lang === 'ne' ? 'इमेल सर्भर खोल्नुहोस् (Gmail, Outlook)' : 'Direct to your email server'}
                    >
                      info@shubhapatro.com
                    </button>
                    <span className="text-stone-600 hidden sm:inline">|</span>
                    <span className="text-[10px] text-stone-500 hidden sm:inline">
                      {lang === 'ne' ? '(कुनै मेल एप खोल्नु पर्दैन)' : '(smooth on-page submit)'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-60 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{lang === 'ne' ? 'दर्ता हुँदैछ...' : 'Submitting...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{lang === 'ne' ? 'यसै पृष्ठबाट पठाउनुहोस्' : 'Submit On-Page'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Email Server Chooser Modal */}
        <EmailServerModal 
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          lang={lang}
          email="info@shubhapatro.com"
          defaultSubject="Inquiry to Shubha Patro"
        />

        {/* Live Feedback & Advice Inbox Modal */}
        <FeedbackInboxModal 
          isOpen={isInboxOpen}
          onClose={() => setIsInboxOpen(false)}
          lang={lang}
        />

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Shubha Patro (शुभ पात्रो • shubhapatro.com). Nepali Calendar. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Nepal & the Global Nepali Diaspora (Melbourne, Australia)</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

