import React, { useState } from 'react';
import { 
  Heart, 
  Coffee, 
  CreditCard, 
  QrCode, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Globe, 
  Send, 
  Server, 
  Radio as RadioIcon, 
  Calendar as CalendarIcon, 
  Award, 
  Smile, 
  ExternalLink,
  MessageSquareHeart,
  ChevronRight,
  Info
} from 'lucide-react';
import { Language } from '../types';

interface SupportWorkViewProps {
  lang: Language;
  onNavigate?: (tab: string) => void;
}

interface DonorTestimonial {
  id: string;
  name: string;
  location: string;
  amount: string;
  message: string;
  timeAgoNe: string;
  timeAgoEn: string;
  currency: 'NPR' | 'USD' | 'AUD';
}

export const SupportWorkView: React.FC<SupportWorkViewProps> = ({ lang, onNavigate }) => {
  const [activeDonationTab, setActiveDonationTab] = useState<'nepal' | 'international'>('nepal');
  const [selectedCurrency, setSelectedCurrency] = useState<'NPR' | 'USD' | 'AUD'>('NPR');
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Supporter Message form state
  const [donorName, setDonorName] = useState('');
  const [donorLocation, setDonorLocation] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [pledgeSubmitted, setPledgeSubmitted] = useState(false);

  // Mock list of community supporters (Wall of Gratitude)
  const [testimonials, setTestimonials] = useState<DonorTestimonial[]>([
    {
      id: '1',
      name: 'सुमन श्रेष्ठ (Suman Shrestha)',
      location: 'काठमाडौं, नेपाल (Kathmandu)',
      amount: 'रु ५००',
      message: 'दैनिक पञ्चाङ्ग, बिदा र चाडपर्व तालिका हेर्न निकै भरपर्दो छ। सम्पूर्ण टिमलाई धन्यवाद र निरन्तरताको शुभकामना!',
      timeAgoNe: '२ घण्टा अघि',
      timeAgoEn: '2 hours ago',
      currency: 'NPR',
    },
    {
      id: '2',
      name: 'सृजना गुरुङ (Srijana Gurung)',
      location: 'सिड्नी, अष्ट्रेलिया (Sydney, Australia)',
      amount: 'A$ 25',
      message: 'विदेशमा बस्दा पनि नेपालको तिथिमिति, चाडपर्व र रेडियो सुन्न पाउँदा आफ्नै घरमै भएको आभाष हुन्छ। राम्रो कामको लागि मेरो सानो सहयोग!',
      timeAgoNe: '५ घण्टा अघि',
      timeAgoEn: '5 hours ago',
      currency: 'AUD',
    },
    {
      id: '3',
      name: 'राजेश खड्का (Rajesh Khadka)',
      location: 'दोहा, कतार (Doha, Qatar)',
      amount: 'रु १,०००',
      message: 'निःशुल्क नेपाली क्यालेन्डर र ताजा समाचारको लागि मुरी मुरी धन्यवाद। यस्तो सफा र उपयोगी प्लेटफर्म नेपालको लागि गौरव हो।',
      timeAgoNe: '१ दिन अघि',
      timeAgoEn: '1 day ago',
      currency: 'NPR',
    },
    {
      id: '4',
      name: 'कमल अधिकारी (Kamal Adhikari)',
      location: 'डल्लास, अमेरिका (Dallas, USA)',
      amount: '$ 50',
      message: 'The Sudoku & Bagh-Chal traditional games plus the World Clock are top-notch. Proud to support independent Nepali tech developers!',
      timeAgoNe: '२ दिन अघि',
      timeAgoEn: '2 days ago',
      currency: 'USD',
    },
    {
      id: '5',
      name: 'पुजा शर्मा (Puja Sharma)',
      location: 'पोखरा, नेपाल (Pokhara, Nepal)',
      amount: 'रु २५०',
      message: 'जग्गा नाप (रोपनी/आना) र मिति रूपान्तरण मेरो अफिसियल काममा सधैं काम लाग्छ। एक कप चिया बराबरको सहयोग!',
      timeAgoNe: '३ दिन अघि',
      timeAgoEn: '3 days ago',
      currency: 'NPR',
    },
  ]);

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorMessage.trim()) return;

    const newTestimonial: DonorTestimonial = {
      id: Date.now().toString(),
      name: donorName.trim(),
      location: donorLocation.trim() || (lang === 'ne' ? 'नेपाल / विदेश' : 'Supporter'),
      amount: selectedCurrency === 'NPR' 
        ? `रु ${customAmount || selectedAmount}` 
        : `${selectedCurrency === 'AUD' ? 'A$' : '$'} ${customAmount || selectedAmount}`,
      message: donorMessage.trim(),
      timeAgoNe: 'भर्खरै',
      timeAgoEn: 'Just now',
      currency: selectedCurrency,
    };

    setTestimonials([newTestimonial, ...testimonials]);
    setPledgeSubmitted(true);
    setDonorName('');
    setDonorLocation('');
    setDonorMessage('');

    // Optional mailto for direct notification to director
    const subject = encodeURIComponent(`Nepali Calendar Donation Pledge: ${donorName}`);
    const body = encodeURIComponent(
      `Supporter Name: ${donorName}\n` +
      `Location: ${donorLocation}\n` +
      `Pledged Amount: ${newTestimonial.amount}\n\n` +
      `Message:\n${donorMessage}\n\n` +
      `Sent via Nepali Calendar Web App Support Page`
    );
    window.location.href = `mailto:shyamthapa281@gmail.com?subject=${subject}&body=${body}`;
  };

  // Preset donation amounts
  const nprAmounts = [
    { value: 100, label: 'रु १००', descNe: 'एक कप चिया ☕', descEn: 'Buy a Chiya' },
    { value: 250, label: 'रु २५०', descNe: 'रेडियो स्ट्रिमिङ 📻', descEn: 'Radio Bandwidth' },
    { value: 500, label: 'रु ५००', descNe: 'सर्भर सहयोग 💻', descEn: 'Server Supporter' },
    { value: 1000, label: 'रु १,०००', descNe: 'क्यालेन्डर संरक्षक 🌟', descEn: 'Calendar Patron' },
    { value: 2500, label: 'रु २,५००', descNe: 'मुख्य सहयोगी 💖', descEn: 'Major Benefactor' },
  ];

  const intlAmounts = [
    { value: 5, label: '$5', descNe: 'एक कप चिया ☕', descEn: 'Buy a Coffee' },
    { value: 15, label: '$15', descNe: 'सर्भर सहयोग 🚀', descEn: 'Server Supporter' },
    { value: 25, label: '$25', descNe: 'प्रविधि संरक्षक 🌟', descEn: 'Tech Patron' },
    { value: 50, label: '$50', descNe: 'विशेष दाता 💖', descEn: 'Special Benefactor' },
    { value: 100, label: '$100', descNe: 'महा संरक्षक 👑', descEn: 'Grand Sponsor' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 via-sky-800 to-blue-950 text-white p-6 sm:p-10 shadow-xl border border-sky-500/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold tracking-wide border border-white/10">
            <Heart className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
            <span>{lang === 'ne' ? 'हाम्रो कामलाई सहयोग तथा चन्दा' : 'Support Our Work & Donation'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'ne' 
              ? 'नेपाली क्यालेन्डरलाई सधैं निःशुल्क र भरपर्दो राख्न सहयोग गर्नुहोस्' 
              : 'Help Keep Nepali Calendar 100% Free, Independent & Fast for Everyone'}
          </h1>

          <p className="text-sky-100 text-xs sm:text-sm sm:leading-relaxed">
            {lang === 'ne'
              ? 'नेपाली क्यालेन्डर (बिक्रम संवत्), पञ्चाङ्ग, चाडपर्व, प्रत्यक्ष रेडियो, समाचार तथा उपयोगी रूपान्तरण उपकरणहरू विश्वभर छरिएर रहेका सम्पूर्ण नेपाली दाजुभाइ तथा दिदीबहिनीहरूका लागि निःशुल्क रूपमा उपलब्ध गराइएको छ। यसलाई निरन्तर सञ्चालन र थप स्तरीय बनाउन तपाईंको सानो सहयोगले ठूलो मद्दत पुग्नेछ।'
              : 'Our digital Bikram Sambat calendar, Panchanga, live FM radio streams, news aggregator, and conversion tools are independently built and kept 100% free with zero paywalls. Your kind contribution directly covers server costs, streaming bandwidth, and continuous Vedic ephemeris updates.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-sky-200">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ne' ? '१००% सुरक्षित र पारदर्शी' : '100% Safe & Transparent'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Globe className="w-4 h-4 text-sky-300" />
              <span>{lang === 'ne' ? 'नेपाल र विदेश (डायस्पोरा) दुवैबाट' : 'Nepal & Worldwide (Diaspora)'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Smile className="w-4 h-4 text-amber-300" />
              <span>{lang === 'ne' ? 'कुनै पनि रकम स्वीकार्य' : 'Any Amount Appreciated'}</span>
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -right-8 -bottom-12 opacity-10 text-white pointer-events-none select-none">
          <Heart className="w-80 h-80 fill-current" />
        </div>
      </div>

      {/* Main Grid: Donation Channels & Tier Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Donation Methods & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tab Selector: Nepal Domestic vs. International */}
          <div className="bg-white dark:bg-stone-900 p-2 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex items-center gap-2">
            <button
              type="button"
              id="donate-tab-nepal"
              onClick={() => {
                setActiveDonationTab('nepal');
                setSelectedCurrency('NPR');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeDonationTab === 'nepal'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <span>🇳🇵 {lang === 'ne' ? 'नेपालबाट सहयोग (eSewa / Khalti / Bank)' : 'From Nepal (eSewa, Khalti, Bank)'}</span>
            </button>

            <button
              type="button"
              id="donate-tab-intl"
              onClick={() => {
                setActiveDonationTab('international');
                setSelectedCurrency('USD');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeDonationTab === 'international'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <span>🌏 {lang === 'ne' ? 'विदेशबाट सहयोग (Coffee / PayPal / Card)' : 'International (Coffee, PayPal, Card)'}</span>
            </button>
          </div>

          {/* Amount Tier Selector Pills */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{lang === 'ne' ? 'सहयोग रकम रोज्नुहोस्' : 'Select Contribution Amount'}</span>
              </h3>
              
              {activeDonationTab === 'international' && (
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('USD')}
                    className={`px-2 py-0.5 rounded-lg cursor-pointer ${selectedCurrency === 'USD' ? 'bg-sky-600 text-white' : 'text-stone-500'}`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('AUD')}
                    className={`px-2 py-0.5 rounded-lg cursor-pointer ${selectedCurrency === 'AUD' ? 'bg-sky-600 text-white' : 'text-stone-500'}`}
                  >
                    AUD (A$)
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(activeDonationTab === 'nepal' ? nprAmounts : intlAmounts).map((tier) => {
                const isSelected = selectedAmount === tier.value && !customAmount;
                return (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(tier.value);
                      setCustomAmount('');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 ring-2 ring-sky-400 text-sky-950 dark:text-sky-100 shadow-xs'
                        : 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700/60 text-stone-700 dark:text-stone-300 hover:border-sky-300'
                    }`}
                  >
                    <div className="text-sm sm:text-base font-black">
                      {selectedCurrency === 'AUD' ? tier.label.replace('$', 'A$') : tier.label}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                      {lang === 'ne' ? tier.descNe : tier.descEn}
                    </div>
                  </button>
                );
              })}

              {/* Custom amount input */}
              <div className="p-2 rounded-2xl border border-stone-200 dark:border-stone-700/60 bg-stone-50/70 dark:bg-stone-800/40 flex flex-col justify-center">
                <label className="text-[10px] text-stone-500 dark:text-stone-400 font-bold block mb-1">
                  {lang === 'ne' ? 'आफ्नो इच्छाअनुसार:' : 'Custom Amount:'}
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-stone-500">
                    {selectedCurrency === 'NPR' ? 'रु' : selectedCurrency === 'AUD' ? 'A$' : '$'}
                  </span>
                  <input
                    type="number"
                    placeholder="500"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      if (e.target.value) setSelectedAmount(Number(e.target.value));
                    }}
                    className="w-full text-xs font-bold px-2 py-1 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 text-stone-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: NEPAL DOMESTIC (eSewa / Khalti / Bank Transfer) */}
          {activeDonationTab === 'nepal' && (
            <div className="space-y-4">
              {/* eSewa & Khalti Card */}
              <div className="bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                      eS
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                        eSewa (ईसेवा) / Khalti (खल्ती)
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {lang === 'ne' ? 'कुनै पनि नेपाली वालेट वा मोबाइल बैंकिङबाट' : 'Scan via eSewa, Khalti, or Mobile Banking'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-2.5 py-1 rounded-full">
                    {lang === 'ne' ? 'सजिलो र द्रुत' : 'Instant QR'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Clean SVG QR Code Representation */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-emerald-50/60 dark:bg-stone-800/80 rounded-2xl border border-emerald-200/60 dark:border-stone-700 text-center">
                    <div className="w-36 h-36 bg-white p-2.5 rounded-xl shadow-xs border border-stone-200 flex flex-col items-center justify-center relative">
                      <QrCode className="w-28 h-28 text-stone-800" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="w-7 h-7 rounded-md bg-emerald-600 text-white font-black text-[9px] flex items-center justify-center shadow-xs">
                          eS
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 mt-2 block">
                      {lang === 'ne' ? 'eSewa / Khalti QR स्क्यान गर्नुहोस्' : 'Scan with eSewa / Khalti App'}
                    </span>
                  </div>

                  {/* Manual ID / Account Details */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-[10.5px] text-stone-400 block font-medium">eSewa ID (ईसेवा आइडी):</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="font-mono font-bold text-stone-900 dark:text-white text-xs sm:text-sm">
                          shyamthapa281@gmail.com
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('shyamthapa281@gmail.com', 'esewa-id')}
                          className="px-2 py-1 rounded-md bg-white dark:bg-stone-700 hover:bg-sky-600 hover:text-white text-stone-700 dark:text-stone-300 text-[11px] font-semibold flex items-center gap-1 border border-stone-200 dark:border-stone-600 transition-colors cursor-pointer"
                        >
                          {copiedKey === 'esewa-id' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'esewa-id' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-[10.5px] text-stone-400 block font-medium">खातावालाको नाम (Account Name):</span>
                      <span className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm block">
                        Shyam Thapa (श्याम थापा)
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-[10.5px] text-stone-400 block font-medium">कैफियत / Remarks मा लेख्नुहोस्:</span>
                      <span className="font-bold text-sky-700 dark:text-sky-400 text-xs block">
                        "Nepali Calendar Support" वा आफ्नो नाम
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Bank Transfer / ConnectIPS Card */}
              <div className="bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200 dark:border-stone-800">
                  <CreditCard className="w-5 h-5 text-sky-600" />
                  <h4 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                    {lang === 'ne' ? 'नेपाल बैंक ट्रान्सफर / ConnectIPS' : 'Direct Nepal Bank Transfer / ConnectIPS'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-400 text-[10.5px] block">{lang === 'ne' ? 'बैंकको नाम:' : 'Bank Name:'}</span>
                    <span className="font-bold text-stone-900 dark:text-white text-xs">Global IME Bank / Nabil Bank</span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-400 text-[10.5px] block">{lang === 'ne' ? 'खाता नम्बर:' : 'Account Number:'}</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-stone-900 dark:text-white text-xs">01201010023456</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('01201010023456', 'bank-acc')}
                        className="px-2 py-0.5 rounded bg-white dark:bg-stone-700 text-[10.5px] font-bold border border-stone-200 dark:border-stone-600 cursor-pointer"
                      >
                        {copiedKey === 'bank-acc' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-400 text-[10.5px] block">{lang === 'ne' ? 'खातावालाको नाम:' : 'Account Holder:'}</span>
                    <span className="font-bold text-stone-900 dark:text-white text-xs">Shyam Thapa (Nepali Calendar)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-400 text-[10.5px] block">{lang === 'ne' ? 'शाखा (Branch):' : 'Branch:'}</span>
                    <span className="font-bold text-stone-900 dark:text-white text-xs">Kathmandu, Nepal</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERNATIONAL & DIASPORA (Coffee / PayPal / Card / Aus PayID) */}
          {activeDonationTab === 'international' && (
            <div className="space-y-4">
              {/* Buy Me a Coffee Card */}
              <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white dark:to-stone-900 p-5 sm:p-6 rounded-3xl border border-amber-300 dark:border-amber-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-xs">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-base text-stone-900 dark:text-white">
                        Buy Me a Coffee (चिया / कफी सहयोग)
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {lang === 'ne' ? 'अन्तर्राष्ट्रिय कार्ड, Apple Pay, Google Pay बाट द्रुत भुक्तानी' : 'Fast, secure support with Card, Apple Pay, or Google Pay'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2.5 py-1 rounded-full uppercase">
                    Popular
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {lang === 'ne'
                    ? 'अष्ट्रेलिया, अमेरिका, क्यानाडा, बेलायत, जापान, खाडी मुलुक वा युरोपबाट कुनै पनि क्रेडिट वा डेबिट कार्डमार्फत सजिलै सहयोग गर्न सकिन्छ।'
                    : 'Easily send support from Australia, USA, Canada, UK, Japan, Gulf countries, or Europe using any international debit or credit card.'}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="https://buymeacoffee.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Coffee className="w-4 h-4 fill-stone-950" />
                    <span>
                      {lang === 'ne' 
                        ? `Buy Me a Coffee ($${customAmount || selectedAmount})` 
                        : `Support via Buy Me a Coffee ($${customAmount || selectedAmount})`}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://paypal.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>PayPal / Card</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Australian Bank Transfer / PayID (For Australian Diaspora) */}
              <div className="bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200 dark:border-stone-800">
                  <span className="text-xl">🇦🇺</span>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                      {lang === 'ne' ? 'अष्ट्रेलिया बैंक ट्रान्सफर / PayID (Australia Osko)' : 'Australian Bank Transfer / PayID'}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Direct zero-fee instant transfer via PayID or BSB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-400 text-[10.5px] block font-medium">PayID (Email / Phone):</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-mono font-bold text-stone-900 dark:text-white text-xs">shyamthapa281@gmail.com</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('shyamthapa281@gmail.com', 'aus-payid')}
                        className="px-2 py-0.5 rounded bg-white dark:bg-stone-700 text-[10.5px] font-bold border border-stone-200 dark:border-stone-600 cursor-pointer"
                      >
                        {copiedKey === 'aus-payid' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-400 text-[10.5px] block font-medium">Account Name:</span>
                    <span className="font-bold text-stone-900 dark:text-white text-xs block">Shyam Thapa</span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-400 text-[10.5px] block font-medium">Location:</span>
                    <span className="font-bold text-stone-900 dark:text-white text-xs block">Craigieburn, Melbourne 3064, Victoria</span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-400 text-[10.5px] block font-medium">Transfer Reference:</span>
                    <span className="font-bold text-sky-700 dark:text-sky-400 text-xs block">Nepali Calendar</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Where Does Your Support Go? Transparency breakdown */}
          <div className="bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
              <Server className="w-4 h-4" />
              <span>{lang === 'ne' ? 'तपाईंको सहयोग कहाँ खर्च हुन्छ? (पारदर्शिता)' : 'How Your Contributions are Utilized'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-stone-800 dark:text-stone-200 mb-1">
                  <span>{lang === 'ne' ? 'क्लाउड सर्भर, डेटाबेस र होस्टिङ खर्च' : 'Cloud Servers, Database & High-Speed Hosting'}</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2">
                  <div className="bg-sky-600 h-2 rounded-full w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-800 dark:text-stone-200 mb-1">
                  <span>{lang === 'ne' ? 'पञ्चाङ्ग, तिथि गणना तथा नयाँ सुविधाहरूको विकास' : 'Bikram Sambat Ephemeris & Feature Development'}</span>
                  <span>30%</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full w-[30%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-800 dark:text-stone-200 mb-1">
                  <span>{lang === 'ne' ? 'लाइभ एफएम रेडियो स्ट्रिमिङ ब्यान्डविथ' : 'Live FM Radio Streaming Bandwidth'}</span>
                  <span>15%</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-[15%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-800 dark:text-stone-200 mb-1">
                  <span>{lang === 'ne' ? 'समुदाय सहयोग, बग फिक्स र मोबाइल सुधार' : 'Community Support, Bug Fixes & Mobile App'}</span>
                  <span>10%</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2">
                  <div className="bg-rose-500 h-2 rounded-full w-[10%]" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Wall of Gratitude & Leave a Donor Message */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Leave a Donor Note / Feedback Form */}
          <div className="bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                  {lang === 'ne' ? 'दाता सन्देश तथा सल्लाह लेख्नुहोस्' : 'Send a Supporter Message'}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {lang === 'ne' ? 'सहयोग गरेपछि आफ्नो नाम र शुभकामना सन्देश छाड्नुहोस्' : 'Leave your name and a warm message for our wall'}
                </p>
              </div>
            </div>

            {pledgeSubmitted && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    {lang === 'ne' ? 'मुरी मुरी धन्यवाद! तपाईंको सन्देश प्राप्त भयो।' : 'Thank you so much! Your message has been received.'}
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                    {lang === 'ne' ? 'नेपाली क्यालेन्डरलाई माया गरिदिनुभएकोमा हामी कृतज्ञ छौं।' : 'We are deeply grateful for your support.'}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handlePledgeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  {lang === 'ne' ? 'तपाईंको नाम (Your Name):' : 'Your Name:'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ne' ? 'उदा. श्याम थापा' : 'e.g. Shyam Thapa'}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  {lang === 'ne' ? 'स्थान / शहर (City / Country):' : 'City / Country:'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'ne' ? 'काठमाडौं / सिड्नी / डल्लास' : 'Kathmandu / Sydney / Dallas'}
                  value={donorLocation}
                  onChange={(e) => setDonorLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  {lang === 'ne' ? 'तपाईंको शुभकामना सन्देश (Message):' : 'Your Message / Feedback:'} *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={lang === 'ne' ? 'हाम्रो सेवा बारे तपाईंको अनुभव र सुझाव लेख्नुहोस्...' : 'Share your kind words, feedback or suggestions...'}
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? 'सन्देश पठाउनुहोस्' : 'Post Supporter Note'}</span>
              </button>
            </form>
          </div>

          {/* Wall of Gratitude (Recent Supporters) */}
          <div className="bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                  {lang === 'ne' ? 'सहयोगीहरूको सम्मान (Wall of Gratitude)' : 'Wall of Gratitude'}
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                {testimonials.length} {lang === 'ne' ? 'शुभचिन्तक' : 'Supporters'}
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 space-y-1.5 transition-all hover:border-sky-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-xs text-stone-900 dark:text-white block">
                        {t.name}
                      </span>
                      <span className="text-[10.5px] text-stone-400 block">
                        📍 {t.location} • {lang === 'ne' ? t.timeAgoNe : t.timeAgoEn}
                      </span>
                    </div>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 shrink-0">
                      {t.amount}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 italic leading-relaxed">
                    "{t.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick FAQ Card */}
          <div className="bg-sky-50/60 dark:bg-stone-800/40 p-5 rounded-3xl border border-sky-100 dark:border-stone-700/60 space-y-3 text-xs">
            <h4 className="font-extrabold text-stone-900 dark:text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-600" />
              <span>{lang === 'ne' ? 'प्रायः सोधिने प्रश्नहरू (FAQ)' : 'Frequently Asked Questions'}</span>
            </h4>

            <div className="space-y-2 text-stone-600 dark:text-stone-300">
              <div>
                <strong className="block text-stone-800 dark:text-stone-200">
                  {lang === 'ne' ? 'के यो साइट सधैं निःशुल्क रहन्छ?' : 'Will this site always stay free?'}
                </strong>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {lang === 'ne'
                    ? 'हो, क्यालेन्डर, पञ्चाङ्ग, रेडियो, समाचार र सबै औजारहरू सधैं निःशुल्क रहनेछन्।'
                    : 'Yes, our primary mission is keeping the calendar and cultural tools 100% free for everyone.'}
                </p>
              </div>

              <div>
                <strong className="block text-stone-800 dark:text-stone-200">
                  {lang === 'ne' ? 'के म कुनै विशेष चाडपर्व वा फिचर प्रायोजन (Sponsor) गर्न सक्छु?' : 'Can I sponsor a festival or feature?'}
                </strong>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {lang === 'ne'
                    ? 'अवश्य! दशैं, तिहार वा कुनै विशेष दिनमा शुभकामना सन्देश राख्न shyamthapa281@gmail.com मा सम्पर्क गर्नुहोस्।'
                    : 'Yes! For custom festive greetings or institutional sponsorship, feel free to email us directly.'}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
