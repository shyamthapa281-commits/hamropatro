import React, { useState } from 'react';
import { 
  Scale, 
  MapPin, 
  Ruler, 
  Thermometer, 
  Gauge, 
  HardDrive, 
  Droplet, 
  Layers, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Info,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Language } from '../types';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import { NepaliLandVisualizer } from './NepaliLandVisualizer';
import { triggerCalculationConfetti } from '../utils/confetti';

interface MeasurementConverterProps {
  lang: Language;
}

export const MeasurementConverterView: React.FC<MeasurementConverterProps> = ({ lang }) => {
  const [activeCategory, setActiveCategory] = useState<
    'land' | 'length' | 'weight' | 'volume' | 'area' | 'temperature' | 'speed' | 'data'
  >('land');

  // Copied state
  const [copied, setCopied] = useState<boolean>(false);

  // 1. Traditional Land State
  const [landSystem, setLandSystem] = useState<'pahad' | 'terai'>('pahad');
  // Pahad (Ropani-Aana-Paisa-Daam)
  const [ropani, setRopani] = useState<number>(1);
  const [aana, setAana] = useState<number>(0);
  const [paisa, setPaisa] = useState<number>(0);
  const [daam, setDaam] = useState<number>(0);
  // Terai (Bigha-Kattha-Dhur-Kanwa)
  const [bigha, setBigha] = useState<number>(1);
  const [kattha, setKattha] = useState<number>(0);
  const [dhur, setDhur] = useState<number>(0);
  const [kanwa, setKanwa] = useState<number>(0);

  // Generic Converter States
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');

  // Copy helper
  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Land calculations
  // 1 Ropani = 16 Aana = 64 Paisa = 256 Daam = 5476 Sq. Ft = 508.72 Sq. M
  // 1 Bigha = 20 Kattha = 400 Dhur = 72900 Sq. Ft = 6772.63 Sq. M
  const getPahadLandCalculations = () => {
    const totalAana = (Number(ropani) || 0) * 16 + (Number(aana) || 0) + (Number(paisa) || 0) / 4 + (Number(daam) || 0) / 16;
    const totalSqFt = totalAana * 342.25;
    const totalSqMtr = totalSqFt * 0.09290304;
    const totalAcre = totalSqFt / 43560;
    const totalHectare = totalSqMtr / 10000;
    const bighaEquiv = totalSqFt / 72900;
    const katthaEquiv = (totalSqFt / 72900) * 20;

    return {
      totalSqFt: Math.round(totalSqFt * 100) / 100,
      totalSqMtr: Math.round(totalSqMtr * 100) / 100,
      totalAcre: totalAcre.toFixed(4),
      totalHectare: totalHectare.toFixed(4),
      bighaEquiv: bighaEquiv.toFixed(3),
      katthaEquiv: katthaEquiv.toFixed(2),
    };
  };

  const getTeraiLandCalculations = () => {
    const totalDhur = (Number(bigha) || 0) * 400 + (Number(kattha) || 0) * 20 + (Number(dhur) || 0) + (Number(kanwa) || 0) / 16;
    const totalSqFt = totalDhur * 182.25;
    const totalSqMtr = totalSqFt * 0.09290304;
    const totalAcre = totalSqFt / 43560;
    const totalHectare = totalSqMtr / 10000;
    const ropaniEquiv = totalSqFt / 5476;
    const aanaEquiv = (totalSqFt / 5476) * 16;

    return {
      totalSqFt: Math.round(totalSqFt * 100) / 100,
      totalSqMtr: Math.round(totalSqMtr * 100) / 100,
      totalAcre: totalAcre.toFixed(4),
      totalHectare: totalHectare.toFixed(4),
      ropaniEquiv: ropaniEquiv.toFixed(3),
      aanaEquiv: aanaEquiv.toFixed(2),
    };
  };

  // Unit definitions & conversion factors (relative to base unit)
  const UNIT_CONFIG: Record<
    string,
    {
      nameNe: string;
      nameEn: string;
      baseUnit: string;
      units: { id: string; nameNe: string; nameEn: string; factor: number; isNepali?: boolean }[];
    }
  > = {
    length: {
      nameNe: 'लम्बाइ र दूरी (Length)',
      nameEn: 'Length & Distance',
      baseUnit: 'm',
      units: [
        { id: 'm', nameNe: 'मिटर (Meter)', nameEn: 'Meter (m)', factor: 1 },
        { id: 'km', nameNe: 'किलोमिटर (Kilometer)', nameEn: 'Kilometer (km)', factor: 1000 },
        { id: 'cm', nameNe: 'सेन्टिमिटर (Centimeter)', nameEn: 'Centimeter (cm)', factor: 0.01 },
        { id: 'mm', nameNe: 'मिलिमिटर (Millimeter)', nameEn: 'Millimeter (mm)', factor: 0.001 },
        { id: 'ft', nameNe: 'फिट (Foot)', nameEn: 'Foot (ft)', factor: 0.3048 },
        { id: 'in', nameNe: 'इन्च (Inch)', nameEn: 'Inch (in)', factor: 0.0254 },
        { id: 'yd', nameNe: 'यार्ड (Yard)', nameEn: 'Yard (yd)', factor: 0.9144 },
        { id: 'mi', nameNe: 'माइल (Mile)', nameEn: 'Mile (mi)', factor: 1609.344 },
        { id: 'gajj', nameNe: 'नेपाली गज (Gajj = 3 ft)', nameEn: 'Nepali Gajj (3 ft)', factor: 0.9144, isNepali: true },
        { id: 'haat', nameNe: 'नेपाली हात (Haat = 1.5 ft)', nameEn: 'Nepali Haat (1.5 ft)', factor: 0.4572, isNepali: true },
        { id: 'bitta', nameNe: 'नेपाली बित्ता (Bitta = 9 in)', nameEn: 'Nepali Bitta (9 in)', factor: 0.2286, isNepali: true },
        { id: 'angul', nameNe: 'नेपाली अंगुल (Angul = 0.75 in)', nameEn: 'Nepali Angul', factor: 0.01905, isNepali: true },
        { id: 'kosh', nameNe: 'नेपाली कोश (Kosh = 2 miles)', nameEn: 'Nepali Kosh (~3.22 km)', factor: 3218.688, isNepali: true },
      ],
    },
    weight: {
      nameNe: 'तौल र पिण्ड (Weight)',
      nameEn: 'Weight & Mass',
      baseUnit: 'kg',
      units: [
        { id: 'kg', nameNe: 'किलोग्राम (Kilogram)', nameEn: 'Kilogram (kg)', factor: 1 },
        { id: 'g', nameNe: 'ग्राम (Gram)', nameEn: 'Gram (g)', factor: 0.001 },
        { id: 'mg', nameNe: 'मिलिग्राम (Milligram)', nameEn: 'Milligram (mg)', factor: 0.000001 },
        { id: 'ton', nameNe: 'मेट्रिक टन (Metric Ton)', nameEn: 'Metric Ton (t)', factor: 1000 },
        { id: 'lb', nameNe: 'पाउन्ड (Pound)', nameEn: 'Pound (lb)', factor: 0.45359237 },
        { id: 'oz', nameNe: 'औंस (Ounce)', nameEn: 'Ounce (oz)', factor: 0.0283495 },
        { id: 'dharni', nameNe: 'नेपाली धार्नी (Dharni = 2.332 kg)', nameEn: 'Nepali Dharni (2.332 kg)', factor: 2.3328, isNepali: true },
        { id: 'sher', nameNe: 'नेपाली सेर (Sher = 0.933 kg)', nameEn: 'Nepali Sher (0.933 kg)', factor: 0.9331, isNepali: true },
        { id: 'pau', nameNe: 'नेपाली पाउ (Pau = 200 g)', nameEn: 'Nepali Pau (200 g)', factor: 0.2, isNepali: true },
        { id: 'tola', nameNe: 'नेपाली तोला (Tola = 11.664 g)', nameEn: 'Nepali Tola (11.664 g)', factor: 0.011664, isNepali: true },
        { id: 'chatak', nameNe: 'नेपाली चटाक (Chatak = 58.32 g)', nameEn: 'Nepali Chatak', factor: 0.05832, isNepali: true },
        { id: 'lal', nameNe: 'नेपाली लाल (Lal = 0.1166 g)', nameEn: 'Nepali Lal (0.1166 g)', factor: 0.0001166, isNepali: true },
      ],
    },
    volume: {
      nameNe: 'आयतन र तरल (Volume)',
      nameEn: 'Volume & Liquid',
      baseUnit: 'l',
      units: [
        { id: 'l', nameNe: 'लिटर (Liter)', nameEn: 'Liter (L)', factor: 1 },
        { id: 'ml', nameNe: 'मिलिलिटर (Milliliter)', nameEn: 'Milliliter (mL)', factor: 0.001 },
        { id: 'm3', nameNe: 'क्युबिक मिटर (Cubic Meter)', nameEn: 'Cubic Meter (m³)', factor: 1000 },
        { id: 'gal_us', nameNe: 'युएस ग्यालन (US Gallon)', nameEn: 'US Gallon (gal)', factor: 3.78541 },
        { id: 'gal_uk', nameNe: 'युके ग्यालन (UK Gallon)', nameEn: 'UK Gallon (gal)', factor: 4.54609 },
        { id: 'muri', nameNe: 'नेपाली मुरी (Muri = 20 Pathi = 90.8 L)', nameEn: 'Nepali Muri (90.8 L)', factor: 90.8, isNepali: true },
        { id: 'pathi', nameNe: 'नेपाली पाथी (Pathi = 8 Mana = 4.54 L)', nameEn: 'Nepali Pathi (4.54 L)', factor: 4.54, isNepali: true },
        { id: 'mana', nameNe: 'नेपाली माना (Mana = 8 Muthi = 0.568 L)', nameEn: 'Nepali Mana (0.568 L)', factor: 0.568, isNepali: true },
        { id: 'muthi', nameNe: 'नेपाली मुठी (Muthi = 0.071 L)', nameEn: 'Nepali Muthi (0.071 L)', factor: 0.071, isNepali: true },
      ],
    },
    area: {
      nameNe: 'क्षेत्रफल (Area)',
      nameEn: 'Area',
      baseUnit: 'sq_m',
      units: [
        { id: 'sq_m', nameNe: 'वर्ग मिटर (Square Meter)', nameEn: 'Square Meter (m²)', factor: 1 },
        { id: 'sq_km', nameNe: 'वर्ग किलोमिटर (Sq. Kilometer)', nameEn: 'Sq. Kilometer (km²)', factor: 1000000 },
        { id: 'sq_ft', nameNe: 'वर्ग फिट (Square Feet)', nameEn: 'Square Feet (sq ft)', factor: 0.092903 },
        { id: 'sq_yd', nameNe: 'वर्ग यार्ड (Square Yard)', nameEn: 'Square Yard (sq yd)', factor: 0.836127 },
        { id: 'acre', nameNe: 'एकर (Acre)', nameEn: 'Acre', factor: 4046.86 },
        { id: 'hectare', nameNe: 'हेक्टर (Hectare)', nameEn: 'Hectare', factor: 10000 },
      ],
    },
    speed: {
      nameNe: 'गति र वेग (Speed)',
      nameEn: 'Speed',
      baseUnit: 'kmh',
      units: [
        { id: 'kmh', nameNe: 'किमि/घण्टा (km/h)', nameEn: 'km/h', factor: 1 },
        { id: 'mph', nameNe: 'माइल/घण्टा (mph)', nameEn: 'mph', factor: 1.60934 },
        { id: 'ms', nameNe: 'मिटर/सेकेन्ड (m/s)', nameEn: 'm/s', factor: 3.6 },
        { id: 'knot', nameNe: 'नट (Knots)', nameEn: 'Knots', factor: 1.852 },
      ],
    },
    data: {
      nameNe: 'डिजिटल भण्डारण (Digital Storage)',
      nameEn: 'Digital Data Storage',
      baseUnit: 'mb',
      units: [
        { id: 'b', nameNe: 'बाइट (Byte)', nameEn: 'Byte (B)', factor: 0.00000095367431640625 },
        { id: 'kb', nameNe: 'किलोबाइट (KB)', nameEn: 'Kilobyte (KB)', factor: 0.0009765625 },
        { id: 'mb', nameNe: 'मेगाबाइट (MB)', nameEn: 'Megabyte (MB)', factor: 1 },
        { id: 'gb', nameNe: 'गिगाबाइट (GB)', nameEn: 'Gigabyte (GB)', factor: 1024 },
        { id: 'tb', nameNe: 'टेराबाइट (TB)', nameEn: 'Terabyte (TB)', factor: 1048576 },
        { id: 'pb', nameNe: 'पेटाबाइट (PB)', nameEn: 'Petabyte (PB)', factor: 1073741824 },
      ],
    },
  };

  // Temperature calculations
  const calculateTemperature = (val: number, from: string, to: string): number => {
    let celsius = val;
    if (from === 'f') celsius = (val - 32) * (5 / 9);
    if (from === 'k') celsius = val - 273.15;

    if (to === 'c') return celsius;
    if (to === 'f') return (celsius * 9) / 5 + 32;
    if (to === 'k') return celsius + 273.15;
    return val;
  };

  // Generic conversion calculation
  const calculateGenericConversion = () => {
    if (activeCategory === 'temperature') {
      const res = calculateTemperature(inputValue, fromUnit, toUnit);
      return Math.round(res * 1000) / 1000;
    }

    const currentConfig = UNIT_CONFIG[activeCategory];
    if (!currentConfig) return 0;

    const fromObj = currentConfig.units.find((u) => u.id === fromUnit) || currentConfig.units[0];
    const toObj = currentConfig.units.find((u) => u.id === toUnit) || currentConfig.units[1];

    const baseVal = (Number(inputValue) || 0) * fromObj.factor;
    const converted = baseVal / toObj.factor;

    return Math.round(converted * 100000) / 100000;
  };

  // Auto-switch default units on category change
  const handleCategoryChange = (catId: any) => {
    setActiveCategory(catId);
    if (catId === 'temperature') {
      setFromUnit('c');
      setToUnit('f');
    } else if (UNIT_CONFIG[catId]) {
      setFromUnit(UNIT_CONFIG[catId].units[0].id);
      setToUnit(UNIT_CONFIG[catId].units[1]?.id || UNIT_CONFIG[catId].units[0].id);
    }
  };

  const calculatedResult = calculateGenericConversion();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8 border border-sky-500/40">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-900/60 rounded-full border border-sky-400/40 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Scale className="w-3.5 h-3.5" />
          {lang === 'ne' ? 'नेपाली तथा अन्तर्राष्ट्रिय नाप रूपान्तरण' : 'Nepali & International Unit Converter'}
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {lang === 'ne' ? 'नाप तथा एकाइ रूपान्तरण केन्द्र' : 'Comprehensive Measurement Converter'}
        </h2>
        <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-2xl">
          {lang === 'ne'
            ? 'नेपाली जग्गा नाप (रोपनी/आना र बिघा/कठ्ठा), परम्परागत धार्नी/पाउ/तोला, मुरी/पाथी, लम्बाइ, क्षेत्रफल, तौल, गति, तापक्रम र डिजिटल डाटा।'
            : 'Convert Nepali traditional land units (Ropani/Bigha), historical units (Dharni/Tola/Muri/Pathi), and global SI units accurately.'}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
        {[
          { id: 'land', nameNe: 'जग्गा नाप (रोपनी/बिघा)', nameEn: 'Land (Ropani/Bigha)', icon: MapPin },
          { id: 'length', nameNe: 'लम्बाइ / दूरी (Length)', nameEn: 'Length & Distance', icon: Ruler },
          { id: 'weight', nameNe: 'तौल / पिण्ड (Weight)', nameEn: 'Weight & Mass', icon: Scale },
          { id: 'volume', nameNe: 'आयतन / तरल (Volume)', nameEn: 'Volume & Capacity', icon: Droplet },
          { id: 'area', nameNe: 'क्षेत्रफल (Area)', nameEn: 'Area', icon: Layers },
          { id: 'temperature', nameNe: 'तापक्रम (Temperature)', nameEn: 'Temperature', icon: Thermometer },
          { id: 'speed', nameNe: 'गति / वेग (Speed)', nameEn: 'Speed', icon: Gauge },
          { id: 'data', nameNe: 'डाटा भण्डारण (Data)', nameEn: 'Digital Data', icon: HardDrive },
        ].map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white shadow-xs ring-1 ring-sky-700'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
              <span>{lang === 'ne' ? cat.nameNe : cat.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Category 1: Traditional Nepali Land Measurement System */}
      {activeCategory === 'land' ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Visual Representation & Quick Reference Table */}
          <NepaliLandVisualizer
            lang={lang}
            calculatorElementId="land-calculator"
            onSelectHillUnits={(r, a, p, d) => {
              setLandSystem('pahad');
              setRopani(r);
              setAana(a);
              setPaisa(p);
              setDaam(d);
              triggerCalculationConfetti();
            }}
            onSelectTeraiUnits={(b, k, d, kw) => {
              setLandSystem('terai');
              setBigha(b);
              setKattha(k);
              setDhur(d);
              setKanwa(kw);
              triggerCalculationConfetti();
            }}
          />

          <div 
            id="land-calculator" 
            className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 transition-all duration-500 scroll-mt-24"
          >
            
            {/* System Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-700 dark:text-red-400" />
                <span>{lang === 'ne' ? 'नेपाली जग्गा नाप क्याल्कुलेटर' : 'Nepali Land Measurement Calculator'}</span>
              </h3>

              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl">
                <button
                  onClick={() => setLandSystem('pahad')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    landSystem === 'pahad'
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  🏔️ {lang === 'ne' ? 'पहाड प्रणाली (रोपनी-आना)' : 'Hill (Ropani-Aana)'}
                </button>
                <button
                  onClick={() => setLandSystem('terai')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    landSystem === 'terai'
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  🌾 {lang === 'ne' ? 'तराई प्रणाली (बिघा-कठ्ठा)' : 'Terai (Bigha-Kattha)'}
                </button>
              </div>
            </div>

            {/* Hill System Inputs */}
            {landSystem === 'pahad' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
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
                      className="w-full text-sm font-bold p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {lang === 'ne' ? 'आना (Aana 0-15)' : 'Aana (0-15)'}
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
                      className="w-full text-sm font-bold p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {lang === 'ne' ? 'पैसा (Paisa 0-3)' : 'Paisa (0-3)'}
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
                      className="w-full text-sm font-bold p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {lang === 'ne' ? 'दाम (Daam 0-3)' : 'Daam (0-3)'}
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
                      className="w-full text-sm font-bold p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
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

                {/* Conversion Output Grid */}
                {(() => {
                  const calc = getPahadLandCalculations();
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-center">
                        <span className="text-[11px] font-bold text-red-700 block mb-0.5">
                          {lang === 'ne' ? 'वर्ग फिट (Sq. Ft)' : 'Square Feet'}
                        </span>
                        <span className="text-xl font-extrabold text-stone-900 block">
                          {toNepaliDigits(calc.totalSqFt.toLocaleString())}
                        </span>
                        <span className="text-[10px] text-stone-500">{calc.totalSqFt.toLocaleString()} sq ft</span>
                      </div>

                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                        <span className="text-[11px] font-bold text-amber-800 block mb-0.5">
                          {lang === 'ne' ? 'वर्ग मिटर (Sq. Meter)' : 'Square Meters'}
                        </span>
                        <span className="text-xl font-extrabold text-stone-900 block">
                          {toNepaliDigits(calc.totalSqMtr.toLocaleString())}
                        </span>
                        <span className="text-[10px] text-stone-500">{calc.totalSqMtr.toLocaleString()} m²</span>
                      </div>

                      <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-center">
                        <span className="text-[11px] font-bold text-stone-700 block mb-0.5">
                          {lang === 'ne' ? 'तराई बिघा' : 'Terai Bigha'}
                        </span>
                        <span className="text-xl font-extrabold text-red-700 block">
                          {toNepaliDigits(calc.bighaEquiv)}
                        </span>
                        <span className="text-[10px] text-stone-500">{calc.bighaEquiv} Bigha ({calc.katthaEquiv} Kattha)</span>
                      </div>

                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                        <span className="text-[11px] font-bold text-emerald-800 block mb-0.5">
                          {lang === 'ne' ? 'एकर / हेक्टर' : 'Acre / Hectare'}
                        </span>
                        <span className="text-xl font-extrabold text-stone-900 block">
                          {toNepaliDigits(calc.totalAcre)}
                        </span>
                        <span className="text-[10px] text-stone-500">{calc.totalAcre} Acre ({calc.totalHectare} Ha)</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* Terai System Inputs */
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {lang === 'ne' ? 'बिघा (Bigha)' : 'Bigha'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={bigha}
                      onChange={(e) => {
                        setBigha(Number(e.target.value));
                        triggerCalculationConfetti();
                      }}
                      className="w-full text-sm font-bold p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {lang === 'ne' ? 'कठ्ठा (Kattha 0-19)' : 'Kattha (0-19)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="19"
                      value={kattha}
                      onChange={(e) => {
                        setKattha(Number(e.target.value));
                        triggerCalculationConfetti();
                      }}
                      className="w-full text-sm font-bold p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {lang === 'ne' ? 'धुर (Dhur 0-19)' : 'Dhur (0-19)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="19"
                      value={dhur}
                      onChange={(e) => {
                        setDhur(Number(e.target.value));
                        triggerCalculationConfetti();
                      }}
                      className="w-full text-sm font-bold p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {lang === 'ne' ? 'कनवा (Kanwa 0-15)' : 'Kanwa (0-15)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={kanwa}
                      onChange={(e) => {
                        setKanwa(Number(e.target.value));
                        triggerCalculationConfetti();
                      }}
                      className="w-full text-sm font-bold p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
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

                {/* Conversion Output Grid for Terai */}
                {(() => {
                  const calc = getTeraiLandCalculations();
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-center">
                        <span className="text-[11px] font-bold text-red-700 block mb-0.5">
                          {lang === 'ne' ? 'वर्ग फिट (Sq. Ft)' : 'Square Feet'}
                        </span>
                        <span className="text-xl font-extrabold text-stone-900 block">
                          {toNepaliDigits(calc.totalSqFt.toLocaleString())}
                        </span>
                        <span className="text-[10px] text-stone-500">{calc.totalSqFt.toLocaleString()} sq ft</span>
                      </div>

                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                        <span className="text-[11px] font-bold text-amber-800 block mb-0.5">
                          {lang === 'ne' ? 'वर्ग मिटर (Sq. Meter)' : 'Square Meters'}
                        </span>
                        <span className="text-xl font-extrabold text-stone-900 block">
                          {toNepaliDigits(calc.totalSqMtr.toLocaleString())}
                        </span>
                        <span className="text-[10px] text-stone-500">{calc.totalSqMtr.toLocaleString()} m²</span>
                      </div>

                      <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-center">
                        <span className="text-[11px] font-bold text-stone-700 block mb-0.5">
                          {lang === 'ne' ? 'पहाड रोपनी' : 'Hill Ropani'}
                        </span>
                        <span className="text-xl font-extrabold text-red-700 block">
                          {toNepaliDigits(calc.ropaniEquiv)}
                        </span>
                        <span className="text-[10px] text-stone-500">{calc.ropaniEquiv} Ropani ({calc.aanaEquiv} Aana)</span>
                      </div>

                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                        <span className="text-[11px] font-bold text-emerald-800 block mb-0.5">
                          {lang === 'ne' ? 'एकर / हेक्टर' : 'Acre / Hectare'}
                        </span>
                        <span className="text-xl font-extrabold text-stone-900 block">
                          {toNepaliDigits(calc.totalAcre)}
                        </span>
                        <span className="text-[10px] text-stone-500">{calc.totalAcre} Acre ({calc.totalHectare} Ha)</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Quick Reference Rules Card */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
              <span className="font-bold text-stone-900 block">
                📌 {lang === 'ne' ? 'प्रमाणिक नेपाली जग्गा नाप सूत्र:' : 'Official Nepali Land Unit Formulae:'}
              </span>
              <p>• १ रोपनी = १६ आना = ६४ पैसा = २५६ दाम = ५४७६ वर्ग फिट = ५०८.७२ वर्ग मिटर</p>
              <p>• १ बिघा = २० कठ्ठा = ४०० धुर = ७२९०० वर्ग फिट = ६७७२.६३ वर्ग मिटर (~ १३.३१ रोपनी)</p>
              <p>• १ आना = ३४२.२५ वर्ग फिट | १ धुर = १८२.२५ वर्ग फिट</p>
            </div>
          </div>
        </div>
      ) : (
        /* Category 2-8: General Generic Measurement Converters (Length, Weight, Volume, Area, Temp, Speed, Data) */
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            
            <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-red-700" />
              <span>
                {activeCategory === 'temperature'
                  ? lang === 'ne'
                    ? 'तापक्रम रूपान्तरण (Celsius, Fahrenheit, Kelvin)'
                    : 'Temperature Converter'
                  : lang === 'ne'
                  ? UNIT_CONFIG[activeCategory]?.nameNe
                  : UNIT_CONFIG[activeCategory]?.nameEn}
              </span>
            </h3>

            {/* Interactive Two-Way Converter Input Cards */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
              
              {/* Left Box: From */}
              <div className="md:col-span-5 p-5 bg-stone-50 rounded-3xl border border-stone-200 space-y-3">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  {lang === 'ne' ? 'रूपान्तरण गर्नुपर्ने मान (From):' : 'Convert From:'}
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(Number(e.target.value));
                    triggerCalculationConfetti();
                  }}
                  className="w-full text-2xl font-black p-3 bg-white border border-stone-300 rounded-2xl focus:ring-2 focus:ring-red-500"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full text-xs font-bold p-3 bg-white border border-stone-300 rounded-2xl focus:ring-2 focus:ring-red-500"
                >
                  {activeCategory === 'temperature' ? (
                    <>
                      <option value="c">सेल्सियस (°C Celsius)</option>
                      <option value="f">फरेनहाइट (°F Fahrenheit)</option>
                      <option value="k">केल्भिन (K Kelvin)</option>
                    </>
                  ) : (
                    UNIT_CONFIG[activeCategory]?.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.isNepali ? '🇳🇵 ' : ''}{lang === 'ne' ? u.nameNe : u.nameEn}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Middle Swap Button */}
              <div className="md:col-span-1 flex justify-center">
                <button
                  onClick={() => {
                    const temp = fromUnit;
                    setFromUnit(toUnit);
                    setToUnit(temp);
                    triggerCalculationConfetti();
                  }}
                  className="p-3 bg-red-700 hover:bg-red-800 text-white rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
                  title="एकाइ साट्नुहोस् (Swap)"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Right Box: To Result */}
              <div className="md:col-span-5 p-5 bg-gradient-to-br from-red-50 to-amber-50 rounded-3xl border border-red-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-red-700 uppercase tracking-wider block">
                    {lang === 'ne' ? 'परिणाम (Result To):' : 'Converted Result:'}
                  </label>
                  <button
                    onClick={() => copyValue(calculatedResult.toString())}
                    className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (lang === 'ne' ? 'कपी गरियो' : 'Copied') : (lang === 'ne' ? 'कपी' : 'Copy')}</span>
                  </button>
                </div>

                <div className="w-full text-2xl font-black p-3 bg-white/90 border border-red-200 rounded-2xl text-stone-900 break-all select-all">
                  {toNepaliDigits(calculatedResult.toLocaleString())}
                </div>

                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full text-xs font-bold p-3 bg-white border border-stone-300 rounded-2xl focus:ring-2 focus:ring-red-500"
                >
                  {activeCategory === 'temperature' ? (
                    <>
                      <option value="c">सेल्सियस (°C Celsius)</option>
                      <option value="f">फरेनहाइट (°F Fahrenheit)</option>
                      <option value="k">केल्भिन (K Kelvin)</option>
                    </>
                  ) : (
                    UNIT_CONFIG[activeCategory]?.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.isNepali ? '🇳🇵 ' : ''}{lang === 'ne' ? u.nameNe : u.nameEn}
                      </option>
                    ))
                  )}
                </select>
              </div>

            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => triggerCalculationConfetti()}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{lang === 'ne' ? 'एकाइ रूपान्तरण गर्नुहोस्' : 'Convert Unit'}</span>
              </button>
            </div>

            {/* Quick Reference Table for this Category */}
            {activeCategory !== 'temperature' && UNIT_CONFIG[activeCategory] && (
              <div className="pt-4 border-t border-stone-100">
                <span className="text-xs font-bold text-stone-700 block mb-3">
                  📋 {lang === 'ne' ? 'सबै एकाइहरूमा तत्काल मान तालिका:' : 'Quick Conversion Reference for 1 Base Unit:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {UNIT_CONFIG[activeCategory].units.map((u) => (
                    <div
                      key={u.id}
                      className={`p-2.5 rounded-xl border text-xs ${
                        u.isNepali
                          ? 'bg-amber-50/80 border-amber-200 text-amber-950 font-semibold'
                          : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      <span className="text-[10px] text-stone-400 block font-mono">
                        {u.isNepali ? '🇳🇵 नेपाली परम्परागत' : 'Standard'}
                      </span>
                      <span className="font-bold block">{lang === 'ne' ? u.nameNe : u.nameEn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
