import React from 'react';
import { useAppStore } from '../store/appStore';
import type { WorldState } from '../sim/types';
import { Maximize2 } from 'lucide-react';

interface PipDroneCameraProps {
  worldState: WorldState;
}

export const PipDroneCamera: React.FC<PipDroneCameraProps> = ({ worldState }) => {
  const { pipSwapped, togglePipSwap, cameraMode } = useAppStore();
  const { drone } = worldState;

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div
      onClick={togglePipSwap}
      className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer shadow-2xl group ${
        pipSwapped
          ? 'w-full h-full border-cyan-400'
          : 'w-64 h-36 border-cyan-500/50 hover:border-cyan-400 hover:scale-105 bg-slate-950/90'
      }`}
      title="Click to Swap Main View & Gimbal View"
    >
      {/* Simulated Live Drone Camera Viewfeed */}
      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center overflow-hidden">
        {/* Dynamic camera feed overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/40 via-transparent to-black/30 pointer-events-none" />

        {/* FPV Crosshair */}
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 border border-cyan-400/60 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-cyan-400 rounded-full" />
          </div>
          <div className="absolute w-12 h-px bg-cyan-400/40" />
          <div className="absolute h-12 w-px bg-cyan-400/40" />
        </div>

        {/* Live Thermal / RGB Feed watermark */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 font-mono-telemetry text-[9px] bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-red-400 font-black">REC</span>
          <span className="text-cyan-300 font-bold ml-1">4K 60FPS</span>
        </div>

        <div className="absolute top-2 right-2 text-[9px] font-mono-telemetry bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40">
          MODE: {cameraMode.toUpperCase()}
        </div>

        {/* Gimbal Telemetry Overlay */}
        <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-[9px] font-mono-telemetry text-cyan-300/90 bg-slate-950/70 px-2 py-1 rounded">
          <span>ALT: {drone.altimeter.toFixed(1)}m</span>
          <span>SPD: {drone.speed.toFixed(1)}m/s</span>
          <span>{formatTime(worldState.t)}</span>
        </div>
      </div>

      {/* Hover Swap Prompt Overlay */}
      <div className="absolute inset-0 bg-cyan-950/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white gap-1 font-heading text-xs font-bold backdrop-blur-xs">
        <Maximize2 className="w-5 h-5 text-cyan-400 animate-bounce" />
        <span>CLICK TO SWAP VIEW</span>
      </div>
    </div>
  );
};
