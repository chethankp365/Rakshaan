/* ==========================================================================
   RAKSHAAN — MULTI-CAMERA CINEMATIC DIRECTOR & INTERPOLATION SYSTEM
   ========================================================================== */

class CameraDirector {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.mode = 'DRONE_FOLLOW'; // Default camera mode
    this.targetPos = new THREE.Vector3(0, 0, 0);
    this.targetLookAt = new THREE.Vector3(0, 0, 0);
    this.orbitAngle = 0;
    this.transitionSpeed = 0.08; // Smooth easing interpolation speed

    this.focusTarget = null; // Object to focus on (Survivor, Hazard, Drone)
  }

  setMode(mode, focusObj = null) {
    this.mode = mode;
    if (focusObj) this.focusTarget = focusObj;

    const fpvOverlay = document.getElementById('fpv-overlay');
    if (fpvOverlay) {
      if (mode === 'DRONE_EYE_FPV') {
        fpvOverlay.classList.remove('hidden');
      } else {
        fpvOverlay.classList.add('hidden');
      }
    }

    const selectEl = document.getElementById('camera-mode-select');
    if (selectEl && selectEl.value !== mode) {
      selectEl.value = mode;
    }
  }

  update(droneState, survivors, hazards, deltaTime) {
    const dronePos = new THREE.Vector3(droneState.x, droneState.y, droneState.z);
    const headingRad = (droneState.heading * Math.PI) / 180;

    switch (this.mode) {
      case 'COMMAND_VIEW':
        // High aerial view showing complete disaster zone
        this.targetPos.set(0, 85, 75);
        this.targetLookAt.set(0, 0, 0);
        break;

      case 'DRONE_FOLLOW':
        // Camera follows behind the drone
        const offsetX = -Math.sin(headingRad) * 20;
        const offsetZ = -Math.cos(headingRad) * 20;
        this.targetPos.set(dronePos.x + offsetX, dronePos.y + 8, dronePos.z + offsetZ);
        this.targetLookAt.copy(dronePos);
        break;

      case 'DRONE_FRONT':
        // Camera looks toward drone from front as it approaches target
        const frontX = Math.sin(headingRad) * 16;
        const frontZ = Math.cos(headingRad) * 16;
        this.targetPos.set(dronePos.x + frontX, dronePos.y + 3, dronePos.z + frontZ);
        this.targetLookAt.copy(dronePos);
        break;

      case 'DRONE_EYE_FPV':
        // DRONE EYE FPV: Camera positioned directly inside the drone's optical camera lens!
        const fpvX = Math.sin(headingRad) * 1.5;
        const fpvZ = Math.cos(headingRad) * 1.5;
        this.targetPos.set(dronePos.x + fpvX, dronePos.y - 0.3, dronePos.z + fpvZ);

        // Look forward and slightly down towards targets
        const lookX = Math.sin(headingRad) * 30;
        const lookZ = Math.cos(headingRad) * 30;
        this.targetLookAt.set(dronePos.x + lookX, dronePos.y - 8, dronePos.z + lookZ);
        break;

      case 'TOP_DOWN':
        // Satellite-like top down view
        this.targetPos.set(dronePos.x, dronePos.y + 60, dronePos.z + 0.1);
        this.targetLookAt.copy(dronePos);
        break;

      case 'SURVIVOR_VIEW':
        // Camera moves to target survivor
        let s = this.focusTarget || survivors.find(s => s.rescueRank === 1) || survivors[0];
        if (s) {
          this.targetPos.set(s.x + 10, s.y + 6, s.z + 10);
          this.targetLookAt.set(s.x, s.y + 1, s.z);
        }
        break;

      case 'HAZARD_VIEW':
        // Camera focuses on detected hazard
        let h = this.focusTarget || hazards[0];
        if (h) {
          this.targetPos.set(h.x + 20, 15, h.z + 20);
          this.targetLookAt.set(h.x, 0, h.z);
        }
        break;

      case 'SENSOR_VIEW':
        // Camera moves close to drone to reveal optical/thermal/LiDAR sensors
        this.targetPos.set(dronePos.x + 3.2, dronePos.y + 1.0, dronePos.z + 3.2);
        this.targetLookAt.set(dronePos.x, dronePos.y - 0.4, dronePos.z);
        break;

      case 'CINEMATIC_ORBIT':
        // Camera slowly rotates around the drone
        this.orbitAngle += deltaTime * 0.45;
        const rad = 22;
        this.targetPos.set(
          dronePos.x + Math.sin(this.orbitAngle) * rad,
          dronePos.y + 10,
          dronePos.z + Math.cos(this.orbitAngle) * rad
        );
        this.targetLookAt.copy(dronePos);
        break;

      case 'LOW_ALTITUDE':
        // Camera follows drone from ground level looking up
        this.targetPos.set(dronePos.x - 12, 2.5, dronePos.z - 12);
        this.targetLookAt.set(dronePos.x, dronePos.y + 1.5, dronePos.z);
        break;

      case 'MISSION_OVERVIEW':
      default:
        // Wide cinematic establishing shot
        this.targetPos.set(-65, 55, 65);
        this.targetLookAt.set(0, 3, 0);
        break;
    }

    // Interpolate camera position smoothly (No abrupt teleportation!)
    this.camera.position.lerp(this.targetPos, this.transitionSpeed);

    if (this.controls) {
      this.controls.target.lerp(this.targetLookAt, this.transitionSpeed);
      this.controls.update();
    } else {
      this.camera.lookAt(this.targetLookAt);
    }
  }
}

window.CameraDirector = CameraDirector;
