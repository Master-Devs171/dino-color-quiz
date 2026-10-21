const assert = require("node:assert/strict");
const {
  Book,
  wheelPrizes,
  shop,
} = require("../games/community/cobrinhas/progress.js");
const { Garden, POWERS } = require("../games/community/cobrinhas/engine.js");
assert.equal(Object.keys(shop).length, 10);
for (let index = 0; index < 8; index++) {
  const b = new Book(),
    r = b.spinCoins(() => (index + 0.1) / 8);
  assert.equal(r.amount, wheelPrizes[index]);
  assert.equal(b.coins, r.amount);
  assert.equal(b.spinCoins(), null);
  const restored = new Book(b.snapshot());
  assert.equal(restored.coins, r.amount);
  assert.equal(restored.spinCoins(), null);
  restored.record("rounds");
  assert.ok(restored.spinCoins(() => 0));
}
const b = new Book();
b.record("coins", 2000);
assert.equal(b.buyUpgrade("unknown"), false);
for (let n = 0; n < 10; n++) assert.equal(b.buyUpgrade("magnet"), true);
assert.equal(b.buyUpgrade("magnet"), false);
assert.equal(b.coins, 500);
const restored = new Book(b.snapshot());
assert.equal(restored.state.upgrades.magnet, 10);
assert.equal(restored.coins, 500);
assert.equal(new Book({ upgrades: { magnet: 10 } }).state.upgrades.magnet, 0);
const g = new Garden(() => 0.1);
g.snakes = [g.player];
g.food = [];
g.coins = [{ ...g.player.body[0], cooldown: 0 }];
g.powerups = [{ ...g.player.body[0], kind: "magnet", cooldown: 0 }];
g.upgrades = { magnet: 10, vision: 0, speed: 0, coins: 10 };
g.update(1 / 60, 0);
assert.equal(g.player.effects.magnet, POWERS.magnet.duration + 20);
assert.equal(g.events.filter((e) => e === "coin").length, 6);
assert.equal(g.roundStats.coins, 6);
g.reset();
assert.equal(g.roundStats.coins, 0);
assert.equal(g.upgrades.magnet, 10);
console.log(
  "Arcade: 8 prémios, rotação gratuita por partida, persistência, limite de melhorias, orçamento e efeitos reais OK.",
);
