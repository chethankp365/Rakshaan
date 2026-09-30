export const PALETTE = {
  bgNavy: '#0B1A2E',
  panelNavy: '#10243F',
  cyan: '#22D3EE',
  droneOrange: '#F58220',
  hazardRed: '#E63946',
  cautionAmber: '#FACC15',
  cautionOrange: '#FB923C',
  safeGreen: '#22C55E',
  infoBlue: '#3B82F6',
  textWhite: '#F8FAFC',
  droneBlueGray: '#4A7FA8',
  carbonDark: '#1E2733',
} as const;

export const HAZARD_COLORS = {
  high: '#E63946',   // Immediate evacuation
  medium: '#FB923C', // Restricted access
  low: '#FACC15',    // Caution
} as const;

export const FONTS = {
  heading: "system-ui, -apple-system, sans-serif",
  telemetry: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
} as const;

export const Z_INDEX = {
  scene: 0,
  hud: 10,
  overlay: 20,
  modal: 30,
  toast: 40,
} as const;
