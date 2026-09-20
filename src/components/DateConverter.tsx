import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Calendar, 
  Clock, 
  MapPin, 
  Check, 
  Copy, 
  Compass, 
  Calculator,
  Scale,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';
import { 
  BS_MONTH_NAMES_NE, 
  BS_MONTH_NAMES_EN, 
  bsToAd, 
  adToBs, 
  toNepaliDigits,
  getPanchangaForDate,
  NEPALI_DAYS_NE,
  NEPALI_DAYS_EN
} from '../utils/nepaliCalendar';
import { MeasurementConverterView } from './MeasurementConverterView';
import { NepaliLandVisualizer } from './NepaliLandVisualizer';
import { triggerDateConvertConfetti, triggerCalculationConfetti } from '../utils/confetti';

interface DateConverterProps {
  lang: Language;
}

export const DateConverter: React.FC<DateConverterProps> = ({ lang }) => {
  const [conversionType, setConversionType] = useState<'units' | 'bsToAd' | 'adToBs' | 'ageCalc' | 'landConverter'>('units');

  // BS to AD state
  const [bsYear, setBsYear] = useState<number>(2081);
  const [bsMonth, setBsMonth] = useState<number>(1);
  const [bsDay, setBsDay] = useState<number>(15);

  // AD to BS state
  const [adDateInput, setAdDateInput] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Age calc state
  const [birthBsYear, setBirthBsYear] = useState<number>(2055);
  const [birthBsMonth, setBirthBsMonth] = useState<number>(6);
  const [birthBsDay, setBirthBsDay] = useState<number>(10);

  // Land converter state
  const [ropani, setRopani] = useState<number>(1);
  const [aana, setAana] = useState<number>(0);
  const [paisa, setPaisa] = useState<number>(0);
  const [daam, setDaam] = useState<number>(0);

  const [copied, setCopied] = useState<boolean>(false);

  // BS to AD result
  const calculatedAd = bsToAd(bsYear, bsMonth, bsDay);
  const bsPanchanga = getPanchangaForDate(bsYear, bsMonth, bsDay);

  // AD to BS result
  const parsedAd = new Date(adDateInput + 'T12:00:00Z');
  const calculatedBs = adToBs(parsedAd);

  // Age calculation
  const calculateAge = () => {
    const birthAd = bsToAd(birthBsYear, birthBsMonth, birthBsDay);
    const today = new Date();

    let ageYears = today.getFullYear() - birthAd.getFullYear();
    let ageMonths = today.getMonth() - birthAd.getMonth();
    let ageDays = today.getDate() - birthAd.getDate();

    if (ageDays < 0) {
      ageMonths -= 1;
      ageDays += 30;
    }
    if (ageMonths < 0) {
      ageYears -= 1;
      ageMonths += 12;
    }

    const diffTime = Math.abs(today.getTime() - birthAd.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { ageYears, ageMonths, ageDays, totalDays };
  };

  // Land conversion (Ropani system: 1 Ropani = 16 Aana = 64 Paisa = 256 Daam = 5476 sq ft)
  const calculateLandUnits = () => {
    const totalAana = (ropani * 16) + aana + (paisa / 4) + (daam / 16);
    const totalSqFt = totalAana * 342.25;
    const totalSqMtr = totalSqFt * 0.092903;
    const bighaEquiv = totalSqFt / 72900;

    return {
      totalSqFt: Math.round(totalSqFt * 100) / 100,
      totalSqMtr: Math.round(totalSqMtr * 100) / 100,
      bigha: bighaEquiv.toFixed(3),
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-700/60 rounded-full border border-red-500/40 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          {lang === 'ne' ? 'नेपाली डिजिटल रूपान्तरण उपकरणहरू' : 'Nepali Measurement & Conversion Hub'}
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          {lang === 'ne' ? 'नाप, मिति तथा एकाइ रूपान्तरण' : 'Measurement & Date Conversion Suite'}
        </h2>
        <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-2xl">
          {lang === 'ne'
            ? 'नेपाली जग्गा नाप (रोपनी/बिघा), परम्परागत धार्नी/पाउ/तोला, लम्बाइ, क्षेत्रफल, बिक्रम संवत् (BS <-> AD) मिति र उमेर क्याल्कुलेटर।'
            : 'Convert Nepali land units, traditional mass/volume, scientific measurements, Bikram Sambat dates, and age instantly.'}
        </p>
      </div>

      {/* Tool Navigation Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
        {[
          { id: 'units', nameNe: 'समग्र नाप तथा एकाइ (All Units)', nameEn: 'All Unit Converter', icon: Scale },
          { id: 'bsToAd', nameNe: 'BS बाट AD मिति रूपान्तरण', nameEn: 'BS to AD Converter', icon: Calendar },
          { id: 'adToBs', nameNe: 'AD बाट BS मिति रूपान्तरण', nameEn: 'AD to BS Converter', icon: Calendar },
          { id: 'ageCalc', nameNe: 'नेपाली उमेर क्याल्कुलेटर', nameEn: 'Age Calculator', icon: Clock },
          { id: 'landConverter', nameNe: 'जग्गा नाप (रोपनी-आना)', nameEn: 'Land Unit Converter', icon: MapPin },
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setConversionType(tool.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                conversionType === tool.id
                  ? 'bg-red-700 text-white shadow-xs ring-1 ring-red-800'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? tool.nameNe : tool.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Full Measurement Converter Component */}
      {conversionType === 'units' && (
        <MeasurementConverterView lang={lang} />
      )}

      {/* Converter Modules Container for other subtools */}
      {conversionType !== 'units' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto">
        
        {/* Module 1: BS to AD */}
        {conversionType === 'bsToAd' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-700" />
              <span>{lang === 'ne' ? 'बिक्रम संवत् (BS) बाट इस्वी संवत् (AD) मा रूपान्तरण' : 'Convert Bikram Sambat (BS) to Gregorian (AD)'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  {lang === 'ne' ? 'वर्ष (BS Year)' : 'BS Year'}
                </label>
                <select
                  value={bsYear}
                  onChange={(e) => {
                    setBsYear(Number(e.target.value));
                    triggerDateConvertConfetti();
                  }}
                  className="w-full text-sm font-bold px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  {[2080, 2081, 2082, 2083, 2084].map((y) => (
                    <option key={y} value={y}>
                      {y} BS ({toNepaliDigits(y)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  {lang === 'ne' ? 'महिना (Month)' : 'BS Month'}
                </label>
                <select
                  value={bsMonth}
                  onChange={(e) => {
                    setBsMonth(Number(e.target.value));
                    triggerDateConvertConfetti();
                  }}
                  className="w-full text-sm font-bold px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  {BS_MONTH_NAMES_NE.map((m, idx) => (
                    <option key={idx} value={idx + 1}>
                      {m} ({BS_MONTH_NAMES_EN[idx]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  {lang === 'ne' ? 'गते (Day)' : 'BS Day'}
                </label>
                <select
                  value={bsDay}
                  onChange={(e) => {
                    setBsDay(Number(e.target.value));
                    triggerDateConvertConfetti();
                  }}
                  className="w-full text-sm font-bold px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  {[...Array(32)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {toNepaliDigits(i + 1)} ({i + 1})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => triggerDateConvertConfetti()}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{lang === 'ne' ? 'मिति रूपान्तरण गर्नुहोस्' : 'Convert Date'}</span>
              </button>
            </div>

            {/* Result Box */}
            <div className="p-6 bg-gradient-to-br from-red-50 to-amber-50 border border-red-200 rounded-3xl text-center space-y-2">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider block">
                {lang === 'ne' ? 'इस्वी संवत् (AD Date) परिणाम:' : 'Converted Gregorian (AD) Date:'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 block">
                {calculatedAd.toDateString()}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-stone-600 pt-2">
                <span>{lang === 'ne' ? 'बार:' : 'Day:'} <strong>{NEPALI_DAYS_NE[calculatedAd.getDay()]} ({NEPALI_DAYS_EN[calculatedAd.getDay()]})</strong></span>
                <span>•</span>
                <span>{lang === 'ne' ? 'तिथी:' : 'Tithi:'} <strong>{bsPanchanga.tithi}</strong></span>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => copyToClipboard(calculatedAd.toDateString())}
                  className="px-4 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (lang === 'ne' ? 'कपी गरियो' : 'Copied') : (lang === 'ne' ? 'मिति कपी गर्नुहोस्' : 'Copy Date')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Module 2: AD to BS */}
        {conversionType === 'adToBs' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-700" />
              <span>{lang === 'ne' ? 'इस्वी संवत् (AD) बाट बिक्रम संवत् (BS) मा रूपान्तरण' : 'Convert Gregorian (AD) to Bikram Sambat (BS)'}</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-stone-600 block mb-1">
                {lang === 'ne' ? 'इस्वी संवत् मिति चयन गर्नुहोस् (Select AD Date):' : 'Select AD Date:'}
              </label>
              <input
                type="date"
                value={adDateInput}
                onChange={(e) => {
                  setAdDateInput(e.target.value);
                  if (e.target.value) triggerDateConvertConfetti();
                }}
                className="w-full text-sm font-bold px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => triggerDateConvertConfetti()}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{lang === 'ne' ? 'बिक्रम संवत्मा रूपान्तरण गर्नुहोस्' : 'Convert to BS Date'}</span>
              </button>
            </div>

            {/* Result Box */}
            <div className="p-6 bg-gradient-to-br from-red-50 to-amber-50 border border-red-200 rounded-3xl text-center space-y-2">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider block">
                {lang === 'ne' ? 'बिक्रम संवत् (BS Date) परिणाम:' : 'Converted Bikram Sambat (BS) Date:'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-red-900 block">
                {calculatedBs.formattedNe}
              </span>
              <span className="text-xs text-stone-600 block font-medium">
                {calculatedBs.formattedEn}
              </span>

              <div className="pt-3">
                <button
                  onClick={() => copyToClipboard(calculatedBs.formattedNe)}
                  className="px-4 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (lang === 'ne' ? 'कपी गरियो' : 'Copied') : (lang === 'ne' ? 'कपी गर्नुहोस्' : 'Copy BS Date')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Module 3: Age Calculator */}
        {conversionType === 'ageCalc' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-700" />
              <span>{lang === 'ne' ? 'नेपाली उमेर क्याल्कुलेटर (Age Calculator)' : 'Nepali Age Calculator in BS'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  {lang === 'ne' ? 'जन्म वर्ष (BS Year)' : 'Birth BS Year'}
                </label>
                <input
                  type="number"
                  value={birthBsYear}
                  onChange={(e) => {
                    setBirthBsYear(Number(e.target.value));
                    triggerDateConvertConfetti();
                  }}
                  className="w-full text-sm font-bold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  {lang === 'ne' ? 'जन्म महिना (BS Month)' : 'Birth BS Month'}
                </label>
                <select
                  value={birthBsMonth}
                  onChange={(e) => {
                    setBirthBsMonth(Number(e.target.value));
                    triggerDateConvertConfetti();
                  }}
                  className="w-full text-sm font-bold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  {BS_MONTH_NAMES_NE.map((m, idx) => (
                    <option key={idx} value={idx + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  {lang === 'ne' ? 'जन्म गते (BS Day)' : 'Birth BS Day'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="32"
                  value={birthBsDay}
                  onChange={(e) => {
                    setBirthBsDay(Number(e.target.value));
                    triggerDateConvertConfetti();
                  }}
                  className="w-full text-sm font-bold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => triggerDateConvertConfetti()}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{lang === 'ne' ? 'उमेर हिसाब गर्नुहोस्' : 'Calculate Age'}</span>
              </button>
            </div>

            {/* Age Results */}
            {(() => {
              const { ageYears, ageMonths, ageDays, totalDays } = calculateAge();
              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
                    <span className="text-xs text-red-700 font-bold block mb-1">
                      {lang === 'ne' ? 'कुल वर्ष' : 'Age in Years'}
                    </span>
                    <span className="text-3xl font-extrabold text-red-900 block">
                      {toNepaliDigits(ageYears)}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {ageYears} {lang === 'ne' ? 'वर्ष' : 'Years'}
                    </span>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                    <span className="text-xs text-amber-800 font-bold block mb-1">
                      {lang === 'ne' ? 'महिना र दिन' : 'Months & Days'}
                    </span>
                    <span className="text-xl font-extrabold text-amber-950 block mt-1">
                      {toNepaliDigits(ageMonths)} महिना {toNepaliDigits(ageDays)} दिन
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {ageMonths} mos, {ageDays} days
                    </span>
                  </div>

                  <div className="p-4 bg-stone-100 border border-stone-200 rounded-2xl text-center">
                    <span className="text-xs text-stone-700 font-bold block mb-1">
                      {lang === 'ne' ? 'कुल बाँचेका दिन' : 'Total Days Lived'}
                    </span>
                    <span className="text-2xl font-extrabold text-stone-900 block">
                      {toNepaliDigits(totalDays.toLocaleString())}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {totalDays.toLocaleString()} days
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Module 4: Land Converter */}
        {conversionType === 'landConverter' && (
          <div className="space-y-6">
            <NepaliLandVisualizer
              lang={lang}
              calculatorElementId="land-calculator"
              onSelectHillUnits={(r, a, p, d) => {
                setRopani(r);
                setAana(a);
                setPaisa(p);
                setDaam(d);
              }}
            />

            <div 
              id="land-calculator" 
              className="p-6 bg-stone-50 border border-stone-200 rounded-3xl space-y-4 transition-all duration-500 scroll-mt-24"
            >
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-700" />
                <span>{lang === 'ne' ? 'नेपाली जग्गा नाप क्याल्कुलेटर (Ropani - Aana Calculator)' : 'Nepali Land Unit Calculator'}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  {lang === 'ne' ? 'रोपनी (Ropani)' : 'Ropani'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={ropani}
                  onChange={(e) => {
                    setRopani(Number(e.target.value));
                    triggerCalculationConfetti();
                  }}
                  className="w-full text-sm font-bold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  {lang === 'ne' ? 'आना (Aana)' : 'Aana (0-15)'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={aana}
                  onChange={(e) => {
                    setAana(Number(e.target.value));
                    triggerCalculationConfetti();
                  }}
                  className="w-full text-sm font-bold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  {lang === 'ne' ? 'पैसा (Paisa)' : 'Paisa (0-3)'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={paisa}
                  onChange={(e) => {
                    setPaisa(Number(e.target.value));
                    triggerCalculationConfetti();
                  }}
                  className="w-full text-sm font-bold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  {lang === 'ne' ? 'दाम (Daam)' : 'Daam (0-3)'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={daam}
                  onChange={(e) => {
                    setDaam(Number(e.target.value));
                    triggerCalculationConfetti();
                  }}
                  className="w-full text-sm font-bold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => triggerCalculationConfetti()}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{lang === 'ne' ? 'जग्गा नाप हिसाब गर्नुहोस्' : 'Calculate Land Units'}</span>
              </button>
            </div>

            {/* Land Calculation Results */}
            {(() => {
              const { totalSqFt, totalSqMtr, bigha } = calculateLandUnits();
              return (
                <div className="p-6 bg-stone-50 border border-stone-200 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-xs text-stone-500 font-bold block mb-1">
                      {lang === 'ne' ? 'वर्ग फिट (Square Feet)' : 'Square Feet'}
                    </span>
                    <span className="text-2xl font-extrabold text-stone-900 block">
                      {toNepaliDigits(totalSqFt.toLocaleString())} sq.ft
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-stone-500 font-bold block mb-1">
                      {lang === 'ne' ? 'वर्ग मिटर (Square Meters)' : 'Square Meters'}
                    </span>
                    <span className="text-2xl font-extrabold text-stone-900 block">
                      {toNepaliDigits(totalSqMtr.toLocaleString())} sq.m
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-stone-500 font-bold block mb-1">
                      {lang === 'ne' ? 'तराई बिघा रूपान्तरण' : 'Terai Bigha Equivalent'}
                    </span>
                    <span className="text-2xl font-extrabold text-red-700 block">
                      {toNepaliDigits(bigha)} बिघा
                    </span>
                  </div>
                </div>
              );
            })()}
            </div>
          </div>
        )}

        </div>
      )}
    </div>
  );
};
