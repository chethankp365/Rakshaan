import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/appStore';
import type { WorldState } from '../../sim/types';
import { SCENARIOS } from '../../config/scenarios';
import { FloodSite } from '../../world/environments/FloodSite';
import { Landslide } from '../../world/environments/Landslide';
import { Cyclone } from '../../world/environments/Cyclone';
import { Camera, Flame, Eye, Layers } from 'lucide-react';

interface TabLiveFeedProps {
  worldState: WorldState;
}

// Inner FPV Camera Controller Component for 3D Viewport
const FpvCameraController: React.FC<{ worldState: WorldState }> = ({ worldState }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { drone } = worldState;

  useFrame(() => {
    if (!cameraRef.current) return;
    const [x, y, z] = drone.position;
    const heading = drone.heading;
    const tiltRad = (drone.gimbal.tilt * Math.PI) / 180;
    const panRad = (drone.gimbal.pan * Math.PI) / 180;

    // Camera origin at drone position
    cameraRef.current.position.set(x, y - 0.2, z);

    // Calculate look-at target point based on heading & gimbal angles
    const lookDist = 60;
    const targetX = x + Math.sin(heading + panRad) * Math.cos(tiltRad) * lookDist;
    const targetY = y + Math.sin(tiltRad) * lookDist;
    const targetZ = z + Math.cos(heading + panRad) * Math.cos(tiltRad) * lookDist;

    cameraRef.current.lookAt(targetX, targetY, targetZ);
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={65} near={0.1} far={800} />;
};

export const TabLiveFeed: React.FC<TabLiveFeedProps> = ({ worldState }) => {
  const { cameraMode, setCameraMode, snapshots, addSnapshot, stressCommLoss, quality, scenario } = useAppStore();
  const { drone, survivors, t } = worldState;
  const currentScenario = SCENARIOS[scenario] || SCENARIOS.flood;

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const handleCaptureSnapshot = () => {
    addSnapshot({
      id: `SNAP-${Date.now()}`,
      timestamp: formatTime(t),
      mode: cameraMode,
      targetId: survivors[0]?.id || 'S-01',
    });
  };

  return (
    <div className="flex-1 flex flex-col gap-3 overflow-hidden p-3 font-mono-telemetry text-xs">
      {/* Live Video Window */}
      <div className="relative flex-1 bg-slate-950 rounded-xl border-2 border-cyan-500/40 overflow-hidden flex items-center justify-center">
        {stressCommLoss ? (
          <div className="flex flex-col items-center justify-center text-red-400 gap-2 bg-slate-950 w-full h-full animate-pulse">
            <span className="text-2xl font-black tracking-widest">[ NO SIGNAL - COMM LINK LOST ]</span>
            <span className="text-xs text-slate-400">Drone executing autonomous local edge loop</span>
          </div>
        ) : (
          <div className="relative w-full h-full overflow-hidden bg-slate-950">
            {/* Active Real-Time 3D FPV Drone Camera Canvas Feed */}
            <Canvas shadows={quality !== 'low'} frameloop="always" className="w-full h-full">
              <FpvCameraController worldState={worldState} />

              {/* 3D World Environment Rendered Live inside Tablet Feed */}
              {scenario === 'flood' && (
                <FloodSite scenario={currentScenario} worldState={worldState} quality={quality} />
              )}
              {scenario === 'landslide' && (
                <Landslide scenario={currentScenario} worldState={worldState} quality={quality} />
              )}
              {scenario === 'cyclone' && (
                <Cyclone scenario={currentScenario} worldState={worldState} quality={quality} />
              )}
            </Canvas>

            {/* Sensor Stream Visual Overlay Effects */}
            {cameraMode === 'thermal' && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-950/60 via-indigo-900/40 to-amber-500/50 mix-blend-color-dodge pointer-events-none" />
            )}
            {cameraMode === 'lidar' && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-slate-950/60 to-black/80 pointer-events-none" />
            )}

            {/* FPV HUD Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 border border-cyan-400/80 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
              </div>
              <div className="absolute w-24 h-px bg-cyan-400/60" />
              <div className="absolute h-24 w-px bg-cyan-400/60" />
            </div>

            {/* Top Left Recording Status */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/85 px-3 py-1.5 rounded-lg border border-cyan-500/40 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-black tracking-wide">REC LIVE</span>
              <span className="text-cyan-300 font-bold ml-2">4K 60FPS</span>
            </div>

            {/* Top Right GPS Coordinates */}
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-950/85 px-3 py-1.5 rounded-lg border border-cyan-500/40 text-cyan-300 font-bold backdrop-blur-md">
              <span>LAT: 28.6139° N</span>
              <span>LON: 77.2090° E</span>
            </div>

            {/* Dynamic AI Detection Tag on Active Target */}
            {survivors[0] && (
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 border border-cyan-500/80 bg-slate-950/90 p-2.5 rounded-xl text-[10px] text-slate-200 shadow-2xl backdrop-blur-md min-w-[210px] pointer-events-none">
                <div className="font-bold flex items-center justify-between gap-2 border-b border-white/10 pb-1 mb-1">
                  <span className="text-white font-mono">[TARGET {survivors[0].id}]</span>
                  <span className="text-emerald-400 font-black">98.6% VERIFIED</span>
                </div>
                <div className="text-emerald-400 font-bold">{survivors[0].species || 'Human (Homo Sapiens)'}</div>
                <div className="text-amber-300 font-bold">EST. AGE: {survivors[0].estimatedAge || '34 Yrs'}</div>
                <div className="text-slate-300">FLIR: {survivors[0].thermalTemp}°C</div>
              </div>
            )}

            {/* Bottom Telemetry Overlay Ribbon */}
            <div className="absolute bottom-3 inset-x-3 bg-slate-950/90 p-2.5 rounded-xl border border-cyan-500/40 flex items-center justify-between text-[11px] text-cyan-300 backdrop-blur-md">
              <div className="flex items-center gap-5">
                <span>ALT: <strong className="text-white">{drone.altimeter.toFixed(1)}m</strong></span>
                <span>SPD: <strong className="text-white">{drone.speed.toFixed(1)}m/s</strong></span>
                <span>STREAM: <strong className="uppercase text-amber-300">{cameraMode}</strong></span>
              </div>
              <button
                onClick={handleCaptureSnapshot}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow"
              >
                <Camera className="w-4 h-4" />
                <span>SNAPSHOT</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sensor Mode Switcher Bar */}
      <div className="flex items-center justify-between bg-slate-950/90 p-2 rounded-xl border border-cyan-500/30">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold text-[10px] mr-1">SENSOR STREAM:</span>
          <button
            onClick={() => setCameraMode('fpv', true)}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              cameraMode === 'fpv' || cameraMode === 'chase'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> RGB 4K
          </button>
          <button
            onClick={() => setCameraMode('thermal', true)}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              cameraMode === 'thermal'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> FLIR THERMAL
          </button>
          <button
            onClick={() => setCameraMode('lidar', true)}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              cameraMode === 'lidar'
                ? 'bg-cyan-400 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> LIDAR DEPTH
          </button>
        </div>

        {/* Gallery Count */}
        <div className="text-[10px] text-slate-400 font-bold pr-2">
          GALLERY: <span className="text-cyan-300 font-black">{snapshots.length} FRAMES</span>
        </div>
      </div>
    </div>
  );
};
