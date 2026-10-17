import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { ScramblerType } from '../types/quantum';
import { NoiseConfiguration } from '../utils/quantumNoise';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  qubits: number;
  scrambler: ScramblerType;
  fidelity: number;
  noise: NoiseConfiguration;
}

export const QuantumCopilotModal: React.FC<Props> = ({
  isOpen,
  onClose,
  qubits,
  scrambler,
  fidelity,
  noise,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello! I am your Quantum AI Co-pilot powered by Gemini 3.8 Flash. I can explain the quantum information theory behind black hole scrambling, the ER=EPR conjecture, and the 2026 findings by Joshi & Mishra. Ask me anything or select a topic below!`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const promptSuggestions = [
    'Why does Clifford scrambling have high variance at N=4?',
    'How do T1 amplitude and T2 phase damping degrade fidelity?',
    'Explain how ER=EPR connects black holes to quantum entanglement.',
    'What allows Clifford circuits to be simulated in O(N³) time?',
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || isLoading) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/quantum/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          qubits,
          scrambler,
          fidelity,
          noise,
        }),
      });

      const data = await response.json();
      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: data.answer || data.error || 'No response received.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'assistant',
          text: `Error connecting to Co-pilot service: ${err.message || 'Unknown network error'}. Please verify backend server is active.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b0f19] border-l border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-purple-600/20 text-purple-400 rounded-lg border border-purple-500/30">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Gemini Quantum Co-pilot</span>
                <span className="text-[10px] font-mono font-normal text-purple-400 bg-purple-950/60 border border-purple-500/30 px-1.5 py-0.2 rounded">
                  3.8 Flash
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Context-aware theoretical physics assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Experiment Context Strip */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/70 text-[11px] font-mono text-slate-400 flex flex-wrap gap-2 items-center justify-between">
          <span>{qubits} Qubits · {scrambler.toUpperCase()}</span>
          <span>Fidelity: {(fidelity * 100).toFixed(1)}%</span>
          <span className={noise.enabled ? 'text-amber-400' : 'text-emerald-400'}>
            {noise.enabled ? 'Noise Active' : 'Ideal Unitary'}
          </span>
        </div>

        {/* Chat History Viewport */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-purple-900/60 border border-purple-500/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-purple-300" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl p-3 leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none font-sans text-xs'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1.5 font-mono ${
                    m.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-full bg-indigo-900/60 border border-indigo-500/50 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-indigo-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-slate-400 font-mono text-xs">
              <div className="w-6 h-6 rounded-full bg-purple-900/60 border border-purple-500/50 flex items-center justify-center shrink-0 animate-spin">
                <RefreshCw className="w-3 h-3 text-purple-300" />
              </div>
              <div className="bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl text-purple-300">
                Reasoning over quantum state and paper theorems...
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
          <div className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Suggested Inquiries</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {promptSuggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                disabled={isLoading}
                className="text-[11px] text-left px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer truncate max-w-full"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Clifford variance, magic gates, or ER=EPR..."
              disabled={isLoading}
              className="flex-1 bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
