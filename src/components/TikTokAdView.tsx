import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';

interface TikTokAdViewProps {
  lang: Language;
  onNavigate: (tab: string) => void;
}

export function TikTokAdView({ lang, onNavigate }: TikTokAdViewProps) {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const scenes = [
    {
      id: 0,
      title: "शुभ पात्रो - नयाँ डिजिटल नेपाली पात्रो",
      badge: "✦ नयाँ डिजिटल नेपाली पात्रो ✦",
      headline: "शुभ पात्रो",
      subheadline: "SHUBHA PATRO",
      tagline: "नेपालीको आफ्नै आधुनिक पात्रो र पञ्चाङ्ग",
      gradient: "from-red-900 via-rose-950 to-stone-950",
      items: [
        { icon: "📅", title: "बिक्रम संवत् पञ्चाङ्ग र चाडपर्व", desc: "एकादशी, औंशी, पूर्णिमा र शुभ साइत" },
        { icon: "🔮", title: "कुण्डली, गुण मिलान र राशिफल", desc: "दैनिक राशिफल र विवाह गुण मिलान" },
        { icon: "💵", title: "राष्ट्र बैंक विदेशी विनिमय दर", desc: "डलर, रियाल, दिर्हामसहित ताजा भाउ" },
        { icon: "🪙", title: "सुनचाँदी दर र १०८ जप माला", desc: "FENEGOSIDA भाउ र डिजिटल रुद्राक्ष" }
      ],
      ctaText: "👉 shubhapatro.com",
      ctaSub: "अहिले नै ब्राउजरमा खोल्नुहोस्"
    },
    {
      id: 1,
      title: "विवाह गुण मिलान र कुण्डली",
      badge: "🔮 सम्बन्ध र विवाह जोखाना",
      headline: "विवाह गुण मिलान",
      subheadline: "KUNDALI & GUN MILAN",
      tagline: "तपाइँ र तपाइँको पार्टनरको गुण कति मिल्छ?",
      gradient: "from-purple-950 via-indigo-950 to-stone-950",
      score: "३१ / ३६",
      scoreBadge: "⭐ अति उत्तम मिलान ⭐",
      kutas: [
        "वर्ण: १/१  •  वश्य: २/२  •  तारा: ३/३",
        "योनि: ४/४  •  ग्रह मैत्री: ५/५  •  गण: ६/६",
        "भकूट: ७/७  •  नाडी दोष: छैन (३/८)"
      ],
      ctaText: "👉 shubhapatro.com",
      ctaSub: "निःशुल्क गुण मिलान चेक गर्नुहोस्"
    },
    {
      id: 2,
      title: "नेपाल राष्ट्र बैंक विनिमय दर",
      badge: "💵 विदेशबाट पैसा पठाउँदा",
      headline: "राष्ट्र बैंक विनिमय दर",
      subheadline: "NRB OFFICIAL FOREX",
      tagline: "दैनिक १००% आधिकारिक विदेशी मुद्राको भाउ",
      gradient: "from-emerald-950 via-teal-950 to-stone-950",
      forexList: [
        { cur: "🇺🇸 USD", name: "अमेरिकी डलर", buy: "रु १३४.८०", sell: "रु १३५.४०" },
        { cur: "🇦🇺 AUD", name: "अस्ट्रेलियन डलर", buy: "रु ८९.६०", sell: "रु ९०.००" },
        { cur: "🇶🇦 QAR", name: "कतारी रियाल", buy: "रु ३६.९०", sell: "रु ३७.१०" },
        { cur: "🇨🇦 CAD", name: "क्यानेडियन डलर", buy: "रु ९८.२०", sell: "रु ९८.८०" }
      ],
      ctaText: "👉 shubhapatro.com",
      ctaSub: "दैनिक विदेशी मुद्रा भाउ हेर्नुहोस्"
    },
    {
      id: 3,
      title: "सुनचाँदी, राशिफल र सपनाको फल",
      badge: "🪙 सुनचाँदी, राशिफल र सपना",
      headline: "दैनिक आवश्यक सबै सेवा",
      subheadline: "ALL-IN-ONE SERVICES",
      tagline: "एकै ठाउँमा, बिना कुनै शुल्क",
      gradient: "from-amber-950 via-stone-900 to-stone-950",
      goldPrice: "छापावाल सुन: रु १,६०,५०० तोला | चाँदी रु १,९८०",
      features: [
        { icon: "🪙", title: "FENEGOSIDA सुनचाँदी भाउ", sub: "छापावाल सुन र चाँदीको दैनिक आधिकारिक दर" },
        { icon: "🔮", title: "दैनिक १२ राशिको राशिफल", sub: "शुभ रंग, शुभ अंक र दैनिक राशिफल" },
        { icon: "💭", title: "स्वप्न शास्त्र (सपनाको फल)", sub: "सपनामा सर्प, पानी वा पैसा देख्दा के हुन्छ?" },
        { icon: "📿", title: "१०८ डिजिटल जप माला", sub: "रुद्राक्ष मालासहित गायत्री र महामृत्युञ्जय मन्त्र" }
      ],
      ctaText: "👉 shubhapatro.com",
      ctaSub: "अहिले नै खोल्नुहोस्"
    },
    {
      id: 4,
      title: "कुनै एप डाउनलोड गर्नै पर्दैन",
      badge: "📱 कुनै एप डाउनलोड गर्नै पर्दैन",
      headline: "अहिले नै चलाउनुहोस्",
      subheadline: "SHUBHA PATRO",
      tagline: "कसरी चलाउने? सजिलो ३ उपाय:",
      gradient: "from-red-950 via-rose-950 to-indigo-950",
      steps: [
        { num: "१", title: "मोबाइलको ब्राउजर खोल्नुहोस्", desc: "Chrome वा Safari मा गएर shubhapatro.com टाइप गर्नुहोस्" },
        { num: "२", title: "'Add to Home Screen' गर्नुहोस्", desc: "Share मा थिचेर सिधै मोबाइल स्क्रिनमा राख्नुहोस्" },
        { num: "३", title: "१००% हलुका, छिटो र निःशुल्क", desc: "कुनै स्टोरेज नखाई अफलाइनमा पनि चल्ने" }
      ],
      ctaText: "🌐 shubhapatro.com",
      ctaSub: "Google मा गएर खोज्नुहोस्!"
    }
  ];

  // Auto-play timer for scenes
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPlaying, scenes.length]);

  // Melodic Web Audio synth
  const playChime = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      const freq = notes[currentScene % notes.length];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {}
  };

  useEffect(() => {
    if (isPlaying) playChime();
  }, [currentScene]);

  const captionText = `के तपाइँ र तपाइँको मायाको गुण मिल्छ त? 🔮❤️ 
अब विवाह गुण मिलान, दैनिक राशिफल, राष्ट्र बैंकको विदेशी विनिमय दर र सुनचाँदीको भाउ एउटै आधुनिक नेपाली पात्रोमा!

कुनै एप डाउनलोड गर्नै नपर्ने, सिधै मोबाइलमा खोल्नुहोस्:
👉 shubhapatro.com (लिङ्क प्रोफाइल बायोमा छ)

#shubhapatro #nepalipatro #gunmilan #rashifal #nepal #forexnepal #aajakobhau #nepalimuser #nepalitiktok #viralnepal`;

  const copyCaption = () => {
    navigator.clipboard.writeText(captionText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const scene = scenes[currentScene];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
          TikTok & Instagram Reels (9:16 Video)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
          शुभ पात्रो - टिकटक भिडियो विज्ञापन
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
          यहाँ सिधै भिडियो चलाउनुहोस् वा TikTok र Reels मा अपलोड गर्न भिडियो फाइल डाउनलोड गर्नुहोस्।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 9:16 Vertical Video Player */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 bg-stone-950 flex flex-col justify-between p-5 select-none transition-all duration-500">
            {/* Top Scene Progress Bars */}
            <div className="flex gap-1.5 w-full z-10">
              {scenes.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setCurrentScene(idx)}
                  className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                    idx === currentScene
                      ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                      : idx < currentScene
                      ? 'bg-white/70'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${scene.gradient} opacity-90 transition-all duration-700 pointer-events-none`} />

            {/* Scene Content */}
            <div className="relative z-10 my-auto text-center flex flex-col items-center">
              {/* Badge */}
              <div className="inline-block px-3 py-1 bg-amber-400/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-bold mb-3 backdrop-blur-sm animate-pulse">
                {scene.badge}
              </div>

              {/* Headline */}
              <h2 className="text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {scene.headline}
              </h2>
              <div className="text-xs font-bold text-amber-400 tracking-widest uppercase mt-0.5">
                {scene.subheadline}
              </div>
              <p className="text-xs text-stone-200 mt-1 mb-4 font-medium px-4">
                {scene.tagline}
              </p>

              {/* Dynamic Feature Display Based on Scene */}
              {scene.id === 0 && (
                <div className="w-full space-y-2 text-left">
                  {scene.items?.map((item, i) => (
                    <div key={i} className="bg-stone-900/80 border border-stone-700/60 p-2.5 rounded-xl flex items-center gap-3 backdrop-blur-md">
                      <span className="text-xl">{item.icon}</span>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white">{item.title}</div>
                        <div className="text-[10px] text-stone-300">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {scene.id === 1 && (
                <div className="w-full space-y-3">
                  <div className="bg-purple-900/60 border border-purple-500/40 p-2.5 rounded-xl text-xs text-purple-200 font-semibold">
                    वर: रोहन (मेष) ✕ वधु: पूजा (सिंह)
                  </div>
                  <div className="bg-emerald-800/80 border border-emerald-500 p-4 rounded-2xl shadow-lg">
                    <div className="text-4xl font-extrabold text-amber-300">{scene.score}</div>
                    <div className="text-xs font-bold text-white mt-1">{scene.scoreBadge}</div>
                  </div>
                  <div className="bg-stone-900/80 p-2.5 rounded-xl text-[11px] text-stone-200 space-y-1 text-center border border-stone-800">
                    {scene.kutas?.map((k, i) => (
                      <div key={i}>{k}</div>
                    ))}
                  </div>
                </div>
              )}

              {scene.id === 2 && (
                <div className="w-full space-y-2 text-left">
                  {scene.forexList?.map((fx, i) => (
                    <div key={i} className="bg-emerald-950/80 border border-emerald-600/40 p-2 rounded-xl flex items-center justify-between">
                      <div className="text-xs font-bold text-amber-300">{fx.cur}</div>
                      <div className="text-[11px] text-stone-200">खरिद: {fx.buy} | बिक्री: {fx.sell}</div>
                    </div>
                  ))}
                  <div className="bg-emerald-900/60 p-2 rounded-xl text-center text-[11px] text-emerald-200 font-medium">
                    ⚡ १००% राष्ट्र बैंक आधिकारिक विनिमय दर
                  </div>
                </div>
              )}

              {scene.id === 3 && (
                <div className="w-full space-y-2">
                  <div className="bg-amber-900/80 border border-amber-500/50 p-2.5 rounded-xl text-xs font-bold text-amber-200">
                    🪙 {scene.goldPrice}
                  </div>
                  {scene.features?.map((f, i) => (
                    <div key={i} className="bg-stone-900/70 border border-stone-800 p-2 rounded-xl flex items-center gap-2.5 text-left">
                      <span className="text-lg">{f.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{f.title}</div>
                        <div className="text-[10px] text-stone-300">{f.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {scene.id === 4 && (
                <div className="w-full space-y-2.5 text-left">
                  {scene.steps?.map((step, i) => (
                    <div key={i} className="bg-stone-900/80 border border-stone-800 p-2.5 rounded-xl flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {step.num}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-amber-300">{step.title}</div>
                        <div className="text-[10px] text-stone-300">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom CTA Button */}
            <div className="relative z-10 w-full mt-auto pt-3">
              <div className="bg-red-600 border border-red-400 p-3 rounded-2xl shadow-lg text-center">
                <div className="text-base font-extrabold text-white">{scene.ctaText}</div>
                <div className="text-[10px] text-amber-200">{scene.ctaSub}</div>
              </div>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-xs font-bold rounded-xl transition flex items-center gap-2"
            >
              {isPlaying ? '⏸ पज गर्नुहोस्' : '▶ प्ले गर्नुहोस्'}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-xs font-bold rounded-xl transition flex items-center gap-2"
            >
              {isMuted ? '🔇 अनम्युट' : '🔊 म्युट'}
            </button>
          </div>
        </div>

        {/* Right Column: Download MP4 & Ready-to-use Caption */}
        <div className="lg:col-span-6 space-y-5">
          {/* Download Box */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <span>📥</span> भिडियो डाउनलोड र सेभ गर्नुहोस्
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 mb-4">
              यो भिडियो उच्च गुणस्तर (720x1280 9:16) को MP4 फर्म्याटमा तयार छ।
            </p>

            <a
              href="/shubhapatro-ad-video.mp4"
              download="shubhapatro-tiktok-ad.mp4"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold rounded-xl transition shadow-md shadow-red-600/30 text-center text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              भिडियो फाइल डाउनलोड (MP4)
            </a>
          </div>

          {/* Caption & Hashtag Box */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <span>📝</span> TikTok क्याप्सन र ह्याशट्याग
              </h3>
              <button
                onClick={copyCaption}
                className="text-xs font-semibold px-3 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-lg transition text-stone-800 dark:text-stone-200"
              >
                {copied ? 'कपी भयो! ✅' : 'कपी गर्नुहोस् 📋'}
              </button>
            </div>
            <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800/80 text-stone-700 dark:text-stone-300 text-xs leading-relaxed whitespace-pre-line font-mono select-all">
              {captionText}
            </div>
          </div>

          {/* How to deploy MP4 to server note */}
          <div className="bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 text-xs text-stone-600 dark:text-stone-400 space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-stone-200 text-xs">
              💡 Cloud Shell बाट सर्भरमा MP4 अपडेट गर्ने तरिका:
            </h4>
            <p>
              यदि सर्भरमा सिधै MP4 फाइल पनि राख्न चाहनुहुन्छ भने Cloud Shell मा यो कमान्ड चलाउनुहोस्:
            </p>
            <pre className="bg-stone-200 dark:bg-stone-950 p-3 rounded-xl text-[11px] overflow-x-auto text-stone-800 dark:text-stone-300 font-mono">
              git pull origin main{'\n'}
              node scripts/generate_tiktok_video.cjs{'\n'}
              gcloud run deploy shubhapatro --source . --region asia-east1 --project hamropatro-app-live --allow-unauthenticated
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
