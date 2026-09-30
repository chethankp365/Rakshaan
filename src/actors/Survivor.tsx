import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Survivor as SurvivorType } from '../sim/types';

interface SurvivorProps {
  survivor: SurvivorType;
}

export const Survivor: React.FC<SurvivorProps> = ({ survivor }) => {
  const armRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const isCritical = survivor.status === 'critical' || survivor.urgencyScore >= 9;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 6;
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(t) * 0.6 + 0.8;
    }
    if (ringRef.current) {
      const scale = 1.0 + Math.sin(t * 0.5) * 0.25;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={survivor.position}>
      <Html position={[0, 2.6, 0]} center className="pointer-events-none">
        <div
          className={`border text-[11px] px-3 py-2 rounded-xl font-mono shadow-2xl backdrop-blur-md flex flex-col gap-1 min-w-[210px] transition-all duration-300 ${
            isCritical
              ? 'border-red-500/80 bg-slate-950/90 text-red-200 shadow-red-500/20'
              : 'border-emerald-500/80 bg-slate-950/90 text-emerald-200 shadow-emerald-500/20'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1">
            <div className="font-bold text-xs flex items-center gap-1.5 text-white tracking-wide">
              <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
              [{survivor.id}] TARGET LOCATED
            </div>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
              {((survivor.confidence ?? 0.96) * 100).toFixed(0)}% CONF
            </span>
          </div>

          {/* AI Species & Age Classification */}
          <div className="space-y-0.5 text-[10px] text-slate-200">
            <div className="flex justify-between items-center text-cyan-300 font-semibold">
              <span>SPECIES:</span>
              <span className="text-white font-bold">{survivor.species || 'Human (Homo Sapiens)'}</span>
            </div>
            <div className="flex justify-between items-center text-cyan-300 font-semibold">
              <span>EST. AGE:</span>
              <span className="text-amber-300 font-bold">{survivor.estimatedAge || '34 Yrs'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>THERMAL FLIR:</span>
              <span className="text-amber-400 font-bold">{survivor.thermalTemp.toFixed(1)}°C</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-[9px] pt-0.5 border-t border-white/10 flex justify-between items-center">
            <span className="text-slate-400 truncate max-w-[130px]">{survivor.condition}</span>
            <span className={`font-black uppercase text-[9px] px-1.5 py-0.5 rounded ${
              isCritical ? 'bg-red-500/30 text-red-400 border border-red-500/50' : 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50'
            }`}>
              {survivor.status}
            </span>
          </div>
        </div>
      </Html>

      {/* Pulsing 3D Tactical Beacon Light for #1 SAVE FIRST target */}
      {isCritical && (
        <group position={[0, 4, 0]}>
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[2.0, 8.0, 32, 1, true]} />
            <meshBasicMaterial color="#E63946" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
          <pointLight color="#E63946" intensity={5} distance={15} />
        </group>
      )}

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.6, 0.75, 32]} />
        <meshBasicMaterial color={isCritical ? '#E63946' : '#FACC15'} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      <group position={[0, 0, 0]}>
        <mesh position={[0, 1.45, 0]} castShadow>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.5} />
        </mesh>

        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[0.34, 0.48, 0.2]} />
          <meshStandardMaterial color={isCritical ? '#DC2626' : '#2563EB'} roughness={0.4} />
        </mesh>

        <group ref={armRef} position={[0.2, 1.2, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.09, 0.45, 0.09]} />
            <meshStandardMaterial color={isCritical ? '#DC2626' : '#2563EB'} />
          </mesh>
          <mesh position={[0, 0.45, 0.05]} castShadow>
            <boxGeometry args={[0.25, 0.2, 0.02]} />
            <meshStandardMaterial color="#F8FAFC" />
          </mesh>
        </group>

        <mesh position={[-0.2, 1.0, 0]} castShadow>
          <boxGeometry args={[0.09, 0.45, 0.09]} />
          <meshStandardMaterial color={isCritical ? '#DC2626' : '#2563EB'} />
        </mesh>

        <mesh position={[-0.09, 0.35, 0]} castShadow>
          <boxGeometry args={[0.11, 0.7, 0.11]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <mesh position={[0.09, 0.35, 0]} castShadow>
          <boxGeometry args={[0.11, 0.7, 0.11]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
      </group>
    </group>
  );
};
