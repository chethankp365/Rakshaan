import React, { useRef, useEffect } from 'react';
import type { MissionEvent } from '../sim/types';
import { GlassPanel } from './GlassPanel';
import { Terminal } from 'lucide-react';

interface EventTracePanelProps {
  events: MissionEvent[];
  currentTime: number;
}

export const EventTracePanel: React.FC<EventTracePanelProps> = ({ events, currentTime }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [events.length, currentTime]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `[${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}]`;
  };

  return (
    <GlassPanel className="w-80 p-3 flex flex-col gap-2 max-h-56 backdrop-blur-xl border border-cyan-500/30">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
        <div className="flex items-center gap-1.5 text-cyan-300 font-heading text-xs font-bold tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>MISSION EVENT TRACE</span>
        </div>
        <span className="text-[9px] font-mono-telemetry bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/30 animate-pulse">
          LIVE LOG
        </span>
      </div>

      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-auto space-y-1.5 font-mono-telemetry text-[10px] pr-1 scrollbar-thin scrollbar-thumb-cyan-500/30"
      >
        {events.length === 0 ? (
          <div className="text-slate-500 italic py-2 text-center">Initializing sensor stream telemetry...</div>
        ) : (
          events.map((evt, idx) => {
            let color = 'text-slate-300 border-l-2 border-cyan-400 pl-1.5';
            if (evt.type === 'DISCOVERY') color = 'text-green-300 border-l-2 border-green-500 bg-green-950/20 pl-1.5';
            if (evt.type === 'HAZARD_ALERT') color = 'text-red-300 border-l-2 border-red-500 bg-red-950/20 pl-1.5';
            if (evt.type === 'RESCUE_DISPATCH') color = 'text-orange-300 border-l-2 border-orange-500 bg-orange-950/20 pl-1.5';
            if (evt.type === 'GPS_LOSS' || evt.type === 'COMM_DROP') color = 'text-amber-300 border-l-2 border-amber-500 bg-amber-950/20 pl-1.5';

            return (
              <div key={idx} className={`${color} py-1 transition-all rounded-r`}>
                <span className="text-cyan-400 font-bold mr-1.5">{formatTime(evt.t)}</span>
                <span className="font-bold tracking-wide">{evt.payload.title}: </span>
                <span className="opacity-90">{evt.payload.description}</span>
              </div>
            );
          })
        )}
      </div>
    </GlassPanel>
  );
};
