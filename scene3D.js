/* ==========================================================================
   RAKSHAAN — ULTRA-IMPRESSIVE 3D DIGITAL TWIN WEBGL SCENE ENGINE
   ========================================================================== */

class Scene3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(52, this.container.clientWidth / this.container.clientHeight, 0.5, 1000);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;

    this.cameraDirector = new CameraDirector(this.camera, this.controls);

    // Group containers
    this.terrainGroup = new THREE.Group();
    this.buildingsGroup = new THREE.Group();
    this.droneGroup = new THREE.Group();
    this.droneBetaGroup = new THREE.Group(); // Scout Drone (RAKSHAAN-02)
    this.survivorsGroup = new THREE.Group();
    this.hazardsGroup = new THREE.Group();
    this.telemetryGroup = new THREE.Group();
    this.particlesGroup = new THREE.Group();
    this.weatherGroup = new THREE.Group();

    this.scene.add(this.terrainGroup);
    this.scene.add(this.buildingsGroup);
    this.scene.add(this.droneGroup);
    this.scene.add(this.droneBetaGroup);
    this.scene.add(this.survivorsGroup);
    this.scene.add(this.hazardsGroup);
    this.scene.add(this.telemetryGroup);
    this.scene.add(this.particlesGroup);
    this.scene.add(this.weatherGroup);

    this.smokeParticles = [];
    this.rainParticles = [];
    this.hazeParticles = [];
    this.envMode = 'NIGHT'; // NIGHT, DAY, STORM

    this.initLights();
    this.buildProceduralEnvironment();
    this.buildDroneModel();
    this.buildScoutDroneModel();
    this.buildWeatherParticles();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initLights() {
    this.scene.fog = new THREE.FogExp2(0x05070c, 0.0035);
    this.scene.background = new THREE.Color(0x05070c);

    this.ambientLight = new THREE.AmbientLight(0x406080, 0.6);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
    this.sunLight.position.set(65, 110, 45);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 260;
    const d = 90;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);

    this.rimLight = new THREE.DirectionalLight(0x00f0ff, 0.8);
    this.rimLight.position.set(-60, 40, -60);
    this.scene.add(this.rimLight);

    this.purpRim = new THREE.DirectionalLight(0xb520fe, 0.6);
    this.purpRim.position.set(60, 30, -60);
    this.scene.add(this.purpRim);
  }

  setEnvironmentLighting(mode) {
    this.envMode = mode;
    if (mode === 'DAY') {
      this.scene.fog.color.setHex(0x1a2838);
      this.scene.fog.density = 0.002;
      this.scene.background.setHex(0x1a2838);
      this.ambientLight.color.setHex(0x90b0d0);
      this.ambientLight.intensity = 1.2;
      this.sunLight.intensity = 2.2;
      this.sunLight.color.setHex(0xfffaed);
      if (this.spotLight) this.spotLight.intensity = 1.5;
      if (this.searchlightBeamMesh) this.searchlightBeamMesh.material.opacity = 0.12;
    } else if (mode === 'STORM') {
      this.scene.fog.color.setHex(0x060b14);
      this.scene.fog.density = 0.0065;
      this.scene.background.setHex(0x060b14);
      this.ambientLight.color.setHex(0x203040);
      this.ambientLight.intensity = 0.4;
      this.sunLight.intensity = 0.5;
      if (this.spotLight) this.spotLight.intensity = 5.5;
      if (this.searchlightBeamMesh) this.searchlightBeamMesh.material.opacity = 0.45;
    } else { // NIGHT
      this.scene.fog.color.setHex(0x05070c);
      this.scene.fog.density = 0.0035;
      this.scene.background.setHex(0x05070c);
      this.ambientLight.color.setHex(0x406080);
      this.ambientLight.intensity = 0.6;
      this.sunLight.intensity = 1.4;
      if (this.spotLight) this.spotLight.intensity = 4.0;
      if (this.searchlightBeamMesh) this.searchlightBeamMesh.material.opacity = 0.35;
    }
  }

  buildProceduralEnvironment() {
    // Terrain Geometry with height elevation
    const terrainGeo = new THREE.PlaneBufferGeometry(130, 130, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      let y = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 2.5 + Math.sin(x * 0.09) * 1.2;
      if (Math.abs(x - z) < 16) {
        y -= 3.5; // Flood river basin channel
      }
      pos.setY(i, y);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x121a28,
      roughness: 0.75,
      metalness: 0.2
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    this.terrainGroup.add(terrainMesh);

    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.08 });
    const wireMesh = new THREE.Mesh(terrainGeo, wireMat);
    wireMesh.position.y += 0.06;
    this.terrainGroup.add(wireMesh);

    // REALISTIC ANIMATED SHADER WATER
    const waterGeo = new THREE.PlaneBufferGeometry(130, 130, 64, 64);
    waterGeo.rotateX(-Math.PI / 2);

    this.waterUniforms = {
      uTime: { value: 0 },
      uColorDeep: { value: new THREE.Color(0x001e3d) },
      uColorShallow: { value: new THREE.Color(0x0088cc) }
    };

    this.waterMat = new THREE.ShaderMaterial({
      uniforms: this.waterUniforms,
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;
        varying vec3 vNormal;
        varying vec3 vWorldPos;

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          float wave1 = sin(pos.x * 0.15 + uTime * 2.2) * cos(pos.z * 0.15 + uTime * 1.8) * 0.35;
          float wave2 = sin(pos.x * 0.4 - uTime * 1.5) * 0.15;
          pos.y += wave1 + wave2;

          vWave = wave1 + wave2;
          vNormal = normalize(normalMatrix * vec3(wave2 * 0.5, 1.0, wave1 * 0.5));
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorDeep;
        uniform vec3 uColorShallow;
        varying vec2 vUv;
        varying float vWave;
        varying vec3 vNormal;
        varying vec3 vWorldPos;

        void main() {
          vec3 lightDir = normalize(vec3(40.0, 80.0, 40.0));
          float diff = max(0.2, dot(vNormal, lightDir));

          // Specular shimmer
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          vec3 halfDir = normalize(lightDir + viewDir);
          float spec = pow(max(0.0, dot(vNormal, halfDir)), 32.0) * 0.8;

          vec3 baseColor = mix(uColorDeep, uColorShallow, vWave * 1.5 + 0.5);
          vec3 finalColor = baseColor * diff + vec3(spec) + vec3(0.0, 0.15, 0.25) * 0.4;

          gl_FragColor = vec4(finalColor, 0.82);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.waterMesh = new THREE.Mesh(waterGeo, this.waterMat);
    this.waterMesh.position.y = -2.2;
    this.terrainGroup.add(this.waterMesh);

    // Buildings and Rubble
    const bldMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3 });
    const ruinMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.92 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.4, roughness: 0.1 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 });

    for (let i = 0; i < 38; i++) {
      const bx = (Math.random() - 0.5) * 95;
      const bz = (Math.random() - 0.5) * 95;

      if (Math.abs(bx - bz) < 16) continue;

      const isRuin = Math.random() < 0.48;
      const bw = 7 + Math.random() * 8;
      const bd = 7 + Math.random() * 8;
      const bh = isRuin ? 2.5 + Math.random() * 3.5 : 4 + Math.random() * 4.5;

      const bGeo = new THREE.BoxBufferGeometry(bw, bh, bd);
      const bMesh = new THREE.Mesh(bGeo, isRuin ? ruinMat : bldMat);
      bMesh.position.set(bx, bh / 2, bz);

      if (isRuin) {
        bMesh.rotation.z = (Math.random() - 0.5) * 0.22;
        bMesh.rotation.x = (Math.random() - 0.5) * 0.22;

        // Broken concrete slabs & rubble mounds
        for (let r = 0; r < 5; r++) {
          const slabGeo = new THREE.BoxBufferGeometry(2 + Math.random() * 2.5, 0.6, 2 + Math.random() * 2.5);
          const slabMesh = new THREE.Mesh(slabGeo, ruinMat);
          slabMesh.position.set(bx + (Math.random() - 0.5) * bw * 1.5, 0.3, bz + (Math.random() - 0.5) * bd * 1.5);
          slabMesh.rotation.set(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5);
          this.buildingsGroup.add(slabMesh);
        }

        // Exposed steel girders / pillars
        for (let g = 0; g < 2; g++) {
          const beamGeo = new THREE.CylinderBufferGeometry(0.12, 0.12, 4 + Math.random() * 3, 8);
          const beamMesh = new THREE.Mesh(beamGeo, steelMat);
          beamMesh.position.set(bx + (Math.random() - 0.5) * bw * 0.8, bh, bz + (Math.random() - 0.5) * bd * 0.8);
          beamMesh.rotation.set(Math.random() * 0.6, Math.random() * 0.6, Math.random() * 0.6);
          this.buildingsGroup.add(beamMesh);
        }

        if (Math.random() < 0.65) {
          this.createSmokeEmitter(bx, bh + 0.5, bz);
        }
      } else {
        const winGeo = new THREE.BoxBufferGeometry(bw + 0.1, bh * 0.7, bd + 0.1);
        const winMesh = new THREE.Mesh(winGeo, glassMat);
        winMesh.position.set(bx, bh / 2, bz);
        this.buildingsGroup.add(winMesh);
      }

      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      this.buildingsGroup.add(bMesh);
    }

    // Rescue Base Helipad
    const padGeo = new THREE.CylinderBufferGeometry(7, 7, 0.4, 24);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, emissive: 0x10b981, emissiveIntensity: 0.35 });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.set(-45, 0.2, -45);
    padMesh.receiveShadow = true;
    this.terrainGroup.add(padMesh);

    const beaconLight = new THREE.PointLight(0x10b981, 3.5, 35);
    beaconLight.position.set(-45, 8, -45);
    this.terrainGroup.add(beaconLight);
  }

  buildWeatherParticles() {
    // Rain Particles for Storm Mode
    const rainGeo = new THREE.BufferGeometry();
    const rainCount = 400;
    const positions = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 120;
      positions[i + 1] = Math.random() * 50 + 5;
      positions[i + 2] = (Math.random() - 0.5) * 120;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const rainMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.45,
      transparent: true,
      opacity: 0.5
    });

    this.rainMesh = new THREE.Points(rainGeo, rainMat);
    this.weatherGroup.add(this.rainMesh);

    // Layered Volumetric Haze Particles
    for (let h = 0; h < 14; h++) {
      const hzGeo = new THREE.SphereBufferGeometry(4 + Math.random() * 5, 8, 8);
      const hzMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.04
      });
      const hzMesh = new THREE.Mesh(hzGeo, hzMat);
      hzMesh.position.set((Math.random() - 0.5) * 90, 0.5 + Math.random() * 2, (Math.random() - 0.5) * 90);
      this.weatherGroup.add(hzMesh);
      this.hazeParticles.push(hzMesh);
    }
  }

  createSmokeEmitter(x, y, z) {
    for (let p = 0; p < 8; p++) {
      const pGeo = new THREE.SphereBufferGeometry(0.7 + Math.random() * 0.7, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({
        color: 0x64748b,
        transparent: true,
        opacity: 0.35
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(x + (Math.random() - 0.5) * 3, y + Math.random() * 2, z + (Math.random() - 0.5) * 3);
      this.particlesGroup.add(pMesh);
      this.smokeParticles.push({
        mesh: pMesh,
        startY: y,
        speed: 0.4 + Math.random() * 0.7
      });
    }
  }

  buildDroneModel() {
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.95, roughness: 0.15 });
    const neonCyanMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 2.0 });
    const neonPurpMat = new THREE.MeshStandardMaterial({ color: 0xb520fe, emissive: 0xb520fe, emissiveIntensity: 2.0 });
    const propMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75 });

    const bodyGeo = new THREE.BoxBufferGeometry(2.2, 0.65, 2.2);
    const bodyMesh = new THREE.Mesh(bodyGeo, carbonMat);
    this.droneGroup.add(bodyMesh);

    const stripGeo1 = new THREE.BoxBufferGeometry(2.25, 0.15, 0.15);
    const strip1 = new THREE.Mesh(stripGeo1, neonCyanMat);
    strip1.position.set(0, 0.1, 1.15);
    this.droneGroup.add(strip1);

    const strip2 = new THREE.Mesh(stripGeo1, neonPurpMat);
    strip2.position.set(0, 0.1, -1.15);
    this.droneGroup.add(strip2);

    const domeGeo = new THREE.SphereBufferGeometry(0.8, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, neonCyanMat);
    domeMesh.position.y = 0.35;
    this.droneGroup.add(domeMesh);

    const lidarRingGeo = new THREE.TorusBufferGeometry(0.6, 0.08, 8, 24);
    lidarRingGeo.rotateX(Math.PI / 2);
    this.lidarRingMesh = new THREE.Mesh(lidarRingGeo, neonPurpMat);
    this.lidarRingMesh.position.y = 0.85;
    this.droneGroup.add(this.lidarRingMesh);

    this.propellers = [];
    const armCoords = [
      { x: 1.8, z: 1.8 },
      { x: -1.8, z: 1.8 },
      { x: 1.8, z: -1.8 },
      { x: -1.8, z: -1.8 }
    ];

    armCoords.forEach((c, idx) => {
      const armGeo = new THREE.BoxBufferGeometry(0.35, 0.18, 2.5);
      const armMesh = new THREE.Mesh(armGeo, carbonMat);
      armMesh.position.set(c.x / 2, 0, c.z / 2);
      armMesh.lookAt(c.x, 0, c.z);
      this.droneGroup.add(armMesh);

      const motorGeo = new THREE.CylinderBufferGeometry(0.35, 0.35, 0.5, 16);
      const motorMesh = new THREE.Mesh(motorGeo, idx % 2 === 0 ? neonCyanMat : neonPurpMat);
      motorMesh.position.set(c.x, 0.25, c.z);
      this.droneGroup.add(motorMesh);

      const propGeo = new THREE.BoxBufferGeometry(2.6, 0.03, 0.22);
      const propMesh = new THREE.Mesh(propGeo, propMat);
      propMesh.position.set(c.x, 0.55, c.z);
      this.droneGroup.add(propMesh);
      this.propellers.push(propMesh);
    });

    const gimbalGeo = new THREE.SphereBufferGeometry(0.55, 20, 20);
    this.gimbalMesh = new THREE.Mesh(gimbalGeo, carbonMat);
    this.gimbalMesh.position.set(0, -0.45, 0.6);
    this.droneGroup.add(this.gimbalMesh);

    // Powerful Drone Searchlight (SpotLight + Volumetric Light Beam Cone)
    this.spotLight = new THREE.SpotLight(0xffffff, 4.0, 65, Math.PI / 4, 0.4, 1.2);
    this.spotLight.position.set(0, -0.5, 0);
    this.spotLight.target.position.set(0, -25, 0);
    this.spotLight.castShadow = true;
    this.droneGroup.add(this.spotLight);
    this.droneGroup.add(this.spotLight.target);

    // Visible Volumetric Searchlight Cone Beam Geometry
    const beamGeo = new THREE.ConeBufferGeometry(14, 25, 24, 1, true);
    beamGeo.rotateX(Math.PI);
    beamGeo.translate(0, -12.5, 0);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    this.searchlightBeamMesh = new THREE.Mesh(beamGeo, beamMat);
    this.gimbalMesh.add(this.searchlightBeamMesh);

    // Camera Sensor Frustum
    const coneGeo = new THREE.ConeBufferGeometry(16, 28, 24, 1, true);
    coneGeo.rotateX(Math.PI);
    coneGeo.translate(0, -14, 0);
    this.rgbFrustumMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    });
    this.rgbFrustumMesh = new THREE.Mesh(coneGeo, this.rgbFrustumMat);
    this.gimbalMesh.add(this.rgbFrustumMesh);

    const scanPulseGeo = new THREE.RingBufferGeometry(1, 15, 32);
    scanPulseGeo.rotateX(-Math.PI / 2);
    this.scanPulseMat = new THREE.MeshBasicMaterial({
      color: 0xb520fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    this.scanPulseMesh = new THREE.Mesh(scanPulseGeo, this.scanPulseMat);
    this.scanPulseMesh.position.y = -17;
    this.droneGroup.add(this.scanPulseMesh);

    this.droneGroup.position.set(-40, 18, -40);
  }

  buildScoutDroneModel() {
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.9, roughness: 0.2 });
    const amberMat = new THREE.MeshStandardMaterial({ color: 0xff9f0a, emissive: 0xff9f0a, emissiveIntensity: 2.0 });
    const propMat = new THREE.MeshBasicMaterial({ color: 0xff9f0a, transparent: true, opacity: 0.75 });

    const bodyGeo = new THREE.BoxBufferGeometry(1.6, 0.5, 1.6);
    const bodyMesh = new THREE.Mesh(bodyGeo, carbonMat);
    this.droneBetaGroup.add(bodyMesh);

    const strip1 = new THREE.Mesh(new THREE.BoxBufferGeometry(1.65, 0.12, 0.12), amberMat);
    strip1.position.set(0, 0.1, 0.85);
    this.droneBetaGroup.add(strip1);

    this.scoutProps = [];
    const armCoords = [
      { x: 1.3, z: 1.3 },
      { x: -1.3, z: 1.3 },
      { x: 1.3, z: -1.3 },
      { x: -1.3, z: -1.3 }
    ];

    armCoords.forEach((c) => {
      const motorMesh = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.25, 0.25, 0.4, 12), amberMat);
      motorMesh.position.set(c.x, 0.2, c.z);
      this.droneBetaGroup.add(motorMesh);

      const propMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(2.0, 0.03, 0.18), propMat);
      propMesh.position.set(c.x, 0.4, c.z);
      this.droneBetaGroup.add(propMesh);
      this.scoutProps.push(propMesh);
    });

    this.droneBetaGroup.position.set(35, 14, -35);
  }

  update(simState, deltaTime) {
    const d = simState.drone;

    // Update Water Shader Uniform
    if (this.waterUniforms) {
      this.waterUniforms.uTime.value += deltaTime;
    }

    // Primary Drone Smooth Kinematics + Pitch/Roll Banking
    const hoverSway = Math.sin(simState.missionTime * 3) * 0.22;
    this.droneGroup.position.lerp(new THREE.Vector3(d.x, d.y + hoverSway, d.z), 0.12);

    this.droneGroup.rotation.y = (d.heading * Math.PI) / 180;
    this.droneGroup.rotation.z = (d.roll * Math.PI) / 180;
    this.droneGroup.rotation.x = (d.pitch * Math.PI) / 180;

    // Scout Drone Kinematics
    const d2 = simState.droneBeta;
    this.droneBetaGroup.position.lerp(new THREE.Vector3(d2.x, d2.y, d2.z), 0.12);
    this.droneBetaGroup.rotation.y = (d2.heading * Math.PI) / 180;

    this.propellers.forEach(p => { p.rotation.y += deltaTime * 32; });
    this.scoutProps.forEach(sp => { sp.rotation.y += deltaTime * 30; });

    if (this.lidarRingMesh) {
      this.lidarRingMesh.rotation.y += deltaTime * 12;
    }

    if (this.scanPulseMesh) {
      const pulseScale = 1 + ((simState.missionTime * 3) % 4);
      this.scanPulseMesh.scale.set(pulseScale, pulseScale, 1);
      this.scanPulseMat.opacity = Math.max(0, 0.5 - (pulseScale / 8));
    }

    // Weather / Particles Animation
    if (this.envMode === 'STORM' && this.rainMesh) {
      this.rainMesh.visible = true;
      const positions = this.rainMesh.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= deltaTime * 40;
        if (positions[i] < 0) positions[i] = 50;
      }
      this.rainMesh.geometry.attributes.position.needsUpdate = true;
    } else if (this.rainMesh) {
      this.rainMesh.visible = false;
    }

    this.hazeParticles.forEach((hz, idx) => {
      hz.position.x += Math.sin(simState.missionTime * 0.5 + idx) * deltaTime * 0.5;
    });

    this.smokeParticles.forEach(sp => {
      sp.mesh.position.y += deltaTime * sp.speed;
      sp.mesh.scale.addScalar(deltaTime * 0.08);
      if (sp.mesh.position.y > sp.startY + 6) {
        sp.mesh.position.y = sp.startY;
        sp.mesh.scale.set(1, 1, 1);
      }
    });

    // Render ONLY DETECTED targets in 3D scene dynamically!
    this.updateSurvivors3D(simState.survivors, simState.missionTime);

    this.updateHazards3D(simState.hazards);
    this.updateTelemetry3D(simState);

    this.cameraDirector.update(d, simState.survivors, simState.hazards, deltaTime);
    this.renderer.render(this.scene, this.camera);
  }

  updateSurvivors3D(survivors, missionTime) {
    while (this.survivorsGroup.children.length > 0) {
      this.survivorsGroup.remove(this.survivorsGroup.children[0]);
    }

    survivors.forEach(s => {
      // ONLY render 3D target beacon if DETECTED during search!
      if (!s.detected) return;

      const sGroup = new THREE.Group();
      sGroup.position.set(s.x, s.y, s.z);

      const colorHex = s.rescueRank === 1 ? 0xff2a5f : (s.rescueRank === 2 ? 0xff9f0a : 0xb520fe);

      // Human Figure (3D Body)
      const bodyGeo = new THREE.CylinderBufferGeometry(0.35, 0.35, 1.5, 12);
      const sMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.5,
        roughness: 0.2
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, sMat);
      bodyMesh.position.y = 0.75;
      sGroup.add(bodyMesh);

      // Pulsing Heartbeat / Priority Ring
      const pulseScale = 1 + Math.sin(missionTime * 5 + s.rescueRank) * 0.2;
      const ringGeo = new THREE.RingBufferGeometry(1.6 * pulseScale, 2.2 * pulseScale, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 0.08;
      sGroup.add(ringMesh);

      // High-Intensity Laser Pillar to Sky
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 20, 0)
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 2 });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      sGroup.add(lineMesh);

      this.survivorsGroup.add(sGroup);
    });
  }

  updateHazards3D(hazards) {
    const flood = hazards.find(h => h.id === 'H-01');
    if (flood && this.waterMesh) {
      this.waterMesh.position.y = -2.2 + (flood.radius - 14) * 0.12;
    }

    while (this.hazardsGroup.children.length > 0) {
      this.hazardsGroup.remove(this.hazardsGroup.children[0]);
    }

    hazards.forEach(h => {
      if (!h.active) return;
      const hGeo = new THREE.CylinderBufferGeometry(h.radius, h.radius, 14, 32, 1, true);
      const hMat = new THREE.MeshBasicMaterial({
        color: h.type === 'FIRE' ? 0xff2a5f : 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const hMesh = new THREE.Mesh(hGeo, hMat);
      hMesh.position.set(h.x, 7, h.z);
      this.hazardsGroup.add(hMesh);
    });
  }

  updateTelemetry3D(simState) {
    while (this.telemetryGroup.children.length > 0) {
      this.telemetryGroup.remove(this.telemetryGroup.children[0]);
    }

    if (simState.activePath && simState.activePath.length > 1) {
      const points = simState.activePath.map(p => new THREE.Vector3(p.x, 18, p.z));
      const pathGeo = new THREE.BufferGeometry().setFromPoints(points);
      const isReplanned = simState.status === 'REPLANNING';
      const pathMat = new THREE.LineBasicMaterial({
        color: isReplanned ? 0x10b981 : 0x00f0ff,
        linewidth: 3
      });
      const pathLine = new THREE.Line(pathGeo, pathMat);
      this.telemetryGroup.add(pathLine);
    }

    if (simState.drone.comm === 'CONNECTED') {
      const commPoints = [
        new THREE.Vector3(simState.drone.x, simState.drone.y, simState.drone.z),
        new THREE.Vector3(-45, 8, -45)
      ];
      const commGeo = new THREE.BufferGeometry().setFromPoints(commPoints);
      const commMat = new THREE.LineDashedMaterial({ color: 0x00f0ff, dashSize: 1.2, gapSize: 1.2 });
      const commLine = new THREE.Line(commGeo, commMat);
      commLine.computeLineDistances();
      this.telemetryGroup.add(commLine);
    }
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
}

window.Scene3D = Scene3D;
