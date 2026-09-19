import fs from'node:fs';for(const f of['dist/index.html','dist/app.mjs','dist/engine.mjs','dist/style.css'])if(!fs.existsSync(f))throw Error('missing '+f);console.log('RACING RELEASE CHECK PASS');
