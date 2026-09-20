import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { Language } from '../../types';
import { BrainRiddle } from '../../types/games';
import { toNepaliDigits } from '../../utils/nepaliCalendar';

interface BrainTeasersProps {
  lang: Language;
}

const RIDDLES_DATA: BrainRiddle[] = [
  {
    id: 'r1',
    category: 'nepali',
    titleNe: 'गाउँ खाने कथा - रहस्यमय वस्तु',
    titleEn: 'Traditional Nepali Gaun Khane Katha',
    questionNe: 'आकाशबाट झर्‍यो बाटुलो, खान खोज्दा केही छैन स्वादिलो, पानी परे छाता हुन्छ, घाम लागे हराउँछ। त्यो के हो?',
    questionEn: 'It drops round from above; has no taste to eat; shields like an umbrella when it rains, and disappears under the sun. What is it?',
    optionsNe: ['छायाँ (Shadow)', 'पानीको फोका (Water bubble)', 'कुहिरो (Fog)', 'चन्द्रमा (Moon)'],
    optionsEn: ['Shadow', 'Water bubble', 'Fog', 'Moon'],
    correctIndex: 1,
    explanationNe: 'पानीको थोपा वा फोका पानी पर्दा छाता जस्तै बन्छ तर घाम लागेपछि सुकेर हराउँछ।',
    explanationEn: 'A water bubble forms round when rain drops hit the surface, shielding momentarily, and evaporates under sunshine.',
    difficulty: 'easy',
  },
  {
    id: 'r2',
    category: 'math',
    titleNe: 'तार्किक गणित शृङ्खला',
    titleEn: 'Logical Number Series',
    questionNe: 'क्रम हेर्नुहोस्: ३, ५, ९, १७, ३३, ? अर्को सङ्ख्या के हुन्छ?',
    questionEn: 'Observe the sequence: 3, 5, 9, 17, 33, ? What is the next number?',
    optionsNe: ['६५ (65)', '४९ (49)', '६४ (64)', '५५ (55)'],
    optionsEn: ['65', '49', '64', '55'],
    correctIndex: 0,
    explanationNe: 'प्रत्येक पदमा अघिल्लो फरकको दोब्बर जोडिँदै जान्छ: +२, +४, +८, +१६, +३२। ३३ + ३२ = ६५।',
    explanationEn: 'The difference doubles each step: +2, +4, +8, +16, +32. Therefore, 33 + 32 = 65.',
    difficulty: 'medium',
  },
  {
    id: 'r3',
    category: 'nepali',
    titleNe: 'गाउँ खाने कथा - रुख र पात',
    titleEn: 'Traditional Nepali Riddle',
    questionNe: 'कालो रुखमा सेतो पात, हातले टिप्छ मुखले खान्छ। के हो?',
    questionEn: 'White leaves on a black tree, plucked by hand and eaten by mouth. What is it?',
    optionsNe: ['किताब र अक्षर (Book & letters)', 'मकै र पोलेको दाना (Maize)', 'तारा र आकाश (Stars)', 'कागतीको रुख (Lemon tree)'],
    optionsEn: ['Book & letters (reading)', 'Roasted maize', 'Night sky and stars', 'Lemon tree'],
    correctIndex: 0,
    explanationNe: 'कालो पाटी वा किताबमा लेखिएका सेता अक्षरहरू जसलाई आँखा र हातले समातेर मुखले पढिन्छ।',
    explanationEn: 'Letters and words on a book/board: picked by sight/hand and spoken/read aloud through the mouth.',
    difficulty: 'easy',
  },
  {
    id: 'r4',
    category: 'logic',
    titleNe: 'पुल र नदीको तार्किक प्रश्न',
    titleEn: 'River Crossing Logic Puzzle',
    questionNe: 'एकजना किसानसँग एउटा बाघ, एउटा बाख्रा र घाँसको भारी छ। सानो डुङ्गामा किसानसँगै एक पटकमा एउटा मात्र लैजान मिल्छ। बाघले बाख्रा नखाओस् र बाख्राले घाँस नखाओस् भनी नदी कसरी तार्ने?',
    questionEn: 'A farmer has a tiger, a goat, and bundle of grass. His boat carries only himself and one item. How does he cross without the tiger eating the goat, or the goat eating the grass?',
    optionsNe: [
      'पहिले बाख्रा लैजाने, फर्केर घाँस लैजाने र बाख्रा फिर्ता ल्याउने',
      'पहिले बाघ लैजाने, पछि घाँस लैजाने',
      'पहिले घाँस लैजाने र पछि बाघ लैजाने',
      'बाघ र बाख्रालाई सँगै बाँधेर लैजाने',
    ],
    optionsEn: [
      'First take goat across, return, take grass across and bring goat back, take tiger across, return for goat',
      'First take tiger across, then take grass across',
      'First take grass across, then tiger',
      'Tie tiger and goat together',
    ],
    correctIndex: 0,
    explanationNe: '१. पहिले बाख्रा पार लैजाने (बाघ र घाँस एक्लै सुरक्षित)। २. किसान फर्किएर घाँस लैजाने, तर फर्किँदा बाख्रा फिर्ता ल्याउने। ३. बाख्रा राखेर बाघ लैजाने। ४. अन्त्यमा फर्किएर बाख्रा ल्याउने।',
    explanationEn: '1. Take goat across first. 2. Return and take grass, but bring goat back. 3. Leave goat and take tiger. 4. Return to bring goat across.',
    difficulty: 'hard',
  },
  {
    id: 'r5',
    category: 'math',
    titleNe: 'द्रुत मानसिक गणित पहेली',
    titleEn: 'Mental Math Clock Puzzle',
    questionNe: 'एउटा घडीमा ठीक ३ बजेको छ। घडीको घण्टा सुई र मिनेट सुईको बीचमा कति डिग्रीको कोण बन्दछ?',
    questionEn: 'A clock shows exactly 3:00. What is the angle between the hour hand and the minute hand?',
    optionsNe: ['९०° (90 degrees)', '६०° (60 degrees)', '१२०° (120 degrees)', '४५° (45 degrees)'],
    optionsEn: ['90°', '60°', '120°', '45°'],
    correctIndex: 0,
    explanationNe: 'घडीको पूरै चक्र ३६०° हुन्छ (१२ घण्टा = प्रति घण्टा ३०°)। ३ बजे ३ x ३०° = ९०° को समकोण बन्दछ।',
    explanationEn: 'A full clock circle is 360° across 12 hours (30° per hour). At 3:00, 3 × 30° = 90° (a right angle).',
    difficulty: 'easy',
  },
];

export const BrainTeasers: React.FC<BrainTeasersProps> = ({ lang }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentRiddle = RIDDLES_DATA[currentIndex];
  const isAnswered = selectedAnswers[currentRiddle.id] !== undefined;
  const userAnswer = selectedAnswers[currentRiddle.id];
  const isCorrect = userAnswer === currentRiddle.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentRiddle.id]: idx,
    }));

    if (idx === currentRiddle.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setShowHint(false);
    if (currentIndex < RIDDLES_DATA.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setScore(0);
    setCurrentIndex(0);
    setShowHint(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col space-y-4">
      {/* Top Header */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
              {lang === 'ne' ? 'दैनिक बौद्धिक पहेली तथा गाउँ खाने कथा' : 'Daily Brain Teasers & Riddles'}
            </h3>
            <p className="text-xs text-stone-500">
              {lang === 'ne'
                ? `प्रश्न: ${toNepaliDigits(currentIndex + 1)} / ${toNepaliDigits(RIDDLES_DATA.length)}`
                : `Question: ${currentIndex + 1} of ${RIDDLES_DATA.length}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold">
            {lang === 'ne' ? `अंक: ${toNepaliDigits(score)}` : `Score: ${score}`}
          </div>
          <button
            onClick={handleReset}
            className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 rounded-xl cursor-pointer"
            title="Reset Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Riddle Card */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
            {lang === 'ne' ? currentRiddle.titleNe : currentRiddle.titleEn}
          </span>
          <span className="text-[11px] font-semibold text-stone-400 capitalize">
            {currentRiddle.difficulty}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white leading-relaxed">
          {lang === 'ne' ? currentRiddle.questionNe : currentRiddle.questionEn}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {(lang === 'ne' ? currentRiddle.optionsNe : currentRiddle.optionsEn).map((opt, idx) => {
            let btnClass = 'bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700';

            if (isAnswered) {
              if (idx === currentRiddle.correctIndex) {
                btnClass = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-400 font-bold ring-2 ring-emerald-400';
              } else if (idx === userAnswer) {
                btnClass = 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-200 border-red-400 font-bold';
              } else {
                btnClass = 'opacity-50 border-stone-200 dark:border-stone-800';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all active:scale-98 flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${btnClass}`}
              >
                <span className="w-6 h-6 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {lang === 'ne' ? ['क', 'ख', 'ग', 'घ'][idx] : ['A', 'B', 'C', 'D'][idx]}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-1 ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-900 dark:text-emerald-200'
                : 'bg-red-50 dark:bg-red-950/40 border-red-200 text-red-900 dark:text-red-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'ne' ? 'सटीक उत्तर! धेरै राम्रो!' : 'Correct Answer! Well done!'}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>{lang === 'ne' ? 'गलत भयो।' : 'Not quite right.'}</span>
                </>
              )}
            </div>
            <p className="text-stone-600 dark:text-stone-300 pt-1 leading-relaxed">
              <span className="font-bold">{lang === 'ne' ? 'व्याख्या:' : 'Explanation:'} </span>
              {lang === 'ne' ? currentRiddle.explanationNe : currentRiddle.explanationEn}
            </p>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? (lang === 'ne' ? 'संकेत लुकाउनुहोस्' : 'Hide Hint') : (lang === 'ne' ? 'संकेत हेर्नुहोस्' : 'Need a hint?')}</span>
          </button>

          {isAnswered && (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs"
            >
              <span>{currentIndex < RIDDLES_DATA.length - 1 ? (lang === 'ne' ? 'अर्को प्रश्न' : 'Next Question') : (lang === 'ne' ? 'पुन: सुरु गर्नुहोस्' : 'Restart')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hint Box */}
        {showHint && !isAnswered && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {lang === 'ne'
                ? 'ध्यान दिएर प्रश्नका शब्दहरू र यसको व्यवहारिक प्रकृति विश्लेषण गर्नुहोस्।'
                : 'Analyze the literal nature and logical transitions described in the riddle.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
