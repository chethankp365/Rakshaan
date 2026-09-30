import React, { useMemo } from 'react';
import * as THREE from 'three';
import { smoothNoise1D } from '../sim/rng';

interface TerrainProps {
  environmentType: 'flood' | 'landslide' | 'cyclone';
  debrisOffset?: number;
}

export const Terrain: React.FC<TerrainProps> = ({ environmentType, debrisOffset = 0 }) => {
  // Generate 800x800m procedural low-poly terrain geometry with vertex colors
  const { geometry, material } = useMemo(() => {
    const size = 800;
    const segments = 100;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    geom.rotateX(-Math.PI / 2);

    const positions = geom.attributes.position;
    const colors: number[] = [];

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      let y = 0;

      const n1 = smoothNoise1D(x * 0.006 + z * 0.006, 101);
      const n2 = smoothNoise1D(x * 0.015 - z * 0.012, 202);

      if (environmentType === 'flood') {
        // Floodplain basin with winding river channel along X axis
        const riverCurve = Math.sin(z * 0.01) * 35 - 100;
        const riverDistance = Math.abs(x - riverCurve);

        if (riverDistance < 55) {
          y = -4.5 + (riverDistance / 55) * 4.5; // River bed depression
          colors.push(0.18, 0.28, 0.35); // Riverbed silt
        } else if (riverDistance < 80) {
          y = (n1 - 0.5) * 2.0;
          colors.push(0.45, 0.38, 0.26); // Muddy floodbank
        } else if (x > 10 && x < 80 && z > -70 && z < 60) {
          // Construction pad plateau
          y = 3.0;
          colors.push(0.55, 0.52, 0.45); // Concrete site pad dirt
        } else {
          y = Math.max(0.5, n1 * 5.0 + n2 * 2.5);
          colors.push(0.22, 0.42, 0.22); // Lush green flood plain grass
        }

      } else if (environmentType === 'landslide') {
        // Steep terraced Himalayan mountain slope
        const heightGradient = -x * 0.45 + (400 - z) * 0.2;
        const baseElevation = Math.max(0, heightGradient);
        const terrace = Math.floor(baseElevation / 7) * 7;

        // Raw red-brown landslide scar cutting down mountain
        const scarCenter = -x * 0.35 - 15;
        const scarDist = Math.abs(z - scarCenter);
        let isScar = false;

        if (x < 60 && scarDist < 65) {
          isScar = true;
          y = terrace - 7 + (scarDist / 65) * 5 + debrisOffset * 0.3;
        } else {
          y = terrace + n1 * 3.5;
        }

        if (isScar) {
          colors.push(0.65, 0.28, 0.16); // Raw red-brown landslide earth
        } else if (y > 35) {
          colors.push(0.28, 0.48, 0.24); // Alpine mountain green
        } else if (y > 15) {
          colors.push(0.32, 0.42, 0.26); // Valley hillside green
        } else {
          colors.push(0.48, 0.44, 0.38); // Slate valley rock
        }

      } else {
        // Coastal Cyclone: Shoreline ocean bed to town terrain
        if (x < -90) {
          y = -6.0 + (x + 90) * 0.05; // Ocean floor seabed
          colors.push(0.12, 0.25, 0.32); // Deep ocean sand
        } else if (x < -30) {
          y = 1.0 + (x + 30) * 0.04; // Coastal sand dune
          colors.push(0.78, 0.72, 0.52); // Golden coastal sand
        } else {
          y = 3.0 + n1 * 2.5; // Town elevation
          colors.push(0.28, 0.42, 0.26); // Coastal palm green town
        }
      }

      positions.setY(i, y);
    }

    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.computeVertexNormals();

    // Low-poly flat shaded material for sharp, clean 4D realistic aesthetics
    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.75,
      metalness: 0.1,
      flatShading: true,
    });

    return { geometry: geom, material: mat };
  }, [environmentType, debrisOffset]);

  return (
    <group>
      {/* Main Procedural 800x800m Low-Poly Terrain Mesh */}
      <mesh geometry={geometry} material={material} receiveShadow castShadow />

      {/* Subtle Topographic Wireframe Grid Accent for 4D Tactical Depth */}
      <mesh geometry={geometry} position={[0, 0.02, 0]}>
        <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.06} />
      </mesh>
    </group>
  );
};
