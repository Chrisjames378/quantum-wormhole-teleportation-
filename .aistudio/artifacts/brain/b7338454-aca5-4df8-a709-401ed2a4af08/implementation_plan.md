# Quantum Wormhole Teleportation & Black Hole Scrambling Playground

An interactive, publication-grade quantum physics simulation and 3D Kerr black hole wormhole workbench comparing Clifford (zero-magic) vs Haar-random (magical) scrambling based on research by Sudhanva Joshi & Sunil Kumar Mishra (IIT Banaras Hindu University, 2026).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following roadmap features were prioritized based on your input:
> - **Quantum Noise & Decoherence**: Amplitude damping ($T_1$), phase damping ($T_2$), and depolarizing channel simulation to test how noise impacts low-$N$ Clifford variance vs Haar robustness.
> - **Code Export Formats**: Dual export modal generating both executable **OpenQASM 2.0** instructions and copy-pasteable **IBM Qiskit / Google Cirq Python scripts**.
> - **Gemini Quantum Co-pilot**: Server-side AI assistant using `gemini-3.8-flash` to explain active state vectors, theorem derivations, and circuit tomography in real time.

---

## 1. Overview & Core Concept

### What It Does
The application is a full-stack quantum mechanics and holographic duality workbench. It simulates the **Hayden-Preskill black hole information retrieval protocol** and **Yoshida-Kitaev traversable wormholes**, testing whether non-stabilizer "magic" (non-Clifford $T$-gates) is strictly required to teleport quantum states through an entangled Einstein-Rosen bridge.

### Target Audience & Persona
- **Quantum computing researchers and students** exploring stabilizer formalism, Clifford groups, Gottesman-Knill simulation, and magic state resource theory.
- **High-energy theoretical physicists** studying black hole scrambling, out-of-time-order correlators (OTOCs), and ER=EPR holography.
- **Educators and visual learners** who need an interactive 3D and 2D visual bridge connecting abstract quantum circuit matrices with spacetime wormhole physics.

### Key Value
- **Empirical Proof Validation**: Directly reproduces the Joshi-Mishra 2026 findings: average fidelity equivalence between Clifford and Haar scramblers, alongside the dramatic low-$N$ variance gap ($\sim 40,000 : 1$) that exponentially collapses as $N \to 16$.
- **Dual Visual Models**: Combines an interactive 3D Three.js spacetime manifold (event horizons, accretion disks, wormhole throat) with an interactive 2D quantum circuit pipeline and 3D Bloch sphere state tomography.

---

## 2. What Has Been Built vs. What to Add Next

### A. Currently Built & Operational
1. **Interactive Simulation Pipeline (`SimulationTab.tsx`)**:
   - $N$-qubit parameter slider ($2 \le N \le 16$).
   - Dual scrambler selection: Clifford group ($\mathcal{O}(N^3)$ Gottesman-Knill) vs Haar-random unitary ($\mathcal{O}(2^N)$ statevector).
   - Input basis state preparation: $|0\rangle, |1\rangle, |+\rangle, |-\rangle, |+i\rangle, |\text{random}\rangle$.
   - Hayden-Preskill 2D throat pipeline canvas with animated quantum particles.
   - 3D interactive draggable Bloch Sphere for state tomography ($|\psi\rangle$ vs $|\psi'\rangle$).
   - Monte Carlo trial runner (50, 100, 500 trials) with real-time histogram distribution and variance spread tracking.
   - Data export in both CSV and JSON formats.

2. **Interactive 3D Einstein-Rosen Bridge (`Wormhole3D.tsx`)**:
   - Three.js multi-part procedural scene: dual black hole singularities, spinning photon accretion rings, hyperbolic throat geometry, spacetime curvature potential grid, and travelling wavepacket.
   - Pinned bottom control dock with camera presets (*Throat Profile*, *Top Orbital*, *Throat Interior*), rotation toggle, wireframe/PBR shader toggle, speed slider, and Zen mode drawer.

3. **Benchmarking Suite (`BenchmarkTab.tsx`)**:
   - Live in-browser CPU benchmark comparing polynomial Clifford vs exponential Haar scaling.
   - Logarithmic SVG scaling charts for execution runtime ($\mu s$) and fidelity variance decay ($\sigma^2(F) \propto 2^{-0.85N}$).
   - Detailed tabular performance and variance ratio breakdown.

4. **Quantum Gate Breakdown & Magic Inspector (`CircuitInspectorTab.tsx`)**:
   - Interactive quantum rails for $q_0 \dots q_3$ showing Clifford ($H, S, CX, CZ$) and Haar ($T, T^\dagger, Ry$).
   - Interactive matrix viewer showing complex unitaries in $\mathbb{C}^{2\times 2}$ and $\mathbb{C}^{4\times 4}$.
   - Quantum resource accounting: $T$-count, stabilizer rank $\chi$, Wigner negativity, and stabilizer generator tableau.

5. **AI Hybrid Sentinel & Telemetry (`AIHybridTab.tsx`)**:
   - Autonomous parameter search loop discovering optimal Clifford decompositions.
   - Live telemetry terminal feed with algorithmic progress messages.
   - Gradient descent loss convergence chart.

6. **Theoretical Foundations (`TheoryTab.tsx`)**:
   - Four core pillars with mathematical proofs (Average Fidelity Equivalence, Low-$N$ Variance Gap, Gottesman-Knill Theorem, and ER=EPR Duality).

---

### B. What to Add Next (Roadmap)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        UPCOMING ROADMAP MODULES                        │
├──────────────────────────┬─────────────────────────┬───────────────────┤
│ 1. Quantum Noise Models  │ 2. Code Export Engine   │ 3. Gemini Co-pilot│
│                          │                         │                   │
│ • Amplitude Damping (T1) │ • OpenQASM 2.0 Circuit  │ • Real-time Q&A   │
│ • Phase Damping (T2)     │ • IBM Qiskit Script     │ • Theorem Proofs  │
│ • Depolarizing Channel   │ • Google Cirq Script    │ • State Analysis  │
│ • Noise vs Fidelity Plot │ • One-click Copy/Export │ • Server-Side API │
└──────────────────────────┴─────────────────────────┴───────────────────┘
```

1. **Module 1: Real-World Quantum Noise & Decoherence Engine**:
   - Add realistic open quantum system noise channels:
     - **Amplitude Damping ($T_1$)**: Energy relaxation modeling spontaneous emission into the vacuum.
     - **Phase Damping / Dephasing ($T_2$)**: Loss of quantum phase coherence without energy loss.
     - **Depolarizing Noise ($p$)**: Uniform isotropic error channel.
   - Interactive noise sliders in the simulation sidebar ($p \in [0, 0.2]$) to test how environmental decoherence degrades the Clifford stabilizer manifold compared to Haar scrambling.

2. **Module 2: OpenQASM 2.0 & Qiskit / Cirq Exporter Modal**:
   - Circuit code generator translating the active scrambler configuration into:
     - Standard **OpenQASM 2.0** file (compatible with IBM Quantum Experience, AWS Braket, Rigetti).
     - Executable **Python Qiskit** script with backend execution boilerplate.
     - Executable **Google Cirq** script with density matrix simulation.
   - Syntax-highlighted code drawer with one-click clipboard copy and `.qasm` file download.

3. **Module 3: Server-Side Gemini Quantum Co-pilot (`gemini-3.8-flash`)**:
   - Create a full-stack backend endpoint `POST /api/quantum/copilot` in `server.ts` utilizing the `@google/genai` TypeScript SDK.
   - Slide-out or dedicated Co-pilot drawer where users can ask:
     - *"Why does Clifford scrambling exhibit high variance at N=4?"*
     - *"Explain the Hayden-Preskill decoding operation U† in terms of Page time."*
     - *"What is the significance of the 2-design property in this trial?"*
   - Context-aware prompting: automatically injects the currently selected qubit count, active scrambler type, noise parameters, and latest measured fidelity into the Gemini prompt for grounded scientific explanations.

---

## 3. User Experience & Visual Design

### Aesthetic Direction
- **Obsidian Dark Laboratory**: Deep slate background (`#090b10`), clean hairline borders (`border-slate-800`), subtle cosmic glow accents (indigo, purple, cyan, and amber).
- **Zero-Pill Metadata**: Clean unboxed typographic metadata with `·` and `/` separators.
- **Unified Font System**:
  - Primary UI & Headlines: **Plus Jakarta Sans** (clean, crisp, modern).
  - Telemetry, Vectors & Code: **JetBrains Mono** with tabular numerals (`font-variant-numeric: tabular-nums`).

### Interaction Flow
1. **Simulation & Noise Tuning**: User configures $N$ qubits, toggles noise channels ($T_1/T_2$), chooses state $|\psi\rangle$, and runs single/batch trials.
2. **Tomography Inspection**: Inspects the 3D Bloch sphere vector divergence and the fidelity histogram.
3. **Co-pilot Consultation**: Clicks the "Ask Co-pilot" button on any metric card to get an immediate, context-aware AI explanation from Gemini.
4. **Code Export**: Clicks "Export Circuit" to view generated OpenQASM and Qiskit code ready to run on real superconducting or trapped-ion hardware.

---

## 4. Technical Architecture & Component Mapping

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT UI                                 │
│  Navigation Top Bar (Wordmark · 6 Tabs · Quick Run Button)             │
├────────────────────────────────────────────────────────────────────────┤
│  Tabs:                                                                 │
│  ├─ SimulationTab (Pipeline, Controls, Noise Sliders, Bloch, Hist)     │
│  ├─ Wormhole3D (Three.js Kerr Horizons, Throat Mesh, Zen Dock)         │
│  ├─ BenchmarkTab (CPU Runtime Tests, Log Scaling Charts, Tables)       │
│  ├─ CircuitInspectorTab (Rails, Unitaries, Magic Accountant)           │
│  ├─ AIHybridTab (Proof Search Loop, Telemetry Log, Loss Graph)         │
│  ├─ TheoryTab (Joshi & Mishra 2026 Core Pillars & Proofs)              │
│  └─ QuantumCopilotDrawer (Interactive Gemini Chat & Theorem Explainer) │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ Fetch (/api/quantum/copilot)
┌────────────────────────────────────▼───────────────────────────────────┐
│                     SERVER-SIDE API (server.ts)                        │
│  Express + Vite middleware                                             │
│  POST /api/quantum/copilot                                             │
│    └─ GoogleGenAI SDK (model: gemini-3.8-flash, user-agent: aistudio)  │
│    └─ Injects active simulation state (N, scrambler, fidelity, noise)  │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & File Strategy
- **`server.ts`**: Express backend entry point hosting Vite middlewares in development and providing `/api/quantum/copilot` endpoint using `@google/genai`.
- **`src/utils/quantumNoise.ts`**: Pure mathematical functions computing Kraus operators for amplitude damping, phase damping, and depolarizing channels.
- **`src/utils/circuitExporter.ts`**: Pure functions compiling the current Clifford/Haar gate sequence into OpenQASM 2.0, Qiskit Python, and Cirq Python.
- **`src/components/QuantumCopilotModal.tsx`**: Ergonomic slide-over drawer powered by the `/api/quantum/copilot` route.
- **`src/components/CircuitExportModal.tsx`**: Syntax-highlighted code export modal with copy and download buttons.

---

## 5. Verification Plan

1. **Compilation & Type Safety**:
   - Verify server and client compile cleanly with `npm run build` and `npm run lint`.
2. **Simulation Fidelity & Noise Bounds**:
   - Validate that setting noise $p > 0$ realistically degrades both Clifford and Haar fidelities while preserving the theoretical average relation.
3. **Circuit Code Validity**:
   - Verify that generated OpenQASM 2.0 adheres to standard syntax specifications (valid gate declarations, register sizing).
4. **Gemini API Connectivity**:
   - Verify `/api/quantum/copilot` correctly answers with streamed or unary structured explanations without exposing keys to the browser.
