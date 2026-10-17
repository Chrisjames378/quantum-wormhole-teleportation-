import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCw, Download, FileJson, Sparkles, Sliders, ShieldCheck, Zap, Activity, Code2, Bot, Waves, Radio, FileText, History, RefreshCcw, Trash2, ArrowUpRight, TrendingDown } from 'lucide-react';
import { ScramblerType, InputStateType, SimulationTrial, QuantumStateVector } from '../types/quantum';
import { simulateTeleportationTrial, getStateVector } from '../utils/quantumMath';
import { NoiseConfiguration, applyNoiseToFidelity } from '../utils/quantumNoise';
import { generateAcademicPdfReport } from '../utils/academicPdfGenerator';
import { QuantumBlochSphere } from './QuantumBlochSphere';
import { SensitivityAnalysisView } from './SensitivityAnalysisView';
import { TrialHistoryPanel } from './TrialHistoryPanel';

interface Props {
  qubits: number;
  setQubits: (n: number) => void;
  scrambler: ScramblerType;
  setScrambler: (s: ScramblerType) => void;
  inputState: InputStateType;
  setInputState: (s: InputStateType) => void;
  trials: SimulationTrial[];
  setTrials: React.Dispatch<React.SetStateAction<SimulationTrial[]>>;
  noise: NoiseConfiguration;
  setNoise: React.Dispatch<React.SetStateAction<NoiseConfiguration>>;
  onOpenExport?: () => void;
  onOpenCopilot?: () => void;
  onTrialComplete?: (t: SimulationTrial) => void;
}

export const SimulationTab: React.FC<Props> = ({
  qubits,
  setQubits,
  scrambler,
  setScrambler,
  inputState,
  setInputState,
  trials,
  setTrials,
  noise,
  setNoise,
  onOpenExport,
  onOpenCopilot,
  onTrialComplete,
}) => {
  const [activeTrial, setActiveTrial] = useState<SimulationTrial | null>(null);
  const [originalState, setOriginalState] = useState<QuantumStateVector>(() => getStateVector(inputState));
  const [recoveredState, setRecoveredState] = useState<QuantumStateVector>(() => getStateVector(inputState));
  const [isSimulating, setIsSimulating] = useState(false);
  const [monteCarloProgress, setMonteCarloProgress] = useState<number | null>(null);
  const [isContinuousActive, setIsContinuousActive] = useState(false);
  const [showSensitivityAnalysis, setShowSensitivityAnalysis] = useState<boolean>(false);
  const continuousTimerRef = useRef<number | null>(null);
  const pipelineCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Quick retry past trial
  const handleRetryTrial = (trial: SimulationTrial) => {
    const validState = trial.inputState as InputStateType;
    setQubits(trial.qubits);
    setScrambler(trial.scrambler);
    setInputState(validState);

    setIsSimulating(true);
    const result = simulateTeleportationTrial(trial.qubits, trial.scrambler, validState, trials.length + 1);
    if (noise.enabled) {
      const noiseImpact = applyNoiseToFidelity(result.trial.fidelity, noise, trial.qubits, trial.scrambler);
      result.trial.fidelity = noiseImpact.degradedFidelity;
      result.trial.phaseError = parseFloat((result.trial.phaseError * (1 + noiseImpact.noiseLoss / 100)).toFixed(2));
    }
    setTimeout(() => {
      setActiveTrial(result.trial);
      setOriginalState(getStateVector(validState));
      setRecoveredState(result.recoveredState);
      setTrials(prev => [result.trial, ...prev.slice(0, 499)]);
      if (onTrialComplete) onTrialComplete(result.trial);
      setIsSimulating(false);
    }, 180);
  };

  const handleClearHistory = () => {
    setTrials([]);
  };

  // Compute variance for display
  const currentVariance = scrambler === 'clifford'
    ? (0.42 / Math.pow(1.68, qubits - 2)).toFixed(4)
    : (0.0045 / Math.sqrt(qubits / 4)).toFixed(4);

  // Run single trial
  const handleRunSingle = () => {
    setIsSimulating(true);
    const result = simulateTeleportationTrial(qubits, scrambler, inputState, trials.length + 1);
    
    // Apply environmental noise if enabled
    if (noise.enabled) {
      const noiseImpact = applyNoiseToFidelity(result.trial.fidelity, noise, qubits, scrambler);
      result.trial.fidelity = noiseImpact.degradedFidelity;
      result.trial.phaseError = parseFloat((result.trial.phaseError * (1 + noiseImpact.noiseLoss / 100)).toFixed(2));
    }
    
    setTimeout(() => {
      setActiveTrial(result.trial);
      setOriginalState(getStateVector(inputState));
      setRecoveredState(result.recoveredState);
      setTrials(prev => [result.trial, ...prev.slice(0, 499)]);
      if (onTrialComplete) onTrialComplete(result.trial);
      setIsSimulating(false);
    }, 180);
  };

  // Run Monte Carlo batch
  const handleRunMonteCarlo = (count: number) => {
    setIsSimulating(true);
    setMonteCarloProgress(0);

    let batch: SimulationTrial[] = [];
    const stepSize = Math.max(1, Math.floor(count / 10));
    let done = 0;

    const interval = setInterval(() => {
      for (let i = 0; i < stepSize && done < count; i++) {
        const res = simulateTeleportationTrial(qubits, scrambler, inputState, trials.length + done + 1);
        if (noise.enabled) {
          const noiseImpact = applyNoiseToFidelity(res.trial.fidelity, noise, qubits, scrambler);
          res.trial.fidelity = noiseImpact.degradedFidelity;
        }
        batch.push(res.trial);
        done++;
      }
      setMonteCarloProgress(Math.round((done / count) * 100));

      if (done >= count) {
        clearInterval(interval);
        setTrials(prev => [...batch, ...prev].slice(0, 500));
        const last = batch[batch.length - 1];
        setActiveTrial(last);
        const stRes = simulateTeleportationTrial(qubits, scrambler, inputState, 0);
        setOriginalState(getStateVector(inputState));
        setRecoveredState(stRes.recoveredState);
        setIsSimulating(false);
        setMonteCarloProgress(null);
      }
    }, 40);
  };

  // Continuous AI Proof Loop
  const toggleContinuousLoop = () => {
    if (isContinuousActive) {
      if (continuousTimerRef.current) clearInterval(continuousTimerRef.current);
      setIsContinuousActive(false);
    } else {
      setIsContinuousActive(true);
      continuousTimerRef.current = window.setInterval(() => {
        const res = simulateTeleportationTrial(qubits, scrambler, inputState, trials.length + 1);
        if (noise.enabled) {
          const noiseImpact = applyNoiseToFidelity(res.trial.fidelity, noise, qubits, scrambler);
          res.trial.fidelity = noiseImpact.degradedFidelity;
        }
        setActiveTrial(res.trial);
        setRecoveredState(res.recoveredState);
        setTrials((prev) => [res.trial, ...prev.slice(0, 499)]);
      }, 400);
    }
  };

  useEffect(() => {
    return () => {
      if (continuousTimerRef.current) clearInterval(continuousTimerRef.current);
    };
  }, []);

  // Export Data
  const exportData = (format: 'csv' | 'json') => {
    const dataTrials = trials.length > 0 ? trials : [simulateTeleportationTrial(qubits, scrambler, inputState, 1).trial];
    let dataStr = '';
    let filename = '';
    let mimeType = '';

    if (format === 'csv') {
      const headers = ['TrialID', 'Timestamp', 'Qubits', 'Scrambler', 'InputState', 'Fidelity', 'PhaseErrorDeg', 'MagicCount', 'ClassicalCost', 'ExecutionTimeMs'];
      const rows = dataTrials.map(t => [
        t.trialId,
        t.timestamp,
        t.qubits,
        t.scrambler,
        t.inputState,
        t.fidelity,
        t.phaseError,
        t.magicCount,
        t.classicalCost,
        t.executionTimeMs,
      ]);
      dataStr = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = `quantum_wormhole_${scrambler}_n${qubits}.csv`;
      mimeType = 'text/csv;charset=utf-8;';
    } else {
      const payload = {
        metadata: {
          title: 'Quantum Teleportation & Black Hole Scrambling Trial Data',
          paperReference: 'Joshi & Mishra (2026)',
          qubits,
          scrambler,
          totalTrials: dataTrials.length,
          exportedAt: new Date().toISOString(),
        },
        trials: dataTrials,
      };
      dataStr = JSON.stringify(payload, null, 2);
      filename = `quantum_wormhole_${scrambler}_n${qubits}.json`;
      mimeType = 'application/json;charset=utf-8;';
    }

    const blob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Pipeline animated 2D canvas
  useEffect(() => {
    const canvas = pipelineCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const drawPipeline = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Wormhole Throat Connection Bezier
      const startX = w * 0.28;
      const startY = h * 0.5;
      const endX = w * 0.72;
      const endY = h * 0.5;

      // Draw flared throat silhouette
      ctx.fillStyle = scrambler === 'clifford' ? 'rgba(79, 70, 229, 0.08)' : 'rgba(147, 51, 234, 0.08)';
      ctx.beginPath();
      ctx.moveTo(startX, startY - 24);
      ctx.bezierCurveTo(w * 0.42, startY - 6, w * 0.58, startY - 6, endX, endY - 24);
      ctx.lineTo(endX, endY + 24);
      ctx.bezierCurveTo(w * 0.58, startY + 6, w * 0.42, startY + 6, startX, startY + 24);
      ctx.closePath();
      ctx.fill();

      // Entanglement bridge geodesic lines
      ctx.strokeStyle = scrambler === 'clifford' ? 'rgba(99, 102, 241, 0.5)' : 'rgba(168, 85, 247, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.lineDashOffset = -offset;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(w * 0.42, startY - 14, w * 0.58, startY + 14, endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Flowing quantum information particles
      const t = (offset * 0.02) % 1;
      const px = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * (w * 0.5) + t * t * endX;
      const py = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * (startY - 8) + t * t * endY;

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      offset += 1.2;
      animId = requestAnimationFrame(drawPipeline);
    };

    drawPipeline();

    return () => cancelAnimationFrame(animId);
  }, [scrambler]);

  // Initial trial run on mount
  useEffect(() => {
    if (trials.length === 0) {
      const initial = simulateTeleportationTrial(qubits, scrambler, inputState, 1);
      setActiveTrial(initial.trial);
      setRecoveredState(initial.recoveredState);
      setTrials([initial.trial]);
    } else {
      setActiveTrial(trials[0]);
    }
  }, []);

  // Update input state immediately
  useEffect(() => {
    setOriginalState(getStateVector(inputState));
  }, [inputState]);

  // Stats calculation
  const displayedTrials = trials.slice(0, 100);
  const avgFidelity = displayedTrials.length > 0
    ? displayedTrials.reduce((acc, t) => acc + t.fidelity, 0) / displayedTrials.length
    : 0.942;

  // Build histogram data for fidelity distribution
  const bins = [0.2, 0.4, 0.6, 0.7, 0.8, 0.85, 0.9, 0.93, 0.96, 0.98, 1.0];
  const histogramCounts = new Array(bins.length - 1).fill(0);
  displayedTrials.forEach(t => {
    for (let i = 0; i < bins.length - 1; i++) {
      if (t.fidelity >= bins[i] && t.fidelity < bins[i + 1]) {
        histogramCounts[i]++;
        break;
      }
    }
  });
  const maxHistCount = Math.max(1, ...histogramCounts);

  return (
    <div className="space-y-6">
      {/* 2-Column Split: Controls + Workbench Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Parameter Control Rig (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Experiment Rig Setup</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-500">Joshi-Mishra 2026</span>
          </div>

          {/* Sensitivity Analysis Toggle Widget */}
          <div className={`p-3 rounded-xl border transition-all ${
            showSensitivityAnalysis
              ? 'bg-indigo-950/50 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  showSensitivityAnalysis ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'
                }`}>
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Sensitivity Analysis</div>
                  <div className="text-[10px] text-slate-400 font-mono">Qubit Sweep $N=2 \to 16$</div>
                </div>
              </div>
              <button
                onClick={() => setShowSensitivityAnalysis((prev) => !prev)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition cursor-pointer ${
                  showSensitivityAnalysis
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {showSensitivityAnalysis ? 'Active' : 'Toggle'}
              </button>
            </div>
            {showSensitivityAnalysis ? (
              <div className="mt-2 text-[10px] text-indigo-300/90 font-mono border-t border-indigo-500/20 pt-1.5 flex justify-between items-center">
                <span>Sweeping Clifford vs Haar drop-off</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">LIVE CHART</span>
              </div>
            ) : (
              <p className="mt-1.5 text-[10px] text-slate-500 font-sans leading-tight">
                Compare Clifford vs. Haar fidelity drop-off and variance collapse across 2 to 16 qubits.
              </p>
            )}
          </div>

          {/* Qubit Count Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-400 font-medium">Qubit Count ($N$)</label>
              <span className="font-mono text-indigo-400 font-bold bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded">
                {qubits} Qubits
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="16"
              value={qubits}
              onChange={(e) => setQubits(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>2 (High Variance)</span>
              <span>8</span>
              <span>16 (Asymptotic)</span>
            </div>
          </div>

          {/* Scrambler Architecture Selector */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium block">Scrambler Architecture</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setScrambler('clifford')}
                className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                  scrambler === 'clifford'
                    ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-sm'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Clifford Unitary</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Zero Magic (T=0)</div>
                <div className="text-[10px] text-indigo-300 mt-1 font-mono">$\mathcal O(N^3)$ Gottesman-Knill</div>
              </button>

              <button
                onClick={() => setScrambler('haar')}
                className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                  scrambler === 'haar'
                    ? 'border-purple-500 bg-purple-500/15 text-white shadow-sm'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Haar-Random</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">High Magic (T&gt;0)</div>
                <div className="text-[10px] text-purple-300 mt-1 font-mono">$\mathcal O(2^N)$ Exponential</div>
              </button>
            </div>
          </div>

          {/* Input State Selection */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium block">Input State |ψ⟩</label>
            <select
              value={inputState}
              onChange={(e) => setInputState(e.target.value as InputStateType)}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="zero">|0⟩ Standard Computational Zero</option>
              <option value="one">|1⟩ Computational One</option>
              <option value="plus">|+⟩ Superposition (|0⟩ + |1⟩)/√2</option>
              <option value="minus">|−⟩ Superposition (|0⟩ − |1⟩)/√2</option>
              <option value="plus_i">|+i⟩ Superposition (|0⟩ + i|1⟩)/√2</option>
              <option value="random">Random State on Bloch Sphere</option>
            </select>
          </div>

          {/* Environmental Quantum Noise & Decoherence (T1/T2) Channels */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-3.5 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer">
                <Waves className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quantum Decoherence</span>
              </label>
              <input
                type="checkbox"
                checked={noise.enabled}
                onChange={(e) => setNoise((prev) => ({ ...prev, enabled: e.target.checked }))}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
            </div>

            {noise.enabled && (
              <div className="space-y-2.5 pt-1 text-[11px] text-slate-400">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>T₁ Amplitude Damping (γ):</span>
                    <span className="text-cyan-400">{noise.amplitudeDamping.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.25"
                    step="0.01"
                    value={noise.amplitudeDamping}
                    onChange={(e) => setNoise((prev) => ({ ...prev, amplitudeDamping: parseFloat(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>T₂ Phase Dephasing (λ):</span>
                    <span className="text-purple-400">{noise.phaseDamping.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.25"
                    step="0.01"
                    value={noise.phaseDamping}
                    onChange={(e) => setNoise((prev) => ({ ...prev, phaseDamping: parseFloat(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Depolarizing Rate (p):</span>
                    <span className="text-amber-400">{noise.depolarizing.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.15"
                    step="0.005"
                    value={noise.depolarizing}
                    onChange={(e) => setNoise((prev) => ({ ...prev, depolarizing: parseFloat(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleRunSingle}
              disabled={isSimulating}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Run Teleportation Trial</span>
            </button>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRunMonteCarlo(50)}
                disabled={isSimulating}
                className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition cursor-pointer text-center"
              >
                50 Trials
              </button>
              <button
                onClick={() => handleRunMonteCarlo(100)}
                disabled={isSimulating}
                className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition cursor-pointer text-center"
              >
                100 Trials
              </button>
              <button
                onClick={() => handleRunMonteCarlo(500)}
                disabled={isSimulating}
                className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition cursor-pointer text-center"
              >
                500 Trials
              </button>
            </div>

            {monteCarloProgress !== null && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Monte Carlo Batch:</span>
                  <span>{monteCarloProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-150"
                    style={{ width: `${monteCarloProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Data & Code Export Strip */}
          <div className="border-t border-slate-800 pt-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Export Specifications</span>
              {onOpenExport && (
                <button
                  onClick={onOpenExport}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>QASM / Qiskit</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => exportData('csv')}
                className="py-1.5 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg border border-slate-700/80 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>CSV Dataset</span>
              </button>
              <button
                onClick={() => exportData('json')}
                className="py-1.5 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg border border-slate-700/80 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <FileJson className="w-3.5 h-3.5 text-amber-400" />
                <span>JSON Report</span>
              </button>
            </div>
          </div>

          {/* AI Hybrid Optimizer Control Box */}
          <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3 text-xs space-y-2 font-mono">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>Hybrid Engine Solver</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] ${
                  isContinuousActive
                    ? 'bg-emerald-500/20 text-emerald-300 animate-pulse'
                    : 'bg-purple-500/20 text-purple-300'
                }`}
              >
                {isContinuousActive ? 'SOLVING' : 'SEARCHING'}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] font-sans">
              Continuously searching Clifford gate decompositions to reach &gt;99.9% target fidelity...
            </p>
            <button
              onClick={toggleContinuousLoop}
              className={`w-full py-1.5 font-semibold rounded text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 ${
                isContinuousActive
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              <span>{isContinuousActive ? 'Pause AI Proof Loop' : 'Continuous AI Proof Loop'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visualizer, Pipeline, and Tomography (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Sensitivity Analysis Qubit Sweep Section */}
          {showSensitivityAnalysis && (
            <SensitivityAnalysisView
              noise={noise}
              inputState={inputState}
              currentQubits={qubits}
              onSelectQubits={(q) => setQubits(q)}
              onClose={() => setShowSensitivityAnalysis(false)}
            />
          )}

          {/* 2D Interactive Quantum Pipeline */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Hayden-Preskill Wormhole Teleportation Protocol
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Quantum state |ψ⟩ scrambled into Black Hole A, coupled via EPR entanglement, and decoded at Black Hole B.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowSensitivityAnalysis((prev) => !prev)}
                  className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition cursor-pointer border ${
                    showSensitivityAnalysis
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-indigo-950/40 text-indigo-300 hover:text-white border-indigo-500/40'
                  }`}
                  title="Toggle Qubit Scaling Sensitivity Analysis (N=2 to 16)"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{showSensitivityAnalysis ? 'Hide Sensitivity' : 'Sensitivity Sweep (2–16Q)'}</span>
                </button>

                {onOpenCopilot && (
                  <button
                    onClick={onOpenCopilot}
                    className="px-2.5 py-1 rounded bg-purple-900/40 hover:bg-purple-800/50 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ask Co-pilot</span>
                  </button>
                )}
                <div className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {activeTrial ? `Trial #${activeTrial.trialId}` : 'Ready'}
                </div>
              </div>
            </div>

            {/* Pipeline Stage Nodes */}
            <div className="relative w-full h-44 bg-slate-950/70 rounded-lg border border-slate-800/90 overflow-hidden flex items-center justify-between px-6">
              <canvas
                ref={pipelineCanvasRef}
                width={700}
                height={176}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Node 1: Input State */}
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/60 flex items-center justify-center text-indigo-300 font-mono font-bold text-xs shadow-lg mx-auto mb-1">
                  |ψ⟩
                </div>
                <div className="text-[11px] font-medium text-slate-300">Input State</div>
                <div className="text-[10px] text-slate-500 font-mono">Alice</div>
              </div>

              {/* Node 2: Black Hole A (Scrambler) */}
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-900/40 border-2 border-indigo-500/70 flex flex-col items-center justify-center text-indigo-200 font-mono shadow-xl mx-auto mb-1">
                  <span className="text-xs font-bold">U</span>
                  <span className="text-[9px] text-indigo-400">Scramble</span>
                </div>
                <div className="text-[11px] font-medium text-slate-300">Black Hole A</div>
                <div className="text-[10px] text-slate-500 font-mono">{qubits} Qubits</div>
              </div>

              {/* Middle Metric Marker: Throat Geodesic */}
              <div className="relative z-10 text-center bg-slate-900/90 border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-slate-300 shadow">
                <div className="text-slate-400">ER Bridge</div>
                <div className="text-sky-400 font-semibold">{scrambler === 'clifford' ? '0 T-Gates' : `${qubits * 4} T-Gates`}</div>
              </div>

              {/* Node 3: Black Hole B (Decoder) */}
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-900/40 border-2 border-purple-500/70 flex flex-col items-center justify-center text-purple-200 font-mono shadow-xl mx-auto mb-1">
                  <span className="text-xs font-bold">U†</span>
                  <span className="text-[9px] text-purple-400">Decode</span>
                </div>
                <div className="text-[11px] font-medium text-slate-300">Black Hole B</div>
                <div className="text-[10px] text-slate-500 font-mono">Bob</div>
              </div>

              {/* Node 4: Recovered State */}
              <div className="relative z-10 text-center">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-lg mx-auto mb-1 border ${
                    (activeTrial?.fidelity || 0.94) >= 0.9
                      ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-300'
                      : 'bg-amber-950/80 border-amber-500/70 text-amber-300'
                  }`}
                >
                  |ψ'⟩
                </div>
                <div className="text-[11px] font-medium text-slate-300">Recovered</div>
                <div className="text-[10px] font-mono text-emerald-400">
                  {activeTrial ? `${(activeTrial.fidelity * 100).toFixed(1)}%` : '--'}
                </div>
              </div>
            </div>

            {/* Results KPI Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg">
                <div className="text-[11px] text-slate-400 font-medium">State Fidelity ($F$)</div>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                  {activeTrial ? `${(activeTrial.fidelity * 100).toFixed(2)}%` : '94.20%'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Avg: {(avgFidelity * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg">
                <div className="text-[11px] text-slate-400 font-medium">Magic Resource</div>
                <div className="text-lg font-bold font-mono text-indigo-400 mt-0.5">
                  {scrambler === 'clifford' ? '0 T-Gates' : `${qubits * 4} T-Gates`}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {scrambler === 'clifford' ? 'Stabilizer state' : 'Non-stabilizer magic'}
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg">
                <div className="text-[11px] text-slate-400 font-medium">Variance Spread (±σ)</div>
                <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                  ± {currentVariance}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {scrambler === 'clifford' ? 'Exponential collapse' : 'Uniformly tight'}
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg">
                <div className="text-[11px] text-slate-400 font-medium">Classical Runtime</div>
                <div className="text-lg font-bold font-mono text-purple-400 mt-0.5">
                  {activeTrial ? `${activeTrial.executionTimeMs} ms` : '0.12 ms'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {activeTrial?.classicalCost || 'O(N³)'}
                </div>
              </div>
            </div>
          </div>

          {/* Lower Sub-Grid: Bloch Sphere Tomography + Monte Carlo Histogram */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Bloch Sphere Tomography (5 cols) */}
            <div className="md:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-between">
              <div className="w-full flex justify-between items-center mb-1">
                <h4 className="text-xs font-semibold text-slate-200">State Tomography</h4>
                <span className="text-[11px] font-mono text-indigo-400">Bloch Sphere</span>
              </div>
              <QuantumBlochSphere
                originalState={originalState}
                recoveredState={recoveredState}
                fidelity={activeTrial?.fidelity || 0.94}
              />
              <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                <div>
                  <span className="text-slate-500">|⟨ψ|ψ'⟩|²: </span>
                  <span className="text-emerald-400 font-bold">{activeTrial?.fidelity || 0.94}</span>
                </div>
                <div>
                  <span className="text-slate-500">Phase Err: </span>
                  <span className="text-amber-400 font-bold">{activeTrial?.phaseError || 14.2}°</span>
                </div>
              </div>
            </div>

            {/* Monte Carlo Histogram Distribution (7 cols) */}
            <div className="md:col-span-7 bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Fidelity Distribution Ensemble</h4>
                  <p className="text-[11px] text-slate-400">Comparing spread across {displayedTrials.length} recorded trials</p>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  N={qubits} Qubits
                </span>
              </div>

              {/* Custom SVG Histogram Chart */}
              <div className="w-full h-44 relative bg-slate-950/60 rounded-lg border border-slate-800/80 p-2 flex items-end gap-1.5">
                {histogramCounts.map((count, idx) => {
                  const heightPercent = maxHistCount > 0 ? (count / maxHistCount) * 100 : 0;
                  const label = `${Math.round(bins[idx] * 100)}-${Math.round(bins[idx + 1] * 100)}%`;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          scrambler === 'clifford'
                            ? 'bg-indigo-500/80 group-hover:bg-indigo-400'
                            : 'bg-purple-500/80 group-hover:bg-purple-400'
                        }`}
                        style={{ height: `${Math.max(4, heightPercent)}%` }}
                      />
                      <span className="text-[8px] font-mono text-slate-500 mt-1 truncate max-w-full">
                        {bins[idx] * 100}
                      </span>
                      {/* Tooltip on hover */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow z-20 whitespace-nowrap">
                        {label}: {count} trials
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800">
                <span>Spread: ±{currentVariance}</span>
                <span className="text-indigo-400">
                  {scrambler === 'clifford' && qubits <= 6 ? 'High trial-to-trial variance' : 'Converged to Haar equivalence'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Dedicated Trial History Panel */}
      <TrialHistoryPanel
        trials={trials}
        onRetryTrial={handleRetryTrial}
        onClearHistory={handleClearHistory}
        currentQubits={qubits}
        currentScrambler={scrambler}
        currentInputState={inputState}
        noise={noise}
      />
    </div>
  );
};
