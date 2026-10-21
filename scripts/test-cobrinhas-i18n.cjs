const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const scope = {};
vm.runInNewContext(
  fs.readFileSync("games/community/cobrinhas/i18n.js", "utf8"),
  scope,
);
const i18n = scope.GardenI18n;
for (const [input, output] of [
  ["en-GB", "en"],
  ["pt_BR", "pt-BR"],
  ["pt-AO", "pt-PT"],
  ["fr-CA", "fr"],
  ["de-DE", "de"],
  ["es-MX", "es"],
  ["pl-PL", "pl"],
  ["ja", "pt-PT"],
  [null, "pt-PT"],
])
  assert.equal(i18n.normalize(input), output);
for (const [language, play] of [
  ["en", "Play!"],
  ["es", "¡Jugar!"],
  ["fr", "Jouer !"],
  ["de", "Spielen!"],
  ["pl", "Graj!"],
  ["pt-BR", "Jogar!"],
  ["pt-PT", "Jogar!"],
]) {
  i18n.setLanguage(language);
  assert.equal(i18n.t("Jogar!"), play);
  assert.equal(i18n.t("123 / 456"), "123 / 456");
  assert.equal(i18n.t("first-fruits"), "first-fruits");
}
i18n.setLanguage("en");
assert.equal(i18n.t("🌱 Nível 12"), "🌱 Level 12");
assert.equal(i18n.t("2 recompensas prontas"), "2 rewards ready");
assert.equal(i18n.t("Apanha 5 alimentos."), "Collect 5 foods.");
assert.equal(i18n.t("O meu álbum de descobertas 📒"), "My discovery album 📒");
assert.equal(i18n.t("corredor dourado"), "corredor dourado"); // Do not translate substrings inside words.
i18n.setLanguage("pt-PT");
assert.equal(i18n.t("🌱 Nível 12"), "🌱 Nível 12");
console.log(
  "Idiomas: sete idiomas, variantes regionais, fallback, números, mensagens e IDs estáveis OK.",
);
