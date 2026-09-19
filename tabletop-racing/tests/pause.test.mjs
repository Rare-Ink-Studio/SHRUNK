import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as engine from '../dist/engine.mjs';

test('pause freezes race and timer, releases both pointers, resumes and restarts cleanly',()=>{
 const elements=new Map();let now=1000;
 const element=id=>{if(!elements.has(id))elements.set(id,{textContent:'',disabled:false,classList:{add(){},remove(){}},focus(){},capture:new Set(),setPointerCapture(id){this.capture.add(id)},hasPointerCapture(id){return this.capture.has(id)},releasePointerCapture(id){this.capture.delete(id)},getBoundingClientRect(){return {left:0,width:240}},getContext(){return new Proxy({}, {get:()=>()=>{},set:()=>true})}});return elements.get(id)};
 const scope=vm.createContext({...engine,sessionViewport(){},document:{querySelector:element},innerWidth:844,innerHeight:390,devicePixelRatio:1,addEventListener(){},requestAnimationFrame(){},performance:{now:()=>now},localStorage:{},location:{href:''}});
 const source=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8').replace(/^import[^\n]+\n/gm,'');vm.runInContext(source,scope);
 const run=s=>vm.runInContext(s,scope);run('go();steer.onpointerdown({pointerId:1});gas.onpointerdown({pointerId:2,clientY:150});steer.onpointermove({pointerId:1,clientX:230});gas.onpointermove({pointerId:2,clientY:100});loop(1016)');
 const car=run('JSON.stringify(car)');now=1016;run('pauseRace()');assert.equal(run('run'),false);assert.equal(run('JSON.stringify(input)'),'{"steer":0,"gas":0,"boost":false}');assert.equal(element('#gas').capture.size,0);assert.equal(element('#steer').capture.size,0);
 now=6016;run('gas.onpointerdown({pointerId:3,clientY:120});steer.onpointerdown({pointerId:4});loop(6016)');assert.equal(run('JSON.stringify(car)'),car);assert.equal(run('gp'),null);assert.equal(run('sp'),null);
 run('resumeRace()');assert.equal(run('run'),true);assert.equal(run('performance.now()-t0'),16);assert.equal(run('JSON.stringify(car)'),car);assert.equal(run('input.gas'),0);
 run('gas.onpointerdown({pointerId:5,clientY:150});loop(6032)');assert.equal(run('input.gas'),1);assert.notEqual(run('JSON.stringify(car)'),car);
 run('pauseRace();go()');assert.equal(run('lap'),1);assert.equal(run('cp'),0);assert.equal(run('car.speed'),0);assert.equal(run('car.boost'),100);assert.equal(run('input.gas'),0);assert.equal(run('paused'),false);
 run("pauseRace();document.querySelector('#pause-home').onclick()");assert.equal(scope.location.href,'../../');assert.equal(run('run'),false);
});
