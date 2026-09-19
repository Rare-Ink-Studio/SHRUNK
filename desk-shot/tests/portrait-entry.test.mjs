import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';

const here=dirname(fileURLToPath(import.meta.url));
const app=readFileSync(resolve(here,'../dist/app.mjs'),'utf8');
const served=readFileSync(resolve(here,'../../dist/games/desk-shot/app.mjs'),'utf8');

test('portrait entry skips drawing until a real landscape viewport exists',()=>{
  assert.match(app,/function draw\(\)\{if\(orientationBlocked\|\|W<2\|\|H<2\)return;/);
});

test('served Desk Shot app matches the guarded source copy',()=>{
  assert.equal(served,app);
});
