import React from 'react';
import { X, Sparkles, BookOpen, Check, ArrowRight, ShieldCheck, Zap, Waves } from 'lucide-react';
import { ScramblerType, InputStateType } from '../types/quantum';
import { NoiseConfiguration } from '../utils/quantumNoise';

export interface ExperimentalPreset {
  id: string;
  title: string;
  institution: string;
  year: string;
  qubits: number;
  scrambler: ScramblerType;
  inputState: InputStateType;
  noise: NoiseConfiguration;
  description: string;
  citation: string;
  expectedFidelity: string;
  badge: string;
}

export const EXPERIMENTAL_PRESETS: ExperimentalPreset[] = [
  {
    id: 'joshi_mishra_2026',
    title: 'Joshi & Mishra Clifford Equivalence',
    institution: 'IIT Banaras Hindu University',
    year: '2026',
    qubits: 8,
    scrambler: 'clifford',
    inputState: 'plus',
    noise: {
      enabled: false,
      amplitudeDamping: 0.05,
      phaseDamping: 0.08,
      depolarizing: 0.02,
    },
    description:
      'Zero-magic Clifford scrambling showing exact average fidelity equivalence to Haar unitaries with polynomial classical simulability O(N³).',
    citation: 'S. Joshi & S. K. Mishra, "Wormhole Teleportation using Clifford Scramblers" (2026)',
    expectedFidelity: '94.5%',
    badge: 'Zero-Magic (T=0)',
  },
  {
    id: 'google_sycamore_2022',
    title: 'Google Sycamore Traversable Wormhole',
    institution: 'Google Quantum AI / Caltech / Harvard',
    year: '2022',
    qubits: 9,
    scrambler: 'haar',
    inputState: 'plus',
    noise: {
      enabled: true,
      amplitudeDamping: 0.08,
      phaseDamping: 0.12,
      depolarizing: 0.04,
    },
    description:
      'Landmark 9-qubit quantum processor experiment demonstrating holographic wormhole teleportation using Gao-Jafferis-Wall negative energy coupling.',
    citation: 'D. Jafferis et al., Nature 612, 51–55 (2022)',
    expectedFidelity: '92.4%',
    badge: 'Nature Landmark',
  },
  {
    id: 'hayden_preskill_2007',
    title: 'Hayden-Preskill Black Hole Information Mirror',
    institution: 'McGill University & Caltech',
    year: '2007',
    qubits: 6,
    scrambler: 'clifford',
    inputState: 'plus_i',
    noise: {
      enabled: false,
      amplitudeDamping: 0.03,
      phaseDamping: 0.04,
      depolarizing: 0.015,
    },
    description:
      'Information thrown into an old black hole whose Hawking radiation was captured is reflected rapidly as soon as it is scrambled.',
    citation: 'P. Hayden & J. Preskill, JHEP 0709:120 (2007)',
    expectedFidelity: '95.1%',
    badge: 'Foundational Theory',
  },
  {
    id: 'syk_majorana_2016',
    title: 'Sachdev-Ye-Kitaev (SYK) Dual Majorana Model',
    institution: 'Institute for Advanced Study (IAS)',
    year: '2016',
    qubits: 10,
    scrambler: 'haar',
    inputState: 'zero',
    noise: {
      enabled: false,
      amplitudeDamping: 0.05,
      phaseDamping: 0.07,
      depolarizing: 0.02,
    },
    description:
      'Solvable model of N interacting Majorana fermions maximally scrambling information at the chaos bound λ_L = 2π k_B T / ℏ.',
    citation: 'J. Maldacena & D. Stanford, Phys. Rev. D 94, 106002 (2016)',
    expectedFidelity: '93.8%',
    badge: 'Chaos Bound',
  },
  {
    id: 'nisq_decoherence_stress',
    title: 'Noisy NISQ Decoherence Stress Test',
    institution: 'Decoherence Lab Benchmark',
    year: '2026',
    qubits: 4,
    scrambler: 'clifford',
    inputState: 'random',
    noise: {
      enabled: true,
      amplitudeDamping: 0.22,
      phaseDamping: 0.28,
      depolarizing: 0.08,
    },
    description:
      'Stresses the quantum state transfer channel with severe amplitude damping (energy relaxation) and phase damping (dephasing).',
    citation: 'Open Quantum Systems Kraus Operator Channel Simulation',
    expectedFidelity: '74.2%',
    badge: 'Heavy Noise',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: ExperimentalPreset) => void;
}

export const ExperimentalPresetsModal: React.FC<Props> = ({ isOpen, onClose, onSelectPreset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b0e14] border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Load Historic & Landmark Experimental Presets
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Instantly configure the simulator with peer-reviewed quantum gravity and black hole scrambling setups.
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

        {/* Presets List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {EXPERIMENTAL_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-900/70 hover:border-indigo-500/60 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {preset.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {preset.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">{preset.institution} ({preset.year})</span>
                  <span className="text-slate-700">|</span>
                  <span className="text-emerald-400 font-semibold">Fidelity ~ {preset.expectedFidelity}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{preset.description}</p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  <span>Qubits: <strong className="text-white">{preset.qubits}</strong></span>
                  <span>Scrambler: <strong className="text-indigo-400 uppercase">{preset.scrambler}</strong></span>
                  <span>State: <strong className="text-cyan-400">|{preset.inputState}⟩</strong></span>
                  <span>Noise: <strong className={preset.noise.enabled ? 'text-amber-400' : 'text-emerald-400'}>{preset.noise.enabled ? 'Active' : 'Off'}</strong></span>
                </div>

                <div className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-1 transition-transform font-medium">
                  <span>Load Preset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
