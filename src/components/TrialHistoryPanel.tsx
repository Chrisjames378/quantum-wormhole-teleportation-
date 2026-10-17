import React, { useState, useMemo } from 'react';
import {
  History,
  RotateCcw,
  Trash2,
  Download,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { SimulationTrial, ScramblerType, InputStateType } from '../types/quantum';
import { NoiseConfiguration } from '../utils/quantumNoise';
import { generateAcademicPdfReport } from '../utils/academicPdfGenerator';

interface Props {
  trials: SimulationTrial[];
  onRetryTrial: (trial: SimulationTrial) => void;
  onClearHistory: () => void;
  currentQubits: number;
  currentScrambler: ScramblerType;
  currentInputState: InputStateType;
  noise: NoiseConfiguration;
}

export const TrialHistoryPanel: React.FC<Props> = ({
  trials,
  onRetryTrial,
  onClearHistory,
  currentQubits,
  currentScrambler,
  currentInputState,
  noise,
}) => {
  const [filterScrambler, setFilterScrambler] = useState<'all' | 'clifford' | 'haar'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTrials = useMemo(() => {
    return trials.filter((t) => {
      if (filterScrambler !== 'all' && t.scrambler !== filterScrambler) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId = `trial #${t.trialId}`.toLowerCase().includes(query) || `${t.trialId}`.includes(query);
        const matchesState = t.inputState.toLowerCase().includes(query);
        const matchesQubits = `n=${t.qubits}`.includes(query) || `${t.qubits}`.includes(query);
        if (!matchesId && !matchesState && !matchesQubits) return false;
      }
      return true;
    });
  }, [trials, filterScrambler, searchQuery]);

  // Handle Academic PDF Export
  const handleExportPdf = () => {
    generateAcademicPdfReport({
      qubits: currentQubits,
      scrambler: currentScrambler,
      inputState: currentInputState,
      trials,
      noise,
      latestTrial: trials[0] || null,
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Trial History &amp; Fidelity Audit Log</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {trials.length} Recorded Runs
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Chronological log of quantum teleportation trials with exact state tomography metadata and one-click replay.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPdf}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-red-400" />
            <span>Export Academic PDF</span>
          </button>

          {trials.length > 0 && (
            <button
              onClick={onClearHistory}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
              title="Clear all recorded trials"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <span className="text-slate-500 px-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          <button
            onClick={() => setFilterScrambler('all')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition cursor-pointer ${
              filterScrambler === 'all'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({trials.length})
          </button>
          <button
            onClick={() => setFilterScrambler('clifford')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition cursor-pointer flex items-center gap-1 ${
              filterScrambler === 'clifford'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            <span>Clifford ({trials.filter((t) => t.scrambler === 'clifford').length})</span>
          </button>
          <button
            onClick={() => setFilterScrambler('haar')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition cursor-pointer flex items-center gap-1 ${
              filterScrambler === 'haar'
                ? 'bg-purple-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Haar ({trials.filter((t) => t.scrambler === 'haar').length})</span>
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by ID, State, or Qubits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 w-56"
        />
      </div>

      {/* Trial List Table */}
      {filteredTrials.length === 0 ? (
        <div className="text-center py-10 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-500 text-xs font-mono">
          No trials match the current filter. Run a teleportation trial above to generate records.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Trial</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Architecture</th>
                <th className="py-2.5 px-3">Qubits</th>
                <th className="py-2.5 px-3">Input State</th>
                <th className="py-2.5 px-3">Fidelity (F)</th>
                <th className="py-2.5 px-3">Phase Err</th>
                <th className="py-2.5 px-3">Magic (T)</th>
                <th className="py-2.5 px-3">Runtime</th>
                <th className="py-2.5 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {filteredTrials.slice(0, 50).map((t) => {
                const isHigh = t.fidelity >= 0.93;
                const isMed = t.fidelity >= 0.85 && t.fidelity < 0.93;

                return (
                  <tr key={`${t.trialId}-${t.timestamp}`} className="hover:bg-slate-900/50 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-200">#{t.trialId}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{t.timestamp}</td>
                    <td className="py-2.5 px-3">
                      {t.scrambler === 'clifford' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-indigo-950/70 text-indigo-300 border border-indigo-500/30">
                          <ShieldCheck className="w-3 h-3 text-indigo-400" />
                          <span>Clifford (T=0)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-purple-950/70 text-purple-300 border border-purple-500/30">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>Haar-Random</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{t.qubits} Q</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 text-[11px]">
                        |{t.inputState}⟩
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          isHigh
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : isMed
                            ? 'bg-sky-950/60 text-sky-400 border border-sky-500/30'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {(t.fidelity * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{t.phaseError}°</td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {t.magicCount === 0 ? <span className="text-emerald-400">0</span> : t.magicCount}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{t.executionTimeMs} ms</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onRetryTrial(t)}
                        className="px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                        title="Load this configuration and run trial"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Re-run</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
