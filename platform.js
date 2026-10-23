(() => {
  const gameCache = "dinoplay-games-v1";
  const gameCacheName = (id, version) =>
    `dinoplay-games-v2-${id}-${String(version).replace(/[^0-9.]/g, "")}`;
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
        "./multiplayer.js?v=8",
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
        "./racer.css?v=5",
        "./racer.js?v=27",
        "./assets/three.module.js",
        "./assets/three.core.js",
      ],
    },
  };
  const categories = {
    all: { icon: "🎮", label: "Todos" },
    learn: { icon: "🧠", label: "Aprender" },
    puzzle: { icon: "🧩", label: "Puzzles" },
    create: { icon: "🎨", label: "Criar" },
    explore: { icon: "🗺️", label: "Explorar" },
    action: { icon: "⚡", label: "Ação" },
    sports: { icon: "⚽", label: "Desporto" },
    music: { icon: "🎵", label: "Música" },
  };
  const categoryStyle = {
    learn: { icon: "🧩", tone: "sky" },
    puzzle: { icon: "🧩", tone: "sky" },
    create: { icon: "🧱", tone: "blocks" },
    explore: { icon: "🏙️", tone: "city" },
    action: { icon: "⚡", tone: "city" },
    sports: { icon: "⚽", tone: "blocks" },
    music: { icon: "🎵", tone: "sky" },
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
    originalOpen = window.openGame,
    parental = window.DinoPlayParental;
  if (!host || !originalOpen) return;
  if (!document.querySelector('link[href^="platform.css"]')) {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "platform.css?v=11";
    document.head.appendChild(css);
  }
  brand.innerHTML = "<span>🦖</span> DinoPlay";
  footer.textContent =
    "🔒 Sem anúncios · Sem chat · Progresso guardado neste dispositivo";
  document.title = "DinoPlay";
  document.querySelector("#updateStatus").textContent = "DinoPlay v5.19";
  host.classList.add("platform-home");
  host.innerHTML = `<div class="dp-head"><div><small>OLÁ, EXPLORADOR!</small><h1>Dino<span>Play</span></h1><p>A tua biblioteca de aventuras</p></div><img class="dp-mascot" src="assets/dinoplay-mascot.png" alt="Dinossauro DinoPlay"></div><div id="dpView"></div><span id="puzzleMenuProgress" hidden></span><span id="blockMenuProgress" hidden></span><nav class="dp-nav"><button data-tab="home" class="active">🏠<small>Início</small></button><button data-tab="library">🎮<small>Biblioteca</small></button><button data-tab="parents">👨‍👩‍👧<small>Pais</small></button></nav>`;
  let tab = "home",
    category = "all",
    parentPage = "security",
    busy = null,
    parentOpen = false,
    removeConfirm = null,
    profileDeleteConfirm = false,
    pendingInstall = null,
    friendSyncTimer = null,
    friendSyncBusy = false,
    catalogRefreshBusy = false,
    parentRecoveryCode = "";
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
  const tr = (value) => window.DinoI18n?.t(value) || value;
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
  async function loadCatalog(showFeedback = false) {
    if (catalogRefreshBusy) return;
    catalogRefreshBusy = true;
    try {
      const response = await fetch(`./games/catalog.json?t=${Date.now()}`, {
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
      render();
      await updateInstalledGames(showFeedback);
    } finally {
      catalogRefreshBusy = false;
    }
  }
  function friendRows() {
    const ids = friendIds(),
      profiles = window.DinoPlayMultiplayer?.friendProfiles() || {};
    return ids.length
      ? ids
          .map(
            (id, i) =>
              `<div><span>🧒</span><p><b>${safeText(profiles[id] || `${tr("Amigo autorizado")} ${i + 1}`)}</b><small>${safeText(tr("Autorizado pelos responsáveis"))} · ${id.slice(-4)}</small></p><button class="remove" data-friend-remove="${id}">${safeText(tr("REMOVER"))}</button></div>`,
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
    if (friendSyncBusy || !parentOpen || tab !== "parents" || !platform.onlineMultiplayerEnabled) return;
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
    return `<article class="dp-game ${safeText(g.tone)}"><div class="dp-cover"><img src="${safeText(g.cover)}" alt=""><b>${safeText(tr(g.name))}</b></div><div class="dp-game-info"><div><i>${safeText(g.age)}</i><i>⬇ ${safeText(g.size)}</i><i>✓ ${safeText(tr("Offline"))}</i></div><p>${safeText(tr(g.description))}</p><div class="dp-game-actions"><button data-${has ? "play" : "install"}="${safeText(id)}" ${installing ? "disabled" : ""}>${safeText(tr(installing ? "A INSTALAR…" : has ? "JOGAR" : "INSTALAR"))}</button><button class="details" data-details="${safeText(id)}" aria-label="${safeText(tr("Informações"))}: ${safeText(tr(g.name))}">ⓘ</button></div><div class="dp-install-bar ${installing ? "" : "hidden"}"><span id="install-${safeText(id)}"></span></div></div></article>`;
  }
  function categoryButtons() {
    return Object.entries(categories)
      .map(
        ([id, item]) =>
          `<button type="button" data-category="${id}" class="${category === id ? "active" : ""}" aria-pressed="${category === id}">${item.icon} ${safeText(tr(item.label))}</button>`,
      )
      .join("");
  }
  function categoryGames() {
    return Object.keys(catalog).filter(
      (id) => category === "all" || catalog[id].category === category,
    );
  }
  function parentLockMarkup() {
    const configured = parental?.status().configured;
    return `<section class="dp-parent-lock"><span>🔒</span><h2>Área dos Pais</h2><p>${pendingInstall ? `${safeText(tr("Confirma que és adulto para instalar este jogo."))} <b>${safeText(tr(catalog[pendingInstall]?.name))}</b>` : configured ? "Introduz o PIN parental para continuar." : "Cria um PIN parental para proteger instalações, remoções, amizades e multiplayer."}</p>${configured ? '<label for="parentPin">PIN parental</label><input id="parentPin" type="password" inputmode="numeric" maxlength="6" autocomplete="current-password" placeholder="4 a 6 números"><button id="parentUnlock">ENTRAR</button><button id="showRecovery" class="dp-link-button">Usar código de recuperação</button><div id="recoveryBox" class="hidden"><input id="parentRecovery" autocomplete="off" autocapitalize="characters" placeholder="XXXX-XXXX-XXXX"><button id="recoverParent">RECUPERAR ACESSO</button></div>' : '<label for="newParentPin">Novo PIN</label><input id="newParentPin" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password" placeholder="4 a 6 números"><input id="confirmParentPin" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password" placeholder="Repetir PIN"><button id="parentSetup">CRIAR PROTEÇÃO PARENTAL</button>'}<small id="parentError"></small></section>`;
  }
  function parentSecurityMarkup() {
    return `${parentRecoveryCode ? `<div class="dp-recovery-notice"><b>Guarda este código de recuperação</b><code>${safeText(parentRecoveryCode)}</code><small>É mostrado apenas agora. Guarda-o fora do dispositivo.</small><button id="recoverySaved">JÁ GUARDEI</button></div>` : ""}<div class="dp-pin-settings"><b>🔑 Alterar PIN parental</b><small>Ao alterar o PIN será criado um novo código de recuperação.</small><div><input id="currentParentPin" type="password" inputmode="numeric" maxlength="6" placeholder="PIN atual"><input id="nextParentPin" type="password" inputmode="numeric" maxlength="6" placeholder="Novo PIN"><button id="changeParentPin">ALTERAR</button></div></div>`;
  }
  function parentExtrasMarkup() {
    const rows = Object.values(catalog).flatMap((game) =>
      (game.extras || []).map(
        (extra) =>
          `<div class="dp-extra"><span>${safeText(game.icon)}</span><div><b>${safeText(extra.name)}</b><small>${safeText(game.name)} · ${safeText(extra.description)}</small></div><button type="button" disabled>${safeText(tr("INDISPONÍVEL"))}</button></div>`,
      ),
    );
    return `<div class="dp-extras-info"><b>🛍️ ${safeText(tr("Extras dos jogos"))}</b><p>Compras só podem ser apresentadas e confirmadas nesta Área dos Pais. Os jogos nunca recebem dados de pagamento.</p></div><div class="dp-extras-list">${rows.length ? rows.join("") : `<div class="dp-no-extras">${safeText(tr("Ainda não existem extras disponíveis."))}</div>`}</div><div class="dp-parent-note">🔒 Os pagamentos permanecem desativados até existir validação segura no servidor. Nenhum desbloqueio pago é guardado apenas neste dispositivo.</div>`;
  }
  function parentPrivacyMarkup() {
    const hasProfile = Boolean(window.DinoPlayMultiplayer?.hasIdentity());
    return `<div class="dp-data-card about"><b>🦕 Quem somos</b><p>O DinoPlay nasceu de uma necessidade real de um grupo privado de pais: criar um espaço seguro, divertido e positivo para os nossos filhos.</p><a href="./about.html" target="_blank" rel="noopener">CONHECER A NOSSA HISTÓRIA</a></div><div class="dp-data-card community"><b>💬 Comunidade DinoPlay</b><p>Um espaço no Discord destinado exclusivamente a pais e programadores. Não é uma área para crianças.</p><a href="https://discord.gg/f22q9cQYNp" target="_blank" rel="noopener noreferrer">ENTRAR NA COMUNIDADE</a></div><div class="dp-data-card"><b>🛡️ Dados e privacidade</b><p>O progresso dos jogos e o PIN parental ficam neste dispositivo. Se o multiplayer for usado, o serviço guarda um identificador aleatório, o apelido e as amizades autorizadas.</p><a href="./privacy.html" target="_blank" rel="noopener">LER POLÍTICA DE PRIVACIDADE</a></div><div class="dp-data-card danger"><b>Apagar perfil multiplayer</b><p>Remove do servidor o apelido, todas as amizades e a identificação multiplayer deste dispositivo. O progresso dos jogos e o PIN parental não são apagados.</p><button id="deleteMultiplayerProfile" type="button" ${hasProfile ? "" : "disabled"}>${profileDeleteConfirm ? "CONFIRMAR ELIMINAÇÃO" : hasProfile ? "APAGAR PERFIL MULTIPLAYER" : "NÃO EXISTE PERFIL MULTIPLAYER"}</button><small id="profileDeleteMessage" role="status"></small></div>`;
  }
  function applyParentPage(view) {
    const title = view.querySelector(":scope > .dp-section > .dp-title");
    if (!title) return;
    const nav = document.createElement("div");
    nav.className = "dp-parent-pages";
    nav.innerHTML = [["security", "🔐", "Segurança"], ["friends", "👨‍👩‍👧", "Amigos"], ["games", "🎮", "Jogos"], ["extras", "🛍️", "Extras"], ["privacy", "🛡️", "Privacidade"]].map(([id, icon, label]) => `<button type="button" data-parent-page="${id}" class="${parentPage === id ? "active" : ""}">${icon} ${safeText(tr(label))}</button>`).join("");
    title.after(nav);
    const section = title.parentElement;
    const groups = {
      security: section.querySelectorAll(":scope > .dp-recovery-notice, :scope > .dp-pin-settings, :scope > .dp-parent-setting"),
      friends: section.querySelectorAll(":scope > .dp-child-profile, :scope > .dp-friends"),
      games: section.querySelectorAll(":scope > .dp-parent-note, :scope > .dp-manage, :scope > .dp-privacy"),
    };
    Object.entries(groups).forEach(([id, nodes]) => nodes.forEach((node) => node.classList.toggle("hidden", parentPage !== id)));
    if (parentPage === "extras") nav.insertAdjacentHTML("afterend", parentExtrasMarkup());
    if (parentPage === "privacy") nav.insertAdjacentHTML("afterend", parentPrivacyMarkup());
    if (parentPage === "friends" && !platform.onlineMultiplayerEnabled)
      nav.insertAdjacentHTML("afterend", '<div class="dp-parent-note">🔒 Ativa primeiro o multiplayer na página Segurança.</div>');
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
        label = tr(categories[category].label);
      view.innerHTML = `<section class="dp-section"><div class="dp-title"><div><small>ESCOLHIDOS PARA CRIANÇAS</small><h2>Biblioteca</h2></div><span>${platform.installed.length}/${Object.keys(catalog).length} ${safeText(tr("instalados"))}</span></div><div class="dp-chips" role="group" aria-label="${safeText(tr("Categorias de jogos"))}">${categoryButtons()}</div><div class="dp-category-title"><b>${categories[category].icon} ${label}</b><small>${ids.length} ${safeText(tr(ids.length === 1 ? "jogo" : "jogos"))}</small></div><div class="dp-grid">${ids.map((id) => card(id, "library")).join("")}</div></section>`;
    } else if (!parentOpen) view.innerHTML = parentLockMarkup();
    else
      view.innerHTML = `<section class="dp-section"><div class="dp-title"><div><small>GESTÃO SEGURA</small><h2>Área dos Pais</h2></div><button id="parentLock">Bloquear</button></div>${parentSecurityMarkup()}<div class="dp-parent-setting"><span>🌍</span><div><b>Multiplayer pela Internet</b><small>Permite jogar apenas com amigos aprovados pelos dois responsáveis.</small><em>${platform.onlineMultiplayerEnabled ? "Autorizado pelo responsável" : "Bloqueado por predefinição"}</em></div><button type="button" data-online-toggle class="${platform.onlineMultiplayerEnabled ? "on" : "off"}" aria-pressed="${platform.onlineMultiplayerEnabled}">${platform.onlineMultiplayerEnabled ? "ATIVO" : "BLOQUEADO"}</button></div>${platform.onlineMultiplayerEnabled ? `<div class="dp-child-profile"><span>🧒</span><div><b>Perfil da criança</b><small>Usa apenas o primeiro nome ou um apelido. Será visível somente aos amigos autorizados.</small></div><input id="childNicknameInput" maxlength="16" value="${childNickname().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")}" placeholder="Nome ou apelido"><button id="childNicknameSave">GUARDAR</button></div><div class="dp-friends"><div class="dp-friends-head"><div><b>Amigos autorizados</b><small>Os códigos só funcionam aqui, uma vez e durante 2 minutos.</small></div><button id="friendCodeCreate">＋ GERAR CÓDIGO</button></div><div id="friendCodeResult" class="hidden"></div><div class="dp-friend-accept"><input id="friendCodeInput" maxlength="11" autocapitalize="none" autocomplete="off" spellcheck="false" placeholder="Código do outro responsável"><button id="friendCodeAccept">ACEITAR AMIZADE</button></div><small id="friendMessage"></small><div class="dp-manage dp-friend-list">${friendRows()}</div></div>` : ""}<div class="dp-parent-note">💾 Remover um jogo liberta os ficheiros offline, mas mantém todo o progresso para uma futura reinstalação.</div><div class="dp-manage">${Object.keys(
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
    if (tab === "parents" && parentOpen) applyParentPage(view);
    bind();
    startFriendSync();
  }
  function bind() {
    Object.entries({
      confirmParentPin: "Repetir PIN",
      parentRecovery: "Código de recuperação",
      currentParentPin: "PIN atual",
      nextParentPin: "Novo PIN",
      childNicknameInput: "Nome ou apelido",
      friendCodeInput: "Código do outro responsável",
    }).forEach(([id, label]) => document.querySelector(`#${id}`)?.setAttribute("aria-label", tr(label)));
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
    document.querySelectorAll("[data-parent-page]").forEach(
      (button) =>
        (button.onclick = () => {
          parentPage = button.dataset.parentPage;
          render();
        }),
    );
    document
      .querySelectorAll("[data-play]")
      .forEach((b) => (b.onclick = () => window.openGame(b.dataset.play)));
    document
      .querySelectorAll("[data-install]")
      .forEach((b) => (b.onclick = () => requestInstall(b.dataset.install)));
    document
      .querySelectorAll("[data-details]")
      .forEach((b) => (b.onclick = () => showGameDetails(b.dataset.details)));
    const finishParentUnlock = () => {
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
    };
    document.querySelector("#parentSetup")?.addEventListener("click", async () => {
      const pin = document.querySelector("#newParentPin").value,
        confirmation = document.querySelector("#confirmParentPin").value,
        error = document.querySelector("#parentError");
      if (!parental?.validPin(pin)) {
        error.textContent = tr("Escolhe um PIN com 4 a 6 números.");
        return;
      }
      if (pin !== confirmation) {
        error.textContent = tr("Os dois PIN não são iguais.");
        return;
      }
      try {
        parentRecoveryCode = await parental.setup(pin);
        finishParentUnlock();
      } catch {
        error.textContent = tr("Não foi possível criar o PIN neste dispositivo.");
      }
    });
    document.querySelector("#parentUnlock")?.addEventListener("click", async () => {
      const error = document.querySelector("#parentError"),
        button = document.querySelector("#parentUnlock");
      button.disabled = true;
      try {
        if (await parental.verify(document.querySelector("#parentPin").value))
          finishParentUnlock();
        else {
          error.textContent = tr("PIN incorreto.");
          button.disabled = false;
        }
      } catch (failure) {
        const seconds = Math.max(1, Math.ceil((failure.retryAfter || 0) / 1000));
        error.textContent = `Demasiadas tentativas. Espera ${seconds} segundos.`;
        button.disabled = false;
      }
    });
    document.querySelector("#showRecovery")?.addEventListener("click", () =>
      document.querySelector("#recoveryBox").classList.toggle("hidden"),
    );
    document.querySelector("#recoverParent")?.addEventListener("click", async () => {
      const ok = await parental.verify(
        document.querySelector("#parentRecovery").value,
        true,
      );
      if (ok) finishParentUnlock();
      else document.querySelector("#parentError").textContent = tr("Código de recuperação inválido.");
    });
    document.querySelector("#recoverySaved")?.addEventListener("click", () => {
      parentRecoveryCode = "";
      render();
    });
    document.querySelector("#changeParentPin")?.addEventListener("click", async () => {
      const current = document.querySelector("#currentParentPin").value,
        next = document.querySelector("#nextParentPin").value;
      if (!parental.validPin(next)) return toast("O novo PIN deve ter 4 a 6 números.", "bad");
      try {
        parentRecoveryCode = await parental.change(current, next);
        render();
        toast("✅ PIN parental alterado");
      } catch {
        toast("PIN atual incorreto.", "bad");
      }
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
          message.textContent = tr("Primeiro guarda o nome ou apelido da criança.");
          return;
        }
        message.textContent = tr("A gerar código seguro…");
        try {
          const data = await window.DinoPlayMultiplayer.createFriendCode();
          box.classList.remove("hidden");
          box.textContent = data.code;
          message.textContent = tr("Envia este código ao outro responsável. Expira em 2 minutos e só funciona uma vez.");
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
          message.textContent = tr("Primeiro guarda o nome ou apelido da criança.");
          return;
        }
        if (!/^[a-z0-9]{11}$/.test(code)) {
          message.textContent = tr("Introduz o código completo de 11 caracteres.");
          return;
        }
        button.disabled = true;
        message.textContent = tr("A confirmar autorização dos dois responsáveis…");
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
          message.textContent = errors[e.code]
            ? tr(errors[e.code])
            : `${tr("Não foi possível aceitar")} (${e.code || tr("erro de ligação")}).`;
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
    document.querySelector("#deleteMultiplayerProfile")?.addEventListener("click", async () => {
      const button = document.querySelector("#deleteMultiplayerProfile"),
        message = document.querySelector("#profileDeleteMessage");
      if (!profileDeleteConfirm) {
        profileDeleteConfirm = true;
        render();
        return;
      }
      button.disabled = true;
      message.textContent = tr("A apagar o perfil multiplayer…");
      try {
        await window.DinoPlayMultiplayer.deleteProfile();
        ["multiplayerDeviceId", "multiplayerDeviceSecret", "authorizedFriends", "authorizedFriendProfiles", "childNickname"].forEach((key) => delete platform[key]);
        platform.onlineMultiplayerEnabled = false;
        savePlatform();
        profileDeleteConfirm = false;
        parentPage = "privacy";
        render();
        toast("✅ Perfil multiplayer apagado");
      } catch {
        profileDeleteConfirm = false;
        render();
        toast("Não foi possível apagar o perfil. Verifica a Internet.", "bad");
      }
    });
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
  function showGameDetails(id) {
    const game = catalog[id];
    if (!game) return;
    const has = installed(id),
      permissions = game.permissions || [],
      modal = document.createElement("div");
    modal.className = "dp-details-backdrop";
    modal.innerHTML = `<section class="dp-details" role="dialog" aria-modal="true" aria-labelledby="gameDetailsTitle"><button class="dp-details-close" aria-label="${safeText(tr("Fechar"))}">✕</button><img src="${safeText(game.cover)}" alt=""><div><small>${safeText(categories[game.category]?.icon)} ${safeText(tr(categories[game.category]?.label))}</small><h2 id="gameDetailsTitle">${safeText(tr(game.name))}</h2><p>${safeText(tr(game.description))}</p><dl><div><dt>${safeText(tr("Idade"))}</dt><dd>${safeText(game.age)}</dd></div><div><dt>${safeText(tr("Versão"))}</dt><dd>${safeText(game.version)}</dd></div><div><dt>${safeText(tr("Tamanho"))}</dt><dd>${safeText(game.size)}</dd></div><div><dt>${safeText(tr("Autor"))}</dt><dd>${safeText(game.author || "DinoPlay")}</dd></div><div><dt>${safeText(tr("Offline"))}</dt><dd>${safeText(tr("Sim"))}</dd></div><div><dt>Multiplayer</dt><dd>${safeText(tr(game.multiplayer ? "Com autorização parental" : "Não"))}</dd></div></dl><p class="dp-capabilities">${safeText(tr(permissions.includes("storage") ? "💾 Guarda progresso isolado neste dispositivo" : "🧩 Sem armazenamento adicional"))}<br>${safeText(tr(game.runtime === "sandbox" ? "🛡️ Jogo comunitário executado em área protegida" : "✅ Jogo oficial DinoPlay"))}</p><button class="dp-details-action">${safeText(tr(has ? "JOGAR" : "INSTALAR"))}</button></div></section>`;
    const close = () => modal.remove();
    modal.querySelector(".dp-details-close").onclick = close;
    modal.onclick = (event) => event.target === modal && close();
    modal.querySelector(".dp-details-action").onclick = () => {
      close();
      if (has) window.openGame(id);
      else requestInstall(id);
    };
    document.body.appendChild(modal);
    modal.querySelector(".dp-details-close").focus();
  }
  async function installGame(id) {
    if (busy || installed(id) || !catalog[id]) return;
    busy = id;
    render();
    const targetName = gameCacheName(id, catalog[id].version);
    const previousVersion = platform.versions[id];
    try {
      await caches.delete(targetName);
      const cache = await caches.open(targetName),
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
      await caches.delete(targetName);
      platform.installed = platform.installed.filter((gameId) => gameId !== id);
      if (previousVersion) platform.versions[id] = previousVersion;
      else delete platform.versions[id];
      busy = null;
      render();
      toast("Não foi possível instalar. Verifica a ligação à internet.", "bad");
    }
  }
  async function updateInstalledGames(showFeedback = false) {
    const pending = platform.installed.filter(
      (id) =>
        catalog[id] &&
        isNewerVersion(catalog[id].version, platform.versions[id]),
    );
    if (!pending.length) {
      if (showFeedback) toast("✅ Jogos e biblioteca atualizados");
      return;
    }
    toast(
      `⬇ A atualizar ${pending.length} ${pending.length === 1 ? "jogo" : "jogos"}…`,
    );
    let updated = 0;
    for (const id of pending) {
      try {
        await updateInstalledGame(id);
        updated++;
      } catch (error) {
        console.warn(`DinoPlay: atualização de ${id} adiada.`, error);
      }
    }
    render();
    if (updated === pending.length)
      toast(`✅ ${updated === 1 ? "Jogo atualizado" : `${updated} jogos atualizados`}`);
    else if (updated)
      toast(`✅ ${updated} atualizado(s) · os restantes serão tentados depois`);
    else
      toast("Não foi possível atualizar os jogos agora. A versão anterior foi mantida.", "bad");
  }
  function isNewerVersion(next, current) {
    if (!current) return true;
    const a = String(next).split(".").map(Number),
      b = String(current).split(".").map(Number);
    for (let i = 0; i < 3; i++) {
      const difference = (a[i] || 0) - (b[i] || 0);
      if (difference) return difference > 0;
    }
    return false;
  }
  async function updateInstalledGame(id) {
    const game = catalog[id],
      assets = gameAssets(game),
      stageName = gameCacheName(id, game.version),
      previousVersion = platform.versions[id];
    try {
      await caches.delete(stageName);
      const stage = await caches.open(stageName);
      for (const asset of assets) {
        const response = await fetch(asset, { cache: "reload" });
        if (!response.ok) throw new Error(`download-${response.status}`);
        await stage.put(asset, response);
      }
      for (const asset of assets)
        if (!(await stage.match(asset))) throw new Error("stage-missing");
      platform.versions[id] = game.version;
      savePlatform();
      if (previousVersion && previousVersion !== game.version)
        await caches.delete(gameCacheName(id, previousVersion));
    } catch (error) {
      platform.versions[id] = previousVersion;
      await caches.delete(stageName);
      throw error;
    }
  }
  async function removeGame(id) {
    const game = catalog[id];
    platform.installed = platform.installed.filter((x) => x !== id);
    delete platform.versions[id];
    savePlatform();
    removeConfirm = null;
    try {
      await caches.delete(gameCacheName(id, game.version));
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
          ? [assetPath(game.entry), "./sdk/dinoplay-game-sdk.js?v=2"]
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
              storage: (game.permissions || []).includes("storage"),
              entitlements: (game.permissions || []).includes("entitlements"),
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
          if (!(game.permissions || []).includes("storage"))
            throw new Error("permission-denied");
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
        if (request.action === "entitlements:status")
          return reply(request, true, { available: false, owned: [] });
        if (request.action === "entitlements:has") {
          if (!(game.permissions || []).includes("entitlements"))
            throw new Error("permission-denied");
          const productId = request.payload?.id;
          if (!(game.extras || []).some((extra) => extra.id === productId))
            throw new Error("unknown-entitlement");
          return reply(request, true, false);
        }
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
    t.textContent = tr(text);
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
  document.body.classList.remove("platform-loading");
  document.querySelector("#platformBoot")?.remove();
  window.DinoPlayRefreshCatalog = (showFeedback = false) =>
    loadCatalog(showFeedback).catch(() => {
      if (showFeedback)
        toast("Não foi possível procurar novos jogos agora.", "bad");
    });
  window.addEventListener("online", () => window.DinoPlayRefreshCatalog());
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) window.DinoPlayRefreshCatalog();
  });
  setInterval(() => window.DinoPlayRefreshCatalog(), 15 * 60 * 1000);
  loadCatalog()
    .catch(() =>
      console.warn("DinoPlay: catálogo externo indisponível; catálogo interno ativo."),
    );
})();
