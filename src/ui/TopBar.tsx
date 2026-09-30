import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import type { CameraViewMode } from '../sim/types';
import { audioEngine } from '../sim/audioEngine';
import {
  ArrowLeft,
  Activity,
  Sparkles,
  Volume2,
  VolumeX,
  Camera,
  Video,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    mode,
    setMode,
    scenario,
    setScenario,
    quality,
    setQuality,
    mute,
    toggleMute,
    fps,
    setFps,
    toastMessage,
    clearToast,
    cameraMode,
    setCameraMode,
    autoDirector,
    toggleAutoDirector,
  } = useAppStore();

  const lowFpsCountRef = useRef(0);

  // Synchronize audio engine mute state
  useEffect(() => {
    audioEngine.init();
    audioEngine.setMute(mute);
  }, [mute]);

  // Keybindings listener for Camera Angles 1 to 8
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const camMap: Record<string, CameraViewMode> = {
        '1': 'chase',
        '2': 'fpv',
        '3': 'thermal',
        '4': 'lidar',
        '5': 'tactical',
        '6': 'orbit',
        '7': 'rescuer',
        '8': 'cinematic',
      };
      if (camMap[key]) {
        setCameraMode(camMap[key], true);
        audioEngine.playBlip(660);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCameraMode]);

  // FPS Monitor and Auto-scaler
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;

    const interval = setInterval(() => {
      const now = performance.now();
      const currentFps = Math.round((frameCount * 1000) / (now - lastTime));
      frameCount = 0;
      lastTime = now;

      if (currentFps > 0) setFps(currentFps);

      if (currentFps < 30 && currentFps > 5) {
        lowFpsCountRef.current += 1;
        if (lowFpsCountRef.current >= 3) {
          lowFpsCountRef.current = 0;
          if (quality === 'high') setQuality('medium');
          else if (quality === 'medium') setQuality('low');
        }
      } else {
        lowFpsCountRef.current = 0;
      }
    }, 1000);

    const handleFrame = () => {
      frameCount++;
      requestAnimationFrame(handleFrame);
    };
    const animId = requestAnimationFrame(handleFrame);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, [quality, setFps, setQuality]);

  const cameraButtons: Array<{ id: CameraViewMode; key: string; label: string }> = [
    { id: 'chase', key: '1', label: 'CHASE' },
    { id: 'fpv', key: '2', label: 'FPV' },
    { id: 'thermal', key: '3', label: 'THERMAL' },
    { id: 'lidar', key: '4', label: 'LIDAR' },
    { id: 'tactical', key: '5', label: 'TACTICAL' },
    { id: 'orbit', key: '6', label: 'ORBIT' },
    { id: 'rescuer', key: '7', label: 'RESCUER' },
    { id: 'cinematic', key: '8', label: 'CINEMATIC' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none p-3 flex flex-col gap-2">
      {toastMessage && (
        <div className="pointer-events-auto self-center bg-cyan-950/95 border border-cyan-400 text-cyan-200 text-xs px-4 py-2 rounded-full shadow-2xl backdrop-blur flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
          <button onClick={clearToast} className="ml-2 font-bold text-cyan-400 hover:text-white">
            ×
          </button>
        </div>
      )}

      {/* Main Glass Header */}
      <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-xl border border-cyan-500/25 rounded-2xl px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-3">
        {/* Left Section: Logo & Back */}
        <div className="flex items-center gap-3">
          {mode !== 'menu' && (
            <button
              onClick={() => setMode('menu')}
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-cyan-950 hover:border-cyan-400 border border-slate-700 text-cyan-300 px-3 py-1.5 rounded-xl text-xs font-heading tracking-wider transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>MENU</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-black text-white tracking-widest text-glow-cyan">
                RAKSHAAN
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[9px] font-mono-telemetry px-2 py-0.5 rounded font-bold">
                4D ENGINE v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Center Section: Scenario Switcher Chips */}
        {mode !== 'menu' && (
          <div className="flex items-center gap-1 bg-slate-950/80 border border-cyan-500/30 p-1 rounded-xl font-mono-telemetry text-xs">
            <button
              onClick={() => setScenario('flood')}
              className={`px-3 py-1 rounded-lg transition font-bold ${
                scenario === 'flood'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              FLOOD ZONE
            </button>
            <button
              onClick={() => setScenario('landslide')}
              className={`px-3 py-1 rounded-lg transition font-bold ${
                scenario === 'landslide'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              LANDSLIDE
            </button>
            <button
              onClick={() => setScenario('cyclone')}
              className={`px-3 py-1 rounded-lg transition font-bold ${
                scenario === 'cyclone'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              CYCLONE
            </button>
          </div>
        )}

        {/* Right Section: Badges & Audio */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 bg-orange-950/70 border border-orange-500/40 text-orange-300 text-[10px] font-mono-telemetry px-2.5 py-1 rounded-lg">
            <span>SIH 2026 | Team ZeroOne</span>
            <span className="bg-orange-500 text-slate-950 px-1 rounded font-bold">
              SIMULATED
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono-telemetry">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className={fps < 30 ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
              {fps} FPS
            </span>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as any)}
              className="bg-transparent text-[10px] text-cyan-300 focus:outline-none cursor-pointer uppercase font-bold"
            >
              <option value="low" className="bg-slate-900 text-white">LOW</option>
              <option value="medium" className="bg-slate-900 text-white">MED</option>
              <option value="high" className="bg-slate-900 text-white">HIGH</option>
            </select>
          </div>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/80 text-slate-400 hover:text-cyan-300 transition"
            title={mute ? 'Unmute Sound' : 'Mute Sound'}
          >
            {mute ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Sub-Header: Camera Switcher Bar (1-8 + Auto Director) */}
      {mode !== 'menu' && (
        <div className="pointer-events-auto self-center bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 font-mono-telemetry text-[11px]">
          <div className="flex items-center gap-1 text-slate-400 pr-2 border-r border-slate-800">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold">CAM:</span>
          </div>

          {cameraButtons.map((btn) => {
            const isActive = cameraMode === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setCameraMode(btn.id, true)}
                className={`px-2 py-0.5 rounded transition flex items-center gap-1 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-950/50'
                }`}
                title={`Press Key ${btn.key} for ${btn.label}`}
              >
                <span className="text-[9px] opacity-75">{btn.key}:</span>
                <span>{btn.label}</span>
              </button>
            );
          })}

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Auto Director Toggle */}
          <button
            onClick={toggleAutoDirector}
            className={`px-2.5 py-0.5 rounded font-bold transition flex items-center gap-1.5 ${
              autoDirector
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md animate-pulse'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-700'
            }`}
            title="Auto Director automatically switches cameras according to mission step"
          >
            <Video className="w-3 h-3" />
            <span>AUTO DIRECTOR: {autoDirector ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
