/* ==========================================================================
   RAKSHAAN — "EXPLAIN RAKSHAAN" CINEMATIC EXPLANATION ENGINE (WITH SENSOR PHYSICS)
   ========================================================================== */

class ExplainEngine {
  constructor(cameraDirector, simState) {
    this.director = cameraDirector;
    this.simState = simState;
    this.currentSceneIndex = 0;
    this.isPlaying = false;
    this.timer = null;
    this.stepDuration = 6000; // milliseconds per scene

    // 18 Visual Demonstration Scenes with Explicit Physical Sensor Explanations & Demographic AI Estimates
    this.scenes = [
      {
        num: 'SCENE 01 / 18',
        title: 'THE DISASTER WORLD',
        camera: 'COMMAND_VIEW',
        caption: 'Scanning disaster zone terrain: Flooded roads, damaged structures, blocked access paths, and survivor risk areas.'
      },
      {
        num: 'SCENE 02 / 18',
        title: 'DRONE HARDWARE ECOSYSTEM',
        camera: 'SENSOR_VIEW',
        caption: 'Inspecting RAKSHAAN Payload: Sequential illumination of RGB Camera, Thermal FLIR, LiDAR 360, GPS/GNSS, IMU, Edge AI Computer & Battery.'
      },
      {
        num: 'SCENE 03 / 18',
        title: 'RGB OPTICAL SENSOR & NEURAL DETECT',
        camera: 'DRONE_EYE_FPV',
        caption: 'HOW RGB WORKS: Captures visual light wavelengths (380-750nm). Onboard YOLO-NAS Neural Net scans 30 FPS & locks human contour in bounding box.'
      },
      {
        num: 'SCENE 04 / 18',
        title: 'THERMAL FLIR RADIOMETRIC HEAT SCAN',
        camera: 'SURVIVOR_VIEW',
        caption: 'HOW THERMAL WORKS: Measures Long-Wave Infrared (8-14 µm LWIR) radiation. Converts metabolic heat (38.2°C) into radiometric thermal map -> SURVIVOR CONFIRMED!'
      },
      {
        num: 'SCENE 05 / 18',
        title: 'LiDAR 360° ToF LASER POINT CLOUD',
        camera: 'CINEMATIC_ORBIT',
        caption: 'HOW LiDAR WORKS: Fires 100,000 laser pulses/sec. Time-of-Flight (ToF) distance math d = (c*t)/2 generates 3D point cloud & detects structural obstacles.'
      },
      {
        num: 'SCENE 06 / 18',
        title: 'AUTOMATED GEO-TAGGING',
        camera: 'SURVIVOR_VIEW',
        caption: 'Coordinates Locked: 12°58\'14.2"N 77°35\'22.1"E -> Vertical Geo-Tag Laser projected down to Command Map.'
      },
      {
        num: 'SCENE 07 / 18',
        title: 'MULTI-SENSOR DATA FUSION CORE',
        camera: 'SENSOR_VIEW',
        caption: 'HOW SENSOR FUSION WORKS: Aligns spatial LiDAR depth + thermal heat + RGB visual frames into unified tensor matrix for 99.4% victim verification.'
      },
      {
        num: 'SCENE 08 / 18',
        title: 'AI DECISION PIPELINE',
        camera: 'DRONE_FOLLOW',
        caption: 'Executing Autonomous Loop: PERCEIVE -> ASSESS -> PRIORITIZE -> ACT (Visual Stage Node Activation).'
      },
      {
        num: 'SCENE 09 / 18',
        title: 'VICTIM TRIAGE & RESCUE ORDER',
        camera: 'COMMAND_VIEW',
        caption: 'TRIAGE ANALYSIS: Body S-01 (Probable Child Est. Age 5–9) MUST BE SAVED FIRST! (Oxygen dropping to 89% + rising flood submergence).'
      },
      {
        num: 'SCENE 10 / 18',
        title: 'HAZARD DETECTION & RISK VOLUME',
        camera: 'HAZARD_VIEW',
        caption: 'Perception field detects expanding flood hazard and active structural fires. Red/Orange Risk Volumes generated.'
      },
      {
        num: 'SCENE 11 / 18',
        title: 'AUTONOMOUS ROUTE REPLANNING',
        camera: 'COMMAND_VIEW',
        caption: 'Original Path BLOCKED by Rising Water -> Original Route turns RED -> Alternative Green Path computed instantly!'
      },
      {
        num: 'SCENE 12 / 18',
        title: 'GPS-DENIED LOCAL AUTONOMY',
        camera: 'DRONE_FOLLOW',
        caption: 'Injecting GPS Failure -> Satellites Disappear -> Local IMU + LiDAR Coordinate Frame Activates -> Flight Continues!'
      },
      {
        num: 'SCENE 13 / 18',
        title: 'OFFLINE EDGE AI MISSION MODE',
        camera: 'SENSOR_VIEW',
        caption: 'Comm Beam Severed -> Command Center Offline -> Onboard Edge AI handles local search mission autonomously.'
      },
      {
        num: 'SCENE 14 / 18',
        title: 'AUTONOMOUS SURVIVOR INVESTIGATION',
        camera: 'DRONE_FOLLOW',
        caption: 'Anomaly Detected -> Drone leaves grid search corridor -> Approaches target -> Confirms survivor -> Resumes path.'
      },
      {
        num: 'SCENE 15 / 18',
        title: 'SEARCH COVERAGE CORRIDOR',
        camera: 'TOP_DOWN',
        caption: 'High Satellite View: Unsearched Dark Grid vs Illuminated Searched Corridor expanding to 96% coverage.'
      },
      {
        num: 'SCENE 16 / 18',
        title: 'COMMAND CENTER TELEMETRY LINK',
        camera: 'MISSION_OVERVIEW',
        caption: 'Data flow streams connecting Drone -> Sensors -> AI -> Command Map -> Real-time Rescue Alerts.'
      },
      {
        num: 'SCENE 17 / 18',
        title: 'RESCUE TEAM DISPATCH RECOMMENDATION',
        camera: 'COMMAND_VIEW',
        caption: 'AI Commander generates optimal ground access route -> Simulated Rescue Team Alfa dispatched to S-01 (Save First Target).'
      },
      {
        num: 'SCENE 18 / 18',
        title: 'THE AUTONOMY LOOP — SEE THINK LOCATE SAVE',
        camera: 'MISSION_OVERVIEW',
        caption: 'RAKSHAAN Core Principle: PERCEIVE -> UNDERSTAND -> PRIORITIZE -> ACT -> VERIFY -> ADAPT. SEE • THINK • LOCATE • SAVE.'
      }
    ];

    this.overlay = document.getElementById('explain-overlay');
    this.sceneNumEl = document.getElementById('explain-scene-num');
    this.sceneTitleEl = document.getElementById('explain-scene-title');
    this.captionEl = document.getElementById('explain-caption');
    this.progressBar = document.getElementById('explain-progress-bar');
    this.playBtn = document.getElementById('explain-play-btn');

    this.bindControls();
  }

  bindControls() {
    const explainBtn = document.getElementById('explain-btn');
    if (explainBtn) explainBtn.addEventListener('click', () => this.start());

    const exitBtn = document.getElementById('explain-exit-btn');
    if (exitBtn) exitBtn.addEventListener('click', () => this.stop());

    const skipBtn = document.getElementById('explain-skip-btn');
    if (skipBtn) skipBtn.addEventListener('click', () => this.stop());

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        if (this.isPlaying) this.pause();
        else this.resume();
      });
    }

    const nextBtn = document.getElementById('explain-next-btn');
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextScene());

    const prevBtn = document.getElementById('explain-prev-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevScene());
  }

  start() {
    this.currentSceneIndex = 0;
    this.isPlaying = true;
    document.body.classList.add('cinematic-mode');
    this.overlay.classList.remove('hidden');
    this.renderScene();
    this.scheduleNext();
  }

  stop() {
    this.isPlaying = false;
    clearTimeout(this.timer);
    document.body.classList.remove('cinematic-mode');
    this.overlay.classList.add('hidden');
    this.director.setMode('DRONE_FOLLOW');
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.timer);
    if (this.playBtn) this.playBtn.innerHTML = '<i data-lucide="play"></i> PLAY';
    if (window.lucide) lucide.createIcons();
  }

  resume() {
    this.isPlaying = true;
    if (this.playBtn) this.playBtn.innerHTML = '<i data-lucide="pause"></i> PAUSE';
    if (window.lucide) lucide.createIcons();
    this.scheduleNext();
  }

  nextScene() {
    clearTimeout(this.timer);
    if (this.currentSceneIndex < this.scenes.length - 1) {
      this.currentSceneIndex++;
      this.renderScene();
      if (this.isPlaying) this.scheduleNext();
    } else {
      this.stop();
    }
  }

  prevScene() {
    clearTimeout(this.timer);
    if (this.currentSceneIndex > 0) {
      this.currentSceneIndex--;
      this.renderScene();
      if (this.isPlaying) this.scheduleNext();
    }
  }

  scheduleNext() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.nextScene();
    }, this.stepDuration);
  }

  renderScene() {
    const sc = this.scenes[this.currentSceneIndex];
    if (!sc) return;

    this.sceneNumEl.textContent = sc.num;
    this.sceneTitleEl.textContent = sc.title;
    this.captionEl.textContent = sc.caption;

    const progress = ((this.currentSceneIndex + 1) / this.scenes.length) * 100;
    this.progressBar.style.width = `${progress}%`;

    this.director.setMode(sc.camera);
  }
}

window.ExplainEngine = ExplainEngine;
