export type ScramblerType = 'clifford' | 'haar';

export type InputStateType = 'zero' | 'one' | 'plus' | 'minus' | 'plus_i' | 'random' | 'custom';

export interface QuantumStateVector {
  theta: number; // 0 to PI
  phi: number;   // 0 to 2*PI
  alpha: { re: number; im: number };
  beta: { re: number; im: number };
}

export interface SimulationTrial {
  trialId: number;
  timestamp: string;
  qubits: number;
  scrambler: ScramblerType;
  inputState: string;
  fidelity: number; // 0 to 1
  phaseError: number;
  magicCount: number; // T-gates used
  classicalCost: string;
  executionTimeMs: number;
}

export interface BenchmarkPoint {
  qubits: number;
  cliffordTimeUs: number;
  haarTimeUs: number;
  cliffordVariance: number;
  haarVariance: number;
  speedup: number;
  varianceRatio: number;
}

export interface QuantumGate {
  id: string;
  name: string;
  symbol: string;
  qubits: number[];
  type: 'clifford' | 'magic' | 'measurement';
  matrix: string[][];
  description: string;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'opt';
  message: string;
  details?: string;
}
