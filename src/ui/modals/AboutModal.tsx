import React from 'react';
import { useAppStore } from '../../store/appStore';
import { X, Cpu, Info, ShieldCheck, BookOpen } from 'lucide-react';
import { GlassPanel } from '../GlassPanel';

export const AboutModal: React.FC = () => {
  const { aboutModalOpen, setAboutModalOpen } = useAppStore();

  if (!aboutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
      <GlassPanel className="w-full max-w-2xl p-6 flex flex-col gap-4 border-cyan-500/50 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto font-mono-telemetry text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <div className="flex items-center gap-2 text-cyan-300">
            <Info className="w-5 h-5 text-cyan-400" />
            <h2 className="font-heading text-base font-black text-white tracking-wider">
              ABOUT RAKSHAAN 4D SIMULATION
            </h2>
          </div>
          <button
            onClick={() => setAboutModalOpen(false)}
            className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Metadata */}
        <div className="grid grid-cols-3 gap-2 text-center bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-400 text-[9px] block">PROBLEM STATEMENT</span>
            <span className="text-cyan-300 font-bold">SIH26177</span>
          </div>
          <div>
            <span className="text-slate-400 text-[9px] block">TEAM</span>
            <span className="text-orange-400 font-bold">Team ZeroOne</span>
          </div>
          <div>
            <span className="text-slate-400 text-[9px] block">PLATFORM</span>
            <span className="text-green-400 font-bold">RAKSHAAN SAR v2.0</span>
          </div>
        </div>

        {/* AI Pipeline Diagram */}
        <div className="space-y-2 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 font-sans">
          <h3 className="font-mono-telemetry font-extrabold text-cyan-300 text-xs flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" /> SENSOR & AI PIPELINE ARCHITECTURE
          </h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            <strong>Sensors</strong> (RGB 4K + FLIR Thermal + LiDAR) ➔ <strong>Perception</strong> (YOLOv8 NPU) ➔ <strong>Sensor Fusion</strong> (Multi-modal Verification) ➔ <strong>Geo-tagging</strong> (RTK GPS) ➔ <strong>Risk Assessment</strong> (Urgency Score Engine) ➔ <strong>Mission Intelligence</strong> (3D A* Replanner) ➔ <strong>Action</strong> (Autonomous Dispatch).
          </p>
        </div>

        {/* Deck References */}
        <div className="space-y-2 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 font-sans">
          <h3 className="font-mono-telemetry font-extrabold text-cyan-300 text-xs flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-400" /> DECK REFERENCES & STANDARDS
          </h3>
          <ul className="list-disc list-inside text-slate-300 text-xs space-y-1">
            <li>NDRF Standard Search & Rescue Guidelines (SOP-SAR-2024)</li>
            <li>IEEE Trans. Robotics: Autonomous Multi-Modal Sensor Fusion for Disaster Response</li>
            <li>ISO 21384-3: Unmanned Aircraft Systems Operational Procedures</li>
            <li>SIH 2026 SIH26177 Disaster Management Specification</li>
          </ul>
        </div>

        {/* Simulated Data Notice */}
        <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-[11px] text-cyan-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>SIMULATED DATA NOTICE:</strong> All telemetry, thermal temperatures, survivor coordinates, and sensor streams are 100% deterministically simulated in code for demonstration purposes.
          </span>
        </div>
      </GlassPanel>
    </div>
  );
};
