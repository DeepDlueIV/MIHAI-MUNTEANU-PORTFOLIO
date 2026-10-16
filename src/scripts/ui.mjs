export function initUI(motion) {
 let gsap = null;
 import('gsap').then(module => { gsap = module.gsap; }).catch(() => { /* Native transitions remain available. */ });
 const header=document.querySelector('.header-inner'),menu=document.querySelector('.menu-button'),nav=document.querySelector('nav');
 if(header&&menu&&nav){
   header.dataset.enhanced='true';menu.hidden=false;
   function close(focus=false){header.dataset.menu='closed';menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');if(focus)menu.focus();}
   menu.addEventListener('click',()=>{if(header.dataset.menu==='open'){close();return;}header.dataset.menu='open';menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label','Close menu');});
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&header.dataset.menu==='open'){close(true);}});
   document.addEventListener('click',e=>{if(!header.contains(e.target))close();});
   nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
   matchMedia('(min-width: 701px)').addEventListener('change',()=>close());
 }
 for(const button of document.querySelectorAll('[data-copy]')) {
   button.addEventListener('click',async()=>{
     const value=button.dataset.copy;const status=document.querySelector('.copy-status');
     try {if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(value);if(status)status.textContent='Copied to clipboard.';}
     catch {const source=[...document.querySelectorAll('[data-copy-source]')].find(el=>el.textContent.includes(value))||document.querySelector('[data-copy-source]');if(source){const range=document.createRange();range.selectNodeContents(source);const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(range);}if(status)status.textContent='Text selected. Use your usual Copy command.';}
   });
 }
 const animations=new Set();
 const reveal=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;reveal.unobserve(entry.target);if(motion.mode!=='full')continue;if(gsap){const tween=gsap.fromTo(entry.target,{opacity:.65,y:14},{opacity:1,y:0,duration:.55,ease:'power3.out',clearProps:'opacity,transform',onComplete:()=>animations.delete(tween)});animations.add(tween);continue;}const a=entry.target.animate([{opacity:.65,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.22,1,.36,1)'});animations.add(a);a.finished.then(()=>animations.delete(a)).catch(()=>animations.delete(a));}},{threshold:.15});
 document.querySelectorAll('[data-reveal],.hero-copy').forEach(el=>reveal.observe(el));
 motion.subscribe(mode=>{if(mode!=='full')for(const a of animations){if(a.kill){a.kill();gsap?.set(a.targets(),{clearProps:'opacity,transform'});}else a.cancel();}});
 // Navigation reflects the most recently visible content section, never a fake tab.
 const sections=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;nav?.querySelectorAll('a').forEach(a=>{if(a.hash===`#${e.target.id}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-15% 0px -65% 0px'});
 document.querySelectorAll('main>section[id]').forEach(s=>sections.observe(s));
}
