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
// Shop accounting and free wheel collection must survive reloads without duplicates.
const shopBook = new Book();
assert.equal(shopBook.buy('mermaid'),false);
shopBook.record('fruit',5);shopBook.claim('first-fruits');
assert.equal(shopBook.buy('mermaid'),true);assert.equal(shopBook.stars,0);
assert.equal(shopBook.buy('mermaid'),false);assert.equal(shopBook.buy('__proto__'),false);
const ledger = new Book(shopBook.snapshot());assert.equal(ledger.stars,0);assert.deepEqual(ledger.state.purchased,['mermaid']);
for(let i=0;i<4;i++) assert.ok(ledger.spin(()=>0));
assert.equal(new Set(ledger.state.surprises).size,4);assert.equal(ledger.spin(),null);
assert.equal(ledger.stars,0);assert.equal(new Book(ledger.snapshot()).state.surprises.length,4);
const invalid = new Book({purchased:['dragon','dragon','bad'],surprises:['bad','berry','berry']});
assert.equal(invalid.stars,0);assert.deepEqual(invalid.state.purchased,[]);assert.deepEqual(invalid.state.surprises,['berry']);
console.log('Loja: saldo, compras únicas e recuperação OK. Roda grátis: quatro skins sem repetições e persistência OK.');
