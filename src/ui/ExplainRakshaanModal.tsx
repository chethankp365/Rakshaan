import React from 'react';
import { useAppStore } from '../store/appStore';
import type { WorldState } from '../sim/types';
import { X, Sparkles, ChevronRight, Cpu } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

interface ExplainRakshaanModalProps {
  worldState: WorldState;
}

const PIPELINE_STAGES = [
  'Sensors',
  'Perception',
  'Sensor Fusion',
  'Geo-tagging',
  'Risk Assessment',
  'Mission Intelligence',
  'Action',
] as const;

export const ExplainRakshaanModal: React.FC<ExplainRakshaanModalProps> = ({ worldState }) => {
  const { explainPanelOpen, setExplainPanelOpen } = useAppStore();
  const { currentStep } = worldState;

  if (!explainPanelOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md p-4 pointer-events-auto flex items-center">
      <GlassPanel className="w-full h-full p-6 flex flex-col gap-5 backdrop-blur-2xl border-cyan-400/50 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="font-heading text-base font-black text-white tracking-wider">
              EXPLAIN RAKSHAAN AI
            </h2>
          </div>
          <button
            onClick={() => setExplainPanelOpen(false)}
            className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Banner */}
        <div className="bg-cyan-950/80 border border-cyan-500/40 p-3 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-telemetry text-cyan-400 font-bold">
              STEP {currentStep.code} OF 12
            </span>
            <span className="text-[9px] font-mono-telemetry bg-cyan-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase">
              ACTIVE STAGE: {currentStep.pipelineStage}
            </span>
          </div>
          <h3 className="font-heading font-extrabold text-white text-sm">
            {currentStep.title}
          </h3>
        </div>

        {/* Plain English Explanation Narrative */}
        <div className="space-y-2">
          <h4 className="font-mono-telemetry text-xs font-bold text-cyan-300">
            PLAIN ENGLISH EXPLANATION
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            {currentStep.explanationText}
          </p>
        </div>

        {/* 7-Stage Pipeline Diagram */}
        <div className="space-y-2">
          <h4 className="font-mono-telemetry text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>AUTONOMY PIPELINE FLOW</span>
          </h4>

          <div className="space-y-1.5 font-mono-telemetry text-xs">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isActive = currentStep.pipelineStage === stage;
              return (
                <div
                  key={stage}
                  className={`p-2.5 rounded-lg border transition flex items-center justify-between ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="opacity-75 text-[10px]">0{idx + 1}.</span>
                    <span>{stage}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 animate-pulse" />}
                </div>
              );
            })}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};
