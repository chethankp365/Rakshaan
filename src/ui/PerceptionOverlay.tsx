import React from 'react';
import type { WorldState } from '../sim/types';
import { Target, Eye, ShieldCheck, Activity } from 'lucide-react';

interface PerceptionOverlayProps {
  worldState: WorldState;
}

export const PerceptionOverlay: React.FC<PerceptionOverlayProps> = ({ worldState }) => {
  const { survivors, currentStep } = worldState;

  // Render perception overlay HUD when step >= 4 (RGB/FLIR AI Detection active)
  if (currentStep.id < 4) return null;

  const target = survivors[0];

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center gap-2">
      {/* Sleek Top Center AI Target Lock HUD Status Banner */}
      <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-200 px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] animate-in slide-in-from-top-4 duration-300 font-mono text-xs">
        <div className="relative flex items-center justify-center">
          <Target className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-bold text-white tracking-wide">
            <span className="text-cyan-400">EDGE AI DETECTED:</span>
            <span className="text-emerald-400">{target?.species || 'HUMAN (HOMO SAPIENS)'}</span>
            <span className="text-xs text-amber-300 font-mono">[{target?.estimatedAge || '34 YRS'}]</span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-300 font-mono">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-cyan-400" />
              CONF: <strong className="text-cyan-200">{((target?.confidence ?? 0.96) * 100).toFixed(1)}%</strong>
            </span>
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-400" />
              FLIR: <strong className="text-amber-300">{target?.thermalTemp}°C</strong>
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3 h-3" />
              RGB+FLIR FUSED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
