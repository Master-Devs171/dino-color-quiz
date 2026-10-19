// Runtime smoke checks with a small DOM/canvas substitute; not a visual browser test.
const fs = require("node:fs"),
  vm = require("node:vm"),
  assert = require("node:assert/strict");
const root =
  require("node:path").resolve(__dirname, "../games/community/cobrinhas") + "/";
class Element {
  constructor() {
    this.style = {};
    this.dataset = {};
    this.children = [];
    this.attrs = {};
    this.events = {};
    this.checked = true;
    this.hidden = false;
    this.open = false;
  }
  setAttribute(k, v) {
    this.attrs[k] = v;
  }
  appendChild(e) {
    this.children.push(e);
  }
  append(...e) {
    this.children.push(...e);
  }
  replaceChildren() {
    this.children = [];
  }
  querySelectorAll() {
    return this.children;
  }
  querySelector() {
    return this.children[0] || new Element();
  }
  blur() {}
  focus() {}
  matches() {
    return false;
  }
  animate() {}
  getBoundingClientRect() {
    return { left: 0, top: 0, width: 122, height: 122 };
  }
  setPointerCapture() {}
  addEventListener(k, f) {
    this.events[k] = f;
  }
  showModal() {
    this.open = true;
  }
  close() {
    this.open = false;
  }
}
async function test() {
  const elements = {};
  for (const id of fs
    .readFileSync(root + "index.html", "utf8")
    .matchAll(/id="([^"]+)"/g))
    elements[id[1]] = new Element();
  elements.play.children = [new Element(), new Element()];
  let draws = 0;
  const ctx = new Proxy(
    {},
    {
      get: () => () => {
        draws++;
      },
    },
  );
  for (const el of Object.values(elements)) el.getContext = () => ctx;
  let scheduled;
  const listeners = {},
    store = {};
  const document = {
    hidden: false,
    getElementById: (id) => {
      assert.ok(elements[id], id);
      return elements[id];
    },
    querySelector: () => elements.garden,
    createElement: () => new Element(),
    addEventListener: (k, f) => (listeners[k] = f),
  };
  const env = {
    console,
    document,
    innerWidth: 1280,
    innerHeight: 800,
    devicePixelRatio: 1,
    performance: { now: () => 0 },
    matchMedia: () => ({ matches: false }),
    requestAnimationFrame: (fn) => (scheduled = fn),
    addEventListener: (k, f) => (listeners[k] = f),
    DinoPlay: {
      ready: async () => ({}),
      storage: {
        get: async (key) => store[key],
        set: async (key, value) => (store[key] = value),
      },
    },
  };
  env.window = env;
  env.parent = {};
  vm.createContext(env);
  for (const file of ["engine.js", "skin.js"])
    vm.runInContext(fs.readFileSync(root + file, "utf8"), env);
  let arena;
  const Base = env.Cobrinhas.Garden;
  env.Cobrinhas.Garden = class extends Base {
    constructor(...args) {
      super(...args);
      arena = this;
    }
  };
  vm.runInContext(fs.readFileSync(root + "game.js", "utf8"), env);
  await new Promise((resolve) => setImmediate(resolve));
  scheduled(16);
  assert.equal(elements.colors.children.length, 5);
  elements.customize.onclick();
  assert.equal(elements.wardrobe.open, true);
  elements["skin-color"].value = "#123abc";
  elements["skin-color"].events.input();
  elements["skin-pattern"].value = "rainbow";
  elements["skin-pattern"].events.input();
  elements["skin-hat"].value = "crown";
  elements["skin-hat"].events.input();
  for (const [key, value] of Object.entries({
    headColor: "#e1b2cd",
    eyeColor: "#335577",
    cheekColor: "#ffbb88",
    mouth: "tongue",
    cheeks: "freckles",
    flag: "custom",
    flagStyle: "cross",
    flagColorA: "#336699",
    flagColorB: "#ffcc33",
  })) {
    elements["skin-" + key].value = value;
    elements["skin-" + key].events.input();
  }
  scheduled(32);
  elements["skin-save"].onclick();
  assert.equal(store.appearance.flag, "custom");
  assert.equal(store.appearance.flagStyle, "cross");
  assert.equal(store.appearance.headColor, "#e1b2cd");
  assert.equal(store.appearance.mouth, "tongue");
  assert.equal(elements.wardrobe.open, false);
  assert.equal(store.appearance.color, "#123abc");
  assert.equal(store.appearance.hat, "crown");
  assert.equal(store.appearance.pattern, "rainbow");
  elements.play.onclick();
  for (let n = 3; n < 90; n++) scheduled(n * 16);
  assert.equal(elements.overlay.hidden, true);
  assert.equal(elements.ranking.children.length, 5);
  elements["edit-snake"].onclick();
  assert.equal(elements.overlay.hidden, false);
  elements["skin-hat"].value = "flower";
  elements["skin-hat"].events.input();
  elements["editor-close"].onclick();
  assert.equal(store.appearance.hat, "crown", "cancel must discard the draft");
  assert.equal(
    elements.overlay.hidden,
    true,
    "editing during play must resume",
  );
  elements.pause.onclick();
  elements.customize.onclick();
  elements["skin-random"].onclick();
  scheduled(1500);
  elements["skin-reset"].onclick();
  elements["skin-save"].onclick();
  assert.equal(
    elements.overlay.hidden,
    false,
    "editing while paused must stay paused",
  );
  assert.equal(store.appearance.hat, "none");
  elements.play.onclick();
  env.innerWidth = 360;
  env.innerHeight = 640;
  listeners.resize();
  for (let n = 90; n < 120; n++) scheduled(n * 33);
  arena.snakes = [arena.player];
  arena.player.angle = Math.PI;
  arena.player.body = Array.from({ length: 34 }, (_, i) => ({
    x: 13.01 + i * 8,
    y: 2400,
  }));
  scheduled(4000);
  assert.equal(elements["round-result"].hidden, false);
  assert.ok(elements["round-result"].textContent.includes("eliminada"));
  assert.equal(elements.overlay.hidden, false);
  elements.play.onclick();
  assert.equal(elements["round-result"].hidden, true);
  assert.equal(elements.overlay.hidden, true);
  document.hidden = true;
  listeners.visibilitychange();
  assert.equal(elements.overlay.hidden, false);
  const sample = {
    id: 0,
    angle: 0,
    body: Array.from({ length: 35 }, (_, i) => ({ x: 200 - i * 8, y: 200 })),
  };
  for (const pattern of env.SnakeStyle.options.pattern)
    for (const eyes of env.SnakeStyle.options.eyes)
      for (const hat of env.SnakeStyle.options.hat)
        env.SnakeStyle.draw(ctx, sample, { pattern, eyes, hat }, 1, false);
  for (const flag of env.SnakeStyle.options.flag)
    for (const mouth of env.SnakeStyle.options.mouth)
      for (const cheeks of env.SnakeStyle.options.cheeks)
        env.SnakeStyle.draw(
          ctx,
          sample,
          { flag, mouth, cheeks, pattern: "flag", flagStyle: "cross" },
          2,
          false,
        );
  for (const flagStyle of env.SnakeStyle.options.flagStyle)
    env.SnakeStyle.draw(ctx, sample, { flag: "custom", flagStyle }, 2, true);
  assert.ok(draws > 1000);
  console.log(
    "UI runtime: editor, preview, guardar/cancelar/repor, pausa/retoma, suspensão, 360px, caras, todas as bandeiras e fim de partida na borda OK.",
  );
}
test().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
