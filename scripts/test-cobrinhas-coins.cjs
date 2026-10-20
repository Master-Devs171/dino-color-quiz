const assert = require("node:assert/strict");
const { Garden, WORLD } = require("../games/community/cobrinhas/engine.js");
const { Book } = require("../games/community/cobrinhas/progress.js");
function arena() {
  const g = new Garden(() => 0.1);
  g.snakes = [g.player];
  g.food = [];
  g.powerups = [];
  return g;
}
const g = arena(),
  head = g.player.body[0];
assert.equal(g.coins.length, 80);
assert.ok(
  g.coins.every((c) => c.x > 0 && c.y > 0 && c.x < WORLD && c.y < WORLD),
);
g.coins = [{ x: head.x + 3, y: head.y, cooldown: 0 }];
g.update(1 / 60, 0);
assert.equal(g.events.filter((e) => e === "coin").length, 1);
assert.equal(g.coins[0].cooldown, 25);
assert.equal(g.player.score, 0);
g.update(1 / 60, 0);
assert.ok(!g.events.includes("coin"));
g.coins[0].cooldown = 0.001;
g.update(1 / 60, 0);
assert.equal(g.coins[0].cooldown, 0);
assert.notEqual(g.coins[0].x, head.x + 3);
const magnet = arena(),
  h = magnet.player.body[0];
magnet.coins = [{ x: h.x + 120, y: h.y, cooldown: 0 }];
magnet.player.effects.magnet = 12;
magnet.update(1 / 60, 0);
assert.ok(magnet.coins[0].x < h.x + 120);
let picked = false;
for (let i = 0; i < 40; i++) {
  magnet.update(1 / 60, 0);
  if (magnet.events.includes("coin")) picked = true;
}
assert.ok(picked);
const old = new Book();
old.record("fruit", 5);
old.claim("first-fruits");
const legacy = old.snapshot();
delete legacy.coins;
assert.equal(new Book(legacy).coins, 3, "old reward balance becomes coins");
const book = new Book();
book.record("coins", 10);
assert.equal(book.coins, 10);
assert.ok(book.buy("mermaid"));
assert.equal(book.coins, 7);
const restored = new Book(book.snapshot());
assert.equal(restored.coins, 7);
assert.deepEqual(restored.state.purchased, ["mermaid"]);
restored.record("coins", -5);
assert.equal(restored.coins, 7);
assert.equal(new Book({ coins: -100 }).coins, 0);
assert.equal(new Book({ coins: Infinity }).coins, 0);
console.log(
  "Moedas: mapa, recolha única, reposição, íman, saldo, compras, gravação e migração OK.",
);
