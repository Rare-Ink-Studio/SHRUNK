import { access, readFile } from 'node:fs/promises';
const required = [
  'dist/index.html','dist/style.css','dist/icon.svg',
  'dist/games/fingerboard/index.html','dist/games/fingerboard/app.mjs','dist/games/fingerboard/engine.mjs',
  'dist/games/desk-shot/index.html','dist/games/desk-shot/app.mjs','dist/games/desk-shot/engine.mjs',
  'dist/games/marble-run/index.html','dist/games/marble-run/app.mjs','dist/games/marble-run/engine.mjs',
  'dist/games/tabletop-racing/index.html','dist/games/tabletop-racing/app.mjs','dist/games/tabletop-racing/engine.mjs'
];
for (const path of required) await access(path);
const home = await readFile('dist/index.html','utf8');
for (const label of ['FINGERBOARD','DESK SHOT','MARBLE RUN','TABLETOP RACING']) {
  if (!home.includes(label)) throw new Error(`Missing launcher entry: ${label}`);
}
console.log('SHRUNK master release check PASS');
