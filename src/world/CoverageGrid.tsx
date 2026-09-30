import React from 'react';
import * as THREE from 'three';

interface CoverageGridProps {
  coveragePercent: number;
}

export const CoverageGrid: React.FC<CoverageGridProps> = ({ coveragePercent }) => {
  const visibleFraction = coveragePercent / 100;

  return (
    <group position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* 200m x 200m Coverage Matrix Grid plane */}
      <mesh>
        <planeGeometry args={[220, 220, 32, 32]} />
        <meshBasicMaterial
          color="#22D3EE"
          transparent
          opacity={0.12 * visibleFraction}
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
