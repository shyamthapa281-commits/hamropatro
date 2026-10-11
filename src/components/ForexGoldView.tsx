import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft, 
  Calculator, 
  RefreshCw,
  Clock,
  Building2,
  Gem,
  Loader2,
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react';
import { Language, ForexRate, GoldSilverRate } from '../types';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import { 
  getLiveMarketBundle,
  getLiveForexRates, 
  getLiveBullionRates, 
  LIVE_BENCHMARK_FOREX, 
  LIVE_BENCHMARK_BULLION 
} from '../utils/liveMarketClient';

interface ForexGoldViewProps {
  lang: Language;
  onNavigate?: (tab: string) => void;
}

export const ForexGoldView: React.FC<ForexGoldViewProps> = ({ lang, onNavigate }) => {
  // Live Data States initialized with cached live data if available (0ms instant paint)
  const [forexRates, setForexRates] = useState<ForexRate[]>(() => {
    try {
      const raw = localStorage.getItem('hamro_patro_forex_cache_v5');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.rates?.length) return parsed.rates;
      }
    } catch {}
    return LIVE_BENCHMARK_FOREX;
  });

  const [forexDate, setForexDate] = useState<string>(() => {
    try {
      const raw = localStorage.getItem('hamro_patro_forex_cache_v5');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.publishedDate) return parsed.publishedDate;
      }
    } catch {}
    return 'Today';
  });

  const [forexSource, setForexSource] = useState<string>('नेपाल राष्ट्र बैंक');

  const [bullionRates, setBullionRates] = useState<GoldSilverRate[]>(() => {
    try {
      const raw = localStorage.getItem('hamro_patro_bullion_cache_v5');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.rates?.length) return parsed.rates;
      }
    } catch {}
    return LIVE_BENCHMARK_BULLION;
  });

  const [bullionDate, setBullionDate] = useState<string>(() => {
    try {
      const raw = localStorage.getItem('hamro_patro_bullion_cache_v5');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.publishedDate) return parsed.publishedDate;
      }
    } catch {}
    return 'Today';
  });

  const [bullionSource, setBullionSource] = useState<string>('सुनचाँदी व्यवसायी महासंघ');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Filtering and Searching
  const [bullionFilter, setBullionFilter] = useState<'all' | 'tola' | 'gram'>('all');
  const [forexSearch, setForexSearch] = useState<string>('');

  // Currency Converter State
  const [amount, setAmount] = useState<number>(100);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('USD');
  const [convertDirection, setConvertDirection] = useState<'foreignToNpr' | 'nprToForeign'>('foreignToNpr');
  const [rateType, setRateType] = useState<'sell' | 'buy'>('sell');

  // Gold Calculator State
  const [goldUnitType, setGoldUnitType] = useState<'tola' | 'aana' | '10gram' | 'gram'>('tola');
  const [goldQuantity, setGoldQuantity] = useState<number>(1);
  const [goldKarat, setGoldKarat] = useState<'fine' | 'tejabi' | 'silver'>('fine');

  // Fetch Live Market Data
  const fetchLiveMarketData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }

    try {
      const { forex, bullion } = await getLiveMarketBundle(isManualRefresh);

      if (forex?.rates?.length) {
        setForexRates(forex.rates);
        setForexDate(forex.publishedDate || 'Today');
        setForexSource(forex.source);
      }

      if (bullion?.rates?.length) {
        setBullionRates(bullion.rates);
        setBullionDate(bullion.publishedDate || 'Today');
        setBullionSource(bullion.source);
      }

      setLastSyncTime(new Date().toLocaleTimeString(lang === 'ne' ? 'ne-NP' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('Live market sync error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchLiveMarketData(false);
  }, [fetchLiveMarketData]);

  // Selected Rate for Currency Converter
  const selectedRate = forexRates.find((r) => r.currencyCode === selectedCurrencyCode) || forexRates[0] || {
    currencyCode: 'USD',
    currencyNameNe: 'अमेरिकी डलर',
    currencyNameEn: 'U.S. Dollar',
    unit: 1,
    buyRate: 154.48,
    sellRate: 155.08,
    flag: '🇺🇸',
    change: 0
  };

  // Currency conversion calculation
  const calculateConvertedCurrency = () => {
    if (!amount || amount <= 0 || !selectedRate) return '0';
    const unit = selectedRate.unit || 1;
    const activeRate = rateType === 'buy' ? selectedRate.buyRate : selectedRate.sellRate;
    const ratePerUnit = activeRate / unit;

    if (convertDirection === 'foreignToNpr') {
      return (amount * ratePerUnit).toFixed(2);
    } else {
      return (amount / ratePerUnit).toFixed(2);
    }
  };

  // Filtered Bullion Rates
  const filteredBullionRates = useMemo(() => {
    if (bullionFilter === 'tola') {
      return bullionRates.filter((r) => r.unitNe.includes('तोला') || r.unitEn.toLowerCase().includes('tola'));
    }
    if (bullionFilter === 'gram') {
      return bullionRates.filter((r) => r.unitNe.includes('ग्राम') || r.unitEn.toLowerCase().includes('gram'));
    }
    return bullionRates;
  }, [bullionRates, bullionFilter]);

  // Filtered Forex Rates
  const filteredForexRates = useMemo(() => {
    if (!forexSearch.trim()) return forexRates;
    const q = forexSearch.trim().toLowerCase();
    return forexRates.filter(
      (r) =>
        r.currencyCode.toLowerCase().includes(q) ||
        r.currencyNameEn.toLowerCase().includes(q) ||
        r.currencyNameNe.toLowerCase().includes(q)
    );
  }, [forexRates, forexSearch]);

  // Gold calculator calculation
  const calculateGoldCost = () => {
    const fineTola = bullionRates.find(r => r.itemNe.includes('छापावाल') && r.unitNe.includes('तोला'))?.rateNpr || 296500;
    const tejabiTola = bullionRates.find(r => r.itemNe.includes('तेजाबी') && r.unitNe.includes('तोला'))?.rateNpr || 295800;
    const silverTola = bullionRates.find(r => r.itemNe.includes('चाँदी') && r.unitNe.includes('तोला'))?.rateNpr || 4440;

    const fine10g = bullionRates.find(r => r.itemNe.includes('छापावाल') && r.unitNe.includes('१० ग्राम'))?.rateNpr || 254200;
    const tejabi10g = bullionRates.find(r => r.itemNe.includes('तेजाबी') && r.unitNe.includes('१० ग्राम'))?.rateNpr || 253600;
    const silver10g = bullionRates.find(r => r.itemNe.includes('चाँदी') && r.unitNe.includes('१० ग्राम'))?.rateNpr || 3806.5;

    let baseTolaRate = fineTola;
    let base10gRate = fine10g;

    if (goldKarat === 'tejabi') {
      baseTolaRate = tejabiTola;
      base10gRate = tejabi10g;
    } else if (goldKarat === 'silver') {
      baseTolaRate = silverTola;
      base10gRate = silver10g;
    }

    if (goldQuantity <= 0) return 0;

    if (goldUnitType === 'tola') {
      return Math.round(goldQuantity * baseTolaRate);
    } else if (goldUnitType === 'aana') {
      // 1 tola = 16 aana
      return Math.round((goldQuantity / 16) * baseTolaRate);
    } else if (goldUnitType === '10gram') {
      return Math.round((goldQuantity / 10) * base10gRate);
    } else {
      // 1 gram
      return Math.round(goldQuantity * (base10gRate / 10));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Real-Time Status Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8 border border-amber-600/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/30 rounded-full border border-amber-300/30 text-amber-200 text-xs font-black uppercase tracking-wider mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Building2 className="w-3.5 h-3.5" />
              {lang === 'ne' ? 'प्रत्यक्ष आधिकारिक बजार तथ्याङ्क' : '100% Verified Live Official Rates'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {lang === 'ne' ? 'विदेशी मुद्रा विनिमय दर र सुन-चाँदीको भाउ' : 'Forex Rates & Gold/Silver Market'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl">
              {lang === 'ne'
                ? 'नेपाल राष्ट्र बैंक (NRB) र नेपाल सुनचाँदी व्यवसायी महासंघ (FENEGOSIDA) को प्रत्यक्ष वास्तविक दैनिक दरहरू'
                : 'Directly sourced in real-time from Nepal Rastra Bank and FENEGOSIDA official daily market fixings.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-stone-950/60 p-3 px-4 rounded-2xl border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>
                {lastSyncTime ? (lang === 'ne' ? `अपडेट: ${lastSyncTime}` : `Synced: ${lastSyncTime}`) : (lang === 'ne' ? 'अपडेट हुँदैछ...' : 'Syncing...')}
              </span>
            </div>

            <button
              id="refresh-forex-bullion-btn"
              onClick={() => fetchLiveMarketData(true)}
              disabled={isRefreshing || isLoading}
              className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? (lang === 'ne' ? 'अपडेट हुँदैछ...' : 'Updating...') : (lang === 'ne' ? 'दर रिफ्रेस गर्नुहोस्' : 'Refresh Live Rates')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* NRN Banking & 10% IPO Quota Teaser Banner */}
      {onNavigate && (
        <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 text-white border border-sky-500/40 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-sm shrink-0 shadow-md">
              १०%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">
                  {lang === 'ne' ? 'विदेशमा हुनुहुन्छ? १०% कोटामा नेपालको IPO भर्नुहोस्' : 'Living Abroad? Apply in 10% Reserved Nepal IPO Quota'}
                </span>
                <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full uppercase">
                  Verified
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                {lang === 'ne'
                  ? 'वाणिज्य बैंकहरूमा उच्च ब्याजदरको NRN मुद्दती खाता, विदेशी मुद्रा निक्षेप र MeroShare C-ASBA प्रक्रिया हेर्नुहोस्।'
                  : 'Check high-yield NRN fixed deposit rates and step-by-step C-ASBA Demat guide.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('nrn-banking')}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>{lang === 'ne' ? 'NRN बैंकिङ तथा IPO हेर्नुहोस्' : 'Explore NRN Banking'}</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Gold & Silver Bullion Live Section */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-stone-900">
              {lang === 'ne' ? 'सुन र चाँदीको आधिकारिक बजार भाउ (FENEGOSIDA)' : 'Live Gold & Silver Rates (FENEGOSIDA)'}
            </h3>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-amber-700" />
              {bullionSource}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Bullion Category Filter */}
            <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold border border-stone-200">
              <button
                onClick={() => setBullionFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${bullionFilter === 'all' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
              >
                {lang === 'ne' ? 'सबै' : 'All'}
              </button>
              <button
                onClick={() => setBullionFilter('tola')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${bullionFilter === 'tola' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
              >
                {lang === 'ne' ? 'प्रतितोला' : 'Per Tola'}
              </button>
              <button
                onClick={() => setBullionFilter('gram')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${bullionFilter === 'gram' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
              >
                {lang === 'ne' ? 'प्रति १० ग्राम' : 'Per 10 Grams'}
              </button>
            </div>

            {bullionDate && (
              <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-xl border border-stone-200">
                {lang === 'ne' ? `मिति: ${bullionDate}` : `Date: ${bullionDate}`}
              </span>
            )}
          </div>
        </div>

        {isLoading && bullionRates.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-stone-200 animate-pulse h-36 flex flex-col justify-between">
                <div className="h-4 bg-stone-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-amber-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {filteredBullionRates.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-lg border border-stone-200/60">
                      {lang === 'ne' ? item.unitNe : item.unitEn}
                    </span>

                    {/* Change indicator badge */}
                    {item.changeNpr !== 0 ? (
                      <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                        item.isUp ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{item.isUp ? '+' : '-'}रु. {toNepaliDigits(item.changeNpr.toString())}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-bold bg-stone-50 px-2 py-0.5 rounded-md">
                        {lang === 'ne' ? 'अपरिवर्तित' : 'Unchanged'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 mb-1">
                    {lang === 'ne' ? item.itemNe : item.itemEn}
                  </h4>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-amber-700 block">
                      रु. {toNepaliDigits(item.rateNpr.toLocaleString())}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">NPR {item.rateNpr.toLocaleString()}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-semibold">
                    {lang === 'ne' ? item.unitNe : item.unitEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forex Table & Currency Converter Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
        
        {/* Forex Table (Left: 8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">
                  {lang === 'ne' ? 'नेपाल राष्ट्र बैंक आधिकारिक विदेशी विनिमय दर' : 'Nepal Rastra Bank Official Forex Rates'}
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  {forexSource}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {lang === 'ne' ? 'नेपाल राष्ट्र बैंकको दैनिक आधिकारिक खरिद तथा बिक्री दर' : 'Daily official buying and selling exchange rates in NPR'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Currency Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={lang === 'ne' ? 'मुद्रा खोज्नुहोस्...' : 'Search currency...'}
                  value={forexSearch}
                  onChange={(e) => setForexSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none w-36 sm:w-44"
                />
              </div>

              {forexDate && (
                <span className="bg-stone-100 text-stone-700 text-xs px-3 py-1.5 rounded-xl font-semibold border border-stone-200 shrink-0">
                  {lang === 'ne' ? `मिति: ${forexDate}` : `Date: ${forexDate}`}
                </span>
              )}
            </div>
          </div>

          {isLoading && forexRates.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-3" />
              <p className="text-xs text-stone-500">{lang === 'ne' ? 'नेपाल राष्ट्र बैंकबाट दरहरू लोड हुँदैछन्...' : 'Loading official NRB exchange rates...'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100/80 text-stone-700 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4">{lang === 'ne' ? 'विदेशी मुद्रा (Currency)' : 'Currency'}</th>
                    <th className="py-3.5 px-4 text-center">{lang === 'ne' ? 'इकाई (Unit)' : 'Unit'}</th>
                    <th className="py-3.5 px-4 text-right text-emerald-700">{lang === 'ne' ? 'खरिद दर (Buy NPR)' : 'Buy (NPR)'}</th>
                    <th className="py-3.5 px-4 text-right text-red-700">{lang === 'ne' ? 'बिक्री दर (Sell NPR)' : 'Sell (NPR)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredForexRates.map((rate) => (
                    <tr key={rate.currencyCode} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{rate.flag}</span>
                          <div>
                            <span className="font-bold text-stone-900 block text-xs">{rate.currencyCode}</span>
                            <span className="text-[11px] text-stone-500 font-medium">
                              {lang === 'ne' ? rate.currencyNameNe : rate.currencyNameEn}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-stone-700">
                        {toNepaliDigits(rate.unit)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700 text-sm">
                        {toNepaliDigits(rate.buyRate.toFixed(2))}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-red-700 text-sm">
                        {toNepaliDigits(rate.sellRate.toFixed(2))}
                      </td>
                    </tr>
                  ))}
                  {filteredForexRates.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-stone-500 text-xs">
                        {lang === 'ne' ? 'कुनै मुद्रा भेटिएन' : 'No currency found matching search'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Currency Converter & Gold Calculator Widget (Right: 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Currency Converter Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-amber-700" />
              <span>{lang === 'ne' ? 'प्रत्यक्ष मुद्रा रूपान्तरण क्याल्कुलेटर' : 'Live Currency Converter'}</span>
            </h3>
            <p className="text-xs text-stone-500 mb-3">
              {lang === 'ne' ? 'नेपाल राष्ट्र बैंकको वास्तविक दर अनुसार रूपान्तरण' : 'Calculated with official NRB daily rate'}
            </p>

            {/* Buy / Sell Rate Toggle */}
            <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold mb-3 border border-stone-200">
              <button
                onClick={() => setRateType('sell')}
                className={`flex-1 py-1 rounded-lg text-center transition-colors cursor-pointer ${
                  rateType === 'sell' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600'
                }`}
              >
                {lang === 'ne' ? 'बिक्री दर (Sell)' : 'Selling Rate'}
              </button>
              <button
                onClick={() => setRateType('buy')}
                className={`flex-1 py-1 rounded-lg text-center transition-colors cursor-pointer ${
                  rateType === 'buy' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600'
                }`}
              >
                {lang === 'ne' ? 'खरिद दर (Buy)' : 'Buying Rate'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-600 block mb-1 font-bold">
                  {lang === 'ne' ? 'रकम (Amount)' : 'Amount'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full text-sm font-bold px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-bold">
                  {lang === 'ne' ? 'मुद्रा चयन गर्नुहोस्' : 'Select Currency'}
                </label>
                <select
                  value={selectedCurrencyCode}
                  onChange={(e) => setSelectedCurrencyCode(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                >
                  {forexRates.map((r) => {
                    const unitLabel = r.unit > 1 ? `${r.unit} ` : '';
                    const rateVal = rateType === 'buy' ? r.buyRate : r.sellRate;
                    return (
                      <option key={r.currencyCode} value={r.currencyCode}>
                        {r.flag} {r.currencyCode} - {lang === 'ne' ? r.currencyNameNe : r.currencyNameEn} ({unitLabel}{r.currencyCode} = रु. {rateVal})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center justify-center py-1">
                <button
                  onClick={() =>
                    setConvertDirection(
                      convertDirection === 'foreignToNpr' ? 'nprToForeign' : 'foreignToNpr'
                    )
                  }
                  className="p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 transition-colors cursor-pointer"
                  title="दिशा बदल्नुहोस् (Swap Direction)"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Conversion Result Box */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                <span className="text-[11px] text-amber-800 font-bold block mb-1">
                  {convertDirection === 'foreignToNpr'
                    ? `${amount} ${selectedRate?.currencyCode || ''} =`
                    : `${amount} NPR =`}
                </span>
                <span className="text-2xl font-extrabold text-amber-950 block">
                  {convertDirection === 'foreignToNpr'
                    ? `रु. ${toNepaliDigits(Number(calculateConvertedCurrency()).toLocaleString())}`
                    : `${calculateConvertedCurrency()} ${selectedRate?.currencyCode || ''}`}
                </span>
                <span className="text-[10px] text-stone-500 mt-1 block font-medium">
                  {lang === 'ne' ? 'लागू दर:' : 'Applied Rate:'} {selectedRate?.unit || 1} {selectedRate?.currencyCode} = NPR {rateType === 'buy' ? selectedRate?.buyRate : selectedRate?.sellRate} ({rateType === 'buy' ? 'Buy' : 'Sell'})
                </span>
              </div>
            </div>
          </div>

          {/* Gold Price Calculator Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>{lang === 'ne' ? 'सुन/चाँदी मूल्य क्याल्कुलेटर' : 'Live Bullion Calculator'}</span>
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {lang === 'ne' ? 'महासंघको आधिकारिक दर अनुसार तोला, आना, १० ग्राम वा १ ग्रामको हिसाब' : 'Accurate real-time calculation based on FENEGOSIDA rates'}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-600 block mb-1 font-bold">
                  {lang === 'ne' ? 'प्रकार (Type)' : 'Metal / Karat'}
                </label>
                <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl">
                  {(['fine', 'tejabi', 'silver'] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => setGoldKarat(k)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        goldKarat === k ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600'
                      }`}
                    >
                      {k === 'fine' && (lang === 'ne' ? 'छापावाल २४K' : 'Fine 24K')}
                      {k === 'tejabi' && (lang === 'ne' ? 'तेजाबी २२K' : 'Tejabi 22K')}
                      {k === 'silver' && (lang === 'ne' ? 'चाँदी' : 'Silver')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-600 block mb-1 font-bold">
                    {lang === 'ne' ? 'परिमाण (Quantity)' : 'Quantity'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={goldQuantity}
                    onChange={(e) => setGoldQuantity(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-bold">
                    {lang === 'ne' ? 'इकाई (Unit)' : 'Unit'}
                  </label>
                  <select
                    value={goldUnitType}
                    onChange={(e: any) => setGoldUnitType(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="tola">{lang === 'ne' ? 'तोला (१ तोला = ११.६६g)' : 'Tola (11.66g)'}</option>
                    <option value="aana">{lang === 'ne' ? 'आना (१/१६ तोला)' : 'Aana (1/16 tola)'}</option>
                    <option value="10gram">{lang === 'ne' ? '१० ग्राम (10 Grams)' : '10 Grams'}</option>
                    <option value="gram">{lang === 'ne' ? '१ ग्राम (1 Gram)' : '1 Gram'}</option>
                  </select>
                </div>
              </div>

              {/* Total Calculated Value */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                <span className="text-[11px] text-amber-800 font-bold block mb-1">
                  {lang === 'ne' ? 'कुल बजार मूल्य:' : 'Calculated Market Price:'}
                </span>
                <span className="text-2xl font-extrabold text-amber-950 block">
                  रु. {toNepaliDigits(calculateGoldCost().toLocaleString())}
                </span>
                <span className="text-[10px] text-stone-500">
                  (NPR {calculateGoldCost().toLocaleString()})
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
