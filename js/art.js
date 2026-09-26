/* ==========================================================================
   ART — every ornament on the page is drawn in code so it stays crisp at any
   size: mandalas, the marigold toran, the illuminated palace, carved doors,
   lanterns, lamps, the monogram seal, Ganesha and the icon set.
   ========================================================================== */
window.Art = (() => {
  const GOLD = '#D4AF37';
  let uid = 0;
  const id = (p) => `${p}${(uid++).toString(36)}`;
  const f = (n) => Math.round(n * 10) / 10;

  /* ------------------------------------------------------------ Mandala */
  function mandala({ color = GOLD, fill = true, detail = 1, sw = 1.6 } = {}) {
    const k = id('m');
    const ring = (n, shape, r, off = 0, extra = '') => {
      let s = '';
      for (let i = 0; i < n; i++) s += `<use href="#${k}${shape}" transform="rotate(${f(off + (360 / n) * i)}) translate(0 ${-r})" ${extra}/>`;
      return s;
    };
    const fl = fill ? `fill="${color}" fill-opacity=".12"` : 'fill="none"';
    return `<svg viewBox="-500 -500 1000 1000" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linejoin="round" aria-hidden="true">
  <defs>
    <path id="${k}xl" d="M0 0C22 -26 22 -66 0 -96C-22 -66 -22 -26 0 0Z"/>
    <path id="${k}l" d="M0 0C16 -18 16 -48 0 -70C-16 -48 -16 -18 0 0Z"/>
    <path id="${k}md" d="M0 0C11 -12 11 -34 0 -50C-11 -34 -11 -12 0 0Z"/>
    <path id="${k}s" d="M0 0C7 -8 7 -22 0 -32C-7 -22 -7 -8 0 0Z"/>
    <path id="${k}lf" d="M0 0Q15 -20 0 -46Q-15 -20 0 0Z"/>
    <path id="${k}arc" d="M-22 0A22 22 0 0 1 22 0"/>
    <circle id="${k}d" r="3.2"/><circle id="${k}d2" r="2"/>
  </defs>
  <circle r="494"/><circle r="482" stroke-dasharray="2 8" stroke-opacity=".8"/>
  ${detail > 0.5 ? ring(60, 'd2', 470) + ring(36, 's', 404) : ''}
  <circle r="400"/>
  ${ring(24, 'xl', 292, 0, fl)}${ring(24, 'l', 292, 7.5, 'stroke-opacity=".7"')}
  <circle r="286"/><circle r="278" stroke-dasharray="1 6"/>
  ${ring(32, 'd', 266)}${ring(16, 'lf', 206, 0, fl)}${ring(16, 'arc', 204, 11.25)}
  <circle r="200"/>${ring(12, 'md', 148, 0, fl)}<circle r="144"/>
  ${ring(8, 's', 106)}<circle r="100"/>${ring(16, 'd2', 88)}
  ${ring(8, 'lf', 26, 0, fl)}${ring(8, 'lf', 26, 22.5, 'stroke-opacity=".6"')}
  <circle r="22"/><circle r="6" fill="${color}"/>
</svg>`;
  }

  /* ------------------------------------------------ Marigold toran (garland) */
  function garland(width, { compact = false } = {}) {
    const k = id('g');
    const n = Math.max(2, Math.round(width / (compact ? 250 : 380)));
    const sw = width / n;
    const sag = Math.min(compact ? 62 : 100, sw * 0.27);
    const strandLen = compact ? 92 : 128;
    const H = Math.max(sag + 44, strandLen + 36);
    const sp = compact ? 17 : 21;
    const defs = `<defs>
    <radialGradient id="${k}o" cx="38%" cy="36%" r="68%"><stop offset="0" stop-color="#FFE38F"/><stop offset=".5" stop-color="#F9A825"/><stop offset="1" stop-color="#C9540A"/></radialGradient>
    <radialGradient id="${k}y" cx="38%" cy="36%" r="68%"><stop offset="0" stop-color="#FFF6C2"/><stop offset=".55" stop-color="#F7C948"/><stop offset="1" stop-color="#D9840C"/></radialGradient>
    <linearGradient id="${k}lf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5BA65F"/><stop offset="1" stop-color="#1E5A2C"/></linearGradient>
    <g id="${k}m1"><circle r="11" fill="url(#${k}o)"/><circle r="8" fill="none" stroke="#FFD24D" stroke-opacity=".45" stroke-width="1.6" stroke-dasharray="2.2 2.6"/><circle r="4.2" fill="#FFE07A" fill-opacity=".85"/><circle r="1.6" fill="#B84A08" fill-opacity=".8"/></g>
    <g id="${k}m2"><circle r="10" fill="url(#${k}y)"/><circle r="7.2" fill="none" stroke="#FFF0A8" stroke-opacity=".5" stroke-width="1.4" stroke-dasharray="2 2.4"/><circle r="3.8" fill="#FFF2B0" fill-opacity=".9"/><circle r="1.4" fill="#C9740A" fill-opacity=".8"/></g>
    <path id="${k}lv" d="M0 0C9 9 11 24 0 38C-11 24 -9 9 0 0Z" fill="url(#${k}lf)" stroke="#123D1D" stroke-width=".7"/>
  </defs>`;
    const swagPts = (x0, x1) => {
      const pts = [], mid = (x0 + x1) / 2, N = 220;
      let prev = null, acc = 0, next = sp / 2;
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mid + t * t * x1;
        const y = 2 * (1 - t) * t * (2 * sag);
        const dx = 2 * (1 - t) * (mid - x0) + 2 * t * (x1 - mid), dy = 2 * (1 - t) * (2 * sag) - 2 * t * (2 * sag);
        if (prev) acc += Math.hypot(x - prev[0], y - prev[1]);
        if (acc >= next) { pts.push([x, y, Math.atan2(dy, dx) * 180 / Math.PI]); next += sp; }
        prev = [x, y];
      }
      return pts;
    };
    let swags = '', strands = '';
    for (let s = 0; s < n; s++) {
      const x0 = s * sw, x1 = (s + 1) * sw, mid = (x0 + x1) / 2;
      let lv = '', fl = '';
      swagPts(x0, x1).forEach(([x, y, a], i) => {
        if (i % 3 === 1) lv += `<use href="#${k}lv" transform="translate(${f(x)} ${f(y + 4)}) rotate(${f(a * 0.35)})"/>`;
        fl += `<use href="#${k}m${i % 2 ? 2 : 1}" transform="translate(${f(x)} ${f(y)}) scale(${i % 4 === 0 ? 1.08 : 0.94})"/>`;
      });
      swags += `<g class="tor-swag" style="animation-delay:${f(-s * 0.9)}s;transform-origin:${f(mid)}px 0px"><path d="M${f(x0)} 0Q${f(mid)} ${f(2 * sag)} ${f(x1)} 0" stroke="#6B3A0C" stroke-width="2.4" fill="none"/>${lv}${fl}</g>`;
    }
    for (let s = 0; s <= n; s++) {
      const x = Math.min(Math.max(s * sw, 14), width - 14);
      let fl = '';
      for (let y = 14, i = 0; y < strandLen - 8; y += sp - 2, i++) fl += `<use href="#${k}m${i % 2 ? 1 : 2}" transform="translate(${f(x)} ${y}) scale(.92)"/>`;
      strands += `<g class="tor-strand" style="animation-delay:${f(-s * 0.63)}s;transform-origin:${f(x)}px 0px"><path d="M${f(x)} 0V${strandLen}" stroke="#6B3A0C" stroke-width="2" fill="none"/>`
        + `<use href="#${k}lv" transform="translate(${f(x)} ${strandLen - 6})"/><use href="#${k}lv" transform="translate(${f(x)} ${strandLen - 10}) rotate(-28)"/><use href="#${k}lv" transform="translate(${f(x)} ${strandLen - 10}) rotate(28)"/>${fl}</g>`;
    }
    return `<svg viewBox="0 0 ${f(width)} ${H}" width="${f(width)}" height="${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}${swags}${strands}</svg>`;
  }

  /* ------------------------------------------------- Mughal cusped arch */
  function archPath(w, h, { cusps = 8, bulge = 0.3, spring = 0.42 } = {}, scale = [1, 1], off = [0, 0]) {
    const cx = w / 2, rx = w / 2, cy = spring * h, ry = spring * h;
    const pts = [];
    for (let i = 0; i <= cusps; i++) {
      const a = Math.PI + (Math.PI * i) / cusps;
      pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
    }
    const P = (x, y) => `${((x + off[0]) * scale[0]).toFixed(4)} ${((y + off[1]) * scale[1]).toFixed(4)}`;
    let d = `M${P(0, h)} L${P(0, cy)}`;
    for (let i = 0; i < cusps; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
      d += ` Q${P(mx + (dy / len) * len * bulge, my + (-dx / len) * len * bulge)} ${P(x1, y1)}`;
    }
    return d + ` L${P(w, h)} Z`;
  }

  // Gold frame for an arch-clipped portrait. Returns { svg, inset } (inset aligns it with the w×h box).
  function archFrame(color = GOLD, { w = 800, h = 600, cusps = 12, spring = 0.4, bells = true } = {}) {
    const s = Math.min(w, h) / 300;
    const padX = Math.round(16 * s), top = Math.round(36 * s), bottom = Math.round(16 * s);
    const ins = Math.round(12 * s);
    const outer = archPath(w, h, { cusps, bulge: 0.3, spring });
    const inner = archPath(w - ins * 2, h - ins * 2 - 4 * s, { cusps, bulge: 0.3, spring });
    const sy = spring * h;
    const bell = (x) => `<g class="frame-bell" style="transform-origin:${f(x)}px ${f(sy + 6 * s)}px">
      <path d="M${f(x)} ${f(sy + 6 * s)}V${f(sy + 30 * s)}" stroke-width="${f(1.2 * s)}"/>
      <path d="M${f(x - 9 * s)} ${f(sy + 52 * s)}C${f(x - 9 * s)} ${f(sy + 36 * s)} ${f(x - 6 * s)} ${f(sy + 30 * s)} ${f(x)} ${f(sy + 30 * s)}C${f(x + 6 * s)} ${f(sy + 30 * s)} ${f(x + 9 * s)} ${f(sy + 36 * s)} ${f(x + 9 * s)} ${f(sy + 52 * s)}Z" fill="${color}" fill-opacity=".9" stroke-width="${f(1 * s)}"/>
      <circle cx="${f(x)}" cy="${f(sy + 55 * s)}" r="${f(2.6 * s)}" fill="${color}"/></g>`;
    const svg = `<svg viewBox="${-padX} ${-top} ${w + padX * 2} ${h + top + bottom}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${color}" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
  <path d="${outer}" stroke-width="${f(2.4 * s)}"/>
  <g transform="translate(${ins} ${f(ins + 2 * s)})"><path d="${inner}" stroke-width="${f(1 * s)}" stroke-dasharray="${f(3 * s)} ${f(5 * s)}" stroke-opacity=".85"/></g>
  <g transform="translate(${w / 2} 0) scale(${f(s)})"><path d="M0 2V-20" stroke-width="1.6"/><path d="M0 -20C-7 -14 -7 -4 0 2C7 -4 7 -14 0 -20Z" fill="${color}" fill-opacity=".9" stroke-width="1"/><circle cy="-26" r="3" fill="${color}"/></g>
  <path d="M0 ${h}H${w}" stroke-width="${f(2.4 * s)}"/>
  <path d="M${f(-padX * 0.7)} ${f(h + bottom * 0.7)}H${f(w + padX * 0.7)}" stroke-width="${f(1 * s)}" stroke-opacity=".7"/>
  <circle cx="${f(-padX * 0.7)}" cy="${f(h + bottom * 0.7)}" r="${f(2.6 * s)}" fill="${color}"/><circle cx="${f(w + padX * 0.7)}" cy="${f(h + bottom * 0.7)}" r="${f(2.6 * s)}" fill="${color}"/>
  <path d="M${f(-padX * 0.57)} ${h}V${f(sy + 4 * s)}" stroke-width="${f(1 * s)}" stroke-opacity=".7"/><path d="M${f(w + padX * 0.57)} ${h}V${f(sy + 4 * s)}" stroke-width="${f(1 * s)}" stroke-opacity=".7"/>
  <circle cx="${f(-padX * 0.57)}" cy="${f(sy)}" r="${f(3 * s)}" fill="${color}"/><circle cx="${f(w + padX * 0.57)}" cy="${f(sy)}" r="${f(3 * s)}" fill="${color}"/>
  ${bells ? bell(w * 0.035) + bell(w * 0.965) : ''}
</svg>`;
    const pct = (v, b) => `${(-(v / b) * 100).toFixed(3)}%`;
    return { svg, inset: `${pct(top, h)} ${pct(padX, w)} ${pct(bottom, h)}` };
  }

  /* ------------------------------------------------ Small ornaments */
  function ornament(color = GOLD) {
    return `<svg viewBox="0 0 420 44" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path class="orn-line" d="M8 22H160"/><path class="orn-line" d="M260 22H412"/>
  <circle cx="8" cy="22" r="2.6" fill="${color}"/><circle cx="412" cy="22" r="2.6" fill="${color}"/>
  <path d="M160 22c-6 -9 -18 -9 -18 0c0 7 10 9 14 3"/><path d="M260 22c6 -9 18 -9 18 0c0 7 -10 9 -14 3"/>
  <circle cx="176" cy="22" r="2" fill="${color}"/><circle cx="244" cy="22" r="2" fill="${color}"/>
  <g transform="translate(210 24)">
    <path d="M0 10C-6 3 -6 -9 0 -16C6 -9 6 3 0 10Z" fill="${color}" fill-opacity=".25"/>
    <path d="M0 10C-12 8 -19 -1 -17 -9C-8 -9 -2 -2 0 10Z"/><path d="M0 10C12 8 19 -1 17 -9C8 -9 2 -2 0 10Z"/>
    <path d="M0 10C-19 13 -28 5 -28 -1C-18 -3 -7 2 0 10Z" stroke-opacity=".8"/><path d="M0 10C19 13 28 5 28 -1C18 -3 7 2 0 10Z" stroke-opacity=".8"/>
    <path d="M-32 12H32" stroke-opacity=".8"/>
  </g>
</svg>`;
  }

  function corner(color = GOLD) {
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
  <path d="M2 58V16Q2 2 16 2H58"/><path d="M9 52V22Q9 9 22 9H52" stroke-opacity=".45"/>
  <path d="M16 16c8 0 10 6 10 12c0 -6 2 -12 12 -12"/>
  <circle cx="16" cy="16" r="2.2" fill="${color}"/><circle cx="38" cy="16" r="1.4" fill="${color}"/><circle cx="16" cy="38" r="1.4" fill="${color}"/>
</svg>`;
  }

  function lotus(color = GOLD, w = 1) {
    return `<g fill="none" stroke="${color}" stroke-width="${1.4 * w}" stroke-linejoin="round">
    <path d="M0 10C-7 2 -7 -12 0 -22C7 -12 7 2 0 10Z" fill="${color}" fill-opacity=".22"/>
    <path d="M0 10C-14 8 -22 -2 -20 -12C-9 -12 -2 -3 0 10Z"/><path d="M0 10C14 8 22 -2 20 -12C9 -12 2 -3 0 10Z"/>
    <path d="M0 10C-22 14 -33 5 -33 -2C-21 -4 -8 2 0 10Z" stroke-opacity=".8"/><path d="M0 10C22 14 33 5 33 -2C21 -4 8 2 0 10Z" stroke-opacity=".8"/>
    <path d="M-38 13H38" stroke-opacity=".8"/></g>`;
  }

  /* ------------------------------------------------------- Lord Ganesha */
  function ganesha(color = GOLD) {
    const L = 'pathLength="1" class="gd"';
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Lord Ganesha">
  <circle ${L} cx="100" cy="100" r="92" stroke-width="1.2" stroke-dasharray="1.5 6" stroke-opacity=".75"/>
  <path ${L} d="M74 58L82 34L94 47L100 20L106 47L118 34L126 58" stroke-width="2.6"/>
  <path ${L} d="M74 58Q100 50 126 58" stroke-width="2.2"/>
  <circle class="gdot" cx="100" cy="15" r="3" fill="${color}"/><circle class="gdot" cx="82" cy="30" r="2" fill="${color}"/><circle class="gdot" cx="118" cy="30" r="2" fill="${color}"/><circle class="gdot" cx="100" cy="42" r="2.2" fill="${color}"/>
  <path ${L} d="M70 62Q100 44 130 62Q144 88 132 116Q100 132 68 116Q56 88 70 62Z"/>
  <path ${L} d="M70 66Q38 60 34 88Q32 114 62 120"/><path ${L} d="M130 66Q162 60 166 88Q168 114 138 120"/>
  <path ${L} d="M64 80Q50 86 52 104" stroke-width="1.8" stroke-opacity=".7"/><path ${L} d="M136 80Q150 86 148 104" stroke-width="1.8" stroke-opacity=".7"/>
  <path ${L} d="M95 66V78Q100 83 105 78V66" stroke-width="2.2"/>
  <path ${L} d="M80 92q7 -6 14 0"/><path ${L} d="M106 92q7 -6 14 0"/>
  <circle class="gdot" cx="87" cy="93" r="1.9" fill="${color}"/><circle class="gdot" cx="113" cy="93" r="1.9" fill="${color}"/>
  <path ${L} d="M100 110C106 130 100 146 88 156C78 164 66 160 68 150C70 142 80 142 80 150"/>
  <path ${L} d="M106 116C108 128 104 138 98 144" stroke-width="1.6" stroke-opacity=".6"/>
  <path ${L} d="M114 112q12 6 10 22" stroke-width="2.6"/>
  <circle ${L} cx="63" cy="164" r="6" stroke-width="2"/><path ${L} d="M63 158V154" stroke-width="2"/>
  <circle class="gdot" cx="150" cy="150" r="1.8" fill="${color}" fill-opacity=".8"/><circle class="gdot" cx="158" cy="140" r="1.4" fill="${color}" fill-opacity=".6"/><circle class="gdot" cx="142" cy="158" r="1.4" fill="${color}" fill-opacity=".6"/>
</svg>`;
  }

  /* ---------------------------------------------------- Monogram seal */
  function monogram(a = 'P', b = 'N', { color = GOLD, face = '#5A101C' } = {}) {
    const k = id('mo');
    let petals = '';
    for (let i = 0; i < 28; i++) petals += `<path d="M0 -84C4 -89 4 -95 0 -99C-4 -95 -4 -89 0 -84Z" transform="rotate(${f(i * 360 / 28)})" fill="${color}" fill-opacity=".85"/>`;
    return `<svg viewBox="-110 -110 220 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="${k}f" cx="42%" cy="36%" r="75%"><stop offset="0" stop-color="#8A1F2E"/><stop offset=".6" stop-color="${face}"/><stop offset="1" stop-color="#2A070D"/></radialGradient>
    <linearGradient id="${k}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3C4"/><stop offset=".45" stop-color="#E9CC7A"/><stop offset="1" stop-color="#B8902A"/></linearGradient>
  </defs>
  <circle r="106" fill="url(#${k}g)"/>
  <circle r="101" fill="url(#${k}f)"/>
  <g class="seal-ring">${petals}<circle r="80" fill="none" stroke="${color}" stroke-width="1.2" stroke-dasharray="1.5 4.5"/></g>
  <circle r="74" fill="none" stroke="url(#${k}g)" stroke-width="1.6"/>
  <text x="-17" y="21" text-anchor="middle" font-family="'Great Vibes', cursive" font-size="92" fill="url(#${k}g)">${a}</text>
  <text x="24" y="33" text-anchor="middle" font-family="'Great Vibes', cursive" font-size="92" fill="url(#${k}g)">${b}</text>
  <path d="M-30 52H30" stroke="${color}" stroke-width="1" stroke-opacity=".7"/><circle cy="52" r="2.4" fill="${color}"/>
</svg>`;
  }

  /* ------------------------------------------------ The illuminated palace
     A wide Rajput-Mughal palace silhouette (centre at x=1200). Returns the
     silhouette, the glowing windows and the positions of the festival bulbs
     traced along its domes and rooflines.                                   */
  function palace() {
    const W = 2400, H = 470, CX = 1200;
    const cen = [], side = [], winC = [], winS = [], flkC = [], flkS = [], bC = [], bS = [];
    const R = (x, y, w, h) => `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
    const domePts = (cx, by, w, h) => [[cx - w / 2, by], [cx - w * 0.62, by - h * 0.42], [cx - w * 0.26, by - h * 0.74], [cx, by - h], [cx + w * 0.26, by - h * 0.74], [cx + w * 0.62, by - h * 0.42], [cx + w / 2, by]];
    const dome = (cx, by, w, h) => { const p = domePts(cx, by, w, h).map(([x, y]) => `${f(x)} ${f(y)}`); return `M${p[0]}C${p[1]} ${p[2]} ${p[3]}C${p[4]} ${p[5]} ${p[6]}Z`; };
    const bez = (a, b, c, d, t) => { const u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]; };
    const domeBulbs = (cx, by, w, h, n, out, both = true) => {
      const p = domePts(cx, by, w, h);
      for (let i = 0; i <= n; i++) out.push(bez(p[0], p[1], p[2], p[3], i / n));
      if (both) for (let i = 1; i <= n; i++) out.push(bez(p[3], p[4], p[5], p[6], i / n));
    };
    const finial = (x, y, h) => `${R(x - 1.6, y - h, 3.2, h)}M${f(x - 4.5)} ${f(y - h - 4)}a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0Z`;
    const arch = (x, y, w, h) => `M${f(x)} ${f(y + h)}V${f(y + h * 0.42)}Q${f(x)} ${f(y + h * 0.06)} ${f(x + w / 2)} ${f(y)}Q${f(x + w)} ${f(y + h * 0.06)} ${f(x + w)} ${f(y + h * 0.42)}V${f(y + h)}Z`;
    const merlons = (x0, x1, y, s = 9, g = 11) => { let d = ''; for (let x = x0; x + s <= x1; x += s + g) d += R(x, y - s, s, s); return d; };
    const row = (x0, x1, y, step, out) => { for (let x = x0; x <= x1 + 0.1; x += step) out.push([x, y]); };
    const swag = (a, b, out, step = 14) => {
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + d * 0.2];
      const n = Math.max(3, Math.round(d / step));
      for (let i = 1; i < n; i++) { const t = i / n, u = 1 - t; out.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]); }
    };
    const chhatri = (cx, by, w, sh, wn, bl) => {
      sh.push(R(cx - w * 0.5, by - w * 0.1, w, w * 0.1));
      sh.push(R(cx - w * 0.42, by - w * 0.56, w * 0.84, w * 0.47));
      sh.push(`M${f(cx - w * 0.6)} ${f(by - w * 0.55)}L${f(cx + w * 0.6)} ${f(by - w * 0.55)}L${f(cx + w * 0.5)} ${f(by - w * 0.66)}L${f(cx - w * 0.5)} ${f(by - w * 0.66)}Z`);
      sh.push(dome(cx, by - w * 0.65, w * 0.76, w * 0.6));
      sh.push(finial(cx, by - w * 1.25, w * 0.2));
      const ow = w * 0.19, oh = w * 0.36, oy = by - w * 0.5;
      [-1, 0, 1].forEach((k) => wn.push(arch(cx + k * w * 0.27 - ow / 2, oy, ow, oh)));
      domeBulbs(cx, by - w * 0.65, w * 0.76, w * 0.6, 5, bl);
      return [cx, by - w * 1.45 - 4];                               // finial knob
    };
    // ---- centre (symmetric, drawn once)
    cen.push(R(0, 448, W, 22), R(24, 436, W - 48, 12));
    cen.push(R(CX - 160, 192, 320, 244), merlons(CX - 154, CX + 154, 192));
    cen.push(R(CX - 92, 166, 184, 26), dome(CX, 168, 236, 128), finial(CX, 40, 24));
    winC.push(arch(CX - 50, 322, 100, 114));
    flkC.push(arch(CX - 102, 232, 32, 58), arch(CX + 70, 232, 32, 58));
    winC.push(arch(CX - 16, 226, 32, 64));
    domeBulbs(CX, 168, 236, 128, 14, bC);
    row(CX - 154, CX + 154, 180, 16, bC);
    const top = [CX, 7.5];
    // ---- left side (mirrored for the right)
    const L = (dx) => CX - dx;
    side.push(R(0, 380, L(852), 56), merlons(4, L(852) - 4, 380));                  // outer wall
    side.push(R(L(852), 290, 52, 146), dome(L(826), 292, 62, 54), finial(L(826), 238, 14)); // small tower
    side.push(R(L(800), 352, 236, 84), merlons(L(800) + 4, L(564) - 4, 352));        // wall
    side.push(R(L(564), 208, 76, 228), dome(L(526), 210, 90, 78), finial(L(526), 132, 18)); // tower
    side.push(R(L(488), 270, 328, 166), merlons(L(488) + 4, L(160) - 4, 270));        // wing
    for (let i = 0; i < 5; i++) { const x = L(462) + i * 60; (i % 2 ? winS : flkS).push(arch(x, 302, 26, 46)); (i % 2 ? flkS : winS).push(arch(x, 372, 26, 46)); }
    winS.push(arch(L(538), 252, 24, 42), arch(L(538), 330, 24, 42));
    for (let i = 0; i < 4; i++) winS.push(arch(L(780) + i * 52, 382, 18, 32));
    for (let i = 0; i < 6; i++) (i % 3 ? winS : flkS).push(arch(40 + i * 56, 402, 14, 24));
    winS.push(arch(L(838), 330, 20, 36));
    const kA = [L(826), 219.5], kB = [L(526), 109.5];
    const kC = chhatri(L(400), 270, 64, side, winS, bS);
    const kD = chhatri(L(234), 270, 64, side, winS, bS);
    const kE = chhatri(L(124), 192, 58, side, winS, bS);
    domeBulbs(L(526), 210, 90, 78, 6, bS); domeBulbs(L(826), 292, 62, 54, 4, bS);
    row(6, L(852) - 6, 372, 16, bS); row(L(800) + 6, L(564) - 6, 344, 16, bS); row(L(488) + 6, L(160) - 6, 262, 16, bS);
    swag(kA, kB, bS); swag(kB, kC, bS); swag(kC, kD, bS); swag(kD, kE, bS); swag(kE, top, bS);

    const M = `matrix(-1 0 0 1 ${W} 0)`;
    const both = (arr) => `<path d="${arr.join('')}"/><path d="${arr.join('')}" transform="${M}"/>`;
    const sil = cen.join('') + side.join('');
    const silMirror = side.join('');
    const svgOpen = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;
    const k = id('pal');
    const silhouette = `${svgOpen}
  <defs><linearGradient id="${k}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A0810"/><stop offset="1" stop-color="#12030A"/></linearGradient></defs>
  <g stroke="rgba(233,204,122,.55)" stroke-width="3" fill="none"><path d="${sil}"/><path d="${silMirror}" transform="${M}"/></g>
  <g fill="url(#${k}s)"><path d="${sil}"/><path d="${silMirror}" transform="${M}"/></g>
</svg>`;
    const winSvg = (arrC, arrS, cls) => `${svgOpen}
  <defs><linearGradient id="${k}${cls}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7A6"/><stop offset=".55" stop-color="#FFB547"/><stop offset="1" stop-color="#D2641A"/></linearGradient></defs>
  <g fill="url(#${k}${cls})"><path d="${arrC.join('')}"/>${both(arrS)}</g></svg>`;
    const bulbs = bC.concat(bS, bS.map(([x, y]) => [W - x, y]));
    const bulbLayer = (i, n) => {
      let c = '';
      bulbs.forEach(([x, y], j) => { if (j % n === i) c += `<circle cx="${f(x)}" cy="${f(y)}" r="5.5"/>`; });
      let core = '';
      bulbs.forEach(([x, y], j) => { if (j % n === i) core += `<circle cx="${f(x)}" cy="${f(y)}" r="1.9"/>`; });
      return `${svgOpen}<defs><radialGradient id="${k}b${i}"><stop offset="0" stop-color="#FFF6D6" stop-opacity=".95"/><stop offset=".35" stop-color="#FFC15A" stop-opacity=".55"/><stop offset="1" stop-color="#FF9A2E" stop-opacity="0"/></radialGradient></defs>
  <g fill="url(#${k}b${i})">${c}</g><g fill="#FFF3CF">${core}</g></svg>`;
    };
    return {
      silhouette,
      windows: winSvg(winC, winS, 'w'),
      flicker: winSvg(flkC, flkS, 'f'),
      bulbs: [0, 1, 2, 3].map((i) => bulbLayer(i, 4)),
      count: bulbs.length,
    };
  }

  // Distant domes behind the palace (lighter, no detail)
  function skyline() {
    const W = 2400, H = 470;
    const dome = (cx, by, w, h) => `M${f(cx - w / 2)} ${by}C${f(cx - w * 0.62)} ${f(by - h * 0.42)} ${f(cx - w * 0.26)} ${f(by - h * 0.74)} ${cx} ${f(by - h)}C${f(cx + w * 0.26)} ${f(by - h * 0.74)} ${f(cx + w * 0.62)} ${f(by - h * 0.42)} ${f(cx + w / 2)} ${by}Z`;
    const R = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}Z`;
    let d = '';
    [[150, 300, 150, 110], [420, 250, 190, 150], [700, 230, 120, 96], [1700, 230, 120, 96], [1980, 250, 190, 150], [2250, 300, 150, 110]].forEach(([cx, by, w, h]) => {
      d += R(cx - w * 0.62, by, w * 1.24, H - by) + dome(cx, by + 2, w, h) + R(cx - 1.5, by - h - 20, 3, 22);
    });
    [[290, 170, 26], [560, 150, 28], [860, 190, 24], [1540, 190, 24], [1840, 150, 28], [2110, 170, 26]].forEach(([cx, top, w]) => {
      d += R(cx - w / 2, top, w, H - top) + dome(cx, top + 2, w * 1.5, w * 1.3) + R(cx - w * 0.75, top + 30, w * 1.5, 6);
    });
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="${d}" fill="#3A0C18"/></svg>`;
  }

  /* ------------------------------------------------------ Carved door leaf
     Drawn at the leaf's real pixel size so the carving never stretches.    */
  function doorLeaf(w, h) {
    const k = id('d');
    const pad = Math.max(8, Math.round(w * 0.045));
    const ins = w < 210 ? pad + 16 : pad + 26;
    let s = `<defs>
    <linearGradient id="${k}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E3A8"/><stop offset=".5" stop-color="#D4AF37"/><stop offset="1" stop-color="#8C6A1C"/></linearGradient>
    <radialGradient id="${k}st" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#FFF4C9"/><stop offset=".45" stop-color="#D4AF37"/><stop offset="1" stop-color="#6E4F12"/></radialGradient>
    <pattern id="${k}j" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M7 0L14 7L7 14L0 7Z" fill="none" stroke="#D4AF37" stroke-width=".8" stroke-opacity=".55"/><circle cx="7" cy="7" r="1.3" fill="#D4AF37" fill-opacity=".7"/></pattern>
  </defs>`;
    s += `<rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" fill="none" stroke="url(#${k}g)" stroke-width="2.2"/>`;
    s += `<rect x="${pad + 5}" y="${pad + 5}" width="${w - pad * 2 - 10}" height="${h - pad * 2 - 10}" fill="none" stroke="#D4AF37" stroke-opacity=".45"/>`;
    const si = pad + (ins - pad) / 2 + 2.5;
    let studs = '';
    const nx = Math.max(2, Math.round((w - si * 2) / 26)), ny = Math.max(3, Math.round((h - si * 2) / 26));
    for (let i = 0; i <= nx; i++) { const x = si + (w - si * 2) * i / nx; studs += `<circle cx="${f(x)}" cy="${f(si)}" r="3"/><circle cx="${f(x)}" cy="${f(h - si)}" r="3"/>`; }
    for (let i = 1; i < ny; i++) { const y = si + (h - si * 2) * i / ny; studs += `<circle cx="${f(si)}" cy="${f(y)}" r="3"/><circle cx="${f(w - si)}" cy="${f(y)}" r="3"/>`; }
    s += `<g fill="url(#${k}st)">${studs}</g>`;
    const ix = ins, iy = ins, iw = w - ins * 2, ih = h - ins * 2;
    const gap = Math.max(10, ih * 0.025);
    const h1 = ih * 0.4, h2 = ih * 0.3, h3 = ih - h1 - h2 - gap * 2;
    const spring = Math.min(0.62, Math.max(0.22, (iw * 0.62) / h1));
    const a1 = archPath(iw, h1, { cusps: 7, bulge: 0.28, spring });
    const a2 = archPath(iw - 14, h1 - 12, { cusps: 7, bulge: 0.28, spring: Math.min(0.62, Math.max(0.22, ((iw - 14) * 0.62) / (h1 - 12))) });
    s += `<g transform="translate(${f(ix)} ${f(iy)})"><clipPath id="${k}c"><path d="${a2}" transform="translate(7 7)"/></clipPath>
      <path d="${a1}" fill="rgba(0,0,0,.18)" stroke="url(#${k}g)" stroke-width="1.8"/>
      <rect width="${f(iw)}" height="${f(h1)}" fill="url(#${k}j)" clip-path="url(#${k}c)"/>
      <path d="${a2}" transform="translate(7 7)" fill="none" stroke="#D4AF37" stroke-opacity=".6"/></g>`;
    const y2 = iy + h1 + gap;
    s += `<rect x="${f(ix)}" y="${f(y2)}" width="${f(iw)}" height="${f(h2)}" fill="rgba(0,0,0,.18)" stroke="url(#${k}g)" stroke-width="1.8"/>`;
    s += `<rect x="${f(ix + 6)}" y="${f(y2 + 6)}" width="${f(iw - 12)}" height="${f(h2 - 12)}" fill="none" stroke="#D4AF37" stroke-opacity=".5"/>`;
    const md = Math.min(iw, h2) * 0.78;
    s += mandala({ color: '#E0BE62', fill: true, detail: md > 110 ? 1 : 0, sw: Math.max(2.5, 520 / md) }).replace('<svg ', `<svg x="${f(ix + (iw - md) / 2)}" y="${f(y2 + (h2 - md) / 2)}" width="${f(md)}" height="${f(md)}" class="door-medallion" `);
    const y3 = y2 + h2 + gap;
    s += `<rect x="${f(ix)}" y="${f(y3)}" width="${f(iw)}" height="${f(h3)}" fill="rgba(0,0,0,.18)" stroke="url(#${k}g)" stroke-width="1.8"/>`;
    s += `<rect x="${f(ix + 6)}" y="${f(y3 + 6)}" width="${f(iw - 12)}" height="${f(h3 - 12)}" fill="none" stroke="#D4AF37" stroke-opacity=".5"/>`;
    const ls = Math.min(iw / 90, h3 / 60, 1.6);
    s += `<g transform="translate(${f(ix + iw / 2)} ${f(y3 + h3 / 2 + 4 * ls)}) scale(${f(ls)})">${lotus('#E0BE62')}</g>`;
    // brass seam strip + knocker on the meeting edge
    s += `<rect x="${w - 7}" y="0" width="7" height="${h}" fill="url(#${k}g)"/>`;
    const kx = w - ins * 0.55 - Math.min(26, w * 0.1), ky = h * 0.54, kr = Math.min(22, w * 0.085);
    s += `<g class="door-knocker" style="transform-origin:${f(kx)}px ${f(ky)}px"><circle cx="${f(kx)}" cy="${f(ky)}" r="${f(kr * 0.42)}" fill="url(#${k}st)"/>
      <circle cx="${f(kx)}" cy="${f(ky + kr * 1.02)}" r="${f(kr)}" fill="none" stroke="url(#${k}st)" stroke-width="${f(Math.max(3, kr * 0.22))}"/></g>`;
    return `<svg viewBox="0 0 ${f(w)} ${f(h)}" width="${f(w)}" height="${f(h)}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${s}</svg>`;
  }

  /* --------------------------------------------------- Hanging lantern */
  function lantern() {
    const k = id('ln');
    return `<svg viewBox="0 0 100 262" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="${k}g" cx="50%" cy="58%" r="62%"><stop offset="0" stop-color="#FFF4C4"/><stop offset=".45" stop-color="#FFB547"/><stop offset="1" stop-color="#B8420C"/></radialGradient>
    <linearGradient id="${k}m" x1="0" x2="1"><stop offset="0" stop-color="#7A5A14"/><stop offset=".5" stop-color="#F6E0A0"/><stop offset="1" stop-color="#7A5A14"/></linearGradient>
  </defs>
  <path d="M50 0V78" stroke="#B8902A" stroke-width="2" stroke-dasharray="7 3"/>
  <circle cx="50" cy="83" r="5" fill="none" stroke="url(#${k}m)" stroke-width="2.2"/>
  <path d="M28 106Q50 78 72 106Z" fill="url(#${k}m)"/><path d="M24 106H76L71 113H29Z" fill="url(#${k}m)"/>
  <path d="M29 113H71L79 152L71 192H29L21 152Z" fill="url(#${k}g)"/>
  <path d="M34 146Q42 124 50 146Q58 124 66 146" fill="none" stroke="#7A2A0C" stroke-width="1.6" stroke-opacity=".55"/>
  <path d="M30 170H70" stroke="#7A2A0C" stroke-width="1.2" stroke-opacity=".45" stroke-dasharray="2 3"/>
  <path d="M29 113L21 152L29 192M71 113L79 152L71 192M50 113V192M21 152H79" fill="none" stroke="url(#${k}m)" stroke-width="2.4"/>
  <path d="M29 192H71L61 207H39Z" fill="url(#${k}m)"/>
  <path d="M50 207V224" stroke="#D4AF37" stroke-width="2.2"/><circle cx="50" cy="228" r="4.2" fill="#D4AF37"/>
  <path d="M50 232L43 258M50 232L50 261M50 232L57 258" stroke="#A4161A" stroke-width="2.2" stroke-linecap="round"/>
</svg>`;
  }

  /* -------------------------------------------- Standing brass lamp (samai) */
  function samai() {
    const k = id('sm');
    const flame = (x, y, s = 1) => `<g class="flame" style="transform-origin:${x}px ${y}px"><path d="M${x} ${y}C${x - 6 * s} ${y - 8 * s} ${x - 5 * s} ${y - 17 * s} ${x} ${y - 26 * s}C${x + 5 * s} ${y - 17 * s} ${x + 6 * s} ${y - 8 * s} ${x} ${y}Z" fill="url(#${k}f)"/><path d="M${x} ${y - 2}C${x - 2.5 * s} ${y - 6 * s} ${x - 2 * s} ${y - 11 * s} ${x} ${y - 15 * s}C${x + 2 * s} ${y - 11 * s} ${x + 2.5 * s} ${y - 6 * s} ${x} ${y - 2}Z" fill="#FFF8E0"/></g>`;
    return `<svg viewBox="0 0 140 380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${k}b" x1="0" x2="1"><stop offset="0" stop-color="#6E4F12"/><stop offset=".35" stop-color="#F6E0A0"/><stop offset=".6" stop-color="#D4AF37"/><stop offset="1" stop-color="#5E420E"/></linearGradient>
    <radialGradient id="${k}f" cx="50%" cy="70%" r="70%"><stop offset="0" stop-color="#FFF1B0"/><stop offset=".5" stop-color="#FFB02E"/><stop offset="1" stop-color="#E4501A"/></radialGradient>
    <radialGradient id="${k}h"><stop offset="0" stop-color="#FFC66B" stop-opacity=".55"/><stop offset="1" stop-color="#FF8A2A" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse class="samai-halo" cx="70" cy="88" rx="70" ry="54" fill="url(#${k}h)"/>
  <path d="M22 372Q70 346 118 372Z" fill="url(#${k}b)"/><path d="M34 356Q70 330 106 356L100 362Q70 346 40 362Z" fill="url(#${k}b)"/>
  <path d="M64 340H76L74 150H66Z" fill="url(#${k}b)"/>
  <ellipse cx="70" cy="300" rx="14" ry="6" fill="url(#${k}b)"/><ellipse cx="70" cy="250" rx="11" ry="5" fill="url(#${k}b)"/><ellipse cx="70" cy="200" rx="13" ry="6" fill="url(#${k}b)"/>
  <path d="M70 230C82 230 84 214 70 212C56 214 58 230 70 230Z" fill="url(#${k}b)"/>
  <path d="M14 116Q70 150 126 116L120 128Q70 162 20 128Z" fill="url(#${k}b)"/>
  <path d="M60 150H80L76 132H64Z" fill="url(#${k}b)"/>
  <path d="M70 118C60 104 62 88 70 78C78 88 80 104 70 118Z" fill="url(#${k}b)"/><circle cx="70" cy="72" r="5" fill="url(#${k}b)"/>
  ${flame(18, 114, 0.9)}${flame(44, 124, 1)}${flame(96, 124, 1)}${flame(122, 114, 0.9)}
</svg>`;
  }

  /* --------------------------------------------------------- Icons */
  const wrap = (inner, extra = '') => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;
  const icons = {
    diya: wrap(`<path d="M10 40Q32 62 54 40Z"/><path d="M6 40H58"/><path class="flame" d="M32 36C25 28 25 20 32 10C39 20 39 28 32 36Z" fill="currentColor" fill-opacity=".85"/>`),
    lotus: wrap(`<path d="M32 46C24 40 22 28 32 14C42 28 40 40 32 46Z"/><path d="M32 46C20 44 12 36 12 26C22 26 30 32 32 46Z"/><path d="M32 46C44 44 52 36 52 26C42 26 34 32 32 46Z"/><path d="M32 46C18 50 8 44 6 36C16 34 28 38 32 46Z" stroke-opacity=".7"/><path d="M32 46C46 50 56 44 58 36C48 34 36 38 32 46Z" stroke-opacity=".7"/>`),
    clock: wrap(`<circle cx="32" cy="32" r="22"/><path d="M32 18V32L42 38"/>`),
    pin: wrap(`<path d="M32 58C20 44 12 34 12 24a20 20 0 0 1 40 0c0 10 -8 20 -20 34Z"/><circle cx="32" cy="24" r="7"/>`),
    calendar: wrap(`<rect x="10" y="14" width="44" height="40" rx="4"/><path d="M10 26H54"/><path d="M22 8V18"/><path d="M42 8V18"/><path d="M20 36h6M29 36h6M38 36h6M20 45h6M29 45h6"/>`),
    directions: wrap(`<path d="M32 6L58 32L32 58L6 32Z"/><path d="M24 36V30H38"/><path d="M34 26L40 30L34 34"/>`),
    whatsapp: wrap(`<path d="M32 8a24 24 0 0 0 -20.6 36.3L8 56l12 -3.4A24 24 0 1 0 32 8Z"/><path d="M23 22c0 8 8 18 18 20l3 -4l-5 -3l-3 3c-3 -1 -7 -5 -8 -8l3 -3l-3 -5Z" fill="currentColor" stroke="none"/>`),
    phone: wrap(`<path d="M20 8h8l4 12 -6 4c2 6 8 12 14 14l4 -6 12 4v8a4 4 0 0 1 -4 4C30 48 16 34 16 12a4 4 0 0 1 4 -4Z"/>`),
    music: wrap(`<path d="M24 46V14L50 8V40"/><circle cx="18" cy="46" r="6"/><circle cx="44" cy="40" r="6"/>`),
    heart: wrap(`<path d="M32 54C12 40 6 28 12 18C17 10 28 10 32 20C36 10 47 10 52 18C58 28 52 40 32 54Z"/>`),
    rings: wrap(`<circle cx="24" cy="38" r="14"/><circle cx="40" cy="38" r="14"/><path d="M40 24L35 17H45Z"/><path d="M35 17L40 12L45 17"/>`),
    plane: wrap(`<path d="M6 30L58 10L40 56L32 36Z"/><path d="M32 36L58 10"/>`),
    train: wrap(`<rect x="14" y="6" width="36" height="42" rx="9"/><path d="M14 30H50"/><path d="M24 16H40"/><circle cx="24" cy="39" r="3"/><circle cx="40" cy="39" r="3"/><path d="M22 48L16 58"/><path d="M42 48L48 58"/><path d="M20 58H44" stroke-opacity=".6"/>`),
    hotel: wrap(`<path d="M8 50V18"/><path d="M8 34H56V50"/><path d="M8 42H56"/><rect x="14" y="24" width="14" height="8" rx="2"/>`),
    bell: wrap(`<path d="M32 8V14"/><path d="M18 44C18 30 22 16 32 16C42 16 46 30 46 44Z"/><path d="M14 44H50"/><circle cx="32" cy="50" r="3.5"/>`),
    arrow: wrap(`<path d="M32 12V50"/><path d="M18 36L32 50L46 36"/>`),
  };

  /* ------------------------------------------------- Background patterns */
  // Mughal jaal (ogee lattice) as a CSS background image
  function jaal(color = '#D4AF37', opacity = 0.08) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='90' viewBox='0 0 60 90'><g fill='none' stroke='${color}' stroke-opacity='${opacity}' stroke-width='1'><path d='M30 0C30 20 0 25 0 45C0 65 30 70 30 90M30 0C30 20 60 25 60 45C60 65 30 70 30 90'/><path d='M30 38C27 42 27 48 30 52C33 48 33 42 30 38Z' fill='${color}' fill-opacity='${opacity}'/></g><circle cx='0' cy='45' r='1.6' fill='${color}' fill-opacity='${opacity * 1.6}'/><circle cx='60' cy='45' r='1.6' fill='${color}' fill-opacity='${opacity * 1.6}'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  return { GOLD, id, mandala, garland, archPath, archFrame, ornament, corner, lotus, ganesha, monogram, palace, skyline, doorLeaf, lantern, samai, icons, jaal };
})();
