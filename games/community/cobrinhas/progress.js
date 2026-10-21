/* Small, finite goals. Rewards are explicit, deterministic and never expire. */
(function (root) {
  "use strict";
  const tasks = [
    {
      id: "first-fruits",
      title: "Um lanchinho",
      description: "Apanha 5 alimentos.",
      icon: "🍓",
      metric: "fruit",
      target: 5,
      stars: 3,
      xp: 10,
      skin: null,
    },
    {
      id: "artist",
      title: "Artista do jardim",
      description: "Guarda uma criação na oficina.",
      icon: "🎨",
      metric: "outfits",
      target: 1,
      stars: 3,
      xp: 10,
      skin: "cotton",
    },
    {
      id: "explorer",
      title: "Vamos passear",
      description: "Descobre 2 zonas do jardim.",
      icon: "🦋",
      metric: "regions",
      target: 2,
      stars: 4,
      xp: 15,
      skin: null,
    },
    {
      id: "basket",
      title: "Cestinho de frutas",
      description: "Apanha 25 alimentos, ao teu ritmo.",
      icon: "🧺",
      metric: "fruit",
      target: 25,
      stars: 5,
      xp: 20,
      skin: "bee",
    },
    {
      id: "designer",
      title: "Uma paleta de ideias",
      description: "Guarda criações com 3 padrões diferentes.",
      icon: "🌈",
      metric: "styles",
      target: 3,
      stars: 5,
      xp: 20,
      skin: null,
    },
    {
      id: "full-garden",
      title: "Conheço este jardim!",
      description: "Explora as 4 zonas.",
      icon: "🌻",
      metric: "regions",
      target: 4,
      stars: 6,
      xp: 25,
      skin: "sunshine",
    },
    {
      id: "picnic",
      title: "Piquenique colorido",
      description: "Apanha 75 alimentos no total.",
      icon: "🍉",
      metric: "fruit",
      target: 75,
      stars: 7,
      xp: 30,
      skin: null,
    },
    {
      id: "little-gardener",
      title: "Pequeno jardineiro",
      description: "Apanha 150 alimentos no total.",
      icon: "🌱",
      metric: "fruit",
      target: 150,
      stars: 10,
      xp: 40,
      skin: "ladybird",
    },
  ];
  const skins = {
    cotton: {
      name: "Algodão-doce",
      icon: "🍭",
      color: "#d9a9dc",
      secondary: "#fff0c8",
      headColor: "#d9a9dc",
      pattern: "stripes",
      hat: "bow",
      trail: "hearts",
    },
    bee: {
      name: "Abelhinha",
      icon: "🐝",
      color: "#eac564",
      secondary: "#796848",
      headColor: "#eac564",
      pattern: "stripes",
      hat: "flower",
      trail: "stars",
    },
    sunshine: {
      name: "Raio de sol",
      icon: "☀️",
      color: "#f2c86d",
      secondary: "#f6e8af",
      headColor: "#f2c86d",
      pattern: "dots",
      hat: "crown",
      trail: "stars",
    },
    ladybird: {
      name: "Joaninha",
      icon: "🐞",
      color: "#e99391",
      secondary: "#715c61",
      headColor: "#e99391",
      pattern: "dots",
      hat: "flower",
      trail: "bubbles",
    },
  };
  const shop = {
    mermaid: {
      name: "Sereia",
      icon: "🧜‍♀️",
      price: 3,
      color: "#64d7d3",
      secondary: "#c5a2ee",
      headColor: "#64d7d3",
      pattern: "stripes",
      hat: "bow",
      trail: "bubbles",
    },
    astronaut: {
      name: "Astronauta",
      icon: "🚀",
      price: 5,
      color: "#b9b4f4",
      secondary: "#f5f6ff",
      headColor: "#b9b4f4",
      pattern: "dots",
      hat: "cap",
      trail: "stars",
    },
    peach: {
      name: "Pêssego",
      icon: "🍑",
      price: 7,
      color: "#ffb68d",
      secondary: "#fff0b0",
      headColor: "#ffb68d",
      pattern: "stripes",
      hat: "flower",
      trail: "hearts",
    },
    dragon: {
      name: "Dragão doce",
      icon: "🐉",
      price: 9,
      color: "#82dbab",
      secondary: "#ffcb68",
      headColor: "#82dbab",
      pattern: "dots",
      hat: "crown",
      trail: "stars",
    },
  };
  Object.assign(shop, {
    carrot: {
      texture: "carrot",
      name: "Cenourinha",
      icon: "🍊",
      price: 100,
      color: "#ff952c",
      secondary: "#ffbd59",
      headColor: "#ff952c",
      pattern: "stripes",
      hat: "flower",
    },
    chocolate: {
      texture: "chocolate",
      name: "Chocolate",
      icon: "🍭",
      price: 200,
      color: "#955a3d",
      secondary: "#bd8559",
      headColor: "#955a3d",
      pattern: "stripes",
    },
    corn: {
      texture: "corn",
      name: "Milhinho",
      icon: "🌻",
      price: 400,
      color: "#ffcf30",
      secondary: "#fff080",
      headColor: "#ffcf30",
      pattern: "dots",
      hat: "flower",
    },
    kitten: {
      texture: "kitten",
      name: "Gatinho",
      icon: "🐉",
      price: 600,
      color: "#f2a654",
      secondary: "#ffe3b5",
      headColor: "#f2a654",
      pattern: "stripes",
      hat: "bow",
    },
    frost: {
      texture: "ice",
      name: "Cristal de gelo",
      icon: "☁️",
      price: 800,
      color: "#8fe9ff",
      secondary: "#ffffff",
      headColor: "#8fe9ff",
      pattern: "dots",
      hat: "crown",
      trail: "bubbles",
    },
    phoenix: {
      name: "Fénix",
      icon: "🌟",
      price: 1000,
      color: "#ff774c",
      secondary: "#ffe668",
      headColor: "#ff774c",
      pattern: "rainbow",
      hat: "crown",
      trail: "stars",
    },
  });
  const wheelPrizes = [600, 5000, 400, 500, 10, 200, 1000, 100];
  const upgradeKeys = ["magnet", "vision", "speed", "coins"];
  const surprises = {
    berry: {
      name: "Amora",
      icon: "🫐",
      color: "#a49aee",
      secondary: "#f7caf0",
      headColor: "#a49aee",
      pattern: "stripes",
      hat: "bow",
      trail: "hearts",
    },
    melon: {
      name: "Melancia",
      icon: "🍉",
      color: "#85d9a3",
      secondary: "#ffd1da",
      headColor: "#85d9a3",
      pattern: "dots",
      hat: "cap",
      trail: "bubbles",
    },
    cloud: {
      name: "Nuvem",
      icon: "☁️",
      color: "#b1ddf5",
      secondary: "#ffffff",
      headColor: "#b1ddf5",
      pattern: "stripes",
      hat: "flower",
      trail: "bubbles",
    },
    rainbow: {
      name: "Festa de cores",
      icon: "🌈",
      color: "#f4a9cc",
      secondary: "#fff0a5",
      headColor: "#f4a9cc",
      pattern: "rainbow",
      hat: "crown",
      trail: "stars",
    },
  };
  const countBits = (n) => {
    let total = 0;
    for (let i = 0; i < 4; i++) total += (n >> i) & 1;
    return total;
  };
  class Book {
    constructor(saved) {
      this.restore(saved);
    }
    restore(saved) {
      const s = saved && typeof saved === "object" ? saved : {};
      const number = (v) =>
        Number.isSafeInteger(v) && v >= 0 ? Math.min(v, 1000000) : 0;
      this.state = {
        coins: number(s.coins),
        wheelReady: s.wheelReady !== false,
        upgrades: Object.fromEntries(
          upgradeKeys.map((key) => [
            key,
            Math.min(10, number(s.upgrades?.[key])),
          ]),
        ),
        purchased: Array.isArray(s.purchased)
          ? [...new Set(s.purchased.filter((id) => Object.hasOwn(shop, id)))]
          : [],
        surprises: Array.isArray(s.surprises)
          ? [
              ...new Set(
                s.surprises.filter((id) => Object.hasOwn(surprises, id)),
              ),
            ]
          : [],
        fruit: number(s.fruit),
        outfits: number(s.outfits),
        rounds: number(s.rounds),
        regions: number(s.regions) & 15,
        styles: Array.isArray(s.styles)
          ? [
              ...new Set(
                s.styles.filter((v) =>
                  ["plain", "stripes", "dots", "rainbow", "flag"].includes(v),
                ),
              ),
            ]
          : [],
        claimed: Array.isArray(s.claimed)
          ? [...new Set(s.claimed.filter((v) => tasks.some((t) => t.id === v)))]
          : [],
      };
      let budget =
        this.state.coins +
        tasks
          .filter((t) => this.state.claimed.includes(t.id))
          .reduce((n, t) => n + t.stars, 0);
      this.state.purchased = this.state.purchased.filter((id) => {
        if (shop[id].price > budget) return false;
        budget -= shop[id].price;
        return true;
      });
      for (const key of upgradeKeys) {
        const level = Math.min(
          this.state.upgrades[key],
          Math.floor(budget / 150),
        );
        this.state.upgrades[key] = level;
        budget -= level * 150;
      }
    }
    value(task) {
      return task.metric === "regions"
        ? countBits(this.state.regions)
        : task.metric === "styles"
          ? this.state.styles.length
          : this.state[task.metric] || 0;
    }
    record(kind, value = 1) {
      if (kind === "rounds") this.state.wheelReady = true;
      if (kind === "fruit" || kind === "rounds" || kind === "coins")
        this.state[kind] = Math.min(
          1000000,
          this.state[kind] + Math.max(0, Math.floor(Number(value) || 0)),
        );
      if (
        kind === "region" &&
        Number.isInteger(value) &&
        value >= 0 &&
        value < 4
      )
        this.state.regions |= 1 << value;
      if (kind === "outfit") {
        this.state.outfits = Math.min(1000000, this.state.outfits + 1);
        if (
          ["plain", "stripes", "dots", "rainbow", "flag"].includes(value) &&
          !this.state.styles.includes(value)
        )
          this.state.styles.push(value);
      }
      return this.ready();
    }
    ready() {
      return tasks.filter(
        (t) => !this.state.claimed.includes(t.id) && this.value(t) >= t.target,
      );
    }
    claim(id) {
      const task = tasks.find((t) => t.id === id);
      if (
        !task ||
        this.state.claimed.includes(id) ||
        this.value(task) < task.target
      )
        return null;
      this.state.claimed.push(id);
      return task;
    }
    buy(id) {
      const item = Object.hasOwn(shop, id) && shop[id];
      if (!item || this.state.purchased.includes(id) || this.stars < item.price)
        return false;
      this.state.purchased.push(id);
      return true;
    }
    spin(random = Math.random) {
      const remaining = Object.keys(surprises).filter(
        (id) => !this.state.surprises.includes(id),
      );
      if (!remaining.length) return null;
      const n = Number(random());
      const index = Number.isFinite(n)
        ? Math.min(
            remaining.length - 1,
            Math.max(0, Math.floor(n * remaining.length)),
          )
        : 0;
      const id = remaining[index];
      this.state.surprises.push(id);
      return id;
    }
    spinCoins(random = Math.random) {
      if (!this.state.wheelReady) return null;
      const n = Number(random());
      const index = Number.isFinite(n)
        ? Math.max(0, Math.min(7, Math.floor(n * 8)))
        : 0;
      this.state.wheelReady = false;
      this.record("coins", wheelPrizes[index]);
      const skin = this.spin(() => n);
      return { index, amount: wheelPrizes[index], skin };
    }
    buyUpgrade(key) {
      if (
        !upgradeKeys.includes(key) ||
        this.state.upgrades[key] >= 10 ||
        this.coins < 150
      )
        return false;
      this.state.upgrades[key]++;
      return true;
    }
    get coins() {
      return (
        this.state.coins +
        tasks
          .filter((t) => this.state.claimed.includes(t.id))
          .reduce((n, t) => n + t.stars, 0) -
        this.state.purchased.reduce((n, id) => n + shop[id].price, 0) -
        upgradeKeys.reduce((n, key) => n + this.state.upgrades[key] * 150, 0)
      );
    }
    // Compatibility for older callers and saves; the currency is now coins.
    get stars() {
      return this.coins;
    }
    get xp() {
      return (
        this.state.fruit +
        tasks
          .filter((t) => this.state.claimed.includes(t.id))
          .reduce((n, t) => n + t.xp, 0)
      );
    }
    get level() {
      return Math.floor(this.xp / 50) + 1;
    }
    get unlocked() {
      return tasks
        .filter((t) => t.skin && this.state.claimed.includes(t.id))
        .map((t) => t.skin);
    }
    snapshot() {
      return JSON.parse(JSON.stringify(this.state));
    }
  }
  root.GardenProgress = {
    Book,
    tasks,
    skins,
    shop,
    surprises,
    wheelPrizes,
    upgradeKeys,
  };
  if (typeof module !== "undefined") module.exports = root.GardenProgress;
})(typeof window === "undefined" ? globalThis : window);
