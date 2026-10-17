import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Activity,
  DollarSign,
  Zap,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Flame,
  Radio,
  Clock,
  Sparkles,
  BarChart3,
  Server
} from 'lucide-react';
import {
  QUANTUM_PLATFORMS,
  HARDWARE_STACK_LAYERS,
  PULSE_SEQUENCE_TIMELINE,
  LAB_BILL_OF_MATERIALS
} from '../utils/hardwareData';
import { PhysicalPlatformId } from '../types/hardware';

export const HardwareBlueprintTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'platforms' | 'stack' | 'pulses' | 'bom' | 'comparison'>('platforms');
  const [selectedPlatformId, setSelectedPlatformId] = useState<PhysicalPlatformId>('superconducting');
  const [selectedLayerLevel, setSelectedLayerLevel] = useState<number>(1);
  const [activePulseStageIndex, setActivePulseStageIndex] = useState<number>(3); // Default to Fast Scrambling stage

  const currentPlatform = QUANTUM_PLATFORMS.find((p) => p.id === selectedPlatformId) || QUANTUM_PLATFORMS[0];
  const currentLayer = HARDWARE_STACK_LAYERS.find((l) => l.level === selectedLayerLevel) || HARDWARE_STACK_LAYERS[0];
  const currentPulseStage = PULSE_SEQUENCE_TIMELINE[activePulseStageIndex] || PULSE_SEQUENCE_TIMELINE[0];

  return (
    <div className="space-y-6">
      {/* Blueprint Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PHYSICAL EXPERIMENTAL BLUEPRINT
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LAB SPECIFICATIONS & INSTRUMENTATION
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Physical Apparatus & Quantum Device Engineering Guide
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              How to physically construct and calibrate a quantum computing apparatus capable of realizing the Hayden-Preskill protocol,
              Gao-Jafferis-Wall traversable wormhole dynamics (ER=EPR), and benchmarking Clifford vs. Haar-random fast scramblers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center min-w-[110px]">
              <div className="text-[10px] font-mono uppercase text-slate-500">Min. Qubits</div>
              <div className="text-lg font-bold font-mono text-indigo-400">7 - 9 Physical</div>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center min-w-[110px]">
              <div className="text-[10px] font-mono uppercase text-slate-500">Base Temp</div>
              <div className="text-lg font-bold font-mono text-cyan-400">10 - 15 mK</div>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center min-w-[110px]">
              <div className="text-[10px] font-mono uppercase text-slate-500">Pulse Resolution</div>
              <div className="text-lg font-bold font-mono text-emerald-400">&lt; 1 ns / 14-bit</div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Strip */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('platforms')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'platforms'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>QPU Hardware Platforms</span>
          </button>

          <button
            onClick={() => setActiveSubTab('stack')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'stack'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5-Layer Hardware Stack</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pulses')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'pulses'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Pulse Sequence Timing</span>
          </button>

          <button
            onClick={() => setActiveSubTab('bom')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'bom'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Lab Bill of Materials (BOM)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('comparison')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'comparison'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clifford Physical Advantage</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: QPU HARDWARE PLATFORMS */}
      {activeSubTab === 'platforms' && (
        <div className="space-y-6">
          {/* Platform Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUANTUM_PLATFORMS.map((platform) => {
              const isSelected = platform.id === selectedPlatformId;
              return (
                <div
                  key={platform.id}
                  onClick={() => setSelectedPlatformId(platform.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      {platform.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        platform.wormholeFeasibility === 'Demonstrated'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : platform.wormholeFeasibility === 'High'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {platform.wormholeFeasibility}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-2 mb-1">{platform.name}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{platform.qubitType}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/60 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">T2 Coherence</span>
                      <span className="text-slate-200 font-semibold">{platform.coherenceT2}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">2Q Fidelity</span>
                      <span className="text-emerald-400 font-semibold">{platform.twoQubitFidelity.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Platform Technical Blueprint */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{currentPlatform.name}</h3>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                    {currentPlatform.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{currentPlatform.physicalMechanism}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Operational Temperature:</span>
                <span className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/50 px-2.5 py-1 rounded border border-cyan-800/60">
                  {currentPlatform.operationalTemp}
                </span>
              </div>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">T1 Relaxation</span>
                <span className="text-xs font-mono font-bold text-slate-200">{currentPlatform.coherenceT1}</span>
              </div>
              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">T2 Dephasing</span>
                <span className="text-xs font-mono font-bold text-slate-200">{currentPlatform.coherenceT2}</span>
              </div>
              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">1Q Gate Fidelity</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{currentPlatform.oneQubitFidelity}</span>
              </div>
              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">2Q Gate Fidelity</span>
                <span className="text-xs font-mono font-bold text-indigo-400">{currentPlatform.twoQubitFidelity}</span>
              </div>
              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Gate Speed</span>
                <span className="text-xs font-mono font-bold text-cyan-400">{currentPlatform.gateSpeed}</span>
              </div>
              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Qubit Topology</span>
                <span className="text-xs font-mono font-bold text-purple-300">{currentPlatform.connectivity}</span>
              </div>
            </div>

            {/* In-Depth Engineering Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-2">
                  <h4 className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 uppercase font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Key Hardware Advantages for Wormhole Simulation
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentPlatform.keyAdvantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-2">
                  <h4 className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 uppercase font-mono">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Primary Experimental Bottlenecks
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentPlatform.primaryChallenges.map((chal, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 shrink-0 mt-0.5">•</span>
                        <span>{chal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 uppercase font-mono">
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                    Landmark Laboratory Implementations & Papers
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {currentPlatform.notableImplementations.map((paper, i) => (
                      <li key={i} className="p-2.5 bg-slate-900/60 border border-slate-800/60 rounded-lg">
                        <div className="font-medium text-slate-200">{paper}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl">
                  <h4 className="text-xs font-semibold text-indigo-300 font-mono uppercase mb-1">
                    Direct Wormhole Realization Verdict
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentPlatform.id === 'superconducting' &&
                      'Superconducting transmons are currently the leading platform for wormhole teleportation experiments due to sub-50ns 2-qubit gate times, allowing deep scrambling circuits to complete well within the ~100 µs T2 decoherence limit.'}
                    {currentPlatform.id === 'trapped_ion' &&
                      'Trapped-ion systems offer native all-to-all connectivity, eliminating the multi-qubit SWAP gate overhead of planar chips. Their second-scale T2 coherence allows virtually noiseless state recovery.'}
                    {currentPlatform.id === 'neutral_atom' &&
                      'Neutral Rydberg arrays can physically shift atom coordinates via optical tweezers during computation, enabling spatial geometric analogies to wormhole throat expansion.'}
                    {currentPlatform.id === 'photonic' &&
                      'Photonic QPUs provide room-temperature teleportation through optical fiber channels, serving as the basis for distributed long-distance ER=EPR quantum network testbeds.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 5-LAYER HARDWARE STACK */}
      {activeSubTab === 'stack' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Vertical Stack Hierarchy */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Click a layer to inspect physical subsystems:
              </div>
              {HARDWARE_STACK_LAYERS.map((layer) => {
                const isSelected = layer.level === selectedLayerLevel;
                return (
                  <div
                    key={layer.level}
                    onClick={() => setSelectedLayerLevel(layer.level)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/40 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        LEVEL {layer.level}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-indigo-400' : 'text-slate-600'}`}
                      />
                    </div>
                    <h4 className="text-sm font-bold text-white mt-2">{layer.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{layer.role}</p>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Layer Detailed Engineering Spec */}
            <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  Stack Level {currentLayer.level} Specification
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{currentLayer.name}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentLayer.role}</p>
              </div>

              {/* Operating Conditions & Tolerances */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    Operating Conditions
                  </span>
                  <p className="text-xs font-mono text-cyan-300 font-medium">{currentLayer.operatingConditions}</p>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Engineering Metrics & Tolerances
                  </span>
                  <p className="text-xs font-mono text-indigo-300 font-medium">{currentLayer.specifications}</p>
                </div>
              </div>

              {/* Physical Subsystems & Components */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase font-mono text-slate-300 flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-indigo-400" />
                  Key Subcomponents & Apparatus Modules
                </h4>
                <div className="space-y-2">
                  {currentLayer.components.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-indigo-900/50 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-xs text-slate-200">{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: PULSE SEQUENCE TIMING */}
      {activeSubTab === 'pulses' && (
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Nanosecond Multi-Channel Pulse Timeline (Wormhole Protocol)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  The microsecond microwave pulse waveform sequence applied across the physical control channels of the quantum processor.
                </p>
              </div>

              <div className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-3 py-1.5 rounded-lg border border-indigo-800/60">
                Total Protocol Duration: ~1.45 µs (well under T2 ≈ 80 µs)
              </div>
            </div>

            {/* Stage Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {PULSE_SEQUENCE_TIMELINE.map((stage, idx) => {
                const isActive = idx === activePulseStageIndex;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActivePulseStageIndex(idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="text-[9px] font-mono opacity-80">{stage.timeWindowNs}</div>
                    <div className="text-xs font-semibold truncate mt-0.5">{stage.title.split(':')[0]}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Detailed Breakdown */}
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {currentPulseStage.timeWindowNs}
                    </span>
                    <h4 className="text-sm font-bold text-white">{currentPulseStage.title}</h4>
                  </div>
                  <p className="text-xs text-indigo-300 mt-1 font-mono">{currentPulseStage.protocolRole}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/60">
                {currentPulseStage.physicsDescription}
              </p>

              {/* Hardware Channels Waveform Table */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">
                  Active QPU Line Waveforms in this Window:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {currentPulseStage.channels.map((ch, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl space-y-2 font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{ch.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded ${
                            ch.pulseType === 'Idle'
                              ? 'bg-slate-800 text-slate-500'
                              : ch.pulseType === 'Dispersive'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : ch.pulseType === 'DRAG'
                              ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {ch.pulseType}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-400">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Freq:</span>
                          <span className="text-slate-200">{ch.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Amp:</span>
                          <span className="text-slate-200">{ch.amplitude}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Phase:</span>
                          <span className="text-indigo-300 truncate max-w-[120px]">{ch.phase}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: LAB BILL OF MATERIALS & PROCUREMENT ROADMAP */}
      {activeSubTab === 'bom' && (
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Laboratory Bill of Materials (BOM) & Equipment Roadmap
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Complete scientific procurement roadmap for setting up a university or enterprise-grade quantum laboratory.
                </p>
              </div>

              <div className="text-xs font-mono text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/60">
                Turnkey Lab Capital Estimate: $1.2M - $2.4M (or Cloud QPU access at $1.60/shot)
              </div>
            </div>

            <div className="space-y-6">
              {LAB_BILL_OF_MATERIALS.map((cat, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="border-b border-slate-800/80 pb-1">
                    <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide text-indigo-300">
                      {cat.category}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{cat.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cat.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <h5 className="text-xs font-bold text-white">{item.name}</h5>
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/60 block w-fit">
                            {item.vendorOrSource}
                          </span>
                          <p className="text-[11px] text-slate-300 leading-relaxed mt-2">{item.purpose}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-800/60 space-y-1 text-[11px] font-mono">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Cost:</span>
                            <span className="text-emerald-400 font-semibold">{item.estimatedCost}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            <span className="text-slate-500 block">Critical Spec:</span>
                            <span className="text-cyan-300">{item.criticalTolerance}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: CLIFFORD PHYSICAL HARDWARE ADVANTAGE */}
      {activeSubTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                Experimental Physics Insight
              </span>
              <h3 className="text-base font-bold text-white mt-2">
                Why Clifford (Zero-Magic) Scramblers Are Revolutionizing Physical Quantum Experiments
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                As proven by Joshi & Mishra (2026), Clifford scramblers achieve the exact same average teleportation fidelity
                (F̄ ≈ 94.5%) as universal Haar-random unitaries, but offer profound physical hardware advantages on actual laboratory devices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit border border-emerald-500/20">
                  <Flame className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Zero Magic State Distillation</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Haar-random unitaries require continuous T-gates and arbitrary rotations ($R_z(\theta)$). In fault-tolerant quantum computers,
                  a single $T$-gate requires up to 15 physical ancillary qubits and thousands of operations for magic-state distillation.
                  Clifford scramblers have <strong className="text-emerald-400 font-mono">T-count = 0</strong>, completely bypassing this massive overhead.
                </p>
              </div>

              <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg w-fit border border-indigo-500/20">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Immunity to Angle Drift Noise</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Clifford gates only require discrete $\pi/2$ and $\pi$ rotation pulses. These can be calibrated with ultra-high precision using
                  standard randomized benchmarking and DRAG pulses. Arbitrary Haar angles suffer continuous phase drift from 1/f flux noise
                  and local oscillator frequency instability.
                </p>
              </div>

              <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg w-fit border border-cyan-500/20">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Full Classical Verification (O(N³))</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Under the Gottesman-Knill theorem, a Clifford scrambler on 100 physical qubits can be verified classically in polynomial time
                  $O(N^3)$ on a standard laptop using Pauli stabilizer tableaus. Haar circuits on 100 qubits require $2^{100}$ amplitudes, making classical verification physically impossible.
                </p>
              </div>
            </div>

            {/* Direct Side-by-Side Comparison Table */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[11px] uppercase">
                    <th className="text-left py-2 px-3">Physical Metric</th>
                    <th className="text-left py-2 px-3 text-indigo-400">Clifford Group (Zero-Magic)</th>
                    <th className="text-left py-2 px-3 text-amber-400">Haar-Random (Universal)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">State Transfer Fidelity (F̄)</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">~94.5% (Exact theoretical match)</td>
                    <td className="py-2.5 px-3 text-slate-200">~94.5%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">Magic Overhead (T-count)</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">0 (Zero Magic)</td>
                    <td className="py-2.5 px-3 text-amber-400">12 - 48 non-Clifford T gates</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">Pulse Calibration Complexity</td>
                    <td className="py-2.5 px-3 text-indigo-300">Discrete 90° / 180° microwave pulses only</td>
                    <td className="py-2.5 px-3 text-slate-400">Continuous angle synthesis (arbitrary θ, φ)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">Physical Execution Duration</td>
                    <td className="py-2.5 px-3 text-cyan-300">260 ns (65% faster)</td>
                    <td className="py-2.5 px-3 text-slate-400">740 ns (higher decoherence exposure)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">Classical Simulation Cost</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">Polynomial O(N³) — Gottesman-Knill</td>
                    <td className="py-2.5 px-3 text-amber-400">Exponential O(2^N) — Classical Wall</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">Susceptibility to Phase Noise</td>
                    <td className="py-2.5 px-3 text-emerald-400">Low (stabilizer error syndroming)</td>
                    <td className="py-2.5 px-3 text-amber-400">High (accumulates continuous phase drift)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
