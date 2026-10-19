(() => {
  const gameCache = "dinoplay-games-v1";
  let catalog = {
    puzzle: {
      name: "Puzzles de Aventuras",
      icon: "🧩",
      category: "learn",
      cover: "assets/dinoplay-puzzles.png",
      age: "5+",
      size: "12 MB",
      version: "1.0",
      tone: "sky",
      description: "Monta 50 imagens coloridas e treina a atenção.",
      assets: [
        "./assets/dino-puzzles.jpg",
        "./assets/dino-puzzles-2.jpg",
        "./assets/puzzle-adventures.png",
        "./assets/puzzle-wonders.png",
        "./assets/puzzle-discoveries.png",
      ],
    },
    blocks: {
      name: "Mundo dos Blocos",
      icon: "🧱",
      category: "create",
      cover: "assets/dinoplay-blocks.png",
      age: "6+",
      size: "18 MB",
      version: "1.3",
      tone: "blocks",
      description: "Constrói, escava e transforma um enorme mundo 3D.",
      assets: [
        "./world.css?v=31",
        "./assets/three.module.js",
        "./assets/three.core.js",
        "./multiplayer-core.js?v=3",
        "./multiplayer.js?v=7",
      ],
    },
    race: {
      name: "Cidade das Aventuras",
      icon: "🏙️",
      category: "explore",
      cover: "assets/dinoplay-city.png",
      age: "5+",
      size: "9 MB",
      version: "1.0",
      tone: "city",
      description: "Explora a cidade, ganha moedas e compra veículos.",
      assets: [
        "./racer.css?v=3",
        "./racer.js?v=15",
        "./assets/three.module.js",
        "./assets/three.core.js",
      ],
    },
  };
  const categories = {
    all: { icon: "🎮", label: "Todos" },
    learn: { icon: "🧠", label: "Aprender" },
    create: { icon: "🎨", label: "Criar" },
    explore: { icon: "🗺️", label: "Explorar" },
  };
  const categoryStyle = {
    learn: { icon: "🧩", tone: "sky" },
    create: { icon: "🧱", tone: "blocks" },
    explore: { icon: "🏙️", tone: "city" },
  };
  let platform;
  try {
    platform = JSON.parse(localStorage.getItem("dinoPlayPlatformV1") || "{}");
  } catch (e) {
    platform = {};
  }
  platform.installed = Array.isArray(platform.installed)
    ? platform.installed
    : [];
  platform.versions = platform.versions || {};
  platform.onlineMultiplayerEnabled =
    window.DinoPlayMultiplayer?.onlineEnabled() === true;
  const host = document.querySelector("#menuScreen"),
    brand = document.querySelector(".brand"),
    footer = document.querySelector("#bestLabel"),
    originalOpen = window.openGame;
  if (!host || !originalOpen) return;
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "platform.css?v=7";
  document.head.appendChild(css);
  brand.innerHTML = "<span>🦖</span> DinoPlay";
  footer.textContent =
    "🔒 Sem anúncios · Sem chat · Progresso guardado neste dispositivo";
  document.title = "DinoPlay";
  document.querySelector("#updateStatus").textContent = "DinoPlay v4.0";
  host.classList.add("platform-home");
  host.innerHTML = `<div class="dp-head"><div><small>OLÁ, EXPLORADOR!</small><h1>Dino<span>Play</span></h1><p>A tua biblioteca de aventuras</p></div><img class="dp-mascot" src="assets/dinoplay-mascot.png" alt="Dinossauro DinoPlay"></div><div id="dpView"></div><span id="puzzleMenuProgress" hidden></span><span id="blockMenuProgress" hidden></span><nav class="dp-nav"><button data-tab="home" class="active">🏠<small>Início</small></button><button data-tab="library">🎮<small>Biblioteca</small></button><button data-tab="parents">👨‍👩‍👧<small>Pais</small></button></nav>`;
  let tab = "home",
    category = "all",
    busy = null,
    parentOpen = false,
    removeConfirm = null,
    pendingInstall = null,
    friendSyncTimer = null,
    friendSyncBusy = false;
  const installed = (id) => platform.installed.includes(id),
    savePlatform = () => {
      let latest = {};
      try {
        latest = JSON.parse(localStorage.getItem("dinoPlayPlatformV1") || "{}");
      } catch {}
      localStorage.setItem(
        "dinoPlayPlatformV1",
        JSON.stringify({ ...latest, ...platform }),
      );
    };
  const friendIds = () => window.DinoPlayMultiplayer?.friends() || [];
  const childNickname = () => window.DinoPlayMultiplayer?.childNickname() || "";
  const safeText = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  const safeLocalPath = (value) =>
    typeof value === "string" &&
    value.length < 180 &&
    !/^(?:[a-z]+:|\/\/|\/)/i.test(value) &&
    !value.split(/[\\/]/).includes("..");
  const assetPath = (value) => (value.startsWith("./") ? value : `./${value}`);
  function normalizeGame(game) {
    if (
      !game ||
      !/^[-a-z0-9]{3,32}$/.test(game.id) ||
      !safeLocalPath(game.cover) ||
      !Array.isArray(game.assets) ||
      !game.assets.every(safeLocalPath) ||
      !["native", "sandbox"].includes(game.runtime) ||
      !categories[game.category]
    )
      throw new Error("invalid-game");
    if (game.runtime === "sandbox" && !safeLocalPath(game.entry))
      throw new Error("invalid-entry");
    const style = categoryStyle[game.category];
    return {
      ...game,
      icon: game.icon || style.icon,
      tone: game.tone || style.tone,
      cover: assetPath(game.cover),
      assets: game.assets.map(assetPath),
    };
  }
  async function loadCatalog() {
    const response = await fetch("./games/catalog.json?v=2", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("catalog");
    const data = await response.json();
    if (data.catalogVersion !== 1 || !Array.isArray(data.games))
      throw new Error("catalog-version");
    const next = {};
    data.games.forEach((item) => {
      const game = normalizeGame(item);
      if (next[game.id]) throw new Error("duplicate-game");
      next[game.id] = game;
    });
    if (!Object.keys(next).length) throw new Error("empty-catalog");
    catalog = next;
    platform.installed = platform.installed.filter((id) => catalog[id]);
    savePlatform();
  }
  function friendRows() {
    const ids = friendIds(),
      profiles = window.DinoPlayMultiplayer?.friendProfiles() || {};
    return ids.length
      ? ids
          .map(
            (id, i) =>
              `<div><span>🧒</span><p><b>${safeText(profiles[id] || `Amigo autorizado ${i + 1}`)}</b><small>Autorizado pelos responsáveis · ${id.slice(-4)}</small></p><button class="remove" data-friend-remove="${id}">REMOVER</button></div>`,
          )
          .join("")
      : '<div class="dp-no-friends">Ainda não existem amigos autorizados.</div>';
  }
  function stopFriendSync() {
    clearInterval(friendSyncTimer);
    friendSyncTimer = null;
  }
  function friendSnapshot() {
    return JSON.stringify({
      ids: friendIds(),
      profiles: window.DinoPlayMultiplayer?.friendProfiles() || {},
      nickname: childNickname(),
    });
  }
  async function syncParentFriends() {
    if (friendSyncBusy || !parentOpen || tab !== "parents") return;
    friendSyncBusy = true;
    const before = friendSnapshot();
    try {
      await window.DinoPlayMultiplayer?.syncFriends();
      if (parentOpen && tab === "parents" && friendSnapshot() !== before)
        render();
    } catch {
    } finally {
      friendSyncBusy = false;
    }
  }
  function startFriendSync() {
    if (friendSyncTimer) return;
    syncParentFriends();
    friendSyncTimer = setInterval(syncParentFriends, 3000);
  }
  function card(id, mode) {
    const g = catalog[id],
      has = installed(id),
      installing = busy === id;
    return `<article class="dp-game ${safeText(g.tone)}"><div class="dp-cover"><img src="${safeText(g.cover)}" alt=""><b>${safeText(g.name)}</b></div><div class="dp-game-info"><div><i>${safeText(g.age)}</i><i>⬇ ${safeText(g.size)}</i><i>✓ Offline</i></div><p>${safeText(g.description)}</p><button data-${has ? "play" : "install"}="${safeText(id)}" ${installing ? "disabled" : ""}>${installing ? "A INSTALAR…" : has ? "JOGAR" : "INSTALAR"}</button><div class="dp-install-bar ${installing ? "" : "hidden"}"><span id="install-${safeText(id)}"></span></div></div></article>`;
  }
  function categoryButtons() {
    return Object.entries(categories)
      .map(
        ([id, item]) =>
          `<button type="button" data-category="${id}" class="${category === id ? "active" : ""}" aria-pressed="${category === id}">${item.icon} ${item.label}</button>`,
      )
      .join("");
  }
  function categoryGames() {
    return Object.keys(catalog).filter(
      (id) => category === "all" || catalog[id].category === category,
    );
  }
  function render() {
    document.body.classList.add("dp-shell");
    if (tab !== "parents" || !parentOpen) stopFriendSync();
    document
      .querySelectorAll(".dp-nav button")
      .forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    const view = document.querySelector("#dpView");
    if (tab === "home") {
      const ids = Object.keys(catalog).filter(installed);
      view.innerHTML = `<section class="dp-section"><div class="dp-title"><div><small>AS TUAS AVENTURAS</small><h2>Meus Jogos</h2></div><button data-go="library">+ Jogos</button></div>${ids.length ? `<div class="dp-grid">${ids.map((id) => card(id, "home")).join("")}</div>` : `<div class="dp-empty"><img src="assets/dinoplay-mascot.png" alt=""><h2>Ainda não instalaste nenhum jogo</h2><p>Escolhe aventuras seguras na nossa biblioteca.</p><button data-go="library">Explorar biblioteca</button></div>`}</section><section class="dp-section dp-home-library"><div class="dp-title"><div><small>NOVAS AVENTURAS</small><h2>Biblioteca</h2></div><button data-go="library">Ver todos ›</button></div><div class="dp-grid">${Object.keys(
        catalog,
      )
        .map((id) => card(id, "home-library"))
        .join(
          "",
        )}</div></section><div class="dp-safe"><span>🛡️</span><div><b>Diversão segura</b><small>Sem anúncios, sem chat e sem compras reais.</small></div></div>`;
    } else if (tab === "library") {
      const ids = categoryGames(),
        label = categories[category].label;
      view.innerHTML = `<section class="dp-section"><div class="dp-title"><div><small>ESCOLHIDOS PARA CRIANÇAS</small><h2>Biblioteca</h2></div><span>${platform.installed.length}/${Object.keys(catalog).length} instalados</span></div><div class="dp-chips" role="group" aria-label="Categorias de jogos">${categoryButtons()}</div><div class="dp-category-title"><b>${categories[category].icon} ${label}</b><small>${ids.length} ${ids.length === 1 ? "jogo" : "jogos"}</small></div><div class="dp-grid">${ids.map((id) => card(id, "library")).join("")}</div></section>`;
    } else if (!parentOpen)
      view.innerHTML = `<section class="dp-parent-lock"><span>🔒</span><h2>Área dos Pais</h2><p>${pendingInstall ? `Confirma que és adulto para instalar <b>${catalog[pendingInstall].name}</b>.` : "Esta área permite instalar e remover jogos. Resolve a conta para continuar."}</p><label>Quanto é <b>9 + 7</b>?</label><input id="parentAnswer" type="number" inputmode="numeric" placeholder="Resposta"><button id="parentUnlock">ENTRAR</button><small id="parentError"></small></section>`;
    else
      view.innerHTML = `<section class="dp-section"><div class="dp-title"><div><small>GESTÃO SEGURA</small><h2>Área dos Pais</h2></div><button id="parentLock">Bloquear</button></div><div class="dp-parent-setting"><span>🌍</span><div><b>Multiplayer pela Internet</b><small>Permite jogar apenas com amigos aprovados pelos dois responsáveis.</small><em>${platform.onlineMultiplayerEnabled ? "Autorizado pelo responsável" : "Bloqueado por predefinição"}</em></div><button type="button" data-online-toggle class="${platform.onlineMultiplayerEnabled ? "on" : "off"}" aria-pressed="${platform.onlineMultiplayerEnabled}">${platform.onlineMultiplayerEnabled ? "ATIVO" : "BLOQUEADO"}</button></div>${platform.onlineMultiplayerEnabled ? `<div class="dp-child-profile"><span>🧒</span><div><b>Perfil da criança</b><small>Usa apenas o primeiro nome ou um apelido. Será visível somente aos amigos autorizados.</small></div><input id="childNicknameInput" maxlength="16" value="${childNickname().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")}" placeholder="Nome ou apelido"><button id="childNicknameSave">GUARDAR</button></div><div class="dp-friends"><div class="dp-friends-head"><div><b>Amigos autorizados</b><small>Os códigos só funcionam aqui, uma vez e durante 2 minutos.</small></div><button id="friendCodeCreate">＋ GERAR CÓDIGO</button></div><div id="friendCodeResult" class="hidden"></div><div class="dp-friend-accept"><input id="friendCodeInput" maxlength="11" autocapitalize="none" autocomplete="off" spellcheck="false" placeholder="Código do outro responsável"><button id="friendCodeAccept">ACEITAR AMIZADE</button></div><small id="friendMessage"></small><div class="dp-manage dp-friend-list">${friendRows()}</div></div>` : ""}<div class="dp-parent-note">💾 Remover um jogo liberta os ficheiros offline, mas mantém todo o progresso para uma futura reinstalação.</div><div class="dp-manage">${Object.keys(
        catalog,
      )
        .map((id) => {
          const g = catalog[id],
            has = installed(id);
          return `<div><span>${g.icon}</span><p><b>${g.name}</b><small>${g.age} · ${g.size} · v${g.version}</small></p>${has ? `<button class="remove ${removeConfirm === id ? "confirm" : ""}" data-remove="${id}">${removeConfirm === id ? "CONFIRMAR" : "REMOVER"}</button>` : "<em>Não instalado</em>"}</div>`;
        })
        .join(
          "",
        )}</div><div class="dp-privacy"><b>Proteção infantil</b><p>Os jogos não têm anúncios, chat, compras reais nem recolha de dados pessoais da criança.</p></div></section>`;
    bind();
    startFriendSync();
  }
  function bind() {
    document.querySelectorAll("[data-go]").forEach(
      (b) =>
        (b.onclick = () => {
          tab = b.dataset.go;
          render();
        }),
    );
    document.querySelectorAll("[data-category]").forEach(
      (b) =>
        (b.onclick = () => {
          category = b.dataset.category;
          render();
        }),
    );
    document
      .querySelectorAll("[data-play]")
      .forEach((b) => (b.onclick = () => window.openGame(b.dataset.play)));
    document
      .querySelectorAll("[data-install]")
      .forEach((b) => (b.onclick = () => requestInstall(b.dataset.install)));
    document.querySelector("#parentUnlock")?.addEventListener("click", () => {
      if (document.querySelector("#parentAnswer").value === "16") {
        parentOpen = true;
        if (pendingInstall) {
          const id = pendingInstall;
          pendingInstall = null;
          tab = "library";
          render();
          installGame(id);
        } else {
          render();
          window.DinoPlayMultiplayer?.syncFriends()
            .then(() => parentOpen && render())
            .catch(() => {});
        }
      } else
        document.querySelector("#parentError").textContent =
          "Resposta incorreta. Tenta novamente.";
    });
    document.querySelector("#parentLock")?.addEventListener("click", () => {
      parentOpen = false;
      pendingInstall = null;
      render();
    });
    document
      .querySelector("[data-online-toggle]")
      ?.addEventListener("click", () => {
        platform.onlineMultiplayerEnabled =
          window.DinoPlayMultiplayer?.setOnlineEnabled(
            !platform.onlineMultiplayerEnabled,
          ) ?? !platform.onlineMultiplayerEnabled;
        savePlatform();
        render();
        toast(
          platform.onlineMultiplayerEnabled
            ? "🌍 Multiplayer autorizado · cria o perfil da criança"
            : "🔒 Multiplayer pela Internet bloqueado",
        );
      });
    document
      .querySelector("#childNicknameSave")
      ?.addEventListener("click", async () => {
        const input = document.querySelector("#childNicknameInput"),
          button = document.querySelector("#childNicknameSave"),
          nickname = input.value.trim().replace(/\s+/g, " ");
        if (nickname.length < 2) {
          toast("O nome ou apelido precisa de pelo menos 2 caracteres.", "bad");
          return;
        }
        button.disabled = true;
        try {
          await window.DinoPlayMultiplayer.setChildNickname(nickname);
          await window.DinoPlayMultiplayer.syncFriends();
          render();
          toast("✅ Perfil da criança guardado");
        } catch {
          button.disabled = false;
          toast("Não foi possível guardar o perfil.", "bad");
        }
      });
    document
      .querySelector("#friendCodeCreate")
      ?.addEventListener("click", async () => {
        const box = document.querySelector("#friendCodeResult"),
          message = document.querySelector("#friendMessage");
        if (!childNickname()) {
          message.textContent = "Primeiro guarda o nome ou apelido da criança.";
          return;
        }
        message.textContent = "A gerar código seguro…";
        try {
          const data = await window.DinoPlayMultiplayer.createFriendCode();
          box.classList.remove("hidden");
          box.textContent = data.code;
          message.textContent =
            "Envia este código ao outro responsável. Expira em 2 minutos e só funciona uma vez.";
        } catch (e) {
          message.textContent =
            e.code === "profile-required"
              ? "Primeiro guarda o perfil da criança."
              : "Não foi possível gerar o código. Verifica a Internet.";
        }
      });
    document
      .querySelector("#friendCodeInput")
      ?.addEventListener(
        "input",
        (e) =>
          (e.target.value = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")),
      );
    document
      .querySelector("#friendCodeAccept")
      ?.addEventListener("click", async () => {
        const input = document.querySelector("#friendCodeInput"),
          message = document.querySelector("#friendMessage"),
          button = document.querySelector("#friendCodeAccept"),
          code = input.value.trim().toLowerCase();
        if (!childNickname()) {
          message.textContent = "Primeiro guarda o nome ou apelido da criança.";
          return;
        }
        if (!/^[a-z0-9]{11}$/.test(code)) {
          message.textContent = "Introduz o código completo de 11 caracteres.";
          return;
        }
        button.disabled = true;
        message.textContent = "A confirmar autorização dos dois responsáveis…";
        try {
          await window.DinoPlayMultiplayer.acceptFriendCode(code);
          render();
          toast("✅ Amizade autorizada pelos dois responsáveis");
        } catch (e) {
          const errors = {
            expired: "Este código expirou. Gera um novo no outro telefone.",
            "invalid-code": "Código não encontrado. Confirma os 11 caracteres.",
            "same-device":
              "Este código foi criado neste mesmo telefone. Usa o código no telefone da outra criança.",
            "profile-required": "Primeiro guarda o perfil da criança.",
            "friend-profile-required":
              "O outro responsável precisa guardar o perfil da criança.",
            unauthorized:
              "A identificação deste telefone deixou de ser válida. Atualiza e tenta novamente.",
            "register-failed":
              "Não foi possível identificar este telefone. Verifica a Internet.",
          };
          message.textContent =
            errors[e.code] ||
            `Não foi possível aceitar (${e.code || "erro de ligação"}).`;
          button.disabled = false;
        }
      });
    document.querySelectorAll("[data-friend-remove]").forEach(
      (b) =>
        (b.onclick = async () => {
          b.disabled = true;
          try {
            await window.DinoPlayMultiplayer.removeFriend(
              b.dataset.friendRemove,
            );
            render();
            toast("Amizade e autorização removidas");
          } catch {
            b.disabled = false;
            toast("Não foi possível remover agora.", "bad");
          }
        }),
    );
    document.querySelectorAll("[data-remove]").forEach(
      (b) =>
        (b.onclick = () => {
          const id = b.dataset.remove;
          if (removeConfirm !== id) {
            removeConfirm = id;
            render();
          } else removeGame(id);
        }),
    );
  }
  function requestInstall(id) {
    if (parentOpen) return installGame(id);
    pendingInstall = id;
    tab = "parents";
    render();
  }
  async function installGame(id) {
    if (busy || installed(id) || !catalog[id]) return;
    busy = id;
    render();
    try {
      const cache = await caches.open(gameCache),
        assets = gameAssets(catalog[id]);
      for (let i = 0; i < assets.length; i++) {
        const response = await fetch(assets[i], { cache: "reload" });
        if (!response.ok) throw new Error("download");
        await cache.put(assets[i], response);
        const bar = document.querySelector(`#install-${id}`);
        if (bar) bar.style.width = `${((i + 1) / assets.length) * 100}%`;
      }
      platform.installed.push(id);
      platform.versions[id] = catalog[id].version;
      savePlatform();
      busy = null;
      render();
      window.celebrate?.();
      toast(`${catalog[id].icon} ${catalog[id].name} instalado!`);
    } catch (e) {
      busy = null;
      render();
      toast("Não foi possível instalar. Verifica a ligação à internet.", "bad");
    }
  }
  async function removeGame(id) {
    const game = catalog[id];
    platform.installed = platform.installed.filter((x) => x !== id);
    delete platform.versions[id];
    savePlatform();
    removeConfirm = null;
    try {
      const cache = await caches.open(gameCache),
        needed = new Set(
          platform.installed.flatMap((x) =>
            catalog[x] ? gameAssets(catalog[x]) : [],
          ),
        );
      await Promise.all(
        gameAssets(game)
          .filter((a) => !needed.has(a))
          .map((a) => cache.delete(a)),
      );
    } catch (e) {}
    render();
    toast(`${game.name} removido. O progresso foi mantido.`);
  }
  function gameAssets(game) {
    return [
      ...new Set([
        ...(game.runtime === "sandbox"
          ? [assetPath(game.entry), "./sdk/dinoplay-game-sdk.js?v=1"]
          : []),
        ...game.assets,
      ]),
    ];
  }
  function launchCommunityGame(id) {
    const game = catalog[id];
    if (!game || game.runtime !== "sandbox" || !safeLocalPath(game.entry))
      return;
    const overlay = document.createElement("section");
    overlay.className = "dp-runtime";
    overlay.innerHTML = `<header><b>${safeText(game.name)}</b><button type="button" aria-label="Fechar jogo">✕</button></header><iframe title="${safeText(game.name)}" sandbox="allow-scripts allow-pointer-lock" allow="fullscreen" src="${safeText(assetPath(game.entry))}"></iframe>`;
    document.body.appendChild(overlay);
    document.body.classList.remove("dp-shell");
    const frame = overlay.querySelector("iframe"),
      storageName = `dinoPlayCommunity:${id}`;
    const close = () => {
      window.removeEventListener("message", receive);
      overlay.remove();
      document.body.classList.add("dp-shell");
      render();
    };
    const reply = (request, ok, value, error) =>
      frame.contentWindow?.postMessage(
        { source: "dinoplay-host", id: request.id, ok, value, error },
        "*",
      );
    const readStore = () => {
      try {
        return JSON.parse(localStorage.getItem(storageName) || "{}") || {};
      } catch {
        return {};
      }
    };
    const receive = (event) => {
      const request = event.data;
      if (
        event.source !== frame.contentWindow ||
        !request ||
        request.source !== "dinoplay-game" ||
        request.version !== 1
      )
        return;
      const key = request.payload?.key;
      try {
        if (request.action === "ready")
          return reply(request, true, {
            gameId: id,
            language: document.documentElement.lang || "pt-PT",
            capabilities: {
              storage: true,
              multiplayer:
                game.multiplayer === true &&
                (game.permissions || []).includes("multiplayer") &&
                platform.onlineMultiplayerEnabled,
            },
          });
        if (request.action === "close") {
          reply(request, true, true);
          return close();
        }
        if (request.action.startsWith("storage:")) {
          if (!/^[a-zA-Z0-9._-]{1,64}$/.test(key || ""))
            throw new Error("invalid-storage-key");
          const data = readStore();
          if (request.action === "storage:get")
            return reply(request, true, data[key] ?? null);
          if (request.action === "storage:remove") delete data[key];
          else if (request.action === "storage:set")
            data[key] = request.payload.value;
          else throw new Error("unknown-action");
          const encoded = JSON.stringify(data);
          if (new Blob([encoded]).size > 262144)
            throw new Error("storage-limit");
          localStorage.setItem(storageName, encoded);
          return reply(request, true, true);
        }
        if (request.action === "multiplayer:status")
          return reply(request, true, {
            enabled:
              game.multiplayer === true &&
              (game.permissions || []).includes("multiplayer") &&
              platform.onlineMultiplayerEnabled,
            maxPlayers: 5,
          });
        if (request.action === "multiplayer:open") {
          const enabled =
            game.multiplayer === true &&
            (game.permissions || []).includes("multiplayer") &&
            platform.onlineMultiplayerEnabled;
          window.dispatchEvent(
            new CustomEvent("dinoplay-community-multiplayer-request", {
              detail: { gameId: id },
            }),
          );
          return reply(request, true, {
            enabled,
            maxPlayers: 5,
            transport: enabled ? "platform" : "blocked",
          });
        }
        throw new Error("unknown-action");
      } catch (error) {
        reply(request, false, null, error.message || "request-failed");
      }
    };
    overlay.querySelector("button").addEventListener("click", close);
    window.addEventListener("message", receive);
  }
  function toast(text, type = "") {
    let t = document.querySelector(".dp-toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "dp-toast";
      document.body.appendChild(t);
    }
    t.className = `dp-toast show ${type}`;
    t.textContent = text;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => (t.className = "dp-toast"), 2600);
  }
  document.querySelectorAll(".dp-nav button").forEach(
    (b) =>
      (b.onclick = () => {
        tab = b.dataset.tab;
        render();
      }),
  );
  window.openGame = (id) => {
    if (installed(id)) {
      document.body.classList.remove("dp-shell");
      if (catalog[id]?.runtime === "sandbox") launchCommunityGame(id);
      else originalOpen(id);
    } else {
      tab = "library";
      render();
      toast("Instala primeiro este jogo.");
    }
  };
  window.renderDinoPlay = render;
  const themeObserver = new MutationObserver(() =>
    document.body.classList.toggle(
      "dp-shell",
      host.classList.contains("active"),
    ),
  );
  themeObserver.observe(host, { attributes: true, attributeFilter: ["class"] });
  render();
  loadCatalog()
    .then(render)
    .catch(() =>
      console.warn("DinoPlay: catálogo externo indisponível; catálogo interno ativo."),
    );
})();
