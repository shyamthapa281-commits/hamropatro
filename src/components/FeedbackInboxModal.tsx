import React, { useState, useEffect } from 'react';
import { 
  X, 
  Inbox, 
  Mail, 
  CheckCircle2, 
  Clock, 
  User, 
  Send, 
  Copy, 
  Check, 
  ExternalLink,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Language } from '../types';

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  category?: string;
  type?: string;
  message: string;
  createdAt?: string;
  date?: string;
  status?: string;
}

interface FeedbackInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const FeedbackInboxModal: React.FC<FeedbackInboxModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDnsHelp, setShowDnsHelp] = useState(false);

  const fetchInbox = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/feedback/list');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.feedbacks)) {
          setFeedbacks(data.feedbacks);
          setIsLoading(false);
          return;
        }
      }
    } catch (_) {}

    // Fallback to local storage
    try {
      const stored = JSON.parse(localStorage.getItem('shubhapatro_feedbacks') || '[]');
      setFeedbacks(stored);
    } catch (_) {
      setFeedbacks([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchInbox();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-stone-900 border border-stone-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{lang === 'ne' ? 'प्राप्त सल्लाह तथा प्रतिक्रिया इनबक्स' : 'Received Feedback & Advice Inbox'}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                  {feedbacks.length} {lang === 'ne' ? 'सन्देश' : 'messages'}
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                {lang === 'ne' 
                  ? 'यस पृष्ठबाट प्रयोगकर्ताहरूले पठाएका सम्पूर्ण सल्लाह तथा प्रतिक्रियाहरू' 
                  : 'All community advice and messages received smoothly on-page'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchInbox}
              disabled={isLoading}
              title={lang === 'ne' ? 'ताजा गर्नुहोस्' : 'Refresh inbox'}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Informational Guidance Alert */}
        <div className="px-5 py-3 bg-stone-950/40 border-b border-stone-800/80 text-xs text-stone-300 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-sky-400 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                {lang === 'ne' 
                  ? 'सुरक्षित सर्भर भण्डारण: कुनै पनि सन्देश हराउँदैन' 
                  : 'Live Server Storage: Every on-page submission is preserved'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowDnsHelp(!showDnsHelp)}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer flex items-center gap-1 shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showDnsHelp ? (lang === 'ne' ? 'गाइड लुकाउनुहोस्' : 'Hide Guide') : (lang === 'ne' ? 'इमेल किन नआएको हुन सक्छ?' : 'Why did email not arrive in Gmail?')}</span>
            </button>
          </div>

          {showDnsHelp && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/50 text-[11px] text-amber-200 space-y-2 mt-1">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold text-white">
                    {lang === 'ne' 
                      ? 'info@shubhapatro.com मा सिधै इमेल किन प्राप्त भएन?' 
                      : 'Why was direct email to info@shubhapatro.com not received in inbox?'}
                  </strong>
                  <p className="text-stone-300 mt-1 leading-relaxed">
                    {lang === 'ne'
                      ? 'डोमेन shubhapatro.com नयाँ भएकोले Cloudflare मा "Email Routing" (निःशुल्क) सक्रिय गर्नुपर्छ। १. Cloudflare Dashboard मा shubhapatro.com खोल्नुहोस्। २. "Email Routing" मा गई info@shubhapatro.com बाट shyamthapa281@gmail.com मा Forward गर्नुहोस्। ३. DNS मा Cloudflare ले स्वचालित MX रेकर्ड थपिदिन्छ। यसपछि जोसुकैले info@shubhapatro.com मा पठाएको इमेल सिधै तपाईंको जिमेलमा आउँछ!'
                      : 'Because shubhapatro.com is a custom domain, you need to turn on free Cloudflare Email Routing: 1. In Cloudflare, go to Email Routing. 2. Route info@shubhapatro.com to forward to shyamthapa281@gmail.com. 3. Cloudflare will automatically add the free MX DNS records. Then all emails will land straight into your Gmail!'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          {feedbacks.length === 0 ? (
            <div className="text-center py-12 text-stone-400 space-y-2">
              <Inbox className="w-10 h-10 mx-auto text-stone-600" />
              <p className="text-sm">{lang === 'ne' ? 'अहिले कुनै सन्देश छैन।' : 'No messages in inbox yet.'}</p>
            </div>
          ) : (
            feedbacks.map((item) => {
              const formattedDate = item.createdAt 
                ? new Date(item.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : item.date || 'Recently';

              const isReplyable = item.email && item.email !== 'Not specified' && item.email.includes('@');

              return (
                <div 
                  key={item.id} 
                  className="bg-stone-800/90 border border-stone-700/80 rounded-xl p-4 space-y-2.5 transition-all hover:border-stone-600 shadow-sm"
                >
                  {/* Top line: Name, Category, Date */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-700/50 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-white text-xs sm:text-sm">{item.name}</span>
                        {item.email && item.email !== 'Not specified' && (
                          <span className="text-[11px] text-stone-400 block sm:inline sm:ml-2">
                            ({item.email})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.category || item.type || 'advice'}
                      </span>
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-500" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="text-xs text-stone-200 leading-relaxed bg-stone-900/60 p-3 rounded-lg border border-stone-800">
                    "{item.message}"
                  </div>

                  {/* Action buttons (Reply via Gmail, Outlook, Copy email) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ne' ? 'सर्भरमा सुरक्षित दर्ता भएको' : 'Saved on server inbox'}</span>
                    </div>

                    {isReplyable && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(item.email, item.id)}
                          className="px-2 py-1 rounded bg-stone-900 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1 border border-stone-700 cursor-pointer"
                        >
                          {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === item.id ? (lang === 'ne' ? 'कपी भयो' : 'Copied') : (lang === 'ne' ? 'इमेल कपी' : 'Copy Email')}</span>
                        </button>

                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(item.email)}&su=${encodeURIComponent(`Response from Shubha Patro to ${item.name}`)}&body=${encodeURIComponent(`Dear ${item.name},\n\nThank you for reaching out to Shubha Patro!\n\nRegarding your note: "${item.message}"\n\nWarm regards,\nShubha Patro Team\ninfo@shubhapatro.com`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-800/60 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                          title="Reply directly with Gmail"
                        >
                          <Send className="w-3 h-3" />
                          <span>Gmail Reply</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>

                        <a
                          href={`https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(item.email)}&subject=${encodeURIComponent(`Response from Shubha Patro to ${item.name}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-blue-950/70 hover:bg-blue-900 text-blue-200 border border-blue-800/60 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                          title="Reply directly with Outlook"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Outlook</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between text-xs text-stone-400">
          <span>info@shubhapatro.com • Lalitpur, Nepal & Melbourne, Australia</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors cursor-pointer"
          >
            {lang === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
