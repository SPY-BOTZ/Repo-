import React from 'react';
import { X, Check, Copy, AlertTriangle, Shield, CheckCircle, ExternalLink } from 'lucide-react';

interface PrivacyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyGuideModal: React.FC<PrivacyGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      step: 1,
      title: "Open @BotFather on Telegram",
      desc: "Apne Telegram app mein @BotFather search karein aur open karein.",
      actionText: "Search @BotFather in Telegram",
      badge: "Step 1"
    },
    {
      step: 2,
      title: "Send /setprivacy Command",
      desc: "BotFather ko yeh command bhein:",
      command: "/setprivacy",
      badge: "Step 2"
    },
    {
      step: 3,
      title: "Choose Your Auto-Reply Bot",
      desc: "List me se apne bot ka username select karein (e.g. @YourAutoBot).",
      actionText: "Select @YourBotUsername",
      badge: "Step 3"
    },
    {
      step: 4,
      title: "Click 'Disable' (Turn OFF Privacy)",
      desc: "BotFather puchega 'Turn privacy mode ON or OFF?'. Aapko 'Disable' pe click karna hai!",
      result: "SUCCESS: 'SUCCESS: privacy mode disabled' message aayega.",
      badge: "Step 4 (Final)"
    },
    {
      step: 5,
      title: "Group Admin & Restart",
      desc: "Ab apne Telegram Group me jaake apne Bot ko 'Add as Admin' karein taaki bot group ke saare messages read karke auto reply de sake.",
      actionText: "Group Settings ➔ Administrators ➔ Add Bot as Admin",
      badge: "Step 5"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">How To Fix Telegram Group Privacy Mode</h3>
              <p className="text-xs text-slate-400">Sabse important step - Iske bina koi bhi Telegram bot group messages read nahi kar sakta!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <strong>Yeh issue kyun aaya?</strong> Telegram bot default security settings me group members ke text messages bots ko block kar deta hai. Jab aap <code>/setprivacy</code> DISABLE karte hain, tabhi bot member ke SMS ko read karke auto reply trigger karta hai!
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((st, idx) => (
              <div key={st.step} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-sm flex items-center justify-center shrink-0">
                  {st.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-white">{st.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {st.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{st.desc}</p>

                  {st.command && (
                    <div className="mt-2 flex items-center gap-2">
                      <code className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400">
                        {st.command}
                      </code>
                      <button
                        onClick={() => copyText(st.command!, idx)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Copy command"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}

                  {st.result && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{st.result}</span>
                    </div>
                  )}

                  {st.actionText && (
                    <div className="mt-2 text-xs font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
                      ➔ {st.actionText}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-950/30 border border-blue-500/20 rounded-xl text-xs text-slate-300">
            💡 <strong>Pro Tip:</strong> Agar aap bot ko group me Admin nahi banana chahte to sirf <code>/setprivacy</code> Disable kar deinge tab bhi auto-reply 100% chalega! Lekin Admin banane se bot messages fast read karta hai aur delete spam bhi kar sakta hai.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all"
          >
            I Understand, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
