const APP_ORIGIN='https://rjcferreira.github.io';
const MAX_PLAYERS=5;
const INVITE_TTL_MS=120000;

function cors(origin){return{'Access-Control-Allow-Origin':origin===APP_ORIGIN?origin:APP_ORIGIN,'Access-Control-Allow-Methods':'GET, POST, DELETE, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization, X-Dino-Device','Vary':'Origin'}}
function json(value,status=200,origin=APP_ORIGIN){return new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json',...cors(origin)}})}

export default {
  async fetch(request,env){
    const url=new URL(request.url),origin=request.headers.get('Origin')||APP_ORIGIN;
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors(origin)});
    if(url.pathname==='/health')return json({ok:true,service:'DinoPlay Multiplayer',maxPlayers:MAX_PLAYERS,inviteTtlSeconds:INVITE_TTL_MS/1000,singleUseInvites:true},200,origin);
    if(url.pathname.startsWith('/friends/')||url.pathname==='/play'){if(origin!==APP_ORIGIN)return json({error:'origin-not-allowed'},403,origin);const id=env.FRIENDS.idFromName('dinoplay-friends');return env.FRIENDS.get(id).fetch(request)}
    const match=url.pathname.match(/^\/room\/([a-z0-9]{11})$/);
    if(!match)return json({error:'not-found'},404,origin);
    if(origin!==APP_ORIGIN)return json({error:'origin-not-allowed'},403,origin);
    const id=env.ROOMS.idFromName(match[1]);
    return env.ROOMS.get(id).fetch(request);
  }
};

export class GameRoom {
  constructor(ctx,env){this.ctx=ctx;this.env=env}
  async fetch(request){
    const url=new URL(request.url),token=url.searchParams.get('token')||'',role=url.searchParams.get('role'),peer=url.searchParams.get('peer')||'',device=url.searchParams.get('device')||'',friend=url.searchParams.get('friend')||'';
    if(request.headers.get('Upgrade')!=='websocket')return json({error:'websocket-required'},426);
    if(token!==url.pathname.split('/').pop()||!['host','guest'].includes(role)||!/^[a-z0-9]{6,20}$/.test(peer)||!/^[a-z0-9]{20}$/.test(device))return json({error:'invalid-invite'},400);
    const savedToken=await this.ctx.storage.get('token'),createdAt=await this.ctx.storage.get('createdAt'),used=await this.ctx.storage.get('used');
    if(savedToken&&savedToken!==token)return json({error:'invalid-invite'},403);
    const sockets=this.ctx.getWebSockets(),attachments=sockets.map(ws=>ws.deserializeAttachment()).filter(Boolean);
    if(role==='host'&&attachments.some(a=>a.role==='host'))return json({error:'host-already-connected'},409);
    if(role==='guest'&&(!createdAt||Date.now()-createdAt>INVITE_TTL_MS))return json({error:'invite-expired'},410);
    if(role==='guest'&&(used||attachments.some(a=>a.role==='guest')))return json({error:'invite-used'},409);
    if(!savedToken){if(role!=='host'||!/^[a-z0-9]{20}$/.test(friend))return json({error:'host-required'},409);const registry=this.env.FRIENDS.get(this.env.FRIENDS.idFromName('dinoplay-friends')),check=await registry.fetch(`https://internal/check?a=${device}&b=${friend}`,{headers:{'X-Dino-Internal':'1'}});if(!check.ok)return json({error:'friend-not-authorized'},403);const now=Date.now();await this.ctx.storage.put({token,createdAt:now,used:false,hostDevice:device,guestDevice:friend});await this.ctx.storage.setAlarm(now+INVITE_TTL_MS)}
    if(role==='guest'&&device!==await this.ctx.storage.get('guestDevice'))return json({error:'friend-not-authorized'},403);
    if(role==='guest')await this.ctx.storage.put('used',true);
    const pair=new WebSocketPair(),client=pair[0],server=pair[1],attachment={role,peer,approved:role==='host'};
    this.ctx.acceptWebSocket(server);server.serializeAttachment(attachment);
    if(role==='guest')this.sendHost({type:'join-request',peer});
    else server.send(JSON.stringify({type:'room-ready',maxPlayers:MAX_PLAYERS}));
    return new Response(null,{status:101,webSocket:client});
  }
  webSocketMessage(ws,message){
    let data;try{data=JSON.parse(message)}catch{return}
    const sender=ws.deserializeAttachment();if(!sender)return;
    if(sender.role==='host'){
      if(data.type==='approve'&&data.peer){const target=this.find(data.peer);if(!target)return;const info=target.deserializeAttachment();info.approved=true;target.serializeAttachment(info);target.send(JSON.stringify({type:'approved'}));ws.send(JSON.stringify({type:'player-approved',peer:data.peer}));return}
      if(data.type==='reject'&&data.peer){const target=this.find(data.peer);target?.close(4003,'rejected');return}
      if(data.to&&data.payload){const target=this.find(data.to);if(target?.deserializeAttachment()?.approved)target.send(JSON.stringify({type:'signal',from:sender.peer,payload:data.payload}))}
      return;
    }
    if(!sender.approved)return;
    const host=this.host();if(host&&data.payload)host.send(JSON.stringify({type:'signal',from:sender.peer,payload:data.payload}));
  }
  webSocketClose(ws){const info=ws.deserializeAttachment();if(!info)return;if(info.role==='host'){this.ctx.getWebSockets().forEach(s=>s.close(4001,'host-left'));this.ctx.storage.deleteAll()}else this.sendHost({type:'player-left',peer:info.peer})}
  webSocketError(ws){this.webSocketClose(ws)}
  async alarm(){const used=await this.ctx.storage.get('used');if(used)return;this.ctx.getWebSockets().forEach(ws=>ws.close(4004,'invite-expired'));await this.ctx.storage.deleteAll()}
  host(){return this.ctx.getWebSockets().find(ws=>ws.deserializeAttachment()?.role==='host')}
  find(peer){return this.ctx.getWebSockets().find(ws=>ws.deserializeAttachment()?.peer===peer)}
  sendHost(data){const host=this.host();if(host)host.send(JSON.stringify(data))}
}

async function secretHash(secret){const bytes=new TextEncoder().encode(secret),hash=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')}
function friendCode(){const chars='abcdefghjkmnpqrstuvwxyz23456789',bytes=crypto.getRandomValues(new Uint8Array(11));return Array.from(bytes,b=>chars[b%chars.length]).join('')}
function sessionToken(){const bytes=crypto.getRandomValues(new Uint8Array(32));return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')}
export class FriendRegistry {
  constructor(ctx){this.ctx=ctx}
  async fetch(request){
    const url=new URL(request.url);
    if(url.pathname==='/check'&&request.headers.get('X-Dino-Internal')==='1'){const a=url.searchParams.get('a'),b=url.searchParams.get('b'),friends=await this.ctx.storage.get(`friends:${a}`)||[];return json({friends:friends.includes(b)},friends.includes(b)?200:403)}
    if(url.pathname==='/play'&&request.headers.get('Upgrade')==='websocket'){const ticket=url.searchParams.get('ticket')||'',session=await this.ctx.storage.get(`session:${ticket}`);await this.ctx.storage.delete(`session:${ticket}`);if(!session||session.expires<Date.now())return json({error:'session-expired'},401);const pair=new WebSocketPair(),client=pair[0],server=pair[1];this.ctx.getWebSockets().filter(ws=>ws.deserializeAttachment()?.device===session.device).forEach(ws=>ws.close(4005,'replaced'));this.ctx.acceptWebSocket(server);server.serializeAttachment({device:session.device});const friends=await this.ctx.storage.get(`friends:${session.device}`)||[];server.send(JSON.stringify({type:'ready',device:session.device,friends,online:this.onlineFriends(friends)}));this.notifyPresence(session.device,true,friends);return new Response(null,{status:101,webSocket:client})}
    const device=request.headers.get('X-Dino-Device')||'',secret=(request.headers.get('Authorization')||'').replace(/^Bearer\s+/,'');
    if(url.pathname==='/friends/register'&&request.method==='POST'){let body;try{body=await request.json()}catch{return json({error:'invalid'},400)}if(!/^[a-z0-9]{20}$/.test(body.device)||!/^[A-Za-z0-9_-]{40,80}$/.test(body.secret))return json({error:'invalid'},400);const key=`device:${body.device}`,existing=await this.ctx.storage.get(key),hash=await secretHash(body.secret);if(existing&&existing!==hash)return json({error:'device-conflict'},409);if(!existing)await this.ctx.storage.put(key,hash);return json({ok:true})}
    if(!/^[a-z0-9]{20}$/.test(device)||!/^[A-Za-z0-9_-]{40,80}$/.test(secret)||(await this.ctx.storage.get(`device:${device}`))!==await secretHash(secret))return json({error:'unauthorized'},401);
    if(url.pathname==='/friends/code'&&request.method==='POST'){let code;do{code=friendCode()}while(await this.ctx.storage.get(`code:${code}`));await this.ctx.storage.put(`code:${code}`,{from:device,expires:Date.now()+INVITE_TTL_MS});return json({code,expiresIn:120})}
    if(url.pathname==='/friends/accept'&&request.method==='POST'){let body;try{body=await request.json()}catch{return json({error:'invalid'},400)}const code=String(body.code||'').trim().toLowerCase(),invite=await this.ctx.storage.get(`code:${code}`);if(!invite)return json({error:'invalid-code'},404);if(invite.expires<Date.now()){await this.ctx.storage.delete(`code:${code}`);return json({error:'expired'},410)}if(invite.from===device)return json({error:'same-device'},409);const fromFriends=await this.ctx.storage.get(`friends:${invite.from}`)||[],toFriends=await this.ctx.storage.get(`friends:${device}`)||[];if(!fromFriends.includes(device))fromFriends.push(device);if(!toFriends.includes(invite.from))toFriends.push(invite.from);await this.ctx.storage.put({[`friends:${invite.from}`]:fromFriends,[`friends:${device}`]:toFriends});await this.ctx.storage.delete(`code:${code}`);return json({ok:true,friendId:invite.from})}
    if(url.pathname==='/friends/list'&&request.method==='GET')return json({friends:await this.ctx.storage.get(`friends:${device}`)||[]});
    if(url.pathname==='/friends/session'&&request.method==='POST'){const ticket=sessionToken();await this.ctx.storage.put(`session:${ticket}`,{device,expires:Date.now()+60000});return json({ticket,expiresIn:60})}
    const remove=url.pathname.match(/^\/friends\/([a-z0-9]{20})$/);if(remove&&request.method==='DELETE'){const other=remove[1],mine=(await this.ctx.storage.get(`friends:${device}`)||[]).filter(x=>x!==other),theirs=(await this.ctx.storage.get(`friends:${other}`)||[]).filter(x=>x!==device);await this.ctx.storage.put({[`friends:${device}`]:mine,[`friends:${other}`]:theirs});this.sendTo(device,{type:'friend-removed',friend:other});this.sendTo(other,{type:'friend-removed',friend:device});return json({ok:true})}
    return json({error:'not-found'},404);
  }
  async webSocketMessage(ws,message){let data;try{data=JSON.parse(message)}catch{return}const from=ws.deserializeAttachment()?.device,to=data.to;if(!from||!/^[a-z0-9]{20}$/.test(to||''))return;const friends=await this.ctx.storage.get(`friends:${from}`)||[];if(!friends.includes(to))return ws.send(JSON.stringify({type:'friend-removed',friend:to}));const target=this.socket(to);if(data.type==='invite')target?.send(JSON.stringify({type:'game-invite',from,game:String(data.game||'').slice(0,30)}));else if(data.type==='accept'){const match=sessionToken().slice(0,16),payload={type:'match',match,game:String(data.game||'').slice(0,30),players:[to,from]};target?.send(JSON.stringify({...payload,host:true,friend:from}));ws.send(JSON.stringify({...payload,host:false,friend:to}))}else if(data.type==='reject')target?.send(JSON.stringify({type:'invite-rejected',from}));else if(data.type==='signal'&&data.payload)target?.send(JSON.stringify({type:'signal',from,payload:data.payload}))}
  async webSocketClose(ws){const device=ws.deserializeAttachment()?.device;if(!device)return;const friends=await this.ctx.storage.get(`friends:${device}`)||[];this.notifyPresence(device,false,friends)}
  webSocketError(ws){this.webSocketClose(ws)}
  socket(device){return this.ctx.getWebSockets().find(ws=>ws.deserializeAttachment()?.device===device)}
  sendTo(device,data){const ws=this.socket(device);if(ws)ws.send(JSON.stringify(data))}
  onlineFriends(friends){return friends.filter(id=>this.socket(id))}
  notifyPresence(device,online,friends){friends.forEach(id=>this.sendTo(id,{type:'presence',friend:device,online}))}
}
