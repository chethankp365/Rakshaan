import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { DroneState, QualityLevel } from '../sim/types';

interface DroneProps {
  state?: DroneState;
  showFootprint?: boolean;
  showTrail?: boolean;
  quality?: QualityLevel;
  inspectMode?: boolean;
  scale?: number;
  replannedRoute?: [number, number, number][] | null;
}

function createProceduralDroneTextures() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1A232E';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#111822';
  for (let y = 0; y < 256; y += 8) {
    for (let x = 0; x < 256; x += 8) {
      if ((x / 8 + y / 8) % 2 === 0) {
        ctx.fillRect(x, y, 8, 8);
      }
    }
  }

  ctx.strokeStyle = '#2A3644';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 216, 216);
  ctx.strokeRect(40, 40, 176, 176);

  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(60 + i * 25, 60);
    ctx.lineTo(60 + i * 25, 100);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

export const Drone: React.FC<DroneProps> = ({
  state,
  showFootprint = true,
  showTrail = true,
  quality = 'medium',
  inspectMode = false,
  scale = 1.0,
  replannedRoute = null,
}) => {
  const droneGroup = useRef<THREE.Group>(null);
  const gimbalGroup = useRef<THREE.Group>(null);
  const prop1Ref = useRef<THREE.Group>(null);
  const prop2Ref = useRef<THREE.Group>(null);
  const prop3Ref = useRef<THREE.Group>(null);
  const prop4Ref = useRef<THREE.Group>(null);

  const activeState: DroneState = state || {
    position: [0, 15, 0],
    heading: 0,
    battery: 95,
    gpsFix: true,
    satellites: 14,
    commLink: 98,
    mode: 'searching',
    gimbal: { pan: 0, tilt: -30 },
    altimeter: 15,
    speed: 8,
  };

  const carbonTexture = useMemo(() => createProceduralDroneTextures(), []);

  // LED Ring Color matching drone mode
  const statusColor = useMemo(() => {
    switch (activeState.mode) {
      case 'searching': return '#22D3EE'; // Cyan
      case 'tracking': return '#22C55E';  // Green
      case 'replanning':
      case 'failsafe': return '#FACC15';// Amber
      case 'alert': return '#E63946';     // Red
      case 'rth': return '#A855F7';      // Purple RTH
      default: return '#3B82F6';
    }
  }, [activeState.mode]);

  const explode = inspectMode ? 1.0 : 0.0;

  useFrame((_, delta) => {
    if (droneGroup.current && !inspectMode) {
      droneGroup.current.position.set(
        activeState.position[0],
        activeState.position[1],
        activeState.position[2]
      );
      droneGroup.current.rotation.y = activeState.heading;

      // Realistic Banking Tilt Roll & Pitch
      const pitch = Math.min(0.2, (activeState.speed / 15) * 0.15);
      droneGroup.current.rotation.x = THREE.MathUtils.lerp(droneGroup.current.rotation.x, pitch, 0.1);
    }

    if (gimbalGroup.current) {
      const targetPan = THREE.MathUtils.degToRad(activeState.gimbal.pan);
      const targetTilt = THREE.MathUtils.degToRad(activeState.gimbal.tilt);
      gimbalGroup.current.rotation.y = THREE.MathUtils.lerp(gimbalGroup.current.rotation.y, targetPan, 0.1);
      gimbalGroup.current.rotation.x = THREE.MathUtils.lerp(gimbalGroup.current.rotation.x, targetTilt, 0.1);
    }

    const propSpeed = inspectMode ? 2 : 30;
    if (prop1Ref.current) prop1Ref.current.rotation.y += propSpeed * delta * 1.0;
    if (prop2Ref.current) prop2Ref.current.rotation.y -= propSpeed * delta * 1.02;
    if (prop3Ref.current) prop3Ref.current.rotation.y -= propSpeed * delta * 0.98;
    if (prop4Ref.current) prop4Ref.current.rotation.y += propSpeed * delta * 1.01;
  });

  // Convert ghost trail coordinates to THREE line primitive
  const ghostLineMesh = useMemo(() => {
    if (!activeState.ghostTrail || activeState.ghostTrail.length < 2) return null;
    const points = activeState.ghostTrail.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: '#22D3EE', opacity: 0.6, transparent: true });
    return new THREE.Line(geo, mat);
  }, [activeState.ghostTrail]);

  // Replanned vector line primitive
  const replannedLineMesh = useMemo(() => {
    if (!replannedRoute || replannedRoute.length < 2) return null;
    const points = replannedRoute.map(p => new THREE.Vector3(...p));
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: '#22C55E' });
    return new THREE.Line(geo, mat);
  }, [replannedRoute]);

  return (
    <group>
      {/* Ghost Trail Flight Path */}
      {showTrail && ghostLineMesh && (
        <primitive object={ghostLineMesh} />
      )}

      {/* Replanned Green Vector Line */}
      {replannedLineMesh && (
        <primitive object={replannedLineMesh} />
      )}

      {/* Main Drone Object */}
      <group ref={droneGroup} scale={[scale, scale, scale]}>
        {/* Main Body Hull */}
        <group position={[0, explode * 0.1, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.22, 0.7]} />
            <meshStandardMaterial color="#4A7FA8" roughness={0.35} metalness={0.4} />
          </mesh>

          {/* Accent Stripes */}
          <mesh position={[0, 0.01, 0.3]} castShadow>
            <boxGeometry args={[0.52, 0.12, 0.08]} />
            <meshStandardMaterial color="#F58220" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.01, -0.3]} castShadow>
            <boxGeometry args={[0.52, 0.12, 0.08]} />
            <meshStandardMaterial color="#F58220" roughness={0.3} metalness={0.2} />
          </mesh>

          {/* Carbon Fiber Underside */}
          <mesh position={[0, -0.115, 0]}>
            <boxGeometry args={[0.48, 0.02, 0.68]} />
            <meshStandardMaterial map={carbonTexture} color="#1E2733" roughness={0.5} />
          </mesh>

          {/* LED Ring */}
          <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.18, 0.23, 32]} />
            <meshBasicMaterial color={statusColor} side={THREE.DoubleSide} />
          </mesh>

          {/* Status Light point glow */}
          <pointLight position={[0, 0.2, 0]} color={statusColor} intensity={2.0} distance={5} />
        </group>

        {/* Top Module Dome */}
        <group position={[0, 0.15 + explode * 0.4, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.22, 0.06, 32]} />
            <meshStandardMaterial color="#2A3746" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.06, 0]} castShadow>
            <sphereGeometry args={[0.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
          </mesh>
        </group>

        {/* X-Arms & Motors */}
        {[
          { pos: [-0.45, 0, 0.45], rot: Math.PI / 4, ref: prop1Ref },
          { pos: [0.45, 0, 0.45], rot: -Math.PI / 4, ref: prop2Ref },
          { pos: [-0.45, 0, -0.45], rot: -Math.PI / 4, ref: prop3Ref },
          { pos: [0.45, 0, -0.45], rot: Math.PI / 4, ref: prop4Ref },
        ].map((arm, i) => (
          <group key={i} position={[arm.pos[0] * (1 + explode * 0.2), arm.pos[1], arm.pos[2] * (1 + explode * 0.2)]}>
            <mesh rotation={[0, arm.rot, 0]} position={[-arm.pos[0] * 0.4, 0, -arm.pos[2] * 0.4]}>
              <boxGeometry args={[0.06, 0.04, 0.6]} />
              <meshStandardMaterial map={carbonTexture} color="#1E2733" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.02, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 0.1, 24]} />
              <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
            </mesh>
            <group ref={arm.ref} position={[0, 0.08 + explode * 0.15, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.02, 0.025, 0.03, 16]} />
                <meshStandardMaterial color="#0F172A" />
              </mesh>
              <mesh castShadow>
                <boxGeometry args={[0.55, 0.008, 0.04]} />
                <meshStandardMaterial color="#1E293B" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.001, 0]}>
                <cylinderGeometry args={[0.28, 0.28, 0.002, 32]} />
                <meshBasicMaterial color="#38BDF8" transparent opacity={0.25} />
              </mesh>
            </group>
          </group>
        ))}

        {/* Gimbal Payload */}
        <group ref={gimbalGroup} position={[0, -0.18 - explode * 0.35, 0.1]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial color="#0F172A" metalness={0.7} />
          </mesh>
          <mesh position={[0, -0.06, 0]} castShadow>
            <boxGeometry args={[0.14, 0.12, 0.14]} />
            <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[-0.03, -0.06, 0.072]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.01, 24]} />
            <meshStandardMaterial color="#3B82F6" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.03, -0.06, 0.072]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.01, 24]} />
            <meshStandardMaterial color="#F58220" metalness={0.7} roughness={0.2} />
          </mesh>

          <spotLight
            position={[0, -0.08, 0]}
            angle={0.4}
            penumbra={0.6}
            intensity={quality === 'low' ? 1.0 : 3.5}
            color={statusColor}
            distance={45}
          />
        </group>

        {/* Sensor Footprint Cone */}
        {showFootprint && !inspectMode && (
          <group position={[0, -0.2, 0.1]}>
            <mesh rotation={[Math.PI, 0, 0]} position={[0, -8, 0]}>
              <coneGeometry args={[7.0, 16, 32, 1, true]} />
              <meshBasicMaterial
                color={statusColor}
                transparent
                opacity={0.12}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -activeState.position[1] + 0.1, 0]}>
              <ringGeometry args={[6.7, 7.0, 32]} />
              <meshBasicMaterial color={statusColor} transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};
