export function sessionViewport(change){
 const gate=document.createElement('dialog');gate.setAttribute('aria-label','Turn your phone');gate.innerHTML='<strong>SHRUNK</strong><h2>TURN YOUR PHONE</h2><p>This session plays in landscape.</p>';
 gate.style.cssText='position:fixed;inset:0;margin:0;max-width:none;max-height:none;border:0;padding:24px;background:#151a17;color:#f3f0df;text-align:center;box-sizing:border-box;flex-direction:column;align-items:center;justify-content:center;font-family:Arial,sans-serif';
 document.body.append(gate);gate.addEventListener('cancel',e=>e.preventDefault());
 function measure(){const v=window.visualViewport,use=v&&Math.abs((v.scale||1)-1)<.02;const width=use?v.width:innerWidth,height=use?v.height:innerHeight;if(!width||!height)return;const blocked=height>=width;gate.style.width=width+'px';gate.style.height=height+'px';gate.style.left=(use?v.offsetLeft:0)+'px';gate.style.top=(use?v.offsetTop:0)+'px';if(blocked){gate.style.display='flex';if(!gate.open)gate.showModal()}else{if(gate.open)gate.close();gate.style.display='none'}change({width,height,blocked,left:use?v.offsetLeft:0,top:use?v.offsetTop:0})}
 addEventListener('resize',measure);visualViewport?.addEventListener('resize',measure);visualViewport?.addEventListener('scroll',measure);addEventListener('orientationchange',()=>{measure();requestAnimationFrame(measure)});measure();
}
