import React from 'react';
import type { QualityLevel } from '../sim/types';

interface LightingProps {
  sunAngle?: number;
  environmentType?: 'flood' | 'landslide' | 'cyclone';
  quality?: QualityLevel;
}

export const Lighting: React.FC<LightingProps> = ({
  sunAngle = Math.PI * 0.35,
  environmentType = 'flood',
  quality = 'medium',
}) => {
  const sunX = Math.cos(sunAngle) * 200;
  const sunY = Math.sin(sunAngle) * 160 + 60;
  const sunZ = Math.sin(sunAngle * 0.5) * 120;

  // Fog setup: far range (180 to 750m) so the 800m world terrain is crystal clear from drone camera
  const fogColor = environmentType === 'cyclone' ? '#1E293B' : environmentType === 'landslide' ? '#334155' : '#293548';
  const ambientColor = environmentType === 'cyclone' ? '#475569' : '#64748B';

  const shadowMapSize = quality === 'low' ? 512 : quality === 'medium' ? 1024 : 2048;

  return (
    <group>
      <fog attach="fog" args={[fogColor, 180, quality === 'low' ? 500 : 750]} />
      <ambientLight color={ambientColor} intensity={0.85} />

      <directionalLight
        position={[sunX, sunY, sunZ]}
        color="#FFFBEB"
        intensity={environmentType === 'cyclone' ? 1.0 : 1.8}
        castShadow={quality !== 'low'}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        shadow-camera-near={10}
        shadow-camera-far={450}
        shadow-bias={-0.0003}
      />

      <directionalLight position={[-sunX * 0.5, sunY * 0.5, -sunZ]} color="#38BDF8" intensity={0.5} />
    </group>
  );
};
