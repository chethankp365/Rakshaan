import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

import { useAppStore } from '../store/appStore';
import { useClockStore } from '../sim/clock';
import { SCENARIOS } from '../config/scenarios';
import { getWorldState } from '../sim/worldState';
import { audioEngine } from '../sim/audioEngine';

import { FloodSite } from '../world/environments/FloodSite';
import { Landslide } from '../world/environments/Landslide';
import { Cyclone } from '../world/environments/Cyclone';
import { Drone } from '../actors/Drone';
import { Survivor } from '../actors/Survivor';
import { Responder } from '../actors/Responder';
import { CommandPostProps } from '../world/CommandPostProps';
import { DataBeam } from '../world/DataBeam';
import { RescueCameraController } from '../world/RescueCameraController';

import { TopBar } from '../ui/TopBar';
import { TimelineBar } from '../ui/TimelineBar';
import { TabletContainer } from '../ui/tablet/TabletContainer';
import { StressTestPanel } from '../ui/StressTestPanel';

import { MissionReportModal } from '../ui/MissionReportModal';
import { AboutModal } from '../ui/modals/AboutModal';
import { ShortcutsModal } from '../ui/modals/ShortcutsModal';
import { PrintableReport } from '../ui/modals/PrintableReport';

export const RescueSim: React.FC = () => {
  const { scenario, quality, showFootprint, showTrail, toggleTabletOpen } = useAppStore();
  const { t, isPlaying, tick } = useClockStore();

  const currentScenario = SCENARIOS[scenario] || SCENARIOS.flood;
  const worldState = getWorldState(t, scenario);

  // Simulation clock frame loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        tick(delta);
        audioEngine.updateRotorSpeed(worldState.drone.speed / 15);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, tick, worldState.drone.speed]);

  // Keybinding 'T' listener to pick up tablet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 't') {
        toggleTabletOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTabletOpen]);

  const isReportStep = worldState.currentStep.id === 12;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 3D Viewport Canvas */}
      <Canvas
        shadows={quality !== 'low' ? { type: THREE.PCFShadowMap } : false}
        frameloop="always"
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[-75, 12, -45]} fov={50} />
        <RescueCameraController worldState={worldState} />

        {/* Hazard Environments */}
        {scenario === 'flood' && (
          <FloodSite scenario={currentScenario} worldState={worldState} quality={quality} />
        )}
        {scenario === 'landslide' && (
          <Landslide scenario={currentScenario} worldState={worldState} quality={quality} />
        )}
        {scenario === 'cyclone' && (
          <Cyclone scenario={currentScenario} worldState={worldState} quality={quality} />
        )}

        {/* Field Command Post Props & Team */}
        <CommandPostProps position={[-90, 1.5, -70]} />

        {/* 3D Data-Link Laser Beam & Packets */}
        <DataBeam dronePos={worldState.drone.position} commandPos={[-90, 2.5, -70]} />

        {/* Survivors */}
        {worldState.survivors.map((s) => (
          <Survivor key={s.id} survivor={s} />
        ))}

        {/* Responders */}
        {worldState.responders.map((r) => (
          <Responder key={r.id} responder={r} waterLevel={worldState.waterLevel} />
        ))}

        {/* Drone in Background Sky */}
        <Drone
          state={worldState.drone}
          showFootprint={showFootprint}
          showTrail={showTrail}
          quality={quality}
          replannedRoute={worldState.replannedRoute}
        />
      </Canvas>

      {/* Floating Header */}
      <TopBar />

      {/* Floating Bottom Left Telemetry Badge */}
      <div className="absolute bottom-24 left-4 z-20 pointer-events-auto bg-slate-950/85 p-3 rounded-xl border border-cyan-500/30 text-xs font-mono-telemetry space-y-1 backdrop-blur-md">
        <div className="flex items-center gap-2 text-cyan-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>RESCUE FIELD COMMAND BASE</span>
        </div>
        <div className="text-[10px] text-slate-400">
          DATALINK: <strong className="text-green-400">ONLINE (915MHz DUAL)</strong>
        </div>
        <button
          onClick={toggleTabletOpen}
          className="mt-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-[10px] transition shadow"
        >
          OPEN COMMAND TABLET (KEY T)
        </button>
      </div>

      {/* Floating Bottom Right Controls */}
      <div className="absolute bottom-24 right-4 z-20 pointer-events-auto flex flex-col gap-2 items-end">
        <StressTestPanel />
      </div>

      {/* Floating Bottom Center Timeline */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <TimelineBar />
      </div>

      {/* Rugged Tablet Dashboard Overlay */}
      <TabletContainer worldState={worldState} />

      {/* Modals & Overlays */}
      <AboutModal />
      <ShortcutsModal />
      <PrintableReport worldState={worldState} />

      {isReportStep && (
        <MissionReportModal worldState={worldState} onClose={() => {}} />
      )}
    </div>
  );
};
