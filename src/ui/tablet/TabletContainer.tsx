import React from 'react';
import { useAppStore } from '../../store/appStore';
import type { WorldState, TabletTab } from '../../sim/types';

import { TabLiveFeed } from './TabLiveFeed';
import { TabMap } from './TabMap';
import { TabSurvivors } from './TabSurvivors';
import { TabHazards } from './TabHazards';
import { TabDroneStatus } from './TabDroneStatus';
import { TabComms } from './TabComms';
import { TabReport } from './TabReport';

import { Radio, Battery, Minimize2, Video, Map, ShieldAlert, Cpu, MessageSquare, FileText } from 'lucide-react';

interface TabletContainerProps {
  worldState: WorldState;
}

export const TabletContainer: React.FC<TabletContainerProps> = ({ worldState }) => {
  const {
    tabletOpen,
    setTabletOpen,
    activeTabletTab,
    setActiveTabletTab,
    stressCommLoss,
  } = useAppStore();

  const { drone, t } = worldState;

  if (!tabletOpen) return null;

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const tabs: Array<{ id: TabletTab; label: string; icon: React.ReactNode }> = [
    { id: 'live', label: 'LIVE FEED', icon: <Video className="w-3.5 h-3.5" /> },
    { id: 'map', label: 'MAP', icon: <Map className="w-3.5 h-3.5" /> },
    { id: 'survivors', label: 'SURVIVORS', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { id: 'hazards', label: 'HAZARDS', icon: <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> },
    { id: 'drone', label: 'DRONE STATUS', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'comms', label: 'COMMS / ALERTS', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'report', label: 'REPORT', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-40 p-4 md:p-8 bg-slate-950/75 backdrop-blur-md flex items-center justify-center pointer-events-auto animate-in zoom-in-95">
      {/* Rugged Tablet Casing (Orange Bumper Corners + Dark Bezel) */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border-4 border-slate-700 rounded-3xl p-3 shadow-2xl flex flex-col overflow-hidden">
        {/* Rubber Orange Corner Bumper Highlights */}
        <div className="absolute top-0 left-0 w-8 h-8 bg-orange-500 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 bg-orange-500 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-br-2xl pointer-events-none" />

        {/* Camera Dot Top Center */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 rounded-full border border-slate-700 flex items-center justify-center">
          <div className="w-1 h-1 bg-cyan-400 rounded-full" />
        </div>

        {/* Tablet Screen Container */}
        <div className="relative flex-1 bg-slate-950 rounded-2xl border border-cyan-500/30 flex flex-col overflow-hidden">
          {/* Header Bar */}
          <div className="bg-slate-900/90 border-b border-cyan-500/25 px-4 py-2.5 flex items-center justify-between font-mono-telemetry text-xs">
            <div className="flex items-center gap-3">
              <span className="font-heading font-black text-white text-base tracking-widest text-glow-cyan">
                RAKSHAAN COMMAND TABLET
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[9px] px-2 py-0.5 rounded font-bold">
                SIH 2026 | SIMULATED
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Radio className="w-3.5 h-3.5" />
                <span>LINK: <strong className={stressCommLoss ? 'text-red-400 font-bold' : 'text-green-400'}>{drone.commLink}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-green-400 font-bold">
                <Battery className="w-3.5 h-3.5" />
                <span>{drone.battery.toFixed(0)}%</span>
              </div>
              <span className="text-white font-bold">{formatTime(t)}</span>
              <button
                onClick={() => setTabletOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Dock Tablet (Back to Scene)"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Tab View Body */}
          <div className="flex-1 flex overflow-hidden">
            {activeTabletTab === 'live' && <TabLiveFeed worldState={worldState} />}
            {activeTabletTab === 'map' && <TabMap worldState={worldState} />}
            {activeTabletTab === 'survivors' && <TabSurvivors worldState={worldState} />}
            {activeTabletTab === 'hazards' && <TabHazards worldState={worldState} />}
            {activeTabletTab === 'drone' && <TabDroneStatus worldState={worldState} />}
            {activeTabletTab === 'comms' && <TabComms worldState={worldState} />}
            {activeTabletTab === 'report' && <TabReport worldState={worldState} />}
          </div>

          {/* Navigation Tab Bar */}
          <div className="bg-slate-900/90 border-t border-cyan-500/25 px-4 py-2 flex items-center justify-around font-mono-telemetry text-xs">
            {tabs.map((tab) => {
              const isActive = activeTabletTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabletTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl transition font-bold flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white bg-slate-950/40'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
