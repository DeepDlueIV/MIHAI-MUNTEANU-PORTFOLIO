/** @typedef {'full'|'reduced'|'off'} MotionMode */
export const MOTION_KEY = 'mm-portfolio-motion';
export const CYCLE_SECONDS = 12;
export const SHOWCASE_SECONDS = 6;
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
/** @returns {MotionMode} */
export function resolveMotion(saved, systemReduced) {
  return ['full','reduced','off'].includes(saved) ? saved : 'full';
}
export function phaseAt(seconds) {
  if (!Number.isFinite(seconds)) throw new TypeError('Time must be finite');
  const phase = (((seconds % CYCLE_SECONDS) + CYCLE_SECONDS) % CYCLE_SECONDS) / (CYCLE_SECONDS / 3);
  return { index: Math.min(2, Math.floor(phase)), progress: phase % 1 };
}
export function samplePath(points, progress) {
  if (points.length < 2) throw new TypeError('At least two path points are required');
  if (!Number.isFinite(progress)) throw new TypeError('Progress must be finite');
  const lengths = points.slice(1).map((p,i) => Math.hypot(...p.map((v,j)=>v-points[i][j])));
  let distance = clamp(progress,0,1) * lengths.reduce((a,b)=>a+b,0);
  for (let i=0;i<lengths.length;i++) {
    if (distance <= lengths[i] || i === lengths.length-1) {
      const t = lengths[i] ? distance/lengths[i] : 0;
      return points[i].map((v,j)=>v+(points[i+1][j]-v)*t);
    }
    distance -= lengths[i];
  }
  return [...points.at(-1)];
}
/** Same camera transform is used by the GPU and build-time SVG fallback. */
export function cameraPoint(p, yaw=-0.58, tilt=0.56) {
  const x=Math.cos(yaw)*p[0]+Math.sin(yaw)*p[2];
  const z=-Math.sin(yaw)*p[0]+Math.cos(yaw)*p[2];
  return [x,Math.cos(tilt)*p[1]-Math.sin(tilt)*z,Math.sin(tilt)*p[1]+Math.cos(tilt)*z];
}
export const normalize = v => { const l=Math.hypot(...v)||1;return v.map(n=>n/l); };
export const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
