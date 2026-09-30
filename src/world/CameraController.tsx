import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../store/appStore';
import type { WorldState } from '../sim/types';

interface CameraControllerProps {
  worldState: WorldState;
}

export const CameraController: React.FC<CameraControllerProps> = ({ worldState }) => {
  const { camera } = useThree();
  const { cameraMode, setCameraMode, autoDirector } = useAppStore();
  const { drone, currentStep, survivors } = worldState;

  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Auto Director camera switcher based on mission step
  useEffect(() => {
    if (autoDirector && currentStep) {
      setCameraMode(currentStep.suggestedCamera, false);
    }
  }, [currentStep.id, autoDirector, setCameraMode]);

  useFrame((_, delta) => {
    const dronePos = new THREE.Vector3(...drone.position);
    const topSurvivor = survivors[0]?.position
      ? new THREE.Vector3(...survivors[0].position)
      : dronePos;

    let desiredCameraPos = new THREE.Vector3();
    let desiredTarget = new THREE.Vector3();

    switch (cameraMode) {
      case 'chase':
        // Behind and above drone with smooth lag
        const offset = new THREE.Vector3(0, 8, 20).applyAxisAngle(new THREE.Vector3(0, 1, 0), drone.heading);
        desiredCameraPos.copy(dronePos).add(offset);
        desiredTarget.copy(dronePos);
        break;

      case 'fpv':
      case 'thermal':
      case 'lidar':
        // Drone gimbal camera view
        desiredCameraPos.copy(dronePos).add(new THREE.Vector3(0, -0.2, 0.2));
        const gimbalRadPan = THREE.MathUtils.degToRad(drone.gimbal.pan);
        const gimbalRadTilt = THREE.MathUtils.degToRad(drone.gimbal.tilt);
        const lookDir = new THREE.Vector3(0, Math.sin(gimbalRadTilt), -Math.cos(gimbalRadTilt))
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), drone.heading + gimbalRadPan);
        desiredTarget.copy(dronePos).add(lookDir.multiplyScalar(20));
        break;

      case 'tactical':
        // Top-down tactical view
        desiredCameraPos.set(dronePos.x, 90, dronePos.z + 0.1);
        desiredTarget.set(dronePos.x, 0, dronePos.z);
        break;

      case 'rescuer':
        // Ground rescuer eye-level looking up at drone
        desiredCameraPos.set(topSurvivor.x + 12, 2.5, topSurvivor.z + 15);
        desiredTarget.copy(dronePos);
        break;

      case 'cinematic':
        // Slow crane dolly low-angle hero shot
        const cinTime = worldState.t * 0.25;
        desiredCameraPos.set(
          dronePos.x + Math.sin(cinTime) * 35,
          Math.max(5, dronePos.y * 0.6),
          dronePos.z + Math.cos(cinTime) * 35
        );
        desiredTarget.copy(dronePos);
        break;

      case 'orbit':
      default:
        // Free orbit handled by OrbitControls or slight smooth follow
        return;
    }

    // Smooth position lerp
    camera.position.lerp(desiredCameraPos, Math.min(1.0, delta * 4.0));

    // Smooth lookAt target lerp
    targetLookAt.current.lerp(desiredTarget, Math.min(1.0, delta * 4.0));
    camera.lookAt(targetLookAt.current);
  });

  return null;
};
