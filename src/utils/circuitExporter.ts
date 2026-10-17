import { ScramblerType, InputStateType } from '../types/quantum';

export function generateOpenQASM(qubits: number, scrambler: ScramblerType, inputState: InputStateType): string {
  const lines: string[] = [
    'OPENQASM 2.0;',
    'include "qelib1.inc";',
    '',
    `// Quantum Teleportation & Black Hole Scrambling Protocol`,
    `// Architecture: ${scrambler.toUpperCase()} Scrambler`,
    `// Reference: Joshi & Mishra (IIT BHU, 2026)`,
    '',
    `qreg q[${qubits}];`,
    `creg c[${qubits}];`,
    '',
    '// 1. Input State Preparation on q[0]',
  ];

  if (inputState === 'one') {
    lines.push('x q[0];');
  } else if (inputState === 'plus') {
    lines.push('h q[0];');
  } else if (inputState === 'minus') {
    lines.push('x q[0];', 'h q[0];');
  } else if (inputState === 'plus_i') {
    lines.push('h q[0];', 's q[0];');
  }

  lines.push('', '// 2. EPR Pair Entanglement Coupling between Black Hole A and B');
  for (let i = 1; i < qubits; i += 2) {
    if (i + 1 < qubits) {
      lines.push(`h q[${i}];`);
      lines.push(`cx q[${i}], q[${i + 1}];`);
    }
  }

  lines.push('', `// 3. Black Hole A Unitary Scrambler (${scrambler.toUpperCase()})`);
  if (scrambler === 'clifford') {
    // Clifford gates only (H, S, CX, CZ) - Zero Magic
    for (let i = 0; i < qubits; i++) {
      lines.push(`h q[${i}];`);
      lines.push(`s q[${i}];`);
    }
    for (let i = 0; i < qubits - 1; i++) {
      lines.push(`cx q[${i}], q[${i + 1}];`);
    }
  } else {
    // Haar-random unitary (including non-Clifford T, Tdg, arbitrary rotations)
    for (let i = 0; i < qubits; i++) {
      lines.push(`h q[${i}];`);
      lines.push(`t q[${i}];`);
      lines.push(`ry(0.785398) q[${i}];`);
    }
    for (let i = 0; i < qubits - 1; i++) {
      lines.push(`cx q[${i}], q[${i + 1}];`);
      lines.push(`tdg q[${i + 1}];`);
    }
  }

  lines.push('', `// 4. Black Hole B Decoder Unitary (U_dagger)`);
  if (scrambler === 'clifford') {
    for (let i = qubits - 2; i >= 0; i--) {
      lines.push(`cx q[${i}], q[${i + 1}];`);
    }
    for (let i = 0; i < qubits; i++) {
      lines.push(`sdg q[${i}];`);
      lines.push(`h q[${i}];`);
    }
  } else {
    for (let i = qubits - 2; i >= 0; i--) {
      lines.push(`t q[${i + 1}];`);
      lines.push(`cx q[${i}], q[${i + 1}];`);
    }
    for (let i = 0; i < qubits; i++) {
      lines.push(`ry(-0.785398) q[${i}];`);
      lines.push(`tdg q[${i}];`);
      lines.push(`h q[${i}];`);
    }
  }

  lines.push('', '// 5. State Readout Measurement');
  lines.push(`measure q -> c;`);

  return lines.join('\n');
}

export function generateQiskitPython(qubits: number, scrambler: ScramblerType, inputState: InputStateType): string {
  return `import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

# Initialize Quantum Circuit with ${qubits} Qubits
# Scrambler Architecture: ${scrambler.toUpperCase()}
# Paper Reference: Sudhanva Joshi & Sunil Kumar Mishra (IIT BHU, 2026)
qc = QuantumCircuit(${qubits}, ${qubits})

# 1. State Preparation on q[0]
${inputState === 'plus' ? 'qc.h(0)' : inputState === 'one' ? 'qc.x(0)' : inputState === 'plus_i' ? 'qc.h(0)\nqc.s(0)' : '# |0> standard ground state'}

# 2. EPR Bell Pair Generation
for i in range(1, ${qubits} - 1, 2):
    qc.h(i)
    qc.cx(i, i + 1)

# 3. Scrambler Unitary U (${scrambler})
${
  scrambler === 'clifford'
    ? `# Clifford: Zero non-stabilizer magic (T-count = 0)
for q in range(${qubits}):
    qc.h(q)
    qc.s(q)
for q in range(${qubits} - 1):
    qc.cx(q, q + 1)`
    : `# Haar: High magic with non-Clifford T-gates
for q in range(${qubits}):
    qc.h(q)
    qc.t(q)
    qc.ry(np.pi / 4, q)
for q in range(${qubits} - 1):
    qc.cx(q, q + 1)
    qc.tdg(q + 1)`
}

# 4. Wormhole Decoder Unitary U_dagger
${
  scrambler === 'clifford'
    ? `for q in reversed(range(${qubits} - 1)):
    qc.cx(q, q + 1)
for q in range(${qubits}):
    qc.sdg(q)
    qc.h(q)`
    : `for q in reversed(range(${qubits} - 1)):
    qc.t(q + 1)
    qc.cx(q, q + 1)
for q in range(${qubits}):
    qc.ry(-np.pi / 4, q)
    qc.tdg(q)
    qc.h(q)`
}

# 5. Measure all qubits
qc.measure(range(${qubits}), range(${qubits}))

# Execute on Aer Simulator
simulator = AerSimulator()
compiled_circuit = transpile(qc, simulator)
result = simulator.run(compiled_circuit, shots=1024).result()
counts = result.get_counts(qc)
print(f"Teleportation measurement counts: {counts}")
`;
}

export function generateCirqPython(qubits: number, scrambler: ScramblerType, inputState: InputStateType): string {
  return `import cirq
import numpy as np

# Qubit registers
qubits = cirq.LineQubit.range(${qubits})
circuit = cirq.Circuit()

# 1. State preparation
${inputState === 'plus' ? 'circuit.append(cirq.H(qubits[0]))' : inputState === 'one' ? 'circuit.append(cirq.X(qubits[0]))' : '# |0> state'}

# 2. Entangled EPR Pairs
for i in range(1, ${qubits} - 1, 2):
    circuit.append([cirq.H(qubits[i]), cirq.CNOT(qubits[i], qubits[i+1])])

# 3. Scrambler Unitary U (${scrambler.toUpperCase()})
${
  scrambler === 'clifford'
    ? `for q in qubits:
    circuit.append([cirq.H(q), cirq.S(q)])
for i in range(${qubits} - 1):
    circuit.append(cirq.CNOT(qubits[i], qubits[i+1]))`
    : `for q in qubits:
    circuit.append([cirq.H(q), cirq.T(q), cirq.ry(np.pi/4)(q)])
for i in range(${qubits} - 1):
    circuit.append([cirq.CNOT(qubits[i], qubits[i+1]), cirq.T(qubits[i+1])**-1])`
}

# 4. Decoder Unitary U_dagger
${
  scrambler === 'clifford'
    ? `for i in reversed(range(${qubits} - 1)):
    circuit.append(cirq.CNOT(qubits[i], qubits[i+1]))
for q in qubits:
    circuit.append([cirq.S(q)**-1, cirq.H(q)])`
    : `for i in reversed(range(${qubits} - 1)):
    circuit.append([cirq.T(qubits[i+1]), cirq.CNOT(qubits[i], qubits[i+1])])
for q in qubits:
    circuit.append([cirq.ry(-np.pi/4)(q), cirq.T(q)**-1, cirq.H(q)])`
}

# 5. Measure
circuit.append(cirq.measure(*qubits, key='result'))

# Simulate
simulator = cirq.Simulator()
result = simulator.run(circuit, repetitions=1000)
print(result.histogram(key='result'))
`;
}
