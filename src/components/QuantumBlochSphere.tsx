import React, { useEffect, useRef } from 'react';
import { QuantumStateVector } from '../types/quantum';
import { blochCoordinates } from '../utils/quantumMath';

interface Props {
  originalState: QuantumStateVector;
  recoveredState: QuantumStateVector;
  fidelity: number;
}

export const QuantumBlochSphere: React.FC<Props> = ({ originalState, recoveredState, fidelity }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotRef = useRef({ rotX: 0.35, rotY: 0.65 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);

      const rotX = rotRef.current.rotX;
      const rotY = rotRef.current.rotY;

      // 3D projection function
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y
        const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
        const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
        // Rotate around X
        const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

        const scale = radius;
        return {
          px: cx + x1 * scale,
          py: cy - y2 * scale,
          depth: z2,
        };
      };

      // Draw faint background sphere glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius);
      bgGrad.addColorStop(0, 'rgba(30, 41, 59, 0.4)');
      bgGrad.addColorStop(1, 'rgba(15, 23, 42, 0.05)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw outer circle
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw Equator (XY plane, z=0)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
      ctx.setLineDash([4, 4]);
      for (let angle = 0; angle <= 2 * Math.PI; angle += 0.05) {
        const p = project(Math.cos(angle), Math.sin(angle), 0);
        if (angle === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Meridian (XZ plane, y=0)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.setLineDash([3, 4]);
      for (let angle = 0; angle <= 2 * Math.PI; angle += 0.05) {
        const p = project(Math.cos(angle), 0, Math.sin(angle));
        if (angle === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Axes (X, Y, Z)
      const drawAxis = (x: number, y: number, z: number, label: string, color: string) => {
        const center = project(0, 0, 0);
        const end = project(x * 1.15, y * 1.15, z * 1.15);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.moveTo(center.px, center.py);
        ctx.lineTo(end.px, end.py);
        ctx.stroke();

        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = color;
        ctx.fillText(label, end.px + 4, end.py - 3);
      };

      drawAxis(1, 0, 0, '+X |+⟩', 'rgba(148, 163, 184, 0.5)');
      drawAxis(0, 1, 0, '+Y |+i⟩', 'rgba(148, 163, 184, 0.5)');
      drawAxis(0, 0, 1, '+Z |0⟩', 'rgba(148, 163, 184, 0.7)');
      drawAxis(0, 0, -1, '-Z |1⟩', 'rgba(148, 163, 184, 0.35)');

      // Draw Original State Vector |ψ⟩
      const bOrig = blochCoordinates(originalState);
      const pCenter = project(0, 0, 0);
      const pOrig = project(bOrig.x, bOrig.y, bOrig.z);

      ctx.beginPath();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2.5;
      ctx.moveTo(pCenter.px, pCenter.py);
      ctx.lineTo(pOrig.px, pOrig.py);
      ctx.stroke();

      // Original state head marker
      ctx.fillStyle = '#818cf8';
      ctx.beginPath();
      ctx.arc(pOrig.px, pOrig.py, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Label for |ψ⟩
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillStyle = '#a5b4fc';
      ctx.fillText('|ψ⟩ in', pOrig.px + 7, pOrig.py - 4);

      // Draw Recovered State Vector |ψ'⟩
      const bRec = blochCoordinates(recoveredState);
      const pRec = project(bRec.x, bRec.y, bRec.z);

      const recColor = fidelity >= 0.9 ? '#10b981' : fidelity >= 0.7 ? '#f59e0b' : '#ef4444';
      ctx.beginPath();
      ctx.strokeStyle = recColor;
      ctx.lineWidth = 2.2;
      ctx.setLineDash([5, 3]);
      ctx.moveTo(pCenter.px, pCenter.py);
      ctx.lineTo(pRec.px, pRec.py);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = recColor;
      ctx.beginPath();
      ctx.arc(pRec.px, pRec.py, 4.5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillStyle = recColor;
      ctx.fillText(`|ψ'⟩ rec`, pRec.px + 7, pRec.py + 10);

      // Arc showing angular fidelity divergence if separated
      const dx = pRec.px - pOrig.px;
      const dy = pRec.py - pOrig.py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 3) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.moveTo(pOrig.px, pOrig.py);
        ctx.lineTo(pRec.px, pRec.py);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [originalState, recoveredState, fidelity]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    rotRef.current.rotY += dx * 0.01;
    rotRef.current.rotX = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotRef.current.rotX - dy * 0.01));
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={260}
        height={240}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cursor-grab active:cursor-grabbing rounded-lg"
      />
      <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-1 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
          <span>Input |ψ⟩</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full inline-block ${fidelity >= 0.9 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
          <span>Recovered |ψ'⟩</span>
        </span>
      </div>
      <div className="text-[10px] text-slate-500 mt-0.5">Drag sphere to rotate Bloch axes</div>
    </div>
  );
};
