import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
for(const file of process.argv.slice(2)){
  const formatted=execFileSync(path.resolve('node_modules/.bin/prettier'),['--stdin-filepath',file],{input:fs.readFileSync(file,'utf8'),encoding:'utf8'});
  const temp=file+'.tmp';fs.writeFileSync(temp,formatted);fs.renameSync(temp,file);
}
