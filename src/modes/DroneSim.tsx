import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
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
import { CameraController } from '../world/CameraController';
import { CoverageGrid } from '../world/CoverageGrid';

import { TopBar } from '../ui/TopBar';
import { EventTracePanel } from '../ui/EventTracePanel';
import { TacticalRadar } from '../ui/TacticalRadar';
import { SurvivorPriorityCards } from '../ui/SurvivorPriorityCards';
import { HazardPanel } from '../ui/HazardPanel';
import { DroneTelemetryPanel } from '../ui/DroneTelemetryPanel';
import { StressTestPanel } from '../ui/StressTestPanel';
import { TimelineBar } from '../ui/TimelineBar';
import { PipDroneCamera } from '../ui/PipDroneCamera';
import { SensorFusionPanel } from '../ui/SensorFusionPanel';
import { PerceptionOverlay } from '../ui/PerceptionOverlay';

import { MissionReportModal } from '../ui/MissionReportModal';

export const DroneSim: React.FC = () => {
  const { scenario, quality, showFootprint, showTrail, cameraMode } = useAppStore();
  const { t, isPlaying, tick } = useClockStore();

  const currentScenario = SCENARIOS[scenario] || SCENARIOS.flood;
  const worldState = getWorldState(t, scenario);

  // Simulation clock ticker frame loop using refs for smooth 60 FPS performance
  const isPlayingRef = React.useRef(isPlaying);
  const tickRef = React.useRef(tick);
  const speedRef = React.useRef(worldState.drone.speed);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    tickRef.current = tick;
    speedRef.current = worldState.drone.speed;
  }, [isPlaying, tick, worldState.drone.speed]);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = () => {
      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (isPlayingRef.current) {
        tickRef.current(delta);
        audioEngine.updateRotorSpeed(speedRef.current / 15);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const isReportStep = worldState.currentStep.id === 12;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 3D Viewport Canvas */}
      <Canvas
        shadows={quality !== 'low' ? { type: THREE.PCFShadowMap } : false}
        frameloop="always"
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[0, 45, 90]} fov={50} />
        {cameraMode === 'orbit' && (
          <OrbitControls maxPolarAngle={Math.PI / 2 - 0.05} minDistance={10} maxDistance={250} />
        )}

        <CameraController worldState={worldState} />

        {/* World Environments */}
        {scenario === 'flood' && (
          <FloodSite scenario={currentScenario} worldState={worldState} quality={quality} />
        )}
        {scenario === 'landslide' && (
          <Landslide scenario={currentScenario} worldState={worldState} quality={quality} />
        )}
        {scenario === 'cyclone' && (
          <Cyclone scenario={currentScenario} worldState={worldState} quality={quality} />
        )}

        {/* Coverage Grid */}
        <CoverageGrid coveragePercent={worldState.coveragePercent} />

        {/* Autonomous SAR Drone */}
        <Drone
          state={worldState.drone}
          showFootprint={showFootprint}
          showTrail={showTrail}
          quality={quality}
          replannedRoute={worldState.replannedRoute}
        />
      </Canvas>

      {/* Perception AI Bounding Box Overlays */}
      <PerceptionOverlay worldState={worldState} />

      {/* HUD Top Bar */}
      <TopBar />

      {/* Floating Left Column: Event Trace + Tactical Radar */}
      <div className="absolute top-28 left-4 z-20 pointer-events-auto flex flex-col gap-3">
        <EventTracePanel events={worldState.activeEvents} currentTime={t} />
        <TacticalRadar worldState={worldState} />
      </div>

      {/* Floating Right Column: Survivor Cards + Hazard Panel + Sensor Fusion */}
      <div className="absolute top-28 right-4 z-20 pointer-events-auto flex flex-col gap-3 items-end">
        {/* Picture-In-Picture Drone Camera Viewport */}
        <PipDroneCamera worldState={worldState} />
        <SensorFusionPanel worldState={worldState} />
        <SurvivorPriorityCards survivors={worldState.survivors} />
        <HazardPanel
          hazards={worldState.hazards}
          injectedHazardActive={worldState.injectedHazardActive}
        />
      </div>

      {/* Floating Bottom Left: Drone Telemetry */}
      <div className="absolute bottom-24 left-4 z-20 pointer-events-auto">
        <DroneTelemetryPanel drone={worldState.drone} />
      </div>

      {/* Floating Bottom Right: Stress Test Buttons */}
      <div className="absolute bottom-24 right-4 z-20 pointer-events-auto flex flex-col gap-2 items-end">
        <StressTestPanel />
      </div>

      {/* Floating Bottom Center: 4D Timeline Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <TimelineBar />
      </div>

      {/* Report Modal */}
      {isReportStep && (
        <MissionReportModal worldState={worldState} onClose={() => {}} />
      )}
    </div>
  );
};
