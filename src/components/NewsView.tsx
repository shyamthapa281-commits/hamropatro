import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Newspaper, 
  Search, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  Share2, 
  ExternalLink, 
  ChevronRight, 
  X, 
  Check, 
  Flame, 
  Globe, 
  Loader2, 
  RefreshCw,
  Radio,
  Zap,
  TrendingUp,
  Filter,
  CheckCircle2,
  Landmark,
  Trophy,
  Cpu,
  Film,
  Layers,
  Flag,
  Tag
} from 'lucide-react';
import { NewsArticle, Language } from '../types';
import { NEWS_CATEGORIES, MOCK_NEWS_ARTICLES } from '../data/mockNews';
import { getLiveNewsArticles } from '../utils/liveNewsClient';
import { toNepaliDigits } from '../utils/nepaliCalendar';

interface NewsViewProps {
  lang: Language;
}

// Accurate category classifier helper for news articles
export const getArticleCategory = (article: NewsArticle): string => {
  if (article.category && article.category !== 'national') {
    return article.category;
  }
  const combined = `${article.titleNe || ''} ${article.titleEn || ''} ${article.summaryNe || ''} ${(article.tags || []).join(' ')}`.toLowerCase();
  if (/क्रिकेट|फुटबल|खेलकुद|खेल|npl|क्यान|खेलाडी|प्रतियोगिता|च्याम्पियन|विश्वकप|मेडल|गोल|रन|विकेट|cricket|football|sports|sport|match|tournament|league/i.test(combined)) {
    return 'sports';
  }
  if (/प्रविधि|मोबाइल|एआई|इन्टरनेट|डिजिटल|कम्प्युटर|एप|साइबर|दूरसञ्चार|टेलिकम|स्याटेलाइट|अन्तरिक्ष|सूचना प्रविधि|technology|tech|digital|cyber|software|ai|smartphone/i.test(combined)) {
    return 'technology';
  }
  if (/राजनीति|राजनीतिक|संसद्|संसद|मन्त्री|प्रधानमन्त्री|निर्वाचन|पार्टी|एमाले|कांग्रेस|माओवादी|रास्वपा|ओली|देउवा|प्रचण्ड|विधेयक|सरकार|मन्त्रिपरिषद्|सभामुख|politics|parliament|election|minister|cabinet/i.test(combined)) {
    return 'politics';
  }
  if (/अर्थतन्त्र|अर्थ|बजार|बजेट|बैंक|नेप्से|शेयर|सुन|चाँदी|डलर|राजस्व|लगानी|वाणिज्य|उद्योग|धितोपत्र|मुद्रा|economy|market|finance|stock|nepse|bank/i.test(combined)) {
    return 'economy';
  }
  if (/चलचित्र|सिनेमा|अभिनेता|अभिनेत्री|गीत|संगीत|कलाकार|गायक|गायिका|नाटक|फेस्टिभल|entertainment|cinema|movie|film|actor|music|song/i.test(combined)) {
    return 'entertainment';
  }
  if (/विश्व|अन्तर्राष्ट्रिय|अमेरिका|भारत|चीन|रुस|युक्रेन|गाजा|इजरायल|world|international|global/i.test(combined)) {
    return 'world';
  }
  return article.category || 'national';
};

export const matchesArticleCategory = (article: NewsArticle, catId: string): boolean => {
  if (catId === 'all') return true;
  if (catId === 'breaking') return !!article.isBreaking;
  const cat = getArticleCategory(article);
  return cat === catId;
};

// Category icon renderer helper
const renderCategoryIcon = (id: string, className = "w-4 h-4") => {
  switch (id) {
    case 'all':
      return <Layers className={className} />;
    case 'politics':
      return <Landmark className={className} />;
    case 'sports':
      return <Trophy className={className} />;
    case 'technology':
      return <Cpu className={className} />;
    case 'economy':
      return <TrendingUp className={className} />;
    case 'national':
      return <Flag className={className} />;
    case 'entertainment':
      return <Film className={className} />;
    case 'world':
      return <Globe className={className} />;
    case 'breaking':
      return <Flame className={className} />;
    default:
      return <Tag className={className} />;
  }
};

export const NewsView: React.FC<NewsViewProps> = ({ lang }) => {
  const [articles, setArticles] = useState<NewsArticle[]>(MOCK_NEWS_ARTICLES);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('भर्खरै');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [articleLang, setArticleLang] = useState<'ne' | 'en'>(lang);
  const [isLiveSearchMode, setIsLiveSearchMode] = useState<boolean>(false);
  const [isSearchingGrounded, setIsSearchingGrounded] = useState<boolean>(false);
  const [groundedQuery, setGroundedQuery] = useState<string>('');
  
  // Bookmarked articles in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hamro_patro_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  // Audio TTS reader state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // AI Summary generation state
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Function to fetch real-time live news from server or direct client RSS
  const fetchLiveNews = useCallback(async (forceRefresh = false) => {
    setIsLoadingLive(true);
    try {
      const data = await getLiveNewsArticles(forceRefresh);
      if (data.articles && data.articles.length > 0) {
        setArticles(data.articles);
        setLastUpdatedTime(new Date().toLocaleTimeString(lang === 'ne' ? 'ne-NP' : 'en-US', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.warn('Live news fetch error, keeping local cached news:', err);
    } finally {
      setIsLoadingLive(false);
    }
  }, [lang]);

  // Initial fetch on mount
  useEffect(() => {
    fetchLiveNews(false);
  }, [fetchLiveNews]);

  // Handle Google Search grounded live query
  const handlePerformGroundedSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingGrounded(true);
    setIsLiveSearchMode(true);
    setGroundedQuery(searchQuery.trim());

    try {
      const response = await fetch('/api/news/live-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery.trim(),
          language: lang,
        }),
      });

      if (!response.ok) throw new Error('Grounded search failed');
      const data = await response.json();
      if (data.articles && data.articles.length > 0) {
        setArticles(data.articles);
        setSelectedCategory('all');
        setSelectedSource('all');
      }
    } catch (err) {
      console.error('Search grounded error:', err);
    } finally {
      setIsSearchingGrounded(false);
    }
  };

  const handleResetToLiveFeed = () => {
    setIsLiveSearchMode(false);
    setGroundedQuery('');
    setSearchQuery('');
    fetchLiveNews(true);
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter((bId) => bId !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('hamro_patro_bookmarks', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Extract unique sources for filter
  const availableSources = Array.from(new Set(articles.map((a) => a.source))).filter(Boolean);

  // Calculate live counts per category for UI tabs
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    NEWS_CATEGORIES.forEach((cat) => {
      if (cat.id === 'all') {
        counts[cat.id] = articles.length;
      } else {
        counts[cat.id] = articles.filter((a) => matchesArticleCategory(a, cat.id)).length;
      }
    });
    return counts;
  }, [articles]);

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = matchesArticleCategory(article, selectedCategory);

    const matchesSource = selectedSource === 'all' || article.source === selectedSource;

    const matchesSearch =
      searchQuery.trim() === '' ||
      isLiveSearchMode || // Already filtered by server if live search mode
      article.titleNe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summaryNe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBookmark = !showBookmarksOnly || bookmarkedIds.includes(article.id);

    return matchesCategory && matchesSource && matchesSearch && matchesBookmark;
  });

  const breakingNews = articles.filter((a) => a.isBreaking);

  // Text-To-Speech playback
  const handleToggleTts = (text: string) => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // AI Summary Handler
  const handleGenerateAiSummary = async (article: NewsArticle) => {
    setIsSummarizing(true);
    setAiSummary(null);

    try {
      const response = await fetch('/api/news/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: articleLang === 'ne' ? article.titleNe : article.titleEn,
          content: articleLang === 'ne' ? article.contentNe : article.contentEn,
          language: articleLang,
        }),
      });

      if (!response.ok) throw new Error('AI summary failed');
      const data = await response.json();
      if (data?.summary) {
        setAiSummary(data.summary);
      } else {
        throw new Error('No summary returned');
      }
    } catch (error) {
      // High-quality extractive key-takeaway summary fallback
      const content = articleLang === 'ne' ? article.contentNe : article.contentEn;
      const title = articleLang === 'ne' ? article.titleNe : article.titleEn;
      const sentences = content
        .split(/[।.\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 20);

      const topPoints = sentences.slice(0, 3);
      if (topPoints.length > 0) {
        const generated = articleLang === 'ne'
          ? `📌 **${title}**\n\n` + topPoints.map(p => `• ${p}।`).join('\n')
          : `📌 **${title}**\n\n` + topPoints.map(p => `• ${p}.`).join('\n');
        setAiSummary(generated);
      } else {
        setAiSummary(
          articleLang === 'ne'
            ? `📌 **${title}**\n\n• ${content.slice(0, 200)}...`
            : `📌 **${title}**\n\n• ${content.slice(0, 200)}...`
        );
      }
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Real-time Live News Status Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-red-950 text-white rounded-3xl p-4 sm:p-5 mb-6 shadow-md border border-stone-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-red-600 px-2 py-0.5 rounded text-white flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                {lang === 'ne' ? 'प्रत्यक्ष लाइभ फिड' : 'LIVE REAL-TIME FEED'}
              </span>
              <span className="text-xs font-semibold text-stone-300">
                {isLiveSearchMode ? (
                  <span className="text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {lang === 'ne' ? `खोज नतिजा: "${groundedQuery}"` : `Live Results: "${groundedQuery}"`}
                  </span>
                ) : (
                  <span>
                    {lang === 'ne' ? `पछिल्लो अपडेट: ${lastUpdatedTime}` : `Updated: ${lastUpdatedTime}`}
                  </span>
                )}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1 hidden sm:block">
              {lang === 'ne'
                ? 'अनलाइनखबर, सेतोपाटी, रातोपाटी, बीबीसी नेपाली, कान्तिपुर तथा गुगल सर्चबाट सत्य र ताजा समाचारहरू'
                : 'Aggregating verified, live headlines directly from major Nepali news networks and Google Search'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLiveSearchMode && (
            <button
              onClick={handleResetToLiveFeed}
              className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'लाइभ फिडमा फर्कनुहोस्' : 'Back to Live Feed'}</span>
            </button>
          )}

          <button
            id="refresh-live-news-btn"
            onClick={() => fetchLiveNews(true)}
            disabled={isLoadingLive}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            title={lang === 'ne' ? 'ताजा समाचार रिफ्रेस गर्नुहोस्' : 'Refresh Real-time News'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
            <span>{isLoadingLive ? (lang === 'ne' ? 'अपडेट हुँदैछ...' : 'Updating...') : (lang === 'ne' ? 'ताजा समाचार रिफ्रेस' : 'Refresh Live News')}</span>
          </button>
        </div>
      </div>

      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-6 flex items-center gap-3 overflow-hidden shadow-xs">
          <span className="bg-red-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
            <Flame className="w-3.5 h-3.5" />
            {lang === 'ne' ? 'मुख्य ब्रेकिङ' : 'Breaking'}
          </span>
          <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-none text-xs font-semibold text-stone-800">
            {breakingNews.map((bn, idx) => (
              <span
                key={bn.id}
                onClick={() => setSelectedArticle(bn)}
                className="cursor-pointer hover:text-red-700 mr-6 inline-flex items-center gap-1.5"
              >
                <span className="font-bold text-red-900">[{bn.source}]</span>
                <span>{lang === 'ne' ? bn.titleNe : bn.titleEn}</span>
                {idx < breakingNews.length - 1 && <span className="text-red-300">•</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Header Search & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-red-700" />
            <span>{lang === 'ne' ? 'ताजा नेपाली समाचार तथा अपडेटहरू' : 'Live Nepali News & Headlines'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {lang === 'ne'
              ? `${articles.length} वटा सत्य र प्रत्यक्ष समाचारहरू उपलब्ध छन्`
              : `${articles.length} verified real-time articles available`}
          </p>
        </div>

        {/* Search form with Live Google Search button */}
        <form onSubmit={handlePerformGroundedSearch} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'ne' ? 'कुनै पनि विषय वा घटना खोज्नुहोस्...' : 'Search any topic or breaking event...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isSearchingGrounded || !searchQuery.trim()}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-40 transition-all cursor-pointer"
            title={lang === 'ne' ? 'गुगल सर्चबाट प्रत्यक्ष खोज्नुहोस्' : 'Search live web with Google Search'}
          >
            {isSearchingGrounded ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{lang === 'ne' ? 'लाइभ खोज्नुहोस्' : 'Live Search'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              showBookmarksOnly
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-stone-950' : ''}`} />
            <span className="hidden sm:inline">{lang === 'ne' ? 'बचत' : 'Saved'}</span>
            {bookmarkedIds.length > 0 && (
              <span className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 text-[10px] px-1.5 py-0.2 rounded-full">
                {bookmarkedIds.length}
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Dedicated News Category Tabs Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-3 shadow-xs mb-5 transition-colors">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-red-700 dark:text-red-400" />
              {lang === 'ne' ? 'समाचार विधा / श्रेणी:' : 'Category Filter:'}
            </span>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'सबै श्रेणी देखाउनुहोस्' : 'Show All Categories'}</span>
            </button>
          )}
        </div>

        {/* Categories Tabs Scroll Container */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none py-1">
          {NEWS_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] ?? 0;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`news-cat-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-red-700 text-white shadow-sm ring-2 ring-red-700/20'
                    : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-200/60 dark:border-stone-700/60'
                }`}
                title={lang === 'ne' ? `${cat.nameNe} (${toNepaliDigits(count)})` : `${cat.nameEn} (${count})`}
              >
                <span className={isSelected ? 'text-white' : 'text-stone-500 dark:text-stone-400 group-hover:text-red-700 dark:group-hover:text-amber-300'}>
                  {renderCategoryIcon(cat.id, 'w-3.5 h-3.5')}
                </span>
                <span>{lang === 'ne' ? cat.nameNe : cat.nameEn}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                    isSelected
                      ? 'bg-red-800/90 text-white'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 group-hover:bg-red-100 group-hover:text-red-800 dark:group-hover:bg-stone-600'
                  }`}
                >
                  {lang === 'ne' ? toNepaliDigits(count) : count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Source Pills Filter Row */}
        {availableSources.length > 1 && (
          <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs text-stone-500 dark:text-stone-400 scrollbar-none px-1">
            <span className="font-bold text-stone-600 dark:text-stone-300 shrink-0 flex items-center gap-1 text-[11px]">
              {lang === 'ne' ? 'समाचार स्रोत:' : 'Source:'}
            </span>
            <button
              onClick={() => setSelectedSource('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSource === 'all'
                  ? 'bg-stone-900 dark:bg-red-700 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {lang === 'ne' ? 'सबै स्रोत' : 'All Sources'}
            </button>
            {availableSources.map((source) => (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSource === source
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current Filter Context Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            {selectedCategory === 'all' ? (
              lang === 'ne' ? 'सबै ताजा समाचारहरू' : 'All Recent News Headlines'
            ) : (
              <span className="flex items-center gap-1.5">
                {renderCategoryIcon(selectedCategory, 'w-4 h-4 text-red-700 dark:text-red-400')}
                <span>
                  {lang === 'ne'
                    ? `${NEWS_CATEGORIES.find((c) => c.id === selectedCategory)?.nameNe || selectedCategory} समाचार`
                    : `${NEWS_CATEGORIES.find((c) => c.id === selectedCategory)?.nameEn || selectedCategory} News`}
                </span>
              </span>
            )}
          </span>
          <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded-full text-xs font-bold">
            {lang === 'ne'
              ? `${toNepaliDigits(filteredArticles.length)} समाचार फेला परे`
              : `${filteredArticles.length} articles found`}
          </span>
          {selectedSource !== 'all' && (
            <span className="bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900 px-2 py-0.5 rounded-full text-xs font-semibold">
              {lang === 'ne' ? `स्रोत: ${selectedSource}` : `Source: ${selectedSource}`}
            </span>
          )}
        </div>

        {(selectedCategory !== 'all' || selectedSource !== 'all' || searchQuery.trim()) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSource('all');
              setSearchQuery('');
            }}
            className="text-xs text-stone-500 hover:text-red-700 dark:text-stone-400 dark:hover:text-red-400 font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{lang === 'ne' ? 'फिल्टर रिसेट' : 'Reset Filters'}</span>
          </button>
        )}
      </div>

      {/* News Articles Grid */}
      {isLoadingLive && articles.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-16 text-center border border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
          <h4 className="text-base font-bold text-stone-800 dark:text-stone-200">
            {lang === 'ne' ? 'ताजा समाचारहरू लोड हुँदैछन्...' : 'Fetching live real-time headlines...'}
          </h4>
          <p className="text-xs text-stone-400 mt-1">
            {lang === 'ne' ? 'नेपाली समाचार पोर्टलहरूबाट प्रत्यक्ष फिड संकलन गरिँदैछ' : 'Aggregating authentic feeds from Nepali news networks'}
          </p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400">
          <Newspaper className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
          <h4 className="text-base font-bold text-stone-800 dark:text-stone-200 mb-1">
            {lang === 'ne' ? 'कुनै समाचार भेटिएन' : 'No news articles found'}
          </h4>
          <p className="text-xs text-stone-400 dark:text-stone-500 mb-4">
            {lang === 'ne' ? 'कृपया खोज शब्द वा वर्ग परिवर्तन गर्नुहोस्।' : 'Try changing your search terms or category.'}
          </p>
          <button
            onClick={handleResetToLiveFeed}
            className="px-4 py-2 bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'ne' ? 'सबै ताजा समाचार देखाउनुहोस्' : 'Show All Live News'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const isBookmarked = bookmarkedIds.includes(article.id);
            return (
              <div
                key={article.id}
                id={`article-card-${article.id}`}
                onClick={() => {
                  setSelectedArticle(article);
                  setAiSummary(null);
                  setIsPlayingAudio(false);
                }}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-red-300 dark:hover:border-stone-700 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Top Metadata Header: Source, Category, Time, Bookmark */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-red-50 dark:bg-red-950/70 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900 font-extrabold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                        {article.source}
                      </span>
                      {(() => {
                        const artCat = getArticleCategory(article);
                        const catData = NEWS_CATEGORIES.find((c) => c.id === artCat);
                        return (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(artCat);
                            }}
                            className="bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-200/80 dark:border-stone-700 font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                            title={lang === 'ne' ? `${catData?.nameNe || artCat} विधा फिल्टर गर्नुहोस्` : `Filter by ${catData?.nameEn || artCat}`}
                          >
                            <span className="text-red-700 dark:text-red-400">{renderCategoryIcon(artCat, 'w-3 h-3')}</span>
                            <span>{lang === 'ne' ? (catData?.nameNe || artCat) : (catData?.nameEn || artCat)}</span>
                          </button>
                        );
                      })()}
                      {article.isBreaking && (
                        <span className="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {lang === 'ne' ? 'मुख्य' : 'Breaking'}
                        </span>
                      )}
                      <span className="text-stone-400 dark:text-stone-500 text-xs flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {article.publishedAt}
                      </span>
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(article.id, e)}
                      className="w-8 h-8 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title={isBookmarked ? 'हटाउनुहोस्' : 'बचत गर्नुहोस्'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isBookmarked ? 'fill-red-600 text-red-600' : 'text-stone-400 dark:text-stone-500'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Headline Title */}
                  <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base sm:text-lg leading-snug group-hover:text-red-700 dark:group-hover:text-amber-400 transition-colors mb-2.5">
                    {lang === 'ne' ? article.titleNe : article.titleEn}
                  </h3>

                  {/* Summary lead */}
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3 mb-4">
                    {lang === 'ne' ? article.summaryNe : article.summaryEn}
                  </p>
                </div>

                {/* Card Footer with Direct Source Link & Details */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 text-xs">
                  {/* Direct Link to Original News Source */}
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-stone-700 dark:text-stone-300 hover:text-red-700 dark:hover:text-red-400 border border-stone-200 dark:border-stone-700 hover:border-red-200 dark:hover:border-red-900 rounded-xl font-bold transition-colors cursor-pointer text-xs"
                    title={`${article.source} मूल लिङ्क खोल्नुहोस्`}
                  >
                    <span>{article.source} स्रोत लिङ्क</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <span className="text-red-700 dark:text-red-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    {lang === 'ne' ? 'पुरा पढ्नुहोस्' : 'Read details'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col transition-colors">
            {/* Modal Header Bar */}
            <div className="sticky top-0 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-4 px-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  {selectedArticle.source}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400">{selectedArticle.publishedAt}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Switch */}
                <button
                  onClick={() => setArticleLang(articleLang === 'ne' ? 'en' : 'ne')}
                  className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{articleLang === 'ne' ? 'English' : 'नेपाली'}</span>
                </button>

                {/* TTS Reader */}
                <button
                  onClick={() =>
                    handleToggleTts(
                      articleLang === 'ne' ? selectedArticle.contentNe : selectedArticle.contentEn
                    )
                  }
                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-500 text-stone-950 animate-pulse'
                      : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                  title="सुन्नुहोस् (Listen)"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={() => toggleBookmark(selectedArticle.id)}
                  className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg text-stone-700 dark:text-stone-300 cursor-pointer"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      bookmarkedIds.includes(selectedArticle.id) ? 'fill-red-600 text-red-600' : ''
                    }`}
                  />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    window.speechSynthesis.cancel();
                    setIsPlayingAudio(false);
                  }}
                  className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Content - Text Only (No Images) */}
            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white leading-tight">
                {articleLang === 'ne' ? selectedArticle.titleNe : selectedArticle.titleEn}
              </h2>

              {/* Direct Source Link Banner with Category */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-stone-700 dark:text-stone-300">स्रोत:</span>
                  <span className="font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-900 px-2.5 py-1 rounded-lg">
                    {selectedArticle.source}
                  </span>
                  {(() => {
                    const artCat = getArticleCategory(selectedArticle);
                    const catData = NEWS_CATEGORIES.find((c) => c.id === artCat);
                    return (
                      <span className="bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
                        <span className="text-red-700 dark:text-red-400">{renderCategoryIcon(artCat, 'w-3.5 h-3.5')}</span>
                        <span>{lang === 'ne' ? (catData?.nameNe || artCat) : (catData?.nameEn || artCat)}</span>
                      </span>
                    );
                  })()}
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedArticle.publishedAt}
                  </span>
                </div>

                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  <span>{selectedArticle.source} मूल समाचार हेर्नुहोस्</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* AI News Summarizer Action Box */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    {lang === 'ne' ? 'हाम्रो AI समाचार विश्लेषण र सारांश' : 'AI Analysis & Executive Summary'}
                  </span>
                  <button
                    id="generate-ai-news-summary-btn"
                    onClick={() => handleGenerateAiSummary(selectedArticle)}
                    disabled={isSummarizing}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isSummarizing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{lang === 'ne' ? 'विश्लेषण गरिँदै...' : 'Analyzing...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{lang === 'ne' ? '३ बुँदामा सारांश' : 'Generate 3-Bullet Summary'}</span>
                      </>
                    )}
                  </button>
                </div>

                {aiSummary && (
                  <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/60 text-xs text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed">
                    {aiSummary}
                  </div>
                )}
              </div>

              {/* Main Full Article Text */}
              <div className="text-stone-800 dark:text-stone-200 text-base sm:text-lg leading-relaxed space-y-4">
                <p>{articleLang === 'ne' ? selectedArticle.contentNe : selectedArticle.contentEn}</p>
              </div>

              {/* Source & Share bar */}
              <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-500 dark:text-stone-400">
                    {lang === 'ne' ? 'मूल समाचार स्रोत:' : 'Original Source:'}
                  </span>
                  <a
                    href={selectedArticle.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 hover:bg-red-100 dark:hover:bg-red-950/80 transition-colors"
                  >
                    <span>{selectedArticle.source} मा हेर्नुहोस्</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (lang === 'ne' ? 'लिङ्क कपी गरियो' : 'Link Copied') : (lang === 'ne' ? 'सेयर गर्नुहोस्' : 'Share')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
