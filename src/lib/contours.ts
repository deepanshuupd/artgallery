/**
 * Deterministic contour lines for the homepage road. The same seed always
 * draws the same hills, so server and client markup match.
 */

function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Point = [number, number];

/** A closed Catmull-Rom curve through the points, as cubic Bézier segments. */
function closedCurve(points: Point[]): string {
  const at = (index: number) => points[(index + points.length) % points.length];
  let path = `M${at(0)[0].toFixed(1)} ${at(0)[1].toFixed(1)}`;
  for (let index = 0; index < points.length; index++) {
    const [p0, p1, p2, p3] = [at(index - 1), at(index), at(index + 1), at(index + 2)];
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    path += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${path}Z`;
}

/** Rings around a few peaks on a 400 x 600 canvas; more rings read as higher ground. */
export function hillContours(seed: number, peaks: number, rings: number): string[] {
  const next = random(seed);
  const paths: string[] = [];
  for (let peak = 0; peak < peaks; peak++) {
    const cx = 60 + next() * 280;
    const cy = 80 + next() * 440;
    const stretch = 0.75 + next() * 0.6;
    const phases = [next() * 6.28, next() * 6.28, next() * 6.28];
    for (let ring = 1; ring <= rings; ring++) {
      const radius = 14 + ring * (18 + next() * 4);
      const points: Point[] = [];
      for (let step = 0; step < 36; step++) {
        const angle = (step / 36) * Math.PI * 2;
        const wobble = 1 + 0.16 * Math.sin(angle * 3 + phases[0] + ring * 0.2) + 0.08 * Math.sin(angle * 5 + phases[1]) + 0.05 * Math.sin(angle * 2 + phases[2] - ring * 0.3);
        points.push([cx + Math.cos(angle) * radius * wobble * stretch, cy + Math.sin(angle) * radius * wobble]);
      }
      paths.push(closedCurve(points));
    }
  }
  return paths;
}

/** Long, shallow lines for the plains: the river terrace below the hills. */
export function plainLines(seed: number, lines: number): string[] {
  const next = random(seed);
  const paths: string[] = [];
  for (let line = 0; line < lines; line++) {
    const y = 30 + line * (540 / lines) + next() * 12;
    const amplitude = 4 + next() * 10;
    const phase = next() * 6.28;
    let path = `M-10 ${y.toFixed(1)}`;
    for (let x = 0; x <= 420; x += 20) {
      path += `L${x} ${(y + Math.sin(x / 60 + phase) * amplitude).toFixed(1)}`;
    }
    paths.push(path);
  }
  return paths;
}
