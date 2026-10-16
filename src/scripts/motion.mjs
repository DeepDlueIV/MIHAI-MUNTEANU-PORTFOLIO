import { resolveMotion, MOTION_KEY } from './core.mjs';
export function initMotion() {
 const media=matchMedia('(prefers-reduced-motion: reduce)');const listeners=new Set();
 let saved=null;try{saved=localStorage.getItem(MOTION_KEY);}catch{/* Storage is optional; explicit choices still work in memory. */}
 let mode=resolveMotion(saved,media.matches);
 const control=document.querySelector('[aria-label="Motion mode"]');
 function apply(next){mode=next;document.documentElement.dataset.motion=mode;if(control)control.value=mode;listeners.forEach(fn=>fn(mode));}
 if(control){control.closest('label').hidden=false;control.addEventListener('change',()=>{saved=control.value;try{localStorage.setItem(MOTION_KEY,saved);}catch{/* Do not turn a privacy preference into a broken page. */}apply(resolveMotion(saved,media.matches));});}
 media.addEventListener('change',()=>apply(resolveMotion(saved,media.matches)));
 window.addEventListener('storage',e=>{if(e.key===MOTION_KEY){saved=e.newValue;apply(resolveMotion(saved,media.matches));}});
 apply(mode);
 return { get mode(){return mode;},subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);} };
}
