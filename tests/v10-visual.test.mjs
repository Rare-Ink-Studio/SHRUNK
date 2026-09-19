import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const cssFiles = [
  'dist/style.css',
  'dist/games/fingerboard/style.css',
  'dist/games/marble-run/style.css',
  'dist/games/tabletop-racing/style.css',
  'dist/games/desk-shot/style.css'
];

test('V10 depth/material layer exists across Home and all four sessions', async () => {
  for (const path of cssFiles) {
    const css = await readFile(path, 'utf8');
    assert.match(css, /V10 DEPTH \+ MATERIALS/);
  }
});

test('V10 preserves every frozen V9 JavaScript/module hash', async () => {
  const manifest = await readFile('V10_FROZEN_MJS_SHA256.txt', 'utf8');
  for (const line of manifest.trim().split(/\n+/)) {
    const match = line.match(/^([0-9a-f]{64})\s+\.\/(.+)$/);
    assert.ok(match, `bad hash line: ${line}`);
    const [, expected, path] = match;
    const data = await readFile(path);
    const actual = createHash('sha256').update(data).digest('hex');
    assert.equal(actual, expected, `frozen module changed: ${path}`);
  }
});
