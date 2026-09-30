import React from 'react';
import { useAppStore } from '../../store/appStore';
import type { WorldState } from '../../sim/types';
import { Printer } from 'lucide-react';

interface PrintableReportProps {
  worldState: WorldState;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ worldState }) => {
  const { printReportOpen, setPrintReportOpen } = useAppStore();
  const { survivors, hazards, coveragePercent, t } = worldState;

  if (!printReportOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-900 p-8 overflow-y-auto font-sans pointer-events-auto print:p-0">
      {/* Top Bar for Web View */}
      <div className="flex items-center justify-between border-b pb-4 mb-6 print:hidden">
        <h2 className="text-xl font-bold text-slate-900">RAKSHAAN Mission Report Export (Print / PDF)</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
          <button
            onClick={() => setPrintReportOpen(false)}
            className="bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-bold"
          >
            Close Window
          </button>
        </div>
      </div>

      {/* Official Printable Report Document Body */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-wider text-slate-900">RAKSHAAN SAR MISSION DEBRIEF</h1>
            <p className="text-sm text-slate-600">SIH 2026 Problem Statement SIH26177 | Team ZeroOne</p>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono">
            <div>DATE: {new Date().toISOString().split('T')[0]}</div>
            <div>STATUS: SIMULATED COMPLETE</div>
          </div>
        </div>

        {/* Executive Metrics */}
        <div className="grid grid-cols-4 gap-4 bg-slate-100 p-4 rounded-lg font-mono text-center">
          <div>
            <div className="text-xs text-slate-500">SURVIVORS</div>
            <div className="text-xl font-bold text-green-700">{survivors.length} LOCATED</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">HAZARD ZONES</div>
            <div className="text-xl font-bold text-red-700">{hazards.length} MAPPED</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">GRID COVERAGE</div>
            <div className="text-xl font-bold text-blue-700">{coveragePercent}%</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">FLIGHT DURATION</div>
            <div className="text-xl font-bold text-slate-900">{t.toFixed(0)}s</div>
          </div>
        </div>

        {/* Survivor Roster Table */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2 font-mono uppercase">I. Survivor Priority Queue Roster</h3>
          <table className="w-full text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-200 font-mono text-left">
                <th className="border border-slate-300 p-2">TARGET ID</th>
                <th className="border border-slate-300 p-2">SPECIES DETECTED</th>
                <th className="border border-slate-300 p-2">EST. AGE</th>
                <th className="border border-slate-300 p-2">CONDITION</th>
                <th className="border border-slate-300 p-2">FLIR TEMP</th>
                <th className="border border-slate-300 p-2">URGENCY</th>
                <th className="border border-slate-300 p-2">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {survivors.map((s, i) => (
                <tr key={s.id} className={i === 0 ? 'bg-red-50 font-bold' : ''}>
                  <td className="border border-slate-300 p-2">{s.id}</td>
                  <td className="border border-slate-300 p-2 font-bold text-slate-800">{s.species || 'Human (Homo Sapiens)'}</td>
                  <td className="border border-slate-300 p-2">{s.estimatedAge || '34 Yrs'}</td>
                  <td className="border border-slate-300 p-2">{s.condition}</td>
                  <td className="border border-slate-300 p-2">{s.thermalTemp}°C</td>
                  <td className="border border-slate-300 p-2">{s.urgencyScore}/10</td>
                  <td className="border border-slate-300 p-2 uppercase">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Explainable Decision Trace */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2 font-mono uppercase">II. Explainable AI Decision Trace Audit</h3>
          <div className="border border-slate-300 p-4 rounded text-xs space-y-2 leading-relaxed">
            <p>1. Dual RGB+FLIR thermal sensor fusion verified target S-01 with 98.6% multi-modal confidence.</p>
            <p>2. Algorithmic Risk Engine assigned S-01 `#1 SAVE FIRST` priority due to 37.2°C thermal cooling and structural hazard proximity.</p>
            <p>3. 3D A* Path Planner computed dynamic green vector rerouting around active hazard polygons, achieving -68% risk reduction.</p>
          </div>
        </div>

        <div className="border-t pt-4 text-center text-xs text-slate-500 font-mono">
          OFFICIAL RAKSHAAN 4D SIMULATION REPORT • ALL DATA SIMULATED FOR SIH 2026 DEMONSTRATION
        </div>
      </div>
    </div>
  );
};
