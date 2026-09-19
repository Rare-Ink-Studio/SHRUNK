import {visibleSize,gameLayout} from './layout.mjs';
import {installPhoneTouchGuard} from './phone-touch.mjs';
import {FingerboardGame,DualThumbInput,PHYSICS,clamp,obstaclesBetween,needsLandscape,demoPop,assistDemo} from './engine.mjs';
import {mountGameProgress,recordEvent} from './progression.mjs';

const $=id=>document.getElementById(id);
const game=new FingerboardGame();
if(typeof mountGameProgress==='function')mountGameProgress('fingerboard');
const input=new DualThumbInput(game);
const canvas=$('park');
const ctx=canvas.getContext('2d',{alpha:false});
const backdrop=new Image();backdrop.src='./assets/workshop.webp';
const elements={score:$('score'),best:$('best'),phase:$('phase'),fill:$('load-fill'),line:$('line'),next:$('next-obstacle'),front:$('front-pad'),rear:$('rear-pad'),puck:$('front-puck'),trick:$('trick'),trickName:$('trick-name'),trickPoints:$('trick-points')};
let width=0,height=0,scale=1,groundY=0,camera=0,last=0,accumulator=0,landscapeBlocked=false,time=0,trickUntil=0,best=0,muted=true,audioCtx=null,shake=0,particles=[],wasPlayingBeforeHelp=false;
let demoMode=false;
let comboChain=[];
const keys=new Set();
const captures=new Map();
try{best=Math.max(0,Number(localStorage.getItem('shrunk:best:v1'))||0);}catch{}
elements.best.textContent=best.toLocaleString();
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize(){
  const size=visibleSize(window.innerWidth,window.innerHeight,window.visualViewport);
  if(size.width<=0||size.height<=0)return;
  const oldWidth=width,oldHeight=height;
  width=size.width;height=size.height;
  const shell=$('game');
  const viewport=window.visualViewport;
  const unzoomed=!viewport||Math.abs((viewport.scale||1)-1)<.02;
  const left=unzoomed?(viewport?.offsetLeft||0):0,top=unzoomed?(viewport?.offsetTop||0):0;
  const root=document.documentElement;
  root.style.setProperty('--visible-width',`${width}px`);root.style.setProperty('--visible-height',`${height}px`);
  root.style.setProperty('--visible-left',`${left}px`);root.style.setProperty('--visible-top',`${top}px`);
  shell.style.left=`${left}px`;shell.style.top=`${top}px`;
  shell.style.width=`${width}px`;shell.style.height=`${height}px`;
  const style=getComputedStyle(shell);
  const inset=parseFloat(style.getPropertyValue('--safe-bottom'))||0;
  const topInset=parseFloat(style.getPropertyValue('--safe-top'))||0;
  const layout=gameLayout(width,height,inset,topInset);
  shell.style.setProperty('--hud-height',`${layout.header}px`);
  shell.style.setProperty('--controls-height',`${layout.controls}px`);
  shell.style.setProperty('--bottom-gap',`${layout.bottom}px`);
  shell.classList.toggle('compact-view',layout.compact);
  const ratio=Math.min(2,window.devicePixelRatio||1);
  if(width!==oldWidth||height!==oldHeight){canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);}
  const layoutChanged=scale!==layout.scale||groundY!==layout.ground;
  scale=layout.scale;groundY=layout.ground;
  if(width!==oldWidth||height!==oldHeight||layoutChanged)camera=game.x-width*(game.mode==='ready'?.70:.29)/scale;
  const nextBlocked=needsLandscape(width,height);
  if(nextBlocked&&!landscapeBlocked){
    clearInputs();game.pause();
    if($('pause-dialog').open)$('pause-dialog').close();
    if($('help-dialog').open)$('help-dialog').close();
    wasPlayingBeforeHelp=false;
  }
  const wasBlocked=landscapeBlocked;landscapeBlocked=nextBlocked;
  $('rotate-screen').hidden=!nextBlocked;
  if(wasBlocked&&!nextBlocked&&game.mode==='paused')openPause();
}
window.addEventListener('resize',resize);
window.visualViewport?.addEventListener('resize',resize);
window.visualViewport?.addEventListener('scroll',resize);
window.addEventListener('orientationchange',()=>{resize();requestAnimationFrame(resize);});
new ResizeObserver(resize).observe($('game'));

function clearInputs(){keys.clear();input.clear();clearPhoneTouches();const active=[...captures];captures.clear();for(const [id,surface] of active){if(surface.hasPointerCapture(id))surface.releasePointerCapture(id);}}
function sound(kind){if(muted)return;try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();audioCtx.resume().catch(()=>{});const oscillator=audioCtx.createOscillator(),gain=audioCtx.createGain();oscillator.connect(gain);gain.connect(audioCtx.destination);const t=audioCtx.currentTime;const freq=kind==='pop'?190:kind==='land'?95:kind==='catch'?280:65;oscillator.type=kind==='bail'?'sawtooth':'triangle';oscillator.frequency.setValueAtTime(freq,t);oscillator.frequency.exponentialRampToValueAtTime(freq*.25,t+.10);gain.gain.setValueAtTime(kind==='catch'?.035:.08,t);gain.gain.exponentialRampToValueAtTime(.001,t+.13);oscillator.start(t);oscillator.stop(t+.14);}catch{muted=true;}}
function saveBest(){if(game.score<=best)return;best=game.score;elements.best.textContent=best.toLocaleString();try{localStorage.setItem('shrunk:best:v1',String(best));}catch{}}
function start(easy=demoMode){if(landscapeBlocked)return;demoMode=easy;$('controls').hidden=demoMode;$('demo-controls').hidden=!demoMode;$('switch-mode').textContent=demoMode?'SWITCH TO TWO THUMBS':'SWITCH TO EASY DEMO';clearInputs();game.reset();game.drainEvents();particles=[];game.start();$('game').dataset.state='playing';camera=game.x-width*.29/scale;$('start-screen').hidden=true;$('pause').disabled=false;trickUntil=0;last=performance.now();accumulator=0;}
function openPause(){if(!$('pause-dialog').open&&!$('help-dialog').open)$('pause-dialog').showModal();}
function pause(){if(game.mode!=='playing')return;clearInputs();game.pause();openPause();}
function resume(){if(landscapeBlocked||document.hidden)return;$('pause-dialog').close();clearInputs();game.resume();last=performance.now();accumulator=0;}
function home(){clearInputs();for(const dialog of [$('pause-dialog'),$('help-dialog')])if(dialog.open)dialog.close();wasPlayingBeforeHelp=false;game.reset();game.drainEvents();particles=[];trickUntil=0;accumulator=0;demoMode=false;$('game').dataset.state='ready';$('start-screen').hidden=false;$('controls').hidden=true;$('demo-controls').hidden=true;$('pause').disabled=true;camera=game.x-width*.70/scale;}
$('home').addEventListener('click',home);
document.querySelector('.identity .wordmark').addEventListener('click',event=>{event.preventDefault();home();});
$('start').addEventListener('click',()=>start(false));
$('demo-start').addEventListener('click',()=>start(true));
$('demo-pop').addEventListener('click',()=>{if(!landscapeBlocked)demoPop(game);});
$('switch-mode').addEventListener('click',()=>{$('pause-dialog').close();start(!demoMode);});
const clearPhoneTouches=installPhoneTouchGuard(document);
$('pause').addEventListener('click',pause);
$('pause').disabled=true;
$('resume').addEventListener('click',resume);
$('restart').addEventListener('click',()=>{$('pause-dialog').close();start();});
$('sound').addEventListener('click',()=>{muted=!muted;$('sound').setAttribute('aria-pressed',String(!muted));$('sound').setAttribute('aria-label',muted?'Turn sound on':'Turn sound off');$('sound').innerHTML=muted?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 9l5 6m0-6-5 6"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 8q4 4 0 8m3-11q6 7 0 14"/></svg>';if(!muted)sound('pop');});
$('help').addEventListener('click',()=>{wasPlayingBeforeHelp=game.mode==='playing';clearInputs();game.pause();$('help-dialog').showModal();});
function closeHelp(){if($('help-dialog').open)$('help-dialog').close();if(wasPlayingBeforeHelp&&!landscapeBlocked&&!document.hidden){game.resume();last=performance.now();accumulator=0;}else if(game.mode==='paused')openPause();wasPlayingBeforeHelp=false;}
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',closeHelp));
$('help-dialog').addEventListener('cancel',event=>{event.preventDefault();closeHelp();});
$('pause-dialog').addEventListener('cancel',event=>{event.preventDefault();resume();});
function suspend(){wasPlayingBeforeHelp=false;clearInputs();pause();}
function restore(){resize();last=performance.now();accumulator=0;if(game.mode==='paused'&&!landscapeBlocked)openPause();}
document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();else restore();});
window.addEventListener('blur',suspend);
window.addEventListener('pagehide',suspend);
window.addEventListener('focus',restore);
window.addEventListener('pageshow',restore);

for(const surface of [canvas,$('front-pad'),$('rear-pad')]){
  surface.addEventListener('pointerdown',event=>{if(demoMode||landscapeBlocked||game.mode!=='playing'||game.phase==='bail')return;if(event.pointerType==='mouse'&&event.button!==0)return;event.preventDefault();const rect=canvas.getBoundingClientRect();if(input.down(event.pointerId,event.clientX-rect.left,event.clientY-rect.top,width,event.timeStamp)){try{surface.setPointerCapture(event.pointerId);captures.set(event.pointerId,surface);}catch{}}});
  surface.addEventListener('pointermove',event=>{if(!input.pointers.has(event.pointerId))return;event.preventDefault();const rect=canvas.getBoundingClientRect();input.move(event.pointerId,event.clientX-rect.left,event.clientY-rect.top,event.timeStamp);});
  surface.addEventListener('pointerup',event=>{input.up(event.pointerId,false,event.timeStamp);captures.delete(event.pointerId);if(keys.size)updateKeyboardFront();});
  surface.addEventListener('pointercancel',event=>{input.up(event.pointerId,true,event.timeStamp);captures.delete(event.pointerId);});
  surface.addEventListener('lostpointercapture',event=>{input.up(event.pointerId,true,event.timeStamp);captures.delete(event.pointerId);});
  surface.addEventListener('contextmenu',event=>event.preventDefault());
}
const relevantKeys=new Set(['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyA','KeyD','KeyW','KeyS','KeyP','KeyR','Escape']);
function updateKeyboardFront(){if(demoMode)return;if(input.roles.front!==null)return;const steer=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0);const tilt=(keys.has('ArrowUp')||keys.has('KeyW')?1:0)-(keys.has('ArrowDown')||keys.has('KeyS')?1:0);game.setFront(!!(steer||tilt),steer,tilt);}
window.addEventListener('keydown',event=>{if(!relevantKeys.has(event.code))return;if($('help-dialog').open||$('pause-dialog').open){if(event.code==='KeyP'&&$('pause-dialog').open){event.preventDefault();resume();}return;}if(game.mode==='ready')return;event.preventDefault();if(event.repeat)return;if(event.code==='KeyP'||event.code==='Escape'){game.mode==='paused'?resume():pause();return;}if(event.code==='KeyR'){start();return;}if(game.mode!=='playing')return;keys.add(event.code);if(demoMode){if(event.code==='Space')demoPop(game);return;}if(event.code==='Space'&&input.roles.rear===null)game.rearDown();updateKeyboardFront();});
window.addEventListener('keyup',event=>{if(!relevantKeys.has(event.code))return;const wasHeld=keys.has(event.code);keys.delete(event.code);if(wasHeld&&!demoMode&&event.code==='Space'&&input.roles.rear===null)game.rearUp();updateKeyboardFront();});

function polygon(points,fill,stroke=null){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function rounded(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.3;ctx.stroke();}}
function floor(){const grad=ctx.createLinearGradient(0,groundY,0,height);grad.addColorStop(0,'#69533b');grad.addColorStop(.06,'#8e7351');grad.addColorStop(1,'#493a29');ctx.fillStyle=grad;ctx.fillRect(0,groundY,width,height-groundY);ctx.strokeStyle='#c7a376';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,groundY+1);ctx.lineTo(width,groundY+1);ctx.stroke();ctx.strokeStyle='#382b2255';ctx.lineWidth=1;const drift=camera*scale*.9;for(let i=0;i<13;i++){const y=groundY+12+i*i*1.7;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(width*.3,y+2,width*.7,y-3,width,y+1);ctx.stroke();}for(let i=Math.floor(camera/180)-1;i<Math.floor((camera+width/scale)/180)+2;i++){const x=i*180*scale-drift;ctx.strokeStyle='#493b2d66';ctx.beginPath();ctx.moveTo(x,groundY+2);ctx.lineTo(x-60,height);ctx.stroke();}for(let i=Math.floor(camera/160);i<(camera+width/scale)/160+1;i++){const x=(i*160-camera)*scale;ctx.fillStyle='#312c2588';ctx.beginPath();ctx.ellipse(x,groundY+17*scale,2*scale,1.1*scale,0,0,Math.PI*2);ctx.fill();}}
function drawBackdrop(){ctx.fillStyle='#17201e';ctx.fillRect(0,0,width,height);if(backdrop.complete&&backdrop.naturalWidth){const s=Math.max(width/backdrop.width,groundY/(backdrop.height*.715));const w=backdrop.width*s,h=backdrop.height*s;ctx.globalAlpha=.85;ctx.drawImage(backdrop,(width-w)/2,groundY-h*.715,w,h);ctx.globalAlpha=1;}const shade=ctx.createLinearGradient(0,0,0,groundY);shade.addColorStop(0,'#09110d70');shade.addColorStop(1,'#12221805');ctx.fillStyle=shade;ctx.fillRect(0,0,width,groundY);floor();}
function obstacle(o){const x=(o.x-camera)*scale;ctx.save();ctx.translate(x,groundY);ctx.scale(scale,scale);if(o.type==='gap'){ctx.fillStyle='#171713cc';ctx.fillRect(0,-2,o.w,13);ctx.strokeStyle='#c4fb7188';ctx.setLineDash([8,7]);ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(o.w,-4);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#c4fb71';ctx.font='900 11px monospace';ctx.fillText('GAP',o.w*.5-10,11);ctx.restore();return;}if(o.type==='rail'){ctx.fillStyle='#10150f44';ctx.beginPath();ctx.ellipse(o.w*.5,7,o.w*.52,7,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c5c9bd';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,-o.h);ctx.lineTo(o.w,-o.h);ctx.stroke();ctx.strokeStyle='#555f58';ctx.lineWidth=3;for(const px of [18,o.w-18]){ctx.beginPath();ctx.moveTo(px,-o.h);ctx.lineTo(px,0);ctx.stroke();}ctx.fillStyle='#c4fb71';ctx.font='900 10px monospace';ctx.fillText('LOW RAIL',o.w*.5-26,-o.h-8);ctx.restore();return;}const lift=12,depth=20;ctx.fillStyle='#11180c45';ctx.beginPath();ctx.ellipse(o.w*.6+14,9,o.w*.6,9,0,0,Math.PI*2);ctx.fill();const base=o.material==='concrete'?'#838e88':o.material==='wood'?'#8b704c':'#a48357';const top=o.material==='concrete'?'#b8c0b1':o.material==='wood'?'#bd9c6b':'#c9a773';const side=o.material==='concrete'?'#515b57':'#725939';const rise=o.rise||0;
  if(o.type==='ramp'){
    polygon([[0,0],[rise,-o.h],[o.w,-o.h],[o.w,0]],base,'#3c382d');polygon([[0,0],[depth,-lift],[rise+depth,-o.h-lift],[rise,-o.h]],top,'#e0c69844');polygon([[rise,-o.h],[rise+depth,-o.h-lift],[o.w+depth,-o.h-lift],[o.w,-o.h]],top);polygon([[o.w,-o.h],[o.w+depth,-o.h-lift],[o.w+depth,-lift],[o.w,0]],side);ctx.strokeStyle='#55462b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(4,-1);ctx.lineTo(rise,-o.h);ctx.lineTo(o.w,-o.h);ctx.stroke();for(let i=30;i<rise;i+=42){const y=-(i/rise)*o.h;ctx.fillStyle='#3e3828';ctx.beginPath();ctx.arc(i,y+7,1.5,0,Math.PI*2);ctx.fill();}ctx.save();ctx.translate(rise+15,-o.h+15);ctx.rotate(-.03);rounded(0,0,70,25,1,'#c4fb71');ctx.fillStyle='#263421';ctx.font='900 14px Arial';ctx.fillText('SHRUNK',5,17);ctx.restore();
  }else{
    polygon([[0,0],[0,-o.h],[o.w,-o.h],[o.w,0]],base,'#3d3e32');polygon([[0,-o.h],[depth,-o.h-lift],[o.w+depth,-o.h-lift],[o.w,-o.h]],top,'#ffffff22');polygon([[o.w,-o.h],[o.w+depth,-o.h-lift],[o.w+depth,-lift],[o.w,0]],side);ctx.fillStyle='#344534';ctx.fillRect(0,-o.h,Math.min(16,o.w),o.h);ctx.strokeStyle='#d4e0ba';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-o.h);ctx.lineTo(o.w,-o.h);ctx.stroke();if(o.material==='cardboard'){ctx.fillStyle='#d6c591a0';ctx.fillRect(o.w*.47,-o.h,15,o.h);ctx.strokeStyle='#8a764a';ctx.beginPath();ctx.moveTo(0,-o.h*.4);ctx.lineTo(o.w,-o.h*.4);ctx.stroke();}else{ctx.fillStyle='#49554c';for(let i=0;i<16;i++)ctx.fillRect((i*37)%o.w,-o.h+5+(i*17)%(o.h-7),2,1);}}
  ctx.restore();
}
function finger(x,press,isFront){ctx.save();ctx.translate(x,-15);const raised=game.phase==='air'&&!game.catch&&!isFront?20:0;const top=-80-(isFront?9:0)-raised;const bend=(isFront?18:26)+(game.phase==='load'&&!isFront?game.charge/PHYSICS.loadTime*9:0);const skin=ctx.createLinearGradient(-12,0,30,0);skin.addColorStop(0,'#bd7d56');skin.addColorStop(.4,'#e8b78d');skin.addColorStop(.78,'#f3d1a4');skin.addColorStop(1,'#bf855b');ctx.fillStyle=skin;ctx.strokeStyle='#6c4b37';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-11,-5-raised);ctx.bezierCurveTo(-13,-25-raised,bend-19,top+12,bend-12,top);ctx.bezierCurveTo(bend-8,top-14,bend+13,top-11,bend+14,top+2);ctx.bezierCurveTo(bend+13,top+29,16,-20-raised,11,-3-raised);ctx.quadraticCurveTo(0,6-raised,-11,-5-raised);ctx.fill();ctx.stroke();ctx.save();ctx.translate(1,-11-raised);ctx.rotate(.10);rounded(-7,-10,13,14,5,'#eed5ba','#c49c79');ctx.fillStyle='#ffead044';ctx.fillRect(-4,-7,7,2);ctx.restore();ctx.strokeStyle='#9e67494a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-34-raised);ctx.quadraticCurveTo(5,-36-raised,11,-33-raised);ctx.stroke();if(press){ctx.globalAlpha=.6;ctx.strokeStyle='#c4fb71';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,2-raised,14,4,0,0,Math.PI*2);ctx.stroke();}ctx.restore();}
function board(){const px=(game.x-camera)*scale;const py=groundY-game.y*scale;ctx.save();ctx.fillStyle=`rgba(7,16,9,${clamp(.28-game.y*.001, .055,.28)})`;ctx.beginPath();ctx.ellipse(px+5,groundY+4,50*scale,7*scale,0,0,Math.PI*2);ctx.fill();ctx.translate(px,py);ctx.scale(scale,scale);ctx.rotate(-game.angle);if(game.phase!=='bail'){finger(23,game.front||game.catch,true);finger(-28,game.rear,false);}ctx.save();const flipScale=(game.trick==='kickflip'||game.trick==='heelflip'||game.trick==='varialkickflip'||game.trick==='varialheelflip'||game.trick==='treflip'||game.trick==='inwardheelflip'||game.trick==='inwardheelflip')?Math.max(.12,Math.abs(Math.cos(game.flip))):1;const yaw=game.phase==='grind'?game.grindYaw:game.trick==='180'?game.bodySpin:(game.trick==='popshuvit'||game.trick==='360shuvit'||game.trick==='varialkickflip'||game.trick==='varialheelflip'||game.trick==='treflip'||game.trick==='inwardheelflip'||game.trick==='inwardheelflip')?game.shuv:0;const shuvScale=game.phase==='grind'?Math.max(.12,Math.abs(Math.cos(yaw))):((game.trick==='popshuvit'||game.trick==='360shuvit'||game.trick==='varialkickflip'||game.trick==='varialheelflip'||game.trick==='treflip'||game.trick==='inwardheelflip'||game.trick==='180')?Math.max(.12,Math.abs(Math.cos(yaw))):1);ctx.scale(shuvScale,flipScale);ctx.strokeStyle='#171e19';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-30,-11);ctx.lineTo(-28,-5);ctx.moveTo(29,-11);ctx.lineTo(28,-5);ctx.stroke();ctx.strokeStyle='#bbc6b6';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-31,-10);ctx.lineTo(-24,-6);ctx.moveTo(25,-10);ctx.lineTo(32,-6);ctx.stroke();for(const x of [-28,29]){ctx.fillStyle='#293729';ctx.beginPath();ctx.ellipse(x+7,-8,5,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ede3c9';ctx.beginPath();ctx.arc(x,-5.5,5.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8a856f';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='#454d3b';ctx.beginPath();ctx.arc(x,-5.5,1.9,0,Math.PI*2);ctx.fill();const turn=game.x*.18;ctx.strokeStyle='#a8a186';ctx.beginPath();ctx.moveTo(x+Math.cos(turn)*2,-5.5+Math.sin(turn)*2);ctx.lineTo(x+Math.cos(turn)*4,-5.5+Math.sin(turn)*4);ctx.stroke();}ctx.fillStyle='#b8f365';ctx.strokeStyle='#243121';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(-49,-18);ctx.quadraticCurveTo(-43,-10,-32,-10);ctx.lineTo(32,-10);ctx.quadraticCurveTo(45,-10,51,-19);ctx.lineTo(48,-22);ctx.quadraticCurveTo(38,-16,31,-15);ctx.lineTo(-32,-15);ctx.quadraticCurveTo(-42,-15,-47,-21);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#222b26';ctx.beginPath();ctx.moveTo(-48,-21);ctx.quadraticCurveTo(-42,-16,-31,-16);ctx.lineTo(30,-16);ctx.quadraticCurveTo(42,-17,49,-22);ctx.lineTo(42,-27);ctx.quadraticCurveTo(34,-22,25,-22);ctx.lineTo(-34,-22);ctx.quadraticCurveTo(-41,-23,-45,-25);ctx.closePath();ctx.fill();ctx.strokeStyle='#bcca9b';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='#6e7b64';for(const x of [-32,-25,24,31]){ctx.beginPath();ctx.arc(x,-19,1,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#c4fb71';ctx.fillRect(-7,-22,16,6);ctx.fillStyle='#263b21';ctx.font='900 5px Arial';ctx.fillText('S',-1,-17);ctx.restore();ctx.restore();}
function drawMarkers(){ctx.save();ctx.textAlign='left';for(let i=Math.floor(camera/560);i<(camera+width/scale)/560+1;i++){if(i<0)continue;const x=(i*560+50-camera)*scale;ctx.save();ctx.translate(x,groundY+43*scale);ctx.rotate(-.025);ctx.fillStyle='#293321bb';ctx.font=`800 ${13*scale}px monospace`;ctx.fillText(i===0?'START HERE':`${String(i).padStart(2,'0')} / SHRUNK`,0,0);ctx.strokeStyle='#29332177';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,6);ctx.lineTo(92*scale,6);ctx.stroke();ctx.restore();}ctx.restore();}
function burst(kind){if(reducedMotion)return;const count=kind==='bail'?15:kind==='land'?10:6;for(let i=0;i<count;i++)particles.push({x:game.x+(Math.random()-.5)*60,y:game.y+5,vx:(Math.random()-.5)*150,vy:25+Math.random()*110,life:.3+Math.random()*.25,max:.55,color:kind==='land'?'#d0f991':'#c6af81'});}
function eventLoop(){for(const event of game.drainEvents()){
  if(event.type==='pop'){sound('pop');burst('pop');}
  if(event.type==='catch')sound('catch');
  if(event.type==='kickflip'||event.type==='heelflip'||event.type==='popshuvit'||event.type==='360shuvit'||event.type==='180'||event.type==='varialkickflip'||event.type==='varialheelflip'||event.type==='treflip'||event.type==='inwardheelflip'||event.type==='inwardheelflip'){sound('catch');elements.trickName.textContent=event.type==='kickflip'?'KICKFLIP':event.type==='heelflip'?'HEELFLIP':event.type==='popshuvit'?'POP SHUVIT':event.type==='360shuvit'?'360 SHUVIT':event.type==='varialkickflip'?'VARIAL KICKFLIP':event.type==='varialheelflip'?'VARIAL HEELFLIP':event.type==='treflip'?'360 FLIP':event.type==='inwardheelflip'?'INWARD HEELFLIP':'180';elements.trickPoints.textContent=(event.type==='varialkickflip'||event.type==='varialheelflip'||event.type==='treflip'||event.type==='inwardheelflip'||event.type==='inwardheelflip')?'SCOOP · FLICK · CATCH · LAND':(event.type==='popshuvit'||event.type==='360shuvit')?'SCOOP · CATCH · LAND':event.type==='180'?'SWEEP · CATCH · LAND':'FLICK · CATCH · LAND';trickUntil=time+.75;}
  if(event.type==='grindstart'){sound('catch');elements.trickName.textContent=event.grind;elements.trickPoints.textContent='LOCKED IN · RIDE IT OUT';trickUntil=time+1.1;}
  if(event.type==='grindcomplete'){recordEvent('finger_grind_complete',{grind:event.grind,points:event.points},'fingerboard');sound('land');burst('land');comboChain.push(event.grind);comboChain=comboChain.slice(-3);elements.trickName.textContent=comboChain.length>1?`LINE · ${comboChain.join(' → ')}`:`CLEAN ${event.grind}`;elements.trickPoints.textContent=`+${event.points} · LINE ${event.lineScore}`;trickUntil=time+1.4;}
  if(event.type==='featureclear'){recordEvent('finger_feature_clear',{name:event.name,points:event.points},'fingerboard');elements.trickName.textContent=`${event.name} CLEARED`;elements.trickPoints.textContent=`+${event.points} LINE · ${event.lineScore}`;trickUntil=time+.9;}
  if(event.type==='linecomplete'){recordEvent('finger_line_complete',{clean:Boolean(event.clean),score:event.lineScore||0,bonus:event.bonus||0},'fingerboard');sound('land');burst('land');comboChain=[];elements.trickName.textContent=event.clean?'CLEAN LINE · THE TABLE':'LINE COMPLETE · THE TABLE';elements.trickPoints.textContent=`${event.lineScore} LINE · +${event.bonus} FINISH`;trickUntil=time+1.8;saveBest();}
  if(event.type==='land'){sound('land');burst('land');shake=reducedMotion?0:1.7;const landedTrick=event.trick==='KICKFLIP'||event.trick==='HEELFLIP'||event.trick==='POP SHUVIT'||event.trick==='360 SHUVIT'||event.trick==='VARIAL KICKFLIP'||event.trick==='VARIAL HEELFLIP'||event.trick==='360 FLIP'||event.trick==='INWARD HEELFLIP'||event.trick==='180';if(landedTrick)recordEvent('finger_trick_land',{trick:event.trick,clean:Boolean(event.clean),points:event.points||0},'fingerboard');if(landedTrick){comboChain.push(event.trick);comboChain=comboChain.slice(-3);}else if(event.clears){comboChain.push('FEATURE');comboChain=comboChain.slice(-3);}
  elements.trickName.textContent=comboChain.length>1?`LINE · ${comboChain.join(' → ')}`:landedTrick?(event.clean?`CLEAN ${event.trick}`:event.trick):event.clears?'CLEAN OVER':event.clean?'CLEAN OLLIE':'OLLIE';elements.trickPoints.textContent=`+${event.points}${event.clears?' · LEDGE CLEARED':''}`;trickUntil=time+1.35;saveBest();}
  if(event.type==='bail'){comboChain=[];clearInputs();sound('bail');burst('bail');shake=reducedMotion?0:4;elements.trickName.textContent='SHAKE IT OFF.';elements.trickPoints.textContent=event.reason;trickUntil=time+1.4;}
  if(event.type==='respawn'||event.type==='reset'){camera=game.x-width*.29/scale;clearInputs();}
}}
function hud(){$('demo-pop').setAttribute('aria-disabled',String(game.mode!=='playing'||game.phase!=='roll'));elements.score.textContent=String(game.score).padStart(4,'0');elements.phase.textContent=game.mode==='ready'?'READY TO ROLL':game.mode==='paused'?'SESSION PAUSED':game.phase==='load'?'LOADING TAIL':game.phase==='grind'?(game.grind==='boardslide'?'BOARDSLIDE · HOLD THE LINE':'50-50 · HOLD THE LINE'):game.phase==='air'?((game.trick==='kickflip'||game.trick==='heelflip')?(game.catch?'CAUGHT FLIP. LEVEL IT.':`${game.trick==='kickflip'?'KICKFLIP':'HEELFLIP'} · CATCH`):game.trick==='popshuvit'?(game.catch?'CAUGHT SHUV. LEVEL IT.':'POP SHUVIT · CATCH'):game.trick==='360shuvit'?(game.catch?'CAUGHT 360. LEVEL IT.':'360 SHUVIT · CATCH'):game.trick==='varialkickflip'?(game.catch?'CAUGHT VARIAL. LEVEL IT.':'VARIAL KICKFLIP · CATCH'):game.trick==='varialheelflip'?(game.catch?'CAUGHT VARIAL. LEVEL IT.':'VARIAL HEELFLIP · CATCH'):game.trick==='treflip'?(game.catch?'CAUGHT 360 FLIP. LEVEL IT.':'360 FLIP · CATCH'):game.trick==='inwardheelflip'?(game.catch?'CAUGHT INWARD. LEVEL IT.':'INWARD HEELFLIP · CATCH'):game.trick==='180'?(game.catch?'CAUGHT 180. LEVEL IT.':'180 · CATCH'):game.catch?'CAUGHT. HOLD IT.':'LEVEL & CATCH'):game.phase==='bail'?'BACK ON THE BOARD':'ROLLING';elements.fill.style.width=`${game.phase==='load'?100*game.charge/PHYSICS.loadTime:game.phase==='air'?100:0}%`;elements.fill.style.opacity=game.phase==='air'?.45:1;elements.front.classList.toggle('active',game.front);elements.rear.classList.toggle('active',game.rear);elements.puck.style.transform=`translate(${game.steer*17}px,${-game.tilt*17}px)`;elements.line.textContent=game.combo>1?`${game.combo} TRICKS · ×${Math.min(4,1+Math.floor((game.combo-1)/3))} · LINE ${game.lineScore}`:game.lineScore?`LINE ${game.lineScore}`:'';const obstacle=obstaclesBetween(game.x+40,game.x+650)[0];elements.next.textContent=game.mode==='ready'?'LOAD → POP → CATCH → LAND':obstacle?`NEXT / ${obstacle.name}`:'ROOM TO FIND YOUR FEEL';elements.trick.classList.toggle('show',time<trickUntil&&game.mode!=='ready');}
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.06,(now-(last||now))/1000);last=now;time+=dt;if(game.mode==='playing'&&!landscapeBlocked){accumulator+=dt;while(accumulator>=1/120){if(demoMode)assistDemo(game);game.update(1/120);accumulator-=1/120;}eventLoop();}else accumulator=0;
  const target=game.x-width*(game.mode==='ready'?.70:.29)/scale;camera+=(target-camera)*(1-Math.exp(-dt*8));ctx.save();drawBackdrop();drawMarkers();for(const o of obstaclesBetween(camera-440,camera+width/scale+100))obstacle(o);board();for(const p of particles){if(game.mode==='playing'){p.life-=dt;p.vy-=350*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;ctx.fillRect((p.x-camera)*scale,groundY-p.y*scale,2*scale,2*scale);}particles=particles.filter(p=>p.life>0);ctx.globalAlpha=1;ctx.restore();hud();}
resize();requestAnimationFrame(frame);
