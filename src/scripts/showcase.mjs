import { SHOWCASE_SECONDS } from './core.mjs';
export function initShowcase(motion) {
 const host=document.querySelector('[data-showcase]');if(!host)return;
 const tabs=[...host.querySelectorAll('[data-tab]')],panels=[...host.querySelectorAll('[data-study]')],pause=host.querySelector('.autoplay-button');
 let active=0,elapsed=0,demoTime=0,last=0,raf=0,paused=false,hover=false,focused=false,visible=false;
 const controls=host.querySelector('.showcase-controls');controls.hidden=false;host.dataset.enhanced='true';
 panels.forEach((p,i)=>{p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby',`tab-${i}`);p.tabIndex=0;});
 function setActive(index,manual=false){active=index;elapsed=0;demoTime=0;panels.forEach((p,i)=>p.hidden=i!==active);tabs.forEach((t,i)=>{t.setAttribute('aria-selected',String(i===active));t.tabIndex=i===active?0:-1;t.querySelector('.tab-progress').style.width='0%';});if(manual){paused=true;updatePause();host.querySelector('[data-showcase-announcement]').textContent=`Selected: ${tabs[index].textContent.trim()}`;}renderDemo();}
 function updatePause(){const stopped=paused||motion.mode!=='full';pause.setAttribute('aria-pressed',String(stopped));pause.setAttribute('aria-label',stopped?'Start automatic project rotation':'Pause automatic project rotation');pause.innerHTML=stopped?'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>':'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';}
 function renderDemo(){const step=motion.mode==='full'?Math.min(2,Math.floor(demoTime/1.3)%3):0;panels[0].querySelectorAll('[data-demo-step]').forEach((e,i)=>e.classList.toggle('is-active',i===step));panels[0].querySelector('[data-event-status]').textContent=['Receiving event','Verifying signature','Product updated'][step];panels[1].querySelector('[data-sync-status]').textContent=step>0?'Synced':'Pending';const job=panels[2].querySelector('[data-job-status]');job.textContent=step===2?'Completed':'Retrying';job.classList.toggle('retry',step!==2);}
 function tick(now){raf=0;if(!visible||document.hidden||motion.mode!=='full'){last=0;return;}const dt=last?Math.min((now-last)/1000,.08):0;last=now;if(!paused&&!hover&&!focused){elapsed+=dt;demoTime+=dt;if(elapsed>=SHOWCASE_SECONDS)setActive((active+1)%panels.length);tabs[active].querySelector('.tab-progress').style.width=`${elapsed/SHOWCASE_SECONDS*90}%`;renderDemo();}raf=requestAnimationFrame(tick);}
 function wake(){cancelAnimationFrame(raf);last=0;if(visible&&!document.hidden&&motion.mode==='full')raf=requestAnimationFrame(tick);}
 tabs.forEach((t,i)=>{t.addEventListener('click',()=>setActive(i,true));t.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();setActive(n,true);tabs[n].focus();});});
 pause.addEventListener('click',()=>{if(motion.mode!=='full'){host.querySelector('[data-showcase-announcement]').textContent='Choose Full in the Motion menu to enable automatic rotation.';return;}paused=!paused;updatePause();wake();});
 host.addEventListener('mouseenter',()=>hover=true);host.addEventListener('mouseleave',()=>{hover=false;wake();});
 host.addEventListener('focusin',()=>focused=true);host.addEventListener('focusout',()=>{queueMicrotask(()=>{focused=host.contains(document.activeElement);wake();});});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;wake();},{threshold:.1});observer.observe(host);
 document.addEventListener('visibilitychange',wake);
 const unsubscribe=motion.subscribe(()=>{updatePause();wake();});
 window.addEventListener('pagehide',e=>{cancelAnimationFrame(raf);if(!e.persisted){observer.disconnect();unsubscribe();document.removeEventListener('visibilitychange',wake);}});
 window.addEventListener('pageshow',wake);
 setActive(0);updatePause();
}
