import React, { useState } from 'react';
import { 
  Calendar, 
  Heart, 
  Sparkles, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  UserCheck, 
  Award, 
  Code 
} from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  const [adviceName, setAdviceName] = useState('');
  const [adviceEmail, setAdviceEmail] = useState('');
  const [adviceType, setAdviceType] = useState('advice');
  const [adviceMessage, setAdviceMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adviceMessage.trim()) return;

    // Construct mailto link as direct action
    const subject = encodeURIComponent(`Nepali Calendar Feedback [${adviceType.toUpperCase()}]: ${adviceName || 'User'}`);
    const body = encodeURIComponent(
      `From: ${adviceName || 'Anonymous'} (${adviceEmail || 'No email provided'})\n` +
      `Category: ${adviceType}\n\n` +
      `Message / Advice:\n${adviceMessage}\n\n` +
      `Sent from: Nepali Calendar Web App (Craigieburn, Melbourne 3064)`
    );

    const mailtoUrl = `mailto:shyamthapa281@gmail.com?subject=${subject}&body=${body}`;
    
    // Open user's email client
    window.location.href = mailtoUrl;
    setIsSubmitted(true);
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
                <span className="text-lg font-extrabold text-white block">Nepali Calendar</span>
                <span className="text-xs text-sky-400 font-semibold block">नेपाली क्यालेन्डर (बिक्रम संवत्)</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {lang === 'ne'
                ? 'नेपाली क्यालेन्डर (बिक्रम संवत्), दैनिक वैदिक राशिफल, चाडपर्व पञ्चाङ्ग, ताजा नेपाली समाचार र विदेशी मुद्रा विनिमय दरको भरपर्दो डिजिटल सेवा।'
                : 'Your trusted Nepali digital companion for Bikram Sambat calendar, Panchanga, Vedic horoscopes, live news and currency rates.'}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold pt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'नेपालको सांस्कृतिक र सामाजिक पञ्चाङ्ग' : 'Nepali Cultural & Social Calendar'}</span>
            </div>
            
            <div className="pt-2 text-xs text-stone-400">
              <span className="inline-block text-[11px] bg-stone-800/90 text-stone-300 px-3 py-1.5 rounded-lg border border-stone-700/80">
                Version 2.5 • BS 2080-2084 Live
              </span>
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
                  <strong className="text-white font-semibold">Mana Magar (मना मगर)</strong>
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
              <div className="flex items-center gap-2 text-stone-300">
                <Phone className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <span className="text-stone-400">{lang === 'ne' ? 'सम्पर्क:' : 'Contact:'}</span>
                <a 
                  href="tel:0416045056" 
                  className="font-bold text-amber-300 hover:text-amber-200 hover:underline transition-colors"
                >
                  0416045056
                </a>
              </div>

              <div className="flex items-center gap-2 text-stone-300">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-stone-400">{lang === 'ne' ? 'इमेल:' : 'Email:'}</span>
                <a 
                  href="mailto:shyamthapa281@gmail.com" 
                  className="text-stone-200 hover:text-white hover:underline transition-colors"
                >
                  shyamthapa281@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-2 text-stone-400 text-[11px] pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>Craigieburn, Melbourne 3064, Vic, Australia</span>
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
                ? 'नेपाली क्यालेन्डरलाई थप प्रभावकारी बनाउन तपाईंको सल्लाह, सुझाव वा प्रतिक्रिया हाम्रो लागि अत्यन्त महत्वपूर्ण छ। तलको फारम भरी सिधै हाम्रो टिमलाई पठाउन सक्नुहुन्छ।'
                : 'Your feedback, advice, or suggestions help us enhance the Nepali Calendar for the entire community. Leave your note below.'}
            </p>

            {isSubmitted ? (
              <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-xl p-4 text-center space-y-2 text-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <h5 className="font-bold text-emerald-200 text-sm">
                  {lang === 'ne' ? 'सल्लाह र प्रतिक्रियाका लागि हार्दिक धन्यवाद!' : 'Thank you for your advice & feedback!'}
                </h5>
                <p className="text-stone-300 max-w-md mx-auto text-[11px]">
                  {lang === 'ne'
                    ? 'तपाईंको सन्देश श्याम थापा तथा नेपाली क्यालेन्डर टिम (shyamthapa281@gmail.com) लाई पठाइएको छ।'
                    : 'Your message has been addressed to Shyam Thapa and the team at shyamthapa281@gmail.com.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setAdviceMessage('');
                  }}
                  className="mt-2 inline-block px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-xs transition-colors cursor-pointer"
                >
                  {lang === 'ne' ? 'अर्को सुझाव पठाउनुहोस्' : 'Send another note'}
                </button>
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
                        ? 'यहाँ आफ्नो प्रतिक्रिया वा क्यालेन्डर सम्बन्धी कुनै सल्लाह लेख्नुहोस्...'
                        : 'Write your reaction, advice, or suggestions here...'
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-y"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    <span>{lang === 'ne' ? 'सिधै इमेल:' : 'Direct email:'} <strong className="text-amber-400">shyamthapa281@gmail.com</strong></span>
                  </span>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'ne' ? 'प्रतिक्रिया पठाउनुहोस्' : 'Send Reaction / Advice'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Nepali Calendar (नेपाली क्यालेन्डर). All rights reserved.</p>
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

