import React from 'react';
import { useAppStore } from '../store/appStore';
import { Sparkles, HelpCircle, Film } from 'lucide-react';

export const CinematicButtonsPanel: React.FC = () => {
  const {
    explainPanelOpen,
    setExplainPanelOpen,
    setShowMeWhyOpen,
    cinematicTourActive,
    setCinematicTourActive,
    showToast,
  } = useAppStore();

  const handleCinematicTour = () => {
    setCinematicTourActive(true);
    showToast('CINEMATIC TOUR: Initiating 60-second highlight tour across hazard worlds...');
    setTimeout(() => {
      setCinematicTourActive(false);
    }, 60000);
  };

  return (
    <div className="flex items-center gap-2 font-mono-telemetry text-xs pointer-events-auto">
      <button
        onClick={() => setExplainPanelOpen(!explainPanelOpen)}
        className="flex items-center gap-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur transition"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>EXPLAIN RAKSHAAN</span>
      </button>

      <button
        onClick={() => setShowMeWhyOpen(true)}
        className="flex items-center gap-1.5 bg-red-950/80 hover:bg-red-900 border border-red-400 text-red-200 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur transition"
      >
        <HelpCircle className="w-3.5 h-3.5 text-red-400" />
        <span>SHOW ME WHY</span>
      </button>

      <button
        onClick={handleCinematicTour}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur transition border ${
          cinematicTourActive
            ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold animate-pulse'
            : 'bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-amber-500/40'
        }`}
      >
        <Film className="w-3.5 h-3.5 text-amber-400" />
        <span>SHOW ME EVERYTHING</span>
      </button>
    </div>
  );
};
