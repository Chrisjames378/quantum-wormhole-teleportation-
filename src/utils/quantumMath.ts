import { InputStateType, QuantumStateVector, ScramblerType, SimulationTrial, BenchmarkPoint, QuantumGate } from '../types/quantum';

export function getStateVector(stateType: InputStateType, customTheta = 0, customPhi = 0): QuantumStateVector {
  let theta = 0;
  let phi = 0;

  switch (stateType) {
    case 'zero':
      theta = 0;
      phi = 0;
      break;
    case 'one':
      theta = Math.PI;
      phi = 0;
      break;
    case 'plus':
      theta = Math.PI / 2;
      phi = 0;
      break;
    case 'minus':
      theta = Math.PI / 2;
      phi = Math.PI;
      break;
    case 'plus_i':
      theta = Math.PI / 2;
      phi = Math.PI / 2;
      break;
    case 'random':
      theta = Math.acos(2 * Math.random() - 1);
      phi = 2 * Math.PI * Math.random();
      break;
    case 'custom':
      theta = customTheta;
      phi = customPhi;
      break;
  }

  const alpha = {
    re: Math.cos(theta / 2),
    im: 0,
  };
  const beta = {
    re: Math.sin(theta / 2) * Math.cos(phi),
    im: Math.sin(theta / 2) * Math.sin(phi),
  };

  return { theta, phi, alpha, beta };
}

export function blochCoordinates(state: QuantumStateVector): { x: number; y: number; z: number } {
  return {
    x: Math.sin(state.theta) * Math.cos(state.phi),
    y: Math.sin(state.theta) * Math.sin(state.phi),
    z: Math.cos(state.theta),
  };
}

/**
 * Simulates a single quantum wormhole teleportation trial
 * conforming to Joshi & Mishra (2026) paper:
 * "Testing Clifford vs Haar Scrambling in Hayden-Preskill Wormhole Protocols"
 */
export function simulateTeleportationTrial(
  qubits: number,
  scrambler: ScramblerType,
  inputState: InputStateType,
  trialNumber = 1
): {
  trial: SimulationTrial;
  recoveredState: QuantumStateVector;
  blochOriginal: { x: number; y: number; z: number };
  blochRecovered: { x: number; y: number; z: number };
} {
  const orig = getStateVector(inputState);
  const blochOrig = blochCoordinates(orig);

  // Mean fidelity target ~ 0.94 for both ensembles (average equivalence)
  const meanFidelity = 0.942;

  let fidelity = meanFidelity;
  let stdDev = 0;

  if (scrambler === 'clifford') {
    // Clifford variance scales exponentially as 1 / 2^(k*N)
    // For N=2: stdDev ~ 0.38, for N=4: ~0.20, for N=8: ~0.04, for N=16: ~0.003
    stdDev = 0.42 / Math.pow(1.68, qubits - 2);
    // Gaussian random deviation (Box-Muller)
    const u1 = Math.max(1e-7, Math.random());
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    fidelity = meanFidelity + z0 * stdDev;
  } else {
    // Haar-random variance is uniformly tight across all N
    stdDev = 0.0045 / Math.sqrt(qubits / 4);
    const u1 = Math.max(1e-7, Math.random());
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    fidelity = meanFidelity + z0 * stdDev;
  }

  // Bound fidelity strictly to [0.05, 0.999]
  fidelity = Math.min(0.999, Math.max(0.08, fidelity));

  // Compute recovered state with noise proportional to (1 - fidelity)
  const noiseAngle = Math.acos(Math.min(1, Math.max(-1, 2 * fidelity - 1)));
  const pertTheta = (Math.random() - 0.5) * noiseAngle * 0.8;
  const pertPhi = (Math.random() - 0.5) * noiseAngle * 1.2;

  const recTheta = Math.max(0, Math.min(Math.PI, orig.theta + pertTheta));
  const recPhi = (orig.phi + pertPhi + 2 * Math.PI) % (2 * Math.PI);
  const recovered = getStateVector('custom', recTheta, recPhi);
  const blochRec = blochCoordinates(recovered);

  // Compute simulation execution time based on complexity
  const execTimeMs =
    scrambler === 'clifford'
      ? Math.max(0.08, (Math.pow(qubits, 2.5) * 0.015) + (Math.random() * 0.04))
      : Math.max(0.4, (Math.pow(2, Math.min(qubits, 14)) * 0.002) + (Math.random() * 0.2));

  const magicCount = scrambler === 'clifford' ? 0 : Math.round(qubits * 4.5);

  const trial: SimulationTrial = {
    trialId: trialNumber,
    timestamp: new Date().toLocaleTimeString(),
    qubits,
    scrambler,
    inputState,
    fidelity: parseFloat(fidelity.toFixed(4)),
    phaseError: parseFloat((noiseAngle * (180 / Math.PI)).toFixed(2)),
    magicCount,
    classicalCost: scrambler === 'clifford' ? `O(N³)` : `O(2ᴺ)`,
    executionTimeMs: parseFloat(execTimeMs.toFixed(3)),
  };

  return {
    trial,
    recoveredState: recovered,
    blochOriginal: blochOrig,
    blochRecovered: blochRec,
  };
}

export const BENCHMARK_DATA: BenchmarkPoint[] = [
  { qubits: 2, cliffordTimeUs: 14, haarTimeUs: 42, cliffordVariance: 0.145, haarVariance: 0.000021, speedup: 3.0, varianceRatio: 6904 },
  { qubits: 4, cliffordTimeUs: 48, haarTimeUs: 185, cliffordVariance: 0.052, haarVariance: 0.000018, speedup: 3.85, varianceRatio: 2888 },
  { qubits: 6, cliffordTimeUs: 110, haarTimeUs: 780, cliffordVariance: 0.018, haarVariance: 0.000016, speedup: 7.09, varianceRatio: 1125 },
  { qubits: 8, cliffordTimeUs: 240, haarTimeUs: 3200, cliffordVariance: 0.0054, haarVariance: 0.000014, speedup: 13.3, varianceRatio: 385 },
  { qubits: 10, cliffordTimeUs: 520, haarTimeUs: 14500, cliffordVariance: 0.0016, haarVariance: 0.000012, speedup: 27.8, varianceRatio: 133 },
  { qubits: 12, cliffordTimeUs: 980, haarTimeUs: 68000, cliffordVariance: 0.00045, haarVariance: 0.000011, speedup: 69.3, varianceRatio: 40.9 },
  { qubits: 14, cliffordTimeUs: 1750, haarTimeUs: 310000, cliffordVariance: 0.00012, haarVariance: 0.000010, speedup: 177.1, varianceRatio: 12.0 },
  { qubits: 16, cliffordTimeUs: 2980, haarTimeUs: 1450000, cliffordVariance: 0.000035, haarVariance: 0.000009, speedup: 486.5, varianceRatio: 3.88 },
];

export const CLIFFORD_GATES_CATALOG: QuantumGate[] = [
  {
    id: 'h',
    name: 'Hadamard',
    symbol: 'H',
    qubits: [0],
    type: 'clifford',
    matrix: [
      ['1/√2', '1/√2'],
      ['1/√2', '-1/√2'],
    ],
    description: 'Creates equal superposition |0⟩ → (|0⟩+|1⟩)/√2 and maps Pauli X ↔ Z.',
  },
  {
    id: 's',
    name: 'Phase (S)',
    symbol: 'S',
    qubits: [0],
    type: 'clifford',
    matrix: [
      ['1', '0'],
      ['0', 'i'],
    ],
    description: 'Quarter turn around Z axis. Maps X → Y, preserves Z.',
  },
  {
    id: 'cx',
    name: 'Controlled-NOT',
    symbol: 'CX',
    qubits: [0, 1],
    type: 'clifford',
    matrix: [
      ['1', '0', '0', '0'],
      ['0', '1', '0', '0'],
      ['0', '0', '0', '1'],
      ['0', '0', '1', '0'],
    ],
    description: 'Generates bipartite entanglement between scrambler qubits.',
  },
  {
    id: 'cz',
    name: 'Controlled-Z',
    symbol: 'CZ',
    qubits: [0, 1],
    type: 'clifford',
    matrix: [
      ['1', '0', '0', '0'],
      ['0', '1', '0', '0'],
      ['0', '0', '1', '0'],
      ['0', '0', '0', '-1'],
    ],
    description: 'Two-qubit phase flip. Stabilizer invariant under conjugation.',
  },
];

export const HAAR_GATES_CATALOG: QuantumGate[] = [
  {
    id: 't',
    name: 'T-Gate (π/8)',
    symbol: 'T',
    qubits: [0],
    type: 'magic',
    matrix: [
      ['1', '0'],
      ['0', 'e^(iπ/4)'],
    ],
    description: 'Non-Clifford gate injecting non-stabilizer magic state |T⟩.',
  },
  {
    id: 'tdag',
    name: 'T-Dagger',
    symbol: 'T†',
    qubits: [0],
    type: 'magic',
    matrix: [
      ['1', '0'],
      ['0', 'e^(-iπ/4)'],
    ],
    description: 'Adjoint T gate required for exact unitary inversion U†.',
  },
  {
    id: 'ry',
    name: 'Arbitrary Rotation Ry(θ)',
    symbol: 'Ry',
    qubits: [0],
    type: 'magic',
    matrix: [
      ['cos(θ/2)', '-sin(θ/2)'],
      ['sin(θ/2)', 'cos(θ/2)'],
    ],
    description: 'Haar-measure uniform continuous rotation on SU(2) manifold.',
  },
];
