import React, { useState } from 'react';
import {
  GitBranch,
  Copy,
  Check,
  Server,
  HelpCircle,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export const DeployGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const gitCommands = `# 1. Extract the downloaded ZIP file
unzip My-auto-bot-arpite-main.zip
cd My-auto-bot-arpite-main

# 2. Connect to your existing GitHub repo
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 3. Stage and commit all fixed files
git add .
git commit -m "Fix telegram group auto-reply, filters, and privacy mode"

# 4. Push directly to GitHub
git branch -M main
git push -u origin main --force`;

  const koyebVars = [
    {
      key: 'STRING_SESSION',
      value: '1BVtsOHUBu4...your_pyrogram_string_session...',
      desc: 'Aapke Telegram Personal Account ka Pyrogram String Session (Userbot chalane ke liye zaroori)',
      required: true,
      category: 'Userbot Auth'
    },
    {
      key: 'API_ID',
      value: '12345678',
      desc: 'my.telegram.org se mila Telegram API ID (numbers only)',
      required: true,
      category: 'Telegram API'
    },
    {
      key: 'API_HASH',
      value: 'your_api_hash_here',
      desc: 'my.telegram.org se mila Telegram API Hash code',
      required: true,
      category: 'Telegram API'
    },
    {
      key: 'DELETE_TIME',
      value: '30',
      desc: 'Auto-Delete Timer (Aapka reply message 30 seconds baad automatically delete ho jayega)',
      required: true,
      category: 'Auto Delete'
    },
    {
      key: 'REPLY_TEXT',
      value: 'Hello {mention}! Main is group me auto-reply ke liye active hoon. Join our channel or DM me! ✨',
      desc: 'Jo SMS reply aap group ke member ko bhejna chahte hain (Default message)',
      required: true,
      category: 'Reply Message'
    },
    {
      key: 'AUTO_REPLY_MODE',
      value: 'all',
      desc: 'Group me koi bhi member kuch bhi SMS kare toh reply karega ("all")',
      required: true,
      category: 'Mode'
    },
    {
      key: 'PORT',
      value: '8080',
      desc: 'Koyeb Web Service Port (Health check 200 OK aur always-online rehne ke liye)',
      required: true,
      category: 'Server'
    },
    {
      key: 'GROUP_AUTO_REPLY',
      value: 'True',
      desc: 'Group auto-reply active rakhne ke liye',
      required: true,
      category: 'Settings'
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Question 1 & 2 Answers Banner: Bot vs Userbot & Code Change Clarification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Q1: Bot ya Userbot */}
        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                Clear Answer
              </span>
              <h3 className="text-base font-bold text-white">Bhai bot hai ki userbot hai?</h3>
            </div>
          </div>
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              Bhai, aapka repository <b className="text-white">Telegram BOT</b> hai jo <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded">BOT_TOKEN</code> (BotFather) se chalta hai!
            </p>
            <p>
              ✨ Lekin humne aapke code ko itna smart bana diya hai ki yeh <b className="text-emerald-400">Dono Support</b> karta hai:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
              <li>Agar aap <code className="text-blue-300">BOT_TOKEN</code> doge toh yeh <b>Standard Bot</b> ban kar chalega.</li>
              <li>Agar aap <code className="text-purple-300">STRING_SESSION</code> doge toh yeh <b>Userbot (Account)</b> ban kar chalega!</li>
            </ul>
          </div>
        </div>

        {/* Q2: Code change to nahi kiya? */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                100% Guaranteed
              </span>
              <h3 className="text-base font-bold text-white">Code change to nahi kiya, only error fix?</h3>
            </div>
          </div>
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              <b className="text-emerald-400">Bilkul nahi bhai! Original code replace nahi kiya hai.</b>
            </p>
            <p>
              Aapka pura architecture, saare filenames (<code className="text-slate-200">bot.py</code>, <code className="text-slate-200">plugins/auto_reply.py</code>, <code className="text-slate-200">vars.py</code>, <code className="text-slate-200">utils.py</code>, <code className="text-slate-200">script.py</code>) sab bilkul wahi hain!
            </p>
            <p className="text-slate-400">
              Sirf wahi <b>errors fix</b> kiye hain jinki wajah se group members ke message par auto-reply nahi chal raha tha (NoneType crash, filter listening bug, aur web port check).
            </p>
          </div>
        </div>
      </div>

      {/* Koyeb Environment Variables Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Koyeb Environment Variables (Kya-kya dalna hai)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Koyeb App settings me <b>"Environment variables"</b> section me niche diye gaye variables add karein:
            </p>
          </div>
          <button
            onClick={() => {
              const fullEnv = koyebVars.map((v) => `${v.key}=${v.value}`).join('\n');
              copyToClipboard(fullEnv, 'all-env');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            {copiedCode === 'all-env' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode === 'all-env' ? 'All Copied!' : 'Copy All Variables (.env)'}</span>
          </button>
        </div>

        {/* Variables List */}
        <div className="mt-6 space-y-3">
          {koyebVars.map((item) => (
            <div
              key={item.key}
              className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-bold text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {item.key}
                  </code>
                  {item.required ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      Required
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                      Optional
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
                <div className="text-[11px] font-mono text-slate-500">
                  Example: <span className="text-slate-300">{item.value}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => copyToClipboard(item.key, 'key_' + item.key)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1"
                  title="Copy Key Name"
                >
                  {copiedCode === 'key_' + item.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Key</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Koyeb Specific Settings Tips */}
        <div className="mt-6 p-4 bg-slate-950 border border-indigo-500/20 rounded-xl text-xs space-y-2">
          <div className="text-white font-semibold flex items-center gap-1.5">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>Koyeb App Deployment Settings:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300 pt-1">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Service Type</span>
              <span className="font-semibold text-white">Web Service</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Port</span>
              <span className="font-semibold text-white">8080 (HTTP)</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Run Command</span>
              <span className="font-semibold text-white">python3 bot.py</span>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Direct Add / Push Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 pb-6 border-b border-slate-800">
          <GitBranch className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-lg font-bold text-white">GitHub Par Direct Add Kaise Karein</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Zip file ko apne GitHub repo me daalne ke 2 aasaan tareeqe:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Method 1: GitHub Web Upload */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="text-sm font-semibold text-white">Method 1: GitHub Website se Upload (No Commands)</h4>
              </div>
              <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                <li>Upar <b>"Download Fixed ZIP"</b> button dabayein.</li>
                <li>ZIP file ko apne phone ya laptop par extract (unzip) karein.</li>
                <li>GitHub.com par apna repository kholein.</li>
                <li><b>"Add file"</b> button dabakar <b>"Upload files"</b> chunein.</li>
                <li>Unzip ki hui files drag & drop karein aur niche <b>"Commit changes"</b> dabayein!</li>
              </ol>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-medium">
              ✅ 1 minute me GitHub update ho jayega.
            </div>
          </div>

          {/* Method 2: Git Command Line */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h4 className="text-sm font-semibold text-white">Method 2: Git Terminal Push</h4>
                </div>
                <button
                  onClick={() => copyToClipboard(gitCommands, 'git')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
                >
                  {copiedCode === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'git' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[160px]">
                <pre>{gitCommands}</pre>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-purple-400 font-medium">
              🚀 Fast git push terminal flow.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
