import { ScramblerType, InputStateType } from '../types/quantum';
import { NoiseConfiguration, applyNoiseToFidelity } from './quantumNoise';
import { simulateTeleportationTrial } from './quantumMath';

export interface SensitivityPoint {
  qubits: number;
  cliffordFidelity: number;      // e.g. 0.942 (0 to 1)
  haarFidelity: number;          // e.g. 0.940 (0 to 1)
  cliffordFidelityPct: number;   // e.g. 94.2%
  haarFidelityPct: number;       // e.g. 94.0%
  cliffordVariance: number;
  haarVariance: number;
  cliffordUpperPct: number;
  cliffordLowerPct: number;
  cliffordDepth: number;
  haarDepth: number;
  deltaAdvantagePct: number;     // (clifford - haar) * 100
}

export const QUBIT_SWEEP_RANGE = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

/**
 * Computes fidelity sensitivity data across qubit counts (2 to 16)
 * for both Clifford and Haar-random scramblers.
 * 
 * Physics basis:
 * 1. Joshi & Mishra (2026): In ideal channels, average fidelity is equal for all N (~0.942),
 *    while Clifford variance shrinks exponentially ~ 1 / 1.68^(N-2).
 * 2. Physical hardware decoherence: Haar circuits require exponential non-Clifford T-gates
 *    and multi-qubit synthesis depth ~ O(2^N) or O(N^2), causing steep fidelity decay at large N.
 *    Clifford circuits require only stabilizer gates with shallow O(N log N) depth and zero magic,
 *    retaining significantly higher operational fidelity.
 */
export function calculateSensitivitySweep(
  noise: NoiseConfiguration,
  samplesPerQubit = 5,
  inputState: InputStateType = 'plus'
): SensitivityPoint[] {
  return QUBIT_SWEEP_RANGE.map((qubits) => {
    let cliffordSum = 0;
    let haarSum = 0;
    const count = Math.max(1, samplesPerQubit);

    for (let i = 0; i < count; i++) {
      const cRes = simulateTeleportationTrial(qubits, 'clifford', inputState, i + 1);
      const hRes = simulateTeleportationTrial(qubits, 'haar', inputState, i + 1);

      let cFid = cRes.trial.fidelity;
      let hFid = hRes.trial.fidelity;

      if (noise.enabled) {
        cFid = applyNoiseToFidelity(cFid, noise, qubits, 'clifford').degradedFidelity;
        hFid = applyNoiseToFidelity(hFid, noise, qubits, 'haar').degradedFidelity;
      }

      cliffordSum += cFid;
      haarSum += hFid;
    }

    const cAvg = cliffordSum / count;
    const hAvg = haarSum / count;

    // Variance scaling
    const cVar = 0.42 / Math.pow(1.68, Math.max(0, qubits - 2));
    const hVar = 0.0045 / Math.sqrt(qubits / 4);

    const cUpper = Math.min(1.0, cAvg + cVar);
    const cLower = Math.max(0.05, cAvg - cVar);

    // Circuit depth estimation
    const cDepth = qubits * 4;
    const hDepth = Math.round(qubits * 4 + Math.pow(1.5, Math.min(qubits, 12)));

    const cPct = parseFloat((cAvg * 100).toFixed(2));
    const hPct = parseFloat((hAvg * 100).toFixed(2));
    const delta = parseFloat((cPct - hPct).toFixed(2));

    return {
      qubits,
      cliffordFidelity: parseFloat(cAvg.toFixed(4)),
      haarFidelity: parseFloat(hAvg.toFixed(4)),
      cliffordFidelityPct: cPct,
      haarFidelityPct: hPct,
      cliffordVariance: parseFloat(cVar.toFixed(4)),
      haarVariance: parseFloat(hVar.toFixed(5)),
      cliffordUpperPct: parseFloat((cUpper * 100).toFixed(1)),
      cliffordLowerPct: parseFloat((cLower * 100).toFixed(1)),
      cliffordDepth: cDepth,
      haarDepth: hDepth,
      deltaAdvantagePct: delta,
    };
  });
}
