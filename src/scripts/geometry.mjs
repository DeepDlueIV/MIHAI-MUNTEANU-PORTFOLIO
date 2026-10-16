/** The same coordinates define the static HTML and the animated signal path. */
export const LEVELS=[{x:-.35,y:1,w:3.25,d:2},{x:0,y:0,w:3.5,d:2.2},{x:.35,y:-1,w:3.7,d:2.35}];
export const PATHS=[
 [[-2.8,1.22,0],[-1.3,1.22,0],[-.35,1.27,0],[1.1,1.22,0],[2.15,1.22,.3]],
 [[2.15,1.22,.3],[2.35,1.1,.3],[2.35,.23,.3],[1.3,.22,.3],[0,.27,0],[-1.9,.22,0]],
 [[-1.9,.22,0],[-2.2,.22,0],[-2.2,-.77,0],[-1.3,-.78,0],[.35,-.73,0],[2.8,-.78,0]]
];
export function wirePose(a,b){
 const [dx,dy,dz]=[b[0]-a[0],-(b[1]-a[1]),b[2]-a[2]];
 return {x:(a[0]+b[0])/2,y:-(a[1]+b[1])/2,z:(a[2]+b[2])/2,length:Math.hypot(dx,dy,dz),yaw:-Math.atan2(dz,dx),pitch:Math.atan2(dy,Math.hypot(dx,dz))};
}
export function sceneMarkup(){
 const slabs=LEVELS.map((s,i)=>`<div class="slab" data-module="${i}" style="--x:${s.x};--y:${s.y};--w:${s.w};--d:${s.d}"><div class="plate-face plate-top"><div class="plate-traces">${[0,1,2,3].map(()=>'<i></i>').join('')}</div><i class="fastener f1"></i><i class="fastener f2"></i><i class="fastener f3"></i><i class="fastener f4"></i><div class="chip"><div class="chip-pattern pattern-${i}">${Array.from({length:i===1?9:3},()=>'<i></i>').join('')}</div></div><span class="board-label">MM / 0${i+1}</span></div><div class="plate-face edge-front"><i></i><i></i><i></i></div><div class="plate-face edge-back"></div><div class="plate-face edge-left"></div><div class="plate-face edge-right"></div></div>`).join('');
 const wires=PATHS.map((path,phase)=>path.slice(1).map((b,i)=>{const p=wirePose(path[i],b);return `<span class="wire" data-wire="${phase}" style="--length:${p.length};--tx:${p.x};--ty:${p.y};--tz:${p.z};--yaw:${p.yaw}rad;--pitch:${p.pitch}rad"></span>`;}).join('')).join('');
 return `<div class="css-model" data-model aria-hidden="true">${slabs}${wires}${[0,1,2,3].map(i=>`<i class="signal" data-signal="${i}"></i>`).join('')}</div>`;
}
