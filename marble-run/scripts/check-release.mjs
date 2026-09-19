import fs from 'node:fs';for(const f of ['dist/index.html','dist/style.css','dist/app.mjs','dist/engine.mjs'])if(!fs.existsSync(f))throw new Error('missing '+f);console.log('release files PASS')
