/**
 * Deterministic Pseudo-Random Number Generator (PRNG) using Mulberry32.
 * Ensures identical replays for 4D simulation.
 */

export function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Creates a seeded random function with integer seed
 */
export function createRNG(seed: number = 1337) {
  const rng = mulberry32(seed);
  return {
    next: () => rng(),
    range: (min: number, max: number) => min + rng() * (max - min),
    int: (min: number, max: number) => Math.floor(min + rng() * (max - min + 1)),
    choice: <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)],
  };
}

/**
 * Simple 1D deterministic hash-based noise for smooth spatial/temporal wobble without external dependencies.
 */
export function pseudoNoise1D(x: number, seed: number = 42): number {
  const n = Math.sin(x * 12.9898 + seed * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

export function smoothNoise1D(x: number, seed: number = 42): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3.0 - 2.0 * f);
  const n0 = pseudoNoise1D(i, seed);
  const n1 = pseudoNoise1D(i + 1, seed);
  return n0 * (1 - u) + n1 * u;
}
