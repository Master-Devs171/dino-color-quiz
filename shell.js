(() => {
  const APP_VERSION = "5.81";
  let registration = null;
  let reloading = false;
  window.DINOPLAY_VERSION = APP_VERSION;
  window.openGame = () => {};
  window.celebrate = () => {
    const box = document.querySelector("#celebration");
    if (!box) return;
    const words = ["Fantástico!", "Muito bem!", "Boa!", "Conseguiste!"];
    box.textContent = words[Math.floor(Math.random() * words.length)];
    box.classList.add("show");
    setTimeout(() => box.classList.remove("show"), 900);
  };
  const status = (message, type = "") => {
    const element = document.querySelector("#updateStatus");
    if (!element) return;
    element.textContent = message;
    element.className = `update-status ${type}`;
  };
  const activate = () => registration?.waiting?.postMessage("SKIP_WAITING");
  async function setupUpdates() {
    if (window.Capacitor?.isNativePlatform?.()) return;
    if (!("serviceWorker" in navigator)) return;
    registration = await navigator.serviceWorker.register(
      `./sw.js?v=${encodeURIComponent(APP_VERSION)}`,
      { updateViaCache: "none" },
    );
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!reloading) { reloading = true; location.reload(); }
    });
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      status("🦕 Nova versão encontrada. A instalar…");
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed") activate();
      });
    });
    activate();
  }
  async function checkUpdates() {
    status("🔎 A procurar atualizações…");
    try {
      await window.DinoPlayRefreshCatalog?.(true);
      await setupUpdates();
      await registration?.update();
      activate();
      setTimeout(() => status(`DinoPlay v${APP_VERSION}`, "good"), 900);
    } catch {
      status("Não foi possível atualizar agora.", "bad");
    }
  }
  addEventListener("load", () => setupUpdates().catch(() => {}));
  document.querySelector("#updateBtn")?.addEventListener("click", checkUpdates);
  document.querySelector("#updateStatus")?.addEventListener("click", checkUpdates);
})();
