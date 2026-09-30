import { create } from 'zustand';

export type PlaybackSpeed = 0.25 | 0.5 | 1 | 2 | 4;

interface ClockStoreState {
  t: number;
  maxT: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
  isLooping: boolean;

  // Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  seek: (t: number) => void;
  setLooping: (loop: boolean) => void;
  setMaxT: (maxT: number) => void;
  tick: (deltaSeconds: number) => void;
  reset: () => void;
}

export const useClockStore = create<ClockStoreState>((set) => ({
  t: 0,
  maxT: 180,
  isPlaying: true,
  speed: 1,
  isLooping: true,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (speed) => set({ speed }),
  seek: (targetT) => set((state) => ({ t: Math.max(0, Math.min(state.maxT, targetT)) })),
  setLooping: (isLooping) => set({ isLooping }),
  setMaxT: (maxT) => set({ maxT }),

  tick: (deltaSeconds: number) =>
    set((state) => {
      if (!state.isPlaying) return state;

      let nextT = state.t + deltaSeconds * state.speed;
      if (nextT >= state.maxT) {
        if (state.isLooping) {
          nextT = nextT % state.maxT;
        } else {
          nextT = state.maxT;
          return { t: nextT, isPlaying: false };
        }
      } else if (nextT < 0) {
        nextT = 0;
      }
      return { t: nextT };
    }),

  reset: () => set({ t: 0, isPlaying: true }),
}));
