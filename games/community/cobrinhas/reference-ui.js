(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    make = (tag, text, cls) => {
      const e = document.createElement(tag);
      if (text !== undefined) e.textContent = text;
      if (cls) e.className = cls;
      return e;
    };
  const { shop, skins, surprises, tasks, wheelPrizes } = GardenProgress;
  function emoji(text, cls = "lab-emoji") {
    const span = make("img", undefined, cls);
    const names = {"🧩":"puzzle","💎":"diamond","🌊":"wave","🍬":"candy","🥕":"leaf","🍫":"candy","🌽":"sun","🐱":"face","❄️":"diamond","🔥":"rocket","🐍":"face"};
    span.src = "icons/" + (names[text] || GardenIcons.map[text] || "star") + ".svg";
    span.alt = "";
    span.draggable = false;
    span.setAttribute("aria-hidden", "true");
    return span;
  }
  let category = "all",
    commitGallery = () => {};
  const basic = [
    ["leaf", "Verdinha", "#78c85d", "plain"],
    ["sweet", "Docinho", "#ef8db4", "stripes"],
    ["ocean", "Oceano", "#58cddd", "dots"],
    ["party", "Arco-íris", "#b591ee", "rainbow"],
  ].map(([id, name, color, pattern]) => ({
    id,
    name,
    color,
    headColor: color,
    secondary: "#fff1b6",
    pattern,
    source: "basic",
    rarity: "common",
  }));
  function catalog(book) {
    return [
      ...basic,
      ...Object.entries(shop).map(([id, s], i) => ({
        ...s,
        id,
        source: "shop",
        rarity: i < 4 ? "rare" : i < 7 ? "epic" : "legendary",
      })),
      ...Object.entries(skins).map(([id, s]) => ({
        ...s,
        id,
        source: "reward",
        rarity: "rare",
      })),
      ...Object.entries(surprises).map(([id, s]) => ({
        ...s,
        id,
        source: "surprise",
        rarity: "common",
      })),
    ].map((s) => ({
      ...s,
      owned:
        s.source === "basic" ||
        (s.source === "shop"
          ? book.state.purchased.includes(s.id)
          : s.source === "reward"
            ? book.unlocked.includes(s.id)
            : book.state.surprises.includes(s.id)),
    }));
  }
  function preview(canvas, style, vertical = true) {
    const c = canvas.getContext("2d");
    c.clearRect(0, 0, canvas.width, canvas.height);
    if (canvas.id === "result-snake") {
      c.fillStyle = "#ab75e5";
      c.beginPath();
      c.roundRect(45, 300, 150, 28, 9);
      c.fill();
      const glow = c.createLinearGradient(45, 0, 195, 0);
      glow.addColorStop(0, "#d69eff");
      glow.addColorStop(0.5, "#9cf4ff");
      glow.addColorStop(1, "#c597ff");
      c.fillStyle = glow;
      c.beginPath();
      c.ellipse(120, 300, 75, 16, 0, 0, Math.PI * 2);
      c.fill();
    }
    const body = Array.from({ length: 29 }, (_, i) => ({
      x: canvas.width / 2 + Math.sin(i * 0.13) * 8,
      y: canvas.height - 65 - i * 7,
    }));
    SnakeStyle.draw(
      c,
      {
        id: 0,
        score: canvas.id === "result-snake" ? 250 : undefined,
        angle: Math.PI / 2,
        body,
      },
      style,
      0,
      true,
    );
  }
  function gallery(book, commit) {
    commitGallery = commit;
    const list = $("shop-list");
    list.replaceChildren();
    const all = catalog(book),
      nav = make("nav", undefined, "rarity-tabs");
    nav.setAttribute("aria-label", "Categorias de skins");
    const labels = {
      all: "Todas",
      common: "Comuns",
      rare: "Raras",
      epic: "Épicas",
      legendary: "Lendárias",
    };
    for (const [id, label] of Object.entries(labels)) {
      const items = all.filter((s) => id === "all" || s.rarity === id),
        b = make("button", undefined, "rarity-" + id);
      b.append(
        emoji(
          { all: "🧩", common: "🍀", rare: "💎", epic: "✨", legendary: "👑" }[
            id
          ],
        ),
        make("b", label),
        make(
          "small",
          items.filter((s) => s.owned).length + " / " + items.length,
        ),
      );
      b.setAttribute("aria-pressed", String(category === id));
      b.onclick = () => {
        category = id;
        gallery(book, commit);
      };
      nav.append(b);
    }
    const area = make("div", undefined, "skin-catalog"),
      toolbar = make("div", undefined, "catalog-toolbar");
    const create = make("button", "🎨 Criar a minha cobra");
    create.onclick = () => {
      $("adventures-close").click();
      $("customize").click();
    };
    toolbar.append(make("h3", "Laboratório"), create);
    list.append(nav, toolbar, area);
    for (const skin of all.filter(
      (s) => category === "all" || s.rarity === category,
    )) {
      const card = make(
          "article",
          undefined,
          "catalog-card rarity-" + skin.rarity,
        ),
        art = make("canvas");
      art.width = 190;
      art.height = 310;
      art.setAttribute("aria-label", skin.name);
      preview(art, skin);
      card.append(
        emoji(
          {
            leaf: "🌱",
            sweet: "🍬",
            ocean: "🌊",
            party: "🌈",
            carrot: "🥕",
            chocolate: "🍫",
            corn: "🌽",
            kitten: "🐱",
            frost: "❄️",
            phoenix: "🔥",
          }[skin.id] ||
            skin.icon ||
            "🐍",
          "skin-emoji",
        ),
        make("small", labels[skin.rarity], "rarity-badge"),
        art,
        make("h3", skin.name),
      );
      const button = make(
        "button",
        skin.owned
          ? "USAR"
          : skin.source === "shop"
            ? "🪙 " + skin.price + " · Desbloquear"
            : "Ver aventura",
      );
      button.disabled =
        skin.source === "shop" && !skin.owned && book.coins < skin.price;
      button.onclick = () => {
        if (skin.owned) {
          GardenBridge.equip(skin);
          $("reward-status").textContent =
            skin.name + " está pronta para brincar!";
        } else if (skin.source === "shop") {
          if (book.buy(skin.id)) {
            commit();
            gallery(book, commit);
          }
        } else
          $("show-" + (skin.source === "reward" ? "tasks" : "wheel")).click();
      };
      card.append(button);
      area.append(card);
    }
  }
  window.GardenGallery = { render: gallery };
  const wheel = $("prize-wheel");
  const stage = $("wheel-panel").querySelector(".wheel-stage");
  for (let i = 0; i < 16; i++) {
    const light = make("i", undefined, "rim-light");
    light.setAttribute("aria-hidden", "true");
    light.style.setProperty("--light", i);
    stage.append(light);
  }
  wheel.replaceChildren();
  wheelPrizes.forEach((amount, i) => {
    const wedge = make("span");
    wedge.style.setProperty("--slice", i);
    wedge.append(make("b", String(amount)), make("span", "🪙"));
    wheel.append(wedge);
  });
  $("wheel-panel").querySelector(".wheel-copy p").textContent =
    "Uma oferta por partida. Todos os prémios têm a mesma possibilidade de sair.";
  $("wheel-panel").querySelector(".wheel-action > p").textContent =
    "Grátis. Sem anúncios. Sem gastar moedas.";
  $("open-wheel").querySelector("small").textContent = "Prémios em moedas";
  const result = $("results");
  function upgrades() {
    const book = GardenJournal.book;
    $("result-wallet").textContent = "🪙 " + book.coins;
    $("result-upgrades").replaceChildren();
    const labels = {
        magnet: "Íman",
        vision: "Binóculos",
        speed: "Sapatos",
        coins: "Moedas",
      },
      icons = { magnet: "🧲", vision: "🔭", speed: "👟", coins: "🪙" };
    for (const key of Object.keys(labels)) {
      const row = make("div", undefined, "upgrade-row"),
        level = book.state.upgrades[key],
        icon = make("span", icons[key], "upgrade-icon");
      icon.setAttribute("title", labels[key]);
      const info = make("div");
      info.append(make("b", labels[key]), make("small", level + " / 10"));
      const track = make("div", undefined, "upgrade-track");
      for (let i = 0; i < 10; i++)
        track.append(make("i", undefined, i < level ? "filled" : ""));
      info.append(track);
      const buy = make("button", level === 10 ? "✓" : "🪙 150");
      buy.disabled = level === 10 || book.coins < 150;
      buy.onclick = () => {
        if (book.buyUpgrade(key)) {
          GardenJournal.commit();
          upgrades();
          $("result-status").textContent = "Melhoria guardada!";
        }
      };
      row.append(icon, info, buy);
      $("result-upgrades").append(row);
    }
  }
  window.GardenResults = {
    show(stats) {
      $("result-rank").textContent = stats.rank;
      $("result-max").textContent = stats.maxScore;
      $("result-knockouts").textContent = stats.knockouts;
      $("result-duration").textContent =
        String(Math.floor(stats.seconds / 60)).padStart(2, "0") +
        ":" +
        String(Math.floor(stats.seconds % 60)).padStart(2, "0");
      $("result-coins").textContent = stats.coins;
      $("result-status").textContent = "";
      upgrades();
      preview($("result-snake"), GardenBridge.getAppearance());
      result.showModal();
    },
  };
  function home() {
    result.close();
    GardenBridge.home();
  }
  $("result-home").onclick = home;
  $("result-again").onclick = () => {
    result.close();
    $("play").click();
  };
  result.addEventListener("cancel", (e) => {
    e.preventDefault();
    home();
  });
})();
