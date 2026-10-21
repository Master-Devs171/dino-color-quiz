const assert = require("node:assert/strict");
const {
  Book,
  timedGifts,
} = require("../games/community/cobrinhas/progress.js");
const b = new Book();
const now = 1790000000000;
assert.equal(b.claimGift("bogus", now), null);
assert.equal(b.claimGift("small", NaN), null);
assert.equal(b.claimGift("small", Number.MAX_SAFE_INTEGER), null);
assert.equal(b.claimGift("small", now).amount, 400);
assert.equal(b.claimGift("small", now + 1), null);
assert.equal(b.claimGift("large", now).amount, 300);
assert.equal(b.coins, 700);
const restored = new Book(b.snapshot());
assert.equal(restored.claimGift("small", now + 299999), null);
assert.equal(
  restored.claimGift("small", now + timedGifts.small.interval).amount,
  400,
);
assert.equal(restored.coins, 1100);
restored.record("session", {
  seconds: 0.5,
  score: 4200,
  survival: 30,
  kills: 2,
});
restored.record("session", {
  seconds: 0.5,
  score: 100,
  survival: 12,
  kills: 0,
});
assert.equal(restored.state.profile.totalSeconds, 1);
assert.equal(restored.state.profile.bestScore, 4200);
assert.equal(restored.state.profile.bestSurvival, 30);
assert.equal(restored.state.profile.kills, 2);
restored.state.profile.name = "Jardineiro";
const again = new Book(restored.snapshot());
assert.equal(again.state.profile.name, "Jardineiro");
assert.equal(again.state.profile.kills, 2);
const invalid = new Book({
  giftTimes: { small: -1, large: "bad" },
  profile: { name: "   ", totalSeconds: -4, kills: -1 },
});
assert.equal(invalid.state.profile.name, "Explorador");
assert.equal(invalid.state.profile.totalSeconds, 0);
assert.equal(invalid.state.giftTimes.small, 0);
console.log(
  "Extras: cooldowns, single claims, saved balances, real session stats, profile and invalid saves OK.",
);

require("../games/community/cobrinhas/i18n.js");
GardenI18n.setLanguage("en");
assert.equal(GardenI18n.t("Presentes"), "Gifts");
assert.equal(GardenI18n.t("Modo de controlo"), "Control mode");
assert.equal(GardenI18n.t("O teu perfil"), "Your profile");
