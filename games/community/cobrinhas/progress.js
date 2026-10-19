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
    }
    value(task) {
      return task.metric === "regions"
        ? countBits(this.state.regions)
        : task.metric === "styles"
          ? this.state.styles.length
          : this.state[task.metric] || 0;
    }
    record(kind, value = 1) {
      if (kind === "fruit" || kind === "rounds")
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
    get stars() {
      return tasks
        .filter((t) => this.state.claimed.includes(t.id))
        .reduce((n, t) => n + t.stars, 0);
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
  root.GardenProgress = { Book, tasks, skins };
  if (typeof module !== "undefined") module.exports = root.GardenProgress;
})(typeof window === "undefined" ? globalThis : window);
