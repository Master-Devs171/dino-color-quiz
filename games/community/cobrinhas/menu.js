/* Main menu composition: real progress, local artwork and existing game actions. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    make = (tag, text, cls) => {
      const n = document.createElement(tag);
      if (text !== undefined) n.textContent = text;
      if (cls) n.className = cls;
      return n;
    };
  const art = (name, cls) => {
    const n = make("img", undefined, cls);
    n.src = "menu-icons/" + name + "_3d.png";
    n.alt = "";
    n.draggable = false;
    return n;
  };
  const content = document.querySelector(".welcome-content"),
    side = document.querySelector(".garden-menu");
  const change = (id, name, label) => {
    const b = $(id),
      span = b.querySelector("span");
    span.replaceChildren(art(name));
    b.querySelector("b").textContent = label;
  };
  change("open-adventures", "arcade_gift", "Presente");
  change("open-shop", "arcade_shop", "Loja");
  $("open-wheel").querySelector("span").replaceChildren(art("arcade_wheel"));
  const album = $("open-album");
  content.append(album);
  album.classList.add("menu-chest");
  album.querySelector("span").replaceChildren(art("locked"));
  album.querySelector("b").textContent = "O meu álbum";
  const coins = make("button", undefined, "menu-free-coins");
  coins.id = "free-coins";
  const coinArt = make("span");
  coinArt.append(art("arcade_coins"));
  coins.append(
    coinArt,
    make("b", "Moedas grátis"),
    make("small", "Completa aventuras"),
  );
  side.insertBefore(coins, $("open-wheel"));
  coins.onclick = () => $("open-adventures").click();
  const ready = make("button", "Receber", "menu-claim");
  ready.id = "claim-menu-gift";
  content.append(ready);
  ready.onclick = () => {
    const book = GardenJournal.book,
      task = book.ready()[0];
    if (task && book.claim(task.id)) {
      GardenJournal.commit();
      sync();
    }
  };
  const top = make("div", undefined, "menu-top"),
    level = make("div", undefined, "menu-level"),
    badge = make("span", undefined, "menu-level-badge"),
    xp = make("span", "0 / 50", "menu-xp");
  badge.append(art("star"), make("b", "1"));
  level.append(badge, xp);
  const wallet = make("button", undefined, "menu-wallet");
  wallet.setAttribute("aria-label", "Moedas — abrir loja");
  wallet.append(art("coin"), make("b", "0"), make("span", "+", "menu-plus"));
  wallet.onclick = () => $("open-shop").click();
  top.append(level, wallet);
  content.append(top);
  const edit = $("customize"),
    label = edit.querySelector("b");
  label.textContent = "EDITAR COBRINHA";
  edit.querySelector("span").textContent = "+";
  const settings = $("open-settings"),
    background = $("open-background");
  settings.querySelector("span").replaceChildren(art("gear"));
  settings.querySelector("b").textContent = "Opções";
  background.querySelector("span").replaceChildren(art("national_park"));
  background.querySelector("b").textContent = "Cenário";
  const collection = make("button", "Skins", "menu-collection");
  collection.id = "menu-skins";
  collection.setAttribute("aria-label", "Ver coleção de skins");
  collection.onclick = () => {
    GardenBoutique.open("workshop");
    $("open-laboratory").click();
  };
  content.append(collection);
  const status = make("p", "", "menu-action-status");
  status.setAttribute("role", "status");
  content.append(status);
  function sync() {
    const book = GardenJournal.book;
    badge.querySelector("b").textContent = book.level;
    xp.textContent = (book.xp % 50) + " / 50";
    wallet.querySelector("b").textContent = book.coins;
    const count = book.ready().length;
    const giftReady = window.GardenExtras?.giftReady?.();
    ready.hidden = giftReady === undefined ? count === 0 : !giftReady;
    ready.setAttribute(
      "aria-label",
      giftReady === undefined
        ? "Receber recompensa de uma aventura concluída"
        : "Ver presentes disponíveis",
    );
    album.querySelector("small").textContent =
      book.state.claimed.length + " / " + GardenProgress.tasks.length;
  }
  let last = 0;
  function frame(t) {
    requestAnimationFrame(frame);
    if (
      t - last < 700 ||
      document.hidden ||
      document.body.dataset.menu === "playing"
    )
      return;
    last = t;
    sync();
  }
  requestAnimationFrame(frame);
  sync();
})();
