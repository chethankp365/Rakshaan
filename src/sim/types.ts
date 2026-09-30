export type QualityLevel = 'low' | 'medium' | 'high';
export type AppMode = 'menu' | 'drone' | 'rescue';
export type EnvironmentType = 'flood' | 'landslide' | 'cyclone';
export type DroneMode = 'searching' | 'tracking' | 'replanning' | 'alert' | 'hover' | 'rth' | 'failsafe';
export type HazardSeverity = 'high' | 'medium' | 'low';
export type CameraViewMode = 'chase' | 'fpv' | 'thermal' | 'lidar' | 'tactical' | 'orbit' | 'rescuer' | 'cinematic';
export type RescueCamMode = 'wide' | 'tablet' | 'hero' | 'ground' | 'tactical';
export type TabletTab = 'live' | 'map' | 'survivors' | 'hazards' | 'drone' | 'comms' | 'report';

export interface DataPacket {
  id: string;
  type: 'video' | 'detection' | 'telemetry' | 'geotag';
  progress: number; // 0 to 1
  color: string;
  payload: string;
}

export interface CameraSnapshot {
  id: string;
  timestamp: string;
  mode: CameraViewMode;
  targetId?: string;
  imageUrl?: string;
}

export interface Hazard {
  id: string;
  name: string;
  kind: 'water' | 'landslide' | 'wind' | 'electrical' | 'structural';
  severity: HazardSeverity;
  polygon: [number, number][]; // 2D polygon [x, z] relative coordinates
  color: string;
  label: string;
  location: [number, number, number]; // 3D center for callout
  activeFromTime?: number;
}

export interface Survivor {
  id: string;
  name: string;
  species: string;
  estimatedAge: string;
  position: [number, number, number];
  condition: string;
  thermalTemp: number; // e.g., 34.2 (hypothermic) or 37.1 (normal)
  urgencyScore: number; // 1 to 10
  status: 'stranded' | 'located' | 'rescued' | 'critical';
  locationDescription: string;
  fluidOrHeightHazard?: string;
  confidence?: number;
}

export interface Responder {
  id: string;
  name: string;
  team: string;
  position: [number, number, number];
  waypoints: [number, number, number][];
  role: string;
  isWading?: boolean;
  status?: 'standby' | 'dispatched' | 'rescuing' | 'completed';
  assignedSurvivorId?: string;
  etaSeconds?: number;
}

export interface DroneState {
  position: [number, number, number];
  heading: number; // radians
  battery: number; // percentage 0 - 100
  gpsFix: boolean;
  satellites: number;
  commLink: number; // signal quality percentage
  mode: DroneMode;
  gimbal: {
    pan: number;  // degrees
    tilt: number; // degrees
  };
  altimeter: number;
  speed: number;
  gpsLossActive?: boolean;
  commLossActive?: boolean;
  positionUncertainty?: number; // radius in meters
  ghostTrail?: [number, number, number][];
}

export interface MissionEvent {
  t: number;
  type: 'DISCOVERY' | 'HAZARD_ALERT' | 'RESCUE_DISPATCH' | 'BATTERY_WARNING' | 'COMM_DROP' | 'GPS_LOSS' | 'INFO';
  payload: {
    title: string;
    description: string;
    targetId?: string;
    location?: [number, number, number];
    severity?: HazardSeverity;
  };
}

export interface MissionStepDef {
  id: number; // 1 to 12
  code: string; // '01', '02', ..., '12'
  title: string;
  shortDesc: string;
  fullDesc: string;
  startTime: number;
  endTime: number;
  hudBanner: string;
  droneMode: DroneMode;
  ledColor: string; // '#22D3EE', '#22C55E', '#FACC15', '#E63946'
  suggestedCamera: CameraViewMode;
  pipelineStage: 'Sensors' | 'Perception' | 'Sensor Fusion' | 'Geo-tagging' | 'Risk Assessment' | 'Mission Intelligence' | 'Action';
  explanationText: string;
}

export interface TimelineTrack<T> {
  keyframes: Array<{ t: number; value: T }>;
}

export interface Scenario {
  id: string;
  name: string;
  subtitle: string;
  environmentType: EnvironmentType;
  description: string;
  cameraAnchors: Array<{ id: string; name: string; position: [number, number, number]; target: [number, number, number] }>;
  helipadPosition: [number, number, number];
  hazards: Hazard[];
  survivors: Survivor[];
  responders: Responder[];
  dronePathWaypoints: Array<{ t: number; pos: [number, number, number]; gimbal: { pan: number; tilt: number }; mode: DroneMode }>;
  waterLevelTrack?: TimelineTrack<number>;
  rainIntensityTrack?: TimelineTrack<number>;
  windSpeedTrack?: TimelineTrack<number>;
  debrisShiftTrack?: TimelineTrack<number>;
  events: MissionEvent[];
  duration: number; // total mission replay time in seconds (e.g. 180s)
}

export interface WorldState {
  t: number;
  scenarioId: string;
  drone: DroneState;
  waterLevel: number;
  rainIntensity: number;
  windSpeed: number;
  windDirection: number; // angle rad
  debrisOffset: number;
  sunAngle: number;
  hazards: Hazard[];
  survivors: Survivor[];
  responders: Responder[];
  activeEvents: MissionEvent[];
  coveragePercent: number;
  currentStep: MissionStepDef;
  injectedHazardActive: boolean;
  replannedRoute: [number, number, number][] | null;
}

