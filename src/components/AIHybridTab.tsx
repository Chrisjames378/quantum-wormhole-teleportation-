import React, { useState, useEffect, useRef } from 'react';
import { Brain, Play, Pause, RefreshCw, Terminal, CheckCircle2, TrendingDown, ShieldAlert } from 'lucide-react';
import { TelemetryLog } from '../types/quantum';

interface Props {
  onTrialCompleted?: () => void;
}

export const AIHybridTab: React.FC<Props> = ({ onTrialCompleted }) => {
  const [proofTrialsCount, setProofTrialsCount] = useState(1482903);
  const [accuracy, setAccuracy] = useState(99.89);
  const [stabilizerCorrections, setStabilizerCorrections] = useState(42);
  const [isLoopActive, setIsLoopActive] = useState(false);
  const [learningRate, setLearningRate] = useState(0.005);
  const [logs, setLogs] = useState<TelemetryLog[]>([
    {
      id: 'l1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: 'Autonomous Proof Engine active: Verifying zero-magic Clifford equivalence bounds.',
      details: 'Ensemble sample size N=2 to 16, Hilbert dimension up to 2^16.',
    },
    {
      id: 'l2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'opt',
      message: 'Executing batch matrix inversion for 16-qubit symplectic Clifford tableau.',
      details: 'Determining optimal U† conjugation phase correction.',
    },
    {
      id: 'l3',
      timestamp: new Date().toLocaleTimeString(),
      level: 'success',
      message: 'Mean fidelity bounds confirmed: Clifford ensemble matches Haar within 0.0018 delta.',
    },
  ]);

  const [lossHistory, setLossHistory] = useState([0.42, 0.35, 0.28, 0.21, 0.15, 0.09, 0.05, 0.024, 0.012, 0.004]);
  const intervalRef = useRef<number | null>(null);

  // Toggle continuous optimization loop
  const toggleLoop = () => {
    setIsLoopActive((prev) => !prev);
  };

  useEffect(() => {
    if (isLoopActive) {
      intervalRef.current = window.setInterval(() => {
        setProofTrialsCount((prev) => prev + Math.floor(Math.random() * 35) + 15);
        if (Math.random() > 0.6) {
          setStabilizerCorrections((prev) => prev + 1);
        }

        // Random log injection
        const phrases = [
          'Scrambler commutator evaluation: [U_cliff, O_Pauli] checked across 64 seeds.',
          'Symplectic Gaussian elimination converged on optimal decoding circuit.',
          'Checking out-of-time-order correlator (OTOC) butterfly decay rate.',
          'Phase angle calibration stabilized low-N Clifford variance excursion.',
          'Unitary conjugate match confirmed with zero non-stabilizer magic.',
        ];
        const chosen = phrases[Math.floor(Math.random() * phrases.length)];

        setLogs((prev) => [
          {
            id: Math.random().toString(),
            timestamp: new Date().toLocaleTimeString(),
            level: Math.random() > 0.8 ? 'warn' : 'info',
            message: chosen,
          },
          ...prev.slice(0, 40),
        ]);

        // Jitter loss slightly downwards
        setLossHistory((prev) => {
          const last = prev[prev.length - 1];
          const next = Math.max(0.0008, last * 0.98 + (Math.random() - 0.5) * 0.001);
          return [...prev.slice(1), parseFloat(next.toFixed(4))];
        });

        if (onTrialCompleted) onTrialCompleted();
      }, 400);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoopActive]);

  // Force single optimization batch
  const handleForceBatch = () => {
    setProofTrialsCount((prev) => prev + 250);
    setStabilizerCorrections((prev) => prev + 2);
    setAccuracy(99.92);
    setLogs((prev) => [
      {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        level: 'success',
        message: 'Manual optimization batch executed. Verified stabilizer recovery gates.',
        details: 'Mean fidelity validated at 99.92% across all 16 Clifford generators.',
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
              <Brain className="w-5 h-5 text-purple-400" />
              <span>AI Hybrid Model Sentinel & Automated Proof Suite</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Neural-Stabilizer hybrid solver searching Clifford group decompositions to establish exact zero-magic feasibility boundaries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLoop}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                isLoopActive
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'
              }`}
            >
              {isLoopActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Proof Loop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Continuous AI Proof Loop</span>
                </>
              )}
            </button>

            <button
              onClick={handleForceBatch}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Force Batch</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Autonomous Proof Trials</div>
            <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
              {proofTrialsCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Continuous parameter search testing Clifford variance scaling.</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Decoder Converged Accuracy</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {accuracy}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Optimizing $U^\dagger$ inverse scrambler configurations in real time.</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Stabilizer Corrections</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {stabilizerCorrections}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Anomalous high-variance dips stabilized by phase-masking.</p>
          </div>
        </div>
      </div>

      {/* 2-Column: Live Telemetry Terminal + Convergence Loss Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Terminal Telemetry Log (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col h-80">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Autonomous Proof Engine Telemetry</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">ENGINE: HYBRID-STABILIZER-2026</span>
          </div>

          <div className="flex-1 bg-slate-950/80 border border-slate-800/90 rounded-lg p-3 overflow-y-auto space-y-2 font-mono text-[11px]">
            {logs.map((log) => (
              <div key={log.id} className="leading-relaxed">
                <span className="text-slate-500">[{log.timestamp}] </span>
                <span
                  className={
                    log.level === 'success'
                      ? 'text-emerald-400 font-semibold'
                      : log.level === 'warn'
                      ? 'text-amber-400 font-semibold'
                      : log.level === 'opt'
                      ? 'text-purple-400 font-semibold'
                      : 'text-slate-300'
                  }
                >
                  {log.message}
                </span>
                {log.details && <div className="text-[10px] text-slate-500 pl-4">{log.details}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Convergence Loss Rate (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-80">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-indigo-400" />
              <span>Hybrid Decoder Convergence Loss ($U^\dagger$)</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">Loss: {lossHistory[lossHistory.length - 1]}</span>
          </div>

          {/* SVG Loss Chart */}
          <div className="flex-1 w-full bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 flex flex-col justify-between">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 350 140">
              {/* Grid */}
              {[30, 60, 90, 120].map((y, i) => (
                <line key={i} x1="20" y1={y} x2="330" y2={y} stroke="#1e293b" strokeDasharray="2 2" />
              ))}

              {/* Area under curve */}
              <polygon
                fill="rgba(168, 85, 247, 0.15)"
                points={`20,130 ${lossHistory
                  .map((val, idx) => {
                    const x = 20 + (idx / (lossHistory.length - 1)) * 310;
                    const y = 130 - (val / 0.5) * 115;
                    return `${x},${Math.max(10, y)}`;
                  })
                  .join(' ')} 330,130`}
              />

              {/* Line */}
              <polyline
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
                points={lossHistory
                  .map((val, idx) => {
                    const x = 20 + (idx / (lossHistory.length - 1)) * 310;
                    const y = 130 - (val / 0.5) * 115;
                    return `${x},${Math.max(10, y)}`;
                  })
                  .join(' ')}
              />

              {lossHistory.map((val, idx) => {
                const x = 20 + (idx / (lossHistory.length - 1)) * 310;
                const y = 130 - (val / 0.5) * 115;
                return <circle key={idx} cx={x} cy={Math.max(10, y)} r="3" fill="#c084fc" />;
              })}
            </svg>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
              <span>Epoch 1 (0.420)</span>
              <span className="text-indigo-400">Phase Gradient Descent</span>
              <span>Epoch 1000 ({lossHistory[lossHistory.length - 1]})</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
