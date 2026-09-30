import React from 'react';
import type { DroneState } from '../sim/types';
import { GlassPanel } from './GlassPanel';
import { BatteryCharging, Compass, Radio, Satellite, Gauge, Navigation } from 'lucide-react';

interface DroneTelemetryPanelProps {
  drone: DroneState;
}

export const DroneTelemetryPanel: React.FC<DroneTelemetryPanelProps> = ({ drone }) => {
  const headingDegrees = Math.round((drone.heading * 180) / Math.PI + 360) % 360;

  return (
    <GlassPanel className="w-80 p-3 font-mono-telemetry text-xs space-y-2.5 backdrop-blur-xl border border-cyan-500/30">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
        <div className="flex items-center gap-1.5 text-cyan-300 font-heading font-extrabold text-xs tracking-wider">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span>DRONE TELEMETRY</span>
        </div>
        <span className="text-[9px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40 font-bold uppercase">
          {drone.mode}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        {/* Battery */}
        <div className="bg-slate-950/70 p-2 rounded border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="flex items-center gap-1">
              <BatteryCharging className="w-3 h-3 text-green-400" /> BATTERY
            </span>
            <span className={drone.battery < 25 ? 'text-red-400 font-bold animate-pulse' : 'text-green-400 font-bold'}>
              {drone.battery.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${drone.battery < 25 ? 'bg-red-500' : 'bg-green-400'}`}
              style={{ width: `${drone.battery}%` }}
            />
          </div>
        </div>

        {/* GPS Fix */}
        <div className="bg-slate-950/70 p-2 rounded border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="flex items-center gap-1">
              <Satellite className="w-3 h-3 text-cyan-400" /> GPS FIX
            </span>
            <span className={drone.gpsFix ? 'text-cyan-300 font-bold' : 'text-amber-400 font-bold'}>
              {drone.gpsFix ? `${drone.satellites} SATS` : 'IMU+LiDAR'}
            </span>
          </div>
          <div className="text-[9px] text-slate-400 font-bold">
            {drone.gpsFix ? 'RTK RECTIFIED' : `±${drone.positionUncertainty?.toFixed(1)}m UNCERT.`}
          </div>
        </div>

        {/* Speed */}
        <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
          <span className="text-slate-400 block text-[9px] flex items-center gap-1">
            <Gauge className="w-3 h-3 text-cyan-400" /> SPEED
          </span>
          <span className="text-white font-bold text-sm">{drone.speed.toFixed(1)} m/s</span>
        </div>

        {/* Altitude */}
        <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
          <span className="text-slate-400 block text-[9px]">ALTITUDE</span>
          <span className="text-white font-bold text-sm">{drone.altimeter.toFixed(1)} m</span>
        </div>
      </div>

      {/* Heading & Comm Link */}
      <div className="flex items-center justify-between bg-slate-950/70 p-2 rounded border border-slate-800 text-[10px]">
        <div className="flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>HEADING: <strong className="text-cyan-200">{headingDegrees}° N</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>LINK: <strong className={drone.commLink < 20 ? 'text-red-400' : 'text-green-400'}>{drone.commLink}%</strong></span>
        </div>
      </div>
    </GlassPanel>
  );
};
