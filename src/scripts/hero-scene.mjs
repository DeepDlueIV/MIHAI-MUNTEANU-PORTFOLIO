import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { LEVELS, PATHS } from './geometry.mjs';
import { samplePath } from './core.mjs';

/** One small procedural scene. It shares layout and paths with the CSS fallback. */
export function createRenderer(stage, onUnavailable) {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x11151c, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2.9, 2.9, 2.9, -2.9, .1, 40);
  camera.position.set(0, 0, 12);
  const model = new THREE.Group();
  model.rotation.set(.56, -.58, 0);
  scene.add(model);
  scene.add(new THREE.HemisphereLight(0xc7deff, 0x1a2333, 2.8));
  const key = new THREE.DirectionalLight(0xe7efff, 3.2);
  key.position.set(-3, 6, 5);
  scene.add(key);
  const edge = new THREE.DirectionalLight(0x648bff, 1.3);
  edge.position.set(4, 1, -3);
  scene.add(edge);
  const resources = new Set();
  const track = resource => { resources.add(resource); return resource; };
  const metal = track(new THREE.MeshStandardMaterial({ color: 0x9eabc0, metalness: .32, roughness: .47 }));
  const dark = track(new THREE.MeshStandardMaterial({ color: 0x14223b, metalness: .25, roughness: .45 }));
  const screw = track(new THREE.MeshStandardMaterial({ color: 0x2a3c56, metalness: .65, roughness: .35 }));
  const trace = track(new THREE.LineBasicMaterial({ color: 0x50698e }));
  const chips = [], ports = [], patterns = [];
  function box(w, h, d, mat, x, y, z, rounded = false) {
    const geometry = track(rounded ? new RoundedBoxGeometry(w, h, d, 2, Math.min(.08, h / 3)) : new THREE.BoxGeometry(w, h, d));
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    model.add(mesh);
    return mesh;
  }
  LEVELS.forEach((level, i) => {
    box(level.w, .17, level.d, metal, level.x, level.y + .035, 0, true);
    const chipMaterial = track(dark.clone());
    chips.push(chipMaterial);
    box(level.w * .34, .14, level.d * .42, chipMaterial, level.x, level.y + .205, 0, true);
    const patternMaterial = track(new THREE.MeshStandardMaterial({ color: 0x79a9f4, emissive: 0x224a8a, emissiveIntensity: .3, metalness: .15, roughness: .5 }));
    patterns.push(patternMaterial);
    if (i === 1) {
      for (let x = -1; x <= 1; x++) for (let z = -1; z <= 1; z++)
        box(.12, .022, .11, patternMaterial, level.x + x * .18, level.y + .29, z * .17);
    } else {
      for (let n = -1; n <= 1; n++)
        box(i === 0 ? .12 : .6, .022, i === 0 ? .46 : .07, patternMaterial,
          level.x + (i === 0 ? n * .22 : 0), level.y + .29, i === 2 ? n * .14 : 0);
    }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const geometry = track(new THREE.CylinderGeometry(.045, .045, .014, 10));
      const fastener = new THREE.Mesh(geometry, screw);
      fastener.position.set(level.x + sx * level.w * .425, level.y + .132, sz * level.d * .405);
      model.add(fastener);
    }
    const portMaterial = track(new THREE.MeshBasicMaterial({ color: 0x4b70a8 }));
    ports.push(portMaterial);
    for (let n = 0; n < 5; n++) box(.065, .025, .016, portMaterial, level.x - .7 + n * .12, level.y + .035, level.d / 2 + .006);
    for (const z of [-.43, -.25, .25, .43]) for (const side of [-1, 1]) {
      const geometry = track(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(level.x + side * level.w * .43, level.y + .125, z),
        new THREE.Vector3(level.x + side * level.w * .19, level.y + .125, z),
      ]));
      model.add(new THREE.Line(geometry, trace));
    }
  });
  const wires = PATHS.map(path => {
    const material = track(new THREE.MeshBasicMaterial({ color: 0x3a5077 }));
    path.slice(1).forEach((b, i) => {
      const curve = new THREE.LineCurve3(new THREE.Vector3(...path[i]), new THREE.Vector3(...b));
      const geometry = track(new THREE.TubeGeometry(curve, 1, .01, 5, false));
      model.add(new THREE.Mesh(geometry, material));
    });
    return material;
  });
  const signalGeometry = track(new THREE.SphereGeometry(.043, 8, 8));
  const signalMaterial = track(new THREE.MeshBasicMaterial({ color: 0xdcebff }));
  const signals = Array.from({ length: 4 }, () => {
    const sphere = new THREE.Mesh(signalGeometry, signalMaterial);
    model.add(sphere);
    return sphere;
  });
  let disposed = false, width = 0, height = 0, previousPhase = -1;
  function lost(event) {
    event.preventDefault();
    if (!disposed) onUnavailable();
  }
  canvas.addEventListener('webglcontextlost', lost);
  stage.append(canvas);
  return {
    kind: 'webgl',
    render({ time, mode, phase, progress, mouse }) {
      if (disposed || renderer.getContext().isContextLost()) return false;
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return false;
      if (w !== width || h !== height) {
        width = w; height = h;
        const cap = w < 600 ? 1.5 : 1.75;
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, cap, Math.sqrt(1600000 / (w * h))));
        renderer.setSize(w, h, false);
        camera.top = 2.9 * h / w; camera.bottom = -camera.top;
        camera.updateProjectionMatrix();
      }
      if (mode === 'full') {
        model.rotation.set(.56 + mouse.y * .065, -.58 + mouse.x * .12 + Math.sin(time * .32) * .035, 0);
        model.position.y = -Math.sin(time * .65) * .035;
      } else if (mode === 'reduced') {
        model.rotation.set(.56, -.58, 0); model.position.y = 0;
      }
      if (phase !== previousPhase) {
        chips.forEach((mat, i) => mat.color.setHex(i === phase ? 0x275fc3 : 0x14223b));
        patterns.forEach((mat, i) => { mat.emissiveIntensity = i === phase ? .8 : .15; });
        ports.forEach((mat, i) => mat.color.setHex(i === phase ? 0x9cc8ff : 0x4b70a8));
        wires.forEach((mat, i) => mat.color.setHex(i === phase ? 0x7faaff : 0x3a5077));
        previousPhase = phase;
      }
      signals.forEach((signal, i) => {
        const progressOffset = progress - i * .08;
        signal.visible = mode === 'full' && progressOffset >= 0;
        if (signal.visible) signal.position.set(...samplePath(PATHS[phase], progressOffset));
      });
      renderer.render(scene, camera);
      return true;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      canvas.removeEventListener('webglcontextlost', lost);
      resources.forEach(resource => resource.dispose());
      renderer.dispose(); canvas.remove();
    },
  };
}
