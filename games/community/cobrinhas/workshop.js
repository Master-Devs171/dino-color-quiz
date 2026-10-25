/* Card-based workshop and store, sharing the live renderer and saved journal. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    el = (tag, text, cls) => {
      const n = document.createElement(tag);
      if (text !== undefined) n.textContent = text;
      if (cls) n.className = cls;
      return n;
    };
  const icon = (name) => {
    const n = el("img");
    n.src = "icons/" + name + ".svg";
    n.alt = "";
    n.draggable = false;
    return n;
  };
  const words = {
    round: "Redondo",
    carrot: "Cenoura",
    chocolate: "Quadrado",
    corn: "Milho",
    kitten: "Gatinho",
    ice: "Cristal",
    plain: "Liso",
    stripes: "Riscas",
    dots: "Bolinhas",
    rainbow: "Arco-íris",
    flag: "Bandeira",
    classic: "Clássicos",
    big: "Grandes",
    happy: "Felizes",
    sleepy: "Sonolentos",
    wink: "Piscadela",
    stars: "Estrelas",
    glasses: "Óculos",
    smile: "Sorriso",
    grin: "Dentinhos",
    tiny: "Surpresa",
    tongue: "Língua",
    none: "Sem",
    blush: "Rosadas",
    freckles: "Sardinhas",
    flower: "Flor",
    crown: "Coroa",
    bow: "Laço",
    cap: "Boné",
    hearts: "Corações",
    bubbles: "Bolhas",
    pt: "Portugal",
    br: "Brasil",
    gb: "Reino Unido",
    fr: "França",
    de: "Alemanha",
    es: "Espanha",
    pl: "Polónia",
    it: "Itália",
    ua: "Ucrânia",
    us: "Estados Unidos",
    custom: "As minhas cores",
  };
  const reactions = [
    ["none", "Sem reação", "face"],
    ["cheer", "Boa!", "face"],
    ["love", "Carinho", "heart"],
    ["wow", "Uau!", "star"],
    ["win", "Consegui!", "crown"],
  ];
  const effects = [
    ["none", "Sem efeito", "cloud"],
    ["bubble", "Bolhas mágicas", "cloud"],
    ["frost", "Cristais", "diamond"],
    ["sparkle", "Estrelinhas", "star"],
    ["sunshine", "Raios de sol", "sun"],
  ];
  let mode = "workshop",
    tab = "parts",
    draft,
    wasPlaying = false,
    dirty = false,
    lastKO = 0,
    effectAt = -10,
    effectPos = null;
  const panel = el("dialog", undefined, "boutique");
  panel.id = "boutique";
  panel.setAttribute("aria-labelledby", "boutique-title");
  const header = el("header"),
    back = el("button", "←", "boutique-back");
  back.setAttribute("aria-label", "Voltar ao menu");
  const title = el("h2", "Oficina");
  title.id = "boutique-title";
  const wallet = el("div", undefined, "boutique-wallet");
  header.append(back, title, wallet);
  const layout = el("div", undefined, "boutique-layout"),
    left = el("aside", undefined, "boutique-preview"),
    canvas = el("canvas");
  canvas.width = 300;
  canvas.height = 390;
  canvas.setAttribute("aria-label", "Pré-visualização da tua cobrinha");
  const status = el("p", "", "boutique-status");
  status.setAttribute("role", "status");
  const apply = el("button", "Usar esta cobrinha", "boutique-apply");
  left.append(canvas, apply, status);
  const right = el("section", undefined, "boutique-options"),
    tabs = el("div", undefined, "boutique-tabs"),
    content = el("div", undefined, "boutique-content"),
    colors = el("div", undefined, "boutique-colors");
  tabs.setAttribute("role", "tablist");
  content.setAttribute("role", "tabpanel");
  content.id = "boutique-tab-content";
  right.append(tabs, content, colors);
  layout.append(left, right);
  panel.append(header, layout);
  document.body.append(panel);
  function preview(target, style, headOnly = false) {
    const c = target.getContext("2d");
    c.clearRect(0, 0, target.width, target.height);
    c.save();
    if (headOnly) {
      c.translate(target.width / 2, target.height / 2);
      c.scale(2.1, 2.1);
      SnakeStyle.draw(
        c,
        { id: 0, angle: Math.PI / 2, body: [{ x: 0, y: 0 }] },
        style,
        0,
        true,
      );
    } else if (target === canvas && window.innerWidth <= 700) {
      // A shorter, thicker snake stays readable in the compact preview.
      c.translate(target.width / 2, target.height / 2);
      c.scale(2.2, 2.2);
      const body = Array.from({ length: 20 }, (_, i) => ({
        x: Math.sin(i * 0.15) * 5,
        y: 65 - i * 7,
      }));
      SnakeStyle.draw(c, { id: 0, angle: Math.PI / 2, body }, style, 0, true);
    } else {
      const body = Array.from(
        { length: Math.max(12, Math.floor((target.height - 65) / 4.7)) },
        (_, i) => ({
          x: target.width / 2 + Math.sin(i * 0.055) * 10,
          y: target.height - 54 - i * 4.7,
        }),
      );
      SnakeStyle.draw(c, { id: 0, angle: Math.PI / 2, body }, style, 0, true);
    }
    c.restore();
  }
  window.addEventListener?.("resize", () => {
    if (panel.open && draft) refreshPreview();
  });
  function refreshPreview() {
    preview(canvas, draft);
    if (mode === "store") {
      const state = GardenJournal.book.state;
      const img =
        tab === "reactions"
          ? reactions.find((x) => x[0] === state.reaction)?.[2]
          : tab === "knockouts"
            ? effects.find((x) => x[0] === state.knockout)?.[2]
            : null;
      if (
        img &&
        state[tab === "reactions" ? "reaction" : "knockout"] !== "none"
      )
        GardenIcons.draw(canvas.getContext("2d"), img, 220, 95, 55);
    }
    wallet.replaceChildren(
      icon("coin"),
      el("b", String(GardenJournal.book.coins) + " moedas"),
    );
    apply.textContent =
      mode === "workshop" ? "Usar esta cobrinha" : "Selecionada";
    apply.disabled = mode !== "workshop";
  }
  function open(next) {
    if (panel.open) return;
    mode = next;
    tab = next === "workshop" ? "parts" : "upgrades";
    draft = GardenBridge.getAppearance();
    dirty = false;
    wasPlaying = GardenBridge.pauseForPanel();
    status.textContent =
      mode === "workshop" ? "Experimenta e carrega em Usar para guardar." : "";
    title.textContent = mode === "workshop" ? "Oficina" : "Loja";
    panel.showModal();
    render();
  }
  function close() {
    panel.close();
    GardenBridge.closePanel(wasPlaying);
  }
  back.onclick = close;
  panel.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  apply.onclick = () => {
    GardenBridge.equip(draft);
    GardenJournal.record("outfit", draft.pattern);
    dirty = false;
    status.textContent = "A tua criação ficou guardada!";
  };
  function choose(key, value) {
    draft = SnakeStyle.sanitize({ ...draft, [key]: value });
    dirty = true;
    if (mode === "store") {
      GardenBridge.equip(draft);
      dirty = false;
    }
    render();
  }
  function card(
    label,
    draw,
    action,
    selected = false,
    price = null,
    disabled = false,
  ) {
    const wrap = el("article", undefined, "boutique-card");
    const b = el("button", undefined, "boutique-choice");
    b.setAttribute("aria-label", label);
    b.setAttribute("aria-pressed", String(selected));
    const art = draw();
    b.append(art, el("span", label));
    b.onclick = action;
    wrap.append(b);
    if (price !== null) {
      const buy = el("button", price, "boutique-buy");
      buy.disabled = disabled;
      buy.onclick = action;
      wrap.append(buy);
    }
    content.append(wrap);
  }
  function styleCard(key, value) {
    card(
      words[value] || value,
      () => {
        const c = el("canvas");
        c.width = 150;
        c.height = 150;
        const style = { ...draft, [key]: value };
        if (key === "eyes") style.mouth = "none";
        preview(
          c,
          style,
          key === "eyes" ||
            key === "mouth" ||
            key === "hat" ||
            key === "cheeks",
        );
        return c;
      },
      () => choose(key, value),
      draft[key] === value,
    );
  }
  function section(label) {
    content.append(el("h3", label, "boutique-section"));
  }
  tabs.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const buttons = [...tabs.querySelectorAll("button")];
    let i = buttons.indexOf(document.activeElement);
    i =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? buttons.length - 1
          : (i + (e.key === "ArrowRight" ? 1 : -1) + buttons.length) %
            buttons.length;
    buttons[i].click();
    tabs.querySelectorAll("button")[i].focus();
  });
  function render() {
    tabs.replaceChildren();
    content.replaceChildren();
    colors.replaceChildren();
    refreshPreview();
    const entries =
      mode === "workshop"
        ? [
            ["parts", "Corpo"],
            ["eyes", "Olhos"],
            ["mouth", "Boca"],
            ["extras", "Acessórios"],
          ]
        : [
            ["upgrades", "Melhorias"],
            ["reactions", "Reações"],
            ["knockouts", "Efeitos"],
            ["flags", "Bandeiras"],
          ];
    for (const [id, label] of entries) {
      const b = el("button", label);
      b.setAttribute("role", "tab");
      b.id = "boutique-tab-" + id;
      b.setAttribute("aria-controls", content.id);
      b.tabIndex = tab === id ? 0 : -1;
      if (tab === id) content.setAttribute("aria-labelledby", b.id);
      b.setAttribute("aria-selected", String(tab === id));
      b.onclick = () => {
        tab = id;
        render();
      };
      tabs.append(b);
    }
    content.classList.toggle("upgrade-content", tab === "upgrades");
    if (mode === "workshop") {
      if (tab === "parts") {
        section("Forma do corpo");
        for (const v of [
          "round",
          "carrot",
          "chocolate",
          "corn",
          "kitten",
          "ice",
        ])
          styleCard("texture", v);
        section("Padrão");
        for (const v of SnakeStyle.options.pattern) styleCard("pattern", v);
      } else if (tab === "eyes" || tab === "mouth")
        for (const v of SnakeStyle.options[tab]) styleCard(tab, v);
      else {
        for (const [key, label] of [
          ["hat", "Chapéus"],
          ["cheeks", "Bochechas"],
          ["trail", "Rasto"],
        ]) {
          section(label);
          for (const v of SnakeStyle.options[key]) styleCard(key, v);
        }
      }
      const colorField = (name, key) => {
        const label = el("label", name),
          input = el("input");
        input.type = "color";
        input.value = draft[key];
        input.setAttribute("aria-label", name);
        input.oninput = () => {
          draft[key] = input.value;
          dirty = true;
          refreshPreview();
        };
        label.append(input);
        colors.append(label);
      };
      colorField("Cor da cabeça", "headColor");
      if (tab === "eyes") colorField("Cor dos olhos", "eyeColor");
      if (tab === "extras") colorField("Cor das bochechas", "cheekColor");
      const label = el("label", "Cor do corpo");
      const picker = el("input");
      picker.type = "color";
      picker.value = draft.color;
      picker.setAttribute("aria-label", "Escolher qualquer cor");
      picker.oninput = () => {
        draft = SnakeStyle.sanitize({
          ...draft,
          color: picker.value,
          headColor: picker.value,
        });
        dirty = true;
        refreshPreview();
      };
      label.append(picker);
      colors.append(label);
      for (const color of [
        "#ef6666",
        "#ffab45",
        "#ffe76a",
        "#78c85d",
        "#58cddd",
        "#538ce5",
        "#b591ee",
        "#ef8db4",
        "#ffffff",
        "#555555",
      ]) {
        const b = el("button");
        b.style.backgroundColor = color;
        b.setAttribute("aria-label", "Cor " + color);
        b.setAttribute("aria-pressed", String(draft.color === color));
        b.onclick = () => {
          draft.color = color;
          draft.headColor = color;
          dirty = true;
          render();
        };
        colors.append(b);
      }
      const second = el("label", "Segunda cor"),
        pick2 = el("input");
      pick2.type = "color";
      pick2.value = draft.secondary;
      pick2.setAttribute("aria-label", "Segunda cor");
      pick2.oninput = () => {
        draft.secondary = pick2.value;
        dirty = true;
        refreshPreview();
      };
      second.append(pick2);
      colors.append(second);
    } else if (tab === "upgrades") {
      const labels = {
        magnet: ["Íman", "Atrai alimentos de mais longe.", "magnet"],
        vision: [
          "Binóculos",
          "Mantém a visão alargada durante mais tempo.",
          "vision",
        ],
        speed: [
          "Sapatos",
          "Mantém a velocidade extra durante mais tempo.",
          "speed",
        ],
        coins: ["Moedas", "Aumenta o valor das moedas que apanhas.", "coin"],
      };
      for (const [key, [name, description, img]] of Object.entries(labels)) {
        const level = GardenJournal.book.state.upgrades[key],
          row = el("article", undefined, "boutique-upgrade"),
          detail = el("div");
        detail.append(
          el("h3", name),
          el("p", description),
          el("small", level + " / 10"),
        );
        const track = el("div", undefined, "upgrade-track");
        for (let i = 0; i < 10; i++)
          track.append(el("i", undefined, i < level ? "filled" : ""));
        detail.append(track);
        const buy = el(
          "button",
          level === 10 ? "Máximo" : "150 moedas",
          "boutique-buy",
        );
        buy.disabled = level === 10 || GardenJournal.book.coins < 150;
        buy.onclick = () => {
          if (GardenJournal.book.buyUpgrade(key)) {
            GardenJournal.commit();
            status.textContent = "Melhoria guardada!";
            render();
          }
        };
        row.append(icon(img), detail, buy);
        content.append(row);
      }
    } else if (tab === "flags") {
      for (const value of SnakeStyle.options.flag)
        card(
          words[value] || value,
          () => {
            const c = el("canvas");
            c.width = 150;
            c.height = 150;
            preview(c, { ...draft, flag: value }, true);
            return c;
          },
          () => choose("flag", value),
          draft.flag === value,
        );
      if (draft.flag === "custom") {
        for (const [key, name] of [
          ["flagColorA", "Cor A"],
          ["flagColorB", "Cor B"],
        ]) {
          const label = el("label", name),
            input = el("input");
          input.type = "color";
          input.value = draft[key];
          input.setAttribute("aria-label", name);
          input.oninput = () => {
            draft[key] = input.value;
            GardenBridge.equip(draft);
            refreshPreview();
          };
          label.append(input);
          colors.append(label);
        }
        for (const value of SnakeStyle.options.flagStyle) {
          const b = el(
            "button",
            { horizontal: "Faixas", vertical: "Verticais", cross: "Cruz" }[
              value
            ],
          );
          b.className = "flag-layout";
          b.onclick = () => choose("flagStyle", value);
          colors.append(b);
        }
      }
      const note = el(
        "p",
        "As bandeiras são gratuitas. Escolhe uma e fica logo aplicada.",
        "boutique-section",
      );
      content.append(note);
    } else {
      const key = tab === "reactions" ? "reaction" : "knockout",
        items = key === "reaction" ? reactions : effects,
        book = GardenJournal.book;
      for (const [id, name, img] of items) {
        const owned = id === "none" || book.state.cosmetics.includes(id),
          selected = book.state[key] === id,
          price = GardenProgress.cosmetics[id];
        card(
          name,
          () => icon(img),
          () => {
            if (!owned && !book.buyCosmetic(id)) return;
            book.state[key] = id;
            GardenJournal.commit();
            status.textContent = name + " selecionado!";
            render();
          },
          selected,
          owned ? (selected ? "Selecionado" : "Usar") : price + " moedas",
          !owned && book.coins < price,
        );
      }
    }
    GardenIcons.enhance(panel);
  }
  $("customize").onclick = () => open("workshop");
  $("edit-snake").onclick = () => open("workshop");
  const shop = $("open-shop"),
    openLaboratory = shop.onclick;
  shop.onclick = () => open("store");
  const lab = el("button", undefined, "lobby-side lobby-laboratory");
  lab.id = "open-laboratory";
  lab.append(icon("palette"), el("strong", "Coleção de skins"));
  left.append(lab);
  lab.onclick = () => {
    close();
    openLaboratory();
  };
  // The existing laboratory's create button also opens the new workshop.
  const bubble = el("button", undefined, "reaction-trigger");
  bubble.id = "send-reaction";
  bubble.setAttribute("aria-label", "Mostrar a minha reação");
  bubble.append(icon("face"));
  bubble.hidden = true;
  document.body.append(bubble);
  let reactionUntil = 0;
  function react() {
    if (GardenJournal.book.state.reaction !== "none")
      reactionUntil = performance.now() + 2500;
  }
  bubble.onclick = react;
  document.addEventListener("keydown", (e) => {
    if (
      e.code === "KeyE" &&
      !e.repeat &&
      !panel.open &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
    )
      react();
  });
  window.GardenBoutique = {
    open,
    draw(ctx, game, head) {
      bubble.hidden = !head || !$("overlay")?.hidden;
      const state = GardenJournal.book.state;
      bubble.disabled = state.reaction === "none";
      if (game.roundStats.knockouts < lastKO) lastKO = 0;
      if (game.roundStats.knockouts > lastKO) {
        lastKO = game.roundStats.knockouts;
        effectAt = game.time;
        effectPos = game.knockoutPosition
          ? { ...game.knockoutPosition }
          : head
            ? { ...head }
            : null;
        if (state.reaction !== "none") reactionUntil = performance.now() + 2200;
      }
      if (head && performance.now() < reactionUntil) {
        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.roundRect(head.x - 32, head.y - 100, 64, 54, 12);
        ctx.fill();
        const img = reactions.find((x) => x[0] === state.reaction)?.[2];
        if (img) GardenIcons.draw(ctx, img, head.x, head.y - 74, 42);
        ctx.restore();
      }
      if (
        effectPos &&
        state.knockout !== "none" &&
        game.time - effectAt < 1.4
      ) {
        const t = game.time - effectAt;
        const radius = matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 25
          : t * 100;
        ctx.save();
        ctx.globalAlpha = 1 - t / 1.4;
        const image = effects.find((x) => x[0] === state.knockout)?.[2];
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          GardenIcons.draw(
            ctx,
            image,
            effectPos.x + Math.cos(a) * radius,
            effectPos.y + Math.sin(a) * radius,
            26,
          );
        }
        ctx.restore();
      }
    },
  };
})();
