import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Navigation, ActiveTab } from './components/Navigation';
import { SimulationTab } from './components/SimulationTab';
import { Wormhole3D } from './components/Wormhole3D';
import { BenchmarkTab } from './components/BenchmarkTab';
import { CircuitInspectorTab } from './components/CircuitInspectorTab';
import { HardwareBlueprintTab } from './components/HardwareBlueprintTab';
import { AIHybridTab } from './components/AIHybridTab';
import { TheoryTab } from './components/TheoryTab';
import { CircuitExportModal } from './components/CircuitExportModal';
import { QuantumCopilotModal } from './components/QuantumCopilotModal';
import { ScramblerType, InputStateType, SimulationTrial } from './types/quantum';
import { simulateTeleportationTrial } from './utils/quantumMath';
import { NoiseConfiguration, DEFAULT_NOISE, applyNoiseToFidelity } from './utils/quantumNoise';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sim');
  const [qubits, setQubits] = useState(4);
  const [scrambler, setScrambler] = useState<ScramblerType>('clifford');
  const [inputState, setInputState] = useState<InputStateType>('plus');
  const [trials, setTrials] = useState<SimulationTrial[]>([]);
  const [noise, setNoise] = useState<NoiseConfiguration>(DEFAULT_NOISE);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Quick trial action triggered from top bar
  const handleQuickTrial = () => {
    setIsSimulating(true);
    const result = simulateTeleportationTrial(qubits, scrambler, inputState, trials.length + 1);
    if (noise.enabled) {
      const noiseImpact = applyNoiseToFidelity(result.trial.fidelity, noise, qubits, scrambler);
      result.trial.fidelity = noiseImpact.degradedFidelity;
    }
    setTimeout(() => {
      setTrials((prev) => [result.trial, ...prev.slice(0, 499)]);
      setIsSimulating(false);
      setActiveTab('sim');
    }, 150);
  };

  const latestTrial = trials.length > 0 ? trials[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-slate-200">
      {/* Top Bar Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickTrial={handleQuickTrial}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        isSimulating={isSimulating}
        latestTrial={latestTrial}
      />

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-grow w-full space-y-6">
        
        {/* Sub-Header Context Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Quantum Teleportation & Black Hole Scrambling Playground
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Testing Clifford (Zero-Magic) vs. Haar-Random (Universal) Circuits in Hayden-Preskill Wormholes
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="text-slate-500">Architecture:</span>
              <span className="text-indigo-400 font-semibold uppercase">{scrambler}</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-500">System:</span>
              <span className="text-slate-200 font-semibold">{qubits} Qubits</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-500">Noise:</span>
              <span className={noise.enabled ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                {noise.enabled ? 'Decoherence ON' : 'Ideal Unitary'}
              </span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/30 border border-emerald-500/20">
              <span className="text-slate-500">Last Fidelity:</span>
              <span className="text-emerald-400 font-bold">
                {latestTrial ? `${(latestTrial.fidelity * 100).toFixed(1)}%` : '94.2%'}
              </span>
            </span>
          </div>
        </div>

        {/* Tab Switcher Body */}
        {activeTab === 'sim' && (
          <SimulationTab
            qubits={qubits}
            setQubits={setQubits}
            scrambler={scrambler}
            setScrambler={setScrambler}
            inputState={inputState}
            setInputState={setInputState}
            trials={trials}
            setTrials={setTrials}
            noise={noise}
            setNoise={setNoise}
            onOpenExport={() => setIsExportOpen(true)}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        )}

        {activeTab === 'three3d' && (
          <div className="space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-200">
                Interactive 3D Einstein-Rosen Bridge & Kerr Black Holes
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Drag on the viewport to rotate the dual black hole spacetime geometry. Click the controls below to change camera angles and render modes.
              </p>
            </div>
            <Wormhole3D scramblerType={scrambler} fidelity={latestTrial?.fidelity || 0.94} />
          </div>
        )}

        {activeTab === 'benchmark' && <BenchmarkTab />}

        {activeTab === 'circuits' && <CircuitInspectorTab />}

        {activeTab === 'hardware' && <HardwareBlueprintTab />}

        {activeTab === 'ai' && (
          <AIHybridTab
            onTrialCompleted={() => {
              // subtly update background counts
            }}
          />
        )}

        {activeTab === 'theory' && <TheoryTab />}

      </main>

      {/* Code Export Modal */}
      <CircuitExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        qubits={qubits}
        scrambler={scrambler}
        inputState={inputState}
      />

      {/* Gemini Quantum Co-pilot Drawer */}
      <QuantumCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        qubits={qubits}
        scrambler={scrambler}
        fidelity={latestTrial?.fidelity || 0.94}
        noise={noise}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#07090e] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            Based on research by <span className="text-slate-400 font-medium">Sudhanva Joshi & Sunil Kumar Mishra</span> (IIT Banaras Hindu University, 2026).
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-[11px] font-mono">
            <span>ER = EPR Duality</span>
            <span>·</span>
            <span>Hayden-Preskill Scrambling</span>
            <span>·</span>
            <span>Gottesman-Knill Theorem</span>
          </div>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}
