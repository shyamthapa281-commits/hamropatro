import React, { useState } from 'react';
import {
  Gamepad2,
  Grid3X3,
  Brain,
  Sparkles,
  Trophy,
  Flame,
  Award,
} from 'lucide-react';
import { Language } from '../types';
import { SudokuGame } from './games/SudokuGame';
import { BaghChalGame } from './games/BaghChalGame';
import { BrainTeasers } from './games/BrainTeasers';

interface ActivityCentreViewProps {
  lang: Language;
}

type ActivityTab = 'sudoku' | 'baghchal' | 'brain';

export const ActivityCentreView: React.FC<ActivityCentreViewProps> = ({ lang }) => {
  const [currentTab, setCurrentTab] = useState<ActivityTab>('sudoku');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Activity Centre Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 via-sky-800 to-blue-950 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold tracking-wide border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'निःशुल्क अनलाइन बौद्धिक खेल केन्द्र' : '100% Free Online Activity & Mind Games'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {lang === 'ne' ? 'खेल तथा क्रियाकलाप केन्द्र' : 'Activity & Mind Games Centre'}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm leading-relaxed">
              {lang === 'ne'
                ? 'नेपाली तथा अङ्ग्रेजी अङ्कमा सुडोकू, नेपालको परम्परागत बाघचाल र तार्किक गाउँ खाने कथा खेलेर आफ्नो दिमागलाई ताजा र सक्रिय राख्नुहोस्।'
                : 'Boost cognitive agility and relax with full-featured Sudoku (English & Devanagari numerals), traditional Nepali Bagh-Chal board game against AI, and cultural logic riddles.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-300" />
              <div>
                <div className="text-[10px] text-stone-300 uppercase font-semibold">
                  {lang === 'ne' ? 'सबै उमेरका लागि' : 'Family Friendly'}
                </div>
                <div className="text-sm font-bold text-white">
                  {lang === 'ne' ? 'निःशुल्क खेल' : 'Free Play'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setCurrentTab('sudoku')}
          className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer shrink-0 border ${
            currentTab === 'sudoku'
              ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
              : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
          <span>{lang === 'ne' ? 'सुडोकू (Sudoku)' : 'Sudoku'}</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-md ${
              currentTab === 'sudoku' ? 'bg-amber-400 text-stone-950 font-extrabold' : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
            }`}
          >
            {lang === 'ne' ? 'लोकप्रिय' : 'Popular'}
          </span>
        </button>

        <button
          onClick={() => setCurrentTab('baghchal')}
          className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer shrink-0 border ${
            currentTab === 'baghchal'
              ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
              : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>{lang === 'ne' ? 'बाघचाल (Bagh-Chal)' : 'Bagh-Chal (Tigers & Goats)'}</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-md ${
              currentTab === 'baghchal' ? 'bg-amber-400 text-stone-950 font-extrabold' : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
            }`}
          >
            {lang === 'ne' ? 'परम्परागत' : 'Nepali Game'}
          </span>
        </button>

        <button
          onClick={() => setCurrentTab('brain')}
          className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer shrink-0 border ${
            currentTab === 'brain'
              ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
              : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>{lang === 'ne' ? 'गाउँ खाने कथा तथा पहेली' : 'Riddles & Logic'}</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-md ${
              currentTab === 'brain' ? 'bg-amber-400 text-stone-950 font-extrabold' : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
            }`}
          >
            {lang === 'ne' ? 'दैनिक' : 'Daily'}
          </span>
        </button>
      </div>

      {/* Main Tab Render */}
      <div className="pt-2">
        {currentTab === 'sudoku' && <SudokuGame lang={lang} />}
        {currentTab === 'baghchal' && <BaghChalGame lang={lang} />}
        {currentTab === 'brain' && <BrainTeasers lang={lang} />}
      </div>
    </div>
  );
};
