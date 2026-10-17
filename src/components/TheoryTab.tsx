import React, { useState } from 'react';
import { BookOpen, CheckCircle, ExternalLink, Lightbulb, FileText, ChevronRight } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'equivalence' | 'variance' | 'gottesman' | 'er_epr'>('equivalence');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Core Theoretical Findings & Mathematical Proof Statements</span>
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Joshi & Mishra (IIT BHU, 2026)</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Investigating the necessity of non-stabilizer "quantum magic" in black hole scrambling and traversable wormhole teleportation protocols.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <button
            onClick={() => setActiveSection('equivalence')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeSection === 'equivalence'
                ? 'border-indigo-500 bg-indigo-500/10 text-white'
                : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">Pillar 01</span>
              <span className="text-[10px] font-mono text-emerald-400">Proven Theorem</span>
            </div>
            <h3 className="text-sm font-semibold mt-1">Average Fidelity Equivalence</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Despite containing zero quantum magic (T-count = 0), Clifford scramblers match universal Haar-random unitaries in ensemble-averaged state transfer fidelity (F&#772; Clifford = F&#772; Haar).
            </p>
          </button>

          <button
            onClick={() => setActiveSection('variance')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeSection === 'variance'
                ? 'border-amber-500 bg-amber-500/10 text-white'
                : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Pillar 02</span>
              <span className="text-[10px] font-mono text-amber-400">Critical Anomaly</span>
            </div>
            <h3 className="text-sm font-semibold mt-1">Low-Qubit Variance Divergence</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              For system sizes $N \le 8$, Clifford scrambling exhibits dramatic trial-to-trial fluctuations (~40,000× greater variance than Haar), making individual teleportation trials unpredictable.
            </p>
          </button>

          <button
            onClick={() => setActiveSection('gottesman')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeSection === 'gottesman'
                ? 'border-purple-500 bg-purple-500/10 text-white'
                : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">Pillar 03</span>
              <span className="text-[10px] font-mono text-purple-400">Complexity Boundary</span>
            </div>
            <h3 className="text-sm font-semibold mt-1">Gottesman-Knill Classical Solvability</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Clifford circuits admit exact polynomial $\mathcal O(N^3)$ simulation on classical computers, proving that fast quantum scrambling does not require classically intractable quantum complexity.
            </p>
          </button>

          <button
            onClick={() => setActiveSection('er_epr')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeSection === 'er_epr'
                ? 'border-cyan-500 bg-cyan-500/10 text-white'
                : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Pillar 04</span>
              <span className="text-[10px] font-mono text-cyan-400">Holographic Duality</span>
            </div>
            <h3 className="text-sm font-semibold mt-1">ER = EPR Wormhole Geometry</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              State transmission through the coupled black hole throat is mathematically dual to quantum teleportation via Hayden-Preskill recovery with an entangled Einstein-Rosen bridge.
            </p>
          </button>
        </div>
      </div>

      {/* Deep Dive Explanatory Card for Selected Pillar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
        {activeSection === 'equivalence' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-indigo-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>Mathematical Proof: Average Fidelity Equivalence</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The fidelity of teleporting an unknown qubit state $|\psi\rangle$ through the Hayden-Preskill wormhole protocol is governed by the 2-design properties of the scrambler ensemble $\mathcal E$. Because the Clifford group $\mathcal C_n$ forms an exact **unitary 2-design and 3-design**, the ensemble average over all Clifford unitaries matches Haar integration:
            </p>
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg font-mono text-xs text-indigo-300 text-center">
              {'E[Tr(ρ_in · ρ_out)]_Clifford = ∫_Haar Tr(ρ_in · ρ_out) dμ(U) = F̄ ≈ 0.945'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This proves that non-Clifford "magic" gates (such as the T-gate, which injects non-stabilizer magic states) are not strictly required to achieve optimal average teleportation efficiency.
            </p>
          </div>
        )}

        {activeSection === 'variance' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>The Low-Qubit Variance Gap (≈ 40,000×)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              While Clifford unitaries replicate Haar averages through 2-design properties, the variance of fidelity requires 4th-moment integration. The Clifford group fails to be a 4-design:
            </p>
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg font-mono text-xs text-amber-300 text-center">
              {'Var_Clifford(F) - Var_Haar(F) ≈ C / 2^(0.85 · N)'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              At $N=2$ to $N=4$ qubits, particular Clifford operators leave stabilizer sub-manifolds unentangled, causing catastrophic drops in single-shot fidelity. However, as $N \to 16$, the Hilbert space dimension $D = 2^N$ washes out discrete subgroup artifacts, restoring Haar-like consistency.
            </p>
          </div>
        )}

        {activeSection === 'gottesman' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>Gottesman-Knill Theorem & Classical Solvability</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              According to the Gottesman-Knill theorem, any quantum circuit consisting exclusively of:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 font-mono pl-2">
              <li>State preparation in the computational basis ($|0\dots0\rangle$)</li>
              <li>Clifford gates (Hadamard $H$, Phase $S$, and CNOT $CX$)</li>
              <li>Measurements in the Pauli basis</li>
            </ul>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              can be perfectly simulated on a classical Turing machine in polynomial time O(N³) and O(N²) space using the stabilizer tableau representation.
            </p>
          </div>
        )}

        {activeSection === 'er_epr' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>ER = EPR Holographic Traversable Wormhole Duality</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In Maldacena, Shenker, and Stanford (2016) and Gao, Jafferis, and Wall (2017), two black holes connected by a non-traversable Einstein-Rosen bridge become traversable when a double-trace deformation coupling exp(i · g · O_L · O_R) is applied between their boundaries. In quantum information language, this physical geometry is isomorphic to the Yoshida-Kitaev teleportation protocol.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
