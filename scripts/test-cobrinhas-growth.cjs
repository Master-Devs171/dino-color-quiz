const assert = require("node:assert/strict");
const {
  Garden,
  lengthForScore,
  sizeForScore,
} = require("../games/community/cobrinhas/engine.js");
for (const score of [300, 4233, 10000, 100000, 1000000]) {
  assert.ok(lengthForScore(score * 2) > lengthForScore(score));
  assert.ok(sizeForScore(score * 2) > sizeForScore(score));
}
const g = new Garden(() => 0.5);
g.snakes = [g.player];
g.powerups = [];
g.coins = [];
g.player.score = 4233;
g.player.body = Array.from({ length: 400 }, (_, i) => ({
  x: 2400 - i * 8,
  y: 2400,
}));
g.food = [{ x: 2401, y: 2400, value: 1, kind: 0 }];
g.update(1 / 60, 0);
assert.ok(g.player.targetLength > 400);
g.food = [];
for (let i = 0; i < 500; i++) {
  g.update(1 / 60, i * 0.02);
  g.food = [];
}
assert.ok(g.player.body.length > 600);
assert.ok(
  g.player.body.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)),
);
console.log(
  "Crescimento: ultrapassa 400 pontos de corpo e continua a aumentar comprimento e grossura até pontuações elevadas OK.",
);
