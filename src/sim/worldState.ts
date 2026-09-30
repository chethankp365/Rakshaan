import { SCENARIOS } from '../config/scenarios';
import type { WorldState, DroneState, Survivor, Responder } from './types';
import { sampleTrack, interpolateWaypoints, eventsBetween } from './timeline';
import { createRNG, smoothNoise1D } from './rng';
import { getMissionStepForTime } from '../config/mission';
import { useAppStore } from '../store/appStore';

export function getWorldState(t: number, scenarioId: string): WorldState {
  const scenario = SCENARIOS[scenarioId] || SCENARIOS.flood;
  const rng = createRNG(1337 + Math.floor(t * 100));

  // Get current active 12-step mission step
  const currentStep = getMissionStepForTime(t);

  // Read Stress Test toggles from store
  const storeState = useAppStore.getState();
  const { stressGpsLoss, stressCommLoss, stressHazardInject, stressLowBattery } = storeState;

  // Drone path pose interpolation
  const dronePose = interpolateWaypoints(scenario.dronePathWaypoints, t);

  // Hover wobble
  const wobbleX = (smoothNoise1D(t * 2.0, 101) - 0.5) * 0.35;
  const wobbleY = (smoothNoise1D(t * 2.5, 202) - 0.5) * 0.25;
  const wobbleZ = (smoothNoise1D(t * 1.8, 303) - 0.5) * 0.35;

  const basePos: [number, number, number] = [
    dronePose.pos[0] + wobbleX,
    dronePose.pos[1] + wobbleY,
    dronePose.pos[2] + wobbleZ,
  ];

  // Calculate battery drain
  let battery = Math.max(15, 100 - (t / 180) * 35);
  if (stressLowBattery) {
    battery = Math.min(battery, 18.5);
  }

  // GPS & Comm resilience
  const gpsFix = !stressGpsLoss && t < 120; // Step 09 simulates brief drop or stress test
  const satellites = gpsFix ? 14 + Math.floor(rng.next() * 3) : 3;
  const positionUncertainty = gpsFix ? 0.05 : 7.4 + Math.sin(t * 3) * 2.1;

  const commLink = stressCommLoss
    ? 0
    : Math.min(100, Math.max(65, 98 - (t / 180) * 15 + (rng.next() - 0.5) * 4));

  // Mode override if stress tests or step mode
  let effectiveMode = currentStep.droneMode;
  if (stressGpsLoss || stressCommLoss) effectiveMode = 'failsafe';
  if (stressLowBattery || battery < 20) effectiveMode = 'rth';
  if (stressHazardInject || currentStep.id === 7 || currentStep.id === 8) effectiveMode = 'replanning';

  // Gimbal tracking logic: aim at survivor #1 or ground
  let gimbalPan = dronePose.gimbal.pan;
  let gimbalTilt = dronePose.gimbal.tilt;
  if (currentStep.id >= 4 && currentStep.id <= 6) {
    gimbalPan = 35;
    gimbalTilt = -45;
  } else if (currentStep.id === 10) {
    gimbalPan = (t * 20) % 360 - 180;
    gimbalTilt = -55;
  }

  // Generate ghost trail (history of past positions)
  const ghostTrail: [number, number, number][] = [];
  const trailStep = Math.max(1, Math.floor(t / 25));
  for (let pastT = 0; pastT <= t; pastT += trailStep) {
    const pastPose = interpolateWaypoints(scenario.dronePathWaypoints, pastT);
    ghostTrail.push(pastPose.pos);
  }

  const droneState: DroneState = {
    position: basePos,
    heading: dronePose.heading,
    battery,
    gpsFix,
    satellites,
    commLink,
    mode: effectiveMode,
    gimbal: { pan: gimbalPan, tilt: gimbalTilt },
    altimeter: basePos[1],
    speed: 5.5 + smoothNoise1D(t * 0.5, 404) * 6.5,
    gpsLossActive: stressGpsLoss,
    commLossActive: stressCommLoss,
    positionUncertainty,
    ghostTrail,
  };

  // Environmental tracks
  const waterLevel = sampleTrack(scenario.waterLevelTrack, t, 0.5);
  const rainIntensity = sampleTrack(scenario.rainIntensityTrack, t, 0.2);
  const windSpeed = sampleTrack(scenario.windSpeedTrack, t, 15);
  const debrisOffset = sampleTrack(scenario.debrisShiftTrack, t, 0);

  const sunAngle = (t / 180) * Math.PI * 0.4 + Math.PI * 0.25;
  const activeEvents = eventsBetween(scenario.events, 0, t);

  // Coverage percentage computation
  const coveragePercent = Math.min(100, Math.max(0, Math.floor((t / 165) * 100)));

  // Survivors status & confidence update
  const survivors: Survivor[] = scenario.survivors.map((s, idx) => {
    let currentStatus = s.status;
    let confidence = 0.92 + (rng.next() - 0.5) * 0.08;

    if (t >= 45) {
      if (idx === 0) currentStatus = t >= 165 ? 'rescued' : t >= 135 ? 'located' : 'critical';
      else currentStatus = 'located';
    }

    const shiftX = (smoothNoise1D(t * 0.5 + idx * 10, 555) - 0.5) * 0.15;
    const shiftZ = (smoothNoise1D(t * 0.4 + idx * 10, 666) - 0.5) * 0.15;

    let fluidOrHeight = 'Normal Ground';
    if (scenario.environmentType === 'flood') fluidOrHeight = `Water Level: ${(waterLevel * 0.8).toFixed(1)}m`;
    else if (scenario.environmentType === 'landslide') fluidOrHeight = `Debris Depth: ${(debrisOffset + 1.2).toFixed(1)}m`;
    else fluidOrHeight = `Wind Gusts: ${(windSpeed * 1.1).toFixed(0)} km/h`;

    return {
      ...s,
      status: currentStatus,
      confidence: Math.round(confidence * 100) / 100,
      fluidOrHeightHazard: fluidOrHeight,
      position: [
        s.position[0] + shiftX,
        s.position[1] + (scenario.environmentType === 'flood' ? waterLevel * 0.35 : 0),
        s.position[2] + shiftZ,
      ],
    };
  });

  // Responders path navigation & dispatch state
  const responders: Responder[] = scenario.responders.map((r, rIdx) => {
    let rStatus: Responder['status'] = 'standby';
    let assignedSurvivorId: string | undefined = undefined;
    let etaSeconds: number | undefined = undefined;

    if (rIdx === 0 && t >= 135) {
      rStatus = t >= 165 ? 'completed' : 'dispatched';
      assignedSurvivorId = 'S-01';
      etaSeconds = Math.max(0, Math.floor(165 - t));
    }

    if (r.waypoints.length <= 1) return { ...r, status: rStatus, assignedSurvivorId, etaSeconds };

    const progress = (t / 180) * (r.waypoints.length - 1);
    const idx = Math.min(Math.floor(progress), r.waypoints.length - 2);
    const frac = progress - idx;

    const p1 = r.waypoints[idx];
    const p2 = r.waypoints[idx + 1];

    const posX = p1[0] + frac * (p2[0] - p1[0]);
    const posY = p1[1] + frac * (p2[1] - p1[1]) + (r.isWading ? waterLevel * 0.3 : 0);
    const posZ = p1[2] + frac * (p2[2] - p1[2]);

    return {
      ...r,
      position: [posX, posY, posZ],
      status: rStatus,
      assignedSurvivorId,
      etaSeconds,
    };
  });

  // Dynamic injected hazard & replanned route
  const injectedHazardActive = stressHazardInject || currentStep.id === 7 || currentStep.id === 8;
  let replannedRoute: [number, number, number][] | null = null;
  if (injectedHazardActive) {
    replannedRoute = [
      droneState.position,
      [droneState.position[0] + 15, droneState.position[1] + 8, droneState.position[2] - 25],
      [survivors[0]?.position[0] || 20, 25, survivors[0]?.position[2] || -30],
    ];
  }

  return {
    t,
    scenarioId,
    drone: droneState,
    waterLevel,
    rainIntensity,
    windSpeed,
    windDirection: Math.PI * 0.35,
    debrisOffset,
    sunAngle,
    hazards: scenario.hazards,
    survivors,
    responders,
    activeEvents,
    coveragePercent,
    currentStep,
    injectedHazardActive,
    replannedRoute,
  };
}
