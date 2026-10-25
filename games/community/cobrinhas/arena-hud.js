/* Lightweight arena feedback. No change to movement or collision rules. */
(function(root){
  'use strict';
  function status(game,boost=false){
    const p=game.player,head=p?.body?.[0],time=Math.max(0,Number(game.time)||0);
    if(!head)return {time,warning:false,boost:false};
    const world=root.Cobrinhas?.WORLD||4800;
    const radius=17*(root.Cobrinhas?.sizeForScore?.(p.score)||1);
    const distance=Math.min(head.x,head.y,world-head.x,world-head.y)-radius;
    return {time,warning:distance<170,boost:!!boost||p.effects?.speed>0};
  }
  if(typeof module!=='undefined')module.exports={status};
  if(!root.document)return;
  const hud=document.createElement('div');hud.id='arena-feedback';
  const clock=document.createElement('span');clock.id='round-clock';clock.setAttribute('aria-label','Tempo da partida');clock.textContent='00:00';
  const boost=document.createElement('span');boost.id='boost-indicator';boost.textContent='Boost ativo';boost.hidden=true;
  const warning=document.createElement('div');warning.id='edge-warning';warning.setAttribute('role','status');warning.textContent='Borda próxima — vira!';warning.hidden=true;
  hud.append(clock,boost);document.body.append(hud,warning);
  let last=-1;
  root.GardenArenaHUD={update(game,accelerating){
    const s=status(game,accelerating),second=Math.floor(s.time);
    if(last!==second){clock.textContent=Math.floor(second/60).toString().padStart(2,'0')+':'+(second%60).toString().padStart(2,'0');last=second;}
    if(boost.hidden===s.boost)boost.hidden=!s.boost;
    if(warning.hidden===s.warning)warning.hidden=!s.warning;
  }};
})(typeof window==='undefined'?globalThis:window);

