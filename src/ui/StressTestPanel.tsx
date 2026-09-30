import React from 'react';
import { useAppStore } from '../store/appStore';
import { GlassPanel } from './GlassPanel';
import { Zap, WifiOff, AlertTriangle, BatteryLow } from 'lucide-react';

export const StressTestPanel: React.FC = () => {
  const {
    stressGpsLoss,
    stressCommLoss,
    stressHazardInject,
    stressLowBattery,
    toggleStressGpsLoss,
    toggleStressCommLoss,
    toggleStressHazardInject,
    toggleStressLowBattery,
  } = useAppStore();

  return (
    <GlassPanel className="w-80 p-3 space-y-2 backdrop-blur-xl border border-amber-500/30">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-1.5">
        <div className="flex items-center gap-1.5 text-amber-300 font-heading font-extrabold text-xs tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>AUTONOMY STRESS TEST</span>
        </div>
        <span className="text-[9px] font-mono-telemetry bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
          FAILSAFE SIM
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 font-mono-telemetry text-[10px]">
        <button
          onClick={toggleStressGpsLoss}
          className={`p-2 rounded border flex items-center justify-center gap-1.5 font-bold transition ${
            stressGpsLoss
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg animate-pulse'
              : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-400 hover:text-white'
          }`}
        >
          <WifiOff className="w-3 h-3" />
          <span>INJECT GPS LOSS</span>
        </button>

        <button
          onClick={toggleStressCommLoss}
          className={`p-2 rounded border flex items-center justify-center gap-1.5 font-bold transition ${
            stressCommLoss
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg animate-pulse'
              : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-400 hover:text-white'
          }`}
        >
          <WifiOff className="w-3 h-3" />
          <span>INJECT COMM LOSS</span>
        </button>

        <button
          onClick={toggleStressHazardInject}
          className={`p-2 rounded border flex items-center justify-center gap-1.5 font-bold transition ${
            stressHazardInject
              ? 'bg-red-600 text-white border-red-400 shadow-lg animate-pulse'
              : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-red-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3 h-3" />
          <span>INJECT HAZARD</span>
        </button>

        <button
          onClick={toggleStressLowBattery}
          className={`p-2 rounded border flex items-center justify-center gap-1.5 font-bold transition ${
            stressLowBattery
              ? 'bg-red-600 text-white border-red-400 shadow-lg animate-pulse'
              : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-red-400 hover:text-white'
          }`}
        >
          <BatteryLow className="w-3 h-3" />
          <span>LOW BATTERY</span>
        </button>
      </div>
    </GlassPanel>
  );
};
