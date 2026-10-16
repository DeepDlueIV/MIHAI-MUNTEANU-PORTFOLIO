import { phaseAt } from './core.mjs';
import { createRenderer as createCSSRenderer } from './css-renderer.mjs';

export function initHero(motion) {
  const figure = document.querySelector('[data-hero]');
  if (!figure) return;
  const stage = figure.querySelector('[data-scene]');
  const phases = [...figure.querySelectorAll('[data-phase]')];
  let renderer = createCSSRenderer(stage);
  let visible = true, raf = 0, last = 0, time = 0, renderLast = 0, disposed = false;
  const mouse = { x: 0, y: 0 }, target = { x: 0, y: 0 };

  function fallback(error) {
    renderer?.dispose();
    renderer = createCSSRenderer(stage);
    stage.dataset.renderer = 'css3d';
    if (error && import.meta.env?.DEV) console.warn('WebGL unavailable; using the matching CSS 3D scene.', error);
    wake();
  }
  function update(now) {
    raf = 0;
    if (disposed || !visible || document.hidden) { last = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, .06) : 0;
    last = now;
    if (motion.mode !== 'off') time += dt;
    const phase = phaseAt(time);
    figure.dataset.activePhase = String(phase.index);
    phases.forEach((element, i) => {
      if (i === phase.index) element.setAttribute('aria-current', 'step');
      else element.removeAttribute('aria-current');
      element.querySelector('b').style.width = `${i < phase.index ? 100 : i === phase.index ? phase.progress * 100 : 0}%`;
    });
    mouse.x += (target.x - mouse.x) * .055;
    mouse.y += (target.y - mouse.y) * .055;
    if (motion.mode !== 'reduced' || now - renderLast > 160) {
      try {
        if (renderer.render({ time, mode: motion.mode, phase: phase.index, progress: phase.progress, mouse })) {
          stage.dataset.renderer = renderer.kind;
          renderLast = now;
        }
      } catch (error) { fallback(error); return; }
    }
    if (motion.mode !== 'off') raf = requestAnimationFrame(update);
  }
  function wake() {
    cancelAnimationFrame(raf); last = 0;
    if (!disposed && visible && !document.hidden) raf = requestAnimationFrame(update);
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    stage.dataset.visible = String(visible);
    wake();
  }, { threshold: .02 });
  observer.observe(figure);
  const resize = new ResizeObserver(wake);
  resize.observe(stage);
  document.addEventListener('visibilitychange', wake);
  const precise = matchMedia('(hover: hover) and (pointer: fine)');
  stage.addEventListener('pointermove', event => {
    if (!precise.matches || motion.mode !== 'full') return;
    const bounds = stage.getBoundingClientRect();
    target.x = (event.clientX - bounds.left) / bounds.width - .5;
    target.y = (event.clientY - bounds.top) / bounds.height - .5;
  });
  stage.addEventListener('pointerleave', () => { target.x = 0; target.y = 0; });
  const unsubscribe = motion.subscribe(() => { target.x = 0; target.y = 0; wake(); });
  window.addEventListener('pagehide', event => {
    cancelAnimationFrame(raf); last = 0;
    if (event.persisted) return;
    disposed = true; observer.disconnect(); resize.disconnect(); unsubscribe();
    document.removeEventListener('visibilitychange', wake);
    renderer.dispose();
  });
  window.addEventListener('pageshow', wake);
  // Independently load the GPU scene. Its failure cannot disable the rest of the site.
  import('./hero-scene.mjs').then(({ createRenderer }) => {
    if (disposed) return;
    const next = createRenderer(stage, () => fallback());
    renderer.dispose(); renderer = next; wake();
  }).catch(fallback);
  wake();
}
