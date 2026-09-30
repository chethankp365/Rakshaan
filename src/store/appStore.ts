import { create } from 'zustand';
import type { AppMode, QualityLevel, CameraViewMode, RescueCamMode, TabletTab, CameraSnapshot } from '../sim/types';

interface AppStoreState {
  mode: AppMode;
  scenario: string;
  quality: QualityLevel;
  mute: boolean;
  inspectDrone: boolean;
  showFootprint: boolean;
  showTrail: boolean;
  activeCameraAnchor: string;
  fps: number;
  toastMessage: string | null;

  // Prompt 2 specific UI & Autonomy States
  cameraMode: CameraViewMode;
  autoDirector: boolean;
  pipSwapped: boolean;

  stressGpsLoss: boolean;
  stressCommLoss: boolean;
  stressHazardInject: boolean;
  stressLowBattery: boolean;

  explainPanelOpen: boolean;
  showMeWhyOpen: boolean;
  cinematicTourActive: boolean;
  selectedSurvivorId: string | null;

  // Mode B Rescue Team Simulation States
  rescueCamMode: RescueCamMode;
  tabletOpen: boolean;
  activeTabletTab: TabletTab;
  aboutModalOpen: boolean;
  shortcutsModalOpen: boolean;
  printReportOpen: boolean;
  snapshots: CameraSnapshot[];
  dispatchedMap: Record<string, boolean>;
  acknowledgedAlerts: Record<string, boolean>;

  // Actions
  setMode: (mode: AppMode) => void;
  setScenario: (scenario: string) => void;
  setQuality: (quality: QualityLevel) => void;
  toggleMute: () => void;
  setInspectDrone: (inspect: boolean) => void;
  toggleFootprint: () => void;
  toggleTrail: () => void;
  setActiveCameraAnchor: (anchor: string) => void;
  setFps: (fps: number) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;

  setCameraMode: (cam: CameraViewMode, manual?: boolean) => void;
  setRescueCamMode: (cam: RescueCamMode, manual?: boolean) => void;
  toggleAutoDirector: () => void;
  togglePipSwap: () => void;
  setTabletOpen: (open: boolean) => void;
  toggleTabletOpen: () => void;
  setActiveTabletTab: (tab: TabletTab) => void;

  toggleStressGpsLoss: () => void;
  toggleStressCommLoss: () => void;
  toggleStressHazardInject: () => void;
  toggleStressLowBattery: () => void;
  resetStressTests: () => void;

  setExplainPanelOpen: (open: boolean) => void;
  setShowMeWhyOpen: (open: boolean) => void;
  setCinematicTourActive: (active: boolean) => void;
  setSelectedSurvivorId: (id: string | null) => void;

  setAboutModalOpen: (open: boolean) => void;
  setShortcutsModalOpen: (open: boolean) => void;
  setPrintReportOpen: (open: boolean) => void;
  addSnapshot: (snapshot: CameraSnapshot) => void;
  dispatchResponderToSurvivor: (survivorId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  mode: 'menu',
  scenario: 'flood',
  quality: 'medium',
  mute: true,
  inspectDrone: false,
  showFootprint: true,
  showTrail: true,
  activeCameraAnchor: 'overview',
  fps: 60,
  toastMessage: null,

  cameraMode: 'chase',
  autoDirector: true,
  pipSwapped: false,

  stressGpsLoss: false,
  stressCommLoss: false,
  stressHazardInject: false,
  stressLowBattery: false,

  explainPanelOpen: false,
  showMeWhyOpen: false,
  cinematicTourActive: false,
  selectedSurvivorId: null,

  rescueCamMode: 'wide',
  tabletOpen: false,
  activeTabletTab: 'live',
  aboutModalOpen: false,
  shortcutsModalOpen: false,
  printReportOpen: false,
  snapshots: [],
  dispatchedMap: {},
  acknowledgedAlerts: {},

  setMode: (mode) => set({ mode }),
  setScenario: (scenario) => set({ scenario }),
  setQuality: (quality) => set({ quality }),
  toggleMute: () => set((state) => ({ mute: !state.mute })),
  setInspectDrone: (inspectDrone) => set({ inspectDrone }),
  toggleFootprint: () => set((state) => ({ showFootprint: !state.showFootprint })),
  toggleTrail: () => set((state) => ({ showTrail: !state.showTrail })),
  setActiveCameraAnchor: (activeCameraAnchor) => set({ activeCameraAnchor }),
  setFps: (fps) => set({ fps }),
  showToast: (toastMessage) => set({ toastMessage }),
  clearToast: () => set({ toastMessage: null }),

  setCameraMode: (cameraMode, manual = false) =>
    set((state) => ({
      cameraMode,
      autoDirector: manual ? false : state.autoDirector,
    })),
  setRescueCamMode: (rescueCamMode, manual = false) =>
    set((state) => ({
      rescueCamMode,
      autoDirector: manual ? false : state.autoDirector,
    })),
  toggleAutoDirector: () => set((state) => ({ autoDirector: !state.autoDirector })),
  togglePipSwap: () => set((state) => ({ pipSwapped: !state.pipSwapped })),

  setTabletOpen: (tabletOpen) => set({ tabletOpen }),
  toggleTabletOpen: () => set((state) => ({ tabletOpen: !state.tabletOpen })),
  setActiveTabletTab: (activeTabletTab) => set({ activeTabletTab }),

  toggleStressGpsLoss: () =>
    set((state) => ({
      stressGpsLoss: !state.stressGpsLoss,
      toastMessage: !state.stressGpsLoss
        ? 'STRESS TEST: Injected GPS Signal Loss (IMU + Vision Fallback Active)'
        : 'STRESS TEST: Restored GPS Fix',
    })),
  toggleStressCommLoss: () =>
    set((state) => ({
      stressCommLoss: !state.stressCommLoss,
      toastMessage: !state.stressCommLoss
        ? 'STRESS TEST: Injected Comm Link Loss (Edge AI Autonomous Mode Engaged)'
        : 'STRESS TEST: Restored Telemetry Link',
    })),
  toggleStressHazardInject: () =>
    set((state) => ({
      stressHazardInject: !state.stressHazardInject,
      toastMessage: !state.stressHazardInject
        ? 'STRESS TEST: Injected Dynamic Hazard Zone (Path Replanning Triggered)'
        : 'STRESS TEST: Cleared Dynamic Hazard',
    })),
  toggleStressLowBattery: () =>
    set((state) => ({
      stressLowBattery: !state.stressLowBattery,
      toastMessage: !state.stressLowBattery
        ? 'STRESS TEST: Simulated Critical Battery Threshold (Return-To-Home Protocol Enforced)'
        : 'STRESS TEST: Battery Nominal',
    })),
  resetStressTests: () =>
    set({
      stressGpsLoss: false,
      stressCommLoss: false,
      stressHazardInject: false,
      stressLowBattery: false,
    }),

  setExplainPanelOpen: (explainPanelOpen) => set({ explainPanelOpen }),
  setShowMeWhyOpen: (showMeWhyOpen) => set({ showMeWhyOpen }),
  setCinematicTourActive: (cinematicTourActive) => set({ cinematicTourActive }),
  setSelectedSurvivorId: (selectedSurvivorId) => set({ selectedSurvivorId }),

  setAboutModalOpen: (aboutModalOpen) => set({ aboutModalOpen }),
  setShortcutsModalOpen: (shortcutsModalOpen) => set({ shortcutsModalOpen }),
  setPrintReportOpen: (printReportOpen) => set({ printReportOpen }),

  addSnapshot: (snapshot) =>
    set((state) => ({
      snapshots: [snapshot, ...state.snapshots],
      toastMessage: `Snapshot captured frame [${snapshot.timestamp}] saved to gallery`,
    })),

  dispatchResponderToSurvivor: (survivorId) =>
    set((state) => ({
      dispatchedMap: { ...state.dispatchedMap, [survivorId]: true },
      toastMessage: `DISPATCH: Rescue Squad assigned to target ${survivorId}. ETA vector generated.`,
    })),

  acknowledgeAlert: (alertId) =>
    set((state) => ({
      acknowledgedAlerts: { ...state.acknowledgedAlerts, [alertId]: true },
      toastMessage: `Radio Ack: Team member confirmed alert #${alertId}`,
    })),
}));

