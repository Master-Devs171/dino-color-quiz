import {readFile,readdir,lstat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(fileURLToPath(new URL('..',import.meta.url))),community=resolve(root,'games/community');
const folders=await readdir(community,{withFileTypes:true}).catch(()=>[]),allowed=new Set(['.html','.css','.js','.mjs','.json','.png','.jpg','.jpeg','.webp','.avif','.svg','.mp3','.wav','.ogg','.m4a','.webm','.mp4','.woff2','.ttf','.glb','.gltf','.bin','.txt','.md','']);
const textExtensions=new Set(['.html','.css','.js','.mjs','.json','.gltf','.svg','.txt','.md','']);
const fail=message=>{throw new Error(`Segurança comunitária: ${message}`)};
for(const folder of folders.filter(item=>item.isDirectory())){
  const base=resolve(community,folder.name),files=await readdir(base,{recursive:true,withFileTypes:true});let total=0;
  for(const item of files){if(!item.isFile())continue;const path=resolve(item.parentPath||item.path,item.name),relative=path.slice(base.length+1).replaceAll('\\','/'),stat=await lstat(path),extension=extname(item.name).toLowerCase();if(stat.isSymbolicLink())fail(`${folder.name}/${relative}: ligações simbólicas são proibidas`);if(!allowed.has(extension)&&item.name!=='LICENSE')fail(`${folder.name}/${relative}: extensão não permitida`);if(stat.size>15*1024*1024)fail(`${folder.name}/${relative}: ficheiro maior que 15 MB`);total+=stat.size;if(!textExtensions.has(extension)&&item.name!=='LICENSE')continue;const source=await readFile(path,'utf8');if(/https?:\/\//i.test(source.replace(/http:\/\/www\.w3\.org\/2000\/svg/g,'')))fail(`${folder.name}/${relative}: endereço externo`);if(/(?:fetch\s*\(|XMLHttpRequest|WebSocket|EventSource|RTCPeerConnection|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|navigator\.(?:geolocation|mediaDevices)|Notification\s*\(|window\.open\s*\(|eval\s*\(|new\s+Function\s*\()/i.test(source))fail(`${folder.name}/${relative}: API proibida`);if(extension==='.svg'&&/(?:<script|<foreignObject|\son\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|\/\/))/i.test(source))fail(`${folder.name}/${relative}: SVG ativo ou externo`)}
  if(total>50*1024*1024)fail(`${folder.name}: pacote maior que 50 MB`);
  const html=await readFile(resolve(base,'index.html'),'utf8');if(!/Content-Security-Policy/i.test(html)||!/connect-src\s+'none'/i.test(html)||!/object-src\s+'none'/i.test(html))fail(`${folder.name}: index.html sem CSP DinoPlay`);if(!/sdk\/dinoplay-game-sdk\.js/i.test(html))fail(`${folder.name}: SDK DinoPlay não incluído`);if(/<form\b/i.test(html))fail(`${folder.name}: formulários são proibidos`);
}
console.log(`DinoPlay: segurança de ${folders.filter(item=>item.isDirectory()).length} jogos comunitários validada.`);
