import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../store/appStore';

interface DataBeamProps {
  dronePos: [number, number, number];
  commandPos?: [number, number, number];
}

export const DataBeam: React.FC<DataBeamProps> = ({
  dronePos,
  commandPos = [-90, 2.5, -70],
}) => {
  const { stressCommLoss } = useAppStore();
  const packetGroupRef = useRef<THREE.Group>(null);

  const startVec = useMemo(() => new THREE.Vector3(...dronePos), [dronePos]);
  const endVec = useMemo(() => new THREE.Vector3(...commandPos), [commandPos]);

  // Construct line geometry
  const lineMesh = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([startVec, endVec]);
    const mat = new THREE.LineDashedMaterial({
      color: stressCommLoss ? '#E63946' : '#22D3EE',
      dashSize: stressCommLoss ? 1.5 : 4,
      gapSize: stressCommLoss ? 1.5 : 1,
      linewidth: 2,
      opacity: stressCommLoss ? 0.4 : 0.85,
      transparent: true,
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    return line;
  }, [startVec, endVec, stressCommLoss]);

  // Traveling Data Packets (4 spheres along beam path)
  const packets = useMemo(() => [
    { type: 'video', color: '#22D3EE', speedFrac: 1.0, offset: 0.0 },     // Cyan
    { type: 'detection', color: '#F97316', speedFrac: 0.8, offset: 0.25 }, // Orange
    { type: 'telemetry', color: '#22C55E', speedFrac: 1.2, offset: 0.5 },  // Green
    { type: 'geotag', color: '#FFFFFF', speedFrac: 0.9, offset: 0.75 },     // White
  ], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (packetGroupRef.current && !stressCommLoss) {
      const children = packetGroupRef.current.children;
      packets.forEach((p, idx) => {
        if (children[idx]) {
          const progress = (t * p.speedFrac * 0.4 + p.offset) % 1.0;
          children[idx].position.lerpVectors(startVec, endVec, progress);
        }
      });
    }
  });

  return (
    <group>
      {/* 3D Laser Beam Line */}
      <primitive object={lineMesh} />

      {/* Dynamic Traveling Packet Spheres */}
      {!stressCommLoss && (
        <group ref={packetGroupRef}>
          {packets.map((p, i) => (
            <mesh key={i} position={startVec}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial color={p.color} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
