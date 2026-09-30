import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WaterProps {
  waterLevel: number;
  environmentType?: 'flood' | 'landslide' | 'cyclone';
  windSpeed?: number;
}

export const Water: React.FC<WaterProps> = ({ waterLevel, environmentType = 'flood', windSpeed = 15 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Water colors based on scenario
  const waterColor = useMemo(() => {
    switch (environmentType) {
      case 'flood': return '#4A3525'; // Muddy silt brown river water
      case 'cyclone': return '#0F2C4A'; // Dark stormy coastal ocean
      case 'landslide': return '#334839'; // Alpine mountain stream
      default: return '#1E3A8A';
    }
  }, [environmentType]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      // Gentle animated wave height offset
      meshRef.current.position.y = waterLevel + Math.sin(t * (windSpeed / 10)) * 0.08;
    }
    if (materialRef.current) {
      // Pulsing opacity & roughness
      materialRef.current.roughness = 0.15 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <group>
      {/* 800m x 800m Water Plane */}
      <mesh ref={meshRef} position={[0, waterLevel, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[900, 900, 64, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          color={waterColor}
          roughness={0.2}
          metalness={0.6}
          transparent
          opacity={0.88}
        />
      </mesh>
    </group>
  );
};
