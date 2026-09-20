import React, { useState } from 'react';
import { 
  Building2, 
  PhoneCall, 
  ExternalLink, 
  Search, 
  Shield, 
  Flame, 
  Car, 
  HeartHandshake, 
  Users, 
  Activity, 
  AlertTriangle, 
  Droplet, 
  FileWarning, 
  Compass, 
  Phone, 
  Copy, 
  Check, 
  Globe2, 
  Info,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { Language } from '../types';
import { EMERGENCY_HOTLINES, GOVERNMENT_PORTALS } from '../data/governmentData';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import { GovernmentMapView } from './GovernmentMapView';

interface GovernmentHelpCentreProps {
  lang: Language;
}

export const GovernmentHelpCentreView: React.FC<GovernmentHelpCentreProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'emergency' | 'map' | 'portals' | 'guide'>('map');
  const [portalCategory, setPortalCategory] = useState<string>('all');
  const [portalSearch, setPortalSearch] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Icon map for hotlines
  const getHotlineIcon = (type: string) => {
    switch (type) {
      case 'Shield':
        return <Shield className="w-5 h-5 text-red-600" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-600" />;
      case 'Ambulance':
        return <Activity className="w-5 h-5 text-emerald-600" />;
      case 'Car':
        return <Car className="w-5 h-5 text-blue-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'PhoneCall':
        return <PhoneCall className="w-5 h-5 text-red-700" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-pink-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-amber-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-teal-600" />;
      case 'FileWarning':
        return <FileWarning className="w-5 h-5 text-stone-700" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'Droplet':
        return <Droplet className="w-5 h-5 text-rose-600" />;
      default:
        return <Phone className="w-5 h-5 text-red-600" />;
    }
  };

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  // Filtered portals
  const filteredPortals = GOVERNMENT_PORTALS.filter((p) => {
    const matchesCategory = portalCategory === 'all' || p.category === portalCategory;
    const matchesSearch =
      portalSearch.trim() === '' ||
      p.nameNe.toLowerCase().includes(portalSearch.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(portalSearch.toLowerCase()) ||
      p.descriptionNe.toLowerCase().includes(portalSearch.toLowerCase()) ||
      p.services.some((s) => s.toLowerCase().includes(portalSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 w-full overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-800 via-stone-900 to-red-950 text-white rounded-3xl p-5 sm:p-7 shadow-md mb-6 border border-red-700/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/50 rounded-full border border-red-400/40 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'ne' ? 'नेपाल सरकार डिजिटल सेवा केन्द्र' : 'Government of Nepal Citizen Services'}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                {lang === 'ne' ? 'सरकारी सेवा पोर्टल, नक्सा तथा आपतकालीन सहायता' : 'Public Services Map, Government Portals & Help Centre'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
                {lang === 'ne'
                  ? 'सिंहदरबार, नेपाल प्रहरी, अस्पताल, राहदानी, राष्ट्रिय परिचयपत्र लगायतका सेवा केन्द्रहरूको प्रत्यक्ष नक्सा तथा २४ घण्टे राष्ट्रिय हटलाइनहरू।'
                  : 'Interactive map of major government centers (Singha Durbar, Police, Hospitals, Passports, NID) and 24/7 national emergency hotlines.'}
              </p>
            </div>

            {/* Quick Banner Toggle Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
              <button
                onClick={() => setActiveTab('map')}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  activeTab === 'map'
                    ? 'bg-amber-400 text-stone-900 font-extrabold ring-2 ring-amber-300'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>{lang === 'ne' ? 'नक्सा हेर्नुहोस्' : 'Explore Map'}</span>
              </button>
              <button
                onClick={() => setActiveTab('emergency')}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  activeTab === 'emergency'
                    ? 'bg-red-600 text-white font-extrabold ring-2 ring-red-400'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-red-300" />
                <span>{lang === 'ne' ? 'हटलाइनहरू' : 'Hotlines'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode Navigation (Tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none w-full">
        {[
          { id: 'map', nameNe: 'सेवा केन्द्र नक्सा (Services Map)', nameEn: 'Interactive Map View', icon: MapPin },
          { id: 'emergency', nameNe: 'आपतकालीन हटलाइनहरू (Emergency Numbers)', nameEn: 'Emergency Hotlines', icon: PhoneCall },
          { id: 'portals', nameNe: 'सरकारी डिजिटल पोर्टलहरू (Official Sites)', nameEn: 'Government Portals', icon: Globe2 },
          { id: 'guide', nameNe: 'नागरिक सेवा मार्गनिर्देशिका (Citizen Guide)', nameEn: 'Citizen Help Guide', icon: Info },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-red-700 text-white shadow-xs ring-1 ring-red-800'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
              <span>{lang === 'ne' ? tab.nameNe : tab.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 0: Interactive Services Map */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <GovernmentMapView lang={lang} />
        </div>
      )}

      {/* Tab 1: Emergency Hotlines */}
      {activeTab === 'emergency' && (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-4 sm:p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <div className="text-xs text-red-950">
              <span className="font-bold block mb-0.5">
                {lang === 'ne' ? 'महत्वपूर्ण सूचना (Emergency Notice):' : 'Emergency Assistance Notice:'}
              </span>
              <p>
                {lang === 'ne'
                  ? 'कुनै पनि आकस्मिक संकट, अपराध, आगलागी वा स्वास्थ्य समस्या परेमा तलका नम्बरहरूमा निःशुल्क (Toll-Free) कल गर्न सक्नुहुन्छ।'
                  : 'All primary national emergency numbers (100, 101, 102, 103, 1111) are toll-free and accessible from any mobile or landline across Nepal.'}
              </p>
            </div>
          </div>

          {/* Hotline Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EMERGENCY_HOTLINES.map((hotline) => (
              <div
                key={hotline.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="p-2.5 bg-stone-50 rounded-2xl border border-stone-200">
                      {getHotlineIcon(hotline.iconType)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {hotline.tollFree && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {lang === 'ne' ? 'निःशुल्क' : 'Toll Free'}
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-stone-400">
                        {hotline.availableHours}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1">
                    {lang === 'ne' ? hotline.nameNe : hotline.nameEn}
                  </h3>
                  <p className="text-xs text-stone-500 mb-4 leading-relaxed line-clamp-2">
                    {lang === 'ne' ? hotline.descriptionNe : hotline.descriptionEn}
                  </p>
                </div>

                {/* Dial / Copy Action Row */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${hotline.number}`}
                    className="flex-1 py-2.5 px-3 sm:px-4 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer truncate"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="truncate">{lang === 'ne' ? `कल: ${toNepaliDigits(hotline.number)}` : `Call ${hotline.number}`}</span>
                  </a>

                  <button
                    onClick={() => copyNumber(hotline.number)}
                    className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer shrink-0"
                    title={lang === 'ne' ? 'नम्बर कपी गर्नुहोस्' : 'Copy phone number'}
                  >
                    {copiedNumber === hotline.number ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Important Government Portals */}
      {activeTab === 'portals' && (
        <div className="space-y-6">
          {/* Search & Categories */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'ne' ? 'सरकारी सेवा वा पोर्टल खोज्नुहोस्...' : 'Search portals or services...'}
                value={portalSearch}
                onChange={(e) => setPortalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
              {[
                { id: 'all', nameNe: 'सबै पोर्टलहरू', nameEn: 'All Portals' },
                { id: 'identity', nameNe: 'परिचयपत्र र राहदानी', nameEn: 'Passport & ID' },
                { id: 'transport', nameNe: 'यातायात र लाइसेन्स', nameEn: 'Transport' },
                { id: 'jobs', nameNe: 'लोक सेवा र रोजगारी', nameEn: 'Jobs & Labor' },
                { id: 'finance', nameNe: 'कर (PAN) र वित्त', nameEn: 'Tax & Finance' },
                { id: 'utility', nameNe: 'भूमि तथा मालपोत', nameEn: 'Land & Records' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setPortalCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    portalCategory === c.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {lang === 'ne' ? c.nameNe : c.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* Portals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPortals.map((portal) => (
              <div
                key={portal.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group min-w-0"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100 truncate">
                      {lang === 'ne' ? portal.ministryNe : portal.ministryEn}
                    </span>
                    {portal.isPopular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 shrink-0">
                        ⭐ {lang === 'ne' ? 'लोकप्रिय' : 'Popular'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1 group-hover:text-red-700 transition-colors">
                    {lang === 'ne' ? portal.nameNe : portal.nameEn}
                  </h3>
                  <p className="text-xs text-stone-600 mb-4 leading-relaxed line-clamp-3">
                    {lang === 'ne' ? portal.descriptionNe : portal.descriptionEn}
                  </p>

                  {/* Services tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {portal.services.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Link */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  {portal.helplinePhone ? (
                    <span className="text-[11px] text-stone-500 font-mono truncate">
                      📞 {portal.helplinePhone}
                    </span>
                  ) : <div />}
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-stone-900 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all ml-auto cursor-pointer shrink-0"
                  >
                    <span>{lang === 'ne' ? 'खोल्नुहोस्' : 'Visit Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Citizen Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Guide 1: e-Passport */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold text-base">
                <Shield className="w-5 h-5 shrink-0" />
                <h4>{lang === 'ne' ? 'विद्युतीय राहदानी (e-Passport) प्रक्रिया' : 'e-Passport Application Steps'}</h4>
              </div>
              <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>पहिला राष्ट्रिय परिचयपत्र (NID) नम्बर अनिवार्य चाहिन्छ।</li>
                <li>राहदानी विभागको अनलाइन प्रणालीमा गएर फाराम भरी मिति (Appointment) बुकिङ गर्नुहोस्।</li>
                <li>तोकिएको मितिमा नागरिकताको सक्कल, NID कार्ड र बैंक भौचर लिएर जिल्ला प्रशासन वा विभागमा उपस्थित हुनुहोस्।</li>
              </ul>
            </div>

            {/* Guide 2: Nagarik App */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold text-base">
                <Globe2 className="w-5 h-5 shrink-0" />
                <h4>{lang === 'ne' ? 'नागरिक एप (Nagarik App) दर्ता' : 'Nagarik App Registration'}</h4>
              </div>
              <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>सिम कार्ड आफ्नै नागरिकताको नाममा दर्ता भएको हुनुपर्छ।</li>
                <li>एप डाउनलोड गरी मोबाइल नम्बर र नागरिकता विवरण प्रविष्ट गर्नुहोस्।</li>
                <li>प्रमाणीकरणपछि लाइसेन्स, प्यान, नागरिकता र स्वास्थ्य बिमा स्वतः लिंक हुन्छ।</li>
              </ul>
            </div>

            {/* Guide 3: Public Grievance (Hello Sarkar) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold text-base">
                <PhoneCall className="w-5 h-5 shrink-0" />
                <h4>{lang === 'ne' ? 'हेलो सरकार (११११) मा उजुरी दर्ता' : 'Hello Sarkar Grievance Redressal'}</h4>
              </div>
              <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>कुनै सरकारी कार्यालयले ढिलासुस्ती गरेमा ११११ मा निःशुल्क फोन गर्नुहोस्।</li>
                <li>उजुरी नम्बर सुरक्षित राख्नुहोस्, जसबाट प्रगतिको जानकारी लिन सकिन्छ।</li>
                <li>उजुरी सम्बन्धित मन्त्रालयमा २४ घण्टाभित्र पठाइन्छ।</li>
              </ul>
            </div>

            {/* Guide 4: Disaster Safety */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold text-base">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h4>{lang === 'ne' ? 'विपद् र आपतकालीन सुरक्षा' : 'Disaster Management & Safety'}</h4>
              </div>
              <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>बाढी/पहिरो पूर्वसूचनाको लागि ११५५ मा २४ घण्टा जानकारी लिन सकिन्छ।</li>
                <li>दुर्घटना वा खोजतलासको लागि नेपाल प्रहरी १०० र दमकल १०१ मा तत्काल खबर गर्नुहोस्।</li>
                <li>आपतकालीन प्राथमिक उपचारको लागि NAS एम्बुलेन्स १०२ मा सम्पर्क गर्नुहोस्।</li>
              </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
