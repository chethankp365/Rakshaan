/* ==========================================================================
   RAKSHAAN — CENTRAL SIMULATION STATE ENGINE (DYNAMIC HUMAN TARGET DETECTION)
   ========================================================================== */

class SimulationState {
  constructor() {
    this.scenario = 'FLOOD'; // FLOOD, EARTHQUAKE, LANDSLIDE, CYCLONE
    this.viewMode = '3d'; // 2d, 3d, cinematic
    this.page = 'live-mission';
    this.status = 'SEARCHING'; // SEARCHING, INVESTIGATING, REPLANNING, GPS_LOST, COMM_LOST, COMPLETED

    // Time tracking
    this.missionTime = 0; // in seconds (0 to 120)
    this.isPaused = false;
    this.isReplaying = false;
    this.replayTime = 0;
    this.replaySpeed = 1;

    // Environmental Mode (DAY, NIGHT, STORM)
    this.environmentMode = 'NIGHT';

    // Central Primary Drone Kinematics State (RAKSHAAN-01 ALPHA)
    this.drone = {
      id: 'RAKSHAAN-01',
      role: 'PRIMARY SEARCH & RESCUE LEADER',
      x: -40,
      y: 18,
      z: -40,
      vx: 0,
      vz: 0,
      targetX: -40,
      targetY: 18,
      targetZ: -40,
      speed: 14.2, // km/h
      altitude: 18.0, // meters
      heading: 45, // degrees
      pitch: 0, // pitch angle in deg
      roll: 0, // bank roll angle in deg
      battery: 100, // percentage
      gps: 'OK', // OK, DEGRADED, LOST
      satellitesCount: 12,
      comm: 'CONNECTED', // CONNECTED, DISCONNECTED
      commPercent: 98,
      imu: 'NORMAL', // NORMAL, LOCALIZING
      sensors: {
        rgb: true,
        thermal: true,
        lidar: true,
        spotlight: true
      }
    };

    // Secondary Scout Drone Kinematics State (RAKSHAAN-02 SCOUT)
    this.droneBeta = {
      id: 'RAKSHAAN-02',
      role: 'TACTICAL SCOUT & FLIR RECON',
      x: 35,
      y: 14,
      z: -35,
      vx: 0,
      vz: 0,
      targetX: 12,
      targetZ: -25,
      speed: 12.5,
      altitude: 14.0,
      heading: 220,
      pitch: 0,
      roll: 0,
      battery: 94,
      status: 'AUTONOMOUS RECON',
      targetId: 'S-02'
    };

    // 20x20 Grid Search Coverage Matrix
    this.gridSize = 20;
    this.coverageMatrix = Array(20).fill(0).map(() => Array(20).fill(0));
    this.searchedPercent = 0;

    // Rescue Base & Ground Rescue Team
    this.rescueBase = { x: -45, z: -45, y: 0 };
    this.rescueTeam = { x: -45, z: -45, targetX: -45, targetZ: -45, active: false };

    // 3 Human Targets (Initially undetected! Will be detected dynamically during flight)
    this.survivors = [
      {
        id: 'S-01',
        name: 'Human Target S-01 (Homo Sapiens)',
        x: -22,
        y: 0.5,
        z: 10,
        species: 'Human Species (Homo Sapiens)',
        condition: 'Trapped Roof Debris',
        status: 'UNKNOWN',
        detected: false, // Detected at t = 12s
        priority: 'CRITICAL',
        rescueRank: 1, // SAVE FIRST!
        baseHeartRate: 115,
        baseOxygen: 89,
        baseThermalHeat: 38.2,
        baseFloodDepth: 0.85,
        heartRate: '115 bpm (Elevated)',
        oxygen: '89% (DROPPING)',
        thermalHeat: '38.2°C (Radiometric Heat)',
        floodDepth: '0.85m (Rising Fast)',
        geoTag: '12°58\'14.2"N 77°35\'22.1"E',
        rescueOrderReason: 'CRITICAL #1 SAVE FIRST: Lowest oxygen reserve & imminent rising flood submergence!'
      },
      {
        id: 'S-02',
        name: 'Human Target S-02 (Homo Sapiens)',
        x: 12,
        y: 0.5,
        z: -25,
        species: 'Human Species (Homo Sapiens)',
        condition: 'Balcony Fracture',
        status: 'UNKNOWN',
        detected: false, // Detected at t = 28s
        priority: 'HIGH',
        rescueRank: 2,
        baseHeartRate: 88,
        baseOxygen: 96,
        baseThermalHeat: 37.4,
        baseFloodDepth: 0.10,
        heartRate: '88 bpm',
        oxygen: '96% (Stable)',
        thermalHeat: '37.4°C (Normal)',
        floodDepth: '0.10m (High Ground)',
        geoTag: '12°58\'18.5"N 77°35\'29.4"E',
        rescueOrderReason: 'HIGH PRIORITY #2: Safe from flood water on balcony, leg fracture stabilized.'
      },
      {
        id: 'S-03',
        name: 'Human Target S-03 (Homo Sapiens)',
        x: 32,
        y: 0.5,
        z: 22,
        species: 'Human Species (Homo Sapiens)',
        condition: 'Submerged Ground Floor',
        status: 'UNKNOWN',
        detected: false, // Detected at t = 50s
        priority: 'CRITICAL',
        rescueRank: 3,
        baseHeartRate: 62,
        baseOxygen: 92,
        baseThermalHeat: 36.1,
        baseFloodDepth: 0.60,
        heartRate: '62 bpm',
        oxygen: '92% (Low)',
        thermalHeat: '36.1°C (Hypothermia Risk)',
        floodDepth: '0.60m (Chest High)',
        geoTag: '12°58\'22.0"N 77°35\'35.8"E',
        rescueOrderReason: 'PRIORITY #3: Water waist-high, hypothermia risk, rescue team dispatched second.'
      }
    ];

    // Hazards
    this.hazards = [
      {
        id: 'H-01',
        name: 'Expanding Flood Waters',
        type: 'FLOOD',
        x: 5,
        z: 5,
        radius: 14,
        maxRadius: 30,
        active: true,
        riskLevel: 'HIGH'
      },
      {
        id: 'H-02',
        name: 'Demolished Building Flame',
        type: 'FIRE',
        x: -28,
        z: -18,
        radius: 9,
        active: true,
        riskLevel: 'CRITICAL'
      },
      {
        id: 'H-03',
        name: 'Structural Wall Collapse',
        type: 'COLLAPSE',
        x: 20,
        z: 15,
        radius: 11,
        active: true,
        riskLevel: 'HIGH'
      }
    ];

    // Flight Path Waypoints
    this.originalPath = [
      { x: -40, z: -40 },
      { x: -40, z: 35 },
      { x: -22, z: 10 }, // Target S-01 location
      { x: -20, z: -35 },
      { x: 12, z: -25 },  // Target S-02 location
      { x: 0, z: 35 },
      { x: 32, z: 22 },   // Target S-03 location
      { x: 40, z: -35 },
      { x: 40, z: 40 }
    ];

    this.activePath = [...this.originalPath];
    this.currentWaypointIndex = 0;
    this.visitedPath = [{ x: -40, z: -40 }];

    // AI Decision Pipeline
    this.aiStep = 'PERCEIVE'; // PERCEIVE, ASSESS, PRIORITIZE, ACT
    this.aiRecommendation = 'Executing Grid Search Corridor... Scanning for Human Targets.';

    // Natural Language Decision Stream Log
    this.decisionNarrativeLog = [];

    // Event History Trace
    this.eventLog = [
      { time: '00:00', type: 'info', msg: 'RAKSHAAN Autonomous Mission Launched. Scenario: Flood & Collapse Response.' },
      { time: '00:02', type: 'info', msg: 'Sensors Online: RGB Camera, Thermal FLIR, LiDAR 360, GPS/GNSS, Edge AI.' }
    ];

    // Replay State Snapshots History
    this.historySnapshots = [];

    // Listeners for UI state updates
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  addEvent(type, msg) {
    const timeStr = this.formatTime(this.missionTime);
    this.eventLog.unshift({ time: timeStr, type, msg });
    if (this.eventLog.length > 25) this.eventLog.pop();

    if (type === 'alert' && window.audioEngine) {
      window.audioEngine.playAlertTone();
    }
    this.notify();
  }

  addDecisionNarrative(msg) {
    const timeStr = this.formatTime(this.missionTime);
    this.decisionNarrativeLog.unshift({ time: timeStr, msg });
    if (this.decisionNarrativeLog.length > 15) this.decisionNarrativeLog.pop();
  }

  formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  update(deltaTime) {
    if (this.isPaused) return;

    this.missionTime += deltaTime;
    if (this.missionTime > 120) {
      this.status = 'COMPLETED';
      return;
    }

    // Dynamic Sensor Noise Jitter (Realism)
    this.updateSensorNoise();

    // Physics-based Drone Flight Dynamics for Primary Drone (RAKSHAAN-01)
    this.updateDronePhysics(deltaTime);

    // Scout Drone (RAKSHAAN-02) Dynamics
    this.updateScoutDronePhysics(deltaTime);

    // Battery Drain (Dynamic power function based on speed + hover)
    const currentSpeedMps = (this.drone.speed * 1000) / 3600;
    const powerFactor = 0.45 + 0.008 * Math.pow(currentSpeedMps, 2.2);
    this.drone.battery = Math.max(12, 100 - (this.missionTime * powerFactor));

    // Structure & Proximity Signal Degradation Simulation
    this.updateSignalQuality();

    // Dynamic Flood Expansion
    const flood = this.hazards.find(h => h.id === 'H-01');
    if (flood && flood.radius < flood.maxRadius) {
      flood.radius += deltaTime * 0.18;
    }

    // DYNAMIC HUMAN TARGET DETECTION TIMELINE AS DRONE SEARCHES
    // 1. Detect S-01 at t >= 12s
    if (this.missionTime >= 12 && !this.survivors[0].detected) {
      this.survivors[0].detected = true;
      this.survivors[0].status = 'CONFIRMED';
      this.aiStep = 'PRIORITIZE';
      this.aiRecommendation = '⚠️ CRITICAL TARGET LOCK: Human Target S-01 (Homo Sapiens) MUST BE SAVED FIRST!';
      this.addEvent('alert', '⚠️ ALERT: HUMAN TARGET S-01 LOCATED! RGB + Thermal FLIR Verified (Homo Sapiens). PRIORITY: CRITICAL #1 (SAVE FIRST!)');
      this.addDecisionNarrative('Target S-01 confirmed: Trapped under roof debris with 89% dropping oxygen. Score: 98.4/100 -> Locked as #1 SAVE FIRST.');
      
      if (window.audioEngine) window.audioEngine.playTargetLockChime();

      // Dispatch Rescue Team to S-01
      this.rescueTeam.active = true;
      this.rescueTeam.targetX = this.survivors[0].x;
      this.rescueTeam.targetZ = this.survivors[0].z;
    }

    // 2. Detect S-02 at t >= 28s
    if (this.missionTime >= 28 && !this.survivors[1].detected) {
      this.survivors[1].detected = true;
      this.survivors[1].status = 'CONFIRMED';
      this.addEvent('warn', '⚠️ ALERT: HUMAN TARGET S-02 LOCATED! RGB + Thermal FLIR Verified (Homo Sapiens). PRIORITY: HIGH #2');
      this.addDecisionNarrative('Target S-02 confirmed on high balcony: Fractured leg, stable oxygen. Assigned RAKSHAAN-02 Scout for monitoring.');
      if (window.audioEngine) window.audioEngine.playTargetLockChime();
    }

    // 3. Detect S-03 at t >= 50s
    if (this.missionTime >= 50 && !this.survivors[2].detected) {
      this.survivors[2].detected = true;
      this.survivors[2].status = 'CONFIRMED';
      this.addEvent('alert', '⚠️ ALERT: HUMAN TARGET S-03 LOCATED! Submerged Ground Floor (Homo Sapiens). PRIORITY: CRITICAL #3');
      this.addDecisionNarrative('Target S-03 located waist-high in water: Hypothermia risk. Priority #3 queued for Ground Team Alfa.');
      if (window.audioEngine) window.audioEngine.playTargetLockChime();
    }

    // Update Grid Coverage
    const gx = Math.min(19, Math.max(0, Math.floor((this.drone.x + 50) / 5)));
    const gz = Math.min(19, Math.max(0, Math.floor((this.drone.z + 50) / 5)));
    this.coverageMatrix[gx][gz] = 1;

    let totalFilled = 0;
    for (let r = 0; r < 20; r++) {
      for (let c = 0; c < 20; c++) {
        if (this.coverageMatrix[r][c] === 1) totalFilled++;
      }
    }
    this.searchedPercent = Math.min(100, Math.round((totalFilled / 400) * 100));

    // Move Rescue Team towards Target S-01 if active
    if (this.rescueTeam.active) {
      const rdx = this.rescueTeam.targetX - this.rescueTeam.x;
      const rdz = this.rescueTeam.targetZ - this.rescueTeam.z;
      const rdist = Math.sqrt(rdx * rdx + rdz * rdz);
      if (rdist > 1) {
        this.rescueTeam.x += (rdx / rdist) * deltaTime * 4.0;
        this.rescueTeam.z += (rdz / rdist) * deltaTime * 4.0;
      }
    }

    // Check Hazard Path Obstruction & Replanning
    if (this.missionTime >= 40 && this.missionTime < 55 && this.status !== 'REPLANNING') {
      const hazardAhead = this.hazards[0];
      const distToHazard = Math.hypot(this.drone.x - hazardAhead.x, this.drone.z - hazardAhead.z);
      if (distToHazard < hazardAhead.radius + 6) {
        this.status = 'REPLANNING';
        this.aiStep = 'PRIORITIZE';
        this.aiRecommendation = 'HAZARD DETECTED! Rerouting active search grid corridor around flood...';
        this.addEvent('alert', 'LiDAR & Perception: Expanding Flood Blocked Route! Autonomous Replanning Activated.');
        this.addDecisionNarrative('Rerouting: Flood corridor blocked at (5,5), recalculated path adds 38s, priority target ETA still within survivability window.');
        
        this.activePath = [
          { x: this.drone.x, z: this.drone.z },
          { x: -35, z: 10 },
          { x: -10, z: 30 },
          { x: 15, z: 35 },
          { x: 32, z: 22 },
          { x: 40, z: 40 }
        ];
        this.currentWaypointIndex = 0;
      }
    }

    this.recordSnapshot();
    this.notify();
  }

  updateDronePhysics(deltaTime) {
    if (this.activePath.length === 0 || this.currentWaypointIndex >= this.activePath.length) return;

    const target = this.activePath[this.currentWaypointIndex];
    const dx = target.x - this.drone.x;
    const dz = target.z - this.drone.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 2.2) {
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.activePath.length;
    } else {
      // Target direction unit vector
      const dirX = dx / dist;
      const dirZ = dz / dist;

      // Calculate target velocity (desired cruise speed: 13.5 m/s or ~15 km/h)
      const targetSpeedMps = 6.5; // world units per sec
      const targetVx = dirX * targetSpeedMps;
      const targetVz = dirZ * targetSpeedMps;

      // Acceleration lerp (inertia simulation)
      const accelRate = 2.5 * deltaTime;
      this.drone.vx += (targetVx - this.drone.vx) * accelRate;
      this.drone.vz += (targetVz - this.drone.vz) * accelRate;

      // Apply displacement
      this.drone.x += this.drone.vx * deltaTime;
      this.drone.z += this.drone.vz * deltaTime;

      // Actual speed calculation
      const actualSpeedMps = Math.hypot(this.drone.vx, this.drone.vz);
      this.drone.speed = actualSpeedMps * 2.8; // Convert to relative km/h display

      if (window.audioEngine) {
        window.audioEngine.updateDroneSpeed(this.drone.speed);
      }

      // Calculate Heading with smooth lerp
      const targetHeading = (Math.atan2(dx, dz) * 180 / Math.PI + 360) % 360;
      let headingDiff = targetHeading - this.drone.heading;
      if (headingDiff > 180) headingDiff -= 360;
      if (headingDiff < -180) headingDiff += 360;
      this.drone.heading += headingDiff * 0.1;

      // Bank Roll Angle calculation (Roll tilts into turns proportional to turn rate)
      const targetRoll = Math.max(-25, Math.min(25, -headingDiff * 0.85));
      this.drone.roll += (targetRoll - this.drone.roll) * 0.1;

      // Pitch Angle calculation (Pitch tilts forward when accelerating)
      const targetPitch = Math.max(-18, Math.min(18, actualSpeedMps * 1.8));
      this.drone.pitch += (targetPitch - this.drone.pitch) * 0.1;

      if (Math.random() < 0.18) {
        this.visitedPath.push({ x: this.drone.x, z: this.drone.z });
      }
    }
  }

  updateScoutDronePhysics(deltaTime) {
    const d2 = this.droneBeta;
    const dx = d2.targetX - d2.x;
    const dz = d2.targetZ - d2.z;
    const dist = Math.hypot(dx, dz);

    if (dist < 1.5) {
      // Toggle back and forth scout orbit around S-02
      d2.targetX = d2.targetX === 12 ? 22 : 12;
      d2.targetZ = d2.targetZ === -25 ? -15 : -25;
    } else {
      const speed = 4.5 * deltaTime;
      d2.x += (dx / dist) * speed;
      d2.z += (dz / dist) * speed;
      d2.heading = (Math.atan2(dx, dz) * 180 / Math.PI + 360) % 360;
    }
  }

  updateSensorNoise() {
    // Inject subtle realistic Gaussian jitter to vits
    this.survivors.forEach(s => {
      const jTemp = (Math.random() - 0.5) * 0.12;
      const jDepth = (Math.random() - 0.5) * 0.015;
      const jHr = Math.floor((Math.random() - 0.5) * 2);

      const curTemp = (s.baseThermalHeat + jTemp).toFixed(1);
      const curDepth = Math.max(0.05, s.baseFloodDepth + jDepth).toFixed(2);
      const curHr = Math.max(50, s.baseHeartRate + jHr);

      s.thermalHeat = `${curTemp}°C (Radiometric Heat)`;
      s.floodDepth = `${curDepth}m ${s.id === 'S-01' ? '(Rising Fast)' : ''}`;
      s.heartRate = `${curHr} bpm`;
    });
  }

  updateSignalQuality() {
    if (this.drone.gps === 'LOST') {
      this.drone.satellitesCount = 0;
    } else {
      // Proximity to origin center
      const distFromCenter = Math.hypot(this.drone.x, this.drone.z);
      const satCount = Math.max(6, Math.floor(14 - (distFromCenter / 25)));
      this.drone.satellitesCount = satCount;
    }

    if (this.drone.comm === 'DISCONNECTED') {
      this.drone.commPercent = 0;
    } else {
      const distFromBase = Math.hypot(this.drone.x - this.rescueBase.x, this.drone.z - this.rescueBase.z);
      const quality = Math.max(65, Math.floor(100 - (distFromBase * 0.35)));
      this.drone.commPercent = quality;
    }
  }

  recordSnapshot() {
    if (Math.floor(this.missionTime) > this.historySnapshots.length) {
      this.historySnapshots.push({
        time: Math.floor(this.missionTime),
        drone: { ...this.drone },
        droneBeta: { ...this.droneBeta },
        survivors: JSON.parse(JSON.stringify(this.survivors)),
        hazards: JSON.parse(JSON.stringify(this.hazards)),
        status: this.status,
        searchedPercent: this.searchedPercent,
        aiStep: this.aiStep
      });
    }
  }

  setScenario(scen) {
    this.scenario = scen;
    this.addEvent('info', `Scenario changed to: ${scen}`);
    this.notify();
  }

  setEnvironmentMode(mode) {
    this.environmentMode = mode;
    this.addEvent('info', `Environment Environment Mode switched to: ${mode}`);
    this.notify();
  }

  injectGPSLoss() {
    this.drone.gps = 'LOST';
    this.drone.imu = 'LOCALIZING (VIO DEAD RECKONING)';
    this.drone.satellitesCount = 0;
    this.status = 'GPS_LOST';
    this.addEvent('alert', 'AUTONOMY STRESS TEST: Satellite GPS Signal Lost! Switching to IMU + LiDAR Optical Local Navigation (VIO).');
    this.addDecisionNarrative('⚠️ GPS Severed: Edge VIO Odometry engaged. Position uncertainty drift model activated.');
    
    setTimeout(() => {
      this.drone.gps = 'OK';
      this.drone.imu = 'NORMAL';
      this.status = 'SEARCHING';
      this.addEvent('info', 'GPS Link Restored & Synchronized with 12 Satellites.');
      this.addDecisionNarrative('GPS Fix re-acquired: EKF filter position synchronized.');
    }, 8000);
  }

  injectCommLoss() {
    this.drone.comm = 'DISCONNECTED';
    this.drone.commPercent = 0;
    this.status = 'COMM_LOST';
    this.addEvent('alert', 'AUTONOMY STRESS TEST: Command Center Telemetry Signal Severed! Edge AI Autonomous Mission Mode Active.');
    this.addDecisionNarrative('⚠️ Telemetry Severed: Onboard Edge AI taking full autonomous flight control. No human override.');
    
    setTimeout(() => {
      this.drone.comm = 'CONNECTED';
      this.drone.commPercent = 98;
      this.status = 'SEARCHING';
      this.addEvent('info', 'Command Center Telemetry Link Re-established (98% signal).');
      this.addDecisionNarrative('Telemetry reconnected: Downlinking high-res thermal tensor telemetry.');
    }, 8000);
  }

  injectHazard() {
    const newHazard = {
      id: `H-0${this.hazards.length + 1}`,
      name: 'Sudden Mudslide Hazard',
      type: 'COLLAPSE',
      x: this.drone.x + 8,
      z: this.drone.z + 8,
      radius: 12,
      active: true,
      riskLevel: 'CRITICAL'
    };
    this.hazards.push(newHazard);
    this.addEvent('alert', `STRESS TEST: New Dynamic Hazard Injected at (${Math.round(newHazard.x)}, ${Math.round(newHazard.z)})!`);
    this.addDecisionNarrative(`Dynamic Hazard ${newHazard.id} detected: Generating obstacle avoidance buffer.`);
  }

  injectLowBattery() {
    this.drone.battery = 18;
    this.addEvent('warn', 'STRESS TEST: Low Battery Warning (18%). Autonomous Power Preservation Flight Profile Initiated.');
    this.addDecisionNarrative('Low Battery (18%): Adjusting motor RPM curve to maximize remaining flight endurance.');
  }
}

// Global Singleton Instance
window.simState = new SimulationState();
