import React from 'react';
import type { WorldState, Hazard } from '../sim/types';

interface TacticalRadarProps {
  worldState: WorldState;
}

export const TacticalRadar: React.FC<TacticalRadarProps> = ({ worldState }) => {
  const { drone, survivors, responders, hazards } = worldState;

  // Map 3D coordinates [-150, 150] to Radar Canvas 2D [10, 190]
  const mapCoords = (x: number, z: number) => {
    const radarRadius = 90;
    const center = 100;
    const scale = radarRadius / 150;
    const rx = center + (x - drone.position[0]) * scale;
    const ry = center + (z - drone.position[2]) * scale;
    return {
      x: Math.min(190, Math.max(10, rx)),
      y: Math.min(190, Math.max(10, ry)),
    };
  };

  return (
    <div className="relative w-48 h-48 bg-slate-950/85 border border-cyan-500/40 rounded-full shadow-2xl p-2 flex items-center justify-center overflow-hidden backdrop-blur-md">
      {/* Radar Grid Circles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none" stroke="#22D3EE" strokeOpacity="0.2" strokeWidth="1" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#22D3EE" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="30" fill="none" stroke="#22D3EE" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="10" y1="100" x2="190" y2="100" stroke="#22D3EE" strokeOpacity="0.2" strokeWidth="1" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="#22D3EE" strokeOpacity="0.2" strokeWidth="1" />

        {/* 360 Sweep Line */}
        <g className="origin-center animate-[spin_4s_linear_infinite]">
          <line x1="100" y1="100" x2="100" y2="10" stroke="#22D3EE" strokeWidth="2" strokeOpacity="0.8" />
          <path d="M 100 100 L 100 10 A 90 90 0 0 0 36 36 Z" fill="#22D3EE" fillOpacity="0.15" />
        </g>

        {/* Dynamic Position Uncertainty Ellipse (if GPS Loss) */}
        {drone.gpsLossActive && (
          <circle
            cx="100"
            cy="100"
            r={drone.positionUncertainty ? drone.positionUncertainty * 3 : 15}
            fill="#FACC15"
            fillOpacity="0.15"
            stroke="#FACC15"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            className="animate-pulse"
          />
        )}

        {/* Hazards (Red Polygons / Blips) */}
        {hazards.map((h: Hazard) => {
          const pt = mapCoords(h.location[0], h.location[2]);
          return (
            <circle
              key={h.id}
              cx={pt.x}
              cy={pt.y}
              r="6"
              fill="#E63946"
              fillOpacity="0.4"
              stroke="#E63946"
              strokeWidth="1"
            />
          );
        })}

        {/* Responders (Orange Blips) */}
        {responders.map((r) => {
          const pt = mapCoords(r.position[0], r.position[2]);
          return (
            <g key={r.id}>
              <circle cx={pt.x} cy={pt.y} r="4" fill="#FB923C" />
              <circle cx={pt.x} cy={pt.y} r="7" fill="none" stroke="#FB923C" strokeWidth="1" strokeOpacity="0.6" />
            </g>
          );
        })}

        {/* Survivors (Green Blips) */}
        {survivors.map((s, i) => {
          const pt = mapCoords(s.position[0], s.position[2]);
          return (
            <g key={s.id}>
              <circle cx={pt.x} cy={pt.y} r={i === 0 ? '5' : '3.5'} fill={i === 0 ? '#EF4444' : '#22C55E'} className={i === 0 ? 'animate-ping' : ''} />
              <circle cx={pt.x} cy={pt.y} r={i === 0 ? '5' : '3.5'} fill={i === 0 ? '#EF4444' : '#22C55E'} />
            </g>
          );
        })}

        {/* Drone Center Icon (Cyan Cross & Heading Vector) */}
        <g transform={`translate(100, 100) rotate(${(drone.heading * 180) / Math.PI})`}>
          <polygon points="0,-8 5,6 0,3 -5,6" fill="#22D3EE" stroke="#082F49" strokeWidth="1" />
        </g>
      </svg>

      {/* Radar Label */}
      <div className="absolute bottom-2 inset-x-0 text-center font-mono-telemetry text-[9px] text-cyan-300/80 tracking-widest pointer-events-none">
        TACTICAL RADAR 360°
      </div>
    </div>
  );
};
