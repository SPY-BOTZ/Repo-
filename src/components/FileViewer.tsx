import React, { useState } from 'react';
import { BotFile } from '../data/botFiles';
import { FileCode, Copy, Check, Folder, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface FileViewerProps {
  files: BotFile[];
}

export const FileViewer: React.FC<FileViewerProps> = ({ files }) => {
  const [selectedPath, setSelectedPath] = useState<string>('plugins/auto_reply.py');
  const [copied, setCopied] = useState(false);

  const currentFile = files.find((f) => f.path === selectedPath) || files[0];

  const handleCopy = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeColor = (category: BotFile['category']) => {
    switch (category) {
      case 'plugin':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'core':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'deploy':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'config':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mb-8">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Repository Files & Fix Inspector</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Har ek file ka exact fixed Python source code dekhein jo ZIP ke andar pack kiya gaya hai.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> 16 Files Ready
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* File Tree Sidebar */}
        <div className="lg:col-span-4 bg-slate-950/70 border-r border-slate-800 p-3 overflow-y-auto max-h-[560px]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">
            📁 My-auto-bot-arpite-main
          </div>
          <div className="space-y-1">
            {files.map((file) => {
              const isSelected = file.path === selectedPath;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedPath(file.path)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-blue-600/15 text-blue-300 font-semibold border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span className="font-mono truncate">{file.path}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase shrink-0 font-medium ${getBadgeColor(file.category)}`}>
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content View */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950">
          {/* File Action Bar */}
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="min-w-0 pr-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white truncate">{currentFile.path}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-medium ${getBadgeColor(currentFile.category)}`}>
                  {currentFile.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {currentFile.description}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Code text */}
          <div className="p-4 flex-1 overflow-x-auto overflow-y-auto max-h-[500px] bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
            <pre>
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
