import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  Search, 
  Tag, 
  Sparkles,
  HelpCircle,
  BookmarkCheck,
  ChevronDown,
  Globe
} from 'lucide-react';
import { EDITORIAL_ARTICLES, EditorialArticle } from '../data/editorialArticlesData';
import { Language } from '../types';

interface EditorialHubViewProps {
  lang: Language;
  onNavigate?: (tab: string) => void;
  initialArticleId?: string;
}

export const EditorialHubView: React.FC<EditorialHubViewProps> = ({ lang, onNavigate, initialArticleId }) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(initialArticleId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [articleLang, setArticleLang] = useState<Language>(lang);

  // Sync articleLang when parent lang changes
  useEffect(() => {
    setArticleLang(lang);
  }, [lang]);

  const selectedArticle = EDITORIAL_ARTICLES.find(a => a.id === selectedArticleId);

  // Categories list
  const categories = [
    { id: 'all', labelEn: 'All Guides & Articles', labelNe: 'सबै लेख तथा मार्गनिर्देशन' },
    { id: 'Calendar & Astronomy', labelEn: 'Calendar & Astronomy', labelNe: 'क्यालेन्डर र खगोल' },
    { id: 'Vedic Astronomy', labelEn: 'Vedic Astronomy', labelNe: 'वैदिक खगोल' },
    { id: 'Culture & Festivals', labelEn: 'Culture & Festivals', labelNe: 'संस्कृति र चाडपर्व' },
    { id: 'Astrology & Kundali', labelEn: 'Astrology & Kundali', labelNe: 'ज्योतिष र कुण्डली' },
    { id: 'Health & Ayurveda', labelEn: 'Health & Ayurveda', labelNe: 'स्वास्थ्य र आयुर्वेद' },
    { id: 'Rituals & Timing', labelEn: 'Rituals & Timing', labelNe: 'संस्कार र साइत' },
  ];

  const filteredArticles = EDITORIAL_ARTICLES.filter(art => {
    const matchesCategory = selectedCategory === 'all' || art.categoryEn === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesQuery = 
      art.titleEn.toLowerCase().includes(query) ||
      art.titleNe.toLowerCase().includes(query) ||
      art.excerptEn.toLowerCase().includes(query) ||
      art.excerptNe.toLowerCase().includes(query) ||
      art.tagsEn.some(t => t.toLowerCase().includes(query)) ||
      art.tagsNe.some(t => t.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  const handleCopyShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.origin + (selectedArticle ? `?article=${selectedArticle.slug}` : '');
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* View Header */}
      <div className="bg-gradient-to-r from-amber-900/40 via-stone-900 to-sky-950/40 border border-stone-700/80 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ne' ? 'सांस्कृतिक एवं खगोलीय ज्ञान केन्द्र' : 'Cultural & Astronomical Knowledge Hub'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            {lang === 'ne' 
              ? 'नेपाली क्यालेन्डर, वैदिक खगोल र संस्कृतिका आधिकारिक लेखहरू' 
              : 'Authentic Nepali Calendar, Vedic Astronomy & Cultural Editorial Hub'}
          </h1>
          <p className="text-sm text-stone-300 leading-relaxed">
            {lang === 'ne'
              ? 'बिक्रम संवत्, पञ्चाङ्गका पाँच अङ्ग, चाडपर्वको रहस्य, ३६ गुण मिलान, र आयुर्वेदिक ऋतुचर्या सम्बन्धी तथ्यपरक, गहन र प्रमाणिक अनुसन्धानात्मक सामग्रीहरू।'
              : 'Explore scholarly, authentic, and research-backed guides on Bikram Sambat astronomy, Panchanga computation, Nepali grand festivals, Vedic astrology, and Ayurvedic seasonal living.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ne' ? '६+ विस्तृत शोध लेखहरू' : '6+ Scholarly Comprehensive Guides'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>{lang === 'ne' ? 'द्विभाषी (English र नेपाली)' : 'Fully Bilingual (English & Nepali)'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ne' ? 'पञ्चाङ्ग समिति तथा वैदिक मान्यता' : 'Vedic Ephemeris Verified'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ARTICLE READER VIEW */}
      {selectedArticle ? (
        <article className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 animate-in fade-in duration-200">
          
          {/* Top Article Navigation & Lang Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setSelectedArticleId(null)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'ne' ? 'सबै लेखहरूमा फर्कनुहोस्' : 'Back to all articles'}</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setArticleLang('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    articleLang === 'en'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setArticleLang('ne')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    articleLang === 'ne'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  नेपाली
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
                title="Share article link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? (lang === 'ne' ? 'कपी भयो' : 'Copied!') : (lang === 'ne' ? 'साझेदारी' : 'Share')}</span>
              </button>
            </div>
          </div>

          {/* Article Header */}
          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-md font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                {articleLang === 'ne' ? selectedArticle.categoryNe : selectedArticle.categoryEn}
              </span>
              <span className="text-stone-400">•</span>
              <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedArticle.readTimeMin} {articleLang === 'ne' ? 'मिनेट पढाइ' : 'min read'}</span>
              </span>
              <span className="text-stone-400">•</span>
              <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{selectedArticle.publishDate}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-white leading-tight">
              {articleLang === 'ne' ? selectedArticle.titleNe : selectedArticle.titleEn}
            </h2>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-serif italic border-l-4 border-sky-600 pl-4 py-1">
              {articleLang === 'ne' ? selectedArticle.excerptNe : selectedArticle.excerptEn}
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-stone-600 dark:text-stone-400">
              <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-stone-900 dark:text-white font-semibold">
                  {articleLang === 'ne' ? selectedArticle.author.nameNe : selectedArticle.author.nameEn}
                </strong>
                <span className="text-stone-500 text-[11px]">
                  {articleLang === 'ne' ? selectedArticle.author.roleNe : selectedArticle.author.roleEn}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-md max-h-96 w-full bg-stone-200 dark:bg-stone-800">
            <img
              src={selectedArticle.featuredImage}
              alt={selectedArticle.titleEn}
              className="w-full h-full object-cover max-h-96"
            />
          </div>

          {/* Key Takeaways Box */}
          <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 sm:p-6 space-y-3">
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{articleLang === 'ne' ? 'मुख्य बुँदाहरू (Key Takeaways)' : 'Executive Summary & Key Takeaways'}</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-amber-950 dark:text-amber-100 leading-relaxed">
              {(articleLang === 'ne' ? selectedArticle.keyTakeawaysNe : selectedArticle.keyTakeawaysEn).map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Main Body Sections */}
          <div className="space-y-8 max-w-4xl pt-2">
            {selectedArticle.sections.map((sec, idx) => (
              <section key={idx} className="space-y-3.5">
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
                  {articleLang === 'ne' ? sec.titleNe : sec.titleEn}
                </h3>

                {sec.imageUrl && (
                  <figure className="my-4 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 shadow-sm">
                    <img
                      src={sec.imageUrl}
                      alt={articleLang === 'ne' ? (sec.imageCaptionNe || sec.titleNe) : (sec.imageCaptionEn || sec.titleEn)}
                      className="w-full h-64 sm:h-84 object-cover"
                      loading="lazy"
                    />
                    {(sec.imageCaptionNe || sec.imageCaptionEn) && (
                      <figcaption className="p-3 bg-stone-50/90 dark:bg-stone-800/90 text-xs text-stone-600 dark:text-stone-300 italic text-center border-t border-stone-200 dark:border-stone-800 flex items-center justify-center gap-1.5">
                        <span className="text-amber-600 dark:text-amber-400 font-bold not-italic">📷</span>
                        <span>{articleLang === 'ne' ? sec.imageCaptionNe : sec.imageCaptionEn}</span>
                      </figcaption>
                    )}
                  </figure>
                )}

                <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                  {articleLang === 'ne' ? sec.contentNe : sec.contentEn}
                </p>

                {((articleLang === 'ne' ? sec.bulletPointsNe : sec.bulletPointsEn) || []).length > 0 && (
                  <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-4 border border-stone-200 dark:border-stone-800 my-3">
                    <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                      {(articleLang === 'ne' ? sec.bulletPointsNe : sec.bulletPointsEn)?.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-sky-600 dark:text-sky-400 font-semibold shrink-0 mt-0.5">✓</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Frequently Asked Questions */}
          {selectedArticle.faqs && selectedArticle.faqs.length > 0 && (
            <div className="border-t border-stone-200 dark:border-stone-800 pt-8 space-y-4 max-w-4xl">
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <span>{articleLang === 'ne' ? 'प्रायः सोधिने प्रश्नहरू (FAQs)' : 'Frequently Asked Questions'}</span>
              </h3>

              <div className="space-y-3">
                {selectedArticle.faqs.map((faq, fIdx) => {
                  const isExpanded = expandedFaqIndex === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : fIdx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 bg-stone-50 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer text-xs sm:text-sm font-semibold text-stone-900 dark:text-white"
                      >
                        <span>{articleLang === 'ne' ? faq.questionNe : faq.questionEn}</span>
                        <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="p-4 bg-white dark:bg-stone-900 text-xs sm:text-sm text-stone-600 dark:text-stone-300 border-t border-stone-200 dark:border-stone-800 leading-relaxed">
                          {articleLang === 'ne' ? faq.answerNe : faq.answerEn}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-500 flex items-center gap-1 font-semibold mr-1">
              <Tag className="w-3.5 h-3.5" />
              <span>{articleLang === 'ne' ? 'ट्यागहरू:' : 'Tags:'}</span>
            </span>
            {(articleLang === 'ne' ? selectedArticle.tagsNe : selectedArticle.tagsEn).map((tag, tIdx) => (
              <span
                key={tIdx}
                className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700/80"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Bottom Back Button */}
          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setSelectedArticleId(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'ne' ? 'सबै लेखहरू हेर्नुहोस्' : 'Explore All Knowledge Guides'}</span>
            </button>
          </div>
        </article>
      ) : (
        /* ARTICLES DIRECTORY / LIST VIEW */
        <div className="space-y-6">
          
          {/* Filter & Search Bar */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ne' ? 'लेख वा विषय खोज्नुहोस् (उदा: बिक्रम संवत्, पञ्चाङ्ग, दशैं, कुण्डली)...' : 'Search guides by title, keywords or topic...'}
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {lang === 'ne' ? cat.labelNe : cat.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  setSelectedArticleId(art.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-sky-500/50 transition-all duration-200 flex flex-col cursor-pointer group"
              >
                {/* Card Image */}
                <div className="relative h-44 overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={art.featuredImage}
                    alt={art.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-amber-300 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-stone-700">
                    {lang === 'ne' ? art.categoryNe : art.categoryEn}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{art.readTimeMin} {lang === 'ne' ? 'मिनेट' : 'min'}</span>
                      </span>
                      <span>•</span>
                      <span>{art.publishDate}</span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                      {lang === 'ne' ? art.titleNe : art.titleEn}
                    </h3>

                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                      {lang === 'ne' ? art.excerptNe : art.excerptEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform">
                    <span>{lang === 'ne' ? 'पूर्ण लेख पढ्नुहोस्' : 'Read Full Article'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
              <Search className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                {lang === 'ne' ? 'कुनै लेख भेटिएन' : 'No articles matched your criteria'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline"
              >
                {lang === 'ne' ? 'फिल्टरहरू रिसेट गर्नुहोस्' : 'Clear search and filters'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
