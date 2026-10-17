import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Atom,
  Zap,
  Bot,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Activity,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Volume2,
  VolumeX
} from 'lucide-react';

export type ActiveTab = 'sim' | 'three3d' | 'benchmark' | 'circuits' | 'hardware' | 'ai' | 'theory';
import { SimulationTrial } from '../types/quantum';
import { quantumAudio } from '../utils/quantumAudio';

export interface NavTabItem {
  id: ActiveTab;
  label: string;
  shortLabel: string;
  badge?: string;
}

export const NAV_TABS: NavTabItem[] = [
  { id: 'sim', label: 'Simulation', shortLabel: 'Sim', badge: '2D/MC' },
  { id: 'three3d', label: '3D Wormhole', shortLabel: '3D', badge: 'ER=EPR' },
  { id: 'benchmark', label: 'Benchmark', shortLabel: 'Bench', badge: 'O(N³)' },
  { id: 'circuits', label: 'Gate Inspector', shortLabel: 'Gates', badge: 'Unitary' },
  { id: 'hardware', label: 'Hardware', shortLabel: 'QPU', badge: 'Apparatus' },
  { id: 'ai', label: 'AI Sentinel', shortLabel: 'AI', badge: 'Live' },
  { id: 'theory', label: 'Theory', shortLabel: 'Theory', badge: 'Proofs' },
];

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onQuickTrial: () => void;
  onOpenCopilot?: () => void;
  onOpenExport?: () => void;
  isSimulating?: boolean;
  latestTrial?: SimulationTrial | null;
  isAudioMuted?: boolean;
  onToggleAudio?: () => void;
}

export const Navigation: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onQuickTrial,
  onOpenCopilot,
  onOpenExport,
  isSimulating,
  latestTrial,
  isAudioMuted = false,
  onToggleAudio,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isFidelityGlowing, setIsFidelityGlowing] = useState(false);
  const [lastSeenTrialId, setLastSeenTrialId] = useState<number | null>(null);

  // Monitor trial changes to trigger the smooth glow/pulse animation
  useEffect(() => {
    if (latestTrial && latestTrial.trialId !== lastSeenTrialId) {
      setLastSeenTrialId(latestTrial.trialId);
      // If fidelity is high (>= 0.80), trigger the high-fidelity glow pulse and chime
      if (latestTrial.fidelity >= 0.80) {
        setIsFidelityGlowing(true);
        quantumAudio.playHighFidelityChime(latestTrial.fidelity);
        const timer = setTimeout(() => {
          setIsFidelityGlowing(false);
        }, 3200);
        return () => clearTimeout(timer);
      }
    }
  }, [latestTrial, lastSeenTrialId]);

  // Check scroll boundary to enable/disable slide chevrons
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Smooth slide scroll function
  const slideNav = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 220;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 250);
  };

  // When active tab changes, smoothly center it in the scroll container
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeButton = scrollContainerRef.current.querySelector(
      `[data-tab-id="${activeTab}"]`
    ) as HTMLElement | null;
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
    setTimeout(checkScroll, 300);
  }, [activeTab]);

  const handleSelectTab = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    quantumAudio.playSlideClick();
  };

  const activeIndex = NAV_TABS.findIndex((t) => t.id === activeTab);
  const fidelityPercent = latestTrial ? (latestTrial.fidelity * 100).toFixed(1) : '94.2';
  const isHighFidelity = latestTrial ? latestTrial.fidelity >= 0.88 : true;

  return (
    <header className="border-b border-slate-800/80 bg-[#090b10]/95 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col gap-2.5">
        
        {/* Main Row: Brand, Sliding Nav Tabs, and Action Controls */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 w-full">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30 shadow-sm shadow-indigo-950">
              <Atom className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-tight text-white whitespace-nowrap block">
                Quantum Wormhole Lab
              </span>
              <span className="text-[9px] font-mono text-slate-500 hidden md:block">
                ER = EPR Teleportation
              </span>
            </div>
          </div>

          {/* Zone 2: Sliding Nav Tabs with Slide Track & Arrow Controls */}
          <div className="relative flex items-center flex-grow max-w-3xl overflow-hidden px-1">
            
            {/* Slide Left Button */}
            <button
              onClick={() => slideNav('left')}
              disabled={!canScrollLeft}
              aria-label="Slide navigation left"
              className={`p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all shrink-0 mr-1 cursor-pointer disabled:opacity-20 disabled:pointer-events-none ${
                canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Tabs Track */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1 px-1 scroll-smooth w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    data-tab-id={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`relative px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-colors cursor-pointer shrink-0 select-none ${
                      isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Smooth Sliding Pill Indicator via Motion layoutId */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavTabIndicator"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        className="absolute inset-0 bg-indigo-600 rounded-lg shadow-sm shadow-indigo-900/60"
                        style={{ zIndex: -1 }}
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-1.5">
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={`text-[9px] font-mono px-1 py-0.2 rounded transition-colors ${
                            isActive
                              ? 'bg-indigo-900/80 text-indigo-200 border border-indigo-400/30'
                              : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-300'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Slide Right Button */}
            <button
              onClick={() => slideNav('right')}
              disabled={!canScrollRight}
              aria-label="Slide navigation right"
              className={`p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all shrink-0 ml-1 cursor-pointer disabled:opacity-20 disabled:pointer-events-none ${
                canScrollRight ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zone 3: Live Fidelity Animated Readout & Primary Actions */}
          <div className="shrink-0 flex items-center gap-2 sm:gap-2.5">
            
            {/* Animated 'Last Fidelity' Readout Pill with Pulse & Glow Animation */}
            <motion.div
              animate={
                isFidelityGlowing
                  ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        '0 0 0px rgba(16, 185, 129, 0)',
                        '0 0 25px 5px rgba(16, 185, 129, 0.65)',
                        '0 0 10px rgba(16, 185, 129, 0.3)',
                      ],
                    }
                  : { scale: 1, boxShadow: '0 0 0px rgba(0,0,0,0)' }
              }
              transition={{ duration: 1.8, repeat: isFidelityGlowing ? 1 : 0 }}
              onClick={() => setActiveTab('sim')}
              title="Click to view simulation trials and state tomography"
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-2 select-none ${
                isFidelityGlowing
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/40 shadow-emerald-500/30'
                  : isHighFidelity
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/60 hover:border-emerald-500/50'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-950/60'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {/* Pulsing indicator dot */}
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isFidelityGlowing ? 'bg-emerald-400 duration-700' : 'bg-emerald-500 duration-1000'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isHighFidelity ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                </span>

                <span className="text-[10px] uppercase text-slate-400 hidden xl:inline">Fidelity:</span>
              </div>

              {/* Number with smooth count/spring presence */}
              <div className="flex items-center gap-1 font-bold">
                <span className={isFidelityGlowing ? 'text-white' : 'text-emerald-300'}>
                  {fidelityPercent}%
                </span>
                {isFidelityGlowing && (
                  <motion.span
                    initial={{ rotate: 0, scale: 0 }}
                    animate={{ rotate: 180, scale: 1.2 }}
                    transition={{ type: 'spring', damping: 10 }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  </motion.span>
                )}
              </div>
            </motion.div>

            {/* Audio Feedback Toggle */}
            {onToggleAudio && (
              <button
                onClick={onToggleAudio}
                title={isAudioMuted ? 'Unmute quantum audio feedback' : 'Mute quantum audio feedback'}
                className={`p-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                  isAudioMuted
                    ? 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                    : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/70'
                }`}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}

            {/* AI Co-Pilot Button */}
            {onOpenCopilot && (
              <button
                onClick={onOpenCopilot}
                className="px-2.5 sm:px-3 py-1.5 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">AI Co-pilot</span>
              </button>
            )}

            {/* Run Trial Quick Action */}
            <button
              onClick={onQuickTrial}
              disabled={isSimulating}
              className="px-3 sm:px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm shadow-indigo-950 cursor-pointer active:scale-95"
            >
              <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce text-amber-300' : ''}`} />
              <span>{isSimulating ? 'Teleporting...' : 'Run Trial'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Track: Interactive Navigation Slide Picker Bar */}
        <div className="hidden sm:flex items-center gap-3 pt-1 border-t border-slate-800/40 text-[11px] font-mono text-slate-500">
          <span className="shrink-0 text-[10px] uppercase text-slate-500 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-indigo-400" />
            <span>Slide Picker:</span>
          </span>

          {/* Interactive Slide Track */}
          <div className="relative flex-grow h-2 bg-slate-900/90 rounded-full border border-slate-800 overflow-hidden cursor-pointer group">
            {/* Filled Active Segment */}
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
              animate={{
                width: `${((activeIndex + 1) / NAV_TABS.length) * 100}%`,
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />

            {/* Clickable Step Points along the track */}
            <div className="absolute inset-0 flex justify-between px-1">
              {NAV_TABS.map((tab, idx) => (
                <div
                  key={tab.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTab(tab.id);
                  }}
                  title={`Slide to ${tab.label}`}
                  className="w-4 h-full flex items-center justify-center cursor-pointer relative z-10"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === activeIndex
                        ? 'bg-white ring-2 ring-indigo-400 scale-125'
                        : idx < activeIndex
                        ? 'bg-indigo-300/60'
                        : 'bg-slate-700 hover:bg-slate-400'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Current Position Tag */}
          <div className="shrink-0 flex items-center gap-1.5 text-[10px]">
            <span className="text-slate-400">{activeIndex + 1} / {NAV_TABS.length}</span>
            <span className="text-indigo-400 font-semibold">{NAV_TABS[activeIndex].label}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
