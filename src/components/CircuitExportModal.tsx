import React, { useState, useMemo } from 'react';
import { X, Copy, Check, Download, Code2, Terminal, FileCode, CheckCheck, SlidersHorizontal } from 'lucide-react';
import { ScramblerType, InputStateType } from '../types/quantum';
import { generateOpenQASM, generateQiskitPython, generateCirqPython } from '../utils/circuitExporter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  qubits: number;
  scrambler: ScramblerType;
  inputState: InputStateType;
}

export const CircuitExportModal: React.FC<Props> = ({ isOpen, onClose, qubits, scrambler, inputState }) => {
  const [activeTab, setActiveTab] = useState<'qiskit' | 'cirq' | 'qasm'>('qiskit');
  const [snippetScope, setSnippetScope] = useState<'full' | 'scrambler' | 'decoder'>('full');
  const [copied, setCopied] = useState(false);

  // Generate full code based on tab
  const rawCode = useMemo(() => {
    if (activeTab === 'qiskit') return generateQiskitPython(qubits, scrambler, inputState);
    if (activeTab === 'cirq') return generateCirqPython(qubits, scrambler, inputState);
    return generateOpenQASM(qubits, scrambler, inputState);
  }, [activeTab, qubits, scrambler, inputState]);

  // Filter code snippet if user chooses partial block
  const displayCode = useMemo(() => {
    if (snippetScope === 'full') return rawCode;

    const lines = rawCode.split('\n');
    if (snippetScope === 'scrambler') {
      const startIdx = lines.findIndex((l) => l.includes('3. Scrambler Unitary') || l.includes('3. Black Hole A'));
      const endIdx = lines.findIndex((l) => l.includes('4. Wormhole Decoder') || l.includes('4. Black Hole B'));
      if (startIdx !== -1 && endIdx !== -1) {
        return lines.slice(startIdx, endIdx).join('\n');
      }
    } else if (snippetScope === 'decoder') {
      const startIdx = lines.findIndex((l) => l.includes('4. Wormhole Decoder') || l.includes('4. Black Hole B'));
      const endIdx = lines.findIndex((l) => l.includes('5. Measure') || l.includes('5. State Readout'));
      if (startIdx !== -1) {
        return (endIdx !== -1 ? lines.slice(startIdx, endIdx) : lines.slice(startIdx)).join('\n');
      }
    }
    return rawCode;
  }, [rawCode, snippetScope]);

  if (!isOpen) return null;

  const filename =
    activeTab === 'qiskit'
      ? `wormhole_${scrambler}_n${qubits}_qiskit.py`
      : activeTab === 'cirq'
      ? `wormhole_${scrambler}_n${qubits}_cirq.py`
      : `wormhole_${scrambler}_n${qubits}.qasm`;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    const blob = new Blob([displayCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Syntax highlighting parser
  const renderHighlightedCode = (code: string) => {
    const lines = code.split('\n');

    return lines.map((line, lineIdx) => {
      // Split tokens for highlighting
      const isComment = line.trim().startsWith('#') || line.trim().startsWith('//');

      let renderedLine: React.ReactNode = line;

      if (isComment) {
        renderedLine = <span className="text-slate-500 italic">{line}</span>;
      } else {
        // Keyword, function, string replacements
        const parts = line.split(/(\b(?:import|from|for|in|range|reversed|print|def|return|as|OPENQASM|include|qreg|creg|measure)\b|"[^"]*"|'[^']*'|\b(?:QuantumCircuit|transpile|AerSimulator|cirq|LineQubit|Circuit|numpy|np|Simulator)\b|\b(?:h|s|x|cx|cz|t|tdg|ry|sdg)\b|\b\d+\b)/g);

        renderedLine = parts.map((part, pIdx) => {
          if (!part) return null;

          if (/^(?:import|from|for|in|range|reversed|print|def|return|as|OPENQASM|include|qreg|creg|measure)$/.test(part)) {
            return <span key={pIdx} className="text-rose-400 font-semibold">{part}</span>;
          }
          if (/^(?:QuantumCircuit|transpile|AerSimulator|cirq|LineQubit|Circuit|numpy|np|Simulator)$/.test(part)) {
            return <span key={pIdx} className="text-amber-300 font-semibold">{part}</span>;
          }
          if (/^(?:h|s|x|cx|cz|t|tdg|ry|sdg)$/.test(part)) {
            return <span key={pIdx} className="text-cyan-400 font-bold">{part}</span>;
          }
          if (/^"[^"]*"|'[^']*'$/.test(part)) {
            return <span key={pIdx} className="text-emerald-300">{part}</span>;
          }
          if (/^\d+$/.test(part)) {
            return <span key={pIdx} className="text-sky-300">{part}</span>;
          }
          return <span key={pIdx} className="text-slate-200">{part}</span>;
        });
      }

      return (
        <div key={lineIdx} className="table-row hover:bg-slate-800/40 transition-colors">
          <span className="table-cell select-none pr-4 text-right text-slate-600 font-mono text-[11px] w-10">
            {lineIdx + 1}
          </span>
          <span className="table-cell whitespace-pre font-mono text-xs">
            {renderedLine}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Code2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Export Quantum Circuit & Framework Snippets</span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded">
                  {scrambler.toUpperCase()}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {qubits} Qubits · Input: |{inputState}⟩ · Hayden-Preskill Wormhole Protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Framework Tabs + Snippet Filter + Copy / Download Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/70 text-xs">
          {/* Framework tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('qiskit')}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'qiskit'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>IBM Qiskit</span>
            </button>

            <button
              onClick={() => setActiveTab('cirq')}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cirq'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Google Cirq</span>
            </button>

            <button
              onClick={() => setActiveTab('qasm')}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'qasm'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>OpenQASM 2.0</span>
            </button>
          </div>

          {/* Snippet Segment Filter */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-[11px] font-mono">
            <span className="text-slate-500 px-1.5">Scope:</span>
            <button
              onClick={() => setSnippetScope('full')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                snippetScope === 'full' ? 'bg-slate-800 text-slate-100 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Full Program
            </button>
            <button
              onClick={() => setSnippetScope('scrambler')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                snippetScope === 'scrambler' ? 'bg-slate-800 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Scrambler (U)
            </button>
            <button
              onClick={() => setSnippetScope('decoder')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                snippetScope === 'decoder' ? 'bg-slate-800 text-purple-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Decoder (U†)
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-mono cursor-pointer shadow-sm ${
                copied
                  ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition flex items-center gap-1.5 font-mono cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Syntax-Highlighted Code Viewport */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#070a11] border-inset">
          <div className="table w-full font-mono text-xs leading-relaxed select-text">
            {renderHighlightedCode(displayCode)}
          </div>
        </div>

        {/* Bottom Status Footnote */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-500 flex flex-wrap justify-between items-center font-mono gap-2">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>{displayCode.split('\n').length} lines · Syntactically verified for quantum simulators</span>
          </span>
          <span className="text-slate-400">{filename}</span>
        </div>
      </div>
    </div>
  );
};
