/* Local original SVG assets shared by DOM menus and canvas. */
(() => {
  "use strict";
  const map = {
      "🪙": "coin",
      "👆": "pointer",
      "⭐": "star",
      "🌟": "star",
      "✨": "star",
      "☀️": "sun",
      "✦": "star",
      "💛": "heart",
      "💗": "heart",
      "💖": "heart",
      "♥": "heart",
      "🌱": "leaf",
      "🌿": "leaf",
      "🍃": "leaf",
      "🍀": "leaf",
      "🐢": "leaf",
      "🐉": "dragon",
      "🌼": "flower",
      "🌸": "flower",
      "🌻": "flower",
      "✿": "flower",
      "🐝": "bee",
      "🐞": "ladybird",
      "📒": "book",
      "🗺️": "map",
      "🦋": "butterfly",
      "🎁": "gift",
      "🏪": "shop",
      "🎡": "wheel",
      "🎨": "palette",
      "✏️": "palette",
      "🎲": "palette",
      "⚡": "bolt",
      "🧲": "magnet",
      "🔭": "vision",
      "👟": "speed",
      "🍎": "apple",
      "🍑": "peach",
      "🧺": "basket",
      "🍓": "strawberry",
      "🍉": "melon",
      "🍊": "orange",
      "🍇": "grapes",
      "🫐": "berry",
      "🍒": "cherry",
      "👑": "crown",
      "🎀": "bow",
      "🧢": "cap",
      "☁️": "cloud",
      "🫧": "cloud",
      "🌈": "rainbow",
      "🍬": "rainbow",
      "🧜‍♀️": "mermaid",
      "😊": "face",
      "😉": "face",
      "🥹": "face",
      "😌": "face",
      "🤩": "face",
      "😎": "face",
      "🙂": "face",
      "😁": "face",
      "😮": "face",
      "😛": "face",
      "👀": "eyes",
      "🏳️": "flag",
      "🚀": "rocket",
      "🍭": "candy",
      "🏳": "flag",
      "☁": "cloud",
      "☀": "sun",
    },
    names = [
      "star",
      "heart",
      "leaf",
      "flower",
      "book",
      "map",
      "coin",
      "gift",
      "shop",
      "wheel",
      "palette",
      "bolt",
      "magnet",
      "vision",
      "speed",
      "apple",
      "strawberry",
      "orange",
      "grapes",
      "cherry",
      "crown",
      "bow",
      "cap",
      "cloud",
      "rainbow",
      "face",
      "eyes",
      "flag",
      "rocket",
      "pointer",
      "berry",
      "melon",
      "peach",
      "sun",
      "butterfly",
      "bee",
      "ladybird",
      "basket",
      "mermaid",
      "dragon",
      "candy",
    ],
    images = {};
  const ready = Promise.all(
    names.map(
      (name) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = "icons/" + name + ".svg";
          images[name] = img;
        }),
    ),
  );
  function draw(ctx, name, x, y, size = 32) {
    const img = images[map[name] || name];
    if (img?.complete && img.naturalWidth)
      ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
  }
  const tokens = Object.keys(map).sort((a, b) => b.length - a.length),
    pattern = new RegExp(tokens.join("|"), "gu");
  function enhance(root) {
    if (root.nodeType === 1 && root.hasAttribute("data-native-emoji")) return;
    if (
      root.nodeType === 3 &&
      root.parentElement?.closest("[data-native-emoji]")
    )
      return;
    if (root.nodeType === 3) {
      const text = root.nodeValue;
      if (!text || !tokens.some((t) => text.includes(t))) return;
      const parent = root.parentElement;
      if (
        !parent ||
        parent.closest("script,style,textarea,code,pre,svg,option")
      )
        return;
      const fragment = document.createDocumentFragment();
      let last = 0;
      for (const match of text.matchAll(pattern)) {
        fragment.append(text.slice(last, match.index));
        const img = document.createElement("img");
        img.src = "icons/" + map[match[0]] + ".svg";
        img.alt = "";
        img.setAttribute("aria-hidden", "true");
        img.className = "game-icon";
        img.draggable = false;
        fragment.append(img);
        last = match.index + match[0].length;
      }
      fragment.append(text.slice(last));
      root.replaceWith(fragment);
      return;
    }
    if (root.nodeType === 1 && !root.matches("script,style,svg,img"))
      for (const child of [...root.childNodes]) enhance(child);
  }
  window.GardenIcons = { draw, ready, map, enhance };
  function start() {
    enhance(document.body);
    new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "characterData") enhance(r.target);
        else for (const n of r.addedNodes) enhance(n);
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
