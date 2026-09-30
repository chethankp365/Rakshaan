import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from './store/appStore';
import { useClockStore } from './sim/clock';
import { SCENARIOS } from './config/scenarios';
import { getWorldState } from './sim/worldState';
import { FloodSite } from './world/environments/FloodSite';
import { Landslide } from './world/environments/Landslide';
import { Cyclone } from './world/environments/Cyclone';
import { Drone } from './actors/Drone';
import { TopBar } from './ui/TopBar';
import { ModeSelect } from './ui/ModeSelect';
import { DroneSim } from './modes/DroneSim';
import { RescueSim } from './modes/RescueSim';
import { LoadingScreen } from './ui/modals/LoadingScreen';
import { AboutModal } from './ui/modals/AboutModal';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { mode, scenario, quality, inspectDrone } = useAppStore();
  const { t, tick, isPlaying } = useClockStore();

  useEffect(() => {
    let lastTime = performance.now();
    const loop = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      if (isPlaying) tick(delta);
      requestAnimationFrame(loop);
    };
    const animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, tick]);

  const currentScenario = SCENARIOS[scenario] || SCENARIOS.flood;
  const worldState = getWorldState(t, scenario);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      <TopBar />

      {mode === 'drone' && <DroneSim />}
      {mode === 'rescue' && <RescueSim />}

      {mode === 'menu' && (
        <div className="relative w-full h-screen">
          <div className="absolute inset-0 z-0">
            <Canvas shadows={quality !== 'low' ? { type: THREE.PCFShadowMap } : false}>
              <PerspectiveCamera
                makeDefault
                position={inspectDrone ? [0, 0.5, 3.5] : [0, 25, 45]}
                fov={inspectDrone ? 35 : 45}
              />
              <OrbitControls
                autoRotate={!inspectDrone}
                autoRotateSpeed={0.8}
                enableZoom={inspectDrone}
                maxPolarAngle={Math.PI / 2 - 0.05}
              />

              {!inspectDrone ? (
                <>
                  {scenario === 'flood' && (
                    <FloodSite scenario={currentScenario} worldState={worldState} quality={quality} />
                  )}
                  {scenario === 'landslide' && (
                    <Landslide scenario={currentScenario} worldState={worldState} quality={quality} />
                  )}
                  {scenario === 'cyclone' && (
                    <Cyclone scenario={currentScenario} worldState={worldState} quality={quality} />
                  )}

                  <Drone state={worldState.drone} quality={quality} />
                </>
              ) : (
                <group position={[0, 0, 0]}>
                  <ambientLight intensity={1.2} />
                  <directionalLight position={[10, 10, 10]} intensity={2.0} color="#22D3EE" />
                  <directionalLight position={[-10, -10, -10]} intensity={1.0} color="#F58220" />
                  <Drone state={worldState.drone} inspectMode quality={quality} scale={1.2} />
                </group>
              )}
            </Canvas>
          </div>

          <ModeSelect />
          <AboutModal />
        </div>
      )}
    </div>
  );
}

export default App;
