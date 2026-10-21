(() => {
  const canvas = document.getElementById("lobby-snake"),
    ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let last = 0;
  function frame(ms) {
    requestAnimationFrame(frame);
    if (
      document.hidden ||
      document.body.dataset.menu === "playing" ||
      ms - last < 40
    )
      return;
    last = ms;
    ctx.clearRect(0, 0, 640, 220);
    const t = reduced.matches ? 0 : ms / 1000;
    ctx.fillStyle = "#2596bc30";
    ctx.beginPath();
    ctx.ellipse(320, 170, 225, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    const body = Array.from({ length: 65 }, (_, i) => ({
      x: 535 - i * 6.8,
      y: 112 + Math.sin(i * 0.075 + t * 1.5) * 27,
    }));
    ctx.save();
    ctx.scale(1.3, 1.3);
    ctx.translate(-75, -18);
    SnakeStyle.draw(
      ctx,
      { id: 0, score: 100, angle: Math.cos(t * 1.5) * 0.1, body },
      GardenBridge.getAppearance(),
      t,
      reduced.matches,
    );
    ctx.restore();
  }
  requestAnimationFrame(frame);
})();
