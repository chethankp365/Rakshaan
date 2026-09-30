import React from 'react';
import type { Survivor } from '../sim/types';
import { GlassPanel } from './GlassPanel';
import { AlertTriangle, Flame, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/appStore';

interface SurvivorPriorityCardsProps {
  survivors: Survivor[];
}

export const SurvivorPriorityCards: React.FC<SurvivorPriorityCardsProps> = ({ survivors }) => {
  const { setSelectedSurvivorId } = useAppStore();

  // Sort survivors by urgency score descending
  const sortedSurvivors = [...survivors].sort((a, b) => b.urgencyScore - a.urgencyScore);

  return (
    <div className="w-80 flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
      <div className="flex items-center justify-between text-xs font-heading font-extrabold text-cyan-300 tracking-wider px-1">
        <span>SURVIVOR PRIORITY QUEUE</span>
        <span className="text-[10px] font-mono-telemetry text-slate-400">
          {survivors.length} TARGETS DETECTED
        </span>
      </div>

      {sortedSurvivors.map((s, index) => {
        const isSaveFirst = index === 0;

        return (
          <GlassPanel
            key={s.id}
            className={`p-3 space-y-2 border transition cursor-pointer hover:border-cyan-400 ${
              isSaveFirst
                ? 'border-red-500/70 bg-red-950/20 shadow-red-900/20 shadow-lg'
                : 'border-cyan-500/25 bg-slate-950/60'
            }`}
            onClick={() => {
              setSelectedSurvivorId(s.id);
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-mono-telemetry font-black text-xs text-white">TARGET {s.id}</span>
                <span className="font-sans text-[11px] font-bold text-emerald-400">
                  {s.species || 'Human (Homo Sapiens)'}
                </span>
                <span className="font-mono-telemetry text-[10px] text-amber-300">
                  EST. AGE: {s.estimatedAge || '34 Yrs'}
                </span>
              </div>

              {isSaveFirst ? (
                <span className="bg-red-600 text-white font-mono-telemetry text-[9px] font-black px-2 py-0.5 rounded shadow-lg animate-pulse flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  #1 SAVE FIRST
                </span>
              ) : (
                <span className="bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono-telemetry font-bold px-1.5 py-0.5 rounded uppercase">
                  RANK #{index + 1}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-300 font-sans leading-snug font-medium">
              {s.condition}
            </p>

            <div className="grid grid-cols-2 gap-1.5 font-mono-telemetry text-[10px]">
              <div className="flex items-center gap-1 text-slate-400">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>FLIR: </span>
                <span className="text-amber-300 font-bold">{s.thermalTemp.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <AlertTriangle className="w-3 h-3 text-cyan-400" />
                <span className="truncate">{s.fluidOrHeightHazard}</span>
              </div>
              <div className="text-slate-400">
                <span>CONFIDENCE: </span>
                <span className="text-green-400 font-bold">{((s.confidence ?? 0.94) * 100).toFixed(0)}%</span>
              </div>
              <div className="text-slate-400">
                <span>STATUS: </span>
                <span className={s.status === 'rescued' ? 'text-green-400 font-bold' : 'text-red-400 font-bold uppercase'}>
                  {s.status}
                </span>
              </div>
            </div>

            {/* Urgency Bar */}
            <div className="space-y-1 pt-1 border-t border-slate-800">
              <div className="flex items-center justify-between text-[9px] font-mono-telemetry text-slate-400">
                <span>URGENCY SCORE</span>
                <span className="text-red-400 font-bold">{s.urgencyScore}/10</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isSaveFirst ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${s.urgencyScore * 10}%` }}
                />
              </div>
            </div>
          </GlassPanel>
        );
      })}
    </div>
  );
};
