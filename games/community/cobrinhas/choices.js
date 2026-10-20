/* Visual option cards enhance the native selects; the selects remain as a fallback. */
(() => {
  "use strict";
  const groups = {
    flag: {
      title: "Bandeiras",
      icons: {
        none: "🍃",
        pt: "",
        br: "",
        gb: "",
        fr: "",
        de: "",
        es: "",
        pl: "",
        it: "",
        ua: "",
        us: "",
        rainbow: "🌈",
        custom: "🎨",
      },
    },
    pattern: {
      title: "Padrão do corpo",
      icons: {
        plain: "🍃",
        stripes: "🍬",
        dots: "🫧",
        rainbow: "🌈",
        flag: "🏳",
      },
    },
    eyes: {
      title: "Olhinhos",
      icons: {
        classic: "👀",
        big: "🥹",
        happy: "😊",
        sleepy: "😌",
        wink: "😉",
        stars: "🤩",
        glasses: "😎",
      },
    },
    mouth: {
      title: "Boquinha",
      icons: { smile: "🙂", grin: "😁", tiny: "😮", tongue: "😛", none: "🍃" },
    },
    cheeks: {
      title: "Bochechas",
      icons: { blush: "🌸", freckles: "✨", none: "🍃" },
    },
    hat: {
      title: "Acessórios",
      icons: { none: "🌱", flower: "🌸", crown: "👑", bow: "🎀", cap: "🧢" },
    },
    trail: {
      title: "Rasto mágico",
      icons: { none: "🍃", stars: "✨", hearts: "💗", bubbles: "🫧" },
    },
  };
  function enhance(key, settings) {
    const select = document.getElementById("skin-" + key);
    if (!select) return;
    const label = select.closest("label"),
      group = document.createElement("fieldset");
    group.className = "visual-options";
    const legend = document.createElement("legend");
    legend.textContent = settings.title;
    group.appendChild(legend);
    const grid = document.createElement("div");
    grid.className = "choice-grid";
    group.appendChild(grid);
    for (const option of select.options) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-card";
      button.dataset.value = option.value;
      button.setAttribute(
        "aria-pressed",
        String(select.value === option.value),
      );
      const icon = document.createElement("span");
      icon.className = "choice-art";
      icon.textContent = settings.icons[option.value];
      if (
        key === "flag" &&
        !["none", "rainbow", "custom"].includes(option.value)
      ) {
        icon.classList.add("flag-art", "flag-" + option.value);
      }
      if (key === "pattern") {
        icon.classList.add("worm-art", "worm-" + option.value);
        icon.textContent = "";
      }
      const name = document.createElement("span");
      name.className = "choice-name";
      name.textContent =
        key === "flag"
          ? option.textContent
          : option.textContent.replace(/^\S+\s/, "");
      button.setAttribute("aria-label", name.textContent);
      button.append(icon, name);
      button.onclick = () => {
        select.value = option.value;
        select.dispatchEvent(new Event("input", { bubbles: true }));
        sync();
      };
      grid.appendChild(button);
    }
    function sync() {
      for (const b of grid.children)
        b.setAttribute(
          "aria-pressed",
          String(b.dataset.value === select.value),
        );
    }
    select.addEventListener("input", sync);
    document.getElementById("skin-random").addEventListener("click", sync);
    document.getElementById("skin-reset").addEventListener("click", sync);
    document.getElementById("customize").addEventListener("click", sync);
    document.getElementById("edit-snake").addEventListener("click", sync);
    label.hidden = true;
    label.insertAdjacentElement("afterend", group);
    return sync;
  }
  for (const [key, settings] of Object.entries(groups)) enhance(key, settings);
  // A handful of ready-made looks complement the fully editable color controls.
  const looks = [
    {
      name: "Verdinha",
      color: "#78c85d",
      secondary: "#ffe2a4",
      pattern: "stripes",
      hat: "flower",
    },
    {
      name: "Docinho",
      color: "#efa8bd",
      secondary: "#fff1cd",
      pattern: "dots",
      hat: "bow",
    },
    {
      name: "Oceano",
      color: "#70bbc8",
      secondary: "#bce7e3",
      pattern: "stripes",
      hat: "cap",
    },
    {
      name: "Arco-íris",
      color: "#b591ee",
      secondary: "#ffe2a4",
      pattern: "rainbow",
      hat: "crown",
    },
  ];
  const presets = document.createElement("div");
  presets.className = "skin-presets";
  presets.setAttribute("role", "group");
  presets.setAttribute("aria-label", "Skins prontas");
  for (const look of looks) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "preset-card";
    const snake = document.createElement("span");
    snake.className = "preset-snake";
    snake.style.setProperty("--skin", look.color);
    snake.style.setProperty("--stripe", look.secondary);
    if (look.pattern === "rainbow") snake.classList.add("preset-rainbow");
    const name = document.createElement("b");
    name.textContent = look.name;
    b.append(snake, name);
    b.onclick = () => {
      for (const [key, value] of Object.entries({
        ...look,
        headColor: look.color,
      })) {
        const input = document.getElementById("skin-" + key);
        if (input) {
          input.value = value;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    };
    presets.appendChild(b);
  }
  const body = document.getElementById("panel-body");
  body.insertBefore(presets, body.querySelector(".panel-fields"));
})();
