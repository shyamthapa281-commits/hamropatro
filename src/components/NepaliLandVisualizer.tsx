import React, { useState } from 'react';
import { 
  Layers, 
  Table, 
  MapPin, 
  Sparkles, 
  Info, 
  Home, 
  ArrowRight, 
  Check, 
  Copy,
  Compass,
  Building2,
  Maximize2,
  CheckCircle2,
  Calculator
} from 'lucide-react';
import { Language } from '../types';
import { toNepaliDigits } from '../utils/nepaliCalendar';

interface NepaliLandVisualizerProps {
  lang: Language;
  onSelectHillUnits?: (ropani: number, aana: number, paisa: number, daam: number) => void;
  onSelectTeraiUnits?: (bigha: number, kattha: number, dhur: number, kanwa: number) => void;
  className?: string;
  calculatorElementId?: string;
}

export const NepaliLandVisualizer: React.FC<NepaliLandVisualizerProps> = ({
  lang,
  onSelectHillUnits,
  onSelectTeraiUnits,
  className = '',
  calculatorElementId = 'land-calculator',
}) => {
  // Active view tab
  const [activeTab, setActiveTab] = useState<'visual' | 'table' | 'benchmarks' | 'comparison'>('visual');
  
  // Visual 16-Aana Grid selection (1 to 16 Aana)
  const [selectedAanas, setSelectedAanas] = useState<number>(4); // Default: 4 Aana (Char Aana - classic Nepali house plot)
  
  // Micro-breakdown view state
  const [zoomUnit, setZoomUnit] = useState<'ropani' | 'aana' | 'paisa'>('ropani');

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load into calculator feedback state
  const [loadedNotification, setLoadedNotification] = useState<{
    textNe: string;
    textEn: string;
    type: 'hill' | 'terai';
  } | null>(null);
  const [confirmedActionId, setConfirmedActionId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Dedicated interactive dispatcher to load into land calculator with smooth scroll & visual pulse
  const triggerLoadHill = (
    rop: number,
    aan: number,
    p: number = 0,
    d: number = 0,
    actionId: string = 'main-btn'
  ) => {
    if (onSelectHillUnits) {
      onSelectHillUnits(rop, aan, p, d);
    }
    setConfirmedActionId(actionId);

    const descNe = rop > 0
      ? `${toNepaliDigits(rop)} रोपनी ${toNepaliDigits(aan)} आना`
      : `${toNepaliDigits(aan)} आना (${toNepaliDigits(aan * 4)} पैसा)`;
    const descEn = rop > 0
      ? `${rop} Ropani ${aan} Aana`
      : `${aan} Aana (${aan * 4} Paisa)`;

    setLoadedNotification({
      textNe: `${descNe} तलको क्याल्कुलेटरमा सफलतापूर्वक लोड गरियो!`,
      textEn: `${descEn} loaded into the Land Calculator below!`,
      type: 'hill',
    });

    // Smooth scroll down to the calculator container
    setTimeout(() => {
      const targetId = calculatorElementId || 'land-calculator';
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-4', 'ring-red-500', 'ring-offset-2', 'dark:ring-offset-stone-900');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-red-500', 'ring-offset-2', 'dark:ring-offset-stone-900');
        }, 2400);
      }
    }, 60);

    setTimeout(() => {
      setConfirmedActionId(null);
    }, 3000);

    setTimeout(() => {
      setLoadedNotification(null);
    }, 4500);
  };

  const triggerLoadTerai = (
    b: number,
    k: number,
    dh: number,
    kw: number = 0,
    actionId: string = 'terai-btn'
  ) => {
    if (onSelectTeraiUnits) {
      onSelectTeraiUnits(b, k, dh, kw);
    }
    setConfirmedActionId(actionId);

    const descNe = `${toNepaliDigits(b)} बिघा ${toNepaliDigits(k)} कठ्ठा ${toNepaliDigits(dh)} धुर`;
    const descEn = `${b} Bigha ${k} Kattha ${dh} Dhur`;

    setLoadedNotification({
      textNe: `${descNe} तराई क्याल्कुलेटरमा सफलतापूर्वक लोड गरियो!`,
      textEn: `${descEn} loaded into Terai Land Calculator below!`,
      type: 'terai',
    });

    setTimeout(() => {
      const targetId = calculatorElementId || 'land-calculator';
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-4', 'ring-amber-500', 'ring-offset-2', 'dark:ring-offset-stone-900');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-amber-500', 'ring-offset-2', 'dark:ring-offset-stone-900');
        }, 2400);
      }
    }, 60);

    setTimeout(() => {
      setConfirmedActionId(null);
    }, 3000);

    setTimeout(() => {
      setLoadedNotification(null);
    }, 4500);
  };

  // Calculations for selected Aanas
  const selectedSqFt = selectedAanas * 342.25;
  const selectedSqMtr = selectedSqFt * 0.09290304;
  const selectedRopaniEquiv = (selectedAanas / 16).toFixed(3);
  const selectedPaisaTotal = selectedAanas * 4;
  const selectedDaamTotal = selectedAanas * 16;
  const selectedKatthaEquiv = (selectedSqFt / 3645).toFixed(2);
  const selectedDhurEquiv = (selectedSqFt / 182.25).toFixed(1);

  // Approximate physical square dimensions (side length in feet)
  const approxSideFt = Math.round(Math.sqrt(selectedSqFt) * 10) / 10;
  const approxSideMtr = Math.round(approxSideFt * 0.3048 * 10) / 10;

  // Real estate benchmarks dataset
  const BENCHMARKS = [
    {
      id: 'bm-daam',
      titleNe: '१ दाम',
      titleEn: '1 Daam',
      ropani: 0,
      aana: 0,
      paisa: 0,
      daam: 1,
      sqFt: '२१.३९',
      sqFtNum: 21.39,
      sqMtr: '१.९९',
      contextNe: 'नेपाली जग्गा नापको सबैभन्दा सानो औपचारिक एकाइ। प्रायः साँध र नाली सिमानामा प्रयोग।',
      contextEn: 'Smallest official land unit. Frequently referenced in precise boundary demarcations.',
      tagNe: 'सूक्ष्म नाप',
      tagEn: 'Micro Unit',
      category: 'micro'
    },
    {
      id: 'bm-paisa',
      titleNe: '१ पैसा (४ दाम)',
      titleEn: '1 Paisa (4 Daam)',
      ropani: 0,
      aana: 0,
      paisa: 1,
      daam: 0,
      sqFt: '८५.५६',
      sqFtNum: 85.56,
      sqMtr: '७.९५',
      contextNe: '१ आनाको एक चौथाइ (१/४) भाग। बाटो विस्तार वा संयुक्त कित्ता काटमा सामान्य।',
      contextEn: 'One-fourth (1/4) of 1 Aana. Common in right-of-way setbacks and sliver plots.',
      tagNe: 'उप-एकाइ',
      tagEn: 'Sub-unit',
      category: 'micro'
    },
    {
      id: 'bm-adhaaana',
      titleNe: '२ पैसा (आधा आना)',
      titleEn: '2 Paisa (Half Aana)',
      ropani: 0,
      aana: 0,
      paisa: 2,
      daam: 0,
      sqFt: '१७१.१३',
      sqFtNum: 171.13,
      sqMtr: '१५.९०',
      contextNe: 'आधा आना क्षेत्रफल। प्रायः घरको प्रवेश बाटो वा सानो पार्किङ क्षेत्र बराबर।',
      contextEn: 'Half Aana area. Equivalent to a dedicated private driveway or compact car porch.',
      tagNe: 'आधा आना',
      tagEn: 'Half Aana',
      category: 'micro'
    },
    {
      id: 'bm-1aana',
      titleNe: '१ आना (४ पैसा = १६ दाम)',
      titleEn: '1 Aana (4 Paisa)',
      ropani: 0,
      aana: 1,
      paisa: 0,
      daam: 0,
      sqFt: '३४२.२५',
      sqFtNum: 342.25,
      sqMtr: '३१.८०',
      contextNe: 'पहाड र काठमाडौँ उपत्यकाको आधारभूत रियल इस्टेट मूल्य निर्धारण एकाइ (प्रति आना मूल्य)।',
      contextEn: 'The benchmark unit for land valuation and quoting rates per Aana in Kathmandu.',
      tagNe: 'आधारभूत दर',
      tagEn: 'Rate Standard',
      category: 'standard'
    },
    {
      id: 'bm-2_5aana',
      titleNe: '२.५ आना (काठमाडौँ न्यूनतम घर नक्सा)',
      titleEn: '2.5 Aana (Municipal Minimum)',
      ropani: 0,
      aana: 2,
      paisa: 2,
      daam: 0,
      sqFt: '८५५.६३',
      sqFtNum: 855.63,
      sqMtr: '७९.४९',
      contextNe: 'काठमाडौँ उपत्यका नगर विकास प्राधिकरण (KVDA) अनुसार आवासीय घर नक्सा पास गर्न चाहिने न्यूनतम वैधानिक क्षेत्रफल।',
      contextEn: 'Minimum legal land size required by KVDA/Municipalities to approve residential building plans.',
      tagNe: 'न्यूनतम मापदण्ड',
      tagEn: 'Building Limit',
      category: 'building'
    },
    {
      id: 'bm-3aana',
      titleNe: '३ आना घडेरी',
      titleEn: '3 Aana Plot',
      ropani: 0,
      aana: 3,
      paisa: 0,
      daam: 0,
      sqFt: '१०२६.७५',
      sqFtNum: 1026.75,
      sqMtr: '९५.३९',
      contextNe: 'सहरिया आधुनिक कम्प्याक्ट घर निर्माणका लागि निकै रुचाइएको लोकप्रिय घडेरी आकार।',
      contextEn: 'Very popular compact parcel size for modern multi-storey residential townhouses.',
      tagNe: 'लोकप्रिय सहरी',
      tagEn: 'Urban Popular',
      category: 'building'
    },
    {
      id: 'bm-4aana',
      titleNe: '४ आना (चार आना = १/४ रोपनी)',
      titleEn: '4 Aana (Classic "Char Aana")',
      ropani: 0,
      aana: 4,
      paisa: 0,
      daam: 0,
      sqFt: '१३६९.००',
      sqFtNum: 1369.00,
      sqMtr: '१२७.१९',
      contextNe: 'नेपालमा पारिवारिक निवास (Bungalow) का लागि स्वर्ण मानक मानिने सबैभन्दा लोकप्रिय "चार आना" घडेरी।',
      contextEn: 'The "Gold Standard" single-family bungalow plot size in Kathmandu and hill cities.',
      tagNe: 'स्वर्ण मानक',
      tagEn: 'Gold Standard',
      category: 'prime'
    },
    {
      id: 'bm-8aana',
      titleNe: '८ आना (आधा रोपनी)',
      titleEn: '8 Aana (Half Ropani)',
      ropani: 0,
      aana: 8,
      paisa: 0,
      daam: 0,
      sqFt: '२७३८.००',
      sqFtNum: 2738.00,
      sqMtr: '२५४.३७',
      contextNe: 'खुला बगैँचा, पर्याप्त पार्किङ र ठूलो पारिवारिक बङ्ग्लोका लागि उपयुक्त विलासी घडेरी।',
      contextEn: 'Spacious prime parcel ideal for luxury detached villa with private garden and lawn.',
      tagNe: 'आधा रोपनी',
      tagEn: 'Half Ropani',
      category: 'prime'
    },
    {
      id: 'bm-16aana',
      titleNe: '१ रोपनी (१६ आना = ६४ पैसा)',
      titleEn: '1 Ropani (16 Aana)',
      ropani: 1,
      aana: 0,
      paisa: 0,
      daam: 0,
      sqFt: '५४७६.००',
      sqFtNum: 5476.00,
      sqMtr: '५०८.७२',
      contextNe: 'पहाडी नेपालको मुख्य जग्गा एकाइ। ठूलो आवास, कूटनीतिक नियोग, रिसोर्ट वा फार्म हाउसको लागि आदर्श।',
      contextEn: 'The flagship hill land measurement unit. Ideal for estates, embassies, and farmhouses.',
      tagNe: '१ पूर्ण रोपनी',
      tagEn: '1 Full Ropani',
      category: 'estate'
    },
    {
      id: 'bm-kattha',
      titleNe: '१ कठ्ठा (तराई नाप)',
      titleEn: '1 Kattha (Terai)',
      ropani: 0,
      aana: 10,
      paisa: 2,
      daam: 2,
      sqFt: '३६४५.००',
      sqFtNum: 3645.00,
      sqMtr: '३३८.६३',
      contextNe: 'तराईको २० धुर बराबर। पहाडी नाप अनुसार करिब १०.६५ आना (~०.६६ रोपनी) हुन्छ।',
      contextEn: 'Terai unit (= 20 Dhur). Equivalent to approx 10.65 Aana or 0.665 Ropani.',
      tagNe: 'तराई कठ्ठा',
      tagEn: 'Terai Kattha',
      category: 'terai'
    },
    {
      id: 'bm-bigha',
      titleNe: '१ बिघा (२० कठ्ठा = ४०० धुर)',
      titleEn: '1 Bigha (Terai Flagship)',
      ropani: 13,
      aana: 4,
      paisa: 3,
      daam: 2,
      sqFt: '७२९००.००',
      sqFtNum: 72900.00,
      sqMtr: '६७७२.६३',
      contextNe: 'तराईको सबैभन्दा ठूलो प्रमुख नाप। करिब १३.३१ रोपनी वा १.६७ एकड बराबर हुन्छ।',
      contextEn: 'Premier agricultural and commercial unit in Terai. Equals ~13.31 Ropani or ~1.67 Acres.',
      tagNe: 'तराई बिघा',
      tagEn: 'Terai Bigha',
      category: 'terai'
    },
  ];

  return (
    <div className={`bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 ${className}`}>
      
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-[11px] font-extrabold uppercase tracking-wide mb-1 border border-amber-200 dark:border-amber-800/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{lang === 'ne' ? 'नेपाली जग्गा नाप दृश्य प्रस्तुति' : 'Visual Land Measurement Guide'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{lang === 'ne' ? 'रोपनी, आना र पैसाको दृश्य नक्सा तथा सन्दर्भ' : 'Ropani, Aana & Paisa Visual Reference'}</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {lang === 'ne' 
              ? '१ रोपनी = १६ आना = ६४ पैसा = २५६ दाम (५४७६ वर्ग फिट) को पूर्ण दृश्य विभाजन र प्रचलित घडेरी मापदण्ड'
              : 'Interactive 16-Aana plot layout, hierarchical subdivision (Ropani ➔ Aana ➔ Paisa ➔ Daam), and property benchmarks'}
          </p>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/90 p-1 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'visual'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'ne' ? 'दृश्य नक्सा (16 आना)' : 'Visual Plot (16 Aana)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'table'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>{lang === 'ne' ? 'एकाइ तालिका' : 'Reference Table'}</span>
          </button>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'benchmarks'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{lang === 'ne' ? 'प्रचलित घडेरीहरू' : 'Popular Plots'}</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{lang === 'ne' ? 'पहाड ⇄ तराई' : 'Hill vs Terai'}</span>
          </button>
        </div>
      </div>

      {/* TOP HIERARCHY CHAIN: The Classical Chain Flow */}
      <div className="bg-gradient-to-r from-red-50/80 via-amber-50/80 to-stone-100/90 dark:from-red-950/30 dark:via-stone-800/50 dark:to-amber-950/20 p-4 sm:p-5 rounded-2xl border border-red-200/70 dark:border-stone-800">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-red-800 dark:text-red-400 mb-2.5 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          <span>{lang === 'ne' ? 'पहाडी जग्गा नाप शृङ्खला (Subdivision Chain):' : 'Hill Land Unit Hierarchy Chain:'}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Ropani */}
          <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-red-200 dark:border-stone-700 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-red-800 dark:text-red-400">
                {lang === 'ne' ? '१ रोपनी' : '1 Ropani'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded">
                = १६ आना
              </span>
            </div>
            <div className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
              {toNepaliDigits('5476')} <span className="text-[10px] font-normal text-stone-500">sq ft</span>
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
              ≈ ५०८.७२ वर्ग मिटर (~७४' × ७४')
            </div>
          </div>

          {/* Aana */}
          <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-amber-300 dark:border-stone-700 shadow-xs ring-1 ring-amber-400/50 dark:ring-amber-500/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-amber-800 dark:text-amber-400">
                {lang === 'ne' ? '१ आना' : '1 Aana'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded">
                = ४ पैसा
              </span>
            </div>
            <div className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
              {toNepaliDigits('342.25')} <span className="text-[10px] font-normal text-stone-500">sq ft</span>
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
              ≈ ३१.८० वर्ग मिटर (~१८.५' × १८.५')
            </div>
          </div>

          {/* Paisa */}
          <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-emerald-200 dark:border-stone-700 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-emerald-800 dark:text-emerald-400">
                {lang === 'ne' ? '१ पैसा' : '1 Paisa'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded">
                = ४ दाम
              </span>
            </div>
            <div className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
              {toNepaliDigits('85.56')} <span className="text-[10px] font-normal text-stone-500">sq ft</span>
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
              ≈ ७.९५ वर्ग मिटर (~९.२५' × ९.२५')
            </div>
          </div>

          {/* Daam */}
          <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-sky-200 dark:border-stone-700 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-sky-800 dark:text-sky-400">
                {lang === 'ne' ? '१ दाम' : '1 Daam'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 rounded">
                १/४ पैसा
              </span>
            </div>
            <div className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
              {toNepaliDigits('21.39')} <span className="text-[10px] font-normal text-stone-500">sq ft</span>
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
              ≈ १.९९ वर्ग मिटर (~४.६' × ४.६')
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: VISUAL 16-AANA INTERACTIVE PLOT */}
      {activeTab === 'visual' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Side: 4x4 Grid Visual Parcel (1 Ropani Parcel) */}
            <div className="lg:col-span-7 bg-stone-50 dark:bg-stone-800/60 p-4 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-red-700" />
                    <span>{lang === 'ne' ? '१ रोपनी जग्गाको १६ आना विभाजन नक्सा' : '1 Ropani Land: 16-Aana Grid Layout'}</span>
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {lang === 'ne' 
                      ? 'आना कोठामा क्लिक गरेर जग्गाको आकार छान्नुहोस् (१ देखि १६ आना):' 
                      : 'Click blocks below to select plot size from 1 to 16 Aana:'}
                  </p>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-mono font-bold">
                  {selectedAanas} / 16 आना
                </span>
              </div>

              {/* The 4x4 Plot Grid: Each Cell = 1 Aana (342.25 sq. ft) */}
              <div className="relative p-3 bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-700 shadow-inner">
                {/* Visual Plot Boundary Labels */}
                <div className="text-[10px] font-mono font-bold text-center text-stone-400 mb-1">
                  ← ~74 ft (उत्तरी सिमाना / North Boundary) →
                </div>

                <div className="grid grid-cols-4 gap-2 aspect-square max-w-[380px] mx-auto">
                  {Array.from({ length: 16 }).map((_, index) => {
                    const aanaNumber = index + 1;
                    const isSelected = aanaNumber <= selectedAanas;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedAanas(aanaNumber)}
                        className={`group relative rounded-xl p-1.5 flex flex-col items-center justify-center transition-all duration-150 cursor-pointer border-2 select-none ${
                          isSelected
                            ? 'bg-gradient-to-br from-red-600 to-red-700 border-red-800 text-white shadow-md scale-[0.98]'
                            : 'bg-stone-50 dark:bg-stone-800/80 border-dashed border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-red-400 hover:bg-red-50/50'
                        }`}
                        title={`आना नं. ${aanaNumber} (342.25 sq ft)`}
                      >
                        <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                          #{aanaNumber}
                        </span>
                        <span className="text-xs sm:text-sm font-black tracking-tight">
                          {lang === 'ne' ? `${toNepaliDigits(aanaNumber)} आना` : `${aanaNumber} Aana`}
                        </span>
                        <span className={`text-[9px] font-sans ${isSelected ? 'text-red-100' : 'text-stone-400'}`}>
                          ३४२.२५ ft²
                        </span>

                        {/* Special marker for key benchmarks */}
                        {aanaNumber === 4 && (
                          <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-amber-400 text-stone-950 font-extrabold text-[8px] rounded-full shadow-xs">
                            ४ आना
                          </span>
                        )}
                        {aanaNumber === 8 && (
                          <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-amber-400 text-stone-950 font-extrabold text-[8px] rounded-full shadow-xs">
                            १/२ रोपनी
                          </span>
                        )}
                        {aanaNumber === 16 && (
                          <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-amber-400 text-stone-950 font-extrabold text-[8px] rounded-full shadow-xs">
                            १ रोपनी
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] font-mono font-bold text-center text-stone-400 mt-1">
                  ← ~74 ft (दक्षिणी सिमाना / South Boundary) →
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block">
                  {lang === 'ne' ? 'छिटो छनोट (Quick Presets):' : 'Popular Plot Sizes:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { labelNe: '१ आना', labelEn: '1 Aana', val: 1 },
                    { labelNe: '२.५ आना (नक्सा पास)', labelEn: '2.5 Aana (Min)', val: 2.5 },
                    { labelNe: '३ आना', labelEn: '3 Aana', val: 3 },
                    { labelNe: '४ आना (चार आना)', labelEn: '4 Aana (Classic)', val: 4 },
                    { labelNe: '६ आना', labelEn: '6 Aana', val: 6 },
                    { labelNe: '८ आना (आधा रोपनी)', labelEn: '8 Aana (Half)', val: 8 },
                    { labelNe: '१२ आना (पौने रोपनी)', labelEn: '12 Aana', val: 12 },
                    { labelNe: '१६ आना (१ रोपनी)', labelEn: '16 Aana (1 Ropani)', val: 16 },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAanas(p.val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedAanas === p.val
                          ? 'bg-red-700 text-white shadow-xs'
                          : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      {lang === 'ne' ? p.labelNe : p.labelEn}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side: Detailed Calculation & Real Estate Specs for Selected Plot */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-gradient-to-br from-stone-50 to-amber-50/60 dark:from-stone-800/70 dark:to-amber-950/20 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4">
                
                <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-700/80 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-400 block">
                      {lang === 'ne' ? 'छानिएको घडेरीको क्षेत्रफल' : 'Selected Plot Size'}
                    </span>
                    <h5 className="text-xl font-black text-stone-900 dark:text-white">
                      {toNepaliDigits(selectedAanas)} आना ({lang === 'ne' ? `${selectedAanas} Aana` : `${selectedAanas} Aana`})
                    </h5>
                  </div>

                  <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/60">
                    {selectedAanas >= 16 
                      ? (lang === 'ne' ? '१ पूर्ण रोपनी' : '1 Full Ropani')
                      : (lang === 'ne' ? `${toNepaliDigits(selectedRopaniEquiv)} रोपनी` : `${selectedRopaniEquiv} Ropani`)}
                  </span>
                </div>

                {/* Main Measurement Stats Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 block">
                      {lang === 'ne' ? 'वर्ग फिट (Sq. Feet)' : 'Square Feet'}
                    </span>
                    <span className="text-lg font-black text-stone-900 dark:text-white block mt-0.5">
                      {toNepaliDigits(selectedSqFt.toLocaleString())}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {selectedSqFt.toLocaleString()} ft²
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 block">
                      {lang === 'ne' ? 'वर्ग मिटर (Sq. Meter)' : 'Square Meters'}
                    </span>
                    <span className="text-lg font-black text-stone-900 dark:text-white block mt-0.5">
                      {toNepaliDigits(Math.round(selectedSqMtr * 100) / 100)}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {Math.round(selectedSqMtr * 100) / 100} m²
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 block">
                      {lang === 'ne' ? 'पैसा र दाम' : 'Paisa & Daam'}
                    </span>
                    <span className="text-sm font-black text-stone-900 dark:text-white block mt-0.5">
                      {toNepaliDigits(selectedPaisaTotal)} पैसा
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      = {toNepaliDigits(selectedDaamTotal)} दाम
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 block">
                      {lang === 'ne' ? 'तराई नाप समतुल्य' : 'Terai Equivalent'}
                    </span>
                    <span className="text-sm font-black text-red-700 dark:text-red-400 block mt-0.5">
                      {toNepaliDigits(selectedDhurEquiv)} धुर
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      ≈ {toNepaliDigits(selectedKatthaEquiv)} कठ्ठा
                    </span>
                  </div>
                </div>

                {/* Approximate Plot Dimension Box */}
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-amber-200 dark:border-stone-700 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ne' ? 'अनुमानित चौखट नाप (Square Plot Dimension):' : 'Estimated Plot Dimensions:'}</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300">
                    {lang === 'ne'
                      ? `करिब ${toNepaliDigits(approxSideFt)} फिट लम्बाई × ${toNepaliDigits(approxSideFt)} फिट चौडाइ (${toNepaliDigits(approxSideMtr)}m × ${toNepaliDigits(approxSideMtr)}m)`
                      : `Approx. ${approxSideFt} ft length × ${approxSideFt} ft width (${approxSideMtr}m × ${approxSideMtr})`}
                  </p>
                </div>

                {/* Interactive Action: Send to Land Calculator */}
                {onSelectHillUnits && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-medium px-1">
                      <span>{lang === 'ne' ? 'क्याल्कुलेटर लोड मान:' : 'Calculator Value:'}</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        {Math.floor(selectedAanas / 16) > 0
                          ? (lang === 'ne'
                              ? `${toNepaliDigits(Math.floor(selectedAanas / 16))} रोपनी ${toNepaliDigits(selectedAanas % 16)} आना`
                              : `${Math.floor(selectedAanas / 16)} Ropani ${selectedAanas % 16} Aana`)
                          : (lang === 'ne'
                              ? `${toNepaliDigits(selectedAanas)} आना (० रोपनी ${toNepaliDigits(selectedAanas)} आना)`
                              : `${selectedAanas} Aana (0 Ropani ${selectedAanas} Aana)`)}
                      </span>
                    </div>

                    <button
                      type="button"
                      id="load-plot-size-calc-btn"
                      onClick={() => {
                        const rop = Math.floor(selectedAanas / 16);
                        const aan = selectedAanas % 16;
                        triggerLoadHill(rop, aan, 0, 0, 'main-btn');
                      }}
                      className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98 ${
                        confirmedActionId === 'main-btn'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400 ring-offset-1'
                          : 'bg-red-700 hover:bg-red-800 text-white shadow-red-900/20'
                      }`}
                      title={lang === 'ne' ? 'क्याल्कुलेटरमा यो क्षेत्रफल राखेर तुरुन्त हिसाब हेर्नुहोस्' : 'Load into land calculator and compute units'}
                    >
                      {confirmedActionId === 'main-btn' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                          <span>
                            {lang === 'ne'
                              ? `✓ ${toNepaliDigits(selectedAanas)} आना क्याल्कुलेटरमा लोड गरियो!`
                              : `✓ Loaded ${selectedAanas} Aana into Calculator!`}
                          </span>
                        </>
                      ) : (
                        <>
                          <Calculator className="w-4 h-4" />
                          <span>{lang === 'ne' ? 'यो मान क्याल्कुलेटरमा परीक्षण गर्नुहोस्' : 'Load this size into Calculator'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-stone-500 dark:text-stone-400 font-medium">
                      {lang === 'ne'
                        ? '👇 थिच्नासाथ तलको जग्गा क्याल्कुलेटरमा यो मान भरिएर पुग्दछ'
                        : '👇 Automatically fills inputs & smoothly scrolls to the calculator below'}
                    </p>
                  </div>
                )}
              </div>

              {/* Sub-Aana Visual Explainer: Inside 1 Aana */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {lang === 'ne' ? '१ आना भित्र के हुन्छ? (Micro Breakdown)' : 'Inside 1 Aana:'}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-stone-500">३४२.२५ ft²</span>
                </div>

                {/* 4 Paisa Visual Blocks */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[1, 2, 3, 4].map((pNum) => (
                    <div 
                      key={pNum} 
                      className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-emerald-200 dark:border-stone-700 text-center shadow-2xs"
                    >
                      <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 font-bold block">
                        पैसा #{pNum}
                      </span>
                      <span className="text-[11px] font-black text-stone-800 dark:text-stone-200 block">
                        १ पैसा
                      </span>
                      <span className="text-[8px] text-stone-400 block font-mono">
                        ८५.५६ ft²
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-stone-500 dark:text-stone-400 pt-1 leading-relaxed">
                  {lang === 'ne'
                    ? '• १ आना = ४ पैसा | प्रत्येक १ पैसा = ४ दाम (२१.३९ वर्ग फिट)। यसरी १ आनामा कुल १६ दाम हुन्छन्।'
                    : '• 1 Aana = 4 Paisa | Each Paisa = 4 Daam (21.39 sq ft). Thus, 1 Aana contains exactly 16 Daam.'}
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 2: COMPREHENSIVE QUICK-REFERENCE TABLE */}
      {activeTab === 'table' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-red-700" />
              <span>{lang === 'ne' ? 'नेपाली परम्परागत जग्गा नाप द्रुत सन्दर्भ तालिका' : 'Official Nepali Land Measurement Reference Table'}</span>
            </h4>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              {lang === 'ne' ? 'प्रमाणिक नापी विभाग मापदण्ड' : 'Department of Survey Standards'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-black border-b border-stone-200 dark:border-stone-700">
                  <th className="p-3 sm:p-3.5">{lang === 'ne' ? 'एकाइ (Unit)' : 'Unit'}</th>
                  <th className="p-3 sm:p-3.5">{lang === 'ne' ? 'सम्बन्ध / सूत्र' : 'Relationship / Ratio'}</th>
                  <th className="p-3 sm:p-3.5">{lang === 'ne' ? 'वर्ग फिट (Sq. Ft)' : 'Square Feet'}</th>
                  <th className="p-3 sm:p-3.5">{lang === 'ne' ? 'वर्ग मिटर (m²)' : 'Square Meters'}</th>
                  <th className="p-3 sm:p-3.5">{lang === 'ne' ? 'तराई समतुल्य' : 'Terai Equivalent'}</th>
                  <th className="p-3 sm:p-3.5">{lang === 'ne' ? 'प्रायोगिक प्रयोग / महत्त्व' : 'Practical Real Estate Context'}</th>
                  <th className="p-3 sm:p-3.5 text-center">{lang === 'ne' ? 'कपी' : 'Copy'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                {/* Ropani */}
                <tr className="hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors bg-red-50/20 dark:bg-red-950/10">
                  <td className="p-3 font-extrabold text-red-800 dark:text-red-400">
                    {lang === 'ne' ? '१ रोपनी (Ropani)' : '1 Ropani'}
                  </td>
                  <td className="p-3 font-medium">
                    १६ आना = ६४ पैसा = २५६ दाम
                  </td>
                  <td className="p-3 font-bold font-mono text-stone-900 dark:text-white">
                    ५,४७६.०० ft²
                  </td>
                  <td className="p-3 font-mono">
                    ५०८.७२ m²
                  </td>
                  <td className="p-3 font-mono text-amber-700 dark:text-amber-400 font-semibold">
                    ~३० धुर (१.५ कठ्ठा)
                  </td>
                  <td className="p-3 text-[11px] text-stone-600 dark:text-stone-400">
                    पहाडको प्रमुख नाप; ठूला निवास, फार्म हाउस र रिसोर्ट
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleCopy('1 Ropani = 16 Aana = 64 Paisa = 5476 Sq Ft (508.72 Sq M)', 'row-ropani')}
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                      title="कपी गर्नुहोस्"
                    >
                      {copiedId === 'row-ropani' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                    </button>
                  </td>
                </tr>

                {/* Aana */}
                <tr className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors bg-amber-50/10 dark:bg-amber-950/5">
                  <td className="p-3 font-extrabold text-amber-800 dark:text-amber-400">
                    {lang === 'ne' ? '१ आना (Aana)' : '1 Aana'}
                  </td>
                  <td className="p-3 font-medium">
                    ४ पैसा = १६ दाम (१/१६ रोपनी)
                  </td>
                  <td className="p-3 font-bold font-mono text-stone-900 dark:text-white">
                    ३४२.२५ ft²
                  </td>
                  <td className="p-3 font-mono">
                    ३१.८० m²
                  </td>
                  <td className="p-3 font-mono text-amber-700 dark:text-amber-400 font-semibold">
                    ~१.८८ धुर
                  </td>
                  <td className="p-3 text-[11px] text-stone-600 dark:text-stone-400">
                    काठमाडौँ उपत्यकाको जग्गा खरिदबिक्री दर (प्रति आना दर)
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleCopy('1 Aana = 4 Paisa = 16 Daam = 342.25 Sq Ft (31.80 Sq M)', 'row-aana')}
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                    >
                      {copiedId === 'row-aana' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                    </button>
                  </td>
                </tr>

                {/* Paisa */}
                <tr className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors">
                  <td className="p-3 font-extrabold text-emerald-800 dark:text-emerald-400">
                    {lang === 'ne' ? '१ पैसा (Paisa)' : '1 Paisa'}
                  </td>
                  <td className="p-3 font-medium">
                    ४ दाम (१/४ आना = १/६४ रोपनी)
                  </td>
                  <td className="p-3 font-bold font-mono text-stone-900 dark:text-white">
                    ८५.५६ ft²
                  </td>
                  <td className="p-3 font-mono">
                    ७.९५ m²
                  </td>
                  <td className="p-3 font-mono text-stone-500 font-semibold">
                    ~०.४७ धुर
                  </td>
                  <td className="p-3 text-[11px] text-stone-600 dark:text-stone-400">
                    सटीक लालपुर्जा कित्ताकाट तथा साँध सिमाना
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleCopy('1 Paisa = 4 Daam = 85.56 Sq Ft (7.95 Sq M)', 'row-paisa')}
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                    >
                      {copiedId === 'row-paisa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                    </button>
                  </td>
                </tr>

                {/* Daam */}
                <tr className="hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-colors">
                  <td className="p-3 font-extrabold text-sky-800 dark:text-sky-400">
                    {lang === 'ne' ? '१ दाम (Daam)' : '1 Daam'}
                  </td>
                  <td className="p-3 font-medium">
                    १/४ पैसा = १/१६ आना = १/२५६ रोपनी
                  </td>
                  <td className="p-3 font-bold font-mono text-stone-900 dark:text-white">
                    २१.३९ ft²
                  </td>
                  <td className="p-3 font-mono">
                    १.९९ m²
                  </td>
                  <td className="p-3 font-mono text-stone-500 font-semibold">
                    ~०.१२ धुर
                  </td>
                  <td className="p-3 text-[11px] text-stone-600 dark:text-stone-400">
                    नेपालको सबैभन्दा सानो औपचारिक जग्गा एकाइ
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleCopy('1 Daam = 21.39 Sq Ft (1.99 Sq M)', 'row-daam')}
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                    >
                      {copiedId === 'row-daam' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                    </button>
                  </td>
                </tr>

                {/* Terai Bigha */}
                <tr className="hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                  <td className="p-3 font-extrabold text-stone-900 dark:text-white">
                    {lang === 'ne' ? '१ बिघा (Bigha)' : '1 Bigha (Terai)'}
                  </td>
                  <td className="p-3 font-medium">
                    २० कठ्ठा = ४०० धुर
                  </td>
                  <td className="p-3 font-bold font-mono text-stone-900 dark:text-white">
                    ७२,९००.०० ft²
                  </td>
                  <td className="p-3 font-mono">
                    ६,७७२.६३ m²
                  </td>
                  <td className="p-3 font-mono text-red-700 dark:text-red-400 font-bold">
                    १ बिघा (१३.३१ रोपनी)
                  </td>
                  <td className="p-3 text-[11px] text-stone-600 dark:text-stone-400">
                    तराईको मुख्य कृषि तथा औद्योगिक जग्गा नाप
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleCopy('1 Bigha = 20 Kattha = 400 Dhur = 72900 Sq Ft = 13.31 Ropani', 'row-bigha')}
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                    >
                      {copiedId === 'row-bigha' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                    </button>
                  </td>
                </tr>

                {/* Terai Kattha */}
                <tr className="hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                  <td className="p-3 font-extrabold text-stone-900 dark:text-white">
                    {lang === 'ne' ? '१ कठ्ठा (Kattha)' : '1 Kattha (Terai)'}
                  </td>
                  <td className="p-3 font-medium">
                    २० धुर (१/२० बिघा)
                  </td>
                  <td className="p-3 font-bold font-mono text-stone-900 dark:text-white">
                    ३,६४५.०० ft²
                  </td>
                  <td className="p-3 font-mono">
                    ३३८.६३ m²
                  </td>
                  <td className="p-3 font-mono text-amber-700 dark:text-amber-400 font-bold">
                    ~१०.६५ आना (०.६६ रोपनी)
                  </td>
                  <td className="p-3 text-[11px] text-stone-600 dark:text-stone-400">
                    तराईमा घडेरी खरिदबिक्रीको प्रमुख आधार
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleCopy('1 Kattha = 20 Dhur = 3645 Sq Ft = 10.65 Aana', 'row-kattha')}
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                    >
                      {copiedId === 'row-kattha' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                    </button>
                  </td>
                </tr>

                {/* Terai Dhur */}
                <tr className="hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                  <td className="p-3 font-extrabold text-stone-900 dark:text-white">
                    {lang === 'ne' ? '१ धुर (Dhur)' : '1 Dhur (Terai)'}
                  </td>
                  <td className="p-3 font-medium">
                    १६ कनवा (१/२० कठ्ठा = १/४०० बिघा)
                  </td>
                  <td className="p-3 font-bold font-mono text-stone-900 dark:text-white">
                    १८२.२५ ft²
                  </td>
                  <td className="p-3 font-mono">
                    १६.९३ m²
                  </td>
                  <td className="p-3 font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    ~०.५३ आना (~२ पैसा)
                  </td>
                  <td className="p-3 text-[11px] text-stone-600 dark:text-stone-400">
                    तराईको सानो घडेरी तथा सिमाना निर्धारण
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleCopy('1 Dhur = 182.25 Sq Ft = 0.53 Aana', 'row-dhur')}
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                    >
                      {copiedId === 'row-dhur' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: POPULAR REAL ESTATE PLOT BENCHMARKS (काठमाडौँ तथा नेपालभरका घडेरीहरू) */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <Home className="w-4 h-4 text-red-700" />
                <span>{lang === 'ne' ? 'काठमाडौँ तथा नेपालका प्रचलित घडेरी आकारहरू' : 'Popular Real Estate Plot Benchmarks in Nepal'}</span>
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {lang === 'ne' ? 'नगरपालिका मापदण्ड, लोकप्रिय चार आना, र विभिन्न आकारका घडेरीहरू' : 'Standard residential sizes, building permit limits, and common house plots'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {BENCHMARKS.map((bm) => (
              <div
                key={bm.id}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 hover:border-red-300 dark:hover:border-red-800/60 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300">
                      {lang === 'ne' ? bm.tagNe : bm.tagEn}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-400">
                      {bm.sqFtNum} ft²
                    </span>
                  </div>

                  <h5 className="text-sm sm:text-base font-black text-stone-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                    {lang === 'ne' ? bm.titleNe : bm.titleEn}
                  </h5>

                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                    {lang === 'ne' ? bm.contextNe : bm.contextEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200/80 dark:border-stone-700/80 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                    <strong>{toNepaliDigits(bm.sqFt)}</strong> ft² | <strong>{toNepaliDigits(bm.sqMtr)}</strong> m²
                  </div>

                  {onSelectHillUnits && (
                    <button
                      type="button"
                      onClick={() => triggerLoadHill(bm.ropani, bm.aana, bm.paisa, bm.daam, bm.id)}
                      className={`text-[11px] font-extrabold flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        confirmedActionId === bm.id
                          ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400'
                          : 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
                      }`}
                      title={lang === 'ne' ? 'क्याल्कुलेटरमा यो मान राखेर हिसाब हेर्नुहोस्' : 'Load this plot size'}
                    >
                      {confirmedActionId === bm.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'ne' ? 'लोड भयो!' : 'Loaded!'}</span>
                        </>
                      ) : (
                        <>
                          <span>{lang === 'ne' ? 'परीक्षण गर्नुहोस्' : 'Test Size'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Direct Floating Toast Notification on Load Action */}
      {loadedNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl bg-stone-900/95 dark:bg-stone-800 text-white shadow-2xl border border-stone-700/80 backdrop-blur-md flex items-start gap-3 transition-all duration-300">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <span className="font-black text-stone-100 block text-xs">
              {lang === 'ne' ? '✓ क्याल्कुलेटरमा मान लोड भयो' : '✓ Loaded into Land Calculator'}
            </span>
            <p className="text-stone-300 mt-1 font-medium leading-relaxed">
              {lang === 'ne' ? loadedNotification.textNe : loadedNotification.textEn}
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: HILL VS TERAI COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="space-y-4">
          <div className="bg-stone-50 dark:bg-stone-800/60 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4">
            <h4 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-red-700" />
              <span>{lang === 'ne' ? 'पहाड (रोपनी) र तराई (बिघा) प्रणाली बीचको प्रत्यक्ष तुलना' : 'Hill (Ropani) vs Terai (Bigha) System Conversion Rules'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-red-200 dark:border-stone-700 space-y-2">
                <span className="text-xs font-black text-red-800 dark:text-red-400 block uppercase">
                  🏔️ {lang === 'ne' ? 'पहाडी प्रणाली (काठमाडौँ तथा पहाड)' : 'Hill System (Kathmandu & Hills)'}
                </span>
                <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-1.5">
                  <li>• १ रोपनी = १६ आना</li>
                  <li>• १ आना = ४ पैसा</li>
                  <li>• १ पैसा = ४ दाम</li>
                  <li>• १ रोपनी = ५,४७६ वर्ग फिट = ५०८.७२ वर्ग मिटर</li>
                  <li className="font-bold text-stone-800 dark:text-stone-100 pt-1">
                    👉 १ रोपनी = करिब १ कठ्ठा १० धुर (३० धुर)
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-amber-200 dark:border-stone-700 space-y-2">
                <span className="text-xs font-black text-amber-800 dark:text-amber-400 block uppercase">
                  🌾 {lang === 'ne' ? 'तराई प्रणाली (मधेस तथा भित्री मधेस)' : 'Terai System (Plains & Inner Terai)'}
                </span>
                <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-1.5">
                  <li>• १ बिघा = २० कठ्ठा</li>
                  <li>• १ कठ्ठा = २० धुर</li>
                  <li>• १ धुर = १६ कनवा</li>
                  <li>• १ बिघा = ७२,९०० वर्ग फिट = ६,७७२.६३ वर्ग मिटर</li>
                  <li className="font-bold text-stone-800 dark:text-stone-100 pt-1">
                    👉 १ बिघा = करिब १३.३१ रोपनी (२१३ आना)
                  </li>
                </ul>
              </div>
            </div>

            {/* Direct Conversion Rules Summary Banner */}
            <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
              <span className="font-bold block text-amber-900 dark:text-amber-300">
                💡 {lang === 'ne' ? 'सिधा हिसाब गर्ने सजिलो तरिका (Quick Golden Rules):' : 'Golden Rules for Quick Conversion:'}
              </span>
              <p>• १ बिघा = १३ रोपनी ५ आना = ७२,९०० वर्ग फिट</p>
              <p>• १ कठ्ठा = १०.६५ आना = ३,६४५ वर्ग फिट</p>
              <p>• १ धुर = ०.५३ आना (करिब २ पैसा १ दाम) = १८२.२५ वर्ग फिट</p>
              <p>• १ रोपनी = ३० धुर (१.५ कठ्ठा) = ५,४७६ वर्ग फिट</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
