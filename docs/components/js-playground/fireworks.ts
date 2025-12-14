// components/js-playground/fireworks.ts
export function launchFireworks({
  x = window.innerWidth / 2,
  y = window.innerHeight * 0.35,
  bursts = 3,
  durationMs = 1600,
}: {
  x?: number;
  y?: number;
  bursts?: number;
  durationMs?: number;
} = {}) {
  const canvas = document.createElement("canvas");
  const ctx:any = canvas.getContext("2d");
  if (!ctx) return;

  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 999999;
  `;
  document.body.appendChild(canvas);

  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  const gravity = 900; // px/s^2
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    color: string;
    life: number;
    age: number;
  }> = [];

  const start = performance.now();
  let last = start;

  function rand(a: number, b: number) {
    return a + Math.random() * (b - a);
  }
  function pick<T>(arr: T[]) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function burst(bx: number, by: number) {
    const count = Math.floor(rand(70, 120));
    const palette = [
      "#ff3b30",
      "#ff9500",
      "#ffcc00",
      "#34c759",
      "#00c7be",
      "#007aff",
      "#af52de",
      "#ff2d55",
      "#ffffff",
    ];
    for (let i = 0; i < count; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(180, 620);
      const life = rand(0.9, 1.5);
      particles.push({
        x: bx,
        y: by,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: rand(1.2, 2.6),
        color: pick(palette),
        life,
        age: 0,
      });
    }
  }

  // 多段爆炸
  const timers: number[] = [];
  for (let i = 0; i < bursts; i++) {
    const delay = i * 220;
    const t = window.setTimeout(
      () => burst(x + rand(-120, 120), y + rand(-80, 80)),
      delay
    );
    timers.push(t);
  }

  function draw(now: number) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 轻微拖影
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      if (p.age >= p.life) {
        particles.splice(i, 1);
        continue;
      }
      p.vy += gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      const alpha = Math.max(0, 1 - p.age / p.life);
      ctx.globalAlpha = alpha;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (now - start < durationMs && particles.length > 0) {
      requestAnimationFrame(draw);
    } else {
      cleanup();
    }
  }

  function cleanup() {
    window.removeEventListener("resize", onResize);
    for (const t of timers) window.clearTimeout(t);
    canvas.remove();
  }

  requestAnimationFrame(draw);

  // 兜底销毁
  window.setTimeout(cleanup, durationMs + 300);
}
