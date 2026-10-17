export interface NoiseConfiguration {
  enabled: boolean;
  amplitudeDamping: number; // 0 to 0.3 (T1 relaxation)
  phaseDamping: number;     // 0 to 0.3 (T2 dephasing)
  depolarizing: number;     // 0 to 0.2 (isotropic noise)
}

export const DEFAULT_NOISE: NoiseConfiguration = {
  enabled: false,
  amplitudeDamping: 0.05,
  phaseDamping: 0.05,
  depolarizing: 0.02,
};

/**
 * Calculates noise degradation factor and state purity
 * under Kraus operator channels:
 * - Amplitude damping: |1⟩ → |0⟩ decay with rate γ
 * - Phase damping: relative phase loss with rate λ
 * - Depolarizing: ρ → (1-p)ρ + p/2 I
 */
export function applyNoiseToFidelity(
  idealFidelity: number,
  noise: NoiseConfiguration,
  qubits: number,
  scrambler: 'clifford' | 'haar'
): {
  degradedFidelity: number;
  purity: number;
  noiseLoss: number;
} {
  if (!noise.enabled) {
    return {
      degradedFidelity: idealFidelity,
      purity: 1.0,
      noiseLoss: 0,
    };
  }

  // Combined noise rate scaled across circuit depth (depth proportional to qubits)
  const circuitDepth = scrambler === 'clifford' ? qubits * 3 : qubits * 6;
  const effectiveGamma = 1 - Math.pow(1 - noise.amplitudeDamping, circuitDepth * 0.15);
  const effectiveLambda = 1 - Math.pow(1 - noise.phaseDamping, circuitDepth * 0.18);
  const effectiveP = 1 - Math.pow(1 - noise.depolarizing, circuitDepth * 0.12);

  // Total noise degradation on state fidelity
  const totalDecay = effectiveGamma * 0.4 + effectiveLambda * 0.35 + effectiveP * 0.45;
  const noiseLoss = Math.min(0.65, totalDecay);

  const degradedFidelity = Math.max(0.12, idealFidelity * (1 - noiseLoss));
  const purity = Math.max(0.5, 1 - (effectiveGamma * 0.3 + effectiveLambda * 0.25 + effectiveP * 0.5));

  return {
    degradedFidelity: parseFloat(degradedFidelity.toFixed(4)),
    purity: parseFloat(purity.toFixed(3)),
    noiseLoss: parseFloat((noiseLoss * 100).toFixed(1)),
  };
}
