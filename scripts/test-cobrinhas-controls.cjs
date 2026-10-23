const fs = require("node:fs"),
  vm = require("node:vm"),
  assert = require("node:assert/strict");
const { Book } = require("../games/community/cobrinhas/progress.js");
const nodes = {},
  handlers = {},
  intervals = [];
let tones = 0,
  heading = null;
class Node {
  constructor() {
    this.children = [];
    this.style = { left: "", top: "", right: "", bottom: "" };
    this.attrs = {};
    this.dataset = {};
    this.className = "";
    this.classList = {
      add: (n) => (this.className += " " + n),
      remove: (n) => (this.className = this.className.replace(n, "")),
    };
  }
  set id(v) {
    this._id = v;
    nodes[v] = this;
  }
  get id() {
    return this._id;
  }
  append(...xs) {
    this.children.push(...xs);
  }
  replaceChildren(...xs) {
    this.children = xs;
  }
  setAttribute(k, v) {
    this.attrs[k] = v;
  }
  addEventListener(k, f) {
    this[k] = f;
  }
  getBoundingClientRect() {
    return {
      left: parseFloat(this.style.left) || 24,
      top: parseFloat(this.style.top) || 500,
      width: 100,
      height: 100,
    };
  }
  showModal() {
    this.open = true;
  }
  close() {
    this.open = false;
  }
  focus() {}
  click() {
    this.onclick?.();
  }
  querySelector(sel) {
    return (
      this.children.find((c) =>
        sel === "b" ? c.tag === "b" : c.className?.includes(sel.slice(1)),
      ) || new Node()
    );
  }
  getContext() {
    return new Proxy({}, { get: () => () => {} });
  }
}
const node = (id) => nodes[id] || (nodes[id] = new Node());
const parent = new Node(),
  level = new Node();
const book = new Book();
class Audio {
  constructor() {
    this.state = "running";
    this.currentTime = 0;
    this.destination = {};
  }
  resume() {
    return Promise.resolve();
  }
  suspend() {
    return Promise.resolve();
  }
  createOscillator() {
    return {
      frequency: {},
      connect() {},
      start() {
        tones++;
      },
      stop() {},
    };
  }
  createGain() {
    return {
      gain: {
        setValueAtTime() {},
        linearRampToValueAtTime() {},
        exponentialRampToValueAtTime() {},
      },
      connect() {},
    };
  }
}
const context = {
  console,
  Date,
  Math,
  Number,
  Promise,
  Object,
  Array,
  String,
  Set,
  performance: { now: () => 1000 },
  setInterval: (f) => intervals.push(f),
  requestAnimationFrame() {},
  matchMedia: () => ({ matches: false }),
  document: {
    body: new Node(),
    hidden: false,
    createElement: (tag) => {
      const n = new Node();
      n.tag = tag;
      return n;
    },
    getElementById: node,
    querySelector: (sel) => (sel === ".welcome-content" ? parent : level),
    addEventListener: (k, f) => (handlers[k] = f),
  },
  GardenBridge: {
    ready: Promise.resolve(),
    get: async () => null,
    set: async () => {},
    pauseForPanel: () => false,
    closePanel() {},
    steer: (a) => (heading = a),
    getAppearance: () => ({}),
  },
  GardenJournal: {
    book,
    session: (v) => book.record("session", v),
    commit() {},
  },
  GardenProgress: require("../games/community/cobrinhas/progress.js"),
  SnakeStyle: { draw() {} },
  GardenIcons: { draw() {} },
  AudioContext: Audio,
};
context.window = context;
vm.createContext(context);
vm.runInContext(
  fs.readFileSync(
    require("node:path").join(
      __dirname,
      "../games/community/cobrinhas/extras.js",
    ),
    "utf8",
  ),
  context,
);
context.GardenExtras.open("controls");
nodes["control-fixed"].click();
assert.equal(context.document.body.dataset.control, "fixed");
context.GardenControls.start({ pointerId: 1, clientX: 74, clientY: 550 }, true);
context.GardenControls.move({ pointerId: 1, clientX: 124, clientY: 550 });
assert.equal(heading, 0);
context.GardenControls.start({ pointerId: 99, clientX: 0, clientY: 0 }, true);
context.GardenControls.end({ pointerId: 99 });
assert.equal(context.document.body.dataset.touchActive, "true", "second finger must not release the steering finger");
context.GardenControls.move({ pointerId: 1, clientX: 74, clientY: 600 });
assert.equal(heading, Math.PI / 2, "original finger keeps steering");
context.GardenControls.end({ pointerId: 1 });
assert.equal(context.document.body.dataset.touchActive, "false");
nodes["control-floating"].click();
context.GardenControls.start({ pointerId: 2, clientX: 100, clientY: 100 });
context.GardenControls.move({ pointerId: 2, clientX: 100, clientY: 150 });
assert.equal(heading, Math.PI / 2);
context.GardenControls.end();
nodes["control-follow"].click();
context.GardenControls.start({ pointerId: 3, clientX: 100, clientY: 100 });
context.GardenControls.move({ pointerId: 3, clientX: 200, clientY: 100 });
assert.equal(heading, 0);
assert.ok(parseFloat(node("joystick").style.left) > 50);
context.GardenControls.end();
nodes["control-touch"].click();
assert.equal(
  context.GardenControls.start({ pointerId: 4, clientX: 100, clientY: 100 }),
  false,
);
assert.equal(
  context.GardenControls.move({ pointerId: 4, clientX: 120, clientY: 100 }),
  false,
);
context.GardenExtras.open("settings");
nodes["pref-music"].checked = true;
nodes["pref-music"].onchange();
intervals[0]();
assert.equal(tones, 1);
nodes["pref-music"].checked = false;
nodes["pref-music"].onchange();
intervals[0]();
assert.equal(tones, 1);
context.GardenExtras.startRound();
context.GardenExtras.tick(
  { time: 0.5, roundStats: { knockouts: 1, maxScore: 32 } },
  ["eat"],
);
assert.equal(book.state.profile.totalSeconds, 0.5);
assert.equal(book.state.profile.kills, 1);
assert.equal(tones, 2);
nodes["pref-sound"].checked = false;
nodes["pref-sound"].onchange();
context.GardenExtras.tick(
  { time: 1, roundStats: { knockouts: 1, maxScore: 32 } },
  ["coin"],
);
assert.equal(tones, 2);
assert.equal(book.state.profile.kills, 1);
nodes["pref-shake"].checked = false;
nodes["pref-shake"].onchange();
assert.equal(context.GardenExtras.cameraOffset().x, 0);
console.log(
  "Controls/audio: fixed, floating, following and touch modes, cleanup, music/sound toggles and real session recording OK.",
);
