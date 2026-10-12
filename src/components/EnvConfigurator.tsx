import React, { useState } from 'react';
import { Settings, Copy, Check, ShieldCheck, Download, Code, Globe, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { generateBotZip, downloadBlob } from '../utils/zipGenerator';
import { BOT_FILES, BotFile } from '../data/botFiles';

interface UserEnvState {
  stringSession: string;
  apiId: string;
  apiHash: string;
  replyText: string;
  deleteTime: string;
  autoReplyMode: string;
  port: string;
  groupAutoReply: string;
  authGroups: string;
}

export const EnvConfigurator: React.FC = () => {
  const [env, setEnv] = useState<UserEnvState>({
    stringSession: '',
    apiId: '',
    apiHash: '',
    replyText: 'Hello {mention}! Main is group me auto-reply ke liye active hoon. Join our channel or DM me directly! ✨',
    deleteTime: '30',
    autoReplyMode: 'all',
    port: '8080',
    groupAutoReply: 'True',
    authGroups: ''
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDownloadingCustom, setIsDownloadingCustom] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generateEnvString = () => {
    return `# Telegram Auto-Reply Userbot Environment Variables
# Aap ise Repo ke .env me rakh sakte hain YA Koyeb me daal sakte hain!

STRING_SESSION="${env.stringSession}"
API_ID="${env.apiId}"
API_HASH="${env.apiHash}"
REPLY_TEXT="${env.replyText}"
DELETE_TIME=${env.deleteTime || '30'}
AUTO_REPLY_MODE=${env.autoReplyMode || 'all'}
PORT=${env.port || '8080'}
GROUP_AUTO_REPLY=${env.groupAutoReply || 'True'}
AUTH_GROUPS="${env.authGroups}"
`;
  };

  const handleDownloadWithEnv = async () => {
    try {
      setIsDownloadingCustom(true);

      const envContent = generateEnvString();

      // Create custom .env file
      const envFile: BotFile = {
        path: '.env',
        name: '.env',
        category: 'config',
        description: 'Pre-configured environment variables for direct GitHub repo upload',
        content: envContent
      };

      // Also update vars.py default fallback values if filled!
      const updatedFiles: BotFile[] = BOT_FILES.map((f) => {
        if (f.path === 'vars.py') {
          let updatedContent = f.content;
          if (env.apiId) {
            updatedContent = updatedContent.replace(
              /API_ID = int\(os\.environ\.get\("API_ID", "[^"]*"\)\)/,
              `API_ID = int(os.environ.get("API_ID", "${env.apiId}"))`
            );
          }
          if (env.apiHash) {
            updatedContent = updatedContent.replace(
              /API_HASH = os\.environ\.get\("API_HASH", "[^"]*"\)/,
              `API_HASH = os.environ.get("API_HASH", "${env.apiHash}")`
            );
          }
          if (env.stringSession) {
            updatedContent = updatedContent.replace(
              /STRING_SESSION = os\.environ\.get\("STRING_SESSION", "[^"]*"\)\.strip\(\)/,
              `STRING_SESSION = os.environ.get("STRING_SESSION", "${env.stringSession}").strip()`
            );
          }
          if (env.replyText) {
            const escaped = env.replyText.replace(/"/g, '\\"');
            updatedContent = updatedContent.replace(
              /DEFAULT_REPLY = os\.environ\.get\(\s*"REPLY_TEXT",\s*"[^"]*"\s*\)/,
              `DEFAULT_REPLY = os.environ.get("REPLY_TEXT", "${escaped}")`
            );
          }
          return { ...f, content: updatedContent };
        }
        return f;
      });

      // Include .env file in zip
      const finalFiles = [...updatedFiles.filter((f) => f.path !== '.env'), envFile];

      const blob = await generateBotZip(finalFiles);
      downloadBlob(blob, 'My-auto-bot-arpite-main.zip');

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloadingCustom(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8 space-y-6">
      {/* Header Banner */}
      <div className="pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> Dono Options Supported (Repo .env YA Koyeb Dashboard)
          </div>
          <h2 className="text-xl font-bold text-white">Environment Configuration (Repo YA Koyeb)</h2>
          <p className="text-xs text-slate-400 mt-1">
            Bhai aapko jahan asaan lage wahan daal sakte hain: <b>Repo ke .env file me</b> daal kar GitHub push karein YA direct <b>Koyeb settings me</b> add karein!
          </p>
        </div>
      </div>

      {/* Two Choice Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
            <Code className="w-4 h-4" />
            <span>Option 1: Repo ke .env me daal kar GitHub push</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Yahan niche form me details bhar dein aur <b>"Download Pre-Configured ZIP"</b> dabayein. ZIP me aapka <code>.env</code> file pre-filled aayega. Direct GitHub upload karein aur Koyeb me kuch bhi type karne ki zaroorat nahi padegi!
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
            <Globe className="w-4 h-4" />
            <span>Option 2: Koyeb Environment Variables Dashboard</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Agar aap GitHub par credentials public nahi karna chahte, toh repo ko default rehne dein aur Koyeb App settings ➔ <b>"Environment variables"</b> me yeh values copy karke paste kar dein.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span>Apne Userbot Credentials Yahan Fill Karein:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              STRING_SESSION <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={env.stringSession}
              onChange={(e) => setEnv({ ...env, stringSession: e.target.value })}
              placeholder="Paste your Pyrogram string session here..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Aapke Telegram Account ka Pyrogram/Pyrofork string session.
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              DELETE_TIME (Seconds) <span className="text-emerald-400 font-mono">(Aapka 30-sec timer)</span>
            </label>
            <input
              type="number"
              value={env.deleteTime}
              onChange={(e) => setEnv({ ...env, deleteTime: e.target.value })}
              placeholder="30"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Default 30 seconds set hai (reply 30 sec baad auto-delete hoga).
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              API_ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={env.apiId}
              onChange={(e) => setEnv({ ...env, apiId: e.target.value })}
              placeholder="e.g. 12345678"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              my.telegram.org se mila numeric API ID.
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              API_HASH <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={env.apiHash}
              onChange={(e) => setEnv({ ...env, apiHash: e.target.value })}
              placeholder="e.g. 4d8b...your_hash"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              my.telegram.org se mila API Hash code.
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              AUTH_GROUPS (Konsa Group Pe Reply Jayega?)
            </label>
            <input
              type="text"
              value={env.authGroups}
              onChange={(e) => setEnv({ ...env, authGroups: e.target.value })}
              placeholder="Khali chhod dein (HAR GROUP ke liye) ya ID daalein (e.g. -1001234567890)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <span className="text-[10px] text-emerald-400 mt-1 block font-medium">
              💡 Khali chhodenge toh jis-jis group me aapka account add hai, un SABHI me reply karega!
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            REPLY_TEXT (Jo SMS reply group members ko jayega)
          </label>
          <textarea
            value={env.replyText}
            onChange={(e) => setEnv({ ...env, replyText: e.target.value })}
            rows={3}
            placeholder="Aapka custom auto-reply message..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans resize-none"
          />
          <div className="flex gap-2 text-[10px] text-slate-400 mt-1">
            <span>Tags:</span>
            <code className="text-cyan-300 bg-slate-900 px-1 rounded">{'{mention}'}</code>
            <code className="text-cyan-300 bg-slate-900 px-1 rounded">{'{name}'}</code>
            <code className="text-cyan-300 bg-slate-900 px-1 rounded">{'{group_name}'}</code>
          </div>
        </div>
      </div>

      {/* Generated .env Preview & Action Buttons */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Generated .env File Content:
            </h4>
            <p className="text-[11px] text-slate-500">
              Yeh content aapke ZIP file ke <code>.env</code> me add hoga, ya Koyeb me copy-paste kar sakte hain.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => copyToClipboard(generateEnvString(), 'env-all')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              {copiedKey === 'env-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'env-all' ? 'Copied .env!' : 'Copy for Koyeb'}</span>
            </button>

            <button
              onClick={handleDownloadWithEnv}
              disabled={isDownloadingCustom}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-70"
            >
              {isDownloadingCustom ? (
                <span>Packing ZIP...</span>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Downloaded with .env!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ZIP (With Pre-Filled .env)</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-cyan-300/90 overflow-x-auto">
          <pre>{generateEnvString()}</pre>
        </div>
      </div>
    </div>
  );
};
