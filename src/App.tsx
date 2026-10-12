/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { DiagnosticCard } from './components/DiagnosticCard';
import { PrivacyGuideModal } from './components/PrivacyGuideModal';
import { ChatSimulator } from './components/ChatSimulator';
import { RuleManager, TriggerRule } from './components/RuleManager';
import { FileViewer } from './components/FileViewer';
import { DeployGuide } from './components/DeployGuide';
import { EnvConfigurator } from './components/EnvConfigurator';
import { INITIAL_TRIGGER_RULES, BOT_FILES } from './data/botFiles';
import {
  Download,
  ShieldAlert,
  Sparkles,
  GitBranch,
  FileCode,
  MessageSquare,
  Sliders,
  Settings,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [rules, setRules] = useState<TriggerRule[]>(INITIAL_TRIGGER_RULES);
  const [activeTab, setActiveTab] = useState<'simulator' | 'env' | 'rules' | 'files' | 'deploy'>('simulator');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner and Header */}
      <Header
        onOpenPrivacyGuide={() => setIsPrivacyModalOpen(true)}
        rules={rules}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Diagnostic Explanation Banner */}
        <DiagnosticCard
          onOpenPrivacyGuide={() => setIsPrivacyModalOpen(true)}
        />

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-6 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Group Chat & 30s Delete Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('env')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'env'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Repo .env / Koyeb Configurator</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'rules'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Keyword Rules ({rules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'files'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Fixed Files ({BOT_FILES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'deploy'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Koyeb & GitHub Guide</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'simulator' && (
          <div>
            <ChatSimulator rules={rules} />
            <EnvConfigurator />
          </div>
        )}

        {activeTab === 'env' && (
          <EnvConfigurator />
        )}

        {activeTab === 'rules' && (
          <RuleManager rules={rules} onUpdateRules={setRules} />
        )}

        {activeTab === 'files' && (
          <FileViewer files={BOT_FILES} />
        )}

        {activeTab === 'deploy' && (
          <DeployGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          Telegram Auto-Reply Userbot • Pyrofork 2.3.45 • 30-Second Auto-Delete • Koyeb & Repo .env Ready.
        </p>
      </footer>

      {/* Privacy Mode Step-by-Step Modal */}
      <PrivacyGuideModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}
