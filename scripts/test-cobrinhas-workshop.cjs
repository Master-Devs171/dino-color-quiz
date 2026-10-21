const assert = require("node:assert/strict");
const { Book, cosmetics } = require("../games/community/cobrinhas/progress.js");
const b = new Book();
assert.equal(b.buyCosmetic("love"), false);
assert.equal(b.buyCosmetic("bogus"), false);
b.record("coins", 1000);
assert.equal(b.buyCosmetic("love"), true);
assert.equal(b.buyCosmetic("love"), false);
assert.equal(b.coins, 900);
b.state.reaction = "love";
assert.equal(b.buyCosmetic("frost"), true);
b.state.knockout = "frost";
assert.equal(b.coins, 700);
assert.equal(b.buyUpgrade("magnet"), true);
assert.equal(b.coins, 550);
const restored = new Book(b.snapshot());
assert.equal(restored.coins, 550);
assert.equal(restored.state.reaction, "love");
assert.equal(restored.state.knockout, "frost");
assert.deepEqual(restored.state.cosmetics, ["love", "frost"]);
assert.equal(restored.state.upgrades.magnet, 1);
const bad = new Book({
  coins: 0,
  cosmetics: ["love", "bogus", "frost"],
  reaction: "love",
  knockout: "frost",
});
assert.deepEqual(bad.state.cosmetics, []);
assert.equal(bad.state.reaction, "none");
assert.equal(bad.state.knockout, "none");
for (const price of Object.values(cosmetics)) assert.ok(price > 0);
console.log(
  "Workshop: purchases, duplicate protection, balances, persistence, upgrade compatibility and invalid saves OK.",
);
