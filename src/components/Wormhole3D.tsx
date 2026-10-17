import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, ZoomIn, ZoomOut, Layers, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  scramblerType: 'clifford' | 'haar';
  fidelity: number;
  isTeleporting?: boolean;
}

export const Wormhole3D: React.FC<Props> = ({ scramblerType, fidelity }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [cameraView, setCameraView] = useState<'side' | 'top' | 'throat'>('side');
  const [throatSpeed, setThroatSpeed] = useState(1.0);
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);

  // Mutable refs for Three.js scene loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const throatMeshRef = useRef<THREE.Mesh | null>(null);
  const particleSysRef = useRef<THREE.Points | null>(null);
  const accretionRingARef = useRef<THREE.Mesh | null>(null);
  const accretionRingBRef = useRef<THREE.Mesh | null>(null);
  const wavepacketRef = useRef<THREE.Mesh | null>(null);
  const targetCamPosRef = useRef(new THREE.Vector3(0, 3, 11));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x07090e, 0.04);

    // 2. Camera setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3, 11);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const lightA = new THREE.PointLight(0x6366f1, 3.5, 20);
    lightA.position.set(-4.5, 1, 3);
    scene.add(lightA);

    const lightB = new THREE.PointLight(0xa855f7, 3.5, 20);
    lightB.position.set(4.5, 1, 3);
    scene.add(lightB);

    const centerLight = new THREE.PointLight(0x06b6d4, 2.0, 15);
    centerLight.position.set(0, 0, 0);
    scene.add(centerLight);

    // 5. Einstein-Rosen Bridge (Hyperbolic Throat Geometry)
    // Connecting Black Hole A at (-4.2, 0, 0) and Black Hole B at (4.2, 0, 0)
    const throatCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.2, 0, 0),
      new THREE.Vector3(-2.0, -0.4, 0),
      new THREE.Vector3(0, -0.6, 0),
      new THREE.Vector3(2.0, -0.4, 0),
      new THREE.Vector3(4.2, 0, 0),
    ]);

    // Flared throat tube geometry
    const radialSegments = 36;
    const tubularSegments = 64;
    const throatGeo = new THREE.TubeGeometry(throatCurve, tubularSegments, 0.9, radialSegments, false);
    
    // Deform throat vertices into hyperbolic hourglass (pinched center, flared mouths)
    const posAttr = throatGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      const distFromCenter = Math.abs(x) / 4.2; // 0 to 1
      const flare = 0.5 + 0.9 * Math.pow(distFromCenter, 2.2);
      posAttr.setY(i, y * flare);
      posAttr.setZ(i, z * flare);
    }
    throatGeo.computeVertexNormals();

    const throatMat = new THREE.MeshStandardMaterial({
      color: scramblerType === 'clifford' ? 0x4f46e5 : 0x9333ea,
      wireframe: false,
      roughness: 0.25,
      metalness: 0.85,
      emissive: scramblerType === 'clifford' ? 0x312e81 : 0x581c87,
      emissiveIntensity: 0.45,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
    });
    const throatMesh = new THREE.Mesh(throatGeo, throatMat);
    scene.add(throatMesh);
    throatMeshRef.current = throatMesh;

    // 6. Black Hole A & B: Event Horizons and Accretion Disks
    const horizonGeo = new THREE.SphereGeometry(1.3, 32, 32);
    const horizonMatA = new THREE.MeshStandardMaterial({
      color: 0x05070c,
      roughness: 0.95,
      metalness: 0.1,
      emissive: 0x4338ca,
      emissiveIntensity: 0.15,
    });
    const blackHoleA = new THREE.Mesh(horizonGeo, horizonMatA);
    blackHoleA.position.set(-4.2, 0, 0);
    scene.add(blackHoleA);

    const horizonMatB = new THREE.MeshStandardMaterial({
      color: 0x05070c,
      roughness: 0.95,
      metalness: 0.1,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.15,
    });
    const blackHoleB = new THREE.Mesh(horizonGeo, horizonMatB);
    blackHoleB.position.set(4.2, 0, 0);
    scene.add(blackHoleB);

    // Accretion Disks (Kerr black hole photon rings)
    const ringGeo = new THREE.RingGeometry(1.4, 2.7, 48);
    const ringMatA = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    });
    const ringA = new THREE.Mesh(ringGeo, ringMatA);
    ringA.rotation.x = Math.PI / 2.5;
    blackHoleA.add(ringA);
    accretionRingARef.current = ringA;

    const ringMatB = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    });
    const ringB = new THREE.Mesh(ringGeo, ringMatB);
    ringB.rotation.x = -Math.PI / 2.5;
    blackHoleB.add(ringB);
    accretionRingBRef.current = ringB;

    // 7. Teleporting Quantum Wavepacket
    const packetGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
    });
    const wavepacket = new THREE.Mesh(packetGeo, packetMat);
    scene.add(wavepacket);
    wavepacketRef.current = wavepacket;

    // 8. Quantum Entanglement Stream / Micro-particles through throat
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const progress = Math.random();
      const pt = throatCurve.getPoint(progress);
      particlePositions[i * 3] = pt.x + (Math.random() - 0.5) * 0.4;
      particlePositions[i * 3 + 1] = pt.y + (Math.random() - 0.5) * 0.4;
      particlePositions[i * 3 + 2] = pt.z + (Math.random() - 0.5) * 0.4;
      particleSpeeds[i] = 0.003 + Math.random() * 0.008;
      particleOffsets[i] = progress;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particleSys = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSys);
    particleSysRef.current = particleSys;

    // 9. Spacetime Curvature Grid (Curved potential well)
    const gridHelper = new THREE.GridHelper(20, 32, 0x312e81, 0x1e1b4b);
    gridHelper.position.y = -3.2;
    scene.add(gridHelper);

    // Mouse drag interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      scene.rotation.y += dx * 0.005;
      scene.rotation.x = Math.max(-0.6, Math.min(0.6, scene.rotation.x + dy * 0.005));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize handler
    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    let packetProgress = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Camera smooth damping
      camera.position.lerp(targetCamPosRef.current, delta * 2.5);
      camera.lookAt(0, 0, 0);

      // Scene auto-rotation
      if (isRotating && !isDragging) {
        scene.rotation.y += 0.003 * throatSpeed;
      }

      // Rotate Accretion Disks
      if (accretionRingARef.current) accretionRingARef.current.rotation.z += 0.015 * throatSpeed;
      if (accretionRingBRef.current) accretionRingBRef.current.rotation.z -= 0.015 * throatSpeed;

      // Move Teleportation Wavepacket across throat
      packetProgress += 0.25 * delta * throatSpeed;
      if (packetProgress > 1) packetProgress = 0;
      if (wavepacketRef.current) {
        const pt = throatCurve.getPoint(packetProgress);
        wavepacketRef.current.position.copy(pt);
        const pulse = 1 + 0.25 * Math.sin(packetProgress * Math.PI * 6);
        wavepacketRef.current.scale.set(pulse, pulse, pulse);
      }

      // Animate quantum stream particles
      if (particleSysRef.current) {
        const positions = particleSysRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          particleOffsets[i] += particleSpeeds[i] * throatSpeed;
          if (particleOffsets[i] > 1) particleOffsets[i] = 0;

          const p = throatCurve.getPoint(particleOffsets[i]);
          positions[i * 3] = p.x + (Math.sin(i * 1.5 + particleOffsets[i] * 10) * 0.2);
          positions[i * 3 + 1] = p.y + (Math.cos(i * 2.1 + particleOffsets[i] * 10) * 0.2);
          positions[i * 3 + 2] = p.z + (Math.sin(i * 0.9 + particleOffsets[i] * 8) * 0.2);
        }
        particleSysRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      throatGeo.dispose();
      throatMat.dispose();
      horizonGeo.dispose();
      horizonMatA.dispose();
      horizonMatB.dispose();
      ringGeo.dispose();
      ringMatA.dispose();
      ringMatB.dispose();
      packetGeo.dispose();
      packetMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  // Update dynamic properties when state changes
  useEffect(() => {
    if (throatMeshRef.current) {
      const mat = throatMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.wireframe = wireframeMode;
      mat.color.setHex(scramblerType === 'clifford' ? 0x4f46e5 : 0x9333ea);
      mat.emissive.setHex(scramblerType === 'clifford' ? 0x312e81 : 0x581c87);
    }
  }, [wireframeMode, scramblerType]);

  // Handle camera angle updates
  const setCameraPreset = (view: 'side' | 'top' | 'throat') => {
    setCameraView(view);
    if (view === 'side') {
      targetCamPosRef.current.set(0, 3, 11);
    } else if (view === 'top') {
      targetCamPosRef.current.set(0, 12, 1);
    } else if (view === 'throat') {
      targetCamPosRef.current.set(0, 0.4, 3.8);
    }
  };

  return (
    <div className="relative w-full h-[500px] bg-[#07090e] rounded-2xl border border-slate-800/80 overflow-hidden select-none">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Specification Label (Minimal, Unobtrusive) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-slate-900/80 backdrop-blur border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs font-mono">
        <span className="text-slate-400">ER = EPR Spacetime Metric</span>
        <span className="text-slate-600">/</span>
        <span className="text-indigo-400 font-semibold uppercase">{scramblerType} Geometry</span>
        <span className="text-slate-600">/</span>
        <span className="text-emerald-400 font-semibold">{((fidelity || 0.94) * 100).toFixed(1)}% Fidelity</span>
      </div>

      {/* Top-Right Quick Legend */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-3 bg-slate-900/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          <span>Black Hole A (Alice)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>Black Hole B (Bob)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
          <span>EPR Wavepacket</span>
        </div>
      </div>

      {/* Ergonomic Collapsible Bottom Control Dock (Pinned Bottom-Center) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[820px] transition-transform duration-300">
        {/* Collapse / Expand Toggle Button */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsHudCollapsed(!isHudCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-t-lg text-[11px] font-medium text-slate-300 shadow-lg transition-colors cursor-pointer"
          >
            {isHudCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>Show 3D Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                <span>Hide Controls (Zen Mode)</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Surface */}
        {!isHudCollapsed && (
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            {/* View Camera Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono mr-1">View:</span>
              <button
                onClick={() => setCameraPreset('side')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  cameraView === 'side' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Throat Profile
              </button>
              <button
                onClick={() => setCameraPreset('top')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  cameraView === 'top' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Top Orbital
              </button>
              <button
                onClick={() => setCameraPreset('throat')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  cameraView === 'throat' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Throat Interior
              </button>
            </div>

            {/* Visual Mode Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isRotating ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                }`}
              >
                <RotateCw className="w-3 h-3" />
                <span>{isRotating ? 'Spinning' : 'Static'}</span>
              </button>

              <button
                onClick={() => setWireframeMode(!wireframeMode)}
                className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  wireframeMode ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>{wireframeMode ? 'Wireframe' : 'PBR Solid'}</span>
              </button>
            </div>

            {/* Speed Rate Slider */}
            <div className="flex items-center gap-2 min-w-[130px]">
              <span className="text-[11px] text-slate-400 font-mono">Speed:</span>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.2"
                value={throatSpeed}
                onChange={(e) => setThroatSpeed(parseFloat(e.target.value))}
                className="w-20 h-1.5 bg-slate-700 rounded appearance-none accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-indigo-400">{throatSpeed.toFixed(1)}x</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
