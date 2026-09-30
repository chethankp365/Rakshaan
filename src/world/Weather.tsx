import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { QualityLevel } from '../sim/types';

interface WeatherProps {
  rainIntensity: number;
  windSpeed: number;
  environmentType: 'flood' | 'landslide' | 'cyclone';
  quality?: QualityLevel;
}

export const Weather: React.FC<WeatherProps> = ({
  rainIntensity,
  windSpeed,
  environmentType,
  quality = 'medium',
}) => {
  const rainRef = useRef<THREE.Points>(null);
  const lightningRef = useRef<THREE.PointLight>(null);

  const particleCount = useMemo(() => {
    if (quality === 'low') return 600;
    if (quality === 'medium') return 1800;
    return 3500;
  }, [quality]);

  const rainPositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 350;
      pos[i * 3 + 1] = Math.random() * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 350;
    }
    return pos;
  }, [particleCount]);

  useFrame((_, delta) => {
    if (rainRef.current && rainPositions) {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      const fallSpeed = 35 + rainIntensity * 25;
      const windSlant = (windSpeed / 15) * 8;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] -= fallSpeed * delta;
        positions[i * 3] += windSlant * delta;

        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 70 + Math.random() * 20;
          positions[i * 3] = (Math.random() - 0.5) * 350;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (lightningRef.current && environmentType === 'cyclone') {
      if (Math.random() < 0.015) {
        lightningRef.current.intensity = 12 + Math.random() * 15;
      } else {
        lightningRef.current.intensity = THREE.MathUtils.lerp(lightningRef.current.intensity, 0, 0.2);
      }
    }
  });

  if (rainIntensity <= 0.05) return null;

  return (
    <group>
      <points ref={rainRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[rainPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#A5F3FC"
          size={quality === 'high' ? 0.35 : 0.25}
          transparent
          opacity={Math.min(0.85, rainIntensity * 0.9)}
          depthWrite={false}
        />
      </points>

      {environmentType === 'cyclone' && (
        <pointLight
          ref={lightningRef}
          position={[50, 100, -80]}
          color="#E0F2FE"
          distance={400}
          intensity={0}
        />
      )}

      <mesh position={[0, 90, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[600, 600]} />
        <meshBasicMaterial
          color={environmentType === 'cyclone' ? '#0F172A' : '#1E293B'}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
