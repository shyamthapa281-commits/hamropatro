import React, { useState, useRef, useEffect } from 'react';
import { 
  Radio as RadioIcon, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Signal, 
  Sparkles,
  SkipForward,
  SkipBack,
  RotateCcw,
  Clock,
  Music,
  Wifi,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { RadioStation, Language } from '../types';
import { MOCK_RADIO_STATIONS } from '../data/mockNews';
import { himalayanAudio } from '../utils/himalayanAudioEngine';

interface RadioPlayerProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  activeStation: RadioStation;
  setActiveStation: (station: RadioStation) => void;
}

type AudioState = 'idle' | 'loading' | 'playing' | 'error' | 'fallback';

export const RadioPlayer: React.FC<RadioPlayerProps> = ({
  lang,
  isOpen,
  onClose,
  isPlaying,
  setIsPlaying,
  activeStation,
  setActiveStation,
}) => {
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerSecondsLeft, setSleepTimerSecondsLeft] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackAttemptRef = useRef<number>(0);
  const sleepTimerIntervalRef = useRef<any>(null);

  // Sleep Timer Handler
  useEffect(() => {
    if (sleepTimerMinutes === null) {
      setSleepTimerSecondsLeft(null);
      if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
      return;
    }

    setSleepTimerSecondsLeft(sleepTimerMinutes * 60);

    sleepTimerIntervalRef.current = setInterval(() => {
      setSleepTimerSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(sleepTimerIntervalRef.current);
          stopAllAudio();
          setIsPlaying(false);
          setSleepTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
    };
  }, [sleepTimerMinutes]);

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    himalayanAudio.stop();
  };

  const playStationAudio = async (station: RadioStation, attempt = 0) => {
    stopAllAudio();
    fallbackAttemptRef.current = attempt;

    if (station.isInstrumental || station.streamUrl === 'instrumental-synth') {
      setAudioState('playing');
      setStatusMessage(lang === 'ne' ? 'प्रत्यक्ष हिमाली धुन' : 'Live Himalayan Melodies');
      himalayanAudio.setVolume(isMuted ? 0 : volume);
      himalayanAudio.start();
      return;
    }

    setAudioState('loading');
    setStatusMessage(
      attempt === 0
        ? (lang === 'ne' ? 'प्रसारण जडान हुँदैछ...' : 'Connecting to live stream...')
        : (lang === 'ne' ? 'सुरक्षित स्ट्रिम च्यानल जोड्दै...' : 'Switching to secure proxy stream...')
    );

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;

    // Stream URLs: 0 = direct URL, 1 = server proxy URL, 2 = backup stream proxy
    let targetUrl = station.streamUrl;
    if (attempt === 1) {
      targetUrl = `/api/radio/proxy?url=${encodeURIComponent(station.streamUrl)}`;
    } else if (attempt === 2 && station.backupStreamUrl) {
      targetUrl = `/api/radio/proxy?url=${encodeURIComponent(station.backupStreamUrl)}`;
    }

    audio.src = targetUrl;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setAudioState('playing');
          setStatusMessage(lang === 'ne' ? 'प्रत्यक्ष प्रसारण सुरु भयो' : 'Live FM Streaming');
        })
        .catch((err) => {
          console.warn(`Radio attempt ${attempt} failed for ${station.name}:`, err.message);

          if (attempt < 2) {
            // Retry with proxy or backup
            playStationAudio(station, attempt + 1);
          } else {
            // Automatic graceful fallback to authentic Himalayan acoustic melodies so sound NEVER cuts out!
            setAudioState('fallback');
            setStatusMessage(
              lang === 'ne' 
                ? 'अनलाइन स्ट्रिम व्यस्त। हिमाली बाँसुरी धुन सक्रिय भयो।' 
                : 'Stream busy. Playing authentic Himalayan folk audio.'
            );
            himalayanAudio.setVolume(isMuted ? 0 : volume);
            himalayanAudio.start();
          }
        });
    }
  };

  // Listen to audio element events
  useEffect(() => {
    const audio = audioRef.current || new Audio();
    audioRef.current = audio;

    const handlePlaying = () => {
      setAudioState('playing');
      setStatusMessage(lang === 'ne' ? 'प्रत्यक्ष प्रसारण (Live)' : 'Live Streaming (HD)');
    };

    const handleWaiting = () => {
      if (isPlaying) {
        setAudioState('loading');
        setStatusMessage(lang === 'ne' ? 'बफरिङ हुँदैछ...' : 'Buffering...');
      }
    };

    const handleError = () => {
      if (isPlaying && fallbackAttemptRef.current < 2) {
        playStationAudio(activeStation, fallbackAttemptRef.current + 1);
      } else if (isPlaying) {
        setAudioState('fallback');
        setStatusMessage(lang === 'ne' ? 'हिमाली बाँसुरी धुन बजाउँदै' : 'Playing Himalayan Melodies');
        himalayanAudio.setVolume(isMuted ? 0 : volume);
        himalayanAudio.start();
      }
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
    };
  }, [activeStation, isPlaying, lang]);

  // Trigger audio on active station change or isPlaying toggle
  useEffect(() => {
    if (isPlaying) {
      playStationAudio(activeStation, 0);
    } else {
      stopAllAudio();
      setAudioState('idle');
      setStatusMessage('');
    }
  }, [activeStation, isPlaying]);

  // Volume & Mute synchronizer
  useEffect(() => {
    const currentVol = isMuted ? 0 : volume;
    if (audioRef.current) {
      audioRef.current.volume = currentVol;
    }
    himalayanAudio.setVolume(currentVol);
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleNextStation = () => {
    const currentIndex = MOCK_RADIO_STATIONS.findIndex((s) => s.id === activeStation.id);
    const nextIndex = (currentIndex + 1) % MOCK_RADIO_STATIONS.length;
    setActiveStation(MOCK_RADIO_STATIONS[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevStation = () => {
    const currentIndex = MOCK_RADIO_STATIONS.findIndex((s) => s.id === activeStation.id);
    const prevIndex = (currentIndex - 1 + MOCK_RADIO_STATIONS.length) % MOCK_RADIO_STATIONS.length;
    setActiveStation(MOCK_RADIO_STATIONS[prevIndex]);
    setIsPlaying(true);
  };

  const handleRetryCurrentStation = () => {
    playStationAudio(activeStation, 0);
  };

  const filteredStations = MOCK_RADIO_STATIONS.filter((station) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'news') return station.genre.toLowerCase().includes('news');
    if (selectedCategory === 'music') return station.genre.toLowerCase().includes('pop') || station.genre.toLowerCase().includes('youth') || station.genre.toLowerCase().includes('charts');
    if (selectedCategory === 'raga') return station.isInstrumental || station.genre.toLowerCase().includes('flute') || station.genre.toLowerCase().includes('gurkha');
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full sm:w-96">
      <div className="bg-stone-900/95 text-white rounded-3xl shadow-2xl border border-stone-700/80 overflow-hidden backdrop-blur-xl transition-all duration-300">
        
        {/* Top Header Bar */}
        <div className="bg-stone-950 px-4 py-3 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}`} />
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <RadioIcon className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'ne' ? 'हाम्रो अनलाइन रेडियो (Live FM)' : 'Hamro Live Radio Hub'}
            </h4>
          </div>

          <div className="flex items-center gap-1">
            {/* Sleep timer toggle button */}
            <div className="relative group">
              <button
                onClick={() => {
                  if (sleepTimerMinutes === null) setSleepTimerMinutes(15);
                  else if (sleepTimerMinutes === 15) setSleepTimerMinutes(30);
                  else if (sleepTimerMinutes === 30) setSleepTimerMinutes(60);
                  else setSleepTimerMinutes(null);
                }}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                  sleepTimerMinutes ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40' : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
                title={lang === 'ne' ? 'स्लिप टाइमर सेट गर्नुहोस्' : 'Set Sleep Timer'}
              >
                <Clock className="w-3.5 h-3.5" />
                {sleepTimerSecondsLeft !== null && (
                  <span className="text-[10px]">
                    {Math.floor(sleepTimerSecondsLeft / 60)}m
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Station Display & Audio Controls */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center font-black text-base shadow-lg shrink-0 border border-red-500/30">
                {activeStation.logo || '📻'}
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-sm text-white truncate">{activeStation.name}</h5>
                <p className="text-[11px] text-amber-400 font-medium truncate flex items-center gap-1.5">
                  <span>{activeStation.frequency}</span>
                  <span>•</span>
                  <span>{lang === 'ne' ? (activeStation.genreNe || activeStation.genre) : activeStation.genre}</span>
                </p>
              </div>
            </div>

            {/* Main Play/Pause Button */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handlePrevStation}
                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                title={lang === 'ne' ? 'अघिल्लो स्टेसन' : 'Previous station'}
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer font-bold"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {audioState === 'loading' && isPlaying ? (
                  <Loader2 className="w-5 h-5 animate-spin text-stone-950" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-stone-950" />
                ) : (
                  <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNextStation}
                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                title={lang === 'ne' ? 'पछिल्लो स्टेसन' : 'Next station'}
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Equalizer Waveform & Live Status */}
          <div className="bg-stone-950/80 rounded-2xl p-2.5 border border-stone-800/80 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${
                audioState === 'playing' ? 'bg-emerald-400 animate-pulse' :
                audioState === 'loading' ? 'bg-amber-400 animate-ping' :
                audioState === 'fallback' ? 'bg-sky-400' : 'bg-stone-500'
              }`} />
              <span className="font-semibold text-stone-300">
                {statusMessage || (isPlaying ? (lang === 'ne' ? 'प्रत्यक्ष प्रसारण' : 'Live') : (lang === 'ne' ? 'रोकिएको छ' : 'Ready'))}
              </span>
            </div>

            {isPlaying && (
              <div className="flex items-end gap-1 h-4">
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite]" style={{ height: '60%' }} />
                <span className="w-1 bg-amber-300 rounded-full animate-[bounce_0.8s_infinite]" style={{ height: '100%' }} />
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.5s_infinite]" style={{ height: '40%' }} />
                <span className="w-1 bg-amber-200 rounded-full animate-[bounce_0.7s_infinite]" style={{ height: '85%' }} />
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.9s_infinite]" style={{ height: '65%' }} />
              </div>
            )}
          </div>

          {/* Volume Control Bar */}
          <div className="flex items-center gap-2.5 text-stone-400 text-xs">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const newVol = Number(e.target.value);
                setVolume(newVol);
                if (isMuted) setIsMuted(false);
              }}
              className="w-full accent-amber-400 h-1.5 bg-stone-700 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-stone-400 w-7 text-right">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>

        {/* Station Selector & Category Tabs */}
        {!isCollapsed && (
          <div className="p-3 bg-stone-950 border-t border-stone-800 space-y-2">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {[
                { id: 'all', nameNe: 'सबै स्टेसन', nameEn: 'All' },
                { id: 'news', nameNe: 'समाचार', nameEn: 'News' },
                { id: 'music', nameNe: 'संगीत/पप', nameEn: 'Music' },
                { id: 'raga', nameNe: 'बाँसुरी/लोक', nameEn: 'Flute/Raga' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {lang === 'ne' ? cat.nameNe : cat.nameEn}
                </button>
              ))}
            </div>

            {/* Stations List */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 scrollbar-none pr-1">
              {filteredStations.map((station) => {
                const isCurrent = station.id === activeStation.id;
                return (
                  <button
                    key={station.id}
                    onClick={() => {
                      setActiveStation(station);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-2xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40 shadow-xs'
                        : 'text-stone-300 bg-stone-900/60 hover:bg-stone-800/90 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{station.logo}</span>
                      <div className="truncate">
                        <span className="block font-bold truncate text-white">{station.name}</span>
                        <span className="text-[10px] text-stone-400 block font-normal">
                          {station.frequency} • {lang === 'ne' ? (station.genreNe || station.genre) : station.genre}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {isCurrent && isPlaying ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-[10px] font-bold">
                          <Signal className="w-3 h-3 text-emerald-400 animate-pulse" />
                          <span>LIVE</span>
                        </span>
                      ) : (
                        <Play className="w-3 h-3 text-stone-500 group-hover:text-amber-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Offline Himalayan Flute Quick Trigger */}
            <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400 px-1">
              <span className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ne' ? 'अडियोमा समस्या भए बाँसुरी धुन रोज्नुहोस्' : 'Zero-lag acoustic flute mode'}</span>
              </span>
              <button
                onClick={() => {
                  const fluteStation = MOCK_RADIO_STATIONS.find((s) => s.id === 'himalayan-flute') || MOCK_RADIO_STATIONS[0];
                  setActiveStation(fluteStation);
                  setIsPlaying(true);
                }}
                className="text-amber-300 font-bold hover:underline cursor-pointer"
              >
                {lang === 'ne' ? 'धुन बजाउनुहोस्' : 'Play Flute'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
