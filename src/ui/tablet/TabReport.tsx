import React from 'react';
import { useAppStore } from '../../store/appStore';
import type { WorldState } from '../../sim/types';
import { FileText, Printer, Award } from 'lucide-react';

interface TabReportProps {
  worldState: WorldState;
}

export const TabReport: React.FC<TabReportProps> = ({ worldState }) => {
  const { setPrintReportOpen } = useAppStore();
  const { survivors, hazards, coveragePercent, t } = worldState;

  const locatedCount = survivors.filter((s) => s.status === 'located' || s.status === 'rescued' || s.status === 'critical').length;

  return (
    <div className="flex-1 flex flex-col gap-3 p-3 font-mono-telemetry text-xs overflow-y-auto">
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
        <h3 className="font-heading font-extrabold text-cyan-300 text-sm flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          LIVE MISSION INTELLIGENCE REPORT
        </h3>
        <button
          onClick={() => setPrintReportOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>EXPORT REPORT (PRINT / PDF)</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-4 gap-2.5">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-slate-400 text-[9px] block">SURVIVORS LOCATED</span>
          <span className="text-green-400 text-xl font-bold">{locatedCount} / {survivors.length}</span>
        </div>
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-slate-400 text-[9px] block">HAZARDS MAPPED</span>
          <span className="text-red-400 text-xl font-bold">{hazards.length} ZONES</span>
        </div>
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-slate-400 text-[9px] block">GRID COVERAGE</span>
          <span className="text-cyan-300 text-xl font-bold">{coveragePercent}%</span>
        </div>
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-slate-400 text-[9px] block">FLIGHT TIME</span>
          <span className="text-white text-xl font-bold">{t.toFixed(0)}s</span>
        </div>
      </div>

      {/* Decision Trace Breakdown */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 font-sans">
        <h4 className="font-mono-telemetry text-xs font-bold text-cyan-300 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>EXPLAINABLE DECISION TRACE AUDIT</span>
        </h4>
        <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-xs leading-relaxed">
          <li><strong>Disaster Sector Scan:</strong> RAKSHAAN drone completed autonomous lawnmower grid search pattern over 800m hazard zone.</li>
          <li><strong>Sensor Fusion Verification:</strong> Target S-01 verified via RGB optical silhouette + FLIR thermal body heat signature (37.2°C) with 98.6% confidence.</li>
          <li><strong>Urgency Priority Decision:</strong> S-01 ranked `#1 SAVE FIRST` due to hypothermia risk and structural proximity.</li>
          <li><strong>Dynamic Route Replanning:</strong> Primary path blocked by dynamic hazard; 3D A* planner rerouted green vector path with -68% risk reduction.</li>
        </ul>
      </div>
    </div>
  );
};
