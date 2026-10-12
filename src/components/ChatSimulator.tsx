import React, { useState, useEffect } from 'react';
import { Send, UserCheck, Clock, Users, RefreshCw, Sparkles, CheckCircle, Trash2, Play } from 'lucide-react';
import { TriggerRuleItem, INITIAL_USERBOT_CONFIG } from '../data/botFiles';

interface ChatSimulatorProps {
  rules: TriggerRuleItem[];
}

interface SimulatedMessage {
  id: string;
  sender: 'member' | 'userbot';
  senderName: string;
  text: string;
  timestamp: string;
  countdown?: number;
  isDeleted?: boolean;
}

export const ChatSimulator: React.FC<ChatSimulatorProps> = ({ rules }) => {
  const [messages, setMessages] = useState<SimulatedMessage[]>([
    {
      id: 'm1',
      sender: 'member',
      senderName: 'Rahul (Member in Group)',
      text: 'bhai link dedo koi group ka',
      timestamp: '10:45 AM'
    },
    {
      id: 'm2',
      sender: 'userbot',
      senderName: 'Your Telegram Account (Userbot)',
      text: 'Hello Rahul! Main is group me auto-reply ke liye active hoon. Join our channel or DM me directly! ✨',
      timestamp: '10:45 AM',
      countdown: 18,
      isDeleted: false
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [activeReplyText, setActiveReplyText] = useState(INITIAL_USERBOT_CONFIG.replyText);
  const [deleteTime, setDeleteTime] = useState(30);

  // Live countdown timer for simulated userbot auto-delete
  useEffect(() => {
    const timer = setInterval(() => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.sender === 'userbot' && !msg.isDeleted && msg.countdown !== undefined) {
            if (msg.countdown <= 1) {
              return { ...msg, countdown: 0, isDeleted: true };
            }
            return { ...msg, countdown: msg.countdown - 1 };
          }
          return msg;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputVal).trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const memberMsg: SimulatedMessage = {
      id: 'msg_' + Date.now(),
      sender: 'member',
      senderName: 'Aman (Group Member)',
      text: text,
      timestamp: timeStr
    };

    setMessages((prev) => [...prev, memberMsg]);
    if (!textToSend) setInputVal('');

    // Userbot instant auto-reply
    setTimeout(() => {
      const userbotMsg: SimulatedMessage = {
        id: 'reply_' + Date.now(),
        sender: 'userbot',
        senderName: 'Your Telegram Account (Userbot)',
        text: activeReplyText.replace('{mention}', '@Aman').replace('{name}', 'Aman').replace('{group_name}', 'Anyone\'s Group'),
        timestamp: timeStr,
        countdown: deleteTime,
        isDeleted: false
      };
      setMessages((prev) => [...prev, userbotMsg]);
    }, 500);
  };

  const fastForwardDelete = () => {
    setMessages((prev) =>
      prev.map((m) =>
        m.sender === 'userbot' && !m.isDeleted ? { ...m, countdown: 0, isDeleted: true } : m
      )
    );
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mb-8">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Live Userbot Group Auto-Reply & 30s Auto-Delete Simulator</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Kisi ke bhi group me (bina admin bane) member ke SMS karne par auto-reply aur 30 second me self-destruct test karein.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fastForwardDelete}
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 flex items-center gap-1.5 transition-colors"
            title="Fast forward to see messages get deleted"
          >
            <Clock className="w-3.5 h-3.5" /> Fast-Forward 30s Delete
          </button>
          <button
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Clear Chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Chat Screen */}
        <div className="lg:col-span-8 flex flex-col bg-[#0e1621] border-r border-slate-800">
          {/* Group Header Bar */}
          <div className="bg-[#17212b] px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                👥
              </div>
              <div>
                <div className="text-white font-semibold flex items-center gap-2">
                  <span>Anyone's Random Group</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    You are NOT Admin (Regular Member)
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Userbot reads all messages via string session
                </div>
              </div>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Userbot Active</span>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[360px]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12">
                <Users className="w-8 h-8 text-slate-600 mb-2" />
                <p>Chat is empty. Send a message to see Userbot auto-reply and 30-sec delete!</p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'userbot' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-md transition-all ${
                      m.isDeleted
                        ? 'bg-slate-900/60 border border-slate-800 text-slate-500 italic rounded-br-none'
                        : m.sender === 'userbot'
                        ? 'bg-[#2b5278] text-white rounded-br-none border border-blue-400/30'
                        : 'bg-[#182533] text-slate-100 rounded-bl-none border border-slate-800'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 text-[10px] text-slate-300/80 mb-1">
                      <span className="font-semibold text-cyan-300">{m.senderName}</span>
                      <span>{m.timestamp}</span>
                    </div>

                    {/* Content */}
                    {m.isDeleted ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        <span>[Reply auto-deleted after 30 seconds - Chat is clean]</span>
                      </div>
                    ) : (
                      <>
                        <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                        {m.countdown !== undefined && (
                          <div className="mt-2 pt-1.5 border-t border-blue-400/20 flex items-center justify-between text-[10px] text-amber-300">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 animate-spin" /> Auto-deleting in:
                            </span>
                            <span className="font-mono font-bold bg-black/40 px-1.5 py-0.5 rounded text-amber-200">
                              {m.countdown}s
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#17212b] border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Koi member message type karein (e.g. 'hello', 'price kya hai', 'link bhai')..."
                className="flex-1 bg-[#242f3d] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shrink-0 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Userbot Reply Customizer Panel */}
        <div className="lg:col-span-4 p-5 bg-slate-950 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Aapka Set Kiya Hua Auto-Reply Message
              </h4>
              <textarea
                value={activeReplyText}
                onChange={(e) => setActiveReplyText(e.target.value)}
                rows={4}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white resize-none focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Yeh message member ke SMS karne par bheja jayega.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-300">Auto-Delete Delay</span>
                <span className="text-xs font-mono font-bold text-amber-400">{deleteTime} Seconds</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={deleteTime}
                onChange={(e) => setDeleteTime(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Aapne 30 seconds bataya tha, default 30s set hai!
              </span>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Member SMS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['kuch bhi message', 'hello bhai', 'rate kya hai', 'link dedo'].map((txt) => (
                  <button
                    key={txt}
                    onClick={() => handleSend(txt)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-mono"
                  >
                    "{txt}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
            <p>✅ Works without admin permissions in any group.</p>
            <p>✅ Userbot self-destructs the message after 30s.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
