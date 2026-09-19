import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const html=readFileSync('dist/index.html','utf8');
for(const file of readdirSync('dist').filter(f=>f.endsWith('.mjs'))){
 execFileSync(process.execPath,['--check',`dist/${file}`]);
 const js=readFileSync(`dist/${file}`,'utf8');
 for(const match of js.matchAll(/(?:from\s*|src\s*=\s*)['"]\.\/(.*?)['"]/g))assert.ok(existsSync(`dist/${match[1]}`),`Missing ${match[1]}`);
}
for(const match of html.matchAll(/(?:src|href)="\.\/(.*?)"/g))assert.ok(existsSync(`dist/${match[1]}`),`Missing ${match[1]}`);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Duplicate IDs');
assert.equal(JSON.parse(readFileSync('.openai/hosting.json')).static.directory,'dist');
console.log('Production static release: syntax, imports, assets, HTML IDs and hosting entrypoint passed.');
