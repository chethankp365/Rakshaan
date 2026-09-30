import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Responder as ResponderType } from '../sim/types';

interface ResponderProps {
  responder: ResponderType;
  waterLevel?: number;
}

export const Responder: React.FC<ResponderProps> = ({ responder, waterLevel = 0 }) => {
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const isWading = (responder.position[1] < waterLevel);
  const waterDepth = isWading ? Math.max(0, waterLevel - responder.position[1]) : 0;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 4;
    // Looped walking animation
    if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(t) * 0.4;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(t) * 0.4;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.sin(t) * 0.4;
    if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t) * 0.4;
  });

  return (
    <group position={responder.position}>
      {/* Label Badge */}
      <Html position={[0, 2.2, 0]} center className="pointer-events-none">
        <div className="bg-orange-950/80 border border-orange-500 text-orange-200 text-[10px] px-1.5 py-0.5 rounded font-mono shadow backdrop-blur whitespace-nowrap">
          {responder.team} | {responder.role}
        </div>
      </Html>

      <group position={[0, 0, 0]}>
        {/* Head & Yellow Helmet */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#FACC15" roughness={0.3} />
        </mesh>

        {/* Torso & Hi-Vis Orange Vest */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[0.36, 0.5, 0.22]} />
          <meshStandardMaterial color="#F58220" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.1, 0.112]}>
          <boxGeometry args={[0.34, 0.06, 0.005]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[0, 0.95, 0.112]}>
          <boxGeometry args={[0.34, 0.06, 0.005]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>

        {/* Black Backpack */}
        <mesh position={[0, 1.05, -0.15]} castShadow>
          <boxGeometry args={[0.28, 0.4, 0.12]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>

        {/* Radio */}
        <mesh position={[0.14, 1.2, 0.1]}>
          <boxGeometry args={[0.04, 0.08, 0.03]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <pointLight position={[0.14, 1.25, 0.12]} color="#22C55E" intensity={0.8} distance={0.8} />

        {/* Arms */}
        <group ref={leftArmRef} position={[-0.22, 1.25, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshStandardMaterial color="#F58220" />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[0.22, 1.25, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshStandardMaterial color="#F58220" />
          </mesh>
        </group>

        {/* Legs */}
        {!isWading || waterDepth < 0.6 ? (
          <>
            <group ref={leftLegRef} position={[-0.1, 0.75, 0]}>
              <mesh position={[0, -0.35, 0]} castShadow>
                <boxGeometry args={[0.12, 0.65, 0.12]} />
                <meshStandardMaterial color="#1E293B" />
              </mesh>
            </group>
            <group ref={rightLegRef} position={[0.1, 0.75, 0]}>
              <mesh position={[0, -0.35, 0]} castShadow>
                <boxGeometry args={[0.12, 0.65, 0.12]} />
                <meshStandardMaterial color="#1E293B" />
              </mesh>
            </group>
          </>
        ) : (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.4, 0]}>
            <ringGeometry args={[0.2, 0.45, 16]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.5} />
          </mesh>
        )}
      </group>
    </group>
  );
};
