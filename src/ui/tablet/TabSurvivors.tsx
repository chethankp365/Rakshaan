import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import type { WorldState } from '../../sim/types';
import { ShieldAlert, Flame, ChevronDown, ChevronUp, CheckCircle, Send } from 'lucide-react';

interface TabSurvivorsProps {
  worldState: WorldState;
}

export const TabSurvivors: React.FC<TabSurvivorsProps> = ({ worldState }) => {
  const {
    dispatchResponderToSurvivor,
    dispatchedMap,
    setSelectedSurvivorId,
    setShowMeWhyOpen,
  } = useAppStore();

  const { survivors } = worldState;
  const [expandedWhyId, setExpandedWhyId] = useState<string | null>(null);

  const sortedSurvivors = [...survivors].sort((a, b) => b.urgencyScore - a.urgencyScore);

  return (
    <div className="flex-1 flex flex-col gap-3 p-3 font-mono-telemetry text-xs overflow-y-auto">
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
        <h3 className="font-heading font-extrabold text-cyan-300 text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          SURVIVOR DISPATCH & PRIORITY MATRIX
        </h3>
        <span className="text-[10px] text-slate-400">
          TOTAL DETECTED: <strong className="text-white">{survivors.length}</strong>
        </span>
      </div>

      <div className="space-y-3">
        {sortedSurvivors.map((s, idx) => {
          const isSaveFirst = idx === 0;
          const isDispatched = dispatchedMap[s.id] || s.status === 'rescued' || s.status === 'located';
          const isExpandedWhy = expandedWhyId === s.id;

          return (
            <div
              key={s.id}
              className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                isSaveFirst
                  ? 'bg-red-950/30 border-red-500/80 shadow-lg shadow-red-900/20'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-white">TARGET {s.id}</span>
                  <div>
                    <h4 className="font-heading font-extrabold text-emerald-400 text-xs">
                      {s.species || 'Human (Homo Sapiens)'}
                    </h4>
                    <span className="text-[10px] text-amber-300 font-mono block">
                      EST. AGE: {s.estimatedAge || '34 Yrs'} • {s.locationDescription}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSaveFirst && (
                    <span className="bg-red-600 text-white font-mono-telemetry text-[9px] font-black px-2.5 py-0.5 rounded animate-pulse">
                      #1 SAVE FIRST
                    </span>
                  )}
                  <span className="bg-slate-900 text-cyan-400 border border-cyan-500/30 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                    RANK #{idx + 1}
                  </span>
                </div>
              </div>

              <p className="text-slate-300 font-sans text-xs">{s.condition}</p>

              {/* Data Grid */}
              <div className="grid grid-cols-4 gap-2 bg-slate-900/90 p-2 rounded-lg text-[10px]">
                <div>
                  <span className="text-slate-400 block text-[8px]">FLIR HEAT</span>
                  <span className="text-amber-400 font-bold flex items-center gap-0.5">
                    <Flame className="w-3 h-3" /> {s.thermalTemp}°C
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px]">CONFIDENCE</span>
                  <span className="text-green-400 font-bold">{((s.confidence ?? 0.94) * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px]">HAZARD RISK</span>
                  <span className="text-cyan-300 font-bold truncate">{s.fluidOrHeightHazard}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px]">DISPATCH STATUS</span>
                  <span className={s.status === 'rescued' ? 'text-green-400 font-bold' : 'text-orange-400 font-bold uppercase'}>
                    {isDispatched ? 'DISPATCHED / EN ROUTE' : s.status}
                  </span>
                </div>
              </div>

              {/* Urgency Score Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] text-slate-400">
                  <span>URGENCY MATRIX SCORE</span>
                  <span className="text-red-400 font-bold">{s.urgencyScore} / 10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isSaveFirst ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-cyan-400'}`}
                    style={{ width: `${s.urgencyScore * 10}%` }}
                  />
                </div>
              </div>

              {/* Expandable Why This Rank */}
              <div className="pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => setExpandedWhyId(isExpandedWhy ? null : s.id)}
                  className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1 font-bold"
                >
                  {isExpandedWhy ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>WHY THIS RANK? (EVIDENCE TRACE)</span>
                </button>

                {isExpandedWhy && (
                  <div className="mt-2 p-2.5 bg-slate-950 rounded-lg text-[10px] text-slate-300 font-sans space-y-1 border border-slate-800">
                    <div><strong>Thermal Temp:</strong> {s.thermalTemp}°C indicates body cooling trend.</div>
                    <div><strong>Trapped State:</strong> Surrounded by structural/fluid hazard boundaries.</div>
                    <div><strong>Urgency:</strong> Calculated at {s.urgencyScore}/10 priority by Risk Engine.</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    setSelectedSurvivorId(s.id);
                    if (isSaveFirst) setShowMeWhyOpen(true);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                >
                  VIEW ON MAP
                </button>

                <button
                  onClick={() => dispatchResponderToSurvivor(s.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-1.5 transition ${
                    isDispatched
                      ? 'bg-green-600 text-white cursor-default'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-slate-950 shadow-lg'
                  }`}
                >
                  {isDispatched ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>TEAM DISPATCHED (ETA 2.5m)</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>DISPATCH RESCUE TEAM</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
