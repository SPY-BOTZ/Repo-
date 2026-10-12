import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Tag, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';
import { INITIAL_TRIGGER_RULES, TriggerRuleItem } from '../data/botFiles';

export type TriggerRule = TriggerRuleItem;

interface RuleManagerProps {
  rules: TriggerRule[];
  onUpdateRules: (rules: TriggerRule[]) => void;
}

export const RuleManager: React.FC<RuleManagerProps> = ({ rules, onUpdateRules }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTriggers, setNewTriggers] = useState('');
  const [newReply, setNewReply] = useState('');
  const [newMatchType, setNewMatchType] = useState<'contains' | 'word' | 'exact'>('contains');
  const [newBtnText, setNewBtnText] = useState('');
  const [newBtnUrl, setNewBtnUrl] = useState('');

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTriggers.trim() || !newReply.trim()) return;

    const triggerList = newTriggers
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const newRule: TriggerRule = {
      id: 'rule_' + Date.now(),
      triggers: triggerList,
      matchType: newMatchType,
      reply: newReply.trim(),
      enabled: true,
      hasButton: Boolean(newBtnText.trim() && newBtnUrl.trim()),
      buttons:
        newBtnText.trim() && newBtnUrl.trim()
          ? [{ text: newBtnText.trim(), url: newBtnUrl.trim() }]
          : []
    };

    onUpdateRules([...rules, newRule]);
    setNewTriggers('');
    setNewReply('');
    setNewBtnText('');
    setNewBtnUrl('');
    setIsAdding(false);
  };

  const handleDeleteRule = (id: string) => {
    onUpdateRules(rules.filter((r) => r.id !== id));
  };

  const handleToggleRule = (id: string) => {
    onUpdateRules(
      rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Auto-Reply Keywords & Responses</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Jab group member in keywords me se koi message karega, bot turant response bhejega.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Cancel' : 'Add New Trigger'}</span>
        </button>
      </div>

      {/* Add New Trigger Form */}
      {isAdding && (
        <form onSubmit={handleAddRule} className="mt-6 p-5 bg-slate-950 border border-indigo-500/30 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">New Auto-Reply Rule</h4>
            <span className="text-xs text-indigo-400 font-mono">Will be included in ZIP</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Keywords / Triggers (Comma separated)
              </label>
              <input
                type="text"
                value={newTriggers}
                onChange={(e) => setNewTriggers(e.target.value)}
                placeholder="e.g. payment, upi, qr, gpay"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Comma laga kar multiple keywords likh sakte hain.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Match Type
              </label>
              <select
                value={newMatchType}
                onChange={(e) => setNewMatchType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="contains">Contains (Sentence me kahin bhi ho)</option>
                <option value="word">Word Match (Alag word ki tarah ho)</option>
                <option value="exact">Exact (Sirf wahi exact text ho)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Bot Reply Message (Markdown & Variables supported)
            </label>
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              rows={3}
              placeholder="e.g. Hello {mention}! Humara UPI ID: payment@upi hai. Screenshot admin ko bhein."
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
            <div className="flex gap-2 text-[10px] text-slate-400 mt-1">
              <span>Variables:</span>
              <code className="text-indigo-300 bg-slate-900 px-1 rounded">{'{mention}'}</code>
              <code className="text-indigo-300 bg-slate-900 px-1 rounded">{'{name}'}</code>
              <code className="text-indigo-300 bg-slate-900 px-1 rounded">{'{group_name}'}</code>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-900">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Optional Button Text
              </label>
              <input
                type="text"
                value={newBtnText}
                onChange={(e) => setNewBtnText(e.target.value)}
                placeholder="e.g. 💳 Pay Now or 📞 Contact"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Optional Button URL
              </label>
              <input
                type="url"
                value={newBtnUrl}
                onChange={(e) => setNewBtnUrl(e.target.value)}
                placeholder="e.g. https://t.me/yourusername"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30"
            >
              Save Rule
            </button>
          </div>
        </form>
      )}

      {/* Rules List */}
      <div className="mt-6 space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`border rounded-xl p-4 transition-all ${
              rule.enabled
                ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                : 'bg-slate-950/40 border-slate-900 opacity-60'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                {/* Triggers badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mr-1">
                    Triggers:
                  </span>
                  {rule.triggers.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-mono font-medium"
                    >
                      "{t}"
                    </span>
                  ))}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    match: {rule.matchType}
                  </span>
                </div>

                {/* Response Preview */}
                <div className="text-xs text-slate-200 whitespace-pre-wrap bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 font-sans">
                  {rule.reply}
                </div>

                {/* Buttons if any */}
                {rule.hasButton && rule.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {rule.buttons.map((btn, bIdx) => (
                      <span
                        key={bIdx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-indigo-300 text-[11px] font-medium border border-slate-700"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {btn.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-start">
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                    rule.enabled
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {rule.enabled ? 'Active' : 'Disabled'}
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Delete trigger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
