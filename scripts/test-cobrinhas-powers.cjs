const assert=require('node:assert/strict');
const {Garden,POWERS,WORLD}=require('../games/community/cobrinhas/engine.js');
function arena(){const g=new Garden(()=>.5);g.snakes=[g.player];g.food=[];g.powerups=[];return g;}
for(const kind of Object.keys(POWERS)){
 const g=arena(),h=g.player.body[0];g.powerups=[{...h,kind,cooldown:0}];g.update(1/60,0);
 assert.equal(g.player.effects[kind],POWERS[kind].duration);assert.ok(g.events.includes('power:'+kind));assert.equal(g.powerups[0].cooldown,20);
 g.update(1/60,0);assert.ok(g.player.effects[kind]<POWERS[kind].duration);assert.ok(!g.events.includes('power:'+kind));
 g.player.effects[kind]=.001;g.update(1/60,0);assert.equal(g.player.effects[kind],0);
 g.player.effects[kind]=5;g.drop(g.player);assert.equal(g.player.effects[kind],0);
 g.reset();assert.equal(g.powerups.length,24);assert.equal(g.player.effects[kind],0);
}
const magnet=arena(),h=magnet.player.body[0],food={x:h.x+120,y:h.y,value:3,kind:5};magnet.food=[food];magnet.player.effects.magnet=12;magnet.update(1/60,0);assert.ok(food.x<h.x+120);
for(let i=0;i<40;i++)magnet.update(1/60,0);assert.ok(magnet.player.score>=3);
const normal=arena(),fast=arena(),both=arena();fast.player.effects.speed=8;both.player.effects.speed=8;normal.update(1/60,0);fast.update(1/60,0);both.update(1/60,0,true);assert.ok(fast.player.body[0].x>normal.player.body[0].x);assert.equal(both.player.body[0].x,fast.player.body[0].x);
const edge=arena();edge.player.body[0]={x:WORLD-14,y:1000};edge.player.effects.speed=8;edge.update(.04,0);assert.ok(edge.events.includes('border'));assert.equal(edge.player.effects.speed,0);
console.log('Ajudas: recolha, duração, íman com pontos, velocidade sem multiplicação, reposição e eliminação na borda OK.');
