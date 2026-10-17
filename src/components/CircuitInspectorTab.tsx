import React, { useState } from 'react';
import { Cpu, Sparkles, ShieldCheck, Info, Check, Eye } from 'lucide-react';
import { CLIFFORD_GATES_CATALOG, HAAR_GATES_CATALOG } from '../utils/quantumMath';
import { QuantumGate } from '../types/quantum';

export const CircuitInspectorTab: React.FC = () => {
  const [selectedGate, setSelectedGate] = useState<QuantumGate>(CLIFFORD_GATES_CATALOG[0]);
  const [activeCircuitType, setActiveCircuitType] = useState<'clifford' | 'haar'>('clifford');

  // Simulated circuit layout rails for 4 qubits
  const cliffordRail = [
    { qubit: 0, gates: [{ id: 'h1', sym: 'H', gate: CLIFFORD_GATES_CATALOG[0] }, { id: 's1', sym: 'S', gate: CLIFFORD_GATES_CATALOG[1] }, { id: 'cx1', sym: 'CX ●', gate: CLIFFORD_GATES_CATALOG[2] }] },
    { qubit: 1, gates: [{ id: 'cx1_t', sym: 'CX ⊕', gate: CLIFFORD_GATES_CATALOG[2] }, { id: 'h2', sym: 'H', gate: CLIFFORD_GATES_CATALOG[0] }, { id: 's2', sym: 'S', gate: CLIFFORD_GATES_CATALOG[1] }] },
    { qubit: 2, gates: [{ id: 'h3', sym: 'H', gate: CLIFFORD_GATES_CATALOG[0] }, { id: 'cz1', sym: 'CZ ●', gate: CLIFFORD_GATES_CATALOG[3] }, { id: 'h4', sym: 'H', gate: CLIFFORD_GATES_CATALOG[0] }] },
    { qubit: 3, gates: [{ id: 'cz1_t', sym: 'CZ ●', gate: CLIFFORD_GATES_CATALOG[3] }, { id: 's3', sym: 'S', gate: CLIFFORD_GATES_CATALOG[1] }, { id: 'h5', sym: 'H', gate: CLIFFORD_GATES_CATALOG[0] }] },
  ];

  const haarRail = [
    { qubit: 0, gates: [{ id: 'ht1', sym: 'H', gate: CLIFFORD_GATES_CATALOG[0] }, { id: 't1', sym: 'T', gate: HAAR_GATES_CATALOG[0] }, { id: 'cx_h1', sym: 'CX ●', gate: CLIFFORD_GATES_CATALOG[2] }] },
    { qubit: 1, gates: [{ id: 'cx_h1_t', sym: 'CX ⊕', gate: CLIFFORD_GATES_CATALOG[2] }, { id: 'td1', sym: 'T†', gate: HAAR_GATES_CATALOG[1] }, { id: 'ry1', sym: 'Ry', gate: HAAR_GATES_CATALOG[2] }] },
    { qubit: 2, gates: [{ id: 't2', sym: 'T', gate: HAAR_GATES_CATALOG[0] }, { id: 'h_h1', sym: 'H', gate: CLIFFORD_GATES_CATALOG[0] }, { id: 't3', sym: 'T', gate: HAAR_GATES_CATALOG[0] }] },
    { qubit: 3, gates: [{ id: 'ry2', sym: 'Ry', gate: HAAR_GATES_CATALOG[2] }, { id: 'td2', sym: 'T†', gate: HAAR_GATES_CATALOG[1] }, { id: 't4', sym: 'T', gate: HAAR_GATES_CATALOG[0] }] },
  ];

  const activeRail = activeCircuitType === 'clifford' ? cliffordRail : haarRail;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>Quantum Circuit Gate Breakdown & Magic Inspector</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Analyze how Clifford scramblers generate complete entanglement without non-stabilizer magic states, contrasted with universal Haar-random unitaries.
            </p>
          </div>

          {/* Segmented Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700">
            <button
              onClick={() => {
                setActiveCircuitType('clifford');
                setSelectedGate(CLIFFORD_GATES_CATALOG[0]);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeCircuitType === 'clifford'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Clifford (Zero Magic)
            </button>
            <button
              onClick={() => {
                setActiveCircuitType('haar');
                setSelectedGate(HAAR_GATES_CATALOG[0]);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeCircuitType === 'haar'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Haar-Random (High Magic)
            </button>
          </div>
        </div>

        {/* Circuit Diagram Rails */}
        <div className="mt-5 space-y-4">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>4-Qubit Scrambler Subsystem Circuit Diagram</span>
            <span className="text-slate-500 text-[11px]">Click any gate to inspect unitary matrix & algebraic action</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-5 space-y-4 font-mono overflow-x-auto">
            {activeRail.map((rail) => (
              <div key={rail.qubit} className="flex items-center gap-3 min-w-[500px]">
                <span className="text-xs font-bold text-slate-400 w-8">q[{rail.qubit}]</span>
                <div className="flex-1 flex items-center relative py-2">
                  {/* Horizontal Wire Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-slate-700 z-0"></div>

                  {/* Gates on Wire */}
                  <div className="relative z-10 flex items-center gap-8 pl-4">
                    {rail.gates.map((g) => {
                      const isSelected = selectedGate.id === g.gate.id;
                      const isMagic = g.gate.type === 'magic';
                      return (
                        <button
                          key={g.id}
                          onClick={() => setSelectedGate(g.gate)}
                          className={`w-11 h-11 rounded-lg border flex items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-md ${
                            isSelected
                              ? 'ring-2 ring-indigo-400 scale-105 border-indigo-400 bg-indigo-500/30 text-white'
                              : isMagic
                              ? 'border-purple-500/50 bg-purple-950/60 text-purple-300 hover:border-purple-400'
                              : 'border-slate-700 bg-slate-900/90 text-slate-200 hover:border-slate-500'
                          }`}
                        >
                          {g.sym}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Inspector Details: Selected Gate Matrix & Resource Accountant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Gate Matrix & Algebra (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Unitary Matrix Representation: {selectedGate.name}</span>
            </h3>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                selectedGate.type === 'clifford'
                  ? 'bg-indigo-950/60 border-indigo-500/30 text-indigo-300'
                  : 'bg-purple-950/60 border-purple-500/30 text-purple-300'
              }`}
            >
              {selectedGate.type === 'clifford' ? 'Clifford (T=0)' : 'Non-Clifford Magic'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{selectedGate.description}</p>

          {/* Matrix Display Box */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-5 flex flex-col items-center justify-center font-mono text-sm text-slate-200">
            <div className="text-[11px] text-slate-500 mb-2 font-mono">
              Complex Unitary Operator Matrix U ∈ ℂ^({selectedGate.matrix.length} × {selectedGate.matrix.length})
            </div>
            <div className="inline-flex items-center gap-2">
              <div className="text-3xl font-light text-slate-600">[</div>
              <div className="grid gap-2">
                {selectedGate.matrix.map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-4 justify-around min-w-[140px]">
                    {row.map((val, cIdx) => (
                      <span key={cIdx} className="w-16 text-center font-bold text-indigo-300">
                        {val}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div className="text-3xl font-light text-slate-600">]</div>
            </div>
          </div>

          {/* Pauli Conjugation Invariance Rule */}
          <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-300 space-y-1.5 font-mono">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Gottesman-Knill Normalizer Property</div>
            {selectedGate.type === 'clifford' ? (
              <p className="text-emerald-400">
                $U \mathcal P_n U^\dagger = \mathcal P_n$: Maps Pauli operators to Pauli operators. Stabilizer tableau can be updated in polynomial $\mathcal O(N^2)$ time per gate without storing $2^N$ amplitudes!
              </p>
            ) : (
              <p className="text-purple-400">
                $U \mathcal P_n U^\dagger \notin \mathcal P_n$: Destroys stabilizer structure by introducing continuous phases, requiring full $2^N$ statevector or magic-state injection distillation.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Resource Accountant & Stabilizer Generators (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">
            Quantum Resource Accountant
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg flex justify-between items-center">
              <span className="text-slate-400">T-Count (Magic):</span>
              <span className={`font-bold ${activeCircuitType === 'clifford' ? 'text-emerald-400' : 'text-purple-400'}`}>
                {activeCircuitType === 'clifford' ? '0 (Zero T-Gates)' : '16 T-Gates'}
              </span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg flex justify-between items-center">
              <span className="text-slate-400">Stabilizer Rank ($\chi$):</span>
              <span className="font-bold text-indigo-400">
                {activeCircuitType === 'clifford' ? '1 (Pure Stabilizer)' : '2¹⁶ (Max Rank)'}
              </span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg flex justify-between items-center">
              <span className="text-slate-400">Wigner Negativity:</span>
              <span className="font-bold text-slate-200">
                {activeCircuitType === 'clifford' ? '0.000 (Non-negative)' : '0.842 (Highly Negative)'}
              </span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg flex justify-between items-center">
              <span className="text-slate-400">Simulation Class:</span>
              <span className="font-bold text-amber-400">
                {activeCircuitType === 'clifford' ? 'BQP ∩ P (Classical Poly)' : 'BQP-Complete (Quantum Hard)'}
              </span>
            </div>
          </div>

          {/* Stabilizer Generator Tableau Display */}
          <div className="border-t border-slate-800 pt-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Stabilizer Generator Tableau ($S$)
            </div>
            <div className="bg-slate-950/70 p-3 rounded-lg font-mono text-[11px] space-y-1 text-slate-300 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">g₁ = </span>
                <span className="text-indigo-400">+ X ⊗ Z ⊗ I ⊗ I</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">g₂ = </span>
                <span className="text-indigo-400">+ Z ⊗ X ⊗ Z ⊗ I</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">g₃ = </span>
                <span className="text-indigo-400">+ I ⊗ Z ⊗ X ⊗ Z</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">g₄ = </span>
                <span className="text-indigo-400">+ I ⊗ I ⊗ Z ⊗ X</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
