const assert = require("node:assert/strict");
const {
  Garden,
  WORLD,
  FOOD_COUNT,
  FOOD_LIMIT,
} = require("../games/community/cobrinhas/engine.js");
function isolated() {
  const g = new Garden(() => 0.5);
  g.player.body = Array.from({ length: 34 }, (_, i) => ({
    x: 1200 - i * 8,
    y: 1200,
  }));
  g.snakes = [g.player];
  g.food = [{ x: 1204, y: 1200, value: 3, kind: 5 }];
  g.player.grace = 0;
  return g;
}
const eat = isolated();
eat.update(0.02, 0);
assert.equal(eat.player.score, 3);
assert.equal(eat.player.targetLength, 16);
const g = new Garden();
const player = g.player,
  bot = g.snakes[1];
g.snakes = [player, bot];
player.grace = bot.grace = 0;
player.body = Array.from({ length: 34 }, (_, i) => ({
  x: 1200 - i * 8,
  y: 1200,
}));
bot.body = Array.from({ length: 34 }, (_, i) => ({ x: 1100, y: 1186 - i * 8 }));
bot.angle = Math.PI / 2;
g.food = [{ x: 1100, y: 1300, value: 1, kind: 0 }];
g.update(0.001, 0);
assert.equal(
  bot.body.length,
  0,
  "bot head colliding with player body must drop points",
);
assert.ok(player.body.length, "player survives bot hitting its body");
assert.ok(g.food.some((f) => f.kind === 5 && f.value === 3));
assert.ok(g.events.includes("drop"));
assert.equal(g.roundStats.knockouts,1);
assert.ok(Math.abs(g.knockoutPosition.x-1100)<2 && Math.abs(g.knockoutPosition.y-1186)<2, "cosmetic effect uses defeated snake position");
const retry = new Garden();
retry.player.body = Array.from({ length: 34 }, (_, i) => ({
  x: 1200 - i * 8,
  y: 1200,
}));
retry.player.grace = 0;
retry.snakes[1].grace = 0;
retry.snakes[1].body = Array.from({ length: 34 }, (_, i) => ({
  x: 1201,
  y: 1100 + i * 8,
}));
retry.snakes = retry.snakes.slice(0, 2);
retry.update(0.001, 0);
assert.equal(retry.player.body.length, 0);
retry.snakes = [retry.player];
for (let i = 0; i < 100; i++) retry.update(0.03, 0);
assert.ok(retry.player.body.length);
assert.ok(retry.player.grace > 0);
const stress = new Garden();
for (let i = 0; i < 1800; i++)
  stress.update(1 / 60, i / 120, i % 100 < 20, true);
assert.ok(stress.food.length <= FOOD_LIMIT);
for (const s of stress.snakes)
  assert.ok(s.body.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)));
console.log(
  "Cobrinhas: comida, crescimento, colisões, pontos, reaparecimento e simulação prolongada OK.",
);

assert.equal(WORLD, 4800);
assert.equal(stress.snakes.length, 13);
assert.ok(stress.food.filter((f) => f.kind !== 5).length >= FOOD_COUNT);
const style = require("../games/community/cobrinhas/skin.js");
assert.deepEqual(
  style.sanitize({ color: "url(bad)", hat: "invalid", pattern: "invalid" }),
  style.defaults,
);
assert.equal(
  style.sanitize({
    color: "#123abc",
    pattern: "rainbow",
    eyes: "happy",
    hat: "crown",
    trail: "hearts",
  }).pattern,
  "rainbow",
);
console.log(
  "Arena 4800×4800, 13 cobrinhas, densidade de comida e validação do visual OK.",
);

// Each wall is lethal for players and bots, even while protected from other snakes.
for (const id of [0, 1])
  for (const wall of ["left", "right", "top", "bottom"]) {
    const arena = new Garden(() => 0.5),
      snake = arena.snakes[id];
    arena.snakes = [snake];
    snake.grace = 2;
    const pos = { x: WORLD / 2, y: WORLD / 2 };
    let angle = 0;
    if (wall === "left") {
      pos.x = 13.01;
      angle = Math.PI;
    }
    if (wall === "right") {
      pos.x = WORLD - 13.01;
      angle = 0;
    }
    if (wall === "top") {
      pos.y = 13.01;
      angle = -Math.PI / 2;
    }
    if (wall === "bottom") {
      pos.y = WORLD - 13.01;
      angle = Math.PI / 2;
    }
    snake.angle = angle;
    snake.body = Array.from({ length: 34 }, (_, i) => ({
      x: pos.x - Math.cos(angle) * i * 8,
      y: pos.y - Math.sin(angle) * i * 8,
    }));
    arena.update(0.04, angle);
    assert.equal(snake.body.length, 0, wall + " must eliminate snake " + id);
    assert.ok(
      arena.food.some((f) => f.kind === 5),
      "wall collision drops collectible points",
    );
    if (id === 0) assert.ok(arena.events.includes("border"));
  }
console.log(
  "Bordas: quatro lados eliminam jogador/adversária, incluindo proteção inicial, e deixam pontos.",
);
const {sizeForScore,zoomForScore}=require('../games/community/cobrinhas/engine.js');
assert.equal(new Garden().player.body.length,12);
for(const score of [0,10,50,100,300,1000]){assert.ok(sizeForScore(score+10)>sizeForScore(score));assert.ok(zoomForScore(score+10)<=zoomForScore(score));}
assert.ok(sizeForScore(300)>sizeForScore(0)*1.6);assert.ok(zoomForScore(300)<zoomForScore(0)*.75);
assert.ok(sizeForScore(1000000)>sizeForScore(10000));assert.ok(zoomForScore(1000000)>=.32);
console.log('Crescimento: início pequeno, grossura progressiva e câmara com afastamento limitado OK.');
