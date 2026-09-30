import React from 'react';
import type { WorldState } from '../sim/types';
import { GlassPanel } from './GlassPanel';
import { Eye, Flame } from 'lucide-react';

interface SensorFusionPanelProps {
  worldState: WorldState;
}

export const SensorFusionPanel: React.FC<SensorFusionPanelProps> = ({ worldState }) => {
  const { survivors, currentStep } = worldState;
  const target = survivors[0];

  if (!target || currentStep.id < 4) return null;

  const fusionScore = Math.min(99, Math.floor((target.confidence ?? 0.94) * 100 + 4));

  return (
    <GlassPanel className="w-80 p-3 space-y-2 backdrop-blur-xl border border-cyan-500/30">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
        <div className="flex items-center gap-1.5 text-cyan-300 font-heading font-extrabold text-xs tracking-wider">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>SENSOR FUSION VERIFICATION</span>
        </div>
        <span className="text-[9px] font-mono-telemetry bg-green-950 text-green-300 px-1.5 py-0.5 rounded border border-green-500/40 font-bold">
          KNOWN / VERIFIED
        </span>
      </div>

      {/* Side-by-side Mini RGB and Thermal Thumbnails */}
      <div className="grid grid-cols-2 gap-2 font-mono-telemetry text-[9px]">
        {/* RGB Feed */}
        <div className="relative h-20 bg-slate-900 rounded border border-cyan-500/30 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute top-1 left-1 bg-slate-950/80 text-cyan-300 px-1 rounded text-[8px] font-bold">
            RGB 4K
          </div>
          <div className="w-6 h-6 border border-cyan-400 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
          </div>
          <span className="text-[8px] text-slate-300 mt-1">CONF: 94.2%</span>
        </div>

        {/* Thermal Feed */}
        <div className="relative h-20 bg-gradient-to-br from-indigo-950 via-purple-900 to-amber-600 rounded border border-amber-500/40 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute top-1 left-1 bg-slate-950/80 text-amber-300 px-1 rounded text-[8px] font-bold flex items-center gap-0.5">
            <Flame className="w-2.5 h-2.5 text-amber-400" /> FLIR
          </div>
          <div className="w-6 h-6 rounded-full bg-amber-300/80 shadow-lg shadow-amber-400/50 flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <span className="text-[8px] text-white font-bold mt-1">{target.thermalTemp}°C HEAT</span>
        </div>
      </div>

      {/* Fusion Meter */}
      <div className="space-y-1 font-mono-telemetry text-[10px]">
        <div className="flex items-center justify-between text-slate-300">
          <span>FUSION CONFIDENCE</span>
          <span className="text-green-400 font-bold">{fusionScore}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-green-400 rounded-full" style={{ width: `${fusionScore}%` }} />
        </div>
      </div>
    </GlassPanel>
  );
};
