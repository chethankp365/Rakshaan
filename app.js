/* ==========================================================================
   RAKSHAAN — MAIN APPLICATION ROUTER & CONTROLLER (WITH DYNAMIC DETECTION)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  const simState = window.simState;

  // Initialize 3D Scene
  const scene3D = new Scene3D('canvas-container');

  // Initialize 2D Map
  const map2D = new Map2D('map2d-canvas');

  // Initialize Explain Engine
  const explainEngine = new ExplainEngine(scene3D.cameraDirector, simState);

  // Initialize Show Me Why Engine
  const showMeWhy = new ShowMeWhy(simState, scene3D.cameraDirector);

  // Initialize 4D Replay
  const replay4D = new Replay4D(simState, scene3D);

  // Initialize Sensor Lab
  const sensorLab = new SensorLab(scene3D, scene3D.cameraDirector);

  // Initialize Stress Test
  const stressTest = new StressTest(simState);

  // Initialize Scorecard
  const scorecard = new Scorecard();

  // Populate Victim Cards dynamically as drone detects targets during search
  function renderVictimCards() {
    const container = document.getElementById('victim-cards-container');
    const headerCount = document.querySelector('.triage-panel .panel-header span:last-child');
    const saveBanner = document.getElementById('save-first-banner');
    if (!container) return;

    const detectedTargets = simState.survivors.filter(s => s.detected);

    if (headerCount) {
      headerCount.textContent = `${detectedTargets.length} / 3 BODIES LOCATED`;
    }

    if (saveBanner) {
      const s1Detected = simState.survivors[0].detected;
      if (s1Detected) {
        saveBanner.style.display = 'flex';
      } else {
        saveBanner.style.display = 'none';
      }
    }

    if (detectedTargets.length === 0) {
      container.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); text-align: center; padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 6px;">
          <i data-lucide="radar" style="margin-bottom: 0.3rem;"></i><br>
          Grid Search Active... Scanning Sector for Human Targets.
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    container.innerHTML = detectedTargets.map(s => {
      const isFirst = s.rescueRank === 1;
      return `
        <div class="victim-card ${isFirst ? 'save-target-1' : ''}" data-id="${s.id}">
          <div class="victim-header">
            <span class="victim-name">${s.name}</span>
            <span class="prio-badge ${isFirst ? 'prio-critical' : (s.rescueRank === 2 ? 'prio-high' : 'prio-moderate')}">
              ${isFirst ? '#1 SAVE FIRST' : `RANK #${s.rescueRank}`}
            </span>
          </div>
          <div class="victim-vitals">
            <div class="vital-item">Condition: <strong>${s.condition}</strong></div>
            <div class="vital-item">$O_2$: <strong>${s.oxygen}</strong></div>
            <div class="vital-item">FLIR Temp: <strong>${s.thermalHeat}</strong></div>
            <div class="vital-item">Flood Depth: <strong>${s.floodDepth}</strong></div>
          </div>
        </div>
      `;
    }).join('');

    const cards = container.querySelectorAll('.victim-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const s = simState.survivors.find(s => s.id === id);
        if (s) {
          showMeWhy.explainSurvivor(s);
        }
      });
    });
  }

  renderVictimCards();

  // TACTICAL CIRCULAR RADAR RENDERER
  const radarCanvas = document.getElementById('radar-canvas');
  let radarAngle = 0;

  function renderRadar() {
    if (!radarCanvas) return;
    const ctx = radarCanvas.getContext('2d');
    const w = radarCanvas.width;
    const h = radarCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = w / 2 - 8;

    ctx.clearRect(0, 0, w, h);

    // Dark Radar Circle Background
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(5, 12, 22, 0.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Concentric Grid Rings
    [0.33, 0.66, 1.0].forEach(factor => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * factor, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.stroke();

    // Rotating Radar Sweep Arm
    radarAngle += 0.04;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, radarAngle, radarAngle + 0.45);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.fill();

    // Drone Blip at Center
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    // Survivor Target Blips (Only render if DETECTED!)
    simState.survivors.forEach(s => {
      if (!s.detected) return;
      const relX = (s.x - simState.drone.x) * 1.5;
      const relZ = (s.z - simState.drone.z) * 1.5;
      const bx = cx + relX;
      const by = cy + relZ;

      if (Math.hypot(relX, relZ) < r) {
        ctx.fillStyle = s.rescueRank === 1 ? '#ff2a5f' : (s.rescueRank === 2 ? '#ff9f0a' : '#b520fe');
        ctx.beginPath();
        ctx.arc(bx, by, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '8px Orbitron';
        ctx.fillText(s.id, bx + 6, by + 3);
      }
    });
  }

  // Navigation Tabs Listener
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const page = btn.dataset.page;
      simState.page = page;

      if (page === 'sensor-lab') {
        scene3D.cameraDirector.setMode('SENSOR_VIEW');
      } else if (page === 'digital-twin-3d') {
        scene3D.cameraDirector.setMode('COMMAND_VIEW');
      } else if (page === 'mission-report') {
        scorecard.show();
      }
    });
  });

  // View Mode Toggles (2D Map, 3D World, Drone Eye FPV, Cinematic)
  const viewBtns = document.querySelectorAll('.view-toggle-btn');
  const mapCanvas = document.getElementById('map2d-canvas');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.view;
      simState.viewMode = mode;

      if (mode === '2d') {
        mapCanvas.classList.remove('hidden-canvas');
        document.body.classList.remove('cinematic-mode');
        scene3D.cameraDirector.setMode('COMMAND_VIEW');
      } else if (mode === '3d') {
        mapCanvas.classList.add('hidden-canvas');
        document.body.classList.remove('cinematic-mode');
        scene3D.cameraDirector.setMode('DRONE_FOLLOW');
      } else if (mode === 'fpv') {
        mapCanvas.classList.add('hidden-canvas');
        document.body.classList.remove('cinematic-mode');
        scene3D.cameraDirector.setMode('DRONE_EYE_FPV');
      } else if (mode === 'cinematic') {
        mapCanvas.classList.add('hidden-canvas');
        document.body.classList.add('cinematic-mode');
        scene3D.cameraDirector.setMode('CINEMATIC_ORBIT');
      }
    });
  });

  // Audio Toggle Button
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isMuted = window.audioEngine.toggleMute();
      if (isMuted) {
        audioBtn.classList.remove('active');
        audioBtn.innerHTML = '<i data-lucide="volume-x"></i> MUTE SOUND';
      } else {
        audioBtn.classList.add('active');
        audioBtn.innerHTML = '<i data-lucide="volume-2"></i> SOUND ACTIVE';
      }
      if (window.lucide) lucide.createIcons();
    });
  }

  // Environment Mode Selector
  const envSelect = document.getElementById('env-mode-select');
  if (envSelect) {
    envSelect.addEventListener('change', (e) => {
      simState.setEnvironmentMode(e.target.value);
      if (scene3D.setEnvironmentLighting) {
        scene3D.setEnvironmentLighting(e.target.value);
      }
    });
  }

  // Scenario Selector
  const scenSelect = document.getElementById('scenario-select');
  if (scenSelect) {
    scenSelect.addEventListener('change', (e) => {
      simState.setScenario(e.target.value);
    });
  }

  // Camera Selector Dropdown
  const camSelect = document.getElementById('camera-mode-select');
  if (camSelect) {
    camSelect.addEventListener('change', (e) => {
      scene3D.cameraDirector.setMode(e.target.value);
    });
  }

  // HUD Update Binding
  simState.subscribe((state) => {
    document.getElementById('hud-alt').textContent = `${state.drone.altitude.toFixed(1)} m`;
    document.getElementById('hud-speed').textContent = `${state.drone.speed.toFixed(1)} km/h`;
    document.getElementById('hud-battery').textContent = `${Math.round(state.drone.battery)}%`;
    document.getElementById('hud-heading').textContent = `${Math.round(state.drone.heading)}° NE`;

    const gpsEl = document.getElementById('hud-gps');
    if (state.drone.gps === 'OK') {
      gpsEl.textContent = 'FIX (12 SAT)';
      gpsEl.className = 'value status-ok';
    } else {
      gpsEl.textContent = 'LOST (LOCALIZING)';
      gpsEl.className = 'value status-alert';
    }

    const commEl = document.getElementById('hud-comm');
    if (state.drone.comm === 'CONNECTED') {
      commEl.textContent = 'ACTIVE (98%)';
      commEl.className = 'value status-ok';
    } else {
      commEl.textContent = 'OFFLINE (EDGE AI)';
      commEl.className = 'value status-alert';
    }

    ['perceive', 'assess', 'prioritize', 'act'].forEach(step => {
      const el = document.getElementById(`ai-step-${step}`);
      if (el) {
        if (step.toUpperCase() === state.aiStep) el.classList.add('active');
        else el.classList.remove('active');
      }
    });

    const recEl = document.getElementById('ai-recommendation-text');
    if (recEl) recEl.textContent = state.aiRecommendation;

    const eventList = document.getElementById('event-list');
    if (eventList) {
      eventList.innerHTML = state.eventLog.map(ev => `
        <div class="event-item ${ev.type}">
          <span class="time">[${ev.time}]</span>
          <span class="msg">${ev.msg}</span>
        </div>
      `).join('');
    }

    const narratorBody = document.getElementById('narrator-stream-body');
    if (narratorBody && state.decisionNarrativeLog && state.decisionNarrativeLog.length > 0) {
      narratorBody.innerHTML = state.decisionNarrativeLog.map(n => `
        <div class="narrator-line">
          <span class="time">[${n.time}]</span>${n.msg}
        </div>
      `).join('');
    }

    // Re-render victim cards dynamically as new targets are detected during flight
    renderVictimCards();
  });

  // HUD Smooth Interpolation Variables
  let dispAlt = simState.drone.altitude;
  let dispSpeed = simState.drone.speed;
  let dispBattery = simState.drone.battery;
  let dispHeading = simState.drone.heading;
  let dispComm = simState.drone.commPercent;

  function updateHUDInterpolated() {
    dispAlt += (simState.drone.altitude - dispAlt) * 0.1;
    dispSpeed += (simState.drone.speed - dispSpeed) * 0.1;
    dispBattery += (simState.drone.battery - dispBattery) * 0.05;
    dispComm += (simState.drone.commPercent - dispComm) * 0.1;

    let hDiff = simState.drone.heading - dispHeading;
    if (hDiff > 180) hDiff -= 360;
    if (hDiff < -180) hDiff += 360;
    dispHeading += hDiff * 0.1;

    const altEl = document.getElementById('hud-alt');
    if (altEl) altEl.textContent = `${dispAlt.toFixed(1)} m`;

    const spdEl = document.getElementById('hud-speed');
    if (spdEl) spdEl.textContent = `${dispSpeed.toFixed(1)} km/h`;

    const batEl = document.getElementById('hud-battery');
    if (batEl) batEl.textContent = `${Math.round(dispBattery)}%`;

    const headEl = document.getElementById('hud-heading');
    if (headEl) headEl.textContent = `${Math.round((dispHeading + 360) % 360).toString().padStart(3, '0')}° NE`;

    const gpsEl = document.getElementById('hud-gps');
    if (gpsEl) {
      if (simState.drone.gps === 'OK') {
        gpsEl.textContent = `FIX (${simState.drone.satellitesCount} SAT)`;
        gpsEl.className = 'value status-ok';
      } else {
        gpsEl.textContent = '0 SAT (VIO OPTICAL)';
        gpsEl.className = 'value status-alert';
      }
    }

    const commEl = document.getElementById('hud-comm');
    if (commEl) {
      if (simState.drone.comm === 'CONNECTED') {
        commEl.textContent = `ACTIVE (${Math.round(dispComm)}%)`;
        commEl.className = 'value status-ok';
      } else {
        commEl.textContent = 'OFFLINE (EDGE AI)';
        commEl.className = 'value status-alert';
      }
    }
  }

  // Main Animation Loop
  let lastTime = performance.now();
  function animate(now) {
    const deltaTime = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    simState.update(deltaTime);
    scene3D.update(simState, deltaTime);
    map2D.render(simState);
    renderRadar();
    updateHUDInterpolated();

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
