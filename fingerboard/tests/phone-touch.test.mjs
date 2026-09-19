import test from 'node:test';
import assert from 'node:assert/strict';
import {installPhoneTouchGuard} from '../dist/phone-touch.mjs';
function fixture(){
 const handlers={};let clicks=0;
 const button={disabled:false,closest:s=>s==='dialog'?null:button,getAttribute:()=>null,click:()=>clicks++};
 const clear=installPhoneTouchGuard({addEventListener:(type,fn,opts)=>{assert.equal(opts.passive,false);handlers[type]=fn;}});
 const fire=(type,x=20,target=button,id=1)=>{let prevented=false;handlers[type]({target,cancelable:true,changedTouches:[{identifier:id,target,clientX:x,clientY:20}],preventDefault:()=>prevented=true});return prevented;};
 return {button,fire,clear,clicks:()=>clicks};
}
test('repeated phone taps cancel default zoom and activate exactly once per tap',()=>{const f=fixture();for(let i=0;i<6;i++){f.fire('touchstart');assert.equal(f.fire('touchend'),true);}assert.equal(f.clicks(),6);});
test('airborne demo taps still suppress zoom without activating unavailable ollie',()=>{const f=fixture();f.button.getAttribute=()=> 'true';f.fire('touchstart');assert.equal(f.fire('touchend'),true);assert.equal(f.clicks(),0);});
test('drag and cancellation do not activate buttons',()=>{const f=fixture();f.fire('touchstart');f.fire('touchmove',60);f.fire('touchend',60);f.fire('touchstart');f.fire('touchcancel');f.fire('touchend');assert.equal(f.clicks(),0);});
test('two-thumb pad touches cancel browser defaults without synthesizing clicks',()=>{const f=fixture();const pad={closest:()=>null};f.fire('touchstart',20,pad,1);f.fire('touchstart',200,pad,2);assert.equal(f.fire('touchend',20,pad,1),true);assert.equal(f.fire('touchend',200,pad,2),true);assert.equal(f.clicks(),0);});
test('suspending a session discards pending touch button activation',()=>{const f=fixture();f.fire('touchstart');f.clear();f.fire('touchend');assert.equal(f.clicks(),0);});
