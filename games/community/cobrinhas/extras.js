/* Additional game panels: saved preferences, gifts, controls and real statistics. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    make = (tag, text, cls) => {
      const n = document.createElement(tag);
      if (text !== undefined) n.textContent = text;
      if (cls) n.className = cls;
      return n;
    };
  const img = (name) => {
    const n = make("img");
    n.src = "icons/" + name + ".svg";
    n.alt = "";
    return n;
  };
  const defaults = {
    music: false,
    sound: true,
    shake: true,
    control: "touch",
    alwaysBoost: false,
  };
  let prefs = { ...defaults },
    revision = 0,
    panelActive = false,
    current = "settings",
    lastTime = 0,
    lastKills = 0,
    shakeUntil = 0;
  const sanitize = (v) => ({
    music: v?.music === true,
    sound: v?.sound !== false,
    shake: v?.shake !== false,
    control: ["fixed", "touch", "floating", "follow"].includes(v?.control)
      ? v.control
      : "touch",
    alwaysBoost: v?.alwaysBoost === true,
  });
  async function savePrefs() {
    revision++;
    applyPrefs();
    try {
      await GardenBridge.set("preferences", prefs);
    } catch {
      $("extra-status").textContent = "As opções ficam ativas nesta sessão.";
    }
  }
  function applyPrefs() {
    document.body.dataset.control = prefs.control;
    document.body.dataset.alwaysBoost = String(prefs.alwaysBoost);
    if (!prefs.music) musicIndex = 0;
  }
  const dialog = make("dialog", undefined, "extra-dialog");
  dialog.id = "extra-dialog";
  dialog.setAttribute("aria-labelledby", "extra-title");
  const close = make("button", "×", "extra-close");
  close.id = "extra-close";
  close.setAttribute("aria-label", "Fechar");
  const tabs = make("nav", undefined, "extra-tabs");
  tabs.setAttribute("role", "tablist");
  const body = make("section", undefined, "extra-content");
  body.id = "extra-content";
  const title = make("h2", "", "extra-title");
  title.id = "extra-title";
  const status = make("p", "", "extra-status");
  status.id = "extra-status";
  status.setAttribute("role", "status");
  dialog.append(close, tabs, body, title, status);
  document.body.append(dialog);
  function open(view) {
    panelActive = GardenBridge.pauseForPanel();
    current = view;
    dialog.dataset.view = view;
    dialog.showModal();
    render();
  }
  function dismiss() {
    dialog.close();
    GardenBridge.closePanel(panelActive);
    panelActive = false;
  }
  close.onclick = dismiss;
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    dismiss();
  });
  function check(label, key) {
    const l = make("label", undefined, "extra-check"),
      input = make("input");
    input.type = "checkbox";
    input.checked = prefs[key];
    input.id = "pref-" + key;
    input.onchange = () => {
      prefs[key] = input.checked;
      ensureAudio();
      savePrefs();
    };
    l.append(input, make("span", label));
    body.append(l);
    return input;
  }
  tabs.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const buttons = [...tabs.children];
    let i = buttons.indexOf(document.activeElement);
    i =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? buttons.length - 1
          : (i + (e.key === "ArrowRight" ? 1 : -1) + buttons.length) %
            buttons.length;
    buttons[i].click();
    tabs.children[i].focus();
  });
  function render() {
    tabs.replaceChildren();
    body.replaceChildren();
    status.textContent = "";
    if (["settings", "controls", "help"].includes(current)) {
      for (const [id, name, icon] of [
        ["settings", "Opções", "palette"],
        ["controls", "Controlos", "pointer"],
        ["help", "Ajuda", "book"],
      ]) {
        const b = make("button");
        b.append(img(icon), make("span", name));
        b.setAttribute("role", "tab");
        b.tabIndex = current === id ? 0 : -1;
        b.setAttribute("aria-controls", "extra-content");
        if (current === id)
          body.setAttribute("aria-labelledby", "extra-tab-" + id);
        body.setAttribute("role", "tabpanel");
        b.setAttribute("aria-selected", String(current === id));
        b.id = "extra-tab-" + id;
        b.onclick = () => {
          current = id;
          dialog.dataset.view = id;
          render();
        };
        tabs.append(b);
      }
      if (current === "settings") {
        title.textContent = "Opções";
        check("Música", "music");
        check("Som", "sound");
        check("Movimento da câmara", "shake");
        const note = make(
          "p",
          "Escolhe o som e os efeitos que preferes.",
          "extra-note",
        );
        body.append(note);
        const pace = make("button", "Ritmo da aventura", "extra-secondary");
        pace.onclick = () => {
          dismiss();
          legacySettings();
        };
        body.append(pace);
      }
      if (current === "controls") {
        title.textContent = "Modo de controlo";
        const list = make("div", undefined, "control-choices");
        for (const [id, label] of [
          ["fixed", "Joystick fixo"],
          ["touch", "Ponto de toque"],
          ["floating", "Joystick livre"],
          ["follow", "Joystick segue o dedo"],
        ]) {
          const b = make("button", label);
          b.setAttribute("aria-pressed", String(prefs.control === id));
          b.id = "control-" + id;
          b.onclick = () => {
            prefs.control = id;
            endTouch();
            savePrefs();
            render();
          };
          list.append(b);
        }
        body.append(list);
        const demo = make("div", undefined, "control-demo"),
          c = make("canvas");
        c.width = 240;
        c.height = 140;
        c.id = "controls-demo";
        c.setAttribute("aria-label", "Pré-visualização do modo de controlo");
        demo.append(
          make("b", "Pré-visualização"),
          c,
          make(
            "p",
            {
              fixed: "Usa o joystick no canto.",
              touch: "Toca onde queres ir.",
              floating: "O joystick aparece onde tocas.",
              follow: "O joystick acompanha o dedo.",
            }[prefs.control],
            "extra-note",
          ),
        );
        body.append(demo);
        check("Mostrar sempre o boost", "alwaysBoost");
        body.append(
          make(
            "p",
            "PC: rato, WASD ou setas para orientar. Clique esquerdo, Shift ou Espaço para acelerar. No telemóvel, usa o modo escolhido e o botão de boost.",
            "extra-note",
          ),
        );
      }
      if (current === "help") {
        title.textContent = "Ajuda e créditos";
        body.append(
          make("h3", "Cobrinhas do Jardim"),
          make(
            "p",
            "Desenvolvimento: Master-Devs171. Apanha alimentos e moedas, cresce e evita a borda e o corpo das outras cobras.",
          ),
          make("h3", "Áudio"),
          make(
            "p",
            "Melodia e sons sintetizados para este jogo, sem gravações externas.",
          ),
          make("h3", "Gráficos"),
          make(
            "p",
            "Cobra, arena e ícones SVG do projeto. Ícones 3D: Microsoft Fluent Emoji, licença MIT. Não há anúncios nem compras com dinheiro real.",
          ),
          make("h3", "Bónus"),
          make(
            "p",
            "Íman: atrai alimentos e moedas. Binóculos: amplia o campo de visão. Sapatos: dão velocidade. Apanhar outro bónus soma tempo.",
          ),
          make("h3", "O teu progresso"),
          make(
            "p",
            "As escolhas e estatísticas ficam guardadas neste dispositivo ou na app DinoPlay. O tempo e as eliminações do perfil são registados a partir desta atualização.",
          ),
        );
      }
    } else if (current === "gifts") {
      title.textContent = "Presentes";
      const wallet = make("div", undefined, "extra-wallet");
      wallet.append(img("coin"), make("b", String(GardenJournal.book.coins)));
      body.append(wallet);
      for (const [id, gift] of Object.entries(GardenProgress.timedGifts)) {
        const card = make("article", undefined, "timed-gift"),
          b = make("button");
        b.id = "gift-" + id;
        b.append(make("b", "+" + gift.amount + " moedas"));
        const image = make("img");
        image.src =
          "menu-icons/" +
          (id === "small" ? "coin" : "wrapped_gift") +
          "_3d.png";
        image.alt = "";
        b.append(image, make("span", "", "gift-time"));
        b.onclick = () => {
          const reward = GardenJournal.book.claimGift(id);
          if (!reward) return;
          GardenJournal.commit();
          render();
          status.textContent = "Recebeste " + reward.amount + " moedas!";
        };
        card.append(b);
        body.append(card);
      }
      body.append(
        make(
          "p",
          "Uma oferta a cada 5 minutos e outra a cada hora. Sem anúncios e sem perder prémios por sair.",
          "extra-note",
        ),
      );
      updateGifts();
    } else if (current === "profile") {
      title.textContent = "O teu perfil";
      const book = GardenJournal.book,
        p = book.state.profile,
        head = make("canvas");
      head.width = 90;
      head.height = 90;
      head.className = "profile-avatar";
      head.setAttribute("aria-label", "A tua cobrinha");
      const c = head.getContext("2d");
      c.translate(45, 45);
      c.scale(2, 2);
      SnakeStyle.draw(
        c,
        { id: 0, body: [{ x: 0, y: 0 }], angle: 0 },
        GardenBridge.getAppearance(),
        0,
        true,
      );
      const who = make("div", undefined, "profile-identity"),
        name = make("input");
      name.type = "text";
      name.maxLength = 24;
      name.value = p.name;
      name.id = "player-name";
      name.setAttribute("aria-label", "Nome do jogador");
      const save = make("button", "Guardar");
      save.id = "save-player-name";
      save.onclick = () => {
        const value = name.value.trim().slice(0, 24);
        if (!value) {
          status.textContent = "Escreve um nome.";
          name.focus();
          return;
        }
        p.name = value;
        GardenJournal.commit();
        status.textContent = "Nome guardado!";
      };
      who.append(head, name, save, make("small", "Nível " + book.level));
      const track = make("progress");
      track.max = 50;
      track.value = book.xp % 50;
      track.setAttribute("aria-label", "Progresso do nível");
      who.append(track);
      body.append(who);
      for (const [label, value] of [
        ["Melhor pontuação", p.bestScore],
        ["Maior sobrevivência", duration(p.bestSurvival)],
        ["Eliminações", p.kills],
        ["Partidas jogadas", book.state.rounds],
        ["Tempo total registado", duration(p.totalSeconds)],
      ]) {
        const row = make("div", undefined, "profile-stat");
        row.append(make("span", label), make("strong", String(value)));
        body.append(row);
      }
      body.append(
        make(
          "p",
          "O tempo e as eliminações são registados a partir desta atualização.",
          "extra-note",
        ),
      );
    }
  }
  function duration(value) {
    const n = Math.floor(value || 0);
    return n >= 3600
      ? Math.floor(n / 3600) + "h " + Math.floor((n % 3600) / 60) + "m"
      : Math.floor(n / 60) + "m " + String(n % 60).padStart(2, "0") + "s";
  }
  function updateGifts() {
    if (!dialog.open || current !== "gifts") return;
    for (const [id] of Object.entries(GardenProgress.timedGifts)) {
      const b = $("gift-" + id);
      if (!b) continue;
      const remaining = Math.max(
        0,
        GardenJournal.book.state.giftTimes[id] - Date.now(),
      );
      b.disabled = remaining > 0;
      b.querySelector(".gift-time").textContent = remaining
        ? duration(Math.ceil(remaining / 1000))
        : "Receber";
    }
  }
  const legacySettings = $("open-settings").onclick;
  $("claim-menu-gift").onclick = () => open("gifts");
  $("open-settings").onclick = () => open("settings");
  $("open-adventures").onclick = () => open("gifts");
  const profile = make("button", undefined, "open-profile");
  profile.id = "open-profile";
  profile.setAttribute("aria-label", "Abrir perfil e estatísticas");
  profile.append(img("face"), make("span", "Perfil"));
  document.querySelector(".welcome-content").append(profile);
  profile.onclick = () => open("profile");
  // Keep the existing adventure tasks accessible through Free Coins.
  $("free-coins").onclick = () => {
    $("adventures").showModal();
    $("show-tasks").click();
  };
  const level = document.querySelector(".menu-level");
  level.tabIndex = 0;
  level.setAttribute("role", "button");
  level.setAttribute("aria-label", "Abrir perfil e estatísticas");
  level.onclick = () => open("profile");
  level.onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open("profile");
    }
  };
  let audio = null,
    musicIndex = 0;
  const melody = [
    523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46, 659.25, 783.99,
    1046.5, 783.99, 587.33, 659.25, 523.25, 0,
  ];
  function ensureAudio() {
    if (!audio) {
      try {
        audio = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return null;
      }
    }
    if (audio.state === "suspended") audio.resume().catch(() => {});
    return audio;
  }
  function tone(freq, len = 0.11, volume = 0.025, type = "sine") {
    if (!audio || audio.state !== "running" || document.hidden || !freq) return;
    const at = audio.currentTime,
      o = audio.createOscillator(),
      gain = audio.createGain();
    o.type = type;
    o.frequency.value = freq;
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(volume, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + len);
    o.connect(gain);
    gain.connect(audio.destination);
    o.start(at);
    o.stop(at + len + 0.01);
  }
  document.addEventListener(
    "pointerdown",
    () => {
      if (prefs.music || prefs.sound) ensureAudio();
    },
    { passive: true },
  );
  document.addEventListener("keydown", () => {
    if (prefs.music || prefs.sound) ensureAudio();
  });
  setInterval(() => {
    if (prefs.music && !document.hidden) {
      tone(melody[musicIndex++ % melody.length], 0.3, 0.016);
    }
  }, 430);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) audio?.suspend().catch(() => {});
  });
  // Touch controls reuse the arena joystick and preserve all keyboard/mouse controls.
  const joystick = $("joystick"),
    stick = $("stick");
  let touchId = null,
    origin = null;
  const initialStyle = {
    left: joystick.style.left,
    top: joystick.style.top,
    right: joystick.style.right,
    bottom: joystick.style.bottom,
  };
  function moveJoystick() {
    if (!origin) return;
    const r = joystick.getBoundingClientRect();
    joystick.style.left = origin.x - r.width / 2 + "px";
    joystick.style.top = origin.y - r.height / 2 + "px";
    joystick.style.right = "auto";
    joystick.style.bottom = "auto";
  }
  function startTouch(e, onJoystick = false) {
    if (touchId !== null && touchId !== e.pointerId) return true;
    document.body.dataset.touchActive = "true";
    if (prefs.control === "touch" && !onJoystick) return false;
    if (prefs.control === "fixed" && !onJoystick) return true;
    touchId = e.pointerId;
    if (prefs.control === "fixed") {
      const r = joystick.getBoundingClientRect();
      origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    } else {
      origin = { x: e.clientX, y: e.clientY };
      joystick.classList.add("touch-active");
      moveJoystick();
    }
    return true;
  }
  function moveTouch(e) {
    if (prefs.control === "touch") return false;
    if (touchId !== e.pointerId || !origin) return true;
    let x = e.clientX - origin.x,
      y = e.clientY - origin.y,
      d = Math.hypot(x, y);
    if (prefs.control === "follow" && d > 42) {
      origin.x += x * (1 - 42 / d);
      origin.y += y * (1 - 42 / d);
      moveJoystick();
      x = e.clientX - origin.x;
      y = e.clientY - origin.y;
      d = 42;
    }
    if (d > 7) GardenBridge.steer(Math.atan2(y, x));
    const f = d ? Math.min(32, d) / d : 0;
    stick.style.transform = `translate(${x * f}px,${y * f}px)`;
    return true;
  }
  function endTouch(e) {
    if (e && touchId !== null && e.pointerId !== touchId) return;
    touchId = null;
    origin = null;
    document.body.dataset.touchActive = "false";
    joystick.classList.remove("touch-active");
    Object.assign(joystick.style, initialStyle);
    stick.style.transform = "";
  }
  joystick.onpointerdown = (e) => {
    joystick.setPointerCapture(e.pointerId);
    startTouch(e, true);
    moveTouch(e);
  };
  joystick.onpointermove = moveTouch;
  joystick.onpointerup = joystick.onpointercancel = joystick.onlostpointercapture = endTouch;
  window.GardenControls = { start: startTouch, move: moveTouch, end: endTouch };
  window.GardenExtras = {
    giftReady() {
      return Object.values(GardenJournal.book.state.giftTimes).some(
        (t) => t <= Date.now(),
      );
    },
    startRound() {
      lastTime = 0;
      lastKills = 0;
    },
    tick(game, events) {
      const elapsed = Math.max(0, game.time - lastTime),
        kills = Math.max(0, game.roundStats.knockouts - lastKills);
      lastTime = game.time;
      lastKills = game.roundStats.knockouts;
      GardenJournal.session({
        seconds: elapsed,
        score: game.roundStats.maxScore,
        survival: game.time,
        kills,
      });
      if (prefs.sound) {
        if (events.includes("coin")) tone(1046.5);
        else if (
          events.some((e) => typeof e === "string" && e.startsWith("power:"))
        )
          tone(880, 0.18, 0.035, "triangle");
        else if (events.includes("eat")) tone(659.25, 0.06, 0.018);
        else if (events.includes("border") || events.includes("retry"))
          tone(196, 0.22, 0.025, "triangle");
      }
      if (
        kills ||
        events.some((e) => typeof e === "string" && e.startsWith("power:"))
      )
        shakeUntil = performance.now() + 180;
    },
    cameraOffset() {
      if (
        !prefs.shake ||
        performance.now() > shakeUntil ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return { x: 0, y: 0 };
      const t = performance.now();
      return { x: Math.sin(t * 0.13) * 2, y: Math.cos(t * 0.11) * 2 };
    },
    open,
  };
  let demoAt = 0;
  function frame(t) {
    requestAnimationFrame(frame);
    if (!dialog.open || document.hidden || t - demoAt < 50) return;
    demoAt = t;
    updateGifts();
    const canvas = $("controls-demo");
    if (canvas) {
      const c = canvas.getContext("2d");
      c.clearRect(0, 0, 240, 140);
      const phase = matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : t / 1000,
        head = { x: 120 + Math.cos(phase) * 55, y: 70 + Math.sin(phase) * 28 },
        body = Array.from({ length: 18 }, (_, i) => ({
          x: head.x - i * 5,
          y: head.y + Math.sin(i * 0.18) * 9,
        }));
      SnakeStyle.draw(
        c,
        { id: 0, body, angle: 0 },
        GardenBridge.getAppearance(),
        phase,
        true,
      );
      GardenIcons.draw(c, "pointer", head.x + 35, head.y + 8, 34);
    }
  }
  requestAnimationFrame(frame);
  applyPrefs();
  (async () => {
    await GardenBridge.ready;
    const rev = revision;
    try {
      const saved = await GardenBridge.get("preferences");
      if (rev === revision) {
        prefs = sanitize(saved);
        applyPrefs();
      }
      const best = await GardenBridge.get("best");
      if (Number.isFinite(best))
        GardenJournal.book.state.profile.bestScore = Math.max(
          GardenJournal.book.state.profile.bestScore,
          best,
        );
    } catch {}
  })();
})();
