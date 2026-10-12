import React from 'react';
import { UserCheck, Clock, ShieldCheck, Cpu, ArrowRight, Zap, CheckCircle2, Users, HelpCircle } from 'lucide-react';

interface DiagnosticCardProps {
  onOpenPrivacyGuide: () => void;
}

export const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ onOpenPrivacyGuide }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> Aapka Exact Userbot Logic 100% Configured
          </div>
          <h2 className="text-xl font-bold text-white">Aapka Telegram Auto-Reply Userbot (Bina Admin + 30-Sec Auto Delete)</h2>
          <p className="text-sm text-slate-400 mt-1">
            Aapne pucha: <b className="text-cyan-300">"Konsa group pe SMS member ka reply jayega yeh toh bolo?"</b>
          </p>
        </div>
      </div>

      {/* Direct Clear Answer to "Konsa Group Pe Reply Jayega?" */}
      <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-950 border border-blue-500/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
            <Users className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">
              👉 Jawab: Jis-Jis Group Mein Aapka Telegram Account Add Hai, Un HAR EK GROUP Mein Reply Jayega!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kyunki yeh ek <b>Userbot</b> hai, isko kisi ek group tak limit nahi kiya gaya hai:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="font-semibold text-emerald-400 block mb-1">
                  1. Default Mode (Har Group Mein):
                </span>
                <span className="text-slate-300 leading-relaxed block">
                  Aapka Telegram account chahe kisi bhi naye ya purane group me add ho (chahe aapka khud ka group ho ya kisi aur ka), <b>jis group me bhi koi member SMS karega, usi group me member ke message par auto-reply jayega aur 30 second baad delete ho jayega!</b>
                </span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="font-semibold text-cyan-400 block mb-1">
                  2. Specific Group Mode (Sirf Chuninda Group Mein):
                </span>
                <span className="text-slate-300 leading-relaxed block">
                  Agar aap chahte hain ki sabhi groups me na jaye, balki <b>sirf kisi 1 ya 2 group me jaye</b>, toh aap <code>AUTH_GROUPS</code> me us group ka ID (jaise <code>-1001234567890</code>) daal sakte hain. Agar khali chhodenge toh sabhi groups me chalega!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {/* Feature 1 */}
        <div className="bg-slate-950/60 border border-blue-500/30 rounded-xl p-5 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-medium text-blue-400">Feature #1</span>
              <h3 className="font-semibold text-slate-100 text-sm">Bina Admin Bane Har Group Me</h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kisi ke bhi Telegram group me aapka account add hone par, bina group admin bane member ke SMS read karke auto-reply bhejta hai.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-blue-400 font-mono font-semibold">filters.group & ~filters.me</span>
            <span className="text-emerald-400 font-medium">Ready</span>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="bg-slate-950/60 border border-amber-500/30 rounded-xl p-5 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-medium text-amber-400">Feature #2</span>
              <h3 className="font-semibold text-slate-100 text-sm">30-Second Auto-Delete</h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Aapka userbot reply bhejte hi background timer chalu karta hai aur <b>30 seconds</b> ke baad reply message ko khud delete kar deta hai taaki group spam na lage!
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-amber-400 font-mono font-semibold">DELETE_TIME = 30</span>
            <span className="text-emerald-400 font-medium">Self-Destruct</span>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="bg-slate-950/60 border border-purple-500/30 rounded-xl p-5 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-medium text-purple-400">Feature #3</span>
              <h3 className="font-semibold text-slate-100 text-sm">Koyeb Port 8080 Health Check</h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Koyeb par deployment sleep ya crash na ho, iske liye <code>plugins/route.py</code> aiohttp server port 8080 par continuously <code>200 OK</code> response deta hai.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-purple-400 font-mono font-semibold">PORT = 8080</span>
            <span className="text-emerald-400 font-medium">Always Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
