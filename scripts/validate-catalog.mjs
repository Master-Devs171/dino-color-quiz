import {readFile,access,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(await readFile(resolve(root,'games/catalog.json'),'utf8'));
const ids=new Set(),categories=new Set(['learn','create','explore']),nativeIds=new Set(['puzzle','blocks','race']);
const safePath=value=>typeof value==='string'&&value.length>0&&value.length<180&&!/^(?:[a-z]+:|\/\/|\/)/i.test(value)&&!value.split(/[\\/]/).includes('..');
const fail=message=>{throw new Error(`Catálogo inválido: ${message}`)};
if(data.catalogVersion!==1||!Array.isArray(data.games)||!data.games.length)fail('catalogVersion/games');
for(const game of data.games){
  if(!/^[a-z][a-z0-9-]{2,31}$/.test(game.id||''))fail(`id ${game.id}`);
  if(ids.has(game.id))fail(`id repetido ${game.id}`);ids.add(game.id);
  if(!['native','sandbox'].includes(game.runtime))fail(`${game.id}: runtime`);
  if(game.runtime==='native'&&!nativeIds.has(game.id))fail(`${game.id}: runtime native reservado à plataforma`);
  if(!categories.has(game.category))fail(`${game.id}: categoria`);
  if(!/^\d+\.\d+\.\d+$/.test(game.version||''))fail(`${game.id}: versão`);
  if(game.offline!==true||typeof game.multiplayer!=='boolean')fail(`${game.id}: offline/multiplayer`);
  if(!safePath(game.cover)||!Array.isArray(game.assets)||!game.assets.length||!game.assets.every(safePath))fail(`${game.id}: recursos locais`);
  if(game.runtime==='sandbox'&&(!safePath(game.entry)||!game.entry.startsWith(`games/community/${game.id}/`)))fail(`${game.id}: entry sandbox`);
  if(game.runtime==='sandbox'&&!Array.isArray(game.permissions))fail(`${game.id}: permissions`);
  if(game.multiplayer&&game.runtime==='sandbox'&&!game.permissions.includes('multiplayer'))fail(`${game.id}: permissão multiplayer`);
  for(const path of [game.cover,...game.assets,...(game.runtime==='sandbox'?[game.entry]:[])])await access(resolve(root,path.split('?')[0])).catch(()=>fail(`${game.id}: ficheiro em falta ${path}`));
}
const communityRoot=resolve(root,'games/community');
const communityFolders=await readdir(communityRoot,{withFileTypes:true}).catch(()=>[]);
const publicFields=['id','name','version','runtime','entry','category','age','cover','description','size','multiplayer','offline','assets','permissions','license','author'];
for(const folder of communityFolders.filter(entry=>entry.isDirectory())){
  const manifest=JSON.parse(await readFile(resolve(communityRoot,folder.name,'manifest.json'),'utf8').catch(()=>fail(`${folder.name}: manifest.json em falta ou inválido`)));
  if(manifest.id!==folder.name)fail(`${folder.name}: o id do manifesto deve coincidir com a pasta`);
  const catalogGame=data.games.find(game=>game.id===manifest.id);
  if(!catalogGame)fail(`${manifest.id}: jogo ausente do catálogo`);
  for(const field of publicFields)if(JSON.stringify(catalogGame[field]??null)!==JSON.stringify(manifest[field]??null))fail(`${manifest.id}: campo ${field} difere entre manifesto e catálogo`);
}
for(const game of data.games.filter(game=>game.runtime==='sandbox'))if(!communityFolders.some(folder=>folder.isDirectory()&&folder.name===game.id))fail(`${game.id}: pasta comunitária em falta`);
console.log(`DinoPlay: ${data.games.length} jogos validados com sucesso.`);
