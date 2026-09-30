import type { TimelineTrack, MissionEvent } from './types';

export function sampleTrack(track: TimelineTrack<number> | undefined, t: number, defaultValue: number = 0): number {
  if (!track || !track.keyframes || track.keyframes.length === 0) return defaultValue;
  const kfs = track.keyframes;
  if (t <= kfs[0].t) return kfs[0].value;
  if (t >= kfs[kfs.length - 1].t) return kfs[kfs.length - 1].value;

  for (let i = 0; i < kfs.length - 1; i++) {
    if (t >= kfs[i].t && t <= kfs[i + 1].t) {
      const alpha = (t - kfs[i].t) / (kfs[i + 1].t - kfs[i].t);
      return kfs[i].value + alpha * (kfs[i + 1].value - kfs[i].value);
    }
  }

  return defaultValue;
}

export function eventsBetween(events: MissionEvent[], t0: number, t1: number): MissionEvent[] {
  const minT = Math.min(t0, t1);
  const maxT = Math.max(t0, t1);
  return events.filter(e => e.t >= minT && e.t <= maxT);
}

export function catmullRom3D(
  p0: [number, number, number],
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number],
  t: number
): [number, number, number] {
  const t2 = t * t;
  const t3 = t2 * t;

  const f0 = -0.5 * t3 + t2 - 0.5 * t;
  const f1 = 1.5 * t3 - 2.5 * t2 + 1.0;
  const f2 = -1.5 * t3 + 2.0 * t2 + 0.5 * t;
  const f3 = 0.5 * t3 - 0.5 * t2;

  const x = p0[0] * f0 + p1[0] * f1 + p2[0] * f2 + p3[0] * f3;
  const y = p0[1] * f0 + p1[1] * f1 + p2[1] * f2 + p3[1] * f3;
  const z = p0[2] * f0 + p1[2] * f1 + p2[2] * f2 + p3[2] * f3;

  return [x, y, z];
}

export function interpolateWaypoints(
  waypoints: Array<{ t: number; pos: [number, number, number]; gimbal: { pan: number; tilt: number }; mode: any }>,
  t: number
): { pos: [number, number, number]; gimbal: { pan: number; tilt: number }; mode: any; heading: number } {
  if (waypoints.length === 0) {
    return { pos: [0, 10, 0], gimbal: { pan: 0, tilt: -30 }, mode: 'hover', heading: 0 };
  }
  if (t <= waypoints[0].t) {
    return { ...waypoints[0], heading: 0 };
  }
  if (t >= waypoints[waypoints.length - 1].t) {
    const last = waypoints[waypoints.length - 1];
    return { ...last, heading: 0 };
  }

  let idx = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    if (t >= waypoints[i].t && t <= waypoints[i + 1].t) {
      idx = i;
      break;
    }
  }

  const p1 = waypoints[idx];
  const p2 = waypoints[idx + 1];
  const p0 = waypoints[Math.max(0, idx - 1)];
  const p3 = waypoints[Math.min(waypoints.length - 1, idx + 2)];

  const alpha = (t - p1.t) / (p2.t - p1.t);

  const pos = catmullRom3D(p0.pos, p1.pos, p2.pos, p3.pos, alpha);

  const nextAlpha = Math.min(1.0, alpha + 0.05);
  const nextPos = catmullRom3D(p0.pos, p1.pos, p2.pos, p3.pos, nextAlpha);
  const dx = nextPos[0] - pos[0];
  const dz = nextPos[2] - pos[2];
  const heading = Math.atan2(dx, dz);

  const pan = p1.gimbal.pan + alpha * (p2.gimbal.pan - p1.gimbal.pan);
  const tilt = p1.gimbal.tilt + alpha * (p2.gimbal.tilt - p1.gimbal.tilt);

  return {
    pos,
    gimbal: { pan, tilt },
    mode: p1.mode,
    heading,
  };
}
