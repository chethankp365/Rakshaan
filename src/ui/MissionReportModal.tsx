import React from 'react';
import type { WorldState } from '../sim/types';
import { GlassPanel } from './GlassPanel';
import { Award, FileText, RotateCcw } from 'lucide-react';
import { useClockStore } from '../sim/clock';

interface MissionReportModalProps {
  worldState: WorldState;
  onClose: () => void;
}

export const MissionReportModal: React.FC<MissionReportModalProps> = ({ worldState, onClose }) => {
  const { reset } = useClockStore();
  const { survivors, hazards, coveragePercent, drone } = worldState;

  const locatedCount = survivors.filter((s) => s.status === 'located' || s.status === 'rescued' || s.status === 'critical').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl pointer-events-auto">
      <GlassPanel className="w-full max-w-2xl p-6 flex flex-col gap-5 border-green-500/50 shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-green-500/30 pb-3">
          <div className="flex items-center gap-2 text-green-400">
            <Award className="w-6 h-6" />
            <div>
              <h2 className="font-heading text-lg font-black text-white tracking-wider">
                MISSION DEBRIEF & INTELLIGENCE REPORT
              </h2>
              <p className="text-[10px] font-mono-telemetry text-cyan-300">
                AUTONOMOUS SAR PLATFORM RAKSHAAN-SAR-01 | COMPLETE
              </p>
            </div>
          </div>
          <span className="bg-green-500 text-slate-950 font-mono-telemetry text-xs font-black px-3 py-1 rounded-full uppercase">
            PASSED 100%
          </span>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-4 gap-3 font-mono-telemetry">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 text-[9px] block">SURVIVORS LOCATED</span>
            <span className="text-green-400 text-xl font-bold">{locatedCount} / {survivors.length}</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 text-[9px] block">HAZARDS MAPPED</span>
            <span className="text-red-400 text-xl font-bold">{hazards.length} ZONES</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 text-[9px] block">AREA COVERAGE</span>
            <span className="text-cyan-300 text-xl font-bold">{coveragePercent}%</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 text-[9px] block">BATTERY REMAINING</span>
            <span className="text-white text-xl font-bold">{drone.battery.toFixed(0)}%</span>
          </div>
        </div>

        {/* Decision Trace Summary */}
        <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <h4 className="font-mono-telemetry text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>EXPLAINABLE DECISION TRACE SUMMARY</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            The mission executed all 12 autonomous flight & sensor fusion steps. Target S-01 was verified via RGB+FLIR thermal fusion with 98.6% confidence and assigned top priority due to hypothermia trends. NDRF ground squad was dispatched along safe alternate evacuation routes.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REPLAY SIMULATION</span>
          </button>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl text-xs transition"
          >
            DISMISS REPORT
          </button>
        </div>
      </GlassPanel>
    </div>
  );
};
