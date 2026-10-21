(() => {
  "use strict";
  const panel = document.getElementById("game-options"),
    status = document.getElementById("options-status");
  let settings = { theme: "blue", pace: "calm" },
    active = false,
    revision = 0;
  function apply() {
    GardenBridge.setOptions(settings);
    for (const key of ["theme", "pace"])
      for (const button of panel.querySelectorAll("[data-" + key + "]"))
        button.setAttribute(
          "aria-pressed",
          String(button.dataset[key] === settings[key]),
        );
  }
  async function save() {
    revision++;
    apply();
    status.textContent = "";
    try {
      await GardenBridge.set("settings", settings);
    } catch {
      status.textContent = "As opções ficam ativas nesta sessão.";
    }
  }
  function open(view) {
    active = GardenBridge.pauseForPanel();
    document.getElementById("pace-options").hidden = view !== "settings";
    document.getElementById("background-options").hidden =
      view !== "background";
    panel.showModal();
  }
  function close() {
    panel.close();
    GardenBridge.closePanel(active);
    active = false;
  }
  document.getElementById("open-settings").onclick = () => open("settings");
  document.getElementById("open-background").onclick = () => open("background");
  document.getElementById("options-close").onclick = close;
  panel.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  for (const key of ["theme", "pace"])
    for (const button of panel.querySelectorAll("[data-" + key + "]"))
      button.onclick = () => {
        settings = { ...settings, [key]: button.dataset[key] };
        save();
      };
  (async () => {
    await GardenBridge.ready;
    const initial = revision;
    try {
      const saved = await GardenBridge.get("settings");
      if (initial === revision && saved) {
        settings = {
          theme: ["blue", "sea", "garden"].includes(saved.theme)
            ? saved.theme
            : "blue",
          pace: saved.pace === "lively" ? "lively" : "calm",
        };
        apply();
      }
    } catch {}
  })();
})();
