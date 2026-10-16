import { PATHS } from './geometry.mjs';
import { samplePath } from './core.mjs';
/** Native CSS 3D: real transformed planes, no WebGL context or external library. */
export function createRenderer(stage) {
 const model=stage.querySelector('[data-model]');if(!model)throw new Error('3D model markup is missing');
 const modules=[...stage.querySelectorAll('[data-module]')],wires=[...stage.querySelectorAll('[data-wire]')],signals=[...stage.querySelectorAll('[data-signal]')];
 let disposed=false,previousPhase=-1,previousMode='';
 return {
  kind: 'css3d',
  render({time,mode,phase,progress,mouse}) {
   if(disposed||stage.clientWidth===0)return false;
   const unit=stage.clientWidth/5.8;
   if(mode==='full')model.style.transform=`translateY(${Math.sin(time*.65)*unit*.035}px) rotateX(${-0.56-mouse.y*.065}rad) rotateY(${-0.58+mouse.x*.12+Math.sin(time*.32)*.035}rad)`;
   else if(mode==='reduced')model.style.transform='rotateX(-.56rad) rotateY(-.58rad)';
   if(phase!==previousPhase){modules.forEach((e,i)=>e.classList.toggle('is-active',i===phase));wires.forEach(e=>e.classList.toggle('is-active',Number(e.dataset.wire)===phase));previousPhase=phase;}
   for(let i=0;i<signals.length;i++){
     const t=progress-i*.08;signals[i].hidden=mode!=='full'||t<0;
     if(!signals[i].hidden){const p=samplePath(PATHS[phase],t);signals[i].style.transform=`translate3d(${p[0]*unit}px,${-p[1]*unit}px,${p[2]*unit}px)`;}
   }
   if(previousMode!==mode){stage.dataset.motion=mode;previousMode=mode;}
   return true;
  },
  dispose(){disposed=true;},
 };
}
