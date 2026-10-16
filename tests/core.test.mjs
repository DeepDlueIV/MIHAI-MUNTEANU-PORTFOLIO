import test from 'node:test';
import assert from 'node:assert/strict';
import { phaseAt, resolveMotion, samplePath } from '../src/scripts/core.mjs';
import { LEVELS, PATHS, wirePose } from '../src/scripts/geometry.mjs';

test('phase uses one 12-second clock and wraps exact boundaries', () => {
  assert.deepEqual(phaseAt(0), {index:0, progress:0});
  assert.deepEqual(phaseAt(4), {index:1, progress:0});
  assert.deepEqual(phaseAt(12), {index:0, progress:0});
  assert.equal(phaseAt(11.99).index, 2);
  for (const t of [-100, -1, 0, 4, 8, 12, 10000]) {
    const p = phaseAt(t); assert.ok(p.index >= 0 && p.index <= 2); assert.ok(p.progress >= 0 && p.progress < 1);
  }
});
test('an explicit saved preference overrides OS reduced motion', () => {
  assert.equal(resolveMotion('full', true), 'full');
  assert.equal(resolveMotion('off', false), 'off');
  assert.equal(resolveMotion(null, true), 'reduced');
  assert.equal(resolveMotion('invalid', false), 'full');
});
test('path interpolation has finite endpoints and clamps to the real endpoint', () => {
  const pts = [[0,0,0],[1,2,3],[3,4,5]];
  assert.deepEqual(samplePath(pts,0), pts[0]);
  assert.deepEqual(samplePath(pts,1), pts[2]);
  assert.deepEqual(samplePath(pts,2), pts[2]);
  assert.throws(() => samplePath([],0), /points/);
  assert.throws(() => samplePath(pts,NaN), /finite/);
});
test('three native 3D modules and all signal paths have finite coordinates', () => {
  assert.equal(LEVELS.length, 3); assert.equal(PATHS.length,3);
  for(const level of LEVELS) assert.ok(Object.values(level).every(Number.isFinite));
  for(const path of PATHS) {
    for(let i=0;i<=100;i++) assert.ok(samplePath(path,i/100).every(Number.isFinite));
    for(let i=1;i<path.length;i++) assert.ok(Object.values(wirePose(path[i-1],path[i])).every(Number.isFinite));
  }
});
