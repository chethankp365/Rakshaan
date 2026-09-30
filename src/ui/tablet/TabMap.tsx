import React, { useState } from 'react';
import type { WorldState } from '../../sim/types';
import { Compass, ZoomIn, ZoomOut, Navigation } from 'lucide-react';

interface TabMapProps {
  worldState: WorldState;
}

export const TabMap: React.FC<TabMapProps> = ({ worldState }) => {
  const { drone, survivors, responders, hazards, coveragePercent, replannedRoute } = worldState;
  const [zoom, setZoom] = useState(1.0);
  const [showHazards, setShowHazards] = useState(true);
  const [showCoverage, setShowCoverage] = useState(true);

  // Map 3D coords [-150, 150] to 2D SVG Viewbox [20, 380]
  const mapPt = (x: number, z: number) => {
    const scale = 1.2 * zoom;
    const cx = 200 + (x * scale);
    const cy = 200 + (z * scale);
    return { x: cx, y: cy };
  };

  return (
    <div className="flex-1 flex flex-col gap-2 p-3 font-mono-telemetry text-xs overflow-hidden">
      {/* Map Control Bar */}
      <div className="flex items-center justify-between bg-slate-950/80 p-2 rounded-xl border border-cyan-500/30">
        <div className="flex items-center gap-2">
          <span className="font-bold text-cyan-300 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5" /> 2D COMMAND TACTICAL MAP
          </span>
          <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
            SCALE 1:500m
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            onClick={() => setShowHazards(!showHazards)}
            className={`px-2.5 py-1 rounded font-bold border transition ${
              showHazards ? 'bg-red-950 text-red-300 border-red-500' : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            HAZARD LAYER
          </button>
          <button
            onClick={() => setShowCoverage(!showCoverage)}
            className={`px-2.5 py-1 rounded font-bold border transition ${
              showCoverage ? 'bg-cyan-950 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            COVERAGE ({coveragePercent}%)
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button
            onClick={() => setZoom((z) => Math.min(2.0, z + 0.2))}
            className="p-1.5 bg-slate-900 text-cyan-300 hover:text-white rounded border border-slate-700"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
            className="p-1.5 bg-slate-900 text-cyan-300 hover:text-white rounded border border-slate-700"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative flex-1 bg-slate-950 rounded-xl border border-cyan-500/30 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          {/* Grid lines */}
          <defs>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="400" height="400" fill="#090D16" />
          <rect width="400" height="400" fill="url(#gridPattern)" />

          {/* Coverage Grid Overlay */}
          {showCoverage && (
            <rect
              x="50"
              y="50"
              width="300"
              height="300"
              fill="#22D3EE"
              fillOpacity={0.08 * (coveragePercent / 100)}
              stroke="#22D3EE"
              strokeOpacity="0.2"
              strokeDasharray="4 4"
            />
          )}

          {/* Water River Bed */}
          <path d="M 0 100 Q 150 180 400 120 L 400 240 Q 150 300 0 220 Z" fill="#0284C7" fillOpacity="0.25" />

          {/* Roads */}
          <path d="M 20 380 L 180 200 L 380 40" stroke="#475569" strokeWidth="6" fill="none" />

          {/* Blocked Road X Marker */}
          <g transform="translate(180, 200)">
            <circle r="12" fill="#DC2626" fillOpacity="0.6" />
            <line x1="-8" y1="-8" x2="8" y2="8" stroke="#FFFFFF" strokeWidth="2.5" />
            <line x1="8" y1="-8" x2="-8" y2="8" stroke="#FFFFFF" strokeWidth="2.5" />
          </g>

          {/* Green Evacuation Vector Route */}
          {replannedRoute && (
            <polyline
              points={replannedRoute.map((p) => {
                const pt = mapPt(p[0], p[2]);
                return `${pt.x},${pt.y}`;
              }).join(' ')}
              fill="none"
              stroke="#22C55E"
              strokeWidth="3.5"
              strokeDasharray="6 3"
            />
          )}

          {/* Hazard Polygons */}
          {showHazards &&
            hazards.map((h) => {
              const pt = mapPt(h.location[0], h.location[2]);
              return (
                <g key={h.id}>
                  <circle cx={pt.x} cy={pt.y} r="32" fill={h.color} fillOpacity="0.2" stroke={h.color} strokeWidth="1.5" />
                  <text x={pt.x} y={pt.y} fill="#F8FAFC" fontSize="8" textAnchor="middle" fontWeight="bold">
                    {h.name}
                  </text>
                </g>
              );
            })}

          {/* Helipad H Marker */}
          <g transform="translate(60, 320)">
            <circle r="14" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
            <text x="0" y="4" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle">
              H
            </text>
          </g>

          {/* Medical Red Cross Marker */}
          <g transform="translate(340, 340)">
            <circle r="14" fill="#DC2626" stroke="#EF4444" strokeWidth="2" />
            <rect x="-8" y="-2" width="16" height="4" fill="#FFFFFF" />
            <rect x="-2" y="-8" width="4" height="16" fill="#FFFFFF" />
          </g>

          {/* Survivors Pins */}
          {survivors.map((s, idx) => {
            const pt = mapPt(s.position[0], s.position[2]);
            const isSaveFirst = idx === 0;
            return (
              <g key={s.id} transform={`translate(${pt.x}, ${pt.y})`}>
                <circle r={isSaveFirst ? 8 : 6} fill={isSaveFirst ? '#DC2626' : '#22C55E'} className={isSaveFirst ? 'animate-ping' : ''} />
                <circle r={isSaveFirst ? 8 : 6} fill={isSaveFirst ? '#DC2626' : '#22C55E'} />
                <text x="12" y="3" fill="#F8FAFC" fontSize="9" fontWeight="bold">
                  {s.id} {isSaveFirst ? '[#1 SAVE FIRST]' : ''}
                </text>
              </g>
            );
          })}

          {/* Responders Dots */}
          {responders.map((r) => {
            const pt = mapPt(r.position[0], r.position[2]);
            return (
              <g key={r.id} transform={`translate(${pt.x}, ${pt.y})`}>
                <circle r="5" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>
            );
          })}

          {/* Drone Icon & Heading Vector Cone */}
          {(() => {
            const dPt = mapPt(drone.position[0], drone.position[2]);
            const headingDeg = (drone.heading * 180) / Math.PI;
            return (
              <g transform={`translate(${dPt.x}, ${dPt.y}) rotate(${headingDeg})`}>
                <polygon points="0,-12 8,8 0,4 -8,8" fill="#22D3EE" stroke="#0F172A" strokeWidth="1.5" />
              </g>
            );
          })()}
        </svg>

        {/* Compass & Legend Overlay */}
        <div className="absolute top-3 left-3 bg-slate-950/85 p-2 rounded-lg border border-cyan-500/30 text-[9px] space-y-1">
          <div className="flex items-center gap-1 font-bold text-cyan-300">
            <Compass className="w-3.5 h-3.5" /> N 00°
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" /> <span>SURVIVOR #1</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> <span>NDRF SQUAD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> <span>RAKSHAAN DRONE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
