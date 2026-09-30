import React, { useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { X, Keyboard } from 'lucide-react';
import { GlassPanel } from '../GlassPanel';

export const ShortcutsModal: React.FC = () => {
  const { shortcutsModalOpen, setShortcutsModalOpen } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?') {
        setShortcutsModalOpen(!shortcutsModalOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcutsModalOpen, setShortcutsModalOpen]);

  if (!shortcutsModalOpen) return null;

  const shortcuts = [
    { key: '1 - 8', desc: 'Switch Drone Camera Angles (Chase, FPV, Thermal, LiDAR, Tactical, Orbit, Rescuer, Cinematic)' },
    { key: '1 - 5 (Mode B)', desc: 'Switch Rescue Scene Cameras (Wide, Shoulder Tablet, Hero Beam, Ground Evac, Tactical)' },
    { key: 'T', desc: 'Pick Up / Dock Command Tablet (Mode B)' },
    { key: 'Space', desc: 'Play / Pause Simulation Clock' },
    { key: '?', desc: 'Toggle Keyboard Shortcuts Modal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
      <GlassPanel className="w-full max-w-lg p-6 flex flex-col gap-4 border-cyan-500/50 shadow-2xl animate-in zoom-in-95 font-mono-telemetry text-xs">
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <div className="flex items-center gap-2 text-cyan-300">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h2 className="font-heading text-base font-black text-white tracking-wider">
              KEYBOARD SHORTCUTS
            </h2>
          </div>
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-black text-xs">
                {sc.key}
              </span>
              <span className="text-slate-300 font-sans text-xs">{sc.desc}</span>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
};
