import React, { useState } from 'react';
import { Download, UserCheck, Clock, Zap, CheckCircle2, Check, Loader2 } from 'lucide-react';
import { generateBotZip, downloadBlob } from '../utils/zipGenerator';
import { BOT_FILES, BotFile } from '../data/botFiles';
import { TriggerRule } from './RuleManager';

interface HeaderProps {
  onOpenPrivacyGuide: () => void;
  rules: TriggerRule[];
}

export const Header: React.FC<HeaderProps> = ({ onOpenPrivacyGuide, rules }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const zipBlob = await generateBotZip(BOT_FILES);
      downloadBlob(zipBlob, 'My-auto-bot-arpite-main.zip');

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Title and Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <UserCheck className="w-3.5 h-3.5" /> Telegram Userbot (No Admin Needed)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5" /> 30-Second Auto-Delete Reply
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Zap className="w-3.5 h-3.5" /> Koyeb Port 8080 Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Auto-Reply Userbot (With 30-Sec Auto Delete)
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Aapka <span className="font-mono text-cyan-300">My-auto-bot-arpite</span> Userbot fixed hai. Kisi ke bhi group me bina admin bane, kisi member ke SMS par instant auto-reply karega aur <b>30 second baad reply message delete ho jayega!</b>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Packaging Userbot ZIP...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-5 h-5 text-emerald-300" />
                  <span>Downloaded ZIP!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download Fixed ZIP (My-auto-bot-arpite.zip)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
