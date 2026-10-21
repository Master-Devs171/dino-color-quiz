import {readFile,access,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(await readFile(resolve(root,'games/catalog.json'),'utf8'));
const ids=new Set(),categories=new Set(['learn','puzzle','create','explore','action','sports','music']),nativeIds=new Set(['puzzle','blocks','race']);
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
  if(typeof game.name!=='string'||game.name.length<2||game.name.length>50)fail(`${game.id}: nome`);
  if(!/^[3-9][+]$/.test(game.age||''))fail(`${game.id}: idade`);
  if(typeof game.description!=='string'||game.description.length<10||game.description.length>180)fail(`${game.id}: descrição`);
  if(!/^\d+(?:\.\d+)? (?:KB|MB)$/.test(game.size||''))fail(`${game.id}: tamanho`);
  if(game.offline!==true||typeof game.multiplayer!=='boolean')fail(`${game.id}: offline/multiplayer`);
  if(!safePath(game.cover)||!Array.isArray(game.assets)||!game.assets.length||!game.assets.every(safePath))fail(`${game.id}: recursos locais`);
  if(game.runtime==='sandbox'&&(!safePath(game.entry)||!game.entry.startsWith(`games/community/${game.id}/`)))fail(`${game.id}: entry sandbox`);
  if(game.runtime==='sandbox'&&(!Array.isArray(game.permissions)||game.permissions.some(permission=>!['storage','multiplayer','entitlements'].includes(permission))||new Set(game.permissions).size!==game.permissions.length))fail(`${game.id}: permissions`);
  if(game.extras!==undefined){if(!Array.isArray(game.extras)||game.extras.length>12||game.extras.some(extra=>!extra||!/^[-a-z0-9]{3,32}$/.test(extra.id||'')||typeof extra.name!=='string'||extra.name.length<2||extra.name.length>50||typeof extra.description!=='string'||extra.description.length<10||extra.description.length>140||extra.type!=='permanent')||new Set(game.extras.map(extra=>extra.id)).size!==game.extras.length)fail(`${game.id}: extras`);if(!game.permissions?.includes('entitlements'))fail(`${game.id}: extras exigem permissão entitlements`)}
  if(game.runtime==='sandbox'&&(typeof game.author!=='string'||game.author.length<2||game.author.length>50||typeof game.license!=='string'||game.license.length<2||game.license.length>30))fail(`${game.id}: autor/licença`);
  if(game.multiplayer&&game.runtime==='sandbox'&&!game.permissions.includes('multiplayer'))fail(`${game.id}: permissão multiplayer`);
  for(const path of [game.cover,...game.assets,...(game.runtime==='sandbox'?[game.entry]:[])])await access(resolve(root,path.split('?')[0])).catch(()=>fail(`${game.id}: ficheiro em falta ${path}`));
}
const communityRoot=resolve(root,'games/community');
const communityFolders=await readdir(communityRoot,{withFileTypes:true}).catch(()=>[]);
const publicFields=['id','name','version','runtime','entry','category','age','cover','description','size','multiplayer','offline','assets','permissions','extras','license','author'];
for(const folder of communityFolders.filter(entry=>entry.isDirectory())){
  const manifest=JSON.parse(await readFile(resolve(communityRoot,folder.name,'manifest.json'),'utf8').catch(()=>fail(`${folder.name}: manifest.json em falta ou inválido`)));
  if(manifest.id!==folder.name)fail(`${folder.name}: o id do manifesto deve coincidir com a pasta`);
  const catalogGame=data.games.find(game=>game.id===manifest.id);
  if(!catalogGame)fail(`${manifest.id}: jogo ausente do catálogo`);
  for(const field of publicFields)if(JSON.stringify(catalogGame[field]??null)!==JSON.stringify(manifest[field]??null))fail(`${manifest.id}: campo ${field} difere entre manifesto e catálogo`);
}
for(const game of data.games.filter(game=>game.runtime==='sandbox'))if(!communityFolders.some(folder=>folder.isDirectory()&&folder.name===game.id))fail(`${game.id}: pasta comunitária em falta`);
console.log(`DinoPlay: ${data.games.length} jogos validados com sucesso.`);
