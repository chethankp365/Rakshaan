import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../store/appStore';
import type { WorldState } from '../sim/types';

interface RescueCameraControllerProps {
  worldState: WorldState;
}

export const RescueCameraController: React.FC<RescueCameraControllerProps> = ({ worldState }) => {
  const { camera } = useThree();
  const { rescueCamMode, setRescueCamMode, autoDirector, tabletOpen } = useAppStore();
  const { drone, currentStep, survivors, responders } = worldState;

  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const commandPostPos = new THREE.Vector3(-90, 2.0, -70);

  // Auto Director camera cuts on key events
  useEffect(() => {
    if (autoDirector && currentStep) {
      if (currentStep.id === 1) setRescueCamMode('wide', false);
      else if (currentStep.id === 4 || currentStep.id === 5) setRescueCamMode('hero', false);
      else if (currentStep.id === 7 || currentStep.id === 8) setRescueCamMode('tactical', false);
      else if (currentStep.id === 10) setRescueCamMode('ground', false);
      else if (currentStep.id === 12) setRescueCamMode('wide', false);
    }
  }, [currentStep.id, autoDirector, setRescueCamMode]);

  // Handle tablet open camera transition
  useEffect(() => {
    if (tabletOpen) {
      setRescueCamMode('tablet', true);
    }
  }, [tabletOpen, setRescueCamMode]);

  useFrame((_, delta) => {
    const dronePos = new THREE.Vector3(...drone.position);
    const survivorPos = survivors[0]?.position
      ? new THREE.Vector3(...survivors[0].position)
      : dronePos;
    const responderPos = responders[0]?.position
      ? new THREE.Vector3(...responders[0].position)
      : commandPostPos;

    let desiredCameraPos = new THREE.Vector3();
    let desiredTarget = new THREE.Vector3();

    switch (rescueCamMode) {
      case 'wide':
        // Command Post Wide Shot
        desiredCameraPos.set(-75, 12, -45);
        desiredTarget.copy(commandPostPos);
        break;

      case 'tablet':
        // Over-the-shoulder at tablet
        desiredCameraPos.set(-90, 3.2, -68.8);
        desiredTarget.set(-90, 2.4, -69.9);
        break;

      case 'hero':
        // Low-angle hero shot of drone against sky with data beam
        desiredCameraPos.set(-85, 4, -62);
        desiredTarget.copy(dronePos);
        break;

      case 'ground':
        // Ground view of rescue unit approaching survivor
        desiredCameraPos.set(responderPos.x + 8, 3, responderPos.z + 10);
        desiredTarget.copy(survivorPos);
        break;

      case 'tactical':
        // Top-down tactical view
        desiredCameraPos.set(-40, 110, -20);
        desiredTarget.set(-40, 0, -20);
        break;

      default:
        return;
    }

    camera.position.lerp(desiredCameraPos, Math.min(1.0, delta * 4.0));
    targetLookAt.current.lerp(desiredTarget, Math.min(1.0, delta * 4.0));
    camera.lookAt(targetLookAt.current);
  });

  return null;
};
