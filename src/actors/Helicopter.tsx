import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HelicopterProps {
  position: [number, number, number];
  rotationY?: number;
}

export const Helicopter: React.FC<HelicopterProps> = ({ position, rotationY = 0 }) => {
  const mainRotorRef = useRef<THREE.Group>(null);
  const tailRotorRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (mainRotorRef.current) mainRotorRef.current.rotation.y += delta * 25;
    if (tailRotorRef.current) tailRotorRef.current.rotation.x += delta * 30;
    if (lightRef.current) lightRef.current.intensity = Math.sin(Date.now() * 0.01) > 0 ? 3 : 0;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Main Fuselage Body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <capsuleGeometry args={[0.9, 2.4, 16, 16]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Front Cockpit Glass Canopy */}
      <mesh position={[0, 1.4, 1.0]} rotation={[0.4, 0, 0]} castShadow>
        <sphereGeometry args={[0.7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0284C7" roughness={0.1} metalness={0.8} transparent opacity={0.7} />
      </mesh>

      {/* High-Vis Orange Side Stripe */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[1.85, 0.4, 2.5]} />
        <meshStandardMaterial color="#F58220" />
      </mesh>

      {/* Tail Boom */}
      <mesh position={[0, 1.6, -2.2]} rotation={[-0.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.45, 2.8, 12]} />
        <meshStandardMaterial color="#F8FAFC" />
      </mesh>

      {/* Landing Skids */}
      <mesh position={[-0.8, 0.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.1, 3.2]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>
      <mesh position={[0.8, 0.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.1, 3.2]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>

      {/* Main Rotor Shaft & Spinning Blades */}
      <group position={[0, 2.25, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        <group ref={mainRotorRef}>
          <mesh castShadow position={[0, 0.15, 0]}>
            <boxGeometry args={[5.8, 0.03, 0.25]} />
            <meshStandardMaterial color="#1E293B" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* Tail Rotor Spinning Blades */}
      <group ref={tailRotorRef} position={[0.3, 1.8, -3.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.02, 1.1, 0.12]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
      </group>

      {/* Flashing Beacon Light */}
      <pointLight ref={lightRef} position={[0, 2.4, -2.8]} color="#E63946" distance={8} />

      {/* Downward Rescue Searchlight */}
      <spotLight
        position={[0, 0.8, 1.2]}
        target-position={[0, -20, 10]}
        angle={0.5}
        penumbra={0.5}
        intensity={4.0}
        color="#FDE047"
        distance={60}
      />
    </group>
  );
};
