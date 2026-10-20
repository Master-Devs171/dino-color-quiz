import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=await readFile(resolve(root,'cloudflare-multiplayer/src/index.js'),'utf8');
const client=await readFile(resolve(root,'multiplayer.js'),'utf8');
const module=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

const sent=[];
const device='a'.repeat(20),friend='b'.repeat(20);
const socket=value=>({deserializeAttachment:()=>({device:value}),send:data=>sent.push(JSON.parse(data))});
const old=socket(device),replacement=socket(device),friendSocket=socket(friend);
let sockets=[replacement,friendSocket];
const ctx={getWebSockets:()=>sockets,storage:{get:async key=>key===`friends:${device}`?[friend]:[]}};
const registry=new module.FriendRegistry(ctx);

await registry.webSocketClose(old);
if(sent.length)throw new Error('Uma ligação substituída marcou o jogador como offline.');

sockets=[friendSocket];
await registry.webSocketClose(old);
if(sent.length!==1||sent[0].type!=='presence'||sent[0].online!==false||sent[0].friend!==device)throw new Error('O encerramento real não notificou o amigo.');

sent.length=0;
await registry.webSocketMessage(old,JSON.stringify({type:'ping'}));
if(sent.length!==1||sent[0].type!=='pong')throw new Error('O heartbeat de presença não respondeu.');
if(!client.includes("presence.send(JSON.stringify({type:'ping'}))")||!client.includes("heartbeat-timeout"))throw new Error('O cliente não vigia ligações de presença paradas.');

console.log('DinoPlay: substituição de ligação, presença offline e heartbeat validados.');
