import React, { useState } from 'react';
import { X, TrendingDown, Activity, Sparkles, ShieldCheck, Info, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { ScramblerType } from '../types/quantum';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  qubits: number;
  scrambler: ScramblerType;
}

export const OtocScramblingModal: React.FC<Props> = ({ isOpen, onClose, qubits, scrambler }) => {
  const [activeMetric, setActiveMetric] = useState<'otoc' | 'entropy' | 'tripartite'>('otoc');

  if (!isOpen) return null;

  // Generate depth-dependent scrambling points
  const depthSteps = 10;
  const data = Array.from({ length: depthSteps }, (_, i) => {
    const depth = i + 1;
    // Lyapunov growth of OTOC
    const cliffordOtoc = Math.min(1.0, 1 - Math.exp(-0.85 * depth) + (Math.random() * 0.04 - 0.02));
    const haarOtoc = Math.min(1.0, 1 - Math.exp(-0.82 * depth) + (Math.random() * 0.06 - 0.03));

    // Page curve entanglement entropy S(A)
    const maxEntropy = (qubits / 2) * Math.LN2;
    const cliffordEntropy = Math.min(maxEntropy, maxEntropy * (1 - Math.exp(-0.75 * depth)));
    const haarEntropy = Math.min(maxEntropy, maxEntropy * (1 - Math.exp(-0.72 * depth)));

    // Tripartite information I3(A:B:C) drops from 0 to negative values
    const cliffordI3 = -Math.min(2.0, 2.0 * (1 - Math.exp(-0.65 * depth)));
    const haarI3 = -Math.min(2.0, 2.0 * (1 - Math.exp(-0.62 * depth)));

    return {
      depth,
      cliffordOtoc: Number(cliffordOtoc.toFixed(3)),
      haarOtoc: Number(haarOtoc.toFixed(3)),
      cliffordEntropy: Number(cliffordEntropy.toFixed(3)),
      haarEntropy: Number(haarEntropy.toFixed(3)),
      cliffordI3: Number(cliffordI3.toFixed(3)),
      haarI3: Number(haarI3.toFixed(3)),
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b0e14] border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Out-of-Time-Order Correlator (OTOC) & Information Scrambling Dynamics
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Quantifying quantum chaos, operator spreading, and tripartite mutual information across Clifford vs. Haar ensembles.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metric Selector Tabs */}
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <button
                onClick={() => setActiveMetric('otoc')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeMetric === 'otoc'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                OTOC Commutator C(t)
              </button>
              <button
                onClick={() => setActiveMetric('tripartite')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeMetric === 'tripartite'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                Tripartite Information I₃(A:B:C)
              </button>
              <button
                onClick={() => setActiveMetric('entropy')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeMetric === 'entropy'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                Von Neumann Entropy S(ρ_A)
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              System: <strong className="text-white">{qubits} Qubits</strong> | Fast Scrambling Time: <strong className="text-indigo-400">t* ≈ ln(N)</strong>
            </div>
          </div>

          {/* Metric Explainer */}
          <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs space-y-1">
            {activeMetric === 'otoc' && (
              <>
                <div className="font-semibold text-white flex items-center gap-2">
                  <span>Operator Growth & Commutator: C(t) = ½ ⟨[W(t), V(0)]† [W(t), V(0)]⟩</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Measures how an initially localized operator W expands through Heisenberg evolution W(t) = U† W U. When C(t) → 1,
                  information has completely scrambled across the quantum system. Notice Clifford circuits track Haar-random scramblers closely!
                </p>
              </>
            )}

            {activeMetric === 'tripartite' && (
              <>
                <div className="font-semibold text-white flex items-center gap-2">
                  <span>Tripartite Mutual Information: I₃(A:B:C) = S(A) + S(B) + S(C) - S(AB) - S(BC) - S(AC) + S(ABC)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Negative tripartite information (I₃ &lt; 0) is the definitive holographic hallmark of quantum scramblers and black holes.
                  It proves that quantum information cannot be recovered from any two subsystems alone, but only from all three together.
                </p>
              </>
            )}

            {activeMetric === 'entropy' && (
              <>
                <div className="font-semibold text-white flex items-center gap-2">
                  <span>Entanglement Entropy & Page Curve: S(ρ_A) = -Tr(ρ_A ln ρ_A)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Tracks the growth of quantum entanglement between Alice’s subsystem A and the remainder of the black hole.
                  The curve rapidly saturates to the maximal Page entropy bound S_max ≈ (N/2) ln(2).
                </p>
              </>
            )}
          </div>

          {/* Chart Display */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="depth" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Circuit Depth / Time Step (t)', position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '11px', color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                
                {activeMetric === 'otoc' && (
                  <>
                    <Line type="monotone" dataKey="cliffordOtoc" name="Clifford Scrambler (Zero-Magic)" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="haarOtoc" name="Haar-Random Scrambler (Universal)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                  </>
                )}

                {activeMetric === 'tripartite' && (
                  <>
                    <Line type="monotone" dataKey="cliffordI3" name="Clifford I₃(A:B:C)" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="haarI3" name="Haar I₃(A:B:C)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                  </>
                )}

                {activeMetric === 'entropy' && (
                  <>
                    <Line type="monotone" dataKey="cliffordEntropy" name="Clifford S(ρ_A)" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="haarEntropy" name="Haar S(ρ_A)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
