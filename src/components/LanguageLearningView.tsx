import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Languages, 
  ArrowRight, 
  Search, 
  Layers,
  ChevronRight,
  Globe
} from 'lucide-react';
import { Language } from '../types';
import { 
  PHRASES_DATA, 
  PHRASE_CATEGORIES, 
  VOCABULARY_LIST, 
  GRAMMAR_LESSONS, 
  QUIZ_QUESTIONS, 
  PhraseItem, 
  VocabularyCard 
} from '../data/languageData';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import { InstantTranslator } from './InstantTranslator';

interface LanguageLearningViewProps {
  lang: Language;
}

export const LanguageLearningView: React.FC<LanguageLearningViewProps> = ({ lang }) => {
  const [activeSubTab, setActiveSubTab] = useState<'translator' | 'phrases' | 'vocab' | 'grammar' | 'quiz'>('translator');
  const [phraseCategory, setPhraseCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Flashcard state
  const [vocabIndex, setVocabIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Audio Speech Synthesis
  const speakText = (text: string, voiceLang: 'ne' | 'en' = 'ne') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang === 'ne' ? 'ne-NP' : 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Filtered phrases
  const filteredPhrases = PHRASES_DATA.filter((p) => {
    const matchesCategory = phraseCategory === 'all' || p.category === phraseCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.nepali.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.roman.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Quiz handler
  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === QUIZ_QUESTIONS[currentQuizIndex].correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-800 via-stone-900 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8 border border-red-700/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/50 rounded-full border border-red-400/40 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5" />
              {lang === 'ne' ? 'गुगल अनुवाद तथा नेपाली-अंग्रेजी भाषा सिकाई' : 'Google Translate & Language Learning Hub'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {lang === 'ne' ? 'नेपाली-अंग्रेजी अनुवाद तथा भाषा सिकाई केन्द्र' : 'Nepali - English Google Translate & Learning'}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl">
              {lang === 'ne'
                ? 'गुगल ट्रान्सलेट (Google Translate) मार्फत द्रुत अनुवाद, दैनिक उपयोगी वाक्यांशहरू, शब्दावली फ्ल्यासकार्ड, र व्याकरण पाठहरू।'
                : 'Direct Google Translate engine with practical daily phrases, vocabulary flashcards, grammar guides, and interactive quizzes.'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-stone-200">
        {[
          { id: 'translator', nameNe: 'गुगल अनुवाद (Google Translate)', nameEn: 'Google Translate', icon: Globe },
          { id: 'phrases', nameNe: 'दैनिक वाक्यांश (Phrases)', nameEn: 'Daily Phrases', icon: BookOpen },
          { id: 'vocab', nameNe: 'शब्दावली (Vocabulary)', nameEn: 'Flashcards', icon: Layers },
          { id: 'grammar', nameNe: 'व्याकरण नियम (Grammar)', nameEn: 'Grammar Guide', icon: HelpCircle },
          { id: 'quiz', nameNe: 'सिकाई क्विज (Quiz)', nameEn: 'Practice Quiz', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-red-700 text-white shadow-xs ring-1 ring-red-800'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
              <span>{lang === 'ne' ? tab.nameNe : tab.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 0: Dedicated Instant Google Translator */}
      {activeSubTab === 'translator' && (
        <InstantTranslator lang={lang} />
      )}

      {/* Tab 1: Practical Phrases */}
      {activeSubTab === 'phrases' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'ne' ? 'वाक्यांश वा शब्द खोज्नुहोस्...' : 'Search phrases or keywords...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
              {PHRASE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setPhraseCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    phraseCategory === cat.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {lang === 'ne' ? cat.nameNe : cat.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* Phrases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPhrases.map((phrase) => (
              <div
                key={phrase.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100">
                      {phrase.category.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-400">
                      {phrase.formal === 'honorific' ? 'उच्च आदरार्थी' : phrase.formal === 'polite' ? 'शिष्ट' : 'अनौपचारिक'}
                    </span>
                  </div>

                  {/* Nepali Phrase */}
                  <div className="text-lg font-bold text-stone-900 mb-1 flex items-start justify-between gap-2">
                    <span>{phrase.nepali}</span>
                    <button
                      onClick={() => speakText(phrase.nepali, 'ne')}
                      className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                      title="उच्चारण सुन्नुहोस्"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Romanized Phonetics */}
                  <div className="text-xs text-amber-800 font-medium italic mb-2">
                    {phrase.roman}
                  </div>

                  {/* English Translation */}
                  <div className="text-xs font-semibold text-stone-600 border-t border-stone-100 pt-2 flex items-center justify-between">
                    <span>{phrase.english}</span>
                    <button
                      onClick={() => speakText(phrase.english, 'en')}
                      className="p-1 text-stone-300 hover:text-blue-700 transition-colors shrink-0 cursor-pointer"
                      title="Listen English audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {phrase.context && (
                  <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] text-stone-400 italic">
                    💡 {phrase.context}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Vocabulary Flashcards */}
      {activeSubTab === 'vocab' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">
              {lang === 'ne' ? 'शब्दावली कार्ड:' : 'Card:'} {vocabIndex + 1} / {VOCABULARY_LIST.length}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
              {VOCABULARY_LIST[vocabIndex].category}
            </span>
          </div>

          {/* Flashcard container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-80 bg-white rounded-3xl border-2 border-stone-200 hover:border-red-300 shadow-md p-8 flex flex-col justify-between items-center text-center cursor-pointer select-none transition-all hover:shadow-lg relative overflow-hidden"
          >
            <div className="w-full flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-stone-400">
                {isFlipped ? (lang === 'ne' ? 'अंग्रेजी अनुवाद (English)' : 'English') : (lang === 'ne' ? 'नेपाली शब्द (Nepali)' : 'Nepali')}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {VOCABULARY_LIST[vocabIndex].partOfSpeech}
              </span>
            </div>

            {/* Card Content */}
            {!isFlipped ? (
              <div className="space-y-2">
                <div className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                  {VOCABULARY_LIST[vocabIndex].nepali}
                </div>
                <div className="text-sm font-semibold text-amber-800 italic">
                  {VOCABULARY_LIST[vocabIndex].roman}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(VOCABULARY_LIST[vocabIndex].nepali, 'ne');
                  }}
                  className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors inline-block mt-2"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-900">
                  {VOCABULARY_LIST[vocabIndex].english}
                </div>
                <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 border border-stone-200 text-left max-w-sm">
                  <div className="font-bold text-stone-800 mb-1">{VOCABULARY_LIST[vocabIndex].exampleNe}</div>
                  <div className="text-stone-500 italic">{VOCABULARY_LIST[vocabIndex].exampleEn}</div>
                </div>
              </div>
            )}

            <div className="text-[11px] font-bold text-stone-400 flex items-center gap-1">
              <span>{lang === 'ne' ? 'अर्थ हेर्न कार्डमा थिच्नुहोस् (Tap to flip)' : 'Tap anywhere to flip card'}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => {
                setIsFlipped(false);
                setVocabIndex((prev) => (prev > 0 ? prev - 1 : VOCABULARY_LIST.length - 1));
              }}
              className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              ← {lang === 'ne' ? 'अघिल्लो शब्द' : 'Previous'}
            </button>
            <button
              onClick={() => {
                setIsFlipped(false);
                setVocabIndex((prev) => (prev + 1 < VOCABULARY_LIST.length ? prev + 1 : 0));
              }}
              className="flex-1 py-3 bg-red-700 hover:bg-red-800 text-white rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {lang === 'ne' ? 'अर्को शब्द' : 'Next Word'} →
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Grammar Lessons */}
      {activeSubTab === 'grammar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GRAMMAR_LESSONS.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="text-base font-extrabold text-stone-900">
                    {lang === 'ne' ? lesson.titleNe : lesson.titleEn}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100">
                    व्याकरण
                  </span>
                </div>

                <p className="text-xs text-stone-600 font-medium">
                  {lang === 'ne' ? lesson.summaryNe : lesson.summaryEn}
                </p>

                <div className="space-y-3">
                  {lesson.rules.map((rule, idx) => (
                    <div key={idx} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                      <div className="text-xs font-extrabold text-stone-900">{rule.heading}</div>
                      <div className="text-xs text-stone-600">{rule.description}</div>
                      <div className="divide-y divide-stone-200 pt-1">
                        {rule.examples.map((ex, eIdx) => (
                          <div key={eIdx} className="pt-1.5 pb-1 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-stone-900">{ex.ne}</span>{' '}
                              <span className="text-[11px] text-amber-800 italic">({ex.roman})</span>
                              <span className="block text-[11px] text-stone-500">{ex.en}</span>
                            </div>
                            <button
                              onClick={() => speakText(ex.ne, 'ne')}
                              className="p-1 text-stone-400 hover:text-red-700 transition-colors"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Quiz */}
      {activeSubTab === 'quiz' && (
        <div className="max-w-xl mx-auto space-y-6">
          {!quizCompleted ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              {/* Quiz progress */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-500">
                  {lang === 'ne' ? 'प्रश्न' : 'Question'} {currentQuizIndex + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs font-extrabold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  {lang === 'ne' ? `अंक: ${toNepaliDigits(quizScore)}` : `Score: ${quizScore}`}
                </span>
              </div>

              {/* Question Text */}
              <div className="text-base sm:text-lg font-extrabold text-stone-900 leading-snug">
                {QUIZ_QUESTIONS[currentQuizIndex].question}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  const isCorrect = oIdx === QUIZ_QUESTIONS[currentQuizIndex].correctIndex;
                  let btnStyle = 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-red-50 border-red-600 text-red-900 font-bold';
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleOptionSelect(oIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown upon submission) */}
              {isAnswerSubmitted && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1 animate-fadeIn">
                  <span className="font-bold text-stone-900 block">💡 {lang === 'ne' ? 'स्पष्टीकरण:' : 'Explanation:'}</span>
                  <p>{QUIZ_QUESTIONS[currentQuizIndex].explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="w-full py-3 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {lang === 'ne' ? 'उत्तर पेश गर्नुहोस्' : 'Submit Answer'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 bg-stone-900 hover:bg-black text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{currentQuizIndex + 1 < QUIZ_QUESTIONS.length ? (lang === 'ne' ? 'अर्को प्रश्न' : 'Next Question') : (lang === 'ne' ? 'नतिजा हेर्नुहोस्' : 'View Results')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-stone-900">
                  {lang === 'ne' ? 'बधाई छ! क्विज सम्पन्न भयो' : 'Congratulations! Quiz Completed'}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {lang === 'ne' ? 'तपाईंले प्राप्त गर्नुभएको अंक:' : 'Your Total Score:'}
                </p>
              </div>

              <div className="text-4xl font-extrabold text-red-700">
                {lang === 'ne' ? `${toNepaliDigits(quizScore)} / ${toNepaliDigits(QUIZ_QUESTIONS.length)}` : `${quizScore} / ${QUIZ_QUESTIONS.length}`}
              </div>

              <p className="text-xs font-medium text-stone-600">
                {quizScore >= QUIZ_QUESTIONS.length * 0.8
                  ? lang === 'ne' ? 'उत्कृष्ट! तपाईंको भाषा ज्ञान धेरै राम्रो छ।' : 'Excellent! Your Nepali comprehension is outstanding.'
                  : quizScore >= QUIZ_QUESTIONS.length * 0.5
                  ? lang === 'ne' ? 'राम्रो प्रयास! अझै अभ्यास गर्दै जानुहोस्।' : 'Good job! Keep practicing daily.'
                  : lang === 'ne' ? 'पुन: अभ्यास गर्नुहोस् र नयाँ शब्दहरू सिक्नुहोस्।' : 'Review the phrases and vocabulary and try again!'}
              </p>

              <button
                onClick={resetQuiz}
                className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'ne' ? 'पुन: सुरु गर्नुहोस्' : 'Retake Quiz'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
