import React from 'react';
import type { WorldState } from '../../sim/types';
import { ShieldAlert, TrendingUp, AlertOctagon } from 'lucide-react';

interface TabHazardsProps {
  worldState: WorldState;
}

export const TabHazards: React.FC<TabHazardsProps> = ({ worldState }) => {
  const { hazards, injectedHazardActive, waterLevel } = worldState;

  return (
    <div className="flex-1 flex flex-col gap-3 p-3 font-mono-telemetry text-xs overflow-y-auto">
      <div className="flex items-center justify-between border-b border-red-500/30 pb-2">
        <h3 className="font-heading font-extrabold text-red-400 text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          ACTIVE HAZARD ZONES & ENVIRONMENTAL THREATS
        </h3>
        <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-500/40">
          {hazards.length + (injectedHazardActive ? 1 : 0)} RISKS MONITORING
        </span>
      </div>

      <div className="space-y-3">
        {hazards.map((h) => (
          <div
            key={h.id}
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: h.color }}
                />
                <h4 className="font-heading font-black text-white text-xs">{h.name}</h4>
              </div>
              <span className="text-[9px] bg-red-950 text-red-300 px-2 py-0.5 rounded font-black border border-red-500/40 uppercase">
                {h.severity} SEVERITY
              </span>
            </div>

            <p className="text-slate-300 font-sans text-xs">{h.label}</p>

            <div className="grid grid-cols-3 gap-2 bg-slate-900/90 p-2 rounded-lg text-[10px]">
              <div>
                <span className="text-slate-400 block text-[8px]">EST. AREA</span>
                <span className="text-white font-bold">14,200 m²</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px]">GROWTH TREND</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +4.2 cm/min
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px]">STATUS</span>
                <span className="text-red-400 font-bold uppercase">EXPANDING</span>
              </div>
            </div>

            <div className="p-2 bg-red-950/30 border border-red-500/30 rounded-lg text-[11px] font-sans text-red-200">
              <strong>RECOMMENDED ACTION:</strong> Keep rescue craft upstream of structural base; monitor water level ({waterLevel.toFixed(1)}m).
            </div>
          </div>
        ))}

        {injectedHazardActive && (
          <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500 space-y-2 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-300 font-bold">
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span>DYNAMIC FLASH HAZARD INJECTED</span>
              </div>
              <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded font-black">
                CRITICAL
              </span>
            </div>
            <p className="text-red-200 font-sans text-xs">
              Primary evacuation road blocked by sudden debris surge. Alternate ridge path computed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
