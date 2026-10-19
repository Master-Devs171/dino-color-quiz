const assert = require("node:assert/strict"),
  { Book, tasks } = require("../games/community/cobrinhas/progress.js");
const b = new Book();
assert.equal(b.claim("first-fruits"), null);
b.record("fruit", 5);
assert.ok(b.ready().some((t) => t.id === "first-fruits"));
assert.ok(b.claim("first-fruits"));
assert.equal(b.stars, 3);
assert.equal(b.claim("first-fruits"), null);
assert.equal(b.stars, 3);
b.record("outfit", "dots");
assert.ok(b.claim("artist"));
assert.ok(b.unlocked.includes("cotton"));
for (let i = 0; i < 4; i++) b.record("region", i);
assert.ok(b.ready().some((t) => t.id === "full-garden"));
const restored = new Book(b.snapshot());
assert.deepEqual(restored.snapshot(), b.snapshot());
assert.equal(restored.stars, b.stars);
assert.equal(
  new Book({
    fruit: -50,
    styles: ["bad", "dots", "dots"],
    regions: 999,
    claimed: ["bad"],
  }).state.fruit,
  0,
);
for (const t of tasks) assert.ok(t.target > 0 && t.stars > 0);
b.record("outfit", "stripes");
b.record("outfit", "rainbow");
assert.ok(b.ready().some((t) => t.id === "designer"));
console.log(
  "Progressão: objetivos, prémios únicos, skins, regiões, recuperação e validação OK.",
);
