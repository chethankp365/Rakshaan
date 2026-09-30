import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BoatProps {
  position: [number, number, number];
  rotationY?: number;
  waterLevel?: number;
}

export const Boat: React.FC<BoatProps> = ({ position, rotationY = 0, waterLevel = 0 }) => {
  const boatGroup = useRef<THREE.Group>(null);
  const wakeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (boatGroup.current) {
      // Gentle pitch & roll on water surface
      boatGroup.current.position.y = (position[1] || waterLevel) + Math.sin(t * 2) * 0.1;
      boatGroup.current.rotation.z = Math.sin(t * 1.5) * 0.04;
      boatGroup.current.rotation.x = Math.cos(t * 1.8) * 0.03;
    }
    if (wakeRef.current) {
      const s = 1.0 + Math.sin(t * 4) * 0.15;
      wakeRef.current.scale.set(s, 1, s * 1.2);
    }
  });

  return (
    <group ref={boatGroup} position={[position[0], position[1] || waterLevel, position[2]]} rotation={[0, rotationY, 0]}>
      {/* Orange Inflatable Pontoon Hull */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <torusGeometry args={[1.2, 0.35, 16, 32]} />
        <meshStandardMaterial color="#F58220" roughness={0.3} />
      </mesh>

      {/* Boat Floorboard Deck */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[1.6, 0.1, 2.2]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* Outboard Motor Engine */}
      <mesh position={[0, 0.4, -1.2]} castShadow>
        <boxGeometry args={[0.35, 0.6, 0.35]} />
        <meshStandardMaterial color="#0F172A" metalness={0.7} />
      </mesh>

      {/* Water Wake Foam Effect */}
      <mesh ref={wakeRef} position={[0, -0.05, -1.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 3.5]} />
        <meshBasicMaterial color="#E0F2FE" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* NDRF / Rescue Flag */}
      <mesh position={[0.6, 0.9, -1.0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0.6, 1.3, -0.8]}>
        <boxGeometry args={[0.02, 0.3, 0.4]} />
        <meshStandardMaterial color="#22C55E" />
      </mesh>
    </group>
  );
};
