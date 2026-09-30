import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Terrain } from '../Terrain';
import { Water } from '../Water';
import { Weather } from '../Weather';
import { Lighting } from '../Lighting';
import { HazardLabel } from '../../ui/HazardLabel';
import { Boat } from '../../actors/Boat';
import { Helicopter } from '../../actors/Helicopter';
import { Survivor } from '../../actors/Survivor';
import { Responder } from '../../actors/Responder';
import type { Scenario, WorldState, QualityLevel } from '../../sim/types';

interface EnvironmentProps {
  scenario: Scenario;
  worldState: WorldState;
  quality?: QualityLevel;
}

export const Cyclone: React.FC<EnvironmentProps> = ({ scenario, worldState, quality = 'medium' }) => {
  const { waterLevel, rainIntensity, windSpeed, sunAngle, survivors, responders } = worldState;

  const palmsGroupRef = useRef<THREE.Group>(null);
  const cloudGroupRef = useRef<THREE.Group>(null);

  // Animate swaying palm trees and spiral cloud vortex
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const bendAmount = Math.sin(t * 4) * 0.15 + (windSpeed / 120) * 0.3;

    if (palmsGroupRef.current) {
      palmsGroupRef.current.children.forEach((palm) => {
        palm.rotation.z = bendAmount;
      });
    }

    if (cloudGroupRef.current) {
      cloudGroupRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <group>
      {/* 800x800m Seeded Coastal Town Terrain & Storm Surge Water */}
      <Terrain environmentType="cyclone" />
      <Water waterLevel={waterLevel} environmentType="cyclone" windSpeed={windSpeed} />
      <Weather rainIntensity={rainIntensity} windSpeed={windSpeed} environmentType="cyclone" quality={quality} />
      <Lighting sunAngle={sunAngle} environmentType="cyclone" quality={quality} />

      {/* Horizon Spiral Cyclone Cloud Mass */}
      <group ref={cloudGroupRef} position={[-200, 70, -250]}>
        {[0, 1, 2, 3, 4, 5].map((cIdx) => (
          <mesh
            key={`cloud-${cIdx}`}
            position={[
              Math.cos(cIdx * 1.0) * (30 + cIdx * 15),
              cIdx * 4,
              Math.sin(cIdx * 1.0) * (30 + cIdx * 15)
            ]}
          >
            <sphereGeometry args={[25 + cIdx * 5, 16, 16]} />
            <meshStandardMaterial color="#1E293B" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* Jetty Dock extending into Storm Surge Waves */}
      <group position={[-100, 1.5, 60]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[40, 1.2, 8]} />
          <meshStandardMaterial color="#78350F" roughness={0.9} />
        </mesh>
        {/* Support Pilings */}
        {[-15, 0, 15].map((px, pIdx) => (
          <mesh key={pIdx} position={[px, -2, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 6, 8]} />
            <meshStandardMaterial color="#451A03" />
          </mesh>
        ))}
      </group>

      {/* Palm-Lined Coast (Swaying Palm Trees) */}
      <group ref={palmsGroupRef}>
        {[-60, -40, -20, 0, 20, 40, 70].map((x, pIdx) => (
          <group key={`palm-${pIdx}`} position={[x, 3, -40 + (pIdx % 3) * 30]}>
            {/* Curved Trunk */}
            <mesh position={[0, 3, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.4, 6, 8]} />
              <meshStandardMaterial color="#78350F" />
            </mesh>
            {/* Palm Fronds */}
            <group position={[0, 6, 0]}>
              {[0, 1.2, 2.4, 3.6, 4.8].map((rot, fIdx) => (
                <mesh key={fIdx} rotation={[0.4, rot, 0]} position={[0, 0, 0]} castShadow>
                  <coneGeometry args={[1.2, 4, 4]} />
                  <meshStandardMaterial color="#15803D" flatShading />
                </mesh>
              ))}
            </group>
          </group>
        ))}
      </group>

      {/* Coastal Town (Colorful Small Houses with Torn Roofs) */}
      <group position={[20, 3, -50]}>
        {[
          { pos: [-20, 2, 0], col: '#F43F5E', torn: true },
          { pos: [0, 2, 10], col: '#0EA5E9', torn: false },
          { pos: [20, 2, -10], col: '#F59E0B', torn: true },
          { pos: [-35, 2, 20], col: '#10B981', torn: false }
        ].map((h, hIdx) => (
          <group key={`town-house-${hIdx}`} position={h.pos as [number, number, number]}>
            <mesh position={[0, 1.5, 0]} castShadow>
              <boxGeometry args={[7, 3, 8]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.6} />
            </mesh>
            {/* Roof (Torn or Intact) */}
            <mesh
              position={[0, 3.8, 0]}
              rotation={h.torn ? [0.3, 0.4, 0.2] : [0, 0, 0]}
              castShadow
            >
              <coneGeometry args={[5.5, 2.5, 4]} />
              <meshStandardMaterial color={h.col} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Leaning Power Poles & Fallen 11kV Power Lines Across Road */}
      <group position={[10, 3, -15]}>
        <mesh position={[0, 4, 0]} rotation={[0, 0, 0.25]} castShadow>
          <cylinderGeometry args={[0.2, 0.25, 8, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Fallen Live Wire Line on Ground */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([-10, 0.2, -5, 10, 0.2, 5, 25, 0.2, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#EF4444" linewidth={3} />
        </line>
      </group>

      {/* Relief Shelter School Building (Evacuation Assembly Point) */}
      <group position={[90, 4, -70]}>
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[22, 8, 14]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.5} />
        </mesh>
        {/* School Roof with Large RED CROSS Sign */}
        <mesh position={[0, 8.2, 0]} castShadow>
          <boxGeometry args={[23, 0.6, 15]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        {/* Green Safe Area Beacon */}
        <pointLight position={[0, 10, 0]} color="#22C55E" intensity={4} distance={25} />
      </group>

      {/* Yellow EVACUATION ROUTE Line & Surge Direction Arrows */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                -110, 2.5, 65,
                -25, 3.5, -30,
                20, 3.5, -45,
                90, 4.5, -70
              ]),
              3
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#FACC15" linewidth={4} />
      </line>

      {/* Coast Guard Helicopter & Rescue Craft */}
      <Boat position={[-120, Math.max(1, waterLevel), 80]} rotationY={0.5} waterLevel={waterLevel} />
      <Helicopter position={[100, 25, -60]} />

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
