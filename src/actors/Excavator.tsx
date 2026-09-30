import React from 'react';

interface ExcavatorProps {
  position: [number, number, number];
  rotationY?: number;
}

export const Excavator: React.FC<ExcavatorProps> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Treads Base */}
      <mesh position={[-0.9, 0.4, 0]} castShadow>
        <boxGeometry args={[0.45, 0.8, 3.2]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>
      <mesh position={[0.9, 0.4, 0]} castShadow>
        <boxGeometry args={[0.45, 0.8, 3.2]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>

      {/* Main Yellow Cabin Body */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[2.0, 1.2, 2.2]} />
        <meshStandardMaterial color="#EAB308" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Glass Operator Cabin */}
      <mesh position={[-0.5, 1.8, 0.4]} castShadow>
        <boxGeometry args={[0.9, 1.0, 1.1]} />
        <meshStandardMaterial color="#38BDF8" transparent opacity={0.6} roughness={0.1} />
      </mesh>

      {/* Engine Housing Rear */}
      <mesh position={[0.4, 1.7, -0.6]} castShadow>
        <boxGeometry args={[1.0, 0.9, 1.0]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>

      {/* Articulated Boom Arm */}
      <group position={[0, 1.6, 1.0]} rotation={[-0.4, 0, 0]}>
        <mesh position={[0, 1.2, 0.6]} castShadow>
          <boxGeometry args={[0.3, 2.6, 0.35]} />
          <meshStandardMaterial color="#EAB308" />
        </mesh>

        {/* Dipper Stick */}
        <group position={[0, 2.3, 1.0]} rotation={[0.8, 0, 0]}>
          <mesh position={[0, 0.9, 0.4]} castShadow>
            <boxGeometry args={[0.26, 2.0, 0.3]} />
            <meshStandardMaterial color="#EAB308" />
          </mesh>

          {/* Shovel Bucket */}
          <group position={[0, 1.8, 0.7]} rotation={[0.6, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.8, 0.6, 0.7]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
