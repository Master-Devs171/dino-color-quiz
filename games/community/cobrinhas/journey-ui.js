(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    { Book, tasks, skins, shop, surprises } = GardenProgress,
    book = new Book();
  let loaded = false,
    dirty = false,
    saveAt = 0,
    view = "tasks",
    queued = [],
    lastReady = 0,
    panelWasPlaying = false;
  let spinning = false,
    wheelRotation = 0;
  const panel = $("adventures");
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  function save() {
    dirty = true;
  }
  async function flush() {
    if (!loaded || !dirty) return;
    dirty = false;
    try {
      await GardenBridge.set("journal", book.snapshot());
    } catch {
      dirty = true;
      $("reward-status").textContent =
        "O progresso está nesta partida; não foi possível guardá-lo no dispositivo.";
    }
  }
  function progress(task) {
    return Math.min(task.target, book.value(task));
  }
  function render() {
    $("coin-score").textContent = book.coins;
    const ready = book.ready();
    $("journey-level").textContent = "🌱 Nível " + book.level;
    $("journey-stars").textContent = "🪙 " + book.coins;
    $("journey-bar").style.width = ((book.xp % 50) / 50) * 100 + "%";
    $("journey-caption").textContent =
      50 - (book.xp % 50) + " descobertas até ao próximo nível";
    $("task-ready").textContent = ready.length
      ? ready.length +
        " recompensa" +
        (ready.length > 1 ? "s" : "") +
        " pronta" +
        (ready.length > 1 ? "s" : "")
      : "Pequenas descobertas";
    $("album-count").textContent =
      book.state.claimed.length + " / " + tasks.length + " autocolantes";
    $("wallet-level").textContent = "🌱 Nível " + book.level;
    $("wallet-stars").textContent = "🪙 " + book.coins + " moedas";
    const current =
      ready[0] || tasks.find((t) => !book.state.claimed.includes(t.id));
    $("mini-task").textContent = current
      ? ready.length
        ? "🎁 Recompensa pronta"
        : current.icon +
          " " +
          progress(current) +
          " / " +
          current.target +
          " · " +
          current.title
      : "🌻 Todas as aventuras descobertas!";
    if (!panel.open) return;
    renderShop();
    renderWheel();
    $("task-list").replaceChildren();
    for (const task of tasks) {
      const claimed = book.state.claimed.includes(task.id),
        done = book.value(task) >= task.target;
      const card = el(
        "article",
        undefined,
        "task-card" + (done ? " is-complete" : ""),
      );
      card.appendChild(el("span", task.icon, "task-icon"));
      const info = el("div", undefined, "task-info");
      info.append(el("h3", task.title), el("p", task.description));
      const track = el("div", undefined, "task-track");
      const fill = el("span");
      fill.style.width = (progress(task) / task.target) * 100 + "%";
      track.appendChild(fill);
      info.append(
        track,
        el(
          "small",
          progress(task) +
            " / " +
            task.target +
            " · 🪙 " +
            task.stars +
            (task.skin ? " · 🎁 " + skins[task.skin].name : ""),
        ),
      );
      const button = el(
        "button",
        claimed ? "✓ No álbum" : done ? "Receber 🪙" : "A descobrir",
      );
      button.disabled = !loaded || claimed || !done;
      button.onclick = () => claim(task.id);
      card.append(info, button);
      $("task-list").appendChild(card);
    }
    $("sticker-list").replaceChildren();
    for (const task of tasks) {
      const claimed = book.state.claimed.includes(task.id);
      const card = el(
        "article",
        undefined,
        "sticker-card" + (claimed ? " earned" : ""),
      );
      card.append(
        el("span", claimed ? task.icon : "🌱"),
        el("b", task.title),
        el(
          "small",
          claimed ? "Uma descoberta tua!" : "Completa a aventura para colar.",
        ),
      );
      $("sticker-list").appendChild(card);
    }
    $("gift-list").replaceChildren();
    for (const [id, skin] of Object.entries(skins)) {
      const unlocked = book.unlocked.includes(id),
        task = tasks.find((t) => t.skin === id);
      const card = el("article", undefined, "gift-card");
      const art = el("span", undefined, "gift-snake");
      art.style.setProperty("--skin", skin.color);
      art.style.setProperty("--stripe", skin.secondary);
      card.append(
        el("span", skin.icon, "gift-icon"),
        art,
        el("h3", skin.name),
        el(
          "p",
          unlocked
            ? "Já é tua. Experimenta na oficina!"
            : "Recompensa de «" + task.title + "».",
        ),
      );
      const button = el(
        "button",
        unlocked ? "Vestir esta skin" : "Ver aventura",
      );
      button.onclick = () => {
        if (unlocked) {
          GardenBridge.equip(skin);
          $("reward-status").textContent =
            skin.name + " está pronta para brincar!";
        } else switchView("tasks");
      };
      card.appendChild(button);
      $("gift-list").appendChild(card);
    }
  }
  function skinCard(id, skin, owned, action, label) {
    const card = el("article", undefined, "gift-card");
    const art = el("span", undefined, "gift-snake");
    art.style.setProperty("--skin", skin.color);
    art.style.setProperty("--stripe", skin.secondary);
    card.append(el("span", skin.icon, "gift-icon"), art, el("h3", skin.name));
    const button = el("button", label);
    button.disabled = !loaded || (!owned && book.coins < skin.price);
    button.onclick = () => {
      if (owned) {
        GardenBridge.equip(skin);
        $("reward-status").textContent =
          skin.name + " está pronta para brincar!";
      } else action();
    };
    card.append(button);
    return card;
  }
  function renderShop() {
    if (window.GardenGallery) {
      GardenGallery.render(book, () => {
        save();
        render();
        flush();
      });
      return;
    }
    $("shop-list").replaceChildren();
    for (const [id, skin] of Object.entries(shop)) {
      const owned = book.state.purchased.includes(id);
      const card = skinCard(
        id,
        skin,
        owned,
        () => {
          if (!book.buy(id)) return;
          save();
          render();
          flush();
          $("reward-status").textContent =
            skin.name + " já é tua! Podes vesti-la quando quiseres.";
        },
        owned ? "Vestir · Já é tua" : "Obter por 🪙 " + skin.price,
      );
      card.append(
        el(
          "p",
          owned
            ? "Guardada na tua coleção."
            : "Custa " +
                skin.price +
                " moedas das aventuras. Sem dinheiro real.",
        ),
      );
      $("shop-list").append(card);
    }
  }
  function renderWheel() {
    $("spin-wheel").disabled = !loaded || spinning || !book.state.wheelReady;
    $("spin-wheel").textContent = spinning
      ? "A rodar…"
      : !book.state.wheelReady
        ? "Joga para rodar outra vez"
        : "RODAR!";
    $("wheel-collection").replaceChildren();
    for (const id of book.state.surprises) {
      const skin = surprises[id];
      $("wheel-collection").append(
        skinCard(id, skin, true, null, "Vestir esta skin"),
      );
    }
  }
  $("spin-wheel").onclick = () => {
    if (!loaded || spinning) return;
    const prize = book.spinCoins();
    if (!prize) return;
    spinning = true;
    save();
    flush();
    const target = (360 - prize.index * 45) % 360;
    wheelRotation = (Math.floor(wheelRotation / 360) + 5) * 360 + target;
    $("prize-wheel").style.transform = "rotate(" + wheelRotation + "deg)";
    $("wheel-status").textContent = "Uma surpresa a caminho…";
    renderWheel();
    setTimeout(
      () => {
        spinning = false;
        $("wheel-status").textContent = "🪙 +" + prize.amount + " moedas!";
        renderWheel();
      },
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 3900,
    );
  };
  function claim(id) {
    const reward = book.claim(id);
    if (!reward) return;
    save();
    $("reward-status").textContent =
      "Boa descoberta! Ganhaste " +
      reward.stars +
      " moedas e o autocolante " +
      reward.icon +
      (reward.skin ? " e a skin " + skins[reward.skin].name : "") +
      ".";
    render();
    flush();
  }
  function switchView(next) {
    view = next;
    panel.dataset.view = next;
    for (const id of ["tasks", "album", "gifts", "shop", "wheel"]) {
      $(
        id === "tasks"
          ? "task-list"
          : id === "album"
            ? "sticker-list"
            : id === "gifts"
              ? "gift-list"
              : id === "shop"
                ? "shop-list"
                : "wheel-panel",
      ).hidden = id !== view;
      $("show-" + id).setAttribute("aria-pressed", String(id === view));
    }
    $("adventures-title").textContent =
      view === "tasks"
        ? "Pequenas aventuras 🌼"
        : view === "album"
          ? "O meu álbum de descobertas 📒"
          : view === "gifts"
            ? "Surpresas do jardim 🎁"
            : view === "shop"
              ? "Laboratório"
              : "Roda da Sorte 🎡";
    render();
  }
  function open(next) {
    panelWasPlaying = GardenBridge.pauseForPanel();
    panel.showModal();
    switchView(next);
  }
  function close() {
    panel.close();
    GardenBridge.closePanel(panelWasPlaying);
    panelWasPlaying = false;
    flush();
  }
  $("open-adventures").onclick = () => open("tasks");
  $("open-album").onclick = () => open("album");
  $("open-shop").onclick = () => open("shop");
  $("open-wheel").onclick = () => open("wheel");
  $("adventures-close").onclick = close;
  panel.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  for (const id of ["tasks", "album", "gifts", "shop", "wheel"])
    $("show-" + id).onclick = () => switchView(id);
  window.GardenJournal = {
    session(value) {
      if (!loaded) {
        queued.push(["session", value]);
        return;
      }
      book.record("session", value);
      save();
    },
    get book() {
      return book;
    },
    commit() {
      save();
      render();
      flush();
      GardenBridge.applyUpgrades?.(book.state.upgrades);
    },
    record(kind, value) {
      if (!loaded) {
        queued.push([kind, value]);
        return;
      }
      const before = JSON.stringify(book.state);
      book.record(kind, value);
      if (before === JSON.stringify(book.state)) return;
      save();
      render();
    },
    refresh: render,
  };
  (async () => {
    try {
      await GardenBridge.ready;
      const saved = await GardenBridge.get("journal");
      book.restore(saved);
    } catch {
      $("reward-status").textContent =
        "Podes brincar. O progresso desta partida pode não ficar guardado.";
    }
    loaded = true;
    GardenBridge.applyUpgrades?.(book.state.upgrades);
    for (const [k, v] of queued) book.record(k, v);
    if (queued.length) save();
    queued = [];
    render();
  })();
  // Persist at a modest rate; only game progress is stored, never personal data.
  let lastTick = 0;
  function tick(now) {
    requestAnimationFrame(tick);
    if (document.hidden) return;
    if (now - lastTick > 1500) {
      lastTick = now;
      flush();
    }
  }
  requestAnimationFrame(tick);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) flush();
  });
})();
