const APP_ORIGIN='https://rjcferreira.github.io';
const MAX_PLAYERS=5;

function cors(origin){return{'Access-Control-Allow-Origin':origin===APP_ORIGIN?origin:APP_ORIGIN,'Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'}}
function json(value,status=200,origin=APP_ORIGIN){return new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json',...cors(origin)}})}

export default {
  async fetch(request,env){
    const url=new URL(request.url),origin=request.headers.get('Origin')||APP_ORIGIN;
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors(origin)});
    if(url.pathname==='/health')return json({ok:true,service:'DinoPlay Multiplayer',maxPlayers:MAX_PLAYERS},200,origin);
    const match=url.pathname.match(/^\/room\/([A-Z2-9]{8})$/);
    if(!match)return json({error:'not-found'},404,origin);
    if(origin!==APP_ORIGIN)return json({error:'origin-not-allowed'},403,origin);
    const id=env.ROOMS.idFromName(match[1]);
    return env.ROOMS.get(id).fetch(request);
  }
};

export class GameRoom {
  constructor(ctx){this.ctx=ctx}
  async fetch(request){
    const url=new URL(request.url),token=url.searchParams.get('token')||'',role=url.searchParams.get('role'),peer=url.searchParams.get('peer')||'';
    if(request.headers.get('Upgrade')!=='websocket')return json({error:'websocket-required'},426);
    if(!/^[A-Za-z0-9_-]{32,128}$/.test(token)||!['host','guest'].includes(role)||!/^[a-z0-9]{6,20}$/.test(peer))return json({error:'invalid-invite'},400);
    const savedToken=await this.ctx.storage.get('token');
    if(savedToken&&savedToken!==token)return json({error:'invalid-invite'},403);
    const sockets=this.ctx.getWebSockets(),attachments=sockets.map(ws=>ws.deserializeAttachment()).filter(Boolean);
    if(role==='host'&&attachments.some(a=>a.role==='host'))return json({error:'host-already-connected'},409);
    if(role==='guest'&&attachments.length>=MAX_PLAYERS)return json({error:'room-full'},409);
    if(!savedToken){if(role!=='host')return json({error:'host-required'},409);await this.ctx.storage.put('token',token)}
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
  host(){return this.ctx.getWebSockets().find(ws=>ws.deserializeAttachment()?.role==='host')}
  find(peer){return this.ctx.getWebSockets().find(ws=>ws.deserializeAttachment()?.peer===peer)}
  sendHost(data){const host=this.host();if(host)host.send(JSON.stringify(data))}
}
