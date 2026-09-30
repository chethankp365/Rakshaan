import type { Scenario } from '../sim/types';

export const SCENARIOS: Record<string, Scenario> = {
  flood: {
    id: 'flood',
    name: 'Flood Construction Site',
    subtitle: 'River overflow, submerged scaffolding & trapped human targets',
    environmentType: 'flood',
    description: 'Severe monsoon flood innundating an 800m active construction zone along swollen riverbank.',
    duration: 180,
    helipadPosition: [-120, 2, -100],
    cameraAnchors: [
      { id: 'overview', name: 'Site Overview', position: [0, 80, 140], target: [0, 0, 0] },
      { id: 'tower', name: 'Tower Scaffolding', position: [25, 25, 30], target: [20, 15, 0] },
      { id: 'river', name: 'River Evac Zone', position: [-80, 18, 50], target: [-40, 2, 20] },
      { id: 'drone_chase', name: 'Drone Chase', position: [0, 15, 25], target: [0, 12, 0] },
    ],
    hazards: [
      {
        id: 'h-flood-1',
        name: 'FLOOD HAZARD ZONE',
        kind: 'water',
        severity: 'high',
        color: '#E63946',
        label: 'HIGH WATER LEVEL (RISING 0.5m/hr)',
        location: [20, 4, -10],
        polygon: [
          [-80, -90], [100, -90], [120, 80], [-60, 100], [-100, 20]
        ]
      },
      {
        id: 'h-flood-2',
        name: 'RIVER / FLOODPLAIN',
        kind: 'water',
        severity: 'high',
        color: '#E63946',
        label: 'DANGER: DEEP WATER KEEP OUT',
        location: [-140, 2, 0],
        polygon: [
          [-220, -180], [-100, -180], [-80, 180], [-200, 180]
        ]
      },
      {
        id: 'h-flood-3',
        name: 'SCAFFOLDING COLLAPSE RISK',
        kind: 'structural',
        severity: 'medium',
        color: '#FB923C',
        label: 'UNSTABLE TOWER CRANE BASE',
        location: [45, 12, -40],
        polygon: [
          [20, -60], [70, -60], [70, -20], [20, -20]
        ]
      }
    ],
    survivors: [
      {
        id: 'S-01',
        name: 'Target S-01',
        species: 'Human (Homo Sapiens)',
        estimatedAge: '34 Yrs',
        position: [22, 18, -35],
        condition: 'Trapped on high platform structure',
        thermalTemp: 37.2,
        urgencyScore: 9,
        status: 'stranded',
        locationDescription: 'Tower Crane A - Cabin Platform (Alt +18m)'
      },
      {
        id: 'S-02',
        name: 'Target S-02',
        species: 'Human (Homo Sapiens)',
        estimatedAge: '28 Yrs',
        position: [60, 4.5, 40],
        condition: 'Stranded on shipping container roof',
        thermalTemp: 35.8,
        urgencyScore: 7,
        status: 'located',
        locationDescription: 'East Storage Yard - Container C-04'
      },
      {
        id: 'S-03',
        name: 'Target S-03',
        species: 'Human (Homo Sapiens)',
        estimatedAge: '45 Yrs',
        position: [-35, 3.2, 10],
        condition: 'Hypothermic risk, in water hazard',
        thermalTemp: 34.1,
        urgencyScore: 8,
        status: 'critical',
        locationDescription: 'South Basin - Floating Sector 2'
      },
      {
        id: 'S-04',
        name: 'Target S-04',
        species: 'Human (Homo Sapiens)',
        estimatedAge: '9 Yrs (Child)',
        position: [-95, 6, -60],
        condition: 'Stationary on 2nd floor balcony',
        thermalTemp: 36.8,
        urgencyScore: 5,
        status: 'stranded',
        locationDescription: 'Administration Building Balcony'
      }
    ],
    responders: [
      {
        id: 'R-01',
        name: 'NDRF Rescue Squad Alpha',
        team: 'NDRF Unit 4',
        position: [-110, 0.5, 60],
        waypoints: [[-110, 0.5, 60], [-70, 0.5, 30], [-35, 0.5, 12], [20, 0.5, 20]],
        role: 'Rescue Boat Team',
        isWading: false
      },
      {
        id: 'R-02',
        name: 'Ground Medic Team 1',
        team: 'State Disaster Response',
        position: [-130, 2, -80],
        waypoints: [[-130, 2, -80], [-100, 2, -50], [-70, 2, -10]],
        role: 'Medical Triage & Supply Base',
        isWading: true
      }
    ],
    dronePathWaypoints: [
      { t: 0, pos: [-120, 15, -100], gimbal: { pan: 0, tilt: -15 }, mode: 'searching' },
      { t: 25, pos: [-80, 22, -50], gimbal: { pan: 25, tilt: -35 }, mode: 'searching' },
      { t: 50, pos: [-35, 12, 10], gimbal: { pan: -10, tilt: -60 }, mode: 'tracking' },
      { t: 80, pos: [22, 28, -35], gimbal: { pan: 45, tilt: -20 }, mode: 'alert' },
      { t: 110, pos: [60, 18, 40], gimbal: { pan: -30, tilt: -45 }, mode: 'tracking' },
      { t: 145, pos: [-40, 14, 30], gimbal: { pan: 0, tilt: -40 }, mode: 'replanning' },
      { t: 180, pos: [-120, 15, -100], gimbal: { pan: 0, tilt: -15 }, mode: 'searching' }
    ],
    waterLevelTrack: {
      keyframes: [
        { t: 0, value: 0.5 },
        { t: 60, value: 1.8 },
        { t: 120, value: 2.9 },
        { t: 180, value: 3.8 }
      ]
    },
    rainIntensityTrack: {
      keyframes: [
        { t: 0, value: 0.2 },
        { t: 50, value: 0.7 },
        { t: 110, value: 0.9 },
        { t: 180, value: 0.4 }
      ]
    },
    windSpeedTrack: {
      keyframes: [
        { t: 0, value: 12 },
        { t: 90, value: 25 },
        { t: 180, value: 18 }
      ]
    },
    events: [
      { t: 5, type: 'INFO', payload: { title: 'TAKEOFF COMPLETE', description: 'RAKSHAAN initiated autonomous grid pattern search over Construction Sector.' } },
      { t: 45, type: 'DISCOVERY', payload: { title: 'SPECIES DETECTED: HUMAN TARGET S-03', description: 'FLIR locked on hypothermic human species target. Heat signature: 34.1°C.', targetId: 'S-03', location: [-35, 3.2, 10], severity: 'high' } },
      { t: 75, type: 'HAZARD_ALERT', payload: { title: 'CRANE STRUCTURAL ALERT', description: 'LiDAR detected 4.2° tilt in Crane A frame due to rising river current.', severity: 'high' } },
      { t: 135, type: 'RESCUE_DISPATCH', payload: { title: 'NDRF BOAT DISPATCHED', description: 'Live coordinates streamed to NDRF Boat 1. Intercept ETA: 2.5 mins.' } },
      { t: 160, type: 'BATTERY_WARNING', payload: { title: 'TELEMETRY OPTIMAL', description: 'Battery 74%. GPS 14 Satellites. Edge AI confidence 98.4%.' } }
    ]
  },
  landslide: {
    id: 'landslide',
    name: 'Himalayan Landslide',
    subtitle: 'Mountain slope failure, blocked highway & isolated human targets',
    environmentType: 'landslide',
    description: 'Massive rockslide across National Highway NH-58 burying vehicles and isolating downstream settlement.',
    duration: 180,
    helipadPosition: [120, 35, 100],
    cameraAnchors: [
      { id: 'overview', name: 'Valley Overview', position: [0, 110, 160], target: [0, 20, 0] },
      { id: 'scar', name: 'Landslide Scar', position: [-40, 65, 30], target: [-80, 70, -40] },
      { id: 'road', name: 'Blocked Highway', position: [30, 25, 10], target: [0, 15, -10] },
      { id: 'village', name: 'Lower Village', position: [80, 20, -60], target: [50, 8, -40] }
    ],
    hazards: [
      {
        id: 'h-land-1',
        name: 'LANDSLIDE HAZARD ZONE',
        kind: 'landslide',
        severity: 'high',
        color: '#E63946',
        label: 'UNSTABLE SLOPE - HIGH RISK OF SECONDARY SLIDE',
        location: [-60, 50, -20],
        polygon: [
          [-140, -80], [-20, -100], [40, 20], [-80, 80]
        ]
      },
      {
        id: 'h-land-2',
        name: 'ROAD BLOCKED',
        kind: 'landslide',
        severity: 'medium',
        color: '#FB923C',
        label: 'DANGER: LANDSLIDE ZONE DO NOT ENTER',
        location: [10, 18, 0],
        polygon: [
          [-30, -20], [60, -20], [60, 20], [-30, 20]
        ]
      },
      {
        id: 'h-land-3',
        name: 'AFFECTED STRUCTURES',
        kind: 'structural',
        severity: 'low',
        color: '#FACC15',
        label: 'STRUCTURAL DAMAGE & ROCKFALL WARNING',
        location: [65, 10, -50],
        polygon: [
          [30, -80], [100, -80], [100, -20], [30, -20]
        ]
      }
    ],
    survivors: [
      {
        id: 'S-10',
        name: 'Target S-10',
        species: 'Human (Homo Sapiens)',
        estimatedAge: '38 Yrs',
        position: [-10, 16, 5],
        condition: 'Trapped inside vehicle under debris',
        thermalTemp: 36.6,
        urgencyScore: 10,
        status: 'critical',
        locationDescription: 'Debris Zone B - Highway Sector'
      },
      {
        id: 'S-11',
        name: 'Target S-11',
        species: 'Human (Homo Sapiens)',
        estimatedAge: '31 Yrs',
        position: [75, 14, -45],
        condition: 'Trapped on rooftop of damaged structure',
        thermalTemp: 37.0,
        urgencyScore: 8,
        status: 'located',
        locationDescription: 'Lower Valley Sector - Structure #12'
      },
      {
        id: 'S-12',
        name: 'Target S-12',
        species: 'Human (Homo Sapiens)',
        estimatedAge: '52 Yrs',
        position: [-45, 22, -15],
        condition: 'Stranded inside heavy machinery on upper ledge',
        thermalTemp: 36.9,
        urgencyScore: 6,
        status: 'stranded',
        locationDescription: 'Upper Cutting Ledge North'
      }
    ],
    responders: [
      {
        id: 'R-10',
        name: 'BRO Heavy Clearance Crew',
        team: 'Border Roads Organisation',
        position: [40, 17, 20],
        waypoints: [[40, 17, 20], [15, 17, 10], [-5, 16, 5]],
        role: 'Clearance Equipment Unit',
        isWading: false
      },
      {
        id: 'R-11',
        name: 'Air Rescue Chopper Unit',
        team: 'Air Force SAR',
        position: [120, 35, 100],
        waypoints: [[120, 35, 100], [60, 45, 20], [75, 22, -45]],
        role: 'Helicopter Air Winch Team',
        isWading: false
      }
    ],
    dronePathWaypoints: [
      { t: 0, pos: [120, 45, 100], gimbal: { pan: -30, tilt: -20 }, mode: 'searching' },
      { t: 30, pos: [50, 35, 40], gimbal: { pan: -45, tilt: -35 }, mode: 'searching' },
      { t: 60, pos: [-10, 24, 5], gimbal: { pan: 0, tilt: -70 }, mode: 'alert' },
      { t: 100, pos: [-45, 32, -15], gimbal: { pan: -60, tilt: -30 }, mode: 'tracking' },
      { t: 140, pos: [75, 26, -45], gimbal: { pan: 30, tilt: -50 }, mode: 'tracking' },
      { t: 180, pos: [120, 45, 100], gimbal: { pan: -30, tilt: -20 }, mode: 'searching' }
    ],
    debrisShiftTrack: {
      keyframes: [
        { t: 0, value: 0 },
        { t: 70, value: 1.2 },
        { t: 130, value: 3.5 },
        { t: 180, value: 4.8 }
      ]
    },
    rainIntensityTrack: {
      keyframes: [
        { t: 0, value: 0.4 },
        { t: 90, value: 0.8 },
        { t: 180, value: 0.3 }
      ]
    },
    windSpeedTrack: {
      keyframes: [
        { t: 0, value: 15 },
        { t: 90, value: 30 },
        { t: 180, value: 20 }
      ]
    },
    events: [
      { t: 10, type: 'INFO', payload: { title: '3D TERRAIN MAPPING', description: 'LiDAR scanner building volumetric elevation map of unstable cliff face.' } },
      { t: 50, type: 'DISCOVERY', payload: { title: 'SPECIES DETECTED: HUMAN TARGET S-10', description: 'Thermal camera identified heat signal inside vehicle target S-10.', targetId: 'S-10', location: [-10, 16, 5], severity: 'high' } },
      { t: 95, type: 'HAZARD_ALERT', payload: { title: 'SECONDARY ROCKFALL DETECTED', description: 'Optical motion detection registered 1.2m soil creep on upper escarpment.', severity: 'high' } },
      { t: 135, type: 'RESCUE_DISPATCH', payload: { title: 'CLEARANCE CREW DIRECTED', description: 'Optimal debris removal vector transmitted to Heavy Clearance Unit.' } }
    ]
  },
  cyclone: {
    id: 'cyclone',
    name: 'Coastal Cyclone',
    subtitle: 'Gale winds, storm surge inundation & down power lines',
    environmentType: 'cyclone',
    description: 'Super Cyclone making landfall over coastal port with 140km/h gust winds and 4m tidal surge.',
    duration: 180,
    helipadPosition: [140, 15, -120],
    cameraAnchors: [
      { id: 'overview', name: 'Coastal Overview', position: [0, 90, 150], target: [0, 0, 0] },
      { id: 'jetty', name: 'Storm Surge Jetty', position: [-80, 20, 40], target: [-100, 2, 80] },
      { id: 'town', name: 'Town Center', position: [20, 25, -20], target: [0, 5, -20] },
      { id: 'school', name: 'Relief Shelter School', position: [100, 22, -80], target: [90, 8, -70] }
    ],
    hazards: [
      {
        id: 'h-cyc-1',
        name: 'CYCLONE HAZARD ZONE',
        kind: 'wind',
        severity: 'high',
        color: '#E63946',
        label: 'STORM SURGE + HIGH WINDS (GUSTS > 120 KM/H)',
        location: [-60, 6, 40],
        polygon: [
          [-180, -20], [-20, -60], [20, 120], [-180, 120]
        ]
      },
      {
        id: 'h-cyc-2',
        name: 'FALLEN POWER LINES',
        kind: 'electrical',
        severity: 'high',
        color: '#E63946',
        label: 'ELECTROCUTION RISK - LIVE 11kV TRANSFORMER DOWN',
        location: [10, 4, -15],
        polygon: [
          [-10, -35], [35, -35], [35, 5], [-10, 5]
        ]
      },
      {
        id: 'h-cyc-3',
        name: 'STRUCTURAL DAMAGE',
        kind: 'structural',
        severity: 'medium',
        color: '#FB923C',
        label: 'BLOWN ROOFS & UNSTABLE MASONRY',
        location: [-20, 8, -70],
        polygon: [
          [-50, -110], [10, -110], [10, -50], [-50, -50]
        ]
      }
    ],
    survivors: [
      {
        id: 'S-20',
        name: 'Target S-20',
        species: 'Human (Homo Sapiens)',
        estimatedAge: '41 Yrs',
        position: [-110, 4.5, 65],
        condition: 'Trapped on cabin roof of grounded vessel',
        thermalTemp: 35.2,
        urgencyScore: 10,
        status: 'critical',
        locationDescription: 'Jetty Port Dock - Grounded Trawler'
      },
      {
        id: 'S-21',
        name: 'Target S-21',
        species: 'Human (Homo Sapiens)',
        estimatedAge: '26 Yrs',
        position: [-25, 7, -65],
        condition: 'Surrounded by floodwaters in damaged structure',
        thermalTemp: 36.4,
        urgencyScore: 7,
        status: 'located',
        locationDescription: 'Beach Road - Sector 4'
      },
      {
        id: 'S-22',
        name: 'Target S-22',
        species: 'Human (Homo Sapiens)',
        estimatedAge: '60 Yrs',
        position: [12, 3, -10],
        condition: 'Trapped near fallen power lines',
        thermalTemp: 37.1,
        urgencyScore: 9,
        status: 'stranded',
        locationDescription: 'Main Street Crossing - Substation Pole #8'
      }
    ],
    responders: [
      {
        id: 'R-20',
        name: 'Coast Guard Rescue Boat 04',
        team: 'Coast Guard',
        position: [-140, 1, 100],
        waypoints: [[-140, 1, 100], [-120, 1, 80], [-105, 1, 65]],
        role: 'Offshore Rescue Craft',
        isWading: false
      },
      {
        id: 'R-21',
        name: 'Disaster Rapid Relief Force',
        team: 'State Fire & Rescue',
        position: [100, 5, -80],
        waypoints: [[100, 5, -80], [60, 5, -50], [20, 5, -20]],
        role: 'Ambulance & Fire Engine Unit',
        isWading: true
      }
    ],
    dronePathWaypoints: [
      { t: 0, pos: [140, 25, -120], gimbal: { pan: 0, tilt: -15 }, mode: 'searching' },
      { t: 35, pos: [90, 20, -70], gimbal: { pan: -20, tilt: -30 }, mode: 'searching' },
      { t: 70, pos: [12, 16, -10], gimbal: { pan: 15, tilt: -60 }, mode: 'alert' },
      { t: 110, pos: [-110, 18, 65], gimbal: { pan: -45, tilt: -40 }, mode: 'tracking' },
      { t: 150, pos: [-25, 18, -65], gimbal: { pan: 30, tilt: -45 }, mode: 'tracking' },
      { t: 180, pos: [140, 25, -120], gimbal: { pan: 0, tilt: -15 }, mode: 'searching' }
    ],
    waterLevelTrack: {
      keyframes: [
        { t: 0, value: 1.0 },
        { t: 60, value: 2.5 },
        { t: 120, value: 4.2 },
        { t: 180, value: 5.0 }
      ]
    },
    rainIntensityTrack: {
      keyframes: [
        { t: 0, value: 0.6 },
        { t: 60, value: 0.95 },
        { t: 120, value: 1.0 },
        { t: 180, value: 0.8 }
      ]
    },
    windSpeedTrack: {
      keyframes: [
        { t: 0, value: 45 },
        { t: 70, value: 95 },
        { t: 130, value: 135 },
        { t: 180, value: 110 }
      ]
    },
    events: [
      { t: 5, type: 'INFO', payload: { title: 'STORM MODE ACTIVATED', description: 'RAKSHAAN flight stabilization system engaged auto pitch-compensation for wind gusts.' } },
      { t: 60, type: 'HAZARD_ALERT', payload: { title: 'LIVE POWER LINE DANGER', description: 'Computer Vision flagged severed 11kV electrical wire lying across flooded road near S-22.', severity: 'high' } },
      { t: 100, type: 'DISCOVERY', payload: { title: 'SPECIES DETECTED: HUMAN TARGET S-20', description: 'Thermal camera identified 3 human targets on boat roof amidst 4m storm surge waves.', targetId: 'S-20', location: [-110, 4.5, 65], severity: 'high' } },
      { t: 140, type: 'RESCUE_DISPATCH', payload: { title: 'COAST GUARD SIGNALLED', description: 'Emergency beacon link established with Coast Guard Rescue Boat 04.' } }
    ]
  }
};
