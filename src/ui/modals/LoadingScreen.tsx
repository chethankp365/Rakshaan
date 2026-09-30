import React, { useEffect, useState } from 'react';
import { Navigation } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 100);
          return 100;
        }
        return p + 20;
      });
    }, 15);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-mono-telemetry">
      <div className="flex flex-col items-center gap-6 max-w-md w-full">
        {/* Animated RAKSHAAN Logo Icon */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/40 animate-ping" />
          <Navigation className="w-10 h-10 text-cyan-400 animate-pulse" />
        </div>

        <div className="text-center space-y-1">
          <h1 className="font-heading text-2xl font-black tracking-widest text-glow-cyan">
            RAKSHAAN 4D
          </h1>
          <p className="text-xs text-cyan-300">
            Autonomous Search & Rescue Drone Platform | SIH 2026
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>INITIALIZING 4D ENGINE...</span>
            <span className="text-cyan-300 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <span className="text-[10px] text-slate-500 uppercase tracking-widest">
          SIMULATED ENVIRONMENT • TEAM ZEROONE
        </span>
      </div>
    </div>
  );
};
