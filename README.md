# RAKSHAAN — 4D Autonomous Search-and-Rescue Drone Platform
### Smart India Hackathon 2026 | Team ZeroOne | Problem SIH26177

**RAKSHAAN** is a state-of-the-art 4D disaster-rescue simulation platform featuring 3D spatial rendering plus a controllable 4D time axis (time scrubbing, replayable, pausable). Built for AI-powered autonomous search-and-rescue operations detecting victims, responders, and environmental hazards across severe disaster zones.

---

## 🚀 Quick Run Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Launch Local Dev Server**:
   ```bash
   npm run dev
   ```

3. **Production Build & Verification**:
   ```bash
   npm run build
   ```

Open `http://localhost:5173` in any modern web browser to view the interactive 4D simulation.

---

## 🎮 Keyboard Shortcuts & Controls

| Key / Control | Action |
| --- | --- |
| **`1 - 8`** | Switch Drone Camera Angles (Chase, FPV 4K, FLIR Thermal, LiDAR Depth, Tactical Map, Free Orbit, Ground Rescuer, Cinematic) |
| **`1 - 5` (Mode B)** | Switch Command Post Camera Angles (Wide, Shoulder Tablet, Hero Beam, Ground Evac, Tactical) |
| **`T`** | Pick Up / Dock Command Tablet (Mode B Dashboard) |
| **`Space`** | Play / Pause 4D Simulation Clock |
| **`?`** | Toggle Keyboard Shortcuts Overlay |

---

## 🚁 Simulation Modes

### Mode A: Drone Working Simulation
- **Full-Screen 3D Viewport**: Live rendering with camera angle switcher, Auto Director, and Picture-In-Picture gimbal window (click to swap view).
- **12-Step Autonomous Mission Pipeline**:
  - `01` Disaster Response Alert
  - `02` Autonomous Takeoff & Hover
  - `03` Lawnmower Grid Search (growing cyan coverage matrix)
  - `04` RGB Computer Vision Detection (bounding boxes & confidence)
  - `05` Thermal FLIR Verification (`37.2°C` body heat signature)
  - `06` Priority Ranking Decision (`#1 SAVE FIRST` beacon indicator)
  - `07` Hazard Ingress & Route Block (risk rating spike)
  - `08` A* Alternate Path Replanning (green vector path)
  - `09` GPS & Comm Link Resilience (IMU+LiDAR fallback)
  - `10` Autonomous Target Orbit & Dispatch (NDRF squad dispatched)
  - `11` Sector Coverage Completion (100% mapped)
  - `12` Return To Home & Debrief Report
- **Autonomy Stress Test Panel**: `Inject GPS Loss`, `Inject Comm Loss`, `Inject Hazard`, `Low Battery`.
- **Cinematic Extras**: `Explain RAKSHAAN` (7-stage pipeline diagram), `Show Me Why` (decision evidence breakdown), and `Show Me Everything` (60s highlight tour).

### Mode B: Rescue Team Simulation
- **Field Command Post Scene**: Red Cross medical tent, rescue pickup with flashing emergency lightbar, field command table, and 4 NDRF team members reacting to alerts.
- **Visual 3D Data-Link Laser Beam**: Connects drone and command post with traveling color-coded packets (Cyan = video, Orange = alerts, Green = telemetry, White = geotags).
- **Rugged Command Tablet (7 Tabs)**:
  - **Live Feed**: 4K RGB, FLIR Thermal, and LiDAR depth stream with frame snapshot gallery.
  - **Map**: 2D interactive command map with terrain, water, hazard polygons, evacuation route, pins, and layer toggles.
  - **Survivors**: Priority queue roster, `#1 SAVE FIRST` card, evidence expander, and interactive **Dispatch Team** button.
  - **Hazards**: Active hazard zones, growth trends, and recommended actions.
  - **Drone Status**: System health diagnostics, sensors online, edge AI load, and 12-step tracker.
  - **Comms / Alerts**: Chronological alert feed with radio acknowledge buttons and command composer.
  - **Report**: Live debrief metrics and **Export Report (Print / PDF)** printable document.

---

## 🛠️ Architecture & Tech Stack

- **Framework & Language**: React 18, TypeScript (Strict Mode), Vite
- **3D Graphics Engine**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **State Management & Clock**: Zustand (`appStore`, `useClockStore`)
- **Audio Engine**: 100% Web Audio API synthesized sound generator (rotor hums, wind noise filters, UI blips)
- **Offline & Procedural**: 100% browser-only with procedural geometry, custom shader materials, and canvas-generated textures. Zero external CDN dependencies.

---

## 📂 Project Structure

```
src/
├── config/
│   ├── theme.ts            # Palette, typography, z-index layers
│   ├── scenarios.ts        # Flood, Landslide, and Cyclone scenario definitions
│   └── mission.ts          # 12-Step Autonomous Mission execution definitions
├── sim/
│   ├── types.ts            # Core TypeScript interfaces (Drone, Hazard, Survivor, etc.)
│   ├── rng.ts              # Deterministic PRNG (Mulberry32) & noise helpers
│   ├── clock.ts            # Global 4D clock store (play, pause, speed, seek)
│   ├── timeline.ts         # Catmull-Rom 3D spline & keyframe track interpolators
│   ├── worldState.ts       # Pure deterministic function: getWorldState(t, scenarioId)
│   └── audioEngine.ts      # Web Audio API synthesized sound generator
├── world/
│   ├── Terrain.tsx         # 800m x 800m procedural terrain mesh
│   ├── Water.tsx           # Dynamic procedural water shader plane
│   ├── Weather.tsx         # Rain particles, wind foliage, cyclone clouds & lightning
│   ├── Lighting.tsx        # Dynamic sun angle trajectory & shadow maps
│   ├── CoverageGrid.tsx    # Growing cyan coverage matrix ground overlay
│   ├── CommandPostProps.tsx# Field command post, tent, pickup truck, team members
│   ├── DataBeam.tsx        # 3D laser data-link beam with traveling packets
│   ├── CameraController.tsx# Mode A 8 camera angles & Auto Director
│   ├── RescueCameraController.tsx # Mode B 5 camera angles & Auto Director
│   ├── passes/             # ThermalPass, NightVisionPass, LidarPass shaders
│   └── environments/
│       ├── FloodSite.tsx   # Flood Construction Site scenario world
│       ├── Landslide.tsx   # Himalayan Landslide scenario world
│       └── Cyclone.tsx     # Coastal Cyclone scenario world
├── actors/
│   ├── Drone.tsx           # Procedural low-poly RAKSHAAN quadcopter drone model
│   ├── Responder.tsx       # Low-poly responder figures with hi-vis vests & wading effects
│   ├── Survivor.tsx        # Stranded survivors with thermal metadata & pulsing 3D beacon
│   ├── Vehicles.tsx        # Rescue pickup truck, ambulance, fire truck
│   ├── Boat.tsx            # Inflatable rescue boat with outboard motor & wake
│   ├── Helicopter.tsx      # Rescue helicopter with spinning main & tail rotors
│   └── Excavator.tsx      # Yellow heavy clearance excavator
├── ui/
│   ├── GlassPanel.tsx      # Reusable glassmorphism UI card container
│   ├── TopBar.tsx          # Mode switcher, scenario selector, camera buttons, FPS
│   ├── ModeSelect.tsx      # Landing page mode card selector
│   ├── EventTracePanel.tsx # Real-time scrolling mission events trace log
│   ├── TacticalRadar.tsx   # 360-degree radar scanner component
│   ├── SurvivorPriorityCards.tsx # Ranked survivor queue with #1 SAVE FIRST badge
│   ├── HazardPanel.tsx     # Active hazard zones panel
│   ├── DroneTelemetryPanel.tsx # Battery, altitude, speed, GPS fix, comm link
│   ├── StressTestPanel.tsx # 4 stress test trigger buttons
│   ├── TimelineBar.tsx     # 12-step scrubber bar, play/pause, speed controls
│   ├── PipDroneCamera.tsx  # Picture-In-Picture gimbal camera with click-to-swap
│   ├── SensorFusionPanel.tsx # Side-by-side RGB and Thermal thumbnails with fusion score
│   ├── PerceptionOverlay.tsx # AI bounding boxes with track IDs & confidence
│   ├── ExplainRakshaanModal.tsx # Plain English step narrative & 7-stage pipeline
│   ├── ShowMeWhyModal.tsx  # Freeze-frame evidence breakdown modal
│   ├── MissionReportModal.tsx # Debrief summary card
│   ├── tablet/             # Mode B Rugged Command Tablet 7-tab dashboard
│   └── modals/             # LoadingScreen, AboutModal, ShortcutsModal, PrintableReport
└── App.tsx                 # Main application root
```

---

## ⚡ SIH 2026 Problem Statement SIH26177 Mapping

- **Sensors**: Dual RGB 4K, FLIR Thermal HD, Solid-State LiDAR, Dual RTK-GPS.
- **Perception**: YOLOv8 Edge NPU detecting humans, vehicles, and hazards.
- **Sensor Fusion**: Multi-modal thermal + optical cross-verification.
- **Risk Assessment**: Algorithmic Urgency Matrix calculating victim priorities.
- **Mission Intelligence**: 3D A* Replanner computing low-risk evacuation paths.
- **All Data Simulated**: Pure deterministic simulation in code for SIH demonstration.
