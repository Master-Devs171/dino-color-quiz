(() => {
  "use strict";
  const { Garden, WORLD, palette, POWERS, zoomForScore, sizeForScore } = Cobrinhas;
  const game = new Garden(),
    canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d");
  const $ = (id) => document.getElementById(id),
    overlay = $("overlay");
  let width = 0,
    height = 0,
    scale = 1,
    running = false,
    paused = false,
    heading = 0,
    best = 0,
    boost = false,
    last = 0,
    toastUntil = 0;
  let camera = { x: WORLD / 2, y: WORLD / 2 },
    selected = palette[0],
    gentle = true,
    hostReady = false,
    savedBest = 0;
  const colorNames = ["Verdinha", "Lilás", "Tangerina", "Gotinha", "Rosinha"];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sparkles = [];
  let sceneDirty = true,
    previewAt = -Infinity;
  const renderBodies = new Map();
  const tabNames = ["body", "face", "extras", "flag"];
  function selectTab(name, focus = false) {
    $("editor-scroll").scrollTop = 0;
    for (const id of tabNames) {
      const active = id === name;
      const tab = $("tab-" + id);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      $("panel-" + id).hidden = !active;
      if (active && focus) tab.focus();
    }
  }
  tabNames.forEach((name, i) => {
    $("tab-" + name).onclick = () => selectTab(name);
    $("tab-" + name).addEventListener("keydown", (e) => {
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
        e.preventDefault();
        const n =
          e.key === "Home"
            ? 0
            : e.key === "End"
              ? 3
              : (i + (e.key === "ArrowRight" ? 1 : 3)) % 4;
        selectTab(tabNames[n], true);
      }
    });
  });
  $("ranking-toggle").onclick = () => {
    const button = $("ranking-toggle");
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    $("scoreboard").dataset.expanded = String(open);
  };
  function uiMode(mode) {
    document.body.dataset.menu = mode;
    sceneDirty = true;
  }
  function interpolate(s) {
    let body = renderBodies.get(s.id);
    if (!body) {
      body = [];
      renderBodies.set(s.id, body);
    }
    body.length = s.body.length;
    const alpha = simulationClock * 60;
    const previous = s.previousBody || s.body;
    for (let i = 0; i < body.length; i++) {
      const p = s.body[i],
        old = previous[i] || p;
      body[i] ??= { x: 0, y: 0 };
      body[i].x = old.x + (p.x - old.x) * alpha;
      body[i].y = old.y + (p.y - old.y) * alpha;
    }
    return body;
  }
  let appearance = SnakeStyle.sanitize(),
    draft = { ...appearance },
    editorWasPlaying = false,
    trailClock = 0,
    simulationClock = 0;
  const wardrobe = $("wardrobe"),
    preview = $("skin-preview"),
    previewCtx = preview.getContext("2d");
  const styleKeys = [
    ...SnakeStyle.colorKeys,
    ...Object.keys(SnakeStyle.options),
  ];
  function syncEditor() {
    for (const key of styleKeys) $("skin-" + key).value = draft[key];
  }
  function syncColor() {
    sceneDirty = true;
    selected = appearance.color;
    game.player.color = selected;
    $("color-name").textContent =
      colorNames[palette.indexOf(selected)] || "A tua criação";
    $("colors")
      .querySelectorAll("button")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.color === selected)),
      );
  }
  function openEditor() {
    editorWasPlaying = running && !paused;
    if (editorWasPlaying) pause();
    draft = { ...appearance };
    selectTab("body");
    syncEditor();
    $("skin-save-status").textContent = hostReady
      ? "O teu visual fica guardado nesta app."
      : "Experimenta todas as combinações!";
    wardrobe.showModal();
  }
  function closeEditor() {
    wardrobe.close();
    if (editorWasPlaying && !document.hidden && paused) pause();
    editorWasPlaying = false;
  }
  $("customize").onclick = openEditor;
  $("edit-snake").onclick = openEditor;
  $("editor-close").onclick = closeEditor;
  wardrobe.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeEditor();
  });
  for (const key of styleKeys)
    $("skin-" + key).addEventListener("input", () => {
      if (key === "color" && draft.headColor === draft.color) {
        draft.headColor = $("skin-" + key).value;
        $("skin-headColor").value = draft.headColor;
      }
      draft = SnakeStyle.sanitize({ ...draft, [key]: $("skin-" + key).value });
    });
  $("skin-random").onclick = () => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    draft = SnakeStyle.sanitize({
      color: pick(palette),
      secondary: pick(["#ffe2a4", "#e8a6c7", "#a3dbdb", "#c4b5ec"]),
      headColor: pick(palette),
      eyeColor: pick(["#344d40", "#734a85", "#375e8e"]),
      cheekColor: pick(["#efa6a3", "#edb67c", "#dbb1d9"]),
      pattern: pick(SnakeStyle.options.pattern),
      eyes: pick(SnakeStyle.options.eyes),
      mouth: pick(SnakeStyle.options.mouth),
      cheeks: pick(SnakeStyle.options.cheeks),
      hat: pick(SnakeStyle.options.hat),
      trail: pick(SnakeStyle.options.trail),
      flag: pick(SnakeStyle.options.flag),
      flagStyle: pick(SnakeStyle.options.flagStyle),
      flagColorA: pick(palette),
      flagColorB: pick(palette),
    });
    syncEditor();
  };
  $("skin-reset").onclick = () => {
    draft = SnakeStyle.sanitize();
    syncEditor();
  };
  $("skin-save").onclick = () => {
    appearance = SnakeStyle.sanitize(draft);
    syncColor();
    window.GardenJournal?.record("outfit", appearance.pattern);
    if (hostReady)
      DinoPlay.storage
        .set("appearance", appearance)
        .catch(() =>
          notice(
            "O visual está aplicado, mas não foi possível guardá-lo.",
            performance.now(),
          ),
        );
    if (!hostReady)
      window.GardenSave?.set("appearance", appearance).catch(() => {});
    closeEditor();
  };
  function previewSkin(t) {
    const c = previewCtx;
    c.clearRect(0, 0, 600, 360);
    c.fillStyle = "#91edfa";
    c.fillRect(0, 0, 600, 360);
    c.strokeStyle = "#54c9e8";
    c.lineWidth = 2;
    for (let i = 0; i < 15; i++) {
      c.beginPath();
      c.arc((i * 89) % 600, (i * 67) % 360, 2, 0, 7);
      c.stroke();
    }
    const body = Array.from({ length: 48 }, (_, i) => ({
      x: 450 - i * 7,
      y: 188 + Math.sin(i * 0.11 + (reducedMotion ? 0 : t * 1.6)) * 30,
    }));
    const sample = { id: 0, angle: -0.15, body };
    c.save();
    c.translate(-37, -49);
    c.scale(1.25, 1.25);
    SnakeStyle.draw(c, sample, draft, t, reducedMotion);
    c.restore();
    c.font = "22px serif";
    c.textAlign = "center";
    c.fillText("🌼", 80, 290);
    c.fillText("🍓", 490, 95);
    if (draft.trail !== "none") {
      c.fillStyle = draft.secondary;
      c.font = "20px serif";
      for (let i = 0; i < 5; i++) {
        c.globalAlpha = 1 - i / 6;
        c.fillText(
          { stars: "✦", hearts: "♥", bubbles: "○" }[draft.trail],
          70 - i * 10,
          190 + Math.sin(i + (reducedMotion ? 0 : t)) * 12,
        );
      }
      c.globalAlpha = 1;
    }
  }
  const keys = new Set(),
    fruits = ["🍎", "🍓", "🍊", "🍇", "🍒"];
  async function connect() {
    if (window.parent === window) {
      try {
        const saved = await window.GardenSave?.get("best");
        if (Number.isFinite(saved) && saved > best) {
          best = saved;
          $("best").textContent = best;
        }
        const savedStyle = await window.GardenSave?.get("appearance");
        if (savedStyle) {
          appearance = SnakeStyle.sanitize(savedStyle);
          syncColor();
        }
      } catch {}
      return;
    }
    try {
      await DinoPlay.ready();
      hostReady = true;
      const saved = await DinoPlay.storage.get("best");
      if (Number.isFinite(saved) && saved > best) {
        best = saved;
        savedBest = saved;
        $("best").textContent = best;
      }
      const savedStyle = await DinoPlay.storage.get("appearance");
      if (savedStyle) {
        appearance = SnakeStyle.sanitize(savedStyle);
        syncColor();
      }
    } catch {
      /* The game remains playable if the host is unavailable. */
    }
  }
  const connectionReady = connect();
  function resize() {
    sceneDirty = true;
    width = innerWidth;
    height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scale = Math.max(0.55, Math.min(1, Math.min(width, height) / 650));
  }
  addEventListener("resize", resize);
  resize();
  palette.forEach((color) => {
    const b = document.createElement("button");
    b.style.background = color;
    b.dataset.color = color;
    b.setAttribute("aria-label", colorNames[palette.indexOf(color)]);
    b.setAttribute("aria-pressed", String(color === selected));
    b.onclick = () => {
      selected = color;
      if (appearance.headColor === appearance.color)
        appearance.headColor = color;
      appearance.color = color;
      $("color-name").textContent = colorNames[palette.indexOf(color)];
      $("colors")
        .querySelectorAll("button")
        .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    };
    $("colors").appendChild(b);
  });
  $("play").onclick = () => {
    if (!running) {
      $("round-result").hidden = true;
      game.reset();
      scale = Math.max(0.42, Math.min(0.95, Math.min(width, height) / 650)) * zoomForScore(0);
      window.GardenJournal?.record("rounds", 1);
      heading = 0;
      running = true;
      simulationClock = 0;
      renderBodies.clear();
    }
    game.player.color = selected;
    if (hostReady)
      DinoPlay.storage.set("appearance", appearance).catch(() => {});
    gentle = $("gentle").checked;
    paused = false;
    $("play").blur();
    overlay.hidden = true;
    uiMode("playing");
    canvas.focus({ preventScroll: true });
    $("pause").textContent = "Ⅱ";
    $("pause").setAttribute("aria-label", "Pausar");
    last = performance.now();
  };
  function pause() {
    if (!running) return;
    paused = !paused;
    clearInput();
    overlay.hidden = !paused;
    uiMode(paused ? "paused" : "playing");
    $("play").querySelector("span").textContent = "Continuar a brincar";
    $("pause").textContent = paused ? "▶" : "Ⅱ";
    $("pause").setAttribute("aria-label", paused ? "Continuar" : "Pausar");
    if (!paused) canvas.focus({ preventScroll: true });
    last = performance.now();
  }
  $("pause").onclick = pause;
  function clearInput() {
    keys.clear();
    boost = false;
    stickPointer = null;
    fieldPointer = null;
    $("stick").style.transform = "";
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && running && !paused) pause();
  });
  addEventListener("blur", () => {
    if (running && !paused) pause();
  });
  addEventListener("keydown", (e) => {
    if (/^(Arrow|Key[WASD])/.test(e.code) || e.code === "Space") {
      if (
        e.target.matches("input,select") ||
        (e.code === "Space" && e.target.matches("button"))
      )
        return;
      e.preventDefault();
      keys.add(e.code);
    }
    if (
      e.code === "Escape" &&
      !e.repeat &&
      !wardrobe.open &&
      !$("adventures").open
    )
      pause();
  });
  addEventListener("keyup", (e) => keys.delete(e.code));
  let fieldPointer = null,
    stickPointer = null;
  function point(e) {
    const h = game.player.body[0];
    if (!h) return;
    heading = Math.atan2(
      e.clientY - (height / 2 + (h.y - camera.y) * scale),
      e.clientX - (width / 2 + (h.x - camera.x) * scale),
    );
  }
  canvas.onpointerdown = (e) => {
    fieldPointer = e.pointerId;
    canvas.setPointerCapture(e.pointerId);
    point(e);
  };
  canvas.onpointermove = (e) => {
    if (e.pointerType === "mouse" || fieldPointer === e.pointerId) point(e);
  };
  canvas.onpointerup = canvas.onpointercancel = () => {
    fieldPointer = null;
  };
  const joystick = $("joystick");
  function stick(e) {
    const r = joystick.getBoundingClientRect(),
      x = e.clientX - r.left - r.width / 2,
      y = e.clientY - r.top - r.height / 2,
      d = Math.hypot(x, y);
    if (d < 7) return;
    heading = Math.atan2(y, x);
    const f = Math.min(32, d) / d;
    $("stick").style.transform = `translate(${x * f}px,${y * f}px)`;
  }
  joystick.onpointerdown = (e) => {
    stickPointer = e.pointerId;
    joystick.setPointerCapture(e.pointerId);
    stick(e);
  };
  joystick.onpointermove = (e) => {
    if (stickPointer === e.pointerId) stick(e);
  };
  joystick.onpointerup = joystick.onpointercancel = () => {
    stickPointer = null;
    $("stick").style.transform = "";
  };
  $("boost").onpointerdown = (e) => {
    boost = true;
    $("boost").setPointerCapture(e.pointerId);
  };
  $("boost").onpointerup = $("boost").onpointercancel = () => {
    boost = false;
  };
  function notice(text, now) {
    $("notice").textContent = text;
    $("notice").style.opacity = 1;
    toastUntil = now + 2400;
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#168dd5";
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-camera.x, -camera.y);
    const left = Math.max(0, camera.x - width / scale / 2),
      top = Math.max(0, camera.y - height / scale / 2);
    for (
      let x = Math.floor(left / 160) * 160;
      x < Math.min(WORLD, camera.x + width / scale / 2);
      x += 160
    )
      for (
        let y = Math.floor(top / 160) * 160;
        y < Math.min(WORLD, camera.y + height / scale / 2);
        y += 160
      ) {
        const offset=Math.sin(x*.19+y*.13)*14;
        ctx.fillStyle='#106fba';ctx.beginPath();ctx.ellipse(x+78,y+80+offset,62,73,Math.sin(x+y)*.25,0,Math.PI*2);ctx.fill();
      }
    ctx.strokeStyle = "#ffca67";
    ctx.lineWidth = 18;
    ctx.setLineDash([4, 25]);
    ctx.lineCap = "round";
    ctx.strokeRect(0, 0, WORLD, WORLD);
    ctx.setLineDash([]);
    ctx.font = "46px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const f of game.food) {
      if (
        Math.abs(f.x - camera.x) > width / scale / 2 + 30 ||
        Math.abs(f.y - camera.y) > height / scale / 2 + 30
      )
        continue;
      ctx.fillStyle = "#26044355";
      ctx.beginPath();
      ctx.ellipse(f.x, f.y + 20, 18, 5, 0, 0, 7);
      ctx.fill();
      if (f.kind === 5) {
        ctx.fillStyle = "#f9d87530";
        ctx.beginPath();
        ctx.arc(f.x, f.y, 17, 0, 7);
        ctx.fill();
        ctx.fillStyle = "#efc365";
        ctx.beginPath();
        ctx.arc(f.x, f.y, 10, 0, 7);
        ctx.fill();
        ctx.fillStyle = "#fff0b8";
        ctx.beginPath();
        ctx.arc(f.x - 2, f.y - 2, 6, 0, 7);
        ctx.fill();
        ctx.fillStyle = "#fff9df";
        ctx.beginPath();
        ctx.arc(f.x - 3, f.y - 4, 2, 0, 7);
        ctx.fill();
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
          fruits[f.kind],
          f.x,
          f.y + (reducedMotion ? 0 : Math.sin(game.time * 2 + f.x) * 2),
        );
      }
    }
    for(const item of game.powerups){
      if(item.cooldown>0 || Math.abs(item.x-camera.x)>width/scale/2+45 || Math.abs(item.y-camera.y)>height/scale/2+45)continue;
      const bob=reducedMotion?0:Math.sin(game.time*2+item.x)*4;
      ctx.fillStyle='#37dcf155';ctx.strokeStyle='#99faff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(item.x,item.y+bob,29,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#ffffffbb';ctx.beginPath();ctx.ellipse(item.x-10,item.y-16+bob,8,4,-.6,0,7);ctx.fill();ctx.font='30px serif';ctx.fillStyle='#fff';ctx.fillText(POWERS[item.kind].icon,item.x,item.y+bob+3);
    }
    const activeHead=game.player.body[0];
    if(activeHead && game.player.effects.magnet>0){ctx.strokeStyle='#72efff55';ctx.lineWidth=2;ctx.setLineDash([7,12]);ctx.beginPath();ctx.arc(activeHead.x,activeHead.y,185,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
    for (const s of [...game.snakes.slice(1), game.player]) {
      if (!s.body.length) continue;
      ctx.globalAlpha = s.grace > 0 ? 0.55 : 1;
      const h = s.body[0];
      // Draw only visible body portions; keep the full body in the simulation.
      const outfit =
        s.id === 0
          ? appearance
          : {
              color: s.color,
              secondary: palette[(s.id + 1) % palette.length],
              pattern: s.id % 3 === 0 ? "dots" : "stripes",
              hat: s.id % 5 === 0 ? "flower" : "none",
            };
      SnakeStyle.draw(
        ctx,
        {
          ...s,
          body: interpolate(s),
          angle:
            (s.previousAngle ?? s.angle) +
            Math.atan2(
              Math.sin(s.angle - (s.previousAngle ?? s.angle)),
              Math.cos(s.angle - (s.previousAngle ?? s.angle)),
            ) *
              simulationClock *
              60,
        },
        outfit,
        game.time,
        reducedMotion,
        {
          left: camera.x - width / scale / 2 - 55,
          right: camera.x + width / scale / 2 + 55,
          top: camera.y - height / scale / 2 - 55,
          bottom: camera.y + height / scale / 2 + 55,
        },
      );
      if (s.id === 0) {
        ctx.font = "bold 10px Trebuchet MS,system-ui";
        ctx.fillStyle = "#fffef0";
        ctx.beginPath();
        ctx.roundRect(h.x - 16, h.y - 24 - 22 * sizeForScore(s.score), 32, 17, 8);
        ctx.fill();
        ctx.fillStyle = "#53764a";
        ctx.fillText("TU", h.x, h.y - 15 - 22 * sizeForScore(s.score));
      }
      ctx.globalAlpha = 1;
    }
    for (const p of sparkles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.type === "hearts" || p.type === "stars") {
        ctx.font = 13 * p.life + 4 + "px serif";
        ctx.fillText(p.type === "hearts" ? "♥" : "✦", p.x, p.y);
      } else {
        ctx.arc(p.x, p.y, (p.type === "bubbles" ? 7 : 3) * p.life, 0, 7);
        if (p.type === "bubbles") {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    // A small map makes it easier to find food and the other snakes.
    const size = width < 700 ? 64 : 120,
      x = 18,
      y = width < 700 ? 88 : 20;
    ctx.fillStyle = "#200637bb";
    ctx.beginPath();
    ctx.roundRect(x - 8, y - 20, size + 16, size + 30, 16);
    ctx.fill();
    ctx.font = "bold 8px Trebuchet MS,system-ui";
    ctx.textAlign = "center";
    ctx.fillStyle = "#f1deff";
    ctx.fillText("O TEU JARDIM", x + size / 2, y - 9);
    ctx.fillStyle = "#321050";
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 9);
    ctx.fill();
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = ["#351052", "#3d125d", "#421368", "#391255"][i];
      ctx.fillRect(
        x + ((i % 2) * size) / 2,
        y + (Math.floor(i / 2) * size) / 2,
        size / 2,
        size / 2,
      );
    }
    ctx.strokeStyle = "#ffffffaa";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      x + ((camera.x - width / scale / 2) / WORLD) * size,
      y + ((camera.y - height / scale / 2) / WORLD) * size,
      (width / scale / WORLD) * size,
      (height / scale / WORLD) * size,
    );
    ctx.fillStyle='#e5d9f1';
    for(let i=0;i<game.food.length;i+=9){const f=game.food[i];ctx.beginPath();ctx.arc(x+f.x/WORLD*size,y+f.y/WORLD*size,1.3,0,7);ctx.fill();}
    for (const s of game.snakes)
      if (s.body.length) {
        ctx.fillStyle = s.id === 0 ? "#b5ff5c" : s.color;
        ctx.beginPath();
        ctx.arc(
          x + (s.body[0].x / WORLD) * size,
          y + (s.body[0].y / WORLD) * size,
          s.id === 0 ? 4 : 2,
          0,
          7,
        );
        ctx.fill();
      }
  }
  let hudAt = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) {
      last = now;
      return;
    }
    if (wardrobe.open && now - previewAt > 33) {
      previewSkin(now / 1000);
      previewAt = now;
    }
    const dt = Math.min(Math.max(0, (now - last) / 1000), 0.1);
    last = now;
    if (running && !paused) {
      let x =
          Number(keys.has("ArrowRight") || keys.has("KeyD")) -
          Number(keys.has("ArrowLeft") || keys.has("KeyA")),
        y =
          Number(keys.has("ArrowDown") || keys.has("KeyS")) -
          Number(keys.has("ArrowUp") || keys.has("KeyW"));
      if (x || y) heading = Math.atan2(y, x);
      simulationClock += dt;
      const events = [];
      while (simulationClock >= 1 / 60) {
        game.update(1 / 60, heading, boost || keys.has("Space"), gentle);
        events.push(...game.events);
        simulationClock -= 1 / 60;
      }
      game.events = events;
      const meals = events.filter((event) => event === "eat").length;
      if (meals) window.GardenJournal?.record("fruit", meals);
      game.player.chomp = Math.max(0, (game.player.chomp || 0) - dt);
      if (events.includes("eat")) game.player.chomp = 0.3;
      trailClock += dt;
      if (
        !reducedMotion &&
        appearance.trail !== "none" &&
        game.player.body.length &&
        trailClock > 0.11
      ) {
        trailClock = 0;
        const tail = game.player.body.at(-1);
        sparkles.push({
          x: tail.x,
          y: tail.y,
          vx: 0,
          vy: -12,
          life: 0.8,
          color: appearance.secondary,
          type: appearance.trail,
        });
      }
      if (events.includes("eat") && !reducedMotion) {
        $("score").animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.18)" },
            { transform: "scale(1)" },
          ],
          { duration: 230 },
        );
      }
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const p = sparkles[i];
        p.life -= dt * 1.8;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life <= 0) sparkles.splice(i, 1);
      }
      if (
        !reducedMotion &&
        game.events.includes("eat") &&
        game.player.body.length
      ) {
        const h = game.player.body[0];
        for (let i = 0; i < 7; i++) {
          const a = Math.random() * Math.PI * 2;
          sparkles.push({
            x: h.x,
            y: h.y,
            vx: Math.cos(a) * 40,
            vy: Math.sin(a) * 40 - 25,
            life: 1,
            color: ["#ecc665", "#e8aba7", "#9abf75"][i % 3],
          });
        }
      }
      for(const kind of Object.keys(POWERS)) if(game.events.includes('power:'+kind))notice(POWERS[kind].icon+' '+POWERS[kind].name+' · '+POWERS[kind].duration+' segundos!',now);
      if (game.events.includes("border")) {
        running = false;
        paused = false;
        clearInput();
        overlay.hidden = false;
        uiMode("end");
        $("round-result").hidden = false;
        $("round-result").textContent =
          "🌿 Tocaste na borda! A tua cobra foi eliminada. Fizeste " +
          game.player.score +
          " pontos. Vamos tentar outra vez?";
        $("play").querySelector("span").textContent = "Voltar a jogar!";
        $("play").focus({ preventScroll: true });
      } else if (game.events.includes("retry"))
        notice("Uma nova voltinha! Já vais voltar 🌱", now);
      else if (game.events.includes("drop"))
        notice("Uma cobrinha deixou pontinhos! ✨", now);
      if (!hostReady && window.GardenSave && game.player.score > best)
        window.GardenSave.set("best", game.player.score).catch(() => {});
      if (game.player.score > best) {
        best = game.player.score;
        $("best").textContent = best;
      }
      if (now > hudAt) {
        hudAt = now + 500;
        $('power-status').textContent=Object.entries(POWERS).filter(([kind])=>game.player.effects[kind]>0).map(([kind,info])=>info.icon+' '+info.name+' '+Math.ceil(game.player.effects[kind])+'s').join(' · ');
        const head = game.player.body[0];
        if (head)
          window.GardenJournal?.record(
            "region",
            (head.x > WORLD / 2 ? 1 : 0) + (head.y > WORLD / 2 ? 2 : 0),
          );
        if (head)
          $("region").textContent = [
            "🌼 Campo das Flores",
            "🌸 Jardim das Cerejeiras",
            "🍀 Clareira dos Trevos",
            "🌻 Vale dos Girassóis",
          ][(head.x > WORLD / 2 ? 1 : 0) + (head.y > WORLD / 2 ? 2 : 0)];
        $("score").textContent = game.player.score;
        $("ranking").replaceChildren();
        const leaders = [...game.snakes]
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
        if (!leaders.includes(game.player)) leaders[4] = game.player;
        leaders.forEach((s) => {
          const row = document.createElement("div");
          row.className = "rank-row" + (s.id === 0 ? " you" : "");
          const dot = document.createElement("span");
          dot.className = "rank-dot";
          dot.style.background = s.color;
          const name = document.createElement("b");
          name.textContent =
            s.id === 0 ? "Tu" : colorNames[s.id % palette.length] + " " + s.id;
          const points = document.createElement("strong");
          points.textContent = s.score;
          row.append(dot, name, points);
          $("ranking").appendChild(row);
        });
        if (hostReady && best > savedBest) {
          savedBest = best;
          DinoPlay.storage.set("best", best).catch(() => {
            savedBest = 0;
          });
        }
      }
    }
    if (!running || paused) {
      if (sceneDirty) {
        draw();
        sceneDirty = false;
      }
      return;
    }
    const targetScale =
      Math.max(0.42, Math.min(0.95, Math.min(width, height) / 650)) *
      zoomForScore(game.player.score) *
      (game.player.effects.vision>0 ? 0.84 : 1) *
      (boost || game.player.effects.speed>0 ? 0.91 : 1);
    scale += (targetScale - scale) * (1 - Math.exp(-dt * 3));
    const h = game.player.body[0];
    if (h) {
      const lead = running && !paused ? 40 : 0;
      camera.x +=
        (h.x + Math.cos(game.player.angle) * lead - camera.x) *
        (1 - Math.exp(-dt * 7));
      camera.y +=
        (h.y + Math.sin(game.player.angle) * lead - camera.y) *
        (1 - Math.exp(-dt * 7));
    }
    if (now > toastUntil) $("notice").style.opacity = 0;
    draw();
  }
  window.GardenBridge = {
    getAppearance: () => ({ ...appearance }),
    ready: connectionReady,
    async get(key) {
      if (hostReady) return DinoPlay.storage.get(key);
      if (window.GardenSave) return GardenSave.get(key);
      throw Error("Storage unavailable");
    },
    async set(key, value) {
      if (hostReady) return DinoPlay.storage.set(key, value);
      if (window.GardenSave) return GardenSave.set(key, value);
      throw Error("Storage unavailable");
    },
    pauseForPanel() {
      const active = running && !paused;
      if (active) pause();
      return active;
    },
    closePanel(active) {
      if (active && !document.hidden && paused) pause();
    },
    equip(style) {
      appearance = SnakeStyle.sanitize({ ...appearance, ...style });
      syncColor();
      if (hostReady)
        DinoPlay.storage.set("appearance", appearance).catch(() => {});
      else window.GardenSave?.set("appearance", appearance).catch(() => {});
    },
  };
  requestAnimationFrame(frame);
})();
