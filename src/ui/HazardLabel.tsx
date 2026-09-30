import React from 'react';
import { Html } from '@react-three/drei';
import { AlertTriangle } from 'lucide-react';
import type { HazardSeverity } from '../sim/types';

interface HazardLabelProps {
  title: string;
  subtitle: string;
  severity: HazardSeverity;
  position: [number, number, number];
}

export const HazardLabel: React.FC<HazardLabelProps> = ({
  title,
  subtitle,
  severity,
  position,
}) => {
  const lineMaterialColor =
    severity === 'high' ? '#EF4444' : severity === 'medium' ? '#F97316' : '#EAB308';

  return (
    <group position={position}>
      {/* Thin leader line extending up from 3D ground location */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 0, 6.0, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={lineMaterialColor} linewidth={2} />
      </line>

      {/* Red Callout Label (White warning triangle, bold text) */}
      <Html position={[0, 6.2, 0]} center className="pointer-events-none z-30">
        <div className="bg-red-600/95 border-2 border-white/80 text-white font-black rounded-xl px-3.5 py-2 shadow-[0_0_20px_rgba(220,38,38,0.5)] backdrop-blur-md flex items-center gap-2.5 whitespace-nowrap animate-in fade-in zoom-in-75 duration-300">
          <AlertTriangle className="w-5 h-5 text-white fill-white shrink-0 animate-bounce" />
          <div className="flex flex-col text-left font-mono">
            <span className="font-heading text-xs font-black tracking-wider uppercase leading-tight text-white drop-shadow">
              {title}
            </span>
            <span className="text-[10px] font-bold text-red-100 uppercase tracking-wide opacity-95">
              {subtitle}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
};
