import React from 'react';
import type { WorldState } from '../../sim/types';
import { MISSION_STEPS } from '../../config/mission';
import { Cpu, Battery, Satellite, Radio, Navigation } from 'lucide-react';

interface TabDroneStatusProps {
  worldState: WorldState;
}

export const TabDroneStatus: React.FC<TabDroneStatusProps> = ({ worldState }) => {
  const { drone, currentStep, t } = worldState;

  return (
    <div className="flex-1 flex flex-col gap-3 p-3 font-mono-telemetry text-xs overflow-y-auto">
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
        <h3 className="font-heading font-extrabold text-cyan-300 text-sm flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cyan-400" />
          AUTONOMOUS DRONE DIAGNOSTICS & SYSTEM HEALTH
        </h3>
        <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30 font-bold uppercase">
          RAKSHAAN-SAR-01
        </span>
      </div>

      {/* Grid of Gauges & Telemetry */}
      <div className="grid grid-cols-4 gap-2.5">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] flex items-center justify-between">
            <span>BATTERY LEVEL</span>
            <Battery className="w-3.5 h-3.5 text-green-400" />
          </div>
          <div className="text-xl font-bold text-green-400">{drone.battery.toFixed(1)}%</div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 rounded-full" style={{ width: `${drone.battery}%` }} />
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] flex items-center justify-between">
            <span>GPS SATELLITES</span>
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-300">
            {drone.gpsFix ? `${drone.satellites} SATS` : '0 SATS'}
          </div>
          <div className="text-[9px] text-slate-400 font-bold">
            {drone.gpsFix ? 'RTK FIX OK' : 'IMU LOCALIZATION'}
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] flex items-center justify-between">
            <span>COMM LINK</span>
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">{drone.commLink}%</div>
          <div className="text-[9px] text-slate-400 font-bold">915MHz TELEMETRY</div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] flex items-center justify-between">
            <span>EDGE AI NPU</span>
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300">64 TOPS</div>
          <div className="text-[9px] text-slate-400 font-bold">YOLOv8 + FLIR INTEL</div>
        </div>
      </div>

      {/* Sensor Suite Online Indicators */}
      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
        <h4 className="font-heading font-extrabold text-xs text-white">SENSORS SUITE HEALTH STATUS</h4>
        <div className="grid grid-cols-5 gap-2 text-[10px]">
          {['RGB 4K', 'FLIR THERMAL', 'SOLID LIDAR', 'RTK-GPS DUAL', 'IMU 9-AXIS'].map((s) => (
            <div key={s} className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center gap-1.5 font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <span className="truncate">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 12-Step Mission Progress Tracker */}
      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-heading font-extrabold text-xs text-cyan-300">
            12-STEP AUTONOMOUS MISSION PROGRESS TRACKER
          </h4>
          <span className="text-[10px] text-slate-400">
            ACTIVE: <strong>STEP {currentStep.code} ({currentStep.title})</strong>
          </span>
        </div>

        <div className="grid grid-cols-6 gap-1.5">
          {MISSION_STEPS.map((step) => {
            const isCompleted = t >= step.endTime;
            const isActive = t >= step.startTime && t < step.endTime;

            return (
              <div
                key={step.id}
                className={`p-2 rounded border text-[9px] space-y-0.5 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-lg'
                    : isCompleted
                    ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900/60 text-slate-500 border-slate-800'
                }`}
              >
                <div className="font-mono">{step.code}. {step.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
