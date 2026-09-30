import React from 'react';
import * as THREE from 'three';
import { Terrain } from '../Terrain';
import { Water } from '../Water';
import { Weather } from '../Weather';
import { Lighting } from '../Lighting';
import { HazardLabel } from '../../ui/HazardLabel';
import { Boat } from '../../actors/Boat';
import { Responder } from '../../actors/Responder';
import { Survivor } from '../../actors/Survivor';
import { RescuePickup } from '../../actors/Vehicles';
import type { Scenario, WorldState, QualityLevel } from '../../sim/types';

interface EnvironmentProps {
  scenario: Scenario;
  worldState: WorldState;
  quality?: QualityLevel;
}

export const FloodSite: React.FC<EnvironmentProps> = ({ scenario, worldState, quality = 'medium' }) => {
  const { waterLevel, rainIntensity, windSpeed, sunAngle, survivors, responders } = worldState;

  return (
    <group>
      {/* 800x800m Low-Poly Seeded Terrain & Dynamic Rising Water */}
      <Terrain environmentType="flood" />
      <Water waterLevel={waterLevel} environmentType="flood" windSpeed={windSpeed} />
      <Weather rainIntensity={rainIntensity} windSpeed={windSpeed} environmentType="flood" quality={quality} />
      <Lighting sunAngle={sunAngle} environmentType="flood" quality={quality} />

      {/* Construction Site Tower 1 & Scaffolding */}
      <group position={[22, 0, -35]}>
        {/* Main Concrete Core */}
        <mesh position={[0, 12, 0]} castShadow receiveShadow>
          <boxGeometry args={[12, 24, 12]} />
          <meshStandardMaterial color="#64748B" roughness={0.8} flatShading />
        </mesh>
        {/* Scaffolding Wireframe Matrix */}
        <mesh position={[0, 12, 0]}>
          <boxGeometry args={[14, 25, 14]} />
          <meshStandardMaterial color="#F97316" wireframe transparent opacity={0.6} />
        </mesh>
        {/* Yellow Tower Crane A */}
        <group position={[2, 24, -2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.5, 18, 8]} />
            <meshStandardMaterial color="#EAB308" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 9, 5]} rotation={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.6, 0.6, 22]} />
            <meshStandardMaterial color="#EAB308" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Crane Counterweight */}
          <mesh position={[0, 9, -5]} castShadow>
            <boxGeometry args={[1.8, 1.2, 3]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
      </group>

      {/* Half-Built Concrete Tower 2 */}
      <group position={[55, 0, -10]}>
        <mesh position={[0, 8, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 16, 10]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.7} flatShading />
        </mesh>
        <mesh position={[0, 8, 0]}>
          <boxGeometry args={[11.5, 17, 11.5]} />
          <meshStandardMaterial color="#EAB308" wireframe transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Blue Metal Site Hoardings / Perimeter Fence */}
      {[-40, -10, 20, 50, 80].map((x, i) => (
        <mesh key={`fence-${i}`} position={[x, 2, 25]} castShadow>
          <boxGeometry args={[12, 4, 0.3]} />
          <meshStandardMaterial color="#0284C7" roughness={0.5} />
        </mesh>
      ))}

      {/* Stacked Shipping Containers (Blue, Orange, Red) */}
      <group position={[60, 0, 40]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[3.2, 3, 7.5]} />
          <meshStandardMaterial color="#2563EB" roughness={0.4} />
        </mesh>
        <mesh position={[0, 4.5, 0]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[3.2, 3, 7.5]} />
          <meshStandardMaterial color="#EA580C" roughness={0.4} />
        </mesh>
        <mesh position={[4, 1.5, 1]} castShadow>
          <boxGeometry args={[3.2, 3, 7.5]} />
          <meshStandardMaterial color="#DC2626" roughness={0.4} />
        </mesh>
      </group>

      {/* Red-and-White Safety Barriers & Stacked Pipes */}
      {[-15, 5, 25, 45].map((x, idx) => (
        <group key={`barrier-${idx}`} position={[x, 0.6, -10]}>
          <mesh castShadow>
            <boxGeometry args={[2.5, 1.2, 0.4]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#EF4444' : '#F8FAFC'} />
          </mesh>
        </group>
      ))}

      {/* Stacked Construction Pipes */}
      <group position={[10, 0.6, 15]}>
        {[-0.8, 0, 0.8].map((zOffset, pIdx) => (
          <mesh key={pIdx} position={[0, 0.4, zOffset]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 6, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Submerged Floating Debris (Barrels, Wooden Planks, Crates) */}
      {[-25, 10, 35, -50, 70].map((x, i) => (
        <group key={`debris-${i}`} position={[x, Math.max(0.6, waterLevel + 0.1), 10 + i * 12]} rotation={[0.2, i, 0.1]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.5, 1.2, 12]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#DC2626' : '#D97706'} />
          </mesh>
          {/* Wooden Plank */}
          <mesh position={[1, -0.2, 0]} rotation={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[3, 0.15, 0.8]} />
            <meshStandardMaterial color="#78350F" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Blue Animated Water Flow Direction Arrows */}
      {[-110, -70, -30, 20].map((x, aIdx) => (
        <group key={`arrow-${aIdx}`} position={[x, Math.max(0.6, waterLevel + 0.15), -40 + aIdx * 30]} rotation={[-Math.PI / 2, 0, Math.PI * 0.25]}>
          <mesh>
            <coneGeometry args={[1.5, 4, 3]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Dry Ground Medical Aid Tent & Supply Base */}
      <group position={[-120, 2, -90]}>
        {/* Main Evac Tent */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <coneGeometry args={[7, 5, 4]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
        </mesh>
        {/* Red Cross Sign */}
        <mesh position={[0, 4.2, 4.2]}>
          <boxGeometry args={[1.8, 0.5, 0.1]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
        <mesh position={[0, 4.2, 4.2]}>
          <boxGeometry args={[0.5, 1.8, 0.1]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>

        {/* Helipad Launch Marking */}
        <mesh position={[0, 0.05, 18]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[9, 32]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <mesh position={[0, 0.06, 18]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[8.0, 8.8, 32]} />
          <meshBasicMaterial color="#22C55E" />
        </mesh>
      </group>

      {/* Green EVACUATION ROUTE Line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                -120, 2.5, -72,
                -80, 2.5, -40,
                -35, 2.5, 10,
                22, 2.5, -35
              ]),
              3
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#22C55E" linewidth={4} />
      </line>

      {/* Half-Submerged Trees Along Flooded Riverbank */}
      {[-90, -60, -30, 40, 75].map((x, tIdx) => (
        <group key={`tree-${tIdx}`} position={[x, Math.max(0, waterLevel - 1), -60 + (tIdx % 3) * 35]}>
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.6, 5, 8]} />
            <meshStandardMaterial color="#451A03" />
          </mesh>
          <mesh position={[0, 5, 0]} castShadow>
            <coneGeometry args={[2.5, 6, 8]} />
            <meshStandardMaterial color="#15803D" flatShading />
          </mesh>
        </group>
      ))}

      {/* Hazard Polygons & Callout Labels */}
      {scenario.hazards.map((h) => (
        <group key={h.id}>
          {/* Red Dashed Polygon Boundary */}
          <lineLoop>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array(
                    h.polygon.flatMap(([px, pz]) => [px, Math.max(0.8, waterLevel + 0.3), pz])
                  ),
                  3
                ]}
              />
            </bufferGeometry>
            <lineDashedMaterial color="#EF4444" dashSize={4} gapSize={2} linewidth={3} />
          </lineLoop>

          {/* Translucent Hazard Area Fill */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[h.location[0], Math.max(0.5, waterLevel + 0.1), h.location[2]]}>
            <planeGeometry args={[140, 140]} />
            <meshBasicMaterial color={h.color} transparent opacity={0.12} side={THREE.DoubleSide} />
          </mesh>

          {/* Red Callout Label attached with leader line */}
          <HazardLabel
            title={h.name}
            subtitle={h.label}
            severity={h.severity}
            position={h.location as [number, number, number]}
          />
        </group>
      ))}

      {/* Responders & Vehicles */}
      <Boat position={[-70, waterLevel, 30]} rotationY={0.8} waterLevel={waterLevel} />
      <RescuePickup position={[-125, 2, -60]} rotationY={-0.5} />

      {/* 3D Survivors */}
      {survivors.map((s) => (
        <Survivor key={s.id} survivor={s} />
      ))}

      {/* 3D Responders */}
      {responders.map((r) => (
        <Responder key={r.id} responder={r} waterLevel={waterLevel} />
      ))}
    </group>
  );
};
