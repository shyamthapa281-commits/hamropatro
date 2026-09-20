import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  Utensils, 
  Calendar, 
  HeartHandshake, 
  PartyPopper 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FestivalInfo, Language } from '../types';
import { MAJOR_FESTIVALS } from '../data/festivals';
import { toNepaliDigits } from '../utils/nepaliCalendar';

interface FestivalsViewProps {
  lang: Language;
}

export const FestivalsView: React.FC<FestivalsViewProps> = ({ lang }) => {
  const [filter, setFilter] = useState<'all' | 'major' | 'medium'>('all');
  const [selectedFestival, setSelectedFestival] = useState<FestivalInfo>(MAJOR_FESTIVALS[0]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
    });
  };

  const filteredFestivals = MAJOR_FESTIVALS.filter((f) => {
    if (filter === 'all') return true;
    return f.importance === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-800 via-rose-800 to-amber-800 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-700/60 rounded-full border border-red-500/40 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5" />
            {lang === 'ne' ? 'नेपाली चाडपर्व तथा सांस्कृतिक धरोहर' : 'Nepali Cultural Festivals & Heritage'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {lang === 'ne' ? 'प्रमुख नेपाली चाडपर्वहरू र काउन्टडाउन' : 'Upcoming Major Nepali Festivals'}
          </h2>
          <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-2xl">
            {lang === 'ne'
              ? 'बडादशैं, तिहार, छठ, महाशिवरात्रि, होली लगायतका महान् उत्सवहरूको धार्मिक महत्व, विधि र परिकारहरू'
              : 'Discover rich traditions, religious significance, rituals, and countdowns for Nepal’s iconic festivities.'}
          </p>
        </div>

        <button
          onClick={triggerCelebration}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <PartyPopper className="w-4 h-4" />
          <span>{lang === 'ne' ? 'चाडपर्व उत्सव मनाउनुहोस् 🎉' : 'Celebrate Festivals 🎉'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-bold text-stone-600">
          {lang === 'ne' ? 'प्रकार:' : 'Filter:'}
        </span>
        {(['all', 'major', 'medium'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === t
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {t === 'all' && (lang === 'ne' ? 'सबै चाडपर्व' : 'All Festivals')}
            {t === 'major' && (lang === 'ne' ? 'महान् चाडहरू (Major)' : 'Major Festivals')}
            {t === 'medium' && (lang === 'ne' ? 'अन्य पर्वहरू' : 'Other Events')}
          </button>
        ))}
      </div>

      {/* Festivals Grid & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Festival Cards Grid (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredFestivals.map((fest) => {
            const isSelected = selectedFestival.id === fest.id;
            return (
              <div
                key={fest.id}
                onClick={() => setSelectedFestival(fest)}
                className={`bg-white rounded-3xl p-5 border cursor-pointer transition-all duration-200 flex flex-col justify-between select-none ${
                  isSelected
                    ? 'border-red-600 ring-2 ring-red-500 shadow-md bg-red-50/20'
                    : 'border-stone-200 hover:border-red-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                      {fest.bsDate}
                    </span>
                    <span className="text-[10px] text-stone-500">{fest.adDate}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-stone-900 mb-1">
                    {lang === 'ne' ? fest.nameNe : fest.nameEn}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                    {lang === 'ne' ? fest.taglineNe : fest.taglineEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-bold text-red-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'ne'
                        ? `बाँकी: ${toNepaliDigits(fest.daysRemaining)} दिन`
                        : `${fest.daysRemaining} days left`}
                    </span>
                  </span>

                  <span className="text-[11px] font-bold text-stone-400 group-hover:text-red-700">
                    {lang === 'ne' ? 'विवरण हेर्नुहोस्' : 'Details →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Festival Deep Dive (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="bg-red-700 text-white font-extrabold text-xs px-3 py-1 rounded-full">
                {selectedFestival.bsDate}
              </span>
              <span className="text-xs text-stone-500 font-medium">{selectedFestival.adDate}</span>
            </div>

            <h3 className="text-2xl font-extrabold text-stone-900 mt-2">
              {lang === 'ne' ? selectedFestival.nameNe : selectedFestival.nameEn}
            </h3>
            <p className="text-xs text-red-700 font-bold mt-1">
              {lang === 'ne' ? selectedFestival.taglineNe : selectedFestival.taglineEn}
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 text-xs text-stone-700 leading-relaxed">
            {lang === 'ne' ? selectedFestival.descriptionNe : selectedFestival.descriptionEn}
          </div>

          {/* Rituals List */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-red-700" />
              {lang === 'ne' ? 'मुख्य धार्मिक तथा सामाजिक विधिहरू' : 'Core Rituals & Traditions'}
            </h4>
            <div className="space-y-2">
              {(lang === 'ne' ? selectedFestival.ritualsNe : selectedFestival.ritualsEn).map((ritual, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-800">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{ritual}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traditional Recipe Highlight */}
          {selectedFestival.recipeOrHighlightNe && (
            <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                  {lang === 'ne' ? 'विशेष खानपिन र परिकार' : 'Traditional Festive Cuisine'}
                </h5>
                <p className="text-xs text-amber-950 font-medium">
                  {lang === 'ne' ? selectedFestival.recipeOrHighlightNe : selectedFestival.recipeOrHighlightEn}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
