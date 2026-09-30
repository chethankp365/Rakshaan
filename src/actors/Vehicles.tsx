import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RescuePickupProps {
  position: [number, number, number];
  rotationY?: number;
}

export const RescuePickup: React.FC<RescuePickupProps> = ({ position, rotationY = 0 }) => {
  const lightbarRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (lightbarRef.current) {
      lightbarRef.current.intensity = Math.sin(Date.now() * 0.012) > 0 ? 4 : 0.5;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Pickup Truck Main Chassis - Yellow/White SDRF Livery */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[1.9, 0.9, 4.2]} />
        <meshStandardMaterial color="#FEF08A" roughness={0.3} />
      </mesh>

      {/* Cabin Windows */}
      <mesh position={[0, 1.4, 0.3]} castShadow>
        <boxGeometry args={[1.75, 0.7, 1.8]} />
        <meshStandardMaterial color="#0284C7" transparent opacity={0.7} />
      </mesh>

      {/* Rear Pickup Bed */}
      <mesh position={[0, 1.0, -1.2]} castShadow>
        <boxGeometry args={[1.8, 0.5, 1.6]} />
        <meshStandardMaterial color="#F58220" />
      </mesh>

      {/* Flashing Blue & Red Lightbar */}
      <mesh position={[0, 1.8, 0.4]}>
        <boxGeometry args={[1.2, 0.12, 0.25]} />
        <meshStandardMaterial color="#E63946" />
      </mesh>
      <pointLight ref={lightbarRef} position={[0, 1.9, 0.4]} color="#3B82F6" distance={12} />

      {/* 4 Wheels */}
      {[-0.9, 0.9].map((x, i) =>
        [-1.3, 1.3].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.4, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.35, 16]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        ))
      )}
    </group>
  );
};

export const Ambulance: React.FC<RescuePickupProps> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* White Van Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[2.0, 1.5, 4.8]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
      </mesh>
      {/* Red Cross Stripes */}
      <mesh position={[1.01, 1.2, 0]}>
        <boxGeometry args={[0.02, 0.4, 1.2]} />
        <meshStandardMaterial color="#DC2626" />
      </mesh>
      <mesh position={[-1.01, 1.2, 0]}>
        <boxGeometry args={[0.02, 0.4, 1.2]} />
        <meshStandardMaterial color="#DC2626" />
      </mesh>
      {/* Lightbar */}
      <pointLight position={[0, 2.0, 1.8]} color="#E63946" intensity={3} distance={10} />
    </group>
  );
};

export const FireTruck: React.FC<RescuePickupProps> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Heavy Red Fire Truck Chassis */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[2.4, 1.8, 6.2]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.3} />
      </mesh>
      {/* Top Rescue Ladder */}
      <mesh position={[0, 2.35, -0.5]} castShadow>
        <boxGeometry args={[0.8, 0.15, 5.0]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.8} />
      </mesh>
      <pointLight position={[0, 2.4, 2.5]} color="#E63946" intensity={4} distance={15} />
    </group>
  );
};
