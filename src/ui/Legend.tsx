import React from 'react';
import { GlassPanel } from './GlassPanel';

export const Legend: React.FC = () => {
  return (
    <GlassPanel className="w-64 p-3 font-mono-telemetry text-xs space-y-2 select-none">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 mb-2">
        <span className="font-heading font-extrabold text-cyan-300 tracking-wider text-[11px] uppercase">
          HAZARD ZONES
        </span>
        <span className="bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
          SIMULATED
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_#E63946]" />
        <div className="flex flex-col">
          <span className="font-bold text-red-400 text-[10px] uppercase">HIGH HAZARD (RED)</span>
          <span className="text-[9px] text-slate-400">Immediate Evacuation Zone</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-orange-400 shrink-0 shadow-[0_0_8px_#FB923C]" />
        <div className="flex flex-col">
          <span className="font-bold text-orange-400 text-[10px] uppercase">MEDIUM HAZARD (ORANGE)</span>
          <span className="text-[9px] text-slate-400">Restricted Access / Caution</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-yellow-400 shrink-0 shadow-[0_0_8px_#FACC15]" />
        <div className="flex flex-col">
          <span className="font-bold text-yellow-400 text-[10px] uppercase">LOW HAZARD (YELLOW)</span>
          <span className="text-[9px] text-slate-400">Cautionary Boundary</span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-800 pt-1.5">
        <span className="w-4 h-0.5 bg-green-500 shrink-0 shadow-[0_0_6px_#22C55E]" />
        <div className="flex flex-col">
          <span className="font-bold text-green-400 text-[10px] uppercase">EVACUATION ROUTE</span>
          <span className="text-[9px] text-slate-400">Safe Extraction Vector</span>
        </div>
      </div>
    </GlassPanel>
  );
};
