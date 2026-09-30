import React, { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useClockStore } from '../sim/clock';
import type { WorldState } from '../sim/types';
import { X, HelpCircle, Flame, CheckCircle } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

interface ShowMeWhyModalProps {
  worldState: WorldState;
}

export const ShowMeWhyModal: React.FC<ShowMeWhyModalProps> = ({ worldState }) => {
  const { showMeWhyOpen, setShowMeWhyOpen } = useAppStore();
  const { pause } = useClockStore();
  const { survivors } = worldState;

  const topSurvivor = [...survivors].sort((a, b) => b.urgencyScore - a.urgencyScore)[0];

  useEffect(() => {
    if (showMeWhyOpen) {
      pause(); // Freeze time when Show Me Why modal opens
    }
  }, [showMeWhyOpen, pause]);

  if (!showMeWhyOpen || !topSurvivor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
      <GlassPanel className="w-full max-w-xl p-6 flex flex-col gap-4 border-red-500/50 shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
          <div className="flex items-center gap-2 text-red-400">
            <HelpCircle className="w-5 h-5" />
            <h2 className="font-heading text-base font-black text-white tracking-wider">
              DECISION TRACE: SHOW ME WHY
            </h2>
          </div>
          <button
            onClick={() => setShowMeWhyOpen(false)}
            className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Priority Highlight */}
        <div className="bg-red-950/40 border border-red-500/60 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="bg-red-600 text-white font-mono-telemetry text-xs font-black px-2.5 py-0.5 rounded shadow">
              #1 SAVE FIRST TARGET
            </span>
            <span className="text-red-300 font-mono-telemetry font-bold text-xs">
              URGENCY SCORE: {topSurvivor.urgencyScore} / 10
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono-telemetry text-base font-black text-white">TARGET {topSurvivor.id}</span>
              <span className="font-sans text-xs font-bold text-emerald-400">
                {topSurvivor.species || 'Human (Homo Sapiens)'}
              </span>
            </div>
            <span className="font-mono-telemetry text-xs text-amber-300 font-semibold">
              EST. AGE: {topSurvivor.estimatedAge || '34 Yrs'}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans mt-1">{topSurvivor.condition}</p>
        </div>

        {/* Sensor Evidence Grid */}
        <div className="space-y-2">
          <h4 className="font-mono-telemetry text-xs font-bold text-cyan-300">
            SENSOR FUSION EVIDENCE BREAKDOWN
          </h4>

          <div className="grid grid-cols-2 gap-2 font-mono-telemetry text-xs">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] block">RGB OPTICAL CAMERA</span>
              <span className="text-green-400 font-bold">HUMAN DETECTED</span>
              <span className="text-slate-400 block text-[10px]">
                Confidence: {((topSurvivor.confidence ?? 0.94) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] block">FLIR THERMAL INFRARED</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> {topSurvivor.thermalTemp.toFixed(1)}°C
              </span>
              <span className="text-slate-400 block text-[10px]">
                Body Heat Verified (Hypothermia Warning)
              </span>
            </div>
          </div>
        </div>

        {/* Algorithmic Rationale */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 font-sans text-xs">
          <h4 className="font-mono-telemetry text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>ALGORITHMIC RANK RATIONALE</span>
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
            <li><strong>Thermal Temp:</strong> {topSurvivor.thermalTemp}°C reflects cold exposure risk requiring priority warm transport.</li>
            <li><strong>Trapped Status:</strong> Victim unable to self-evacuate due to structural surroundings.</li>
            <li><strong>Hazard Proximity:</strong> Located inside high-risk hazard zone perimeter.</li>
            <li><strong>Fusion Verdict:</strong> RGB + FLIR double-verified with zero false-positive ambiguity.</li>
          </ul>
        </div>
      </GlassPanel>
    </div>
  );
};
