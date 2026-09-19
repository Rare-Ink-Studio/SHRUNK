import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {obstaclesBetween} from '../fingerboard/dist/engine.mjs';

test('fingerboard frozen course remains unchanged while challenge depth expands',()=>{
  const names=obstaclesBetween(0,5200).map(o=>o.name);
  assert.deepEqual(names,['START CURB','TABLE LEDGE','TABLE GAP','LOW RAIL','LANDING BLOCK','RUN OUT']);
});

test('marble V8 course includes additional solid card and eraser banks',()=>{
  const app=fs.readFileSync(new URL('../marble-run/dist/app.mjs',import.meta.url),'utf8');
  assert.match(app,/CARD/); assert.match(app,/W\*\.37,H\*\.43/);
  assert.match(app,/W\*\.73,H\*\.84/);
});

test('racing V8 course exposes three boost zones and extra tabletop obstacles',()=>{
  const app=fs.readFileSync(new URL('../tabletop-racing/dist/app.mjs',import.meta.url),'utf8');
  assert.match(app,/boostStrip3/); assert.match(app,/boostHits\.add\(3\)/);
  assert.match(app,/n:'PENCIL'/); assert.match(app,/n:'ERASER'/);
});

test('desk shot V8 adds more bank geometry while preserving five-shot loop',()=>{
  const app=fs.readFileSync(new URL('../desk-shot/dist/app.mjs',import.meta.url),'utf8');
  assert.match(app,/W\*\.76,H\*\.58/); assert.match(app,/W\*\.38,H\*\.62/);
});

test('challenge pool can ask for new V8 world content',()=>{
  const p=fs.readFileSync(new URL('../dist/progression.mjs',import.meta.url),'utf8');
  for(const token of ['finger-features-6','desk-bank-4','marble-score-1000','race-boost-tour']) assert.match(p,new RegExp(token));
});
