import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import type { WorldState } from '../../sim/types';
import { Radio, CheckCircle, Send } from 'lucide-react';

interface TabCommsProps {
  worldState: WorldState;
}

export const TabComms: React.FC<TabCommsProps> = ({ worldState }) => {
  const { acknowledgeAlert, acknowledgedAlerts, showToast } = useAppStore();
  const { activeEvents } = worldState;
  const [customMsg, setCustomMsg] = useState('');

  const quickCommands = [
    'Hold position and hover',
    'Return home to base (RTH)',
    'Investigate Target S-02',
    'Increase search area radius',
  ];

  const handleSendCommand = (cmd: string) => {
    showToast(`COMMAND SENT TO DRONE: "${cmd}"`);
    setCustomMsg('');
  };

  return (
    <div className="flex-1 flex flex-col gap-3 p-3 font-mono-telemetry text-xs overflow-hidden">
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
        <h3 className="font-heading font-extrabold text-cyan-300 text-sm flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          TACTICAL COMMS & ALERT DISPATCH STREAM
        </h3>
        <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
          915MHz DUAL DATALINK
        </span>
      </div>

      {/* Chronological Alert Feed */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {activeEvents.map((evt, idx) => {
          const alertId = `evt-${idx}`;
          const isAcked = acknowledgedAlerts[alertId];

          let borderCol = 'border-cyan-500/40 bg-slate-950/80';
          if (evt.type === 'DISCOVERY') borderCol = 'border-green-500/60 bg-green-950/20';
          if (evt.type === 'HAZARD_ALERT') borderCol = 'border-red-500/60 bg-red-950/20';
          if (evt.type === 'RESCUE_DISPATCH') borderCol = 'border-orange-500/60 bg-orange-950/20';

          return (
            <div key={idx} className={`p-3 rounded-xl border ${borderCol} flex items-start justify-between gap-3`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <span className="text-cyan-400">[t={evt.t.toFixed(0)}s]</span>
                  <span className="text-white">{evt.payload.title}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs">{evt.payload.description}</p>
              </div>

              <button
                onClick={() => acknowledgeAlert(alertId)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition flex items-center gap-1 ${
                  isAcked
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                <CheckCircle className="w-3 h-3" />
                <span>{isAcked ? 'ACKNOWLEDGED' : 'ACKNOWLEDGE'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Commands & Custom Message Composer */}
      <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-500/30 space-y-2">
        <span className="text-[10px] text-slate-400 font-bold block">QUICK COMMANDS TO DRONE:</span>
        <div className="flex flex-wrap gap-1.5">
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleSendCommand(cmd)}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-cyan-950 hover:border-cyan-400 border border-slate-700 text-cyan-300 text-[10px] transition font-bold"
            >
              {cmd}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Type custom autonomous flight command..."
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => handleSendCommand(customMsg || 'Hold hover')}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg transition flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>SEND</span>
          </button>
        </div>
      </div>
    </div>
  );
};
