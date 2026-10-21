import {readdir,readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(fileURLToPath(new URL('..',import.meta.url))),scripts=resolve(root,'scripts');
const catalog=JSON.parse(await readFile(resolve(root,'games/catalog.json'),'utf8'));
const communityIds=catalog.games.filter(game=>game.runtime==='sandbox').map(game=>game.id);
const tests=(await readdir(scripts)).filter(name=>communityIds.some(id=>name===`test-${id}.cjs`||name===`test-${id}.mjs`||name.startsWith(`test-${id}-`))).sort();
for(const test of tests){const result=spawnSync(process.execPath,[resolve(scripts,test)],{cwd:root,stdio:'inherit'});if(result.status!==0)throw new Error(`${test} falhou`)}
console.log(`DinoPlay: ${tests.length} testes comunitários concluídos.`);
