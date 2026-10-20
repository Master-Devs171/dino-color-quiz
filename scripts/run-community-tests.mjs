import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(fileURLToPath(new URL('..',import.meta.url))),scripts=resolve(root,'scripts');
const tests=(await readdir(scripts)).filter(name=>/^test-[a-z0-9-]+.*\.cjs$/.test(name)).sort();
for(const test of tests){const result=spawnSync(process.execPath,[resolve(scripts,test)],{cwd:root,stdio:'inherit'});if(result.status!==0)throw new Error(`${test} falhou`)}
console.log(`DinoPlay: ${tests.length} testes comunitários concluídos.`);
