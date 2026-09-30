import React from 'react';
import type { Hazard } from '../sim/types';
import { GlassPanel } from './GlassPanel';
import { ShieldAlert, AlertOctagon } from 'lucide-react';

interface HazardPanelProps {
  hazards: Hazard[];
  injectedHazardActive?: boolean;
}

export const HazardPanel: React.FC<HazardPanelProps> = ({ hazards, injectedHazardActive }) => {
  return (
    <GlassPanel className="w-80 p-3 flex flex-col gap-2 backdrop-blur-xl border border-red-500/30">
      <div className="flex items-center justify-between border-b border-red-500/20 pb-1.5">
        <div className="flex items-center gap-1.5 text-red-400 font-heading text-xs font-bold tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span>ACTIVE HAZARD ZONES</span>
        </div>
        <span className="text-[9px] font-mono-telemetry bg-red-950 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40">
          {hazards.length + (injectedHazardActive ? 1 : 0)} RISKS
        </span>
      </div>

      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {hazards.map((h) => (
          <div
            key={h.id}
            className="p-2 rounded bg-slate-950/70 border border-slate-800 flex items-start gap-2 text-[10px] font-mono-telemetry"
          >
            <span
              className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0"
              style={{ backgroundColor: h.color }}
            />
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase">{h.name}</span>
                <span className="text-[8px] px-1 py-0.2 bg-red-950 text-red-300 rounded uppercase font-bold">
                  {h.severity}
                </span>
              </div>
              <p className="text-slate-400 leading-snug">{h.label}</p>
            </div>
          </div>
        ))}

        {injectedHazardActive && (
          <div className="p-2 rounded bg-red-950/80 border border-red-500 flex items-start gap-2 text-[10px] font-mono-telemetry animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-200 uppercase">DYNAMIC HAZARD INJECTED</span>
                <span className="text-[8px] px-1 py-0.2 bg-red-600 text-white rounded font-black">
                  CRITICAL
                </span>
              </div>
              <p className="text-red-300">Unstable flash hazard blocking primary flight corridor. Route replanned.</p>
            </div>
          </div>
        )}
      </div>
    </GlassPanel>
  );
};
