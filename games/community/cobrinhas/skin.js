/* Shared wardrobe/arena renderer. Flags are drawn locally, including on Windows. */
(function (root) {
  "use strict";
  const options = {
    pattern: ["plain", "stripes", "dots", "rainbow", "flag"],
    eyes: ["classic", "big", "happy", "sleepy", "wink", "stars", "glasses"],
    mouth: ["smile", "grin", "tiny", "tongue", "none"],
    cheeks: ["blush", "freckles", "none"],
    hat: ["none", "flower", "crown", "bow", "cap"],
    trail: ["none", "stars", "hearts", "bubbles"],
    flag: [
      "none",
      "pt",
      "br",
      "gb",
      "fr",
      "de",
      "es",
      "pl",
      "it",
      "ua",
      "us",
      "rainbow",
      "custom",
    ],
    flagStyle: ["horizontal", "vertical", "cross"],
  };
  const defaults = {
    color: "#78c85d",
    secondary: "#ffe2a4",
    headColor: "#78c85d",
    eyeColor: "#344d40",
    cheekColor: "#efa6a3",
    flagColorA: "#b591ee",
    flagColorB: "#ffe2a4",
    pattern: "stripes",
    eyes: "classic",
    mouth: "smile",
    cheeks: "blush",
    hat: "none",
    trail: "stars",
    flag: "none",
    flagStyle: "horizontal",
    texture: "round",
  };
  const colorKeys = [
    "color",
    "secondary",
    "headColor",
    "eyeColor",
    "cheekColor",
    "flagColorA",
    "flagColorB",
  ];
  function sanitize(value) {
    const out = { ...defaults };
    if (!value || typeof value !== "object") return out;
    for (const key of colorKeys)
      if (/^#[0-9a-f]{6}$/i.test(value[key])) out[key] = value[key];
    if (!/^#[0-9a-f]{6}$/i.test(value.headColor)) out.headColor = out.color;
    for (const key of Object.keys(options))
      if (options[key].includes(value[key])) out[key] = value[key];
    if (
      ["round", "carrot", "chocolate", "corn", "kitten", "ice"].includes(
        value.texture,
      )
    )
      out.texture = value.texture;
    return out;
  }
  const rainbow = [
    "#f1a4a4",
    "#efc36c",
    "#b4cd7c",
    "#81c8be",
    "#93b8df",
    "#c1a0dc",
  ];
  const countryColors = {
    pt: ["#23894d", "#e44949"],
    br: ["#299754", "#f6d957", "#467cc2"],
    gb: ["#4567aa", "#faf6eb", "#da6269"],
    fr: ["#5286c1", "#fffdf2", "#e4777b"],
    de: ["#454343", "#dc6060", "#efc65b"],
    es: ["#db6266", "#f6d260", "#db6266"],
    pl: ["#fffdf4", "#e27d8b"],
    it: ["#65a67e", "#fffdf4", "#e88181"],
    ua: ["#73a5db", "#f7d96d"],
    us: ["#e57979", "#fff9ed", "#7891c2"],
    rainbow,
  };
  function bands(ctx, colors, w, h, vertical = false) {
    colors.forEach((c, i) => {
      ctx.fillStyle = c;
      if (vertical)
        ctx.fillRect((i * w) / colors.length, 0, w / colors.length + 0.3, h);
      else ctx.fillRect(0, (i * h) / colors.length, w, h / colors.length + 0.3);
    });
  }
  function star(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5,
        d = i % 2 ? r * 0.43 : r;
      const px = x + Math.cos(a) * d,
        py = y + Math.sin(a) * d;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
  function flag(ctx, a, time, reduced) {
    ctx.save();
    ctx.translate(18, -38);
    ctx.strokeStyle = "#8b9e76";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(0, -3);
    ctx.stroke();
    ctx.save();
    if (!reduced) ctx.transform(1, Math.sin(time * 4) * 0.035, 0, 1, 0, 0);
    const w = 29,
      h = 19,
      code = a.flag;
    if (code === "custom") {
      bands(
        ctx,
        [a.flagColorA, a.flagColorB],
        w,
        h,
        a.flagStyle === "vertical",
      );
      if (a.flagStyle === "cross") {
        ctx.fillStyle = a.flagColorA;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = a.flagColorB;
        ctx.fillRect(8, 0, 5, h);
        ctx.fillRect(0, 7, w, 5);
      }
    } else if (code === "pt") {
      ctx.fillStyle = "#23894d";
      ctx.fillRect(0, 0, w * 0.4, h);
      ctx.fillStyle = "#e44949";
      ctx.fillRect(w * 0.4, 0, w * 0.6, h);
      ctx.fillStyle = "#f5d36b";
      ctx.beginPath();
      ctx.arc(w * 0.4, h / 2, 4, 0, 7);
      ctx.fill();
      ctx.fillStyle = "#faf7e6";
      ctx.fillRect(w * 0.4 - 1.5, h / 2 - 2, 3, 4);
    } else if (code === "br") {
      ctx.fillStyle = "#299754";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#f6d957";
      ctx.beginPath();
      ctx.moveTo(3, h / 2);
      ctx.lineTo(w / 2, 2);
      ctx.lineTo(w - 3, h / 2);
      ctx.lineTo(w / 2, h - 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#467cc2";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 4, 0, 7);
      ctx.fill();
      ctx.strokeStyle = "#fffdf2";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(11, 8);
      ctx.lineTo(18, 11);
      ctx.stroke();
    } else if (code === "gb") {
      ctx.fillStyle = "#4567aa";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#faf6eb";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, h);
      ctx.moveTo(w, 0);
      ctx.lineTo(0, h);
      ctx.stroke();
      ctx.strokeStyle = "#da6269";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#faf6eb";
      ctx.fillRect(w / 2 - 4, 0, 8, h);
      ctx.fillRect(0, h / 2 - 4, w, 8);
      ctx.fillStyle = "#da6269";
      ctx.fillRect(w / 2 - 2, 0, 4, h);
      ctx.fillRect(0, h / 2 - 2, w, 4);
    } else if (code === "us") {
      bands(
        ctx,
        Array.from({ length: 13 }, (_, i) => (i % 2 ? "#fff9ed" : "#dc7378")),
        w,
        h,
      );
      ctx.fillStyle = "#6485ba";
      ctx.fillRect(0, 0, 13, 11);
      for (let i = 0; i < 9; i++)
        star(ctx, 2 + (i % 3) * 4, 2 + Math.floor(i / 3) * 3.5, 1, "#fff9ed");
    } else
      bands(
        ctx,
        countryColors[code] || rainbow,
        w,
        h,
        ["fr", "it"].includes(code),
      );
    ctx.strokeStyle = "#ffffffaa";
    ctx.lineWidth = 0.8;
    ctx.strokeRect(0, 0, w, h);
    ctx.restore();
    ctx.restore();
  }
  const segmentCache = new Map();
  function segment(color, spot, r, texture = "round") {
    const key = color + "|" + spot + "|" + r.toFixed(2) + "|" + texture;
    if (segmentCache.has(key)) return segmentCache.get(key);
    const tile = root.document.createElement("canvas");
    tile.width = tile.height = 80;
    const c = tile.getContext("2d");
    c.scale(2, 2);
    c.translate(20, 18);
    c.fillStyle = "#63854b18";
    c.beginPath();
    c.arc(1, 4, r, 0, 7);
    c.fill();
    const shading = c.createRadialGradient?.(-r * 0.35, -r * 0.4, 1, 0, 0, r);
    if (shading?.addColorStop) {
      shading.addColorStop(0, color);
      shading.addColorStop(0.6, color);
      shading.addColorStop(
        1,
        "#" +
          [1, 3, 5]
            .map((i) =>
              Math.round(parseInt(color.slice(i, i + 2), 16) * 0.6)
                .toString(16)
                .padStart(2, "0"),
            )
            .join(""),
      );
    }
    c.fillStyle = shading?.addColorStop ? shading : color;
    c.beginPath();
    c.arc(0, 0, r, 0, 7);
    c.fill();
    if (texture === "chocolate") {
      c.fillStyle = color;
      c.beginPath();
      c.roundRect(-r, -r, r * 2, r * 2, 4);
      c.fill();
      c.strokeStyle = "#603725";
      c.lineWidth = 2;
      c.stroke();
      c.fillStyle = "#ffffff25";
      c.fillRect(-r + 4, -r + 4, r * 1.5, 4);
    }
    if (texture === "corn") {
      c.fillStyle = "#ffe24d";
      c.strokeStyle = "#d59b12";
      c.lineWidth = 1;
      for (let x = -1; x <= 1; x++)
        for (let y = -1; y <= 1; y++) {
          c.beginPath();
          c.roundRect(x * 9 - 4, y * 9 - 4, 8, 8, 3);
          c.fill();
          c.stroke();
        }
    }
    if (texture === "carrot") {
      c.strokeStyle = "#bf6b2399";
      c.lineWidth = 1.5;
      for (let y = -8; y <= 8; y += 8) {
        c.beginPath();
        c.moveTo(-8, y);
        c.lineTo(5, y + 1);
        c.stroke();
      }
    }
    if (texture === "ice") {
      c.strokeStyle = "#ffffffbb";
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(-8, -8);
      c.lineTo(8, 8);
      c.moveTo(8, -8);
      c.lineTo(-8, 8);
      c.stroke();
    }
    if (spot) {
      c.fillStyle = spot;
      c.beginPath();
      c.arc(-3, -2, r * 0.4, 0, 7);
      c.fill();
    }
    c.fillStyle = "#ffffff26";
    c.beginPath();
    c.ellipse(-3, -4, r * 0.5, r * 0.27, -0.4, 0, 7);
    c.fill();
    if (segmentCache.size >= 256) segmentCache.clear();
    segmentCache.set(key, tile);
    return tile;
  }
  function draw(ctx, s, appearance, time = 0, reduced = false, view = null) {
    const a = sanitize(appearance),
      body = s.body;
    if (!body.length) return;
    const head = body[0];
    const growth =
      s.score === undefined ? 1 : (root.Cobrinhas?.sizeForScore(s.score) ?? 1);
    for (let i = body.length - 1; i >= 0; i -= 3) {
      const p = body[i],
        r = 16 * Math.min(1, 0.9 + (body.length - i) / 28);
      if (
        view &&
        (p.x < view.left ||
          p.x > view.right ||
          p.y < view.top ||
          p.y > view.bottom)
      )
        continue;
      const flagColors =
        a.flag === "custom"
          ? [a.flagColorA, a.flagColorB]
          : countryColors[a.flag] || [a.color, a.secondary];
      const color =
        a.pattern === "flag"
          ? flagColors[Math.floor(i / 5) % flagColors.length]
          : a.pattern === "rainbow"
            ? rainbow[Math.floor(i / 4) % rainbow.length]
            : a.pattern === "stripes" && Math.floor(i / 4) % 2
              ? a.secondary
              : a.color;
      ctx.drawImage(
        segment(
          color,
          a.pattern === "dots" && i % 4 === 0 ? a.secondary : "",
          r,
          a.texture,
        ),
        p.x - 20 * growth,
        p.y - 18 * growth,
        40 * growth,
        40 * growth,
      );
    }
    ctx.save();
    ctx.translate(head.x, head.y);
    ctx.rotate(s.angle);
    const chomp =
      !reduced && s.chomp > 0 ? 1 + Math.sin(s.chomp * 14) * 0.08 : 1;
    ctx.scale(chomp * growth, chomp * growth);
    ctx.fillStyle = a.headColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 17, 16, 0, 0, 7);
    ctx.fill();
    if (a.texture === "kitten") {
      ctx.fillStyle = a.headColor;
      for (const y of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(-9, y * 10);
        ctx.lineTo(-13, y * 24);
        ctx.lineTo(4, y * 14);
        ctx.closePath();
        ctx.fill();
      }
    }
    const blink = !reduced && Math.sin(time * 1.3 + s.id) > 0.995;
    for (const y of [-7, 7]) {
      if (a.eyes === "happy" || blink || (a.eyes === "wink" && y < 0)) {
        ctx.strokeStyle = a.eyeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(6, y, 4, Math.PI, Math.PI * 2);
        ctx.stroke();
      } else if (a.eyes === "glasses") {
        ctx.fillStyle = "#546b7290";
        ctx.beginPath();
        ctx.roundRect(2, y - 5, 10, 9, 2);
        ctx.fill();
        ctx.strokeStyle = a.eyeColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "#ffffff80";
        ctx.fillRect(4, y - 3, 2, 3);
      } else {
        const big = a.eyes === "big";
        ctx.fillStyle = "#fffef7";
        ctx.beginPath();
        ctx.ellipse(
          6,
          y,
          big ? 8 : 7,
          a.eyes === "sleepy" ? 3 : big ? 7 : 6,
          0,
          0,
          7,
        );
        ctx.fill();
        if (a.eyes === "stars") star(ctx, 8, y, 4, a.eyeColor);
        else {
          ctx.fillStyle = a.eyeColor;
          ctx.beginPath();
          ctx.arc(8, y, a.eyes === "sleepy" ? 2 : big ? 4 : 3, 0, 7);
          ctx.fill();
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(9, y - 1, 1, 0, 7);
          ctx.fill();
        }
      }
    }
    if (a.eyes === "glasses") {
      ctx.strokeStyle = a.eyeColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(7, -2);
      ctx.lineTo(7, 2);
      ctx.stroke();
    }
    if (a.cheeks === "blush") {
      ctx.fillStyle = a.cheekColor;
      ctx.globalAlpha *= 0.65;
      for (const y of [-12, 12]) {
        ctx.beginPath();
        ctx.ellipse(-1, y, 4, 2.5, 0, 0, 7);
        ctx.fill();
      }
      ctx.globalAlpha /= 0.65;
    }
    if (a.cheeks === "freckles") {
      ctx.fillStyle = a.cheekColor;
      for (const y of [-11, 11])
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(-4 + i * 3, y + (i % 2), 0.9, 0, 7);
          ctx.fill();
        }
    }
    ctx.strokeStyle = a.eyeColor;
    ctx.lineWidth = 1.5;
    if (a.mouth === "smile") {
      ctx.beginPath();
      ctx.arc(9, 0, 3, -0.9, 0.9);
      ctx.stroke();
    }
    if (a.mouth === "tiny") {
      ctx.fillStyle = a.eyeColor;
      ctx.beginPath();
      ctx.ellipse(11, 0, 1.5, 2, 0, 0, 7);
      ctx.fill();
    }
    if (a.mouth === "grin") {
      ctx.fillStyle = "#fffdf0";
      ctx.beginPath();
      ctx.ellipse(11, 0, 3, 4, 0, 0, 7);
      ctx.fill();
      ctx.stroke();
    }
    if (a.mouth === "tongue") {
      ctx.beginPath();
      ctx.moveTo(12, -2);
      ctx.lineTo(12, 2);
      ctx.stroke();
      ctx.fillStyle = a.cheekColor;
      ctx.beginPath();
      ctx.ellipse(15, 0, 4, 1.7, 0, 0, 7);
      ctx.fill();
    }
    ctx.restore();
    if (a.hat !== "none") {
      ctx.save();
      ctx.translate(head.x, head.y - 19 * growth);
      ctx.scale(growth, growth);
      ctx.rotate(reduced ? 0 : Math.sin(time * 3) * 0.07);
      ctx.font = "23px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      root.GardenIcons?.draw(ctx, a.hat, 0, 0, 30);
      ctx.restore();
    }
    if (a.flag !== "none") {
      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.scale(growth, growth);
      flag(ctx, a, time, reduced);
      ctx.restore();
    }
  }
  root.SnakeStyle = { defaults, options, colorKeys, sanitize, draw };
  if (typeof module !== "undefined") module.exports = root.SnakeStyle;
})(typeof window === "undefined" ? globalThis : window);
