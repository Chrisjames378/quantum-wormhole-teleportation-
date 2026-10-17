export type PhysicalPlatformId = 'superconducting' | 'trapped_ion' | 'neutral_atom' | 'photonic';

export interface PhysicalPlatform {
  id: PhysicalPlatformId;
  name: string;
  category: string;
  qubitType: string;
  operationalTemp: string;
  coherenceT1: string;
  coherenceT2: string;
  oneQubitFidelity: string;
  twoQubitFidelity: string;
  gateSpeed: string;
  connectivity: string;
  wormholeFeasibility: 'Demonstrated' | 'High' | 'Moderate' | 'Theoretical';
  notableImplementations: string[];
  keyAdvantages: string[];
  primaryChallenges: string[];
  physicalMechanism: string;
}

export interface HardwareLayer {
  level: number;
  name: string;
  role: string;
  components: string[];
  operatingConditions: string;
  specifications: string;
}

export interface PulseSequenceStage {
  id: string;
  timeWindowNs: string;
  title: string;
  protocolRole: string;
  physicsDescription: string;
  channels: {
    name: string;
    pulseType: 'Gaussian' | 'DRAG' | 'Square' | 'Chirp' | 'Dispersive' | 'Idle';
    frequency: string;
    amplitude: string;
    phase: string;
  }[];
}

export interface BOMCategory {
  category: string;
  description: string;
  items: {
    name: string;
    vendorOrSource: string;
    purpose: string;
    estimatedCost: string;
    criticalTolerance: string;
  }[];
}
