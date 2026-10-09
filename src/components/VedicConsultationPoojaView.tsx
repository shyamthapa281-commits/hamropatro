import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Award, 
  Star, 
  ShieldCheck, 
  Flame, 
  Heart, 
  User, 
  ExternalLink, 
  MessageSquare, 
  Copy, 
  Check, 
  Globe, 
  ChevronRight,
  CreditCard,
  QrCode
} from 'lucide-react';
import { Language } from '../types';
import confetti from 'canvas-confetti';

interface VedicConsultationPoojaViewProps {
  lang: Language;
  prefilledKundaliData?: {
    name?: string;
    dob?: string;
    tob?: string;
    pob?: string;
  };
}

export interface AstrologerProfile {
  id: string;
  nameNe: string;
  nameEn: string;
  titleNe: string;
  titleEn: string;
  experienceYears: number;
  qualificationsNe: string;
  qualificationsEn: string;
  rating: number;
  totalConsultations: number;
  avatarUrl: string;
  specialtiesNe: string[];
  specialtiesEn: string[];
  languagesNe: string[];
  languagesEn: string[];
}

export const VERIFIED_ASTROLOGERS: AstrologerProfile[] = [
  {
    id: 'pt-chintamani',
    nameNe: 'पं. डा. चिन्तामणि शास्त्री',
    nameEn: 'Pt. Dr. Chintamani Shastri',
    titleNe: 'वरिष्ठ ज्योतिषाचार्य तथा वेदाङ्ग प्राध्यापक',
    titleEn: 'Senior Vedic Astrologer & Sanskrit Scholar',
    experienceYears: 26,
    qualificationsNe: 'पशुपतिनाथ संस्कृत विद्यापीठ (स्वर्ण पदक), विद्यावारिधि (PhD ज्योतिष)',
    qualificationsEn: 'Pashupatinath Sanskrit Vidhyapeeth (Gold Medalist), PhD in Vedic Astrology',
    rating: 4.95,
    totalConsultations: 1240,
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    specialtiesNe: ['करियर तथा व्यापार', 'ग्रहदोष तथा विंशोत्तरी दशा', 'विदेश यात्रा तथा ग्रिनकार्ड/PR'],
    specialtiesEn: ['Career & Business Growth', 'Graha Dosha & Mahadasha', 'Foreign Settlement & Visa'],
    languagesNe: ['नेपाली', 'English', 'हिन्दी', 'संस्कृत'],
    languagesEn: ['Nepali', 'English', 'Hindi', 'Sanskrit']
  },
  {
    id: 'jyotish-anuradha',
    nameNe: 'ज्योतिष रत्न अनुराधा ज्ञवाली',
    nameEn: 'Jyotish Ratna Anuradha Gyawali',
    titleNe: 'विवाह गुण मिलान तथा दाम्पत्य परामर्श विशेषज्ञ',
    titleEn: 'Marriage & Relationship Astrology Specialist',
    experienceYears: 18,
    qualificationsNe: 'त्रिभुवन विश्वविद्यालय, नेपाल ज्योतिष परिषद् केन्द्रीय सदस्य',
    qualificationsEn: 'Tribhuvan University, Member of Nepal Astrological Council',
    rating: 4.92,
    totalConsultations: 980,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    specialtiesNe: ['३६ गुण मिलान तथा नाडी दोष निवारण', 'प्रेम तथा दाम्पत्य सुख', 'सन्तान योग तथा शुभ साइत'],
    specialtiesEn: ['36 Gun Milan & Nadi Dosha Remedies', 'Love & Marital Harmony', 'Progeny Astrological Timing'],
    languagesNe: ['नेपाली', 'English', 'हिन्दी'],
    languagesEn: ['Nepali', 'English', 'Hindi']
  },
  {
    id: 'pt-keshav',
    nameNe: 'पं. केशवराज उपाध्याय',
    nameEn: 'Pt. Keshav Raj Upadhyay',
    titleNe: 'वास्तु तथा मुहूर्त शास्त्र विशेषज्ञ',
    titleEn: 'Vedic Vastu & Auspicious Muhurta Expert',
    experienceYears: 21,
    qualificationsNe: 'सम्पूर्णानन्द विश्वविद्यालय (आचार्य), वास्तु मार्तण्ड',
    qualificationsEn: 'Sampurnanand Sanskrit University (Acharya), Vastu Martand',
    rating: 4.89,
    totalConsultations: 850,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    specialtiesNe: ['घर तथा व्यवसायिक वास्तु', 'मुहूर्त साइत (गृहप्रवेश, लगन)', 'कानूनी तथा पारिवारिक बाधा'],
    specialtiesEn: ['Residential & Commercial Vastu', 'Auspicious Muhurta Calculation', 'Legal & Property Hurdles'],
    languagesNe: ['नेपाली', 'English', 'नेवारी'],
    languagesEn: ['Nepali', 'English', 'Newari']
  }
];

export interface PoojaPackage {
  id: string;
  titleNe: string;
  titleEn: string;
  templeNe: string;
  templeEn: string;
  taglineNe: string;
  taglineEn: string;
  priceNpr: number;
  priceUsd: number;
  badgeNe: string;
  badgeEn: string;
  includesNe: string[];
  includesEn: string[];
  deliveryNe: string;
  deliveryEn: string;
  image: string;
}

export const TEMPLE_POOJA_PACKAGES: PoojaPackage[] = [
  {
    id: 'rudri-mahamrityunjaya',
    titleNe: 'श्री पशुपतिनाथ महारुद्री तथा महामृत्युञ्जय अभिषेक',
    titleEn: 'Pashupatinath Mahamrityunjaya & Rudri Abhishek',
    templeNe: 'पशुपतिनाथ मूल मन्दिर परिसर, काठमाडौँ',
    templeEn: 'Pashupatinath Temple Sanctum, Kathmandu',
    taglineNe: 'स्वास्थ्य लाभ, अकाल मृत्यु भय निवारण र दीर्घायु प्राप्तिका लागि',
    taglineEn: 'For physical health, recovery from chronic ailments, and long life',
    priceNpr: 4500,
    priceUsd: 49,
    badgeNe: 'अत्यधिक लोकप्रिय',
    badgeEn: 'Most Booked',
    includesNe: [
      'पशुपतिनाथका वेदपाठी पण्डितद्वारा सगोत्रीय नाम उच्चारण संकल्प',
      '११ ब्राह्मणद्वारा रुद्री पाठ तथा जल-दुग्ध-मधु अभिषेक',
      '४K उच्च गुणस्तरको संकल्प भिडियो (WhatsApp मा तुरुन्त डेलिभरी)',
      'पशुपतिनाथको सिद्ध भस्म र रक्षा सूत्र'
    ],
    includesEn: [
      'Personalized family Gotra & Name Sankalpa by Vedacharya Pandit',
      'Rudri recitation & Panchamrit Abhishek in temple sanctum',
      'HD 4K Video recording of the family Sankalpa via WhatsApp',
      'Sanctified Bhasma & sacred Raksha Sutra sent digitally/physically'
    ],
    deliveryNe: 'पूजा सम्पन्न भएको २४ घण्टाभित्र भिडियो तथा तस्बिर प्राप्त हुनेछ।',
    deliveryEn: 'Full 4K Video & High-Res photos delivered within 24 hours of ritual.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'graha-shanti-kalsarpa',
    titleNe: 'नवग्रह शान्ति तथा कालसर्प / शनि साढेसाती शान्ति पूजा',
    titleEn: 'Navagraha Shanti & Kalsarpa / Shani Sade Sati Puja',
    templeNe: 'पशुपतिनाथ बागमती तट / गुह्येश्वरी परिसर',
    templeEn: 'Pashupatinath Riverbank & Guhyeshwari Temple',
    taglineNe: 'आर्थिक मन्दी, अचानक आउने विघ्नबाधा र मानसिक अशान्ति हटाउन',
    taglineEn: 'Removes financial hurdles, career stagnation, and mental anxiety',
    priceNpr: 5500,
    priceUsd: 59,
    badgeNe: 'ग्रह शान्ति',
    badgeEn: 'Graha Dosha',
    includesNe: [
      '९ वटै ग्रहहरूको वैदिक मन्त्रद्वारा हवन तथा दीप प्रज्वलन',
      'कालसर्प वा शनि दोष निवारणका लागि नाग पूजा तथा रुद्राभिषेक',
      'तपाईंको राशी अनुसारको विशेष शान्ति मन्त्र तथा यन्त्र प्रतिष्ठा',
      'सम्पूर्ण संकल्प तथा पूजा विधिको प्रत्यक्ष भिडियो रेकर्डिङ'
    ],
    includesEn: [
      'Full Navagraha Vedic Havan with 9 planetary Vedic mantras',
      'Special Naga Pooja & Shiva Abhishek for Kalsarpa/Shani removal',
      'Personalized energized planetary Yantra & mantra guidance',
      'Complete video recording with your name and gotra clearly recited'
    ],
    deliveryNe: 'शुभ मुहूर्तमा पूजा सम्पन्न गरी भिडियो तथा मन्त्र परामर्श पठाइन्छ।',
    deliveryEn: 'Performed on auspicious Tithi with full video & remedy report.',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'mangal-vivah-badha',
    titleNe: 'मङ्गलिक दोष तथा शीघ्र विवाह बाधा निवारण पूजा',
    titleEn: 'Mangal Dosha & Early Marriage Hurdle Removal Puja',
    templeNe: 'दक्षिणकाली मन्दिर तथा पशुपतिनाथ क्षेत्र',
    templeEn: 'Dakshinkali & Pashupatinath Sacred Grounds',
    taglineNe: 'विवाहमा ढिलाइ, सम्बन्धमा खटपट र मांगलिक दोष शान्तिका लागि',
    taglineEn: 'Removes marriage delays, relationship incompatibility, and Mangal Dosha',
    priceNpr: 3999,
    priceUsd: 39,
    badgeNe: 'विवाह योग',
    badgeEn: 'Marriage Harmony',
    includesNe: [
      'कुम्भ विवाह / अर्क विवाह विधि वा मङ्गल ग्रह विशेष शान्ति',
      'पार्वती-शिव युगल पूजा तथा मनोकामना संकल्प',
      'दाम्पत्य सुखका लागि विशेष मन्त्र जप तथा सिन्दूर प्रसाद',
      'नाम र गोत्र सहितको प्रत्यक्ष पूजा भिडियो'
    ],
    includesEn: [
      'Special Mangal Shanti ritual & Shiva-Parvati union blessings',
      'Personalized wish fulfillment Sankalpa for compatible partner',
      'Energized mantra guidance for marital peace & harmony',
      'Personalized video recording of Gotra recitation'
    ],
    deliveryNe: 'पूजा सम्पन्न हुनासाथ WhatsApp मा ४K भिडियो प्राप्त हुनेछ।',
    deliveryEn: 'Delivered directly to your WhatsApp with family name chants.',
    image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'birthday-anniversary-sankalpa',
    titleNe: 'जन्मदिन तथा वैवाहिक वार्षिकोत्सव आशीर्वाद पूजा',
    titleEn: 'Birthday & Anniversary Sacred Blessing Puja',
    templeNe: 'श्री मुक्तिनाथ वा पशुपतिनाथ मन्दिर',
    templeEn: 'Muktinath & Pashupatinath Sacred Sanctum',
    taglineNe: 'नयाँ वर्ष, जन्मदिन वा विशेष अवसरमा ईश्वरको दिव्य कृपा र रक्षा',
    taglineEn: 'Divine protection, prosperity, and blessings on your special day',
    priceNpr: 2999,
    priceUsd: 29,
    badgeNe: 'आशीर्वाद',
    badgeEn: 'Special Blessing',
    includesNe: [
      'जन्मदिन वा वार्षिकोत्सवको दिन पशुपतिनाथमा परिवारको नाममा दीप प्रज्वलन',
      'आयुष्य होम तथा गणेश-सरस्वती-लक्ष्मी विशेष पूजा',
      'पण्डितजीद्वारा शुभकामना आशीर्वाद तथा ४K भिडियो सन्देश',
      'डिजिटल संकल्प प्रमाणपत्र'
    ],
    includesEn: [
      'Temple lamp lighting in your family’s name on your special day',
      'Ayushya Havan & Ganesh-Lakshmi prosperity prayers',
      'Personalized 4K video blessing message from Vedacharya',
      'Official Digital Sankalpa Certificate'
    ],
    deliveryNe: 'जन्मदिन वा उत्सवको दिन बिहानै भिडियो सन्देश पठाइन्छ।',
    deliveryEn: 'Video delivered early morning on your birthday/anniversary.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
  }
];

export const VedicConsultationPoojaView: React.FC<VedicConsultationPoojaViewProps> = ({ 
  lang,
  prefilledKundaliData
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'consultation' | 'pooja'>('consultation');
  
  // Consultation Booking State
  const [selectedAstrologer, setSelectedAstrologer] = useState<AstrologerProfile>(VERIFIED_ASTROLOGERS[0]);
  const [consultationTier, setConsultationTier] = useState<'express' | 'comprehensive' | 'couple'>('comprehensive');
  const [clientName, setClientName] = useState(prefilledKundaliData?.name || '');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientDob, setClientDob] = useState(prefilledKundaliData?.dob || '');
  const [clientTob, setClientTob] = useState(prefilledKundaliData?.tob || '');
  const [clientPob, setClientPob] = useState(prefilledKundaliData?.pob || '');
  const [clientTopic, setClientTopic] = useState('Career & Financial Growth');
  const [clientQuestion, setClientQuestion] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('08:00 AM - 11:00 AM NPT (Morning)');
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  // Pooja Booking State
  const [selectedPooja, setSelectedPooja] = useState<PoojaPackage>(TEMPLE_POOJA_PACKAGES[0]);
  const [poojaDevoteeName, setPoojaDevoteeName] = useState(prefilledKundaliData?.name || '');
  const [poojaGotra, setPoojaGotra] = useState('');
  const [poojaFamilyNames, setPoojaFamilyNames] = useState('');
  const [poojaDate, setPoojaDate] = useState('');
  const [poojaWhatsapp, setPoojaWhatsapp] = useState('');
  const [showPoojaModal, setShowPoojaModal] = useState(false);

  // Checkout State
  const [paymentCurrency, setPaymentCurrency] = useState<'NPR' | 'USD'>('NPR');
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti' | 'card'>('esewa');
  const [transactionRef, setTransactionRef] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const getConsultationPrice = () => {
    if (consultationTier === 'express') return { npr: 999, usd: 12.99 };
    if (consultationTier === 'couple') return { npr: 2999, usd: 34.99 };
    return { npr: 1999, usd: 24.99 };
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsBooked(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  const resetBooking = () => {
    setIsBooked(false);
    setShowConsultationModal(false);
    setShowPoojaModal(false);
    setTransactionRef('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white p-6 sm:p-8 border border-amber-600/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{lang === 'ne' ? 'प्रत्यक्ष वैदिक परामर्श तथा मन्दिर पूजा' : 'Live Jyotish Consultation & Sacred Temple Puja'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {lang === 'ne' ? 'पशुपतिनाथका विद्वान ज्योतिषी तथा मन्दिर संकल्प सेवा' : 'Verified Vedic Astrologers & Pashupatinath Sankalpa'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {lang === 'ne'
              ? 'नेपाल तथा विदेशमा रहनुभएका सम्पूर्ण नेपालीहरूका लागि १-on-१ प्रत्यक्ष भिडियो परामर्श र पशुपतिनाथ मन्दिरबाट प्रत्यक्ष गोत्रोच्चारण सहितको पूजा संकल्प।'
              : 'Direct 1-on-1 private video calls with verified senior Vedic astrologers and authentic proxy Sankalpa Puja performed in your family name at Pashupatinath Temple.'}
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex bg-stone-950/80 p-1.5 rounded-2xl border border-stone-800 shrink-0 self-stretch md:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('consultation')}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'consultation'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{lang === 'ne' ? '१. ज्योतिषी परामर्श' : '1. Jyotish Call'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('pooja')}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'pooja'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>{lang === 'ne' ? '२. पशुपतिनाथ पूजा संकल्प' : '2. Temple Puja'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: ASTROLOGER 1-ON-1 VIDEO CONSULTATION */}
      {activeSubTab === 'consultation' && (
        <div className="space-y-6">
          
          {/* Service Guarantee Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-stone-900 dark:text-white font-bold">{lang === 'ne' ? 'प्रमाणित ज्योतिषाचार्य' : 'Verified Acharyas'}</strong>
                <span className="text-stone-500 dark:text-stone-400 text-[11px]">{lang === 'ne' ? '१५+ वर्ष अनुभव र आधिकारिक उपाधि' : '15+ Years Experience & Formal Degrees'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-stone-900 dark:text-white font-bold">{lang === 'ne' ? '१००% पूर्ण गोपनीयता' : '100% Confidential'}</strong>
                <span className="text-stone-500 dark:text-stone-400 text-[11px]">{lang === 'ne' ? 'तपाईंको जन्म कुण्डली र संवाद सुरक्षित' : 'Private End-to-End Consultation'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-stone-900 dark:text-white font-bold">{lang === 'ne' ? 'विश्वव्यापी समय अनुकूल' : 'Global Timezone Sync'}</strong>
                <span className="text-stone-500 dark:text-stone-400 text-[11px]">{lang === 'ne' ? 'अमेरिका, अस्ट्रेलिया, खाडी र युरोप' : 'US, Australia, Gulf & Europe Slots'}</span>
              </div>
            </div>
          </div>

          {/* Pricing Tiers Selection */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>{lang === 'ne' ? 'परामर्श योजना छान्नुहोस् (Consultation Plan):' : 'Select Consultation Plan:'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Plan 1: Express */}
              <div 
                onClick={() => setConsultationTier('express')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                  consultationTier === 'express'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md'
                    : 'border-stone-200 dark:border-stone-800 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-300">
                    Express 15m
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-black text-stone-900 dark:text-white">रु ९९९</span>
                    <span className="text-stone-400 text-xs block">($12.99 USD)</span>
                  </div>
                </div>
                <h4 className="font-black text-sm text-stone-900 dark:text-white">{lang === 'ne' ? 'द्रुत अडियो / च्याट परामर्श' : 'Express Audio / Call'}</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {lang === 'ne' ? '१५ मिनेट प्रत्यक्ष संवाद, २ वटा विशिष्ट प्रश्नको ज्योतिषीय समाधान र सरल वैदिक उपाय।' : '15-min direct audio call, 2 specific questions answered with immediate remedies.'}
                </p>
                <ul className="text-[11px] text-stone-600 dark:text-stone-300 space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {lang === 'ne' ? '२ वटा महत्वपूर्ण प्रश्न' : '2 Core Questions'}</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {lang === 'ne' ? 'व्हाट्सएप अडियो कल' : 'WhatsApp Audio Call'}</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {lang === 'ne' ? 'भाग्यशाली रत्न र मन्त्र' : 'Lucky Gemstone & Mantra'}</li>
                </ul>
              </div>

              {/* Plan 2: Comprehensive (Featured) */}
              <div 
                onClick={() => setConsultationTier('comprehensive')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative ${
                  consultationTier === 'comprehensive'
                    ? 'border-amber-600 bg-amber-500/10 dark:bg-amber-950/30 shadow-lg ring-2 ring-amber-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-amber-300'
                }`}
              >
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  {lang === 'ne' ? 'अत्यधिक सिफारिस गरिएको' : 'Most Popular'}
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500 text-stone-950">
                    Video 30m
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400">रु १,९९९</span>
                    <span className="text-stone-400 text-xs block">($24.99 USD)</span>
                  </div>
                </div>
                <h4 className="font-black text-sm text-stone-900 dark:text-white">{lang === 'ne' ? 'विस्तृत भिडियो कुण्डली विश्लेषण' : 'Comprehensive 30m Video'}</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {lang === 'ne' ? '३० मिनेट १-on-१ प्रत्यक्ष भिडियो कल, १२ भाव, विंशोत्तरी दशा, करियर, विवाह र विदेश योगको सम्पूर्ण परामर्श।' : '30-min 1-on-1 live video call covering 12 houses, Mahadasha, career, foreign PR & marriage.'}
                </p>
                <ul className="text-[11px] text-stone-600 dark:text-stone-300 space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {lang === 'ne' ? 'असीमित प्रश्नहरू (३० मिनेट)' : 'Unlimited Questions (30 min)'}</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {lang === 'ne' ? 'Google Meet / WhatsApp Video' : 'Live Google Meet / WhatsApp'}</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {lang === 'ne' ? 'लिखित परामर्श प्रतिवेदन PDF' : 'Written Summary Dossier PDF'}</li>
                </ul>
              </div>

              {/* Plan 3: Couple */}
              <div 
                onClick={() => setConsultationTier('couple')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                  consultationTier === 'couple'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md'
                    : 'border-stone-200 dark:border-stone-800 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
                    Couple 45m
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-black text-stone-900 dark:text-white">रु २,९९९</span>
                    <span className="text-stone-400 text-xs block">($34.99 USD)</span>
                  </div>
                </div>
                <h4 className="font-black text-sm text-stone-900 dark:text-white">{lang === 'ne' ? 'विवाह ३६ गुण तथा कुण्डली मिलान' : 'Couple Gun Milan Special'}</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {lang === 'ne' ? 'वर र कन्या दुवैको कुण्डली संयुक्त विश्लेषण, नाडी/भकूट दोष परिहार, पारिवारिक सुख र दीर्घायु परामर्श।' : '45-min dual chart consultation for bride and groom, dosha remedies and lifelong harmony.'}
                </p>
                <ul className="text-[11px] text-stone-600 dark:text-stone-300 space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {lang === 'ne' ? 'दुवै कुण्डलीको संयुक्त अध्ययन' : 'Joint Dual Chart Reading'}</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {lang === 'ne' ? 'दोष निवारण तथा शान्ति विधि' : 'Dosha Mitigation Rituals'}</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {lang === 'ne' ? 'विवाह साइत तथा मुहूर्त सल्लाह' : 'Wedding Muhurta Recommendations'}</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Astrologers Cards */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-amber-600" />
              <span>{lang === 'ne' ? 'ज्योतिषी छान्नुहोस् र समय सुरक्षित गर्नुहोस्:' : 'Select Verified Astrologer:'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VERIFIED_ASTROLOGERS.map((astrologer) => (
                <div 
                  key={astrologer.id}
                  className={`bg-white dark:bg-stone-900 rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
                    selectedAstrologer.id === astrologer.id
                      ? 'border-amber-600 shadow-md ring-2 ring-amber-500/20'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img 
                        src={astrologer.avatarUrl} 
                        alt={astrologer.nameEn} 
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/30"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                          {lang === 'ne' ? astrologer.nameNe : astrologer.nameEn}
                        </h4>
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold leading-tight">
                          {lang === 'ne' ? astrologer.titleNe : astrologer.titleEn}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-black text-stone-900 dark:text-white text-[11px]">{astrologer.rating}</span>
                          <span className="text-stone-400 text-[10px]">({astrologer.totalConsultations}+ calls)</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800">
                      <strong>{lang === 'ne' ? 'शैक्षिक योग्यता:' : 'Credentials:'} </strong>
                      {lang === 'ne' ? astrologer.qualificationsNe : astrologer.qualificationsEn}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        {lang === 'ne' ? 'विशेषज्ञता:' : 'Specialties:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(lang === 'ne' ? astrologer.specialtiesNe : astrologer.specialtiesEn).map((spec, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-medium">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAstrologer(astrologer);
                      setShowConsultationModal(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{lang === 'ne' ? 'समय सुरक्षित गर्नुहोस् (Book Slot)' : 'Book Consultation'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: PASHUPATINATH & TEMPLE SANKALPA PUJA */}
      {activeSubTab === 'pooja' && (
        <div className="space-y-6">
          
          <div className="bg-amber-950/30 border border-amber-600/30 rounded-3xl p-5 text-xs text-amber-200 flex items-start gap-3">
            <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white font-bold text-sm mb-1">
                {lang === 'ne' ? 'पशुपतिनाथ मन्दिरबाट प्रत्यक्ष गोत्रोच्चारण पूजा कसरी सम्पन्न हुन्छ?' : 'How Does the Remote Pashupatinath Sankalpa Puja Work?'}
              </strong>
              <p className="leading-relaxed">
                {lang === 'ne'
                  ? 'तपाईं संसारको जुनसुकै कुनामा भए पनि, पशुपतिनाथका मुख्य वेदपाठी पण्डितजीले मन्दिरको मूल गर्भगृह अगाडि तपाईं र तपाईंको सम्पूर्ण परिवारको नाम तथा गोत्र उच्चारण गरी पूजाको संकल्प गर्नुहुन्छ। पूजा सम्पन्न हुनासाथ मन्त्रोच्चारण सहितको ४K भिडियो तपाईंको WhatsApp मा पठाइनेछ।'
                  : 'Regardless of where you reside globally, an ordained Vedacharya Pandit recites your family Gotra and names in front of Pashupatinath’s holy sanctum. A complete 4K video recording with family names is sent directly to your WhatsApp.'}
              </p>
            </div>
          </div>

          {/* Pooja Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEMPLE_POOJA_PACKAGES.map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.titleEn} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <span className="absolute top-3 left-3 bg-amber-500 text-stone-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      {lang === 'ne' ? pkg.badgeNe : pkg.badgeEn}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] text-amber-300 font-semibold block">{lang === 'ne' ? pkg.templeNe : pkg.templeEn}</span>
                      <h4 className="font-extrabold text-base leading-snug">{lang === 'ne' ? pkg.titleNe : pkg.titleEn}</h4>
                    </div>
                  </div>

                  <div className="p-5 space-y-3.5 text-xs">
                    <p className="text-stone-600 dark:text-stone-300 font-medium">
                      {lang === 'ne' ? pkg.taglineNe : pkg.taglineEn}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        {lang === 'ne' ? 'पूजा अन्तर्गत समावेश विधिहरू:' : 'Ritual Inclusions:'}
                      </span>
                      <ul className="space-y-1.5 text-stone-700 dark:text-stone-300">
                        {(lang === 'ne' ? pkg.includesNe : pkg.includesEn).map((inc, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400">
                      <strong>{lang === 'ne' ? 'भिडियो डेलिभरी:' : 'Delivery:'} </strong>
                      {lang === 'ne' ? pkg.deliveryNe : pkg.deliveryEn}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-stone-50 dark:bg-stone-800/40 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400">रु {pkg.priceNpr.toLocaleString()}</span>
                    <span className="text-stone-400 text-xs block">(${pkg.priceUsd} USD)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPooja(pkg);
                      setShowPoojaModal(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    <Flame className="w-4 h-4" />
                    <span>{lang === 'ne' ? 'संकल्प बुक गर्नुहोस्' : 'Book Sankalpa'}</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* MODAL 1: CONSULTATION BOOKING MODAL */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto space-y-5">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-amber-600" />
                  <span>{lang === 'ne' ? 'ज्योतिषी परामर्श समय सुरक्षित गर्नुहोस्' : 'Book Jyotish Consultation'}</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {lang === 'ne' ? selectedAstrologer.nameNe : selectedAstrologer.nameEn} • {consultationTier.toUpperCase()}
                </p>
              </div>
              <button 
                type="button" 
                onClick={resetBooking} 
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isBooked ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-stone-900 dark:text-white">
                  {lang === 'ne' ? 'परामर्श समय सफलतापूर्वक सुरक्षित भयो!' : 'Consultation Confirmed!'}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                  {lang === 'ne' 
                    ? `धन्यवाद ${clientName}! तपाईंको परामर्श समय ${preferredDate || 'आज'} (${preferredSlot}) का लागि सुरक्षित भएको छ। ज्योतिषीको WhatsApp / Google Meet लिङ्क तपाईंको नम्बरमा पठाइएको छ।` 
                    : `Thank you ${clientName}! Your session is confirmed for ${preferredDate || 'Today'} (${preferredSlot}). The WhatsApp / Google Meet link has been sent.`}
                </p>
                
                <div className="pt-2">
                  <a
                    href={`https://wa.me/9779800000000?text=Namaste%20Guruji,%20I%20have%20booked%20a%20consultation%20(Ref:%20${transactionRef})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{lang === 'ne' ? 'व्हाट्सएपमा तुरुन्त सम्पर्क गर्नुहोस्' : 'Connect on WhatsApp Now'}</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/40 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white block">{lang === 'ne' ? 'शुल्क (Fee):' : 'Consultation Fee:'}</span>
                    <span className="text-[11px] text-stone-500">{consultationTier === 'express' ? '15 Min Express' : consultationTier === 'couple' ? '45 Min Couple' : '30 Min Full Video'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-amber-600 dark:text-amber-400">रु {getConsultationPrice().npr}</span>
                    <span className="text-[10px] text-stone-400 block">(${getConsultationPrice().usd} USD)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                      {lang === 'ne' ? 'पूरा नाम:' : 'Full Name:'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Ram Bahadur Thapa"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                      {lang === 'ne' ? 'व्हाट्सएप / फोन नम्बर:' : 'WhatsApp / Phone:'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+977 / +61 / +1..."
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                      {lang === 'ne' ? 'जन्म मिति:' : 'DOB:'}
                    </label>
                    <input
                      type="date"
                      value={clientDob}
                      onChange={(e) => setClientDob(e.target.value)}
                      className="w-full px-2 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                      {lang === 'ne' ? 'जन्म समय:' : 'Time:'}
                    </label>
                    <input
                      type="time"
                      value={clientTob}
                      onChange={(e) => setClientTob(e.target.value)}
                      className="w-full px-2 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                      {lang === 'ne' ? 'जन्म स्थान:' : 'Birth Place:'}
                    </label>
                    <input
                      type="text"
                      value={clientPob}
                      onChange={(e) => setClientPob(e.target.value)}
                      placeholder="e.g. Pokhara"
                      className="w-full px-2 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                      {lang === 'ne' ? 'परामर्श मिति (Date):' : 'Preferred Date:'} *
                    </label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                      {lang === 'ne' ? 'समय स्लट (Time Slot):' : 'Time Slot:'}
                    </label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium"
                    >
                      <option value="08:00 AM - 11:00 AM NPT (Morning)">08:00 AM - 11:00 AM NPT (विहान)</option>
                      <option value="01:00 PM - 04:00 PM NPT (Afternoon)">01:00 PM - 04:00 PM NPT (दिउँसो)</option>
                      <option value="06:00 PM - 09:00 PM NPT (Evening)">06:00 PM - 09:00 PM NPT (साँझ)</option>
                      <option value="09:00 PM - 11:30 PM NPT (Night/Diaspora)">09:00 PM - 11:30 PM NPT (डाइस्पोरा राती)</option>
                    </select>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <label className="block text-stone-700 dark:text-stone-300 font-bold">
                    {lang === 'ne' ? 'भुक्तानी माध्यम (Payment Method):' : 'Payment Method:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('esewa')}
                      className={`py-2 px-3 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                        paymentMethod === 'esewa'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                          : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      eSewa (रु)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('khalti')}
                      className={`py-2 px-3 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                        paymentMethod === 'khalti'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300'
                          : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      Khalti (रु)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 px-3 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300'
                          : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      Card / Stripe ($)
                    </button>
                  </div>

                  {/* Payment Details Box */}
                  <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                    {paymentMethod === 'esewa' && (
                      <div className="flex items-center justify-between text-xs">
                        <span>eSewa ID: <strong>9800000000</strong> (Shyam Thapa)</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('9800000000', 'esewa')}
                          className="text-emerald-600 font-bold hover:underline cursor-pointer"
                        >
                          {copiedKey === 'esewa' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    )}
                    {paymentMethod === 'khalti' && (
                      <div className="flex items-center justify-between text-xs">
                        <span>Khalti ID: <strong>9800000000</strong> (Shyam Thapa)</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('9800000000', 'khalti')}
                          className="text-purple-600 font-bold hover:underline cursor-pointer"
                        >
                          {copiedKey === 'khalti' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    )}
                    {paymentMethod === 'card' && (
                      <div className="text-xs text-stone-500">
                        PayPal / International Card: <strong>shyamthapa281@gmail.com</strong> ($24.99 USD)
                      </div>
                    )}

                    <div>
                      <input
                        type="text"
                        required
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="eSewa / Khalti Ref Code वा Trx ID लेख्नुहोस् *"
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium text-xs"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <span>प्रमाणीकरण हुँदैछ (Verifying)...</span>
                  ) : (
                    <span>परामर्श सुरक्षित गर्नुहोस् (Confirm Booking)</span>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL 2: POOJA BOOKING MODAL */}
      {showPoojaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto space-y-5">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-600" />
                  <span>{lang === 'ne' ? 'पशुपतिनाथ पूजा संकल्प विवरण' : 'Book Pashupatinath Sankalpa'}</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {lang === 'ne' ? selectedPooja.titleNe : selectedPooja.titleEn}
                </p>
              </div>
              <button 
                type="button" 
                onClick={resetBooking} 
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isBooked ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <Flame className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-stone-900 dark:text-white">
                  {lang === 'ne' ? 'पूजा संकल्प सफलतापूर्वक दर्ता भयो!' : 'Sankalpa Registered!'}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                  {lang === 'ne' 
                    ? `हर हर महादेव! ${poojaDevoteeName} (गोत्र: ${poojaGotra || 'कश्यप'}) को नाममा पशुपतिनाथ मन्दिरमा संकल्प दर्ता भएको छ। पूजा सम्पन्न हुनासाथ ४K भिडियो तपाईंको WhatsApp (${poojaWhatsapp}) मा पठाइनेछ।` 
                    : `Har Har Mahadev! Sankalpa registered under ${poojaDevoteeName} (Gotra: ${poojaGotra || 'Kashyap'}). Full 4K video will be delivered to ${poojaWhatsapp}.`}
                </p>
                
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetBooking}
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md cursor-pointer"
                  >
                    <span>{lang === 'ne' ? 'सम्पन्न भयो (Done)' : 'Close'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/40 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white block">{lang === 'ne' ? 'पूजा भेटी (Dakshina / Fee):' : 'Pooja Fee:'}</span>
                    <span className="text-[11px] text-stone-500">{lang === 'ne' ? selectedPooja.templeNe : selectedPooja.templeEn}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-amber-600 dark:text-amber-400">रु {selectedPooja.priceNpr.toLocaleString()}</span>
                    <span className="text-[10px] text-stone-400 block">(${selectedPooja.priceUsd} USD)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                      {lang === 'ne' ? 'मुख्य संकल्पकर्ताको नाम:' : 'Primary Devotee Name:'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={poojaDevoteeName}
                      onChange={(e) => setPoojaDevoteeName(e.target.value)}
                      placeholder="e.g. Shyam Thapa"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                      {lang === 'ne' ? 'पारिवारिक गोत्र (Gotra):' : 'Family Gotra:'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={poojaGotra}
                      onChange={(e) => setPoojaGotra(e.target.value)}
                      placeholder="e.g. कश्यप / भारद्वाज / थाहा नभए 'कश्यप'"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                    {lang === 'ne' ? 'संकल्पमा उच्चारण गरिने परिवारका अन्य सदस्यहरूका नाम:' : 'Family Member Names for Sankalpa:'}
                  </label>
                  <textarea
                    rows={2}
                    value={poojaFamilyNames}
                    onChange={(e) => setPoojaFamilyNames(e.target.value)}
                    placeholder="e.g. जीवनसाथी, छोराछोरी वा आमाबुबाका नामहरू..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                      {lang === 'ne' ? 'पूजा गर्ने इच्छित मिति:' : 'Preferred Date:'} *
                    </label>
                    <input
                      type="date"
                      required
                      value={poojaDate}
                      onChange={(e) => setPoojaDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                      {lang === 'ne' ? 'भिडियो प्राप्त गर्ने WhatsApp नम्बर:' : 'WhatsApp for Video:'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={poojaWhatsapp}
                      onChange={(e) => setPoojaWhatsapp(e.target.value)}
                      placeholder="+977 / +61 / +1..."
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <label className="block text-stone-700 dark:text-stone-300 font-bold">
                    {lang === 'ne' ? 'भेटी भुक्तानी माध्यम:' : 'Payment Method:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('esewa')}
                      className={`py-2 px-3 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                        paymentMethod === 'esewa'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                          : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      eSewa (रु)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('khalti')}
                      className={`py-2 px-3 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                        paymentMethod === 'khalti'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300'
                          : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      Khalti (रु)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 px-3 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300'
                          : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      Card / Stripe ($)
                    </button>
                  </div>

                  <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                    {paymentMethod === 'esewa' && (
                      <div className="flex items-center justify-between text-xs">
                        <span>eSewa ID: <strong>9800000000</strong> (Shyam Thapa)</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('9800000000', 'esewa')}
                          className="text-emerald-600 font-bold hover:underline cursor-pointer"
                        >
                          {copiedKey === 'esewa' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    )}
                    {paymentMethod === 'khalti' && (
                      <div className="flex items-center justify-between text-xs">
                        <span>Khalti ID: <strong>9800000000</strong> (Shyam Thapa)</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('9800000000', 'khalti')}
                          className="text-purple-600 font-bold hover:underline cursor-pointer"
                        >
                          {copiedKey === 'khalti' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    )}
                    {paymentMethod === 'card' && (
                      <div className="text-xs text-stone-500">
                        PayPal / International Card: <strong>shyamthapa281@gmail.com</strong> (${selectedPooja.priceUsd} USD)
                      </div>
                    )}

                    <div>
                      <input
                        type="text"
                        required
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="eSewa / Khalti Ref Code वा Trx ID लेख्नुहोस् *"
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium text-xs"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <span>प्रमाणीकरण हुँदैछ (Verifying)...</span>
                  ) : (
                    <span>संकल्प दर्ता गर्नुहोस् (Confirm Sankalpa)</span>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
