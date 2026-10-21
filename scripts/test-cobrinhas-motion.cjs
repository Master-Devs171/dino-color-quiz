const assert = require("node:assert/strict");
const { Garden } = require("../games/community/cobrinhas/engine.js");
for (const clockwise of [-1, 1]) {
  const g = new Garden(() => 0.1);
  g.snakes = [g.player];
  g.powerups = [];
  g.coins = [];
  g.food = [];
  g.player.targetLength = 120;
  g.player.body = Array.from({ length: 120 }, (_, i) => ({
    x: 2400 - i * 8,
    y: 2400,
  }));
  let prior = { ...g.player.body.at(-1) },
    stationary = 0,
    minMovement = Infinity;
  for (let frame = 0; frame < 1200; frame++) {
    g.update(1 / 60, g.player.angle + (clockwise * Math.PI) / 2);
    const tail = g.player.body.at(-1),
      moved = Math.hypot(tail.x - prior.x, tail.y - prior.y);
    if (frame > 120) {
      if (moved < 0.01) stationary++;
      minMovement = Math.min(minMovement, moved);
    }
    assert.ok(
      g.player.body.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)),
    );
    assert.equal(g.player.body.length, 120);
    prior = { ...tail };
  }
  assert.equal(
    stationary,
    0,
    "tail must keep moving during repeated full circles",
  );
  assert.ok(minMovement > 0.5, "tail must advance along travelled path");
  assert.ok(g.player.path.length < 1500, "history stays bounded");
}
console.log(
  "Movimento: voltas contínuas nos dois sentidos, cauda sempre em movimento, comprimento estável e histórico limitado OK.",
);
