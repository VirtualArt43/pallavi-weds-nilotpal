/* ==========================================================================
   FX — canvas effects on one shared animation loop:
   falling petals (+ tap bursts and a fairy-dust trail) and the night sky
   (twinkling stars, rising sky lanterns, fireworks). Everything pauses when
   the tab is hidden or the effect is off-screen.
   ========================================================================== */
window.FX = (() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const TAU = Math.PI * 2;
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ---------------------------------------------------------- shared loop */
  const tasks = new Set();
  let raf = 0, last = 0;
  const frame = (t) => {
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
    last = t;
    tasks.forEach((fn) => fn(dt, t / 1000));
    raf = tasks.size ? requestAnimationFrame(frame) : 0;
    if (!raf) last = 0;
  };
  const add = (fn) => { tasks.add(fn); if (!raf && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } };
  const remove = (fn) => { tasks.delete(fn); };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0; }
    else if (tasks.size && !raf) raf = requestAnimationFrame(frame);
  });

  function fit(canvas, maxDpr = 2) {
    const r = canvas.getBoundingClientRect();
    const d = Math.min(window.devicePixelRatio || 1, maxDpr);
    canvas.width = Math.max(1, Math.round(r.width * d));
    canvas.height = Math.max(1, Math.round(r.height * d));
    const ctx = canvas.getContext('2d');
    ctx.setTransform(d, 0, 0, d, 0, 0);
    return { ctx, w: r.width, h: r.height, d };
  }

  const spriteCache = {};
  function glow([r, g, b], size = 64) {
    const key = `${r},${g},${b},${size}`;
    if (spriteCache[key]) return spriteCache[key];
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const x = c.getContext('2d');
    const gr = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gr.addColorStop(0, `rgba(${r},${g},${b},1)`);
    gr.addColorStop(0.35, `rgba(${r},${g},${b},.45)`);
    gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = gr;
    x.fillRect(0, 0, size, size);
    return (spriteCache[key] = c);
  }

  /* ---------------------------------------------------------------- PETALS */
  function Petals(canvas, { count = 30 } = {}) {
    let ctx, W = 0, H = 0, dpr = 1, on = false, grads = null;
    const drift = [], extra = [];
    const pal = [['#FFD166', '#F58A07'], ['#FFE08A', '#F4B400'], ['#FF9F1C', '#D9480F'], ['#FFC1C9', '#D9536F'], ['#FFB4A2', '#C2452F'], ['#FFF1B8', '#F5B301'], ['#FFCF70', '#EB7A0A']];
    const resize = () => {
      ({ ctx, w: W, h: H, d: dpr } = fit(canvas, 2));
      grads = pal.map(([a, b]) => { const g = ctx.createLinearGradient(0, -1, 0, 1); g.addColorStop(0, a); g.addColorStop(1, b); return g; });
    };
    const make = (initial) => ({
      x: Math.random() * W, y: initial ? Math.random() * H : rnd(-60, -20),
      s: rnd(5, 11), vy: rnd(22, 58), vx: rnd(-8, 8), rot: rnd(0, TAU), vr: rnd(-1.4, 1.4),
      sw: rnd(0, TAU), sws: rnd(0.6, 1.6), fl: rnd(0, TAU), fls: rnd(1.2, 2.8),
      c: (Math.random() * pal.length) | 0, a: rnd(0.55, 0.95), flower: Math.random() < 0.07,
    });
    function draw(p, alpha) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const sq = 0.3 + 0.7 * Math.abs(Math.sin(p.fl));
      ctx.globalAlpha = alpha;
      if (p.flower) {
        ctx.scale(p.s * 1.1, p.s * 1.1 * (0.55 + 0.45 * sq));
        ctx.fillStyle = '#EE8410'; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill();
        ctx.fillStyle = '#FFB938'; ctx.beginPath(); ctx.arc(0, 0, 0.66, 0, TAU); ctx.fill();
        ctx.fillStyle = '#FFD466'; ctx.beginPath(); ctx.arc(0, 0, 0.32, 0, TAU); ctx.fill();
      } else {
        ctx.scale(p.s, p.s * sq);
        ctx.fillStyle = grads[p.c];
        ctx.beginPath();
        ctx.moveTo(0, -1);
        ctx.quadraticCurveTo(0.95, -0.1, 0, 1);
        ctx.quadraticCurveTo(-0.95, -0.1, 0, -1);
        ctx.fill();
      }
      ctx.restore();
    }

    /* ---- the curtain shower: flowers pop out, then a gentle rain of petals ---- */
    // Each flower is painted once onto a small sprite, with a soft halo so it reads bright
    // on the dark page, and then stamped. That keeps a big shower cheap on phones.
    const blooms = [], later = [];
    let kinds = null, totalW = 0, rain = null, lastSY = window.scrollY;
    const SPR = 128;
    function sprite(paint, halo) {
      const t = document.createElement('canvas'), c = document.createElement('canvas');
      t.width = t.height = c.width = c.height = SPR;
      const tx = t.getContext('2d'), R = SPR * 0.34;
      tx.translate(SPR / 2, SPR / 2);
      paint(tx, R);
      // light from the top left, a little shade at the bottom right
      const g = tx.createRadialGradient(-R * 0.4, -R * 0.45, R * 0.05, 0, 0, R * 1.15);
      g.addColorStop(0, 'rgba(255,255,245,.42)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(80,10,0,.22)');
      tx.globalCompositeOperation = 'source-atop'; tx.fillStyle = g; tx.fillRect(-SPR / 2, -SPR / 2, SPR, SPR);
      const x = c.getContext('2d');
      x.shadowColor = halo; x.shadowBlur = SPR * 0.11;
      x.drawImage(t, 0, 0);
      return c;
    }
    // genda: a dense, ruffled pom-pom of small curled petals, ring by ring from the rim inwards
    const marigold = (base, light, deep, edge) => (x, R) => {
      x.fillStyle = base; x.beginPath(); x.arc(0, 0, R * 0.92, 0, TAU); x.fill();
      x.strokeStyle = edge; x.lineWidth = R * 0.03;
      for (let ring = 0; ring < 5; ring++) {
        const rr = R * (1 - ring * 0.19), n = 24 - ring * 4;
        for (let i = 0; i < n; i++) {
          const a = ((i + ring * 0.37) / n) * TAU + rnd(-0.08, 0.08), d = rr * 0.7;
          x.fillStyle = (i + ring) % 3 ? light : deep;
          x.beginPath(); x.ellipse(Math.cos(a) * d, Math.sin(a) * d, rr * 0.34, rr * 0.24, a, 0, TAU);
          x.fill(); x.stroke();
        }
      }
    };
    // gulab from above: five outer petals, five more between them, then the tight bud
    const rose = (edge, body, core, line) => (x, R) => {
      x.strokeStyle = line;
      const ring = (n, off, dist, rx, ry) => {
        const g = x.createRadialGradient(0, 0, 0, 0, 0, dist + rx);
        g.addColorStop(0, core); g.addColorStop(0.55, body); g.addColorStop(1, edge);
        x.fillStyle = g; x.lineWidth = R * 0.035;
        for (let i = 0; i < n; i++) {
          const a = off + (i / n) * TAU;
          x.beginPath(); x.ellipse(Math.cos(a) * dist, Math.sin(a) * dist, rx, ry, a, 0, TAU); x.fill(); x.stroke();
        }
      };
      ring(5, 0, R * 0.48, R * 0.5, R * 0.46);
      ring(5, TAU / 10, R * 0.3, R * 0.36, R * 0.32);
      ring(3, 0.5, R * 0.14, R * 0.2, R * 0.17);
      x.lineWidth = R * 0.05; x.beginPath();
      for (let t = 0.6; t < 2.6 * TAU; t += 0.15) { const r = R * 0.028 * t; x.lineTo(Math.cos(t) * r, Math.sin(t) * r); }
      x.stroke();
    };
    // mogra: two layers of rounded white petals round a small golden eye
    const jasmine = (x, R) => {
      x.strokeStyle = 'rgba(205,170,105,.45)'; x.lineWidth = R * 0.03;
      [[0, R * 0.98, R * 0.3], [TAU / 12, R * 0.66, R * 0.24]].forEach(([off, len, wid]) => {
        const g = x.createLinearGradient(0, 0, len, 0);
        g.addColorStop(0, '#FFF1BF'); g.addColorStop(0.4, '#FFFFFF'); g.addColorStop(1, '#FFFCF2');
        x.fillStyle = g;
        for (let i = 0; i < 6; i++) {
          x.save(); x.rotate(off + (i / 6) * TAU);
          x.beginPath(); x.moveTo(0, 0);
          x.bezierCurveTo(len * 0.3, -wid, len * 0.95, -wid * 0.9, len, 0);
          x.bezierCurveTo(len * 0.95, wid * 0.9, len * 0.3, wid, 0, 0);
          x.fill(); x.stroke(); x.restore();
        }
      });
      x.fillStyle = '#FFD54A'; x.beginPath(); x.arc(0, 0, R * 0.15, 0, TAU); x.fill();
      x.fillStyle = '#F2A300'; x.beginPath(); x.arc(0, 0, R * 0.07, 0, TAU); x.fill();
    };
    // one rose petal: a rounded oval with the faintest dip at the top, narrowing to the base
    const petal = (tip, base, sheen) => (x, R) => {
      const g = x.createLinearGradient(0, -R, 0, R);
      g.addColorStop(0, tip); g.addColorStop(1, base);
      x.fillStyle = g;
      x.beginPath(); x.moveTo(0, R);
      x.bezierCurveTo(R * 0.45, R * 0.8, R * 0.8, R * 0.3, R * 0.76, -R * 0.25);
      x.bezierCurveTo(R * 0.72, -R * 0.75, R * 0.35, -R * 0.98, 0, -R * 0.9);
      x.bezierCurveTo(-R * 0.35, -R * 0.98, -R * 0.72, -R * 0.75, -R * 0.76, -R * 0.25);
      x.bezierCurveTo(-R * 0.8, R * 0.3, -R * 0.45, R * 0.8, 0, R);
      x.fill();
      x.strokeStyle = sheen; x.lineWidth = R * 0.07; x.lineCap = 'round';
      x.beginPath(); x.moveTo(0, R * 0.78); x.quadraticCurveTo(R * 0.14, R * 0.05, -R * 0.02, -R * 0.5); x.stroke();
    };
    // one marigold petal: a wide little fan with a finely frilled edge and veins
    const frill = (tip, base) => (x, R) => {
      const g = x.createLinearGradient(0, R, 0, -R);
      g.addColorStop(0, base); g.addColorStop(1, tip);
      x.fillStyle = g;
      // sides from the base up to a frilled arc (centre 0, .35R; radius .95R; from 207° to 333°)
      const arc = (a, r) => [Math.cos(a) * r, R * 0.35 + Math.sin(a) * r];
      const [sx, sy] = arc(Math.PI * 1.15, R * 0.95);
      x.beginPath(); x.moveTo(0, R * 0.85);
      x.bezierCurveTo(-R * 0.35, R * 0.65, -R * 0.8, R * 0.35, sx, sy);
      for (let i = 0; i < 8; i++) {
        const a0 = Math.PI * (1.15 + (i / 8) * 0.7), a1 = Math.PI * (1.15 + ((i + 1) / 8) * 0.7);
        x.quadraticCurveTo(...arc((a0 + a1) / 2, R * 1.12), ...arc(a1, R * 0.95));
      }
      x.bezierCurveTo(R * 0.8, R * 0.35, R * 0.35, R * 0.65, 0, R * 0.85);
      x.fill();
      x.strokeStyle = 'rgba(190,80,0,.3)'; x.lineWidth = R * 0.035;
      for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(0, R * 0.75); x.lineTo(Math.sin(i * 0.3) * R * 0.75, R * 0.35 - Math.cos(i * 0.3) * R * 0.75); x.stroke(); }
    };
    function buildKinds() {
      kinds = [
        // s = drawn size of the sprite in CSS px (the flower fills about two thirds of it)
        { img: sprite(petal('#FF6B88', '#CF0F3A', 'rgba(255,220,228,.35)'), 'rgba(255,80,115,.7)'), w: 16, s: [28, 40], petal: true },
        { img: sprite(petal('#FFB8CC', '#FF4D8A', 'rgba(255,245,250,.45)'), 'rgba(255,150,190,.7)'), w: 10, s: [28, 40], petal: true },
        { img: sprite(frill('#FFE34D', '#FF9100'), 'rgba(255,190,60,.75)'), w: 14, s: [26, 36], petal: true },
        { img: sprite(marigold('#E8690A', '#FFA92E', '#FF8A00', 'rgba(170,70,0,.45)'), 'rgba(255,160,40,.8)'), w: 12, s: [44, 60] },
        { img: sprite(marigold('#E9A100', '#FFE352', '#FFC61A', 'rgba(175,115,0,.4)'), 'rgba(255,215,80,.8)'), w: 9, s: [42, 56] },
        { img: sprite(rose('#FF5E7C', '#E3163F', '#8E0A24', 'rgba(110,0,20,.35)'), 'rgba(255,70,100,.65)'), w: 8, s: [42, 56] },
        { img: sprite(rose('#FFC6D6', '#FF7BA3', '#D43A6E', 'rgba(180,40,90,.3)'), 'rgba(255,150,190,.65)'), w: 7, s: [40, 54] },
        { img: sprite(jasmine, 'rgba(255,248,215,.95)'), w: 10, s: [36, 48] },
      ];
      totalW = kinds.reduce((sum, k) => sum + k.w, 0);
    }
    const pick = () => { let r = Math.random() * totalW; for (const k of kinds) if ((r -= k.w) < 0) return k; return kinds[0]; };
    const bloom = (x, y, vx, vy, life) => {
      const k = pick();
      return { k, x, y, vx, vy, life, max: life, s: rnd(k.s[0], k.s[1]) * (W < 700 ? 0.8 : 1),
        rot: rnd(0, TAU), vr: rnd(-3, 3) * (k.petal ? 1.3 : 0.7), fl: rnd(0, TAU), fls: rnd(2, 5) * (k.petal ? 1.2 : 0.6),
        sw: rnd(0, TAU), sws: rnd(1.3, 2.5), amp: k.petal ? 46 : 26, drag: k.petal ? 2.3 : 1.7 };
    };
    // flowers thrown up and out in a fan (tilt turns the fan left or right)
    const fountain = (x, y, n, tilt, spread) => {
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + tilt + rnd(-spread, spread), v = rnd(200, 540);
        blooms.push(bloom(x + rnd(-22, 22), y + rnd(-10, 10), Math.cos(a) * v, Math.sin(a) * v, rnd(3.6, 5.2)));
      }
    };
    const glitter = (x, y, n) => {
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), v = rnd(50, 320);
        blooms.push({ spark: true, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 90, life: rnd(1.1, 2.2), max: 2.2, s: rnd(1.8, 3.4), ph: rnd(0, TAU) });
      }
    };
    // pushpa varsha: petals drifting down from the top of the frame
    function rainDrop() {
      const r = rain.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H) return;
      const x = rnd(r.left - r.width * 0.04, r.right + r.width * 0.04), y = Math.max(r.top, 0) - rnd(8, 44);
      blooms.push(bloom(x, y, rnd(-25, 25), rnd(30, 95), rnd(3.8, 5.4)));
      if (Math.random() < 0.3) blooms.push({ spark: true, x, y: y + rnd(0, 30), vx: rnd(-20, 20), vy: rnd(10, 50), life: rnd(1, 1.8), max: 1.8, s: rnd(1.6, 3), ph: rnd(0, TAU) });
    }
    function stepBlooms(dt, t) {
      // while you scroll, the shower drifts along at a third of the page's speed, as if it hangs in the air in front of it
      const sy = window.scrollY, dy = (lastSY - sy) * 0.35;
      lastSY = sy;
      for (let i = later.length - 1; i >= 0; i--) if ((later[i].wait -= dt) <= 0) later.splice(i, 1)[0].fn();
      if (rain && (rain.clock -= dt) <= 0) { rainDrop(); rain.clock += rain.every; if (--rain.left <= 0) rain = null; }
      if (!blooms.length) return;
      for (let i = blooms.length - 1; i >= 0; i--) {
        const p = blooms[i];
        p.life -= dt; p.y += dy;
        if (p.life <= 0 || p.y > H + 60) { blooms.splice(i, 1); continue; }
        if (p.flash) continue;
        if (p.spark) {
          p.vx *= Math.exp(-dt * 1.5); p.vy = p.vy * Math.exp(-dt * 1.5) + 70 * dt;
          p.x += p.vx * dt; p.y += p.vy * dt;
          p.a = Math.min(1, (p.life / p.max) * 1.6); p.ss = p.s * (0.55 + 0.45 * Math.sin(t * 16 + p.ph));
          continue;
        }
        p.vx *= Math.exp(-dt * p.drag); p.vy = p.vy * Math.exp(-dt * p.drag) + 290 * dt;
        const calm = 1 - Math.min(1, Math.hypot(p.vx, p.vy) / 320); // flutter once the throw has slowed
        p.sw += p.sws * dt; p.fl += p.fls * dt; p.rot += p.vr * dt;
        p.x += (p.vx + Math.sin(p.sw) * p.amp * calm) * dt; p.y += p.vy * dt;
      }
      // a warm flash where they burst out, then the flowers, then twinkling gold on top
      ctx.globalCompositeOperation = 'lighter';
      for (const p of blooms) {
        if (!p.flash) continue;
        const k = p.life / p.max, s = 50 + 230 * (1 - k);
        ctx.globalAlpha = k * 0.8;
        ctx.drawImage(glow([255, 190, 100], 128), p.x - s, p.y - s, s * 2, s * 2);
      }
      ctx.globalCompositeOperation = 'source-over';
      for (const p of blooms) {
        if (p.flash || p.spark) continue;
        const f = 0.3 + 0.7 * Math.abs(Math.cos(p.fl)), c = Math.cos(p.rot), s = Math.sin(p.rot);
        ctx.globalAlpha = Math.min(1, p.life / 0.9, (p.max - p.life) / 0.1);
        ctx.setTransform(dpr * c, dpr * s, -dpr * s * f, dpr * c * f, dpr * p.x, dpr * p.y);
        ctx.drawImage(p.k.img, -p.s / 2, -p.s / 2, p.s, p.s);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of blooms) {
        if (!p.spark) continue;
        ctx.globalAlpha = p.a;
        ctx.drawImage(glow([255, 210, 120], 32), p.x - p.ss * 3, p.y - p.ss * 3, p.ss * 6, p.ss * 6);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#FFF8E4';
      for (const p of blooms) {
        if (!p.spark) continue;
        ctx.globalAlpha = p.a;
        ctx.fillRect(p.x - p.ss * 1.6, p.y - 0.6, p.ss * 3.2, 1.2); ctx.fillRect(p.x - 0.6, p.y - p.ss * 1.6, 1.2, p.ss * 3.2);
      }
      ctx.globalAlpha = 1;
    }

    let wind = 0, windTarget = 0, windClock = 0;
    function step(dt, t) {
      ctx.clearRect(0, 0, W, H);
      windClock -= dt;
      if (windClock <= 0) { windTarget = Math.random() < 0.25 ? rnd(-40, 40) : rnd(-10, 10); windClock = rnd(2, 5); }
      wind += (windTarget - wind) * Math.min(1, dt * 0.8);
      for (const p of drift) {
        p.sw += p.sws * dt; p.fl += p.fls * dt; p.rot += p.vr * dt;
        p.x += (p.vx + Math.sin(p.sw) * 18 + wind) * dt;
        p.y += p.vy * dt;
        if (p.y > H + 30 || p.x < -50 || p.x > W + 50) Object.assign(p, make(false));
        draw(p, p.a);
      }
      for (let i = extra.length - 1; i >= 0; i--) {
        const p = extra[i];
        p.life -= dt;
        if (p.life <= 0) { extra.splice(i, 1); continue; }
        if (p.spark) {
          p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 12 * dt;
          const a = Math.min(1, p.life / p.max * 1.6);
          const s = p.s * (0.6 + 0.4 * Math.sin(t * 18 + p.ph));
          ctx.globalAlpha = a;
          ctx.drawImage(glow([255, 214, 120], 32), p.x - s * 2.5, p.y - s * 2.5, s * 5, s * 5);
          ctx.fillStyle = '#FFF6D8';
          ctx.fillRect(p.x - s * 1.4, p.y - 0.5, s * 2.8, 1); ctx.fillRect(p.x - 0.5, p.y - s * 1.4, 1, s * 2.8);
          ctx.globalAlpha = 1;
          continue;
        }
        p.vx *= Math.exp(-dt * 1.6); p.vy = p.vy * Math.exp(-dt * 1.6) + 260 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.fl += p.fls * dt;
        draw(p, Math.min(1, p.life * 1.4) * p.a);
      }
      stepBlooms(dt, t);
    }
    const api = {
      start() {
        if (on) return;
        resize();
        if (!drift.length) { const n = reduce ? 0 : Math.round(count * (W < 700 ? 0.5 : 1)); for (let i = 0; i < n; i++) drift.push(make(true)); }
        on = true; add(step);
      },
      stop() { on = false; remove(step); if (ctx) ctx.clearRect(0, 0, W, H); },
      resize() { if (on) resize(); },
      burst(x, y, n = 16) {
        if (reduce || !on) return;
        for (let i = 0; i < n; i++) {
          const a = rnd(0, TAU), v = rnd(90, 320);
          extra.push(Object.assign(make(false), { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 140, vr: rnd(-8, 8), fls: rnd(4, 9), life: rnd(1.3, 2.1), s: rnd(5, 9) }));
        }
        for (let i = 0; i < 8; i++) { const a = rnd(0, TAU), v = rnd(40, 160); extra.push({ spark: true, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: 0.9, max: 0.9, s: rnd(1.6, 3), ph: rnd(0, TAU) }); }
      },
      spark(x, y) {
        if (reduce || !on || extra.length > 140) return;
        extra.push({ spark: true, x: x + rnd(-4, 4), y: y + rnd(-4, 4), vx: rnd(-20, 20), vy: rnd(-10, 30), life: rnd(0.5, 0.9), max: 0.9, s: rnd(1.2, 2.6), ph: rnd(0, TAU) });
      },
      // The curtain shower over an element. Nothing starts on the faces: flowers burst up out of the
      // top of the frame, the flower beds at the bottom corners throw up their own handfuls, then
      // petals rain down from the top edge. Returns a function that stops whatever hasn't started.
      shower(el) {
        if (reduce || !on) return () => {};
        if (!kinds) buildKinds();
        const r = el.getBoundingClientRect(), top = Math.max(r.top, 0), bot = Math.min(r.bottom, H);
        if (bot - top < 40) return () => {};
        const k = (W < 700 ? 0.7 : 1) * (blooms.length > 200 ? 0.5 : 1), cx = r.left + r.width / 2;
        // if the top of the frame is off screen (coming back up from below), shower down from the top edge instead
        const fromTop = r.top > -20, cy = fromTop ? r.top + r.height * 0.04 : 0;
        blooms.push({ flash: true, x: cx, y: cy, life: 0.8, max: 0.8 });
        fountain(cx, cy, Math.round(44 * k), fromTop ? 0 : Math.PI, fromTop ? 1.4 : 1.1);
        glitter(cx, cy, Math.round(34 * k));
        later.push({ wait: 0.35, fn: () => {
          const q = el.getBoundingClientRect(), qy = Math.min(q.top + q.height * 0.86, H - 20);
          if (q.bottom < 0 || q.top > H) return;
          fountain(q.left + q.width * 0.14, qy, Math.round(16 * k), -0.25, 0.4); glitter(q.left + q.width * 0.14, qy, Math.round(10 * k));
          fountain(q.left + q.width * 0.86, qy, Math.round(16 * k), 0.25, 0.4); glitter(q.left + q.width * 0.86, qy, Math.round(10 * k));
        } });
        const drops = Math.round(34 * k);
        rain = { el, left: drops, clock: 0.55, every: 1.9 / drops };
        return () => { rain = null; later.length = 0; };
      },
    };
    window.addEventListener('resize', () => api.resize());
    return api;
  }

  /* ------------------------------------------------------------------- SKY */
  function Sky(canvas, { stars = 110, lanterns = 9, fireworks = true, every = [2.6, 5.4], skyFrac = 0.66, lanternFloor = 0.92 } = {}) {
    let ctx, W = 0, H = 0, on = false, nextFw = 1.4;
    let st = [];
    const ln = [], rockets = [], parts = [];
    const colors = [[255, 211, 107], [255, 143, 177], [255, 162, 76], [246, 231, 176], [255, 120, 110], [255, 236, 200]];
    const makeLantern = (initial) => {
      const s = rnd(7, 17);
      return { x: rnd(0.04, 0.96) * W, y: initial ? rnd(0.15, 1) * H * lanternFloor : H * lanternFloor + rnd(0, 60), s, vy: 6 + s * 1.3, ph: rnd(0, TAU), dx: rnd(-6, 6), fl: rnd(0, TAU) };
    };
    const resize = () => {
      ({ ctx, w: W, h: H } = fit(canvas, 1.5));
      const n = Math.round(stars * (W < 700 ? 0.55 : 1));
      st = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.pow(Math.random(), 1.4) * H * skyFrac, r: rnd(0.5, 1.6), ph: rnd(0, TAU), sp: rnd(0.6, 2.2) }));
    };
    function burst(x, y) {
      const c = colors[(Math.random() * colors.length) | 0];
      const n = W < 700 ? 38 : 64;
      const big = rnd(0.8, 1.2) * (W < 700 ? 0.8 : 1);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + rnd(-0.08, 0.08), v = (rnd(0.35, 1) ** 0.6) * 190 * big;
        parts.push({ x, y, px: x, py: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(1.1, 1.9), max: 1.9, c, glit: Math.random() < 0.25 });
      }
      parts.push({ flash: true, x, y, life: 0.35, max: 0.35, c });
    }
    function launch(x = rnd(0.2, 0.8) * W, y = rnd(0.12, 0.42) * H) {
      rockets.push({ x, y: H * 0.95, tx: x + rnd(-20, 20), ty: y, vy: -rnd(360, 460), px: x, py: H * 0.95 });
    }
    function step(dt, t) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#FFF2D0';
      for (const s of st) {
        ctx.globalAlpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (fireworks && !reduce) {
        nextFw -= dt;
        if (nextFw <= 0) { launch(); if (Math.random() < 0.3) setTimeout(() => on && launch(), 380); nextFw = rnd(every[0], every[1]); }
      }
      ctx.globalCompositeOperation = 'lighter';
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.px = r.x; r.py = r.y;
        r.y += r.vy * dt; r.x += (r.tx - r.x) * dt * 2; r.vy *= Math.exp(-dt * 0.6);
        ctx.strokeStyle = 'rgba(255,220,160,.8)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(r.px, r.py + 8); ctx.lineTo(r.x, r.y); ctx.stroke();
        if (r.y <= r.ty || r.vy > -60) { burst(r.x, r.y); rockets.splice(i, 1); }
      }
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= dt;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        const k = p.life / p.max;
        if (p.flash) {
          const s = 60 * (1 - k) + 20;
          ctx.globalAlpha = k * 0.8;
          ctx.drawImage(glow(p.c, 64), p.x - s, p.y - s, s * 2, s * 2);
          ctx.globalAlpha = 1;
          continue;
        }
        p.px = p.x; p.py = p.y;
        p.vx *= Math.exp(-dt * 1.3); p.vy = p.vy * Math.exp(-dt * 1.3) + 70 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        let a = Math.min(1, k * 1.6);
        if (p.glit) a *= 0.5 + 0.5 * Math.sin(t * 40 + p.x);
        const [r, g, b] = p.c;
        ctx.strokeStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (!reduce) {
        for (const l of ln) {
          l.y -= l.vy * dt; l.ph += dt * 0.8; l.fl += dt * 9;
          const x = l.x + Math.sin(l.ph) * 8 + l.dx * (1 - l.y / H);
          const fade = Math.min(1, Math.max(0, (l.y - H * 0.02) / (H * 0.25)));
          if (l.y < -40) Object.assign(l, makeLantern(false));
          const s = l.s, a = fade * (0.8 + 0.2 * Math.sin(l.fl));
          ctx.globalAlpha = a * 0.75;
          ctx.drawImage(glow([255, 170, 70], 64), x - s * 3, l.y - s * 3, s * 6, s * 6);
          ctx.globalAlpha = a;
          ctx.fillStyle = '#F59A3C';
          ctx.beginPath();
          ctx.moveTo(x - s * 0.62, l.y - s * 0.85); ctx.lineTo(x + s * 0.62, l.y - s * 0.85);
          ctx.lineTo(x + s * 0.45, l.y + s * 0.7); ctx.lineTo(x - s * 0.45, l.y + s * 0.7); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#FFE3A0';
          ctx.beginPath(); ctx.ellipse(x, l.y + s * 0.45, s * 0.3, s * 0.22, 0, 0, TAU); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }
    const api = {
      start() {
        if (on) return;
        resize();
        if (!ln.length) { const n = Math.round(lanterns * (W < 700 ? 0.6 : 1)); for (let i = 0; i < n; i++) ln.push(makeLantern(true)); }
        on = true; add(step);
      },
      stop() { on = false; remove(step); },
      resize() { if (on) { resize(); ln.forEach((l) => { l.x = Math.min(l.x, W); }); } },
      launch: (x, y) => { if (on && !reduce) launch(x, y); },
      get running() { return on; },
    };
    window.addEventListener('resize', () => api.resize());
    return api;
  }

  return { Petals, Sky, add, remove, reduce, coarse };
})();
