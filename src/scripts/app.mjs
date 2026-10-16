import { initMotion } from './motion.mjs';
import { initUI } from './ui.mjs';
import { initShowcase } from './showcase.mjs';
import { initHero } from './hero.mjs';
const motion=initMotion();
for(const [name,init] of [['navigation',()=>initUI(motion)],['showcase',()=>initShowcase(motion)],['hero',()=>initHero(motion)]]) {
 try{init();}catch(error){console.warn(`Portfolio ${name}: enhancement unavailable; static content retained.`,error);}
}
