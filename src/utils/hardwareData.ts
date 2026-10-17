import { PhysicalPlatform, HardwareLayer, PulseSequenceStage, BOMCategory } from '../types/hardware';

export const QUANTUM_PLATFORMS: PhysicalPlatform[] = [
  {
    id: 'superconducting',
    name: 'Superconducting Transmon Qubits',
    category: 'Circuit QED (cQED)',
    qubitType: 'Al/AlOx/Al Josephson junctions shunted by planar capacitor',
    operationalTemp: '10 - 15 mK (Dilution Refrigerator base plate)',
    coherenceT1: '80 - 150 µs',
    coherenceT2: '60 - 120 µs (spin-echo)',
    oneQubitFidelity: '99.94%',
    twoQubitFidelity: '99.4% - 99.8% (CZ / iSWAP / Cross-Resonance)',
    gateSpeed: '20 - 50 ns (ultra-fast)',
    connectivity: 'Planar nearest-neighbor with tunable couplers (g_ij)',
    wormholeFeasibility: 'Demonstrated',
    notableImplementations: [
      'Google Quantum AI Sycamore (Jafferis et al. Nature 2022, 9-qubit traversable wormhole)',
      'IBM Quantum Eagle/Heron (Heavy-hex dual black hole simulation)',
      'Yale / UC Santa Barbara cQED testbeds'
    ],
    keyAdvantages: [
      'Nanosecond-speed gate execution minimizes total circuit duration relative to T2',
      'Scalable lithographic semiconductor fabrication techniques',
      'Fast multiplexed dispersive readout via readout resonators (< 500 ns)',
      'Direct compatibility with Clifford pulse calibrations (DRAG-corrected π/2 microwave pulses)'
    ],
    primaryChallenges: [
      'Requires heavy mK dilution cryogenics with limited cooling power (< 500 µW at 100 mK)',
      'Planar nearest-neighbor connectivity requires SWAP networks or tunable couplers for all-to-all scrambling',
      'Microwave crosstalk and flux noise drift across multi-qubit scrambler drives'
    ],
    physicalMechanism:
      'Qubits are non-linear anharmonic oscillators formed by Josephson junctions. Transitions between ground |0⟩ and first excited state |1⟩ are driven by microwave pulses near 4–6 GHz. Entangling gates are activated by magnetic flux tuning or microwave cross-resonance drives.'
  },
  {
    id: 'trapped_ion',
    name: 'Trapped-Ion Architecture',
    category: 'RF Paul Trap & Optical Raman QIP',
    qubitType: 'Hyperfine clock states of 171Yb+ or 40Ca+ ions in ultra-high vacuum',
    operationalTemp: 'Room Temperature to 4 K (ultra-high vacuum < 10^-11 Torr)',
    coherenceT1: '> 1 hour (effectively infinite)',
    coherenceT2: '1.5 s - 10 s (exceptional phase stability)',
    oneQubitFidelity: '99.99%',
    twoQubitFidelity: '99.8% - 99.91% (Mølmer-Sørensen gate)',
    gateSpeed: '10 - 100 µs (slower than superconducting)',
    connectivity: 'All-to-all reconfigurable via shared phononic vibrational modes',
    wormholeFeasibility: 'High',
    notableImplementations: [
      'Quantinuum H1/H2 System Model (Honeywell Ion Trap)',
      'IonQ Forte & Aria (36+ all-to-all trapped ion QPUs)',
      'University of Maryland / Duke JQI wormhole scrambling testbeds (Landsman et al. Nature 2019)'
    ],
    keyAdvantages: [
      'Natural all-to-all connectivity allows deep Haar and Clifford scramblers with ZERO SWAP gate overhead',
      'Virtually zero idle decoherence during multi-step teleportation protocols',
      'Identical, reproducible atomic qubits without manufacturing variations',
      'High single-shot optical fluorescence readout fidelity (>99.9%)'
    ],
    primaryChallenges: [
      'Slower gate execution speeds (10–100 µs per 2-qubit gate vs 30 ns for transmons)',
      'Acoustic and laser phase noise over prolonged multi-pulse sequences',
      'Scaling beyond 50 ions in a single linear trap requires complex QCCD ion shuttling'
    ],
    physicalMechanism:
      'Individual atomic ions are levitated in radiofrequency quadrupole fields. Qubits are encoded in atomic hyperfine states. Entanglement is mediated by addressing vibrational collective modes (phonons) using UV/optical laser Raman beams.'
  },
  {
    id: 'neutral_atom',
    name: 'Neutral Rydberg Atom Arrays',
    category: 'Optical Tweezer QIP',
    qubitType: 'Ground & Rydberg states of 87Rb or 171Yb atoms held in optical tweezers',
    operationalTemp: 'Room temperature vacuum chamber with laser cooling to ~10 µK',
    coherenceT1: '1 - 5 s',
    coherenceT2: '10 - 50 ms',
    oneQubitFidelity: '99.9%',
    twoQubitFidelity: '99.5% (Rydberg blockade entangling gate)',
    gateSpeed: '200 - 500 ns',
    connectivity: 'Dynamic 2D/3D rearrangement via Acousto-Optic Deflectors (AODs)',
    wormholeFeasibility: 'High',
    notableImplementations: [
      'QuEra Computing Aquila (256-atom analog and digital quantum simulator)',
      'Harvard / MIT Lukin & Vuletic Lab (Nature 2023 logical quantum processor)',
      'Planqc / Pasqal programmable atom arrays'
    ],
    keyAdvantages: [
      'Can dynamically shuttle atoms in real time to mimic wormhole spatial throats and horizon geometry',
      'Multi-qubit global entangling gates (CCZ, multi-controlled Rydberg gates)',
      'Scalable to hundreds of qubits with identical optical trapping potentials',
      'Native implementation of lattice gauge theories and Sachdev-Ye-Kitaev (SYK) dualities'
    ],
    primaryChallenges: [
      'Intermediate coherence lifetime during Rydberg excitation',
      'Atom loss rate during optical transport and mid-circuit measurements',
      'Requires precise multi-laser frequency locks and optical spatial light modulators'
    ],
    physicalMechanism:
      'Neutral atoms are trapped in tight optical dipole traps formed by focused laser beams. Atoms are excited to high principal quantum number Rydberg states (n ≈ 70), where strong dipole-dipole interactions create the Rydberg blockade effect, forbidding simultaneous excitation and enabling deterministic two-qubit entanglement.'
  },
  {
    id: 'photonic',
    name: 'Integrated Photonic Quantum Processor',
    category: 'Linear Optics & Squeezed Light',
    qubitType: 'Single photons / dual-rail path encoding or continuous-variable squeezed states',
    operationalTemp: 'Silicon waveguides at Room Temperature; SNSPD detectors at 1 - 2 K',
    coherenceT1: 'Virtually infinite in low-loss optical waveguides',
    coherenceT2: 'Dominated by optical loss (dB/cm)',
    oneQubitFidelity: '99.9%',
    twoQubitFidelity: '98% (Measurement-induced fusion gates)',
    gateSpeed: 'Picoseconds (speed of light propagation)',
    connectivity: 'Programmable Mach-Zehnder Interferometer (MZI) mesh networks',
    wormholeFeasibility: 'Moderate',
    notableImplementations: [
      'Xanadu Borealis / X8 (Gaussian Boson Sampler & Photonic QPU)',
      'PsiQuantum silicon photonics architecture',
      'Quandela / QuiX Quantum optical processors'
    ],
    keyAdvantages: [
      'Operates largely at room temperature (only detectors need cryogenic cooling)',
      'Immediate optical fiber telecommunication interface for distributed wormhole networks',
      'Immune to ambient magnetic field fluctuations and RF electromagnetic noise',
      'Natural realization of continuous variable ER=EPR geometries'
    ],
    primaryChallenges: [
      'Probabilistic two-qubit gates requiring post-selection or heavy measurement-based cluster states',
      'Optical waveguide propagation losses limit circuit depth without quantum repeaters',
      'High-efficiency deterministic on-demand single photon sources are technically demanding'
    ],
    physicalMechanism:
      'Information is encoded in the polarization, time-bin, or spatial paths of single photons propagating through integrated silicon nitride waveguides. Reconfigurable thermal or electro-optic phase shifters and beam splitters implement unitary operations.'
  }
];

export const HARDWARE_STACK_LAYERS: HardwareLayer[] = [
  {
    level: 5,
    name: 'Layer 5: Quantum Algorithm & Wormhole Orchestration',
    role: 'Executes the Hayden-Preskill protocol, Sachdev-Ye-Kitaev dualities, and Clifford vs Haar comparative benchmarks',
    components: [
      'Qiskit / Cirq / OpenQASM Transpiler Engine',
      'Clifford Stabilizer Tableau Optimizer (Gottesman-Knill theorem compiler)',
      'Thermofield Double (TFD) Ground State Generator',
      'Negative Energy Shockwave Pulse Scheduler (e^{ig O_A O_B})',
      'Quantum State Tomography (QST) Matrix Inversion & Fidelity Evaluator'
    ],
    operatingConditions: 'Software runtime on classical host workstation connected via PCIe / Gigabit Ethernet',
    specifications: 'Polynomial compilation time O(N^3) for Clifford circuits; exponential O(2^N) classical verification ceiling'
  },
  {
    level: 4,
    name: 'Layer 4: Real-Time FPGA Pulse Synthesis & Firmware',
    role: 'Synthesizes nanosecond microwave & laser pulse envelopes, executes mid-circuit feedforward, and corrects phase drift',
    components: [
      'Xilinx UltraScale+ / RFSoC FPGA Core Modules',
      'Real-Time Pulse Sequencer with < 5 ns latency branching',
      'DRAG (Derivative Removal by Adiabatic Gate) Pulse Envelope Generators',
      'Cross-Resonance Microwave Waveform Look-Up Tables (LUT)',
      'Active Feedback & Dispersive Demodulation Pipeline (I/Q thresholding)'
    ],
    operatingConditions: 'Sub-rack 19-inch chassis at 295 K ambient room temperature',
    specifications: '14-bit DAC resolution, 2.4 - 5.0 GSa/s sampling rate, jitter < 100 fs, loop feedback latency < 200 ns'
  },
  {
    level: 3,
    name: 'Layer 3: Analog RF, Microwave & Optical Signal Chain',
    role: 'Mixes, filters, attenuates, and amplifies control and readout signals between room temperature and the quantum substrate',
    components: [
      'Ultra-Low Phase Noise Local Oscillators (4 - 8 GHz, phase noise < -110 dBc/Hz at 10 kHz)',
      'Cryogenic Coaxial Cables (BeCu, CuNi, NbTi superconducting below 9K)',
      'Cryogenic Attenuator Arrays (20 dB at 4K, 10 dB at cold plate, 20 dB at base plate)',
      'Cryogenic Isolators and Circulators (Radite / Ferrite microwave diodes)',
      'High Electron Mobility Transistor (HEMT) Amplifier (4K stage, noise temp < 2 K)',
      'Traveling Wave Parametric Amplifier (TWPA / JPA) at base stage for near-quantum-limited readout'
    ],
    operatingConditions: 'Distributed thermal gradient across 300K, 50K, 4K, 100mK, and 15mK thermal stages',
    specifications: 'Total line attenuation ~60 dB on drive lines; +40 dB gain on readout line; insertion loss < 0.2 dB/cm'
  },
  {
    level: 2,
    name: 'Layer 2: Cryogenic or Vacuum Physical Substrate',
    role: 'Isolates the quantum system from thermal phonons, blackbody radiation, and stray electromagnetic fields',
    components: [
      'Cryofree Dilution Refrigerator (3He/4He dilution unit, cooling power > 450 µW at 100 mK)',
      'Multi-layer Cryogenic Radiation Shields (50K outer, 4K inner, Still shield, MXC shield)',
      'Mu-Metal Magnetic Shielding Cylinder (high magnetic permeability µ > 100,000)',
      'Superconducting Lead/Niobium Cylinder (Meissner effect magnetic flux expulsion)',
      'Ultra-High Vacuum (UHV) Chamber (< 10^-11 Torr for atomic/ion systems)'
    ],
    operatingConditions: 'Base plate temperature 10 - 15 mK; residual magnetic field < 1 µG',
    specifications: 'Temperature stability ±0.1 mK; cooling time from 300K to 15mK ~ 24 hours'
  },
  {
    level: 1,
    name: 'Layer 1: Quantum Processing Core (Physical QPU)',
    role: 'Hosts physical qubits, tunable couplers, readout resonators, and executes quantum state transitions',
    components: [
      'High-Resistivity Silicon or Sapphire Substrate (loss tangent tan δ < 10^-6)',
      'Patterned Niobium / Aluminum Coplanar Waveguide (CPW) Resonators',
      'Sub-Micron Al/AlOx/Al Dolan-Bridge Josephson Junctions (critical current Ic ≈ 20 - 50 nA)',
      'Tunable SQUID Loops for Fast Frequency Shifting & CZ Gate Coupling',
      'Purcell Filter Resonators protecting qubits from radiative decay through readout lines'
    ],
    operatingConditions: 'Mounted inside gold-plated copper sample enclosure bolted to 15 mK mixing chamber',
    specifications: 'Qubit frequencies 4.5 - 6.0 GHz; anharmonicity α/2π ≈ -200 to -320 MHz; coupling g/2π ≈ 10 - 50 MHz'
  }
];

export const PULSE_SEQUENCE_TIMELINE: PulseSequenceStage[] = [
  {
    id: 'stage_1_init',
    timeWindowNs: '0 - 120 ns',
    title: 'Stage 1: Ground State Initialization & Active Reset',
    protocolRole: 'Prepares all physical qubits in pure computational ground state |0⟩^(2N+1)',
    physicsDescription:
      'Applies microwave readout pulse followed by conditional unconditional π-pulse to drain any residual thermal population in state |1⟩. In trapped ion devices, optical pumping with 369.5 nm laser clears hyperfine states in < 20 µs.',
    channels: [
      { name: 'Alice Qubits Drive', pulseType: 'Dispersive', frequency: '6.45 GHz', amplitude: '250 mV', phase: '0°' },
      { name: 'Entanglement Bus', pulseType: 'Idle', frequency: '5.20 GHz', amplitude: '0 mV', phase: '0°' },
      { name: 'Shockwave Coupler', pulseType: 'Idle', frequency: 'DC', amplitude: '0 mV', phase: '0°' },
      { name: 'Bob Readout Cavity', pulseType: 'Dispersive', frequency: '6.82 GHz', amplitude: '250 mV', phase: '0°' }
    ]
  },
  {
    id: 'stage_2_tfd',
    timeWindowNs: '120 - 260 ns',
    title: 'Stage 2: Thermofield Double (TFD) Bell-Pair Entanglement',
    protocolRole: 'Distributes EPR pairs across Alice (Left Black Hole) and Bob (Right Black Hole)',
    physicsDescription:
      'Applies Hadamard (π/2_y) on Left qubits followed by calibrated Cross-Resonance / CZ gates across Left and Right counterparts. In Clifford mode, this produces exact Bell pairs (|00⟩+|11⟩)/√2 with zero magic resource consumption.',
    channels: [
      { name: 'Alice Qubits Drive', pulseType: 'DRAG', frequency: '4.92 GHz', amplitude: '180 mV', phase: '90° (Hadamard)' },
      { name: 'Entanglement Bus', pulseType: 'Gaussian', frequency: '5.10 GHz', amplitude: '320 mV', phase: '0° (CR Drive)' },
      { name: 'Shockwave Coupler', pulseType: 'Idle', frequency: 'DC', amplitude: '0 mV', phase: '0°' },
      { name: 'Bob Readout Cavity', pulseType: 'Idle', frequency: '6.82 GHz', amplitude: '0 mV', phase: '0°' }
    ]
  },
  {
    id: 'stage_3_input',
    timeWindowNs: '260 - 320 ns',
    title: 'Stage 3: Message Qubit State Injection (|ψ⟩_in)',
    protocolRole: 'Alice injects the quantum message into her black hole subsystem',
    physicsDescription:
      'A calibrated DRAG-corrected microwave pulse rotates the probe qubit to the desired Bloch sphere coordinate (e.g. |+⟩ via π/2_y or arbitrary |ψ⟩ via calibrated R_x(θ), R_y(φ) envelopes).',
    channels: [
      { name: 'Alice Qubits Drive', pulseType: 'DRAG', frequency: '4.85 GHz', amplitude: '210 mV', phase: '45° (Arbitrary |ψ⟩)' },
      { name: 'Entanglement Bus', pulseType: 'Idle', frequency: '5.10 GHz', amplitude: '0 mV', phase: '0°' },
      { name: 'Shockwave Coupler', pulseType: 'Idle', frequency: 'DC', amplitude: '0 mV', phase: '0°' },
      { name: 'Bob Readout Cavity', pulseType: 'Idle', frequency: '6.82 GHz', amplitude: '0 mV', phase: '0°' }
    ]
  },
  {
    id: 'stage_4_scramble',
    timeWindowNs: '320 - 580 ns',
    title: 'Stage 4: Fast Scrambling Unitary (Clifford vs Haar-Random)',
    protocolRole: 'Scrambles local message across all Left black hole degrees of freedom',
    physicsDescription:
      'In Clifford Mode: Transpiled into discrete π/2 Clifford generators (H, S, CNOT, CZ) with 0 T-gates, completing in 260 ns with >99.5% fidelity. In Haar Mode: Continuous variable parameter rotations and T-gates are applied, requiring multi-tone calibration and longer exposure to decoherence.',
    channels: [
      { name: 'Alice Qubits Drive', pulseType: 'Gaussian', frequency: '4.85 - 5.15 GHz', amplitude: '290 mV', phase: 'Multi-Tone Phase Train' },
      { name: 'Entanglement Bus', pulseType: 'Square', frequency: 'DC Flux', amplitude: '140 mV', phase: 'Flux-tuned avoided crossing' },
      { name: 'Shockwave Coupler', pulseType: 'Idle', frequency: 'DC', amplitude: '0 mV', phase: '0°' },
      { name: 'Bob Readout Cavity', pulseType: 'Idle', frequency: '6.82 GHz', amplitude: '0 mV', phase: '0°' }
    ]
  },
  {
    id: 'stage_5_shockwave',
    timeWindowNs: '580 - 720 ns',
    title: 'Stage 5: Traversable Wormhole Coupling Pulse (Negative Energy Shockwave)',
    protocolRole: 'Applies Gao-Jafferis-Wall interaction e^{i g Σ O_A O_B} rendering the Einstein-Rosen bridge traversable',
    physicsDescription:
      'Physically couples Alice’s scrambled subsystem to Bob’s subsystem via a transient bilateral ZZ interaction or mid-circuit classical feedforward. This generates the negative average null energy condition in the gravitational dual, pulling the event horizon outward.',
    channels: [
      { name: 'Alice Qubits Drive', pulseType: 'Idle', frequency: '4.85 GHz', amplitude: '0 mV', phase: '0°' },
      { name: 'Entanglement Bus', pulseType: 'Idle', frequency: '5.10 GHz', amplitude: '0 mV', phase: '0°' },
      { name: 'Shockwave Coupler', pulseType: 'Chirp', frequency: '5.35 GHz', amplitude: '380 mV', phase: 'Coupling Phase g' },
      { name: 'Bob Readout Cavity', pulseType: 'Idle', frequency: '6.82 GHz', amplitude: '0 mV', phase: '0°' }
    ]
  },
  {
    id: 'stage_6_unscramble',
    timeWindowNs: '720 - 980 ns',
    title: 'Stage 6: Time-Reversed Decoding Unitary (U_B*)',
    protocolRole: 'Unscrambles Bob’s subsystem to refocus the teleported state into the receiver qubit',
    physicsDescription:
      'Bob applies the Hermitian conjugate / time-reversed scrambling unitary U_B*. Because the negative energy pulse shifted the horizon geometry, destructive quantum interference is cancelled and constructive refocusing places |ψ⟩ onto Bob’s probe qubit.',
    channels: [
      { name: 'Alice Qubits Drive', pulseType: 'Idle', frequency: '4.85 GHz', amplitude: '0 mV', phase: '0°' },
      { name: 'Entanglement Bus', pulseType: 'Square', frequency: 'DC Flux', amplitude: '140 mV', phase: 'Reverse Flux Profile' },
      { name: 'Shockwave Coupler', pulseType: 'Idle', frequency: 'DC', amplitude: '0 mV', phase: '0°' },
      { name: 'Bob Readout Cavity', pulseType: 'Gaussian', frequency: '5.40 GHz', amplitude: '280 mV', phase: 'Conjugate Scrambler' }
    ]
  },
  {
    id: 'stage_7_readout',
    timeWindowNs: '980 - 1450 ns',
    title: 'Stage 7: Quantum State Tomography (QST) & Dispersive Readout',
    protocolRole: 'Measures density matrix ρ_out and evaluates state transfer fidelity F',
    physicsDescription:
      'Pre-rotation pulses ({I}, {π/2_y}, {π/2_x}) project the output state onto Pauli Z, X, and Y measurement axes. A probe microwave tone interrogates the readout resonator. The transmitted I/Q quadrature signals are amplified by TWPA and HEMT, demodulated by FPGA, and reconstructed.',
    channels: [
      { name: 'Alice Qubits Drive', pulseType: 'Idle', frequency: '4.85 GHz', amplitude: '0 mV', phase: '0°' },
      { name: 'Entanglement Bus', pulseType: 'Idle', frequency: '5.10 GHz', amplitude: '0 mV', phase: '0°' },
      { name: 'Shockwave Coupler', pulseType: 'Idle', frequency: 'DC', amplitude: '0 mV', phase: '0°' },
      { name: 'Bob Readout Cavity', pulseType: 'Dispersive', frequency: '6.82 GHz', amplitude: '420 mV', phase: 'Heterodyne I/Q Readout' }
    ]
  }
];

export const LAB_BILL_OF_MATERIALS: BOMCategory[] = [
  {
    category: '1. Cryogenic Substrate & Environmental Shielding',
    description: 'Maintains quantum processor at millikelvin temperatures and eliminates stray magnetic and thermal noise',
    items: [
      {
        name: 'Cryofree Dilution Refrigerator',
        vendorOrSource: 'Bluefors (XLD / LD) or Oxford Instruments (ProteoxMX)',
        purpose: 'Cools QPU to base temperature < 15 mK; provides 450+ µW cooling power at 100 mK',
        estimatedCost: '$450,000 - $750,000',
        criticalTolerance: 'Base temp stability ±0.1 mK; vibration isolation < 100 nm RMS'
      },
      {
        name: 'Cryogenic Multi-Layer Shielding (Mu-Metal + Superconductor)',
        vendorOrSource: 'Amuneal / Vacuumschmelze / Custom Machined',
        purpose: 'Attenuates Earth’s magnetic field and stray electromagnetic radiation to < 1 µG at QPU',
        estimatedCost: '$25,000 - $45,000',
        criticalTolerance: 'Magnetic permeability µ_r > 100,000; seamless welded seams'
      },
      {
        name: 'Continuous 3He / 4He Gas Handling System & Roots Pumps',
        vendorOrSource: 'Pfeiffer Vacuum / Edwards Vacuum',
        purpose: 'Recirculates helium isotope mixture through condensation lines and turbo pumps',
        estimatedCost: '$60,000 - $90,000',
        criticalTolerance: 'Zero helium leak rate (< 10^-10 mbar · L/s)'
      }
    ]
  },
  {
    category: '2. High-Frequency Microwave Signal Synthesis & Control Electronics',
    description: 'Generates nanosecond shaped analog pulse trains to drive single-qubit and two-qubit quantum gates',
    items: [
      {
        name: 'Multi-Channel Arbitrary Waveform Generator (AWG / QCS)',
        vendorOrSource: 'Zurich Instruments (HDAWG / SHFQC) or Quantum Machines (OPX+)',
        purpose: 'Synthesizes synchronized DRAG, Gaussian, and cross-resonance microwave gate envelopes',
        estimatedCost: '$120,000 - $220,000',
        criticalTolerance: '14-bit DAC, ≥ 2.4 GSa/s, channel-to-channel skew < 20 ps'
      },
      {
        name: 'Ultra-Low Phase Noise RF/Microwave Local Oscillators (4-8 GHz)',
        vendorOrSource: 'Keysight (PSG / E8257D) or Rohde & Schwarz (SMA100B)',
        purpose: 'Provides carrier frequencies for IQ upconversion mixers with minimal phase jitter',
        estimatedCost: '$40,000 - $80,000',
        criticalTolerance: 'Phase noise < -115 dBc/Hz at 10 kHz offset; frequency stability < 1 ppb'
      },
      {
        name: 'Real-Time FPGA Processor & Fast Digitizer for Mid-Circuit Feedback',
        vendorOrSource: 'Xilinx RFSoC ZCU216 or Zurich Instruments Pre-amp / Logic',
        purpose: 'Demodulates I/Q readout and triggers conditioned shockwave pulse in < 250 ns',
        estimatedCost: '$50,000 - $90,000',
        criticalTolerance: 'End-to-end feedback latency < 300 ns (crucial for wormhole teleportation)'
      }
    ]
  },
  {
    category: '3. Cryogenic Microwave Components & Low-Noise Amplification',
    description: 'Protects qubits from 300K thermal photons and amplifies single-photon readout signals',
    items: [
      {
        name: 'Traveling Wave Parametric Amplifier (TWPA) or Josephson Parametric Amp (JPA)',
        vendorOrSource: 'MIT Lincoln Lab / Chalmers / QuantWare / Custom cQED Fab',
        purpose: 'Provides near-quantum-limited amplification (+20 dB) with minimum added noise at 15 mK',
        estimatedCost: '$35,000 - $65,000',
        criticalTolerance: 'Added noise photons n_add ≤ 0.5; instantaneous bandwidth > 500 MHz'
      },
      {
        name: 'High Electron Mobility Transistor (HEMT) Cryogenic Low-Noise Amp',
        vendorOrSource: 'Low Noise Factory (LNF-LNC4_8F) or Caltech Cryo',
        purpose: 'Secondary amplification (+38 dB) situated on the 4 Kelvin stage',
        estimatedCost: '$12,000 - $20,000',
        criticalTolerance: 'Noise temperature T_noise < 2.0 Kelvin across 4 - 8 GHz'
      },
      {
        name: 'Superconducting & Semi-Rigid Coaxial Wiring with Cryo Attenuators',
        vendorOrSource: 'Coax Co. (NbTi lines) / XMA Corp / Fairview Microwave',
        purpose: 'Delivers drive lines with thermalized attenuation (20dB at 4K, 10dB at Still, 20dB at MXC)',
        estimatedCost: '$30,000 - $55,000',
        criticalTolerance: 'Insertion loss < 0.25 dB/m; thermal heat load to base plate < 1 µW per line'
      }
    ]
  },
  {
    category: '4. Quantum Processor Fabrication & Lithography',
    description: 'Cleanroom nanofabrication equipment for building the superconducting transmon chip',
    items: [
      {
        name: '100 kV Electron Beam Lithography (EBL) System',
        vendorOrSource: 'Raith (EBPG5200) or JEOL (JBX-8100FS) [University Cleanroom Access]',
        purpose: 'Patterns sub-100nm Dolan bridges for Al/AlOx/Al Josephson junctions',
        estimatedCost: '$1,500,000 (or $120/hr cleanroom recharge)',
        criticalTolerance: 'Beam spot size < 2 nm; overlay alignment accuracy < 10 nm'
      },
      {
        name: 'High-Vacuum Multi-Angle Thin-Film Evaporator with In-Situ Oxidation',
        vendorOrSource: 'Plassys (MEB 550S) or Kurt J. Lesker',
        purpose: 'Performs shadow evaporation of aluminum and controlled thermal oxygen dosing for AlOx barrier',
        estimatedCost: '$450,000 - $700,000',
        criticalTolerance: 'Oxide tunnel barrier thickness control to ±0.05 nm (determines critical current Ic)'
      },
      {
        name: 'High-Resistivity Float-Zone Intrinsic Silicon / Sapphire Wafers',
        vendorOrSource: 'Topsil / UniversityWafer',
        purpose: 'Substrate with dielectric loss tangent tan δ < 10^-6 to prevent two-level system (TLS) loss',
        estimatedCost: '$3,000 - $8,000',
        criticalTolerance: 'Resistivity > 10,000 Ω·cm; double-side polished (DSP)'
      }
    ]
  }
];
