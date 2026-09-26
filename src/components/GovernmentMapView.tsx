import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Search, 
  Navigation as NavIcon, 
  ExternalLink, 
  Clock, 
  Shield, 
  Activity, 
  Flame, 
  HeartHandshake, 
  Compass, 
  Users, 
  Car, 
  Check, 
  Copy, 
  Filter, 
  AlertTriangle, 
  X,
  ChevronRight,
  LocateFixed,
  Globe,
  Share2
} from 'lucide-react';
import { Language } from '../types';
import { 
  GovernmentHelpCenter, 
  GOVERNMENT_HELP_CENTERS, 
  SERVICE_CATEGORIES, 
  PROVINCES, 
  ServiceCategory, 
  ProvinceName 
} from '../data/governmentLocations';
import { toNepaliDigits } from '../utils/nepaliCalendar';

interface GovernmentMapViewProps {
  lang: Language;
}

// Calculate distance in kilometers between two coordinates
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const GovernmentMapView: React.FC<GovernmentMapViewProps> = ({ lang }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [selectedProvince, setSelectedProvince] = useState<ProvinceName | 'all'>('all');
  const [selectedCenter, setSelectedCenter] = useState<GovernmentHelpCenter>(GOVERNMENT_HELP_CENTERS[0]);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // User Geolocation state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Copy phone handler
  const copyPhone = (phoneNum: string) => {
    navigator.clipboard.writeText(phoneNum);
    setCopiedPhone(phoneNum);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // Locate user GPS
  const handleLocateUser = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!('geolocation' in navigator)) {
      setLocationError(
        lang === 'ne'
          ? 'तपाईँको ब्राउजरमा GPS / लोकेसन सुविधा उपलब्ध छैन।'
          : 'Geolocation is not supported by your browser.'
      );
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setLocationError(
          lang === 'ne'
            ? 'तपाईँको स्थान पत्ता लगाउन सकिएन। कृपया लोकेसन अनुमति दिनुहोस्।'
            : 'Unable to retrieve location. Please grant location permission.'
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Filtered centers
  const filteredCenters = useMemo(() => {
    return GOVERNMENT_HELP_CENTERS.filter((center) => {
      // Category filter
      if (selectedCategory !== 'all' && center.category !== selectedCategory) {
        return false;
      }
      // Province filter
      if (selectedProvince !== 'all' && center.province !== selectedProvince) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchNameNe = center.nameNe.toLowerCase().includes(query);
        const matchNameEn = center.nameEn.toLowerCase().includes(query);
        const matchDistrict = center.district.toLowerCase().includes(query);
        const matchAddressNe = center.addressNe.toLowerCase().includes(query);
        const matchAddressEn = center.addressEn.toLowerCase().includes(query);
        const matchHotline = center.hotline ? center.hotline.includes(query) : false;
        const matchServices = center.servicesNe.some((s) => s.toLowerCase().includes(query)) ||
          center.servicesEn.some((s) => s.toLowerCase().includes(query));

        return (
          matchNameNe ||
          matchNameEn ||
          matchDistrict ||
          matchAddressNe ||
          matchAddressEn ||
          matchHotline ||
          matchServices
        );
      }
      return true;
    }).map((c) => {
      if (userLocation) {
        const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, c.lat, c.lng);
        return { ...c, distanceKm: dist };
      }
      return c;
    }).sort((a: any, b: any) => {
      if (userLocation && a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedProvince, userLocation]);

  // Nearest centers when GPS is active
  const nearestCenters = useMemo(() => {
    if (!userLocation) return [];
    return [...filteredCenters]
      .filter((c: any) => c.distanceKm !== undefined)
      .slice(0, 4);
  }, [userLocation, filteredCenters]);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      
      {/* Top Search & Filter Control Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 space-y-4 transition-colors">
        
        {/* Row 1: Search Input + Locate Me Button + Province Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                lang === 'ne'
                  ? 'कार्यालय, जिल्ला वा सेवा खोज्नुहोस् (उदा: राहदानी, अस्पताल, प्रहरी, सिंहदरबार)...'
                  : 'Search office, district or service (e.g. Passport, Hospital, Police, NID)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Province Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer"
            >
              <option value="all">{lang === 'ne' ? 'सबै प्रदेश (All Nepal)' : 'All Provinces'}</option>
              {PROVINCES.map((p) => (
                <option key={p.id} value={p.id}>
                  {lang === 'ne' ? p.nameNe : p.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Locate Me Button */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              onClick={handleLocateUser}
              disabled={isLocating}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>
                {isLocating
                  ? (lang === 'ne' ? 'स्थान खोज्दै...' : 'Locating...')
                  : (lang === 'ne' ? 'मेरो नजिक (Locate Me)' : 'Find Near Me')}
              </span>
            </button>
          </div>
        </div>

        {/* Row 2: Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SERVICE_CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isCatActive
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: isCatActive ? '#ffffff' : cat.color }}
                />
                <span>{lang === 'ne' ? cat.nameNe : cat.nameEn}</span>
              </button>
            );
          })}
        </div>

        {locationError && (
          <div className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>{locationError}</span>
          </div>
        )}
      </div>

      {/* Google Maps Directions Guidance Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 dark:from-stone-900 dark:via-blue-950/30 dark:to-stone-900 p-4 rounded-3xl border border-blue-200 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <NavIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-stone-900 dark:text-white text-xs sm:text-sm">
              {lang === 'ne' ? 'गुगल म्याप्स नेभिगेसन तथा दिशानिर्देश (Google Maps Directions)' : 'Google Maps Live Navigation & Directions'}
            </h4>
            <p className="text-stone-600 dark:text-stone-300 text-[11px] sm:text-xs">
              {lang === 'ne'
                ? 'कुनै पनि सेवा केन्द्रको "गुगल म्याप्समा दिशानिर्देश" मा क्लिक गर्दा तपाईंको मोबाइल वा कम्प्युटरको गुगल म्याप्स सिधै खुल्नेछ र बाटो देखाउनेछ।'
                : 'Clicking "Directions in Google Maps" on any service card opens live GPS turn-by-turn navigation directly in Google Maps.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 font-semibold text-[11px]">
          <span>{lang === 'ne' ? `${toNepaliDigits(filteredCenters.length)} वटा सेवा केन्द्रहरू उपलब्ध` : `${filteredCenters.length} Centers Available`}</span>
        </div>
      </div>

      {/* Proximity Nearest Centers Horizontal Strip (When GPS active) */}
      {userLocation && nearestCenters.length > 0 && (
        <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-3xl border border-blue-200 dark:border-blue-900/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h4 className="text-xs sm:text-sm font-extrabold text-blue-950 dark:text-blue-200">
                {lang === 'ne' ? 'तपाईँको स्थानबाट सबैभन्दा नजिकका सेवा केन्द्रहरू' : 'Public Services Nearest to Your Location'}
              </h4>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              {lang === 'ne' ? 'नजिकको दूरी' : 'Nearest First'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {nearestCenters.map((center, idx) => {
              const dist = (center as any).distanceKm;
              const isSelected = selectedCenter.id === center.id;

              return (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-sm'
                      : 'bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        #{idx + 1} {lang === 'ne' ? 'नजिक' : 'Near'}
                      </span>
                      {dist !== undefined && (
                        <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                          {toNepaliDigits(dist)} km
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">
                      {lang === 'ne' ? center.nameNe : center.nameEn}
                    </h5>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                      {center.district} • {lang === 'ne' ? center.addressNe : center.addressEn}
                    </p>
                  </div>

                  {/* Actions: Hotline & Google Maps Directions */}
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between gap-1.5">
                    <a
                      href={`tel:${center.hotline || center.directPhone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="py-1 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 font-extrabold text-[10px] flex items-center gap-1"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      <span>{center.hotline || center.directPhone}</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="py-1 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs"
                      title={lang === 'ne' ? 'गुगल म्याप्समा दिशानिर्देश खोल्नुहोस्' : 'Get Directions in Google Maps'}
                    >
                      <NavIcon className="w-2.5 h-2.5 text-blue-100" />
                      <span>{lang === 'ne' ? 'दिशा' : 'Directions'}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Selected Center Full Detail Panel (5 cols) & Directory Grid (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Selected Center Details & Directions Hub (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-sm border-2 border-red-600/30 dark:border-stone-800 space-y-5 transition-colors">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                  {selectedCenter.district}
                </span>

                {selectedCenter.is24x7 ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>२४/७ सेवा (24/7 Service)</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                    {lang === 'ne' ? selectedCenter.operatingHoursNe : selectedCenter.operatingHoursEn}
                  </span>
                )}

                {(selectedCenter as any).distanceKm !== undefined && (
                  <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900 ml-auto">
                    📍 {toNepaliDigits((selectedCenter as any).distanceKm)} km
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white leading-snug">
                {lang === 'ne' ? selectedCenter.nameNe : selectedCenter.nameEn}
              </h3>

              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{lang === 'ne' ? selectedCenter.addressNe : selectedCenter.addressEn}</span>
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800">
              {lang === 'ne' ? selectedCenter.descriptionNe : selectedCenter.descriptionEn}
            </p>

            {/* Services Offered List */}
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                {lang === 'ne' ? 'उपलब्ध प्रमुख नागरिक सेवाहरू:' : 'Key Citizen Services Provided:'}
              </span>
              <ul className="space-y-1.5">
                {(lang === 'ne' ? selectedCenter.servicesNe : selectedCenter.servicesEn).map((svc, i) => (
                  <li key={i} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1.5" />
                    <span>{svc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DIRECTIONS SECTION TO GOOGLE MAPS */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-stone-800 dark:to-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 block">
                🗺️ {lang === 'ne' ? 'गुगल म्याप्स नेभिगेसन तथा बाटो' : 'GOOGLE MAPS NAVIGATION & DIRECTIONS'}
              </span>

              {/* Primary Direction Link */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.lat},${selectedCenter.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                title={lang === 'ne' ? 'गुगल म्याप्समा दिशानिर्देश खोल्नुहोस्' : 'Get Live Turn-by-Turn Directions in Google Maps'}
              >
                <NavIcon className="w-4 h-4 text-blue-100 shrink-0" />
                <span>{lang === 'ne' ? 'गुगल म्याप्समा दिशानिर्देश (Get Directions)' : 'Get Directions in Google Maps'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              {/* Secondary View on Map Link */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedCenter.lat},${selectedCenter.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-white dark:bg-stone-700 hover:bg-stone-100 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-stone-200 dark:border-stone-600 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>{lang === 'ne' ? 'गुगल म्याप्समा पिन हेर्नुहोस् (View on Google Maps)' : 'View Location Pin on Google Maps'}</span>
              </a>
            </div>

            {/* Direct Phone & Website Actions */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
              <a
                href={`tel:${selectedCenter.hotline || selectedCenter.directPhone}`}
                className="flex-1 py-2.5 px-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer truncate"
              >
                <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">
                  {selectedCenter.hotline
                    ? lang === 'ne' ? `हटलाइन: ${toNepaliDigits(selectedCenter.hotline)}` : `Hotline ${selectedCenter.hotline}`
                    : lang === 'ne' ? `फोन: ${toNepaliDigits(selectedCenter.directPhone)}` : `Call ${selectedCenter.directPhone}`}
                </span>
              </a>

              <button
                type="button"
                onClick={() => copyPhone(selectedCenter.hotline || selectedCenter.directPhone)}
                className="p-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition-colors cursor-pointer shrink-0"
                title={lang === 'ne' ? 'नम्बर कपी गर्नुहोस्' : 'Copy phone number'}
              >
                {copiedPhone === (selectedCenter.hotline || selectedCenter.directPhone) ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {selectedCenter.website && (
                <a
                  href={selectedCenter.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition-colors cursor-pointer shrink-0"
                  title={lang === 'ne' ? 'आधिकारिक वेबसाइट खोल्नुहोस्' : 'Visit Official Portal'}
                >
                  <Globe className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                </a>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Centers Directory Cards List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
            <span>
              {lang === 'ne'
                ? `कुल ${toNepaliDigits(filteredCenters.length)} वटा सेवा केन्द्रहरू`
                : `Showing ${filteredCenters.length} government centers`}
            </span>
            <span className="text-[11px]">
              {lang === 'ne' ? 'विस्तृत हेर्न केन्द्र छान्नुहोस्' : 'Click to inspect office'}
            </span>
          </div>

          {filteredCenters.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 text-center border border-stone-200 dark:border-stone-800 space-y-2">
              <Building2 className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
              <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                {lang === 'ne' ? 'खोजिए अनुसार कुनै सेवा केन्द्र फेला परेन।' : 'No centers found matching filters.'}
              </p>
              <p className="text-xs text-stone-400">
                {lang === 'ne' ? 'कृपया खोज शब्द वा प्रदेश परिवर्तन गर्नुहोस्।' : 'Try adjusting your search query or province filter.'}
              </p>
            </div>
          ) : (
            filteredCenters.map((center) => {
              const isSelected = selectedCenter.id === center.id;
              const dist = (center as any).distanceKm;

              return (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-red-50/90 dark:bg-red-950/40 border-red-500 dark:border-red-600 ring-2 ring-red-400/30 shadow-sm'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-red-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {center.district}
                        </span>

                        {center.is24x7 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            २४/७
                          </span>
                        )}

                        {dist !== undefined && (
                          <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-300 flex items-center gap-0.5 ml-auto">
                            <MapPin className="w-3 h-3 text-blue-600" />
                            {toNepaliDigits(dist)} km
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-stone-900 dark:text-white text-sm sm:text-base leading-snug">
                        {lang === 'ne' ? center.nameNe : center.nameEn}
                      </h4>

                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                        {lang === 'ne' ? center.addressNe : center.addressEn}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mt-2 transition-transform ${
                        isSelected ? 'text-red-600 translate-x-1' : 'text-stone-400'
                      }`}
                    />
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {lang === 'ne' ? center.descriptionNe : center.descriptionEn}
                  </p>

                  {/* Actions Bar on each card */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 flex-wrap text-xs">
                    
                    {/* Hotline / Direct Call */}
                    <a
                      href={`tel:${center.hotline || center.directPhone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="py-1.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 shadow-2xs"
                      title={lang === 'ne' ? 'फोन कल गर्नुहोस्' : 'Direct Call'}
                    >
                      <Phone className="w-3 h-3" />
                      <span>{center.hotline || center.directPhone}</span>
                    </a>

                    {/* Prominent Google Maps Directions Link */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="py-1.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                      title={lang === 'ne' ? 'गुगल म्याप्समा बाटो र दिशानिर्देश खोल्नुहोस्' : 'Get Directions in Google Maps'}
                    >
                      <NavIcon className="w-3 h-3 text-blue-100" />
                      <span>{lang === 'ne' ? 'गुगल दिशा (Directions)' : 'Directions'}</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
