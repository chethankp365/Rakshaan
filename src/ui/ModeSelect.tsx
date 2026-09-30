import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { SCENARIOS } from '../config/scenarios';
import { GlassPanel } from './GlassPanel';
import {
  Navigation,
  Tablet,
  Volume2,
  VolumeX,
  Maximize2,
} from 'lucide-react';

export const ModeSelect: React.FC = () => {
  const {
    setMode,
    scenario,
    setScenario,
    quality,
    setQuality,
    mute,
    toggleMute,
    inspectDrone,
    setInspectDrone,
  } = useAppStore();

  useEffect(() => {
    if (inspectDrone) return;
    const scenarioKeys = ['flood', 'landslide', 'cyclone'];
    const interval = setInterval(() => {
      const currentIdx = scenarioKeys.indexOf(scenario);
      const nextIdx = (currentIdx + 1) % scenarioKeys.length;
      setScenario(scenarioKeys[nextIdx]);
    }, 12000);
    return () => clearInterval(interval);
  }, [inspectDrone, scenario, setScenario]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between p-6 sm:p-10 pointer-events-none select-none z-10">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60 pointer-events-none" />
      <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />

      {/* --- TOP BRANDING OVERLAY --- */}
      <div className="relative z-20 flex items-start justify-between">
        <div className="pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-widest text-glow-cyan">
                RAKSHAAN
              </h1>
              <span className="bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono-telemetry text-xs px-2.5 py-1 rounded font-bold">
                SIH26177
              </span>
            </div>
            <p className="text-cyan-200/90 text-sm font-mono-telemetry mt-1 tracking-wide">
              Autonomous AI-powered search-and-rescue drone platform
            </p>
          </motion.div>
        </div>

        {/* Top-Right Badge */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => useAppStore.getState().setAboutModalOpen(true)}
            className="bg-slate-900/80 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono-telemetry transition"
          >
            ABOUT SIH26177
          </button>

          <button
            onClick={() => setInspectDrone(!inspectDrone)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono-telemetry transition ${
              inspectDrone
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold shadow-[0_0_15px_#22D3EE]'
                : 'bg-slate-900/80 border-cyan-500/40 text-cyan-300 hover:bg-slate-800'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{inspectDrone ? 'EXIT INSPECT' : 'INSPECT DRONE'}</span>
          </button>

          <div className="bg-orange-950/80 border border-orange-500/50 text-orange-200 text-xs px-3 py-1.5 rounded-lg font-mono-telemetry flex items-center gap-2 shadow-lg backdrop-blur">
            <span>SIH 2026 | Team ZeroOne</span>
            <span className="bg-orange-500 text-slate-950 px-1.5 py-0.5 rounded font-extrabold text-[10px]">
              SIMULATED
            </span>
          </div>
        </div>
      </div>

      {/* --- CENTER MODE SELECT CARDS --- */}
      {!inspectDrone && (
        <div className="relative z-20 my-auto grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full pointer-events-auto">
          {/* CARD A: DRONE WORKING SIMULATION */}
          <GlassPanel
            variant="cyan"
            glowOnHover
            onClick={() => setMode('drone')}
            className="cursor-pointer group flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Navigation className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono-telemetry text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 rounded-full font-bold">
                  MODE A
                </span>
              </div>
              <h2 className="font-heading text-2xl font-extrabold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                DRONE WORKING SIMULATION
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Watch RAKSHAAN fly, sense, think and rescue across hazard zones from cinematic camera angles with real-time AI perception overlays.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-cyan-500/20 pt-4">
              <span className="text-xs font-mono-telemetry text-cyan-300 font-bold group-hover:underline flex items-center gap-1">
                LAUNCH SIMULATION &rarr;
              </span>
              <span className="text-[10px] text-slate-400 font-mono-telemetry">
                CINEMATIC CAMERAS & AI
              </span>
            </div>
          </GlassPanel>

          {/* CARD B: RESCUE TEAM SIMULATION */}
          <GlassPanel
            variant="orange"
            glowOnHover
            onClick={() => setMode('rescue')}
            className="cursor-pointer group flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
                  <Tablet className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono-telemetry text-orange-400 bg-orange-950/80 border border-orange-500/40 px-2.5 py-1 rounded-full font-bold">
                  MODE B
                </span>
              </div>
              <h2 className="font-heading text-2xl font-extrabold text-white tracking-wide group-hover:text-orange-300 transition-colors">
                RESCUE TEAM SIMULATION
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                See how the drone streams live video feed, telemetry and instant emergency alerts to the field commander's tablet dashboard.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-orange-500/20 pt-4">
              <span className="text-xs font-mono-telemetry text-orange-300 font-bold group-hover:underline flex items-center gap-1">
                LAUNCH TABLET HUD &rarr;
              </span>
              <span className="text-[10px] text-slate-400 font-mono-telemetry">
                FIELD COMMANDER DASHBOARD
              </span>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* --- BOTTOM CONTROLS & SCENARIO CHIPS --- */}
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-heading font-extrabold text-cyan-300 uppercase tracking-wider mr-1">
            SCENARIOS:
          </span>
          {Object.values(SCENARIOS).map((s) => (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              className={`text-xs font-mono-telemetry px-3 py-1.5 rounded-lg border transition-all ${
                scenario === s.id
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold shadow-[0_0_12px_#22D3EE]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-cyan-500/50'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
          <div className="flex items-center gap-2 text-xs font-mono-telemetry">
            <span className="text-slate-400">QUALITY:</span>
            <div className="flex bg-slate-950/80 border border-slate-800 rounded-lg p-0.5">
              {(['low', 'medium', 'high'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`text-[10px] px-2 py-0.5 rounded uppercase ${
                    quality === q
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 text-xs font-mono-telemetry bg-slate-950/80 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg hover:text-cyan-300 transition"
          >
            {mute ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span>{mute ? 'MUTED' : 'AUDIO ON'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
