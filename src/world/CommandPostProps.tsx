import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../store/appStore';

interface CommandPostPropsProps {
  position?: [number, number, number];
}

export const CommandPostProps: React.FC<CommandPostPropsProps> = ({
  position = [-90, 1.5, -70],
}) => {
  const { toggleTabletOpen, tabletOpen } = useAppStore();
  const lightRef = useRef<THREE.PointLight>(null);
  const arm1Ref = useRef<THREE.Group>(null);
  const arm2Ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Flashing emergency pickup lights
    if (lightRef.current) {
      lightRef.current.intensity = (Math.sin(t * 12) > 0 ? 8 : 0);
    }
    // Team member 1 pointing at sky
    if (arm1Ref.current) {
      arm1Ref.current.rotation.z = Math.sin(t * 2) * 0.2 + 1.2;
    }
    // Team member 2 holding radio to ear
    if (arm2Ref.current) {
      arm2Ref.current.rotation.z = 1.8;
      arm2Ref.current.rotation.x = Math.sin(t * 3) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* --- RED CROSS MEDICAL TENT --- */}
      <group position={[-5, 0, -4]}>
        <mesh position={[0, 2.5, 0]} castShadow>
          <coneGeometry args={[4.5, 3.5, 4]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[6.0, 1.6, 6.0]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.5} />
        </mesh>

        {/* Red Cross Emblem on Tent Roof */}
        <group position={[0, 2.8, 2.3]}>
          <mesh>
            <boxGeometry args={[1.2, 0.35, 0.05]} />
            <meshBasicMaterial color="#DC2626" />
          </mesh>
          <mesh>
            <boxGeometry args={[0.35, 1.2, 0.05]} />
            <meshBasicMaterial color="#DC2626" />
          </mesh>
        </group>
      </group>

      {/* --- RESCUE PICKUP TRUCK WITH FLASHING LIGHTS --- */}
      <group position={[6, 0.6, -2]} rotation={[0, -Math.PI / 6, 0]}>
        {/* Truck Body */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[2.2, 1.1, 4.2]} />
          <meshStandardMaterial color="#EA580C" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, 1.3, -0.3]} castShadow>
          <boxGeometry args={[2.0, 0.9, 2.0]} />
          <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Flashing Emergency Lightbar */}
        <mesh position={[0, 1.8, -0.3]}>
          <boxGeometry args={[1.4, 0.15, 0.3]} />
          <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={2} />
        </mesh>
        <pointLight ref={lightRef} position={[0, 2.0, -0.3]} color="#E63946" distance={20} />
      </group>

      {/* --- FIELD COMMAND TABLE & RUGGED TABLET --- */}
      <group position={[0, 0, 0]}>
        {/* Folding Table */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[2.4, 0.08, 1.2]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
        {/* Legs */}
        {[-1.0, 1.0].map((x) =>
          [-0.45, 0.45].map((z, zi) => (
            <mesh key={`${x}-${zi}`} position={[x, 0.4, z]}>
              <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
          ))
        )}

        {/* Laptop & Radio on Table */}
        <mesh position={[-0.6, 0.93, -0.2]} castShadow>
          <boxGeometry args={[0.4, 0.04, 0.3]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0.7, 0.95, -0.2]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.1]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>

        {/* 3D RUGGED TABLET ON TABLE */}
        <group position={[0, 0.92, 0.1]} rotation={[-Math.PI / 6, 0, 0]}>
          <mesh castShadow onClick={toggleTabletOpen}>
            <boxGeometry args={[0.5, 0.03, 0.35]} />
            <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <planeGeometry args={[0.44, 0.3]} />
            <meshBasicMaterial color="#0284C7" />
          </mesh>

          {!tabletOpen && (
            <Html position={[0, 0.25, 0]} center className="pointer-events-auto">
              <button
                onClick={toggleTabletOpen}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl shadow-2xl border border-cyan-300 animate-bounce flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>PICK UP TABLET (Key T)</span>
              </button>
            </Html>
          )}
        </group>
      </group>

      {/* --- 4 TO 6 RESCUE TEAM MEMBERS AROUND COMMAND TABLE --- */}
      {[
        { pos: [-1.2, 0, 0.6], rot: Math.PI / 4, ref: arm1Ref, role: 'Commander' },
        { pos: [1.2, 0, 0.6], rot: -Math.PI / 4, ref: arm2Ref, role: 'Comms Operator' },
        { pos: [0, 0, 1.4], rot: Math.PI, role: 'Medic Lead' },
        { pos: [-2.0, 0, -1.2], rot: Math.PI / 3, role: 'Logistics' },
      ].map((member, i) => (
        <group key={i} position={[member.pos[0], member.pos[1], member.pos[2]]} rotation={[0, member.rot, 0]}>
          <Html position={[0, 2.2, 0]} center className="pointer-events-none">
            <div className="bg-orange-950/80 border border-orange-500 text-orange-200 text-[9px] px-1.5 py-0.5 rounded font-mono shadow backdrop-blur whitespace-nowrap">
              NDRF Unit #{i + 1} | {member.role}
            </div>
          </Html>

          {/* Yellow Helmet */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#FACC15" roughness={0.3} />
          </mesh>
          {/* Orange Vest Torso */}
          <mesh position={[0, 1.05, 0]} castShadow>
            <boxGeometry args={[0.36, 0.5, 0.22]} />
            <meshStandardMaterial color="#F58220" roughness={0.4} />
          </mesh>

          {/* Animated Arm */}
          <group ref={member.ref} position={[0.22, 1.25, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <boxGeometry args={[0.1, 0.4, 0.1]} />
              <meshStandardMaterial color="#F58220" />
            </mesh>
          </group>
          <group position={[-0.22, 1.25, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <boxGeometry args={[0.1, 0.4, 0.1]} />
              <meshStandardMaterial color="#F58220" />
            </mesh>
          </group>

          {/* Pants */}
          <mesh position={[-0.1, 0.4, 0]} castShadow>
            <boxGeometry args={[0.12, 0.7, 0.12]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <mesh position={[0.1, 0.4, 0]} castShadow>
            <boxGeometry args={[0.12, 0.7, 0.12]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
