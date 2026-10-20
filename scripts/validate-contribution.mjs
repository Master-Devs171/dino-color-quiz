import {execFileSync} from 'node:child_process';
import {access,readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const base=process.env.BASE_SHA;
const target=process.env.TARGET_SHA||'HEAD';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
if(!base)throw new Error('BASE_SHA não definido');
const changed=execFileSync('git',['diff','--name-only',`${base}...${target}`],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const folders=[...new Set(changed.map(path=>path.match(/^games\/community\/([^/]+)\//)?.[1]).filter(Boolean))];
const touchesGame=folders.length>0||changed.includes('games/catalog.json');
if(!touchesGame){console.log('DinoPlay: pull request sem contribuição de jogo.');process.exit(0)}
if(folders.length!==1)throw new Error('Cada pull request deve alterar exatamente um jogo comunitário.');
const id=folders[0];
const allowed=path=>path.startsWith(`games/community/${id}/`)||path==='games/catalog.json'||new RegExp(`^scripts/test-${id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}[^/]*\\.(?:cjs|mjs)$`).test(path);
const forbidden=changed.filter(path=>!allowed(path));
if(forbidden.length)throw new Error(`Uma contribuição de jogo não pode alterar o núcleo da plataforma:\n${forbidden.join('\n')}`);
if(!changed.includes('games/catalog.json'))throw new Error('A entrada em games/catalog.json é obrigatória.');
for(const required of [`games/community/${id}/manifest.json`,`games/community/${id}/index.html`,`games/community/${id}/LICENSE`,`games/community/${id}/README.md`])await access(resolve(root,required)).catch(()=>{throw new Error(`Ficheiro obrigatório em falta na contribuição: ${required}`)});
const nextCatalog=JSON.parse(await readFile(resolve(root,'games/catalog.json'),'utf8'));
const nextGame=nextCatalog.games?.find(game=>game.id===id);
if(!nextGame)throw new Error(`O jogo ${id} não existe no catálogo atualizado.`);
let previousGame=null;
try{
  const previousCatalog=JSON.parse(execFileSync('git',['show',`${base}:games/catalog.json`],{encoding:'utf8'}));
  previousGame=previousCatalog.games?.find(game=>game.id===id)||null;
}catch{}
if(previousGame){
  const parts=value=>String(value||'').split('.').map(Number);
  const newer=(next,old)=>{const a=parts(next),b=parts(old);for(let index=0;index<3;index++){const difference=(a[index]||0)-(b[index]||0);if(difference)return difference>0}return false};
  if(!newer(nextGame.version,previousGame.version))throw new Error(`A atualização de ${id} deve aumentar a versão (${previousGame.version} → ${nextGame.version}).`);
}
console.log(`DinoPlay: caminhos da contribuição ${id} aprovados.`);
