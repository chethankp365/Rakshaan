import React from 'react';
import { useClockStore } from '../sim/clock';
import type { PlaybackSpeed } from '../sim/clock';
import { MISSION_STEPS } from '../config/mission';
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { GlassPanel } from './GlassPanel';

export const TimelineBar: React.FC = () => {
  const {
    t,
    maxT,
    isPlaying,
    speed,
    isLooping,
    togglePlay,
    setSpeed,
    seek,
    setLooping,
    reset,
  } = useClockStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStep = MISSION_STEPS.find((s) => t >= s.startTime && t < s.endTime) || MISSION_STEPS[0];

  const handlePrevEvent = () => {
    const prevSteps = MISSION_STEPS.filter((s) => s.startTime < t - 1);
    if (prevSteps.length > 0) {
      seek(prevSteps[prevSteps.length - 1].startTime);
    } else {
      seek(0);
    }
  };

  const handleNextEvent = () => {
    const nextStep = MISSION_STEPS.find((s) => s.startTime > t + 1);
    if (nextStep) {
      seek(nextStep.startTime);
    } else {
      seek(maxT);
    }
  };

  return (
    <GlassPanel className="p-3 w-full max-w-4xl backdrop-blur-2xl border border-cyan-500/30 flex flex-col gap-2">
      {/* 12-Step Indicator Banner */}
      <div className="flex items-center justify-between text-[11px] font-mono-telemetry border-b border-cyan-500/20 pb-1.5">
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500 text-slate-950 px-2 py-0.5 rounded font-black text-xs">
            STEP {currentStep.code}
          </span>
          <span className="font-heading font-black text-white text-xs tracking-wide">
            {currentStep.title.toUpperCase()}
          </span>
        </div>
        <span className="text-cyan-300 font-bold hidden sm:block">
          {currentStep.hudBanner}
        </span>
      </div>

      {/* Main Scrubber Slider with Step Markers */}
      <div className="relative flex items-center gap-3">
        <span className="font-mono-telemetry text-xs text-cyan-300 font-bold w-12 text-right shrink-0">
          {formatTime(t)}
        </span>

        <div className="relative flex-1 flex items-center">
          {/* Step markers overlay on track */}
          <div className="absolute inset-x-0 h-1.5 top-1/2 -translate-y-1/2 pointer-events-none flex">
            {MISSION_STEPS.map((step) => {
              const widthPct = ((step.endTime - step.startTime) / maxT) * 100;
              const isActive = t >= step.startTime && t < step.endTime;
              return (
                <div
                  key={step.id}
                  className={`h-full border-r border-slate-950 transition ${
                    isActive ? 'bg-cyan-400' : 'bg-cyan-950/70'
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
              );
            })}
          </div>

          <input
            type="range"
            min="0"
            max={maxT}
            step="0.1"
            value={t}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-full h-2 bg-transparent appearance-none cursor-pointer relative z-10 accent-cyan-400"
          />
        </div>

        <span className="font-mono-telemetry text-xs text-slate-400 w-12 shrink-0">
          {formatTime(maxT)}
        </span>
      </div>

      {/* Playback Controls & Speed Buttons */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold p-1.5 rounded-lg transition shadow-lg shadow-cyan-500/30"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <button
            onClick={reset}
            className="bg-slate-900/80 hover:bg-slate-800 text-cyan-300 p-1.5 rounded-lg border border-slate-700 transition"
            title="Replay Timeline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setLooping(!isLooping)}
            className={`p-1.5 rounded-lg border transition ${
              isLooping
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
            title={isLooping ? 'Loop Enabled' : 'Loop Disabled'}
          >
            <Repeat className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={handlePrevEvent}
            className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 p-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1 font-mono-telemetry text-[10px]"
            title="Jump to Previous Event"
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PREV</span>
          </button>

          <button
            onClick={handleNextEvent}
            className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 p-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1 font-mono-telemetry text-[10px]"
            title="Jump to Next Event"
          >
            <span className="hidden sm:inline">NEXT</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-lg">
          {([0.25, 0.5, 1, 2, 4] as PlaybackSpeed[]).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`font-mono-telemetry text-[10px] px-2 py-0.5 rounded transition ${
                speed === s
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
};
