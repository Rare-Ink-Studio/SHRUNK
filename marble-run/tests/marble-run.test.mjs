import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {CHECKPOINTS,MAX_RUN_TIME,steerVelocity,checkpointScore,finishScore,isFinished} from '../dist/engine.mjs';
test('four checkpoints',()=>assert.equal(CHECKPOINTS.length,4));
test('run timer is 45 seconds',()=>assert.equal(MAX_RUN_TIME,45));
test('steering accelerates marble',()=>assert.ok(steerVelocity(0,1,.1)>0));
test('steering is clamped at tuned mobile speed',()=>assert.equal(steerVelocity(500,1,1),235));
test('later checkpoints score more',()=>assert.ok(checkpointScore(3,200)>checkpointScore(0,200)));
test('faster finish scores more',()=>assert.ok(finishScore(10,4)>finishScore(30,4)));
test('finish zone recognized',()=>assert.equal(isFinished(920,1000),true));
test('visible bars use collision geometry including pencil',()=>{const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');assert.match(app,/collideBar\(W\*\.65,H\*\.77,W\*\.24,10,-\.16/);assert.match(app,/PENCIL/);assert.match(app,/RULER/);assert.match(app,/ERASER/)});
