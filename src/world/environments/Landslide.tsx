import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Terrain } from '../Terrain';
import { Weather } from '../Weather';
import { Lighting } from '../Lighting';
import { HazardLabel } from '../../ui/HazardLabel';
import { Excavator } from '../../actors/Excavator';
import { Helicopter } from '../../actors/Helicopter';
import { Survivor } from '../../actors/Survivor';
import { Responder } from '../../actors/Responder';
import type { Scenario, WorldState, QualityLevel } from '../../sim/types';

interface EnvironmentProps {
  scenario: Scenario;
  worldState: WorldState;
  quality?: QualityLevel;
}

export const Landslide: React.FC<EnvironmentProps> = ({ scenario, worldState, quality = 'medium' }) => {
  const { rainIntensity, windSpeed, sunAngle, debrisOffset, survivors, responders } = worldState;

  const rocksGroupRef = useRef<THREE.Group>(null);

  // Animate tumbling loose rocks along the scar channel
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (rocksGroupRef.current) {
      rocksGroupRef.current.children.forEach((rock, idx) => {
        rock.position.y = 20 - ((t * (2 + idx * 0.5)) % 25);
        rock.rotation.x = t * (1 + idx);
        rock.rotation.z = t * (0.8 + idx * 0.5);
      });
    }
  });

  return (
    <group>
      {/* 800x800m Seeded Terraced Himalayan Mountain & Red Scar Terrain */}
      <Terrain environmentType="landslide" debrisOffset={debrisOffset} />
      <Weather rainIntensity={rainIntensity} windSpeed={windSpeed} environmentType="landslide" quality={quality} />
      <Lighting sunAngle={sunAngle} environmentType="landslide" quality={quality} />

      {/* Winding Blocked Mountain Road (Tarmac Strip) */}
      <mesh position={[10, 16.2, 0]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <planeGeometry args={[16, 200]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Red-Brown Landslide Debris Pile Blocking Highway */}
      <group position={[-10, 17, 5]}>
        <mesh castShadow receiveShadow>
          <coneGeometry args={[18, 8, 16]} />
          <meshStandardMaterial color="#78350F" roughness={0.95} flatShading />
        </mesh>
        {/* Scattered Boulders on Debris */}
        {[-8, -2, 5, 10, -12].map((bx, idx) => (
          <mesh key={`boulder-${idx}`} position={[bx, 3 + (idx % 3), (idx * 4) % 10 - 5]} castShadow>
            <dodecahedronGeometry args={[1.5 + (idx % 2), 1]} />
            <meshStandardMaterial color="#57534E" roughness={0.8} flatShading />
          </mesh>
        ))}
      </group>

      {/* Tumbling Loose Rocks Particles Group */}
      <group ref={rocksGroupRef} position={[-25, 15, -10]}>
        {[0, 1, 2, 3, 4].map((rIdx) => (
          <mesh key={`rock-${rIdx}`} position={[(rIdx - 2) * 3, 10 + rIdx * 3, rIdx * 2]} castShadow>
            <dodecahedronGeometry args={[0.8, 1]} />
            <meshStandardMaterial color="#78350F" />
          </mesh>
        ))}
      </group>

      {/* Village of Colorful Small Mountain Houses below the Slide */}
      <group position={[75, 10, -50]}>
        {[
          { pos: [0, 2, 0], col: '#EF4444' },
          { pos: [12, 2, 8], col: '#3B82F6' },
          { pos: [-10, 2, 14], col: '#EAB308' },
          { pos: [18, 2, -12], col: '#10B981' },
          { pos: [-15, 2, -10], col: '#8B5CF6' }
        ].map((h, i) => (
          <group key={`house-${i}`} position={h.pos as [number, number, number]}>
            {/* House Body */}
            <mesh position={[0, 1.5, 0]} castShadow>
              <boxGeometry args={[6, 3, 7]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.6} />
            </mesh>
            {/* Colorful Roof */}
            <mesh position={[0, 3.8, 0]} rotation={[0, 0, 0]} castShadow>
              <coneGeometry args={[5, 2.5, 4]} />
              <meshStandardMaterial color={h.col} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Yellow Excavator Clearing Road Debris */}
      <Excavator position={[25, 17, 15]} rotationY={-1.2} />

      {/* Helicopter Landing Zone (H Marker Pad) */}
      <group position={[120, 35, 100]}>
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[12, 32]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[10.5, 11.5, 32]} />
          <meshBasicMaterial color="#EAB308" />
        </mesh>
        {/* Large H Marker */}
        <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Air Rescue Chopper */}
        <Helicopter position={[0, 0.5, 0]} />
      </group>

      {/* Safe Assembly Area & Medical Base */}
      <group position={[100, 32, 60]}>
        <mesh position={[0, 2.5, 0]} castShadow>
          <coneGeometry args={[8, 5, 4]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
        </mesh>
      </group>

      {/* 3 Zone Colored Polygons (Red High, Orange Medium, Yellow Low) */}
      {/* 1. Red High Evacuation Zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-30, 20, -10]}>
        <planeGeometry args={[120, 100]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      {/* 2. Orange Medium Restricted Access Zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15, 17, 0]}>
        <planeGeometry args={[80, 60]} />
        <meshBasicMaterial color="#F97316" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* 3. Yellow Low Caution Zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[65, 12, -40]}>
        <planeGeometry args={[90, 70]} />
        <meshBasicMaterial color="#EAB308" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>

      {/* Red Callout Hazard Labels */}
      {scenario.hazards.map((h) => (
        <HazardLabel
          key={h.id}
          title={h.name}
          subtitle={h.label}
          severity={h.severity}
          position={h.location as [number, number, number]}
        />
      ))}

      {/* Survivors */}
      {survivors.map((s) => (
        <Survivor key={s.id} survivor={s} />
      ))}

      {/* Responders */}
      {responders.map((r) => (
        <Responder key={r.id} responder={r} />
      ))}
    </group>
  );
};
