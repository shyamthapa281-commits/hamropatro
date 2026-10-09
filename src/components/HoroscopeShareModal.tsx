import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  MessageSquare, 
  Palette, 
  Smartphone, 
  Square, 
  Maximize2,
  Send,
  ExternalLink
} from 'lucide-react';
import { RashiInfo, DailyHoroscope, Language, NepaliDate } from '../types';
import { toNepaliDigits } from '../utils/nepaliCalendar';

interface HoroscopeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  rashi: RashiInfo;
  horoscope: DailyHoroscope;
  lang: Language;
  todayBs?: NepaliDate;
  initialTab?: 'image' | 'text';
}

type AspectRatio = 'square' | 'portrait';
type ThemeVariant = 'crimson' | 'indigo' | 'emerald';

export const HoroscopeShareModal: React.FC<HoroscopeShareModalProps> = ({
  isOpen,
  onClose,
  rashi,
  horoscope,
  lang,
  todayBs,
  initialTab = 'image'
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'text'>(initialTab);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('square');
  const [theme, setTheme] = useState<ThemeVariant>('crimson');
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [canNativeShare, setCanNativeShare] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, []);

  // Format shareable text
  const dateHeading = todayBs 
    ? (lang === 'ne' ? todayBs.formattedNe : todayBs.formattedEn)
    : (lang === 'ne' ? 'आजको दिन' : "Today's Date");

  const formattedText = `🌟 Shubha Patro • दैनिक वैदिक राशिफल (Daily Horoscope)
${rashi.symbol} ${rashi.nameNe} (${rashi.nameEn}) | ${dateHeading}
⭐ शुभ योग: ${horoscope.rating}/५ तारा

📖 आजको फलादेश:
${lang === 'ne' ? horoscope.predictionNe : horoscope.predictionEn}

📊 क्षेत्रगत शुभता सूचकांक:
❤️ प्रेम: ${toNepaliDigits(horoscope.scores.love)}% | 💼 करियर: ${toNepaliDigits(horoscope.scores.career)}% | 💰 आर्थिक: ${toNepaliDigits(horoscope.scores.finance)}% | 🌿 स्वास्थ्य: ${toNepaliDigits(horoscope.scores.health)}%

🎨 भाग्यशाली रङ: ${lang === 'ne' ? horoscope.luckyColorNe : horoscope.luckyColorEn}
🔢 भाग्यशाली अङ्क: ${toNepaliDigits(horoscope.luckyNumber)}
🧭 शुभ दिशा: ${lang === 'ne' ? horoscope.luckyDirectionNe : horoscope.luckyDirectionEn}
⏰ शुभ समय: ${horoscope.favorableTime}

🕉️ दैनिक जप मन्त्र:
"${horoscope.mantraNe}"

🌿 ज्योतिषीय उपाय: ${lang === 'ne' ? horoscope.remedyNe : horoscope.remedyEn}
💎 शुभ रत्न: ${lang === 'ne' ? horoscope.gemstoneNe : horoscope.gemstoneEn}

📱 थप विस्तृत पञ्चाङ्ग तथा राशिफलका लागि Shubha Patro (Nepali Calendar • shubhapatro.com) हेर्नुहोस्।`;

  // Draw card on canvas
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsRendering(true);

    const renderCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dimensions: High-res for crisp social sharing
      const width = 1080;
      const height = aspectRatio === 'square' ? 1080 : 1350;

      canvas.width = width;
      canvas.height = height;

      // Color themes
      const themeColors = {
        crimson: {
          bgGradStart: '#450a0a',
          bgGradMid: '#2d0606',
          bgGradEnd: '#170202',
          accentGold: '#f59e0b',
          accentLightGold: '#fef3c7',
          cardBg: 'rgba(30, 5, 5, 0.72)',
          cardBorder: 'rgba(245, 158, 11, 0.35)',
          badgeBg: 'rgba(245, 158, 11, 0.18)',
          textSecondary: '#fed7aa',
        },
        indigo: {
          bgGradStart: '#0f172a',
          bgGradMid: '#090d16',
          bgGradEnd: '#020617',
          accentGold: '#38bdf8',
          accentLightGold: '#e0f2fe',
          cardBg: 'rgba(15, 23, 42, 0.75)',
          cardBorder: 'rgba(56, 189, 248, 0.35)',
          badgeBg: 'rgba(56, 189, 248, 0.18)',
          textSecondary: '#bae6fd',
        },
        emerald: {
          bgGradStart: '#064e3b',
          bgGradMid: '#032e23',
          bgGradEnd: '#021e17',
          accentGold: '#34d399',
          accentLightGold: '#d1fae5',
          cardBg: 'rgba(4, 40, 31, 0.75)',
          cardBorder: 'rgba(52, 211, 153, 0.35)',
          badgeBg: 'rgba(52, 211, 153, 0.18)',
          textSecondary: '#a7f3d0',
        },
      }[theme];

      // 1. Draw rich background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, themeColors.bgGradStart);
      bgGrad.addColorStop(0.5, themeColors.bgGradMid);
      bgGrad.addColorStop(1, themeColors.bgGradEnd);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle decorative starburst / circle glow
      const radialGlow = ctx.createRadialGradient(width / 2, 280, 50, width / 2, 280, 480);
      radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
      radialGlow.addColorStop(0.7, 'rgba(245, 158, 11, 0.03)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Ornate outer border with margin
      const margin = 36;
      ctx.strokeStyle = themeColors.cardBorder;
      ctx.lineWidth = 2;
      roundRect(ctx, margin, margin, width - margin * 2, height - margin * 2, 32);
      ctx.stroke();

      // Inner subtle border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      roundRect(ctx, margin + 8, margin + 8, width - (margin + 8) * 2, height - (margin + 8) * 2, 26);
      ctx.stroke();

      // Ornate corner accents
      const cornerSize = 24;
      ctx.strokeStyle = themeColors.accentGold;
      ctx.lineWidth = 3;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(margin + 12, margin + 12 + cornerSize);
      ctx.lineTo(margin + 12, margin + 12);
      ctx.lineTo(margin + 12 + cornerSize, margin + 12);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(width - margin - 12 - cornerSize, margin + 12);
      ctx.lineTo(width - margin - 12, margin + 12);
      ctx.lineTo(width - margin - 12, margin + 12 + cornerSize);
      ctx.stroke();
      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(margin + 12, height - margin - 12 - cornerSize);
      ctx.lineTo(margin + 12, height - margin - 12);
      ctx.lineTo(margin + 12 + cornerSize, height - margin - 12);
      ctx.stroke();
      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(width - margin - 12 - cornerSize, height - margin - 12);
      ctx.lineTo(width - margin - 12, height - margin - 12);
      ctx.lineTo(width - margin - 12, height - margin - 12 - cornerSize);
      ctx.stroke();

      // Helper function for rounded rects
      function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
        c.beginPath();
        c.moveTo(x + r, y);
        c.lineTo(x + w - r, y);
        c.quadraticCurveTo(x + w, y, x + w, y + r);
        c.lineTo(x + w, y + h - r);
        c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        c.lineTo(x + r, y + h);
        c.quadraticCurveTo(x, y + h, x, y + h - r);
        c.lineTo(x, y + r);
        c.quadraticCurveTo(x, y, x + r, y);
        c.closePath();
      }

      // Word wrapping helper
      function wrapText(c: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
        const words = text.split(' ');
        const lines: string[] = [];
        let curLine = '';
        for (const word of words) {
          const testLine = curLine ? `${curLine} ${word}` : word;
          const testWidth = c.measureText(testLine).width;
          if (testWidth > maxWidth && curLine) {
            lines.push(curLine);
            curLine = word;
          } else {
            curLine = testLine;
          }
        }
        if (curLine) lines.push(curLine);
        return lines;
      }

      // 3. Top Header: Brand & Date
      let currentY = margin + 50;

      // Brand Pill
      ctx.fillStyle = themeColors.badgeBg;
      ctx.strokeStyle = themeColors.cardBorder;
      ctx.lineWidth = 1.5;
      const brandPillW = 340;
      const brandPillH = 42;
      const brandPillX = (width - brandPillW) / 2;
      roundRect(ctx, brandPillX, currentY, brandPillW, brandPillH, 21);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = themeColors.accentGold;
      ctx.font = "bold 18px 'Mukta', 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(
        lang === 'ne' ? 'Shubha Patro • दैनिक वैदिक राशिफल' : 'SHUBHA PATRO • VEDIC HOROSCOPE',
        width / 2,
        currentY + 27
      );

      currentY += brandPillH + 16;

      // Date subtitle
      ctx.fillStyle = themeColors.textSecondary;
      ctx.font = "500 20px 'Mukta', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(`📅 ${dateHeading}`, width / 2, currentY + 12);

      currentY += 46;

      // 4. Hero Rashi Crest (Symbol + Name + Rating)
      const symbolCircleR = 48;
      const symbolCircleY = currentY + symbolCircleR;
      
      // Glowing ring for symbol
      ctx.beginPath();
      ctx.arc(width / 2, symbolCircleY, symbolCircleR + 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width / 2, symbolCircleY, symbolCircleR, 0, Math.PI * 2);
      ctx.fillStyle = themeColors.cardBg;
      ctx.fill();
      ctx.strokeStyle = themeColors.accentGold;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = '54px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(rashi.symbol, width / 2, symbolCircleY);
      ctx.textBaseline = 'alphabetic'; // reset

      currentY += symbolCircleR * 2 + 28;

      // Rashi Name
      ctx.fillStyle = '#ffffff';
      ctx.font = "800 40px 'Mukta', 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = 'center';
      const rashiTitle = `${rashi.nameNe} (${rashi.nameEn})`;
      ctx.fillText(rashiTitle, width / 2, currentY);

      currentY += 32;

      // Element & Planet details
      ctx.fillStyle = themeColors.accentLightGold;
      ctx.font = "500 20px 'Mukta', sans-serif";
      ctx.textAlign = 'center';
      const rashiMeta = `${lang === 'ne' ? 'तत्व:' : 'Element:'} ${rashi.element}   |   ${lang === 'ne' ? 'स्वामी:' : 'Ruling:'} ${rashi.rulingPlanet}`;
      ctx.fillText(rashiMeta, width / 2, currentY);

      currentY += 28;

      // Star rating
      let starsStr = '';
      for (let s = 0; s < 5; s++) {
        starsStr += s < horoscope.rating ? '★ ' : '☆ ';
      }
      ctx.fillStyle = '#f59e0b';
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(starsStr.trim(), width / 2, currentY);

      currentY += 28;

      // 5. Prediction Text Card
      const predCardX = margin + 30;
      const predCardW = width - (margin + 30) * 2;
      const predCardPadding = 24;

      // Calculate prediction text height
      ctx.font = "500 22px 'Mukta', sans-serif";
      const predText = lang === 'ne' ? horoscope.predictionNe : horoscope.predictionEn;
      // Truncate cleanly if too long for square ratio
      const maxLinesAllowed = aspectRatio === 'square' ? 5 : 7;
      let lines = wrapText(ctx, predText, predCardW - predCardPadding * 2);
      if (lines.length > maxLinesAllowed) {
        lines = lines.slice(0, maxLinesAllowed);
        lines[maxLinesAllowed - 1] = lines[maxLinesAllowed - 1].replace(/[,.]?$/, '...');
      }

      const lineHeight = 34;
      const predCardH = 46 + lines.length * lineHeight + predCardPadding;

      ctx.fillStyle = themeColors.cardBg;
      ctx.strokeStyle = themeColors.cardBorder;
      ctx.lineWidth = 1.5;
      roundRect(ctx, predCardX, currentY, predCardW, predCardH, 20);
      ctx.fill();
      ctx.stroke();

      // Card Header
      ctx.fillStyle = themeColors.accentGold;
      ctx.font = "bold 19px 'Mukta', sans-serif";
      ctx.textAlign = 'left';
      ctx.fillText(
        lang === 'ne' ? '✨ आजको फलादेश (Daily Planetary Reading):' : '✨ Today\'s Planetary Reading:',
        predCardX + predCardPadding,
        currentY + 34
      );

      // Card Lines
      ctx.fillStyle = '#f8fafc';
      ctx.font = "500 22px 'Mukta', sans-serif";
      lines.forEach((l, idx) => {
        ctx.fillText(l, predCardX + predCardPadding, currentY + 70 + idx * lineHeight);
      });

      currentY += predCardH + 24;

      // 6. 4 Auspicious Badges (Bento grid: Lucky Color, Number, Direction, Time)
      const bentoGap = 16;
      const bentoW = (predCardW - bentoGap * 3) / 4;
      const bentoH = 92;

      const bentoItems = [
        {
          label: lang === 'ne' ? 'भाग्यशाली रङ' : 'Lucky Color',
          value: lang === 'ne' ? horoscope.luckyColorNe : horoscope.luckyColorEn,
          color: themeColors.accentGold
        },
        {
          label: lang === 'ne' ? 'भाग्यशाली अङ्क' : 'Lucky Number',
          value: toNepaliDigits(horoscope.luckyNumber),
          color: '#fbbf24'
        },
        {
          label: lang === 'ne' ? 'शुभ दिशा' : 'Lucky Direction',
          value: lang === 'ne' ? horoscope.luckyDirectionNe : horoscope.luckyDirectionEn,
          color: '#34d399'
        },
        {
          label: lang === 'ne' ? 'शुभ समय' : 'Auspicious Time',
          value: horoscope.favorableTime.split(' - ')[0] || horoscope.favorableTime,
          color: '#a78bfa'
        }
      ];

      bentoItems.forEach((b, idx) => {
        const bx = predCardX + idx * (bentoW + bentoGap);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        roundRect(ctx, bx, currentY, bentoW, bentoH, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = themeColors.textSecondary;
        ctx.font = "500 15px 'Mukta', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText(b.label, bx + bentoW / 2, currentY + 30);

        ctx.fillStyle = '#ffffff';
        ctx.font = "bold 21px 'Mukta', 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(b.value, bx + bentoW / 2, currentY + 65);
      });

      currentY += bentoH + 20;

      // 7. Chanting Mantra (if portrait or if enough vertical space)
      if (aspectRatio === 'portrait' || currentY + 80 < height - margin - 40) {
        const mantraH = 58;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.strokeStyle = themeColors.cardBorder;
        ctx.lineWidth = 1;
        roundRect(ctx, predCardX, currentY, predCardW, mantraH, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = themeColors.accentGold;
        ctx.font = "bold 16px 'Mukta', sans-serif";
        ctx.textAlign = 'left';
        ctx.fillText('🕉️ ' + (lang === 'ne' ? 'दैनिक जप मन्त्र:' : 'Mantra:'), predCardX + 16, currentY + 35);

        ctx.fillStyle = '#f1f5f9';
        ctx.font = "italic 600 18px 'Mukta', serif";
        ctx.fillText(`"${horoscope.mantraNe}"`, predCardX + 165, currentY + 35);

        currentY += mantraH + 16;
      }

      // 8. Footer Watermark & Branding
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = "500 16px 'Mukta', 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = 'center';
      const footerY = height - margin - 22;
      ctx.fillText(
        lang === 'ne' 
          ? 'Shubha Patro (नेपाली क्यालेन्डर) बाट साझा गरिएको • सबै अधिकार सुरक्षित' 
          : 'Shared via Shubha Patro • Nepal\'s Authentic Calendar & Astrology (shubhapatro.com)',
        width / 2,
        footerY
      );

      if (isMounted) {
        setIsRendering(false);
      }
    };

    // Ensure fonts are loaded before canvas renders
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        renderCanvas();
      });
    } else {
      renderCanvas();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, rashi, horoscope, lang, todayBs, aspectRatio, theme]);

  if (!isOpen) return null;

  // Actions
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `nepali-calendar-${rashi.id}-horoscope.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2500);
        } else {
          handleDownloadImage();
        }
      }, 'image/png');
    } catch (err) {
      console.warn('Copy image clipboard error, falling back to download:', err);
      handleDownloadImage();
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleNativeShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'horoscope.png', { type: 'image/png' })] })) {
          const file = new File([blob], `shubha-patro-${rashi.id}-horoscope.png`, { type: 'image/png' });
          await navigator.share({
            title: `${rashi.nameNe} (${rashi.nameEn}) - दैनिक राशिफल | Shubha Patro`,
            text: formattedText,
            files: [file]
          });
        } else {
          await navigator.share({
            title: `${rashi.nameNe} (${rashi.nameEn}) - दैनिक राशिफल | Shubha Patro`,
            text: formattedText
          });
        }
      });
    } catch (err) {
      console.log('Share dismissed', err);
    }
  };

  // Social share links
  const encodedText = encodeURIComponent(formattedText);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=https://shubhapatro.com&quote=${encodedText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `🌟 ${rashi.nameNe} (${rashi.nameEn}) दैनिक राशिफल | Shubha Patro\n${(lang === 'ne' ? horoscope.predictionNe : horoscope.predictionEn).slice(0, 150)}...\n`
  )}`;
  const viberUrl = `viber://forward?text=${encodedText}`;
  const telegramUrl = `https://t.me/share/url?url=https://shubhapatro.com&text=${encodedText}`;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-red-800 via-red-900 to-amber-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              {rashi.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  {lang === 'ne' ? 'राशिफल सेयर गर्नुहोस्' : 'Share Horoscope'}
                </h3>
                <span className="px-2 py-0.5 bg-amber-400 text-stone-950 font-bold rounded-full text-[11px]">
                  {rashi.nameNe} ({rashi.nameEn})
                </span>
              </div>
              <p className="text-xs text-amber-200">
                {lang === 'ne' 
                  ? 'तस्बिर स्निपेट वा सामाजिक सञ्जाल टेक्स्टको रूपमा सेयर गर्नुहोस्' 
                  : 'Share as a social-media image snippet or copy formatted text'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 px-5 pt-3">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'image'
                ? 'border-red-700 text-red-700 dark:text-red-400 bg-white dark:bg-stone-800 rounded-t-xl shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-500" />
            <span>{lang === 'ne' ? '📸 सामाजिक सञ्जाल तस्बिर स्निपेट' : '📸 Social Media Image Snippet'}</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'border-red-700 text-red-700 dark:text-red-400 bg-white dark:bg-stone-800 rounded-t-xl shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Copy className="w-4 h-4 text-emerald-500" />
            <span>{lang === 'ne' ? '📝 फलादेश टेक्स्ट कपी / सेयर' : '📝 Copy Formatted Text'}</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'image' ? (
            <div className="space-y-5">
              {/* Customization Bar: Aspect Ratio & Theme */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-100 dark:bg-stone-800/70 rounded-2xl border border-stone-200 dark:border-stone-700">
                {/* Aspect Ratio Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-stone-500" />
                    {lang === 'ne' ? 'ढाँचा:' : 'Format:'}
                  </span>
                  <div className="inline-flex bg-white dark:bg-stone-900 rounded-xl p-0.5 border border-stone-200 dark:border-stone-700 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setAspectRatio('square')}
                      className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        aspectRatio === 'square'
                          ? 'bg-red-700 text-white shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                      }`}
                    >
                      <Square className="w-3 h-3" />
                      <span>{lang === 'ne' ? 'वर्ग (१:१)' : 'Square (1:1)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio('portrait')}
                      className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        aspectRatio === 'portrait'
                          ? 'bg-red-700 text-white shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>{lang === 'ne' ? 'स्टोरी (४:५)' : 'Story / Post (4:5)'}</span>
                    </button>
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-amber-500" />
                    {lang === 'ne' ? 'रङ शैली:' : 'Theme:'}
                  </span>
                  <div className="inline-flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTheme('crimson')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        theme === 'crimson'
                          ? 'bg-red-900 text-amber-300 border-amber-400 ring-2 ring-amber-400/40'
                          : 'bg-red-950/40 text-stone-400 border-stone-600 hover:text-stone-200'
                      }`}
                    >
                      {lang === 'ne' ? 'वैदिक रातो' : 'Crimson'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('indigo')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        theme === 'indigo'
                          ? 'bg-slate-900 text-sky-300 border-sky-400 ring-2 ring-sky-400/40'
                          : 'bg-slate-900/40 text-stone-400 border-stone-600 hover:text-stone-200'
                      }`}
                    >
                      {lang === 'ne' ? 'आकाशीय नीलो' : 'Celestial'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('emerald')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        theme === 'emerald'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-400 ring-2 ring-emerald-400/40'
                          : 'bg-emerald-950/40 text-stone-400 border-stone-600 hover:text-stone-200'
                      }`}
                    >
                      {lang === 'ne' ? 'वैदिक हरियो' : 'Emerald'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Canvas Preview Container */}
              <div className="bg-stone-950 rounded-2xl p-3 sm:p-4 border border-stone-800 flex flex-col items-center justify-center relative overflow-hidden shadow-inner min-h-[300px]">
                {isRendering && (
                  <div className="absolute inset-0 bg-stone-950/80 flex items-center justify-center gap-2 z-10 text-amber-300 text-xs font-bold">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{lang === 'ne' ? 'तस्बिर स्निपेट बन्दैछ...' : 'Rendering high-res snippet...'}</span>
                  </div>
                )}
                
                {/* The actual canvas element */}
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[380px] w-auto h-auto rounded-xl shadow-2xl object-contain border border-stone-800"
                />

                <span className="text-[10px] text-stone-400 mt-2">
                  {lang === 'ne' ? 'पूर्वावलोकन: १०८० × ' + (aspectRatio === 'square' ? '१०८०' : '१३५०') + ' पिक्सेल (उच्च गुणस्तर)' : `Preview: 1080 × ${aspectRatio === 'square' ? '1080' : '1350'}px Ultra HD`}
                </span>
              </div>

              {/* Image Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Download Image Button */}
                <button
                  type="button"
                  id="download-horoscope-image-btn"
                  onClick={handleDownloadImage}
                  className="w-full py-2.5 px-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ne' ? 'तस्बिर डाउनलोड (.PNG)' : 'Download Image (.PNG)'}</span>
                </button>

                {/* Copy Image to Clipboard */}
                <button
                  type="button"
                  id="copy-horoscope-image-btn"
                  onClick={handleCopyImage}
                  className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-stone-700 transition-all cursor-pointer"
                >
                  {copiedImage ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>
                    {copiedImage 
                      ? (lang === 'ne' ? 'तस्बिर कपी भयो!' : 'Image Copied!') 
                      : (lang === 'ne' ? 'तस्बिर कपी गर्नुहोस्' : 'Copy Image')}
                  </span>
                </button>

                {/* Native Share */}
                {canNativeShare ? (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{lang === 'ne' ? 'मोबाइलमा सेयर' : 'Direct Share'}</span>
                  </button>
                ) : (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                  >
                    <Send className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Formatted Text Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {lang === 'ne' ? 'सामाजिक सञ्जाल तथा मेसेन्जरका लागि तयार फलादेश पाठ:' : 'Ready-to-share horoscope text snippet:'}
                  </label>
                  <button
                    onClick={handleCopyText}
                    className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? (lang === 'ne' ? 'कपी गरियो!' : 'Copied!') : (lang === 'ne' ? 'कपी गर्नुहोस्' : 'Copy Text')}</span>
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={9}
                    readOnly
                    value={formattedText}
                    className="w-full text-xs font-mono p-3.5 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-2xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-red-500 leading-relaxed resize-none selection:bg-amber-300 selection:text-stone-900"
                  />
                  <button
                    onClick={handleCopyText}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? (lang === 'ne' ? 'कपी गरियो' : 'Copied') : (lang === 'ne' ? 'कपी' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* Direct Social Media Share Shortcuts */}
              <div>
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400 block mb-2">
                  {lang === 'ne' ? 'तुरुन्त सामाजिक सञ्जालमा पठाउनुहोस्:' : 'One-Click Quick Share to Apps:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 p-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 p-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>Facebook</span>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 p-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors"
                  >
                    <span>𝕏 Twitter</span>
                  </a>

                  {/* Viber / Telegram */}
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 p-2.5 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800/60 rounded-xl text-xs font-bold text-sky-700 dark:text-sky-300 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-600" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Close / Info Bar */}
        <div className="bg-stone-50 dark:bg-stone-900/90 px-5 py-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span>{lang === 'ne' ? 'Shubha Patro (शुभ पात्रो) • दैनिक राशिफल सेयरिङ' : 'Shubha Patro • Daily Horoscope Sharing'}</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            {lang === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
