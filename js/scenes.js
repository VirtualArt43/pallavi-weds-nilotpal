/* ==========================================================================
   SCENES — one animated illustration per celebration.
   Each scene returns { html, init(el) } where init() wires the motion and
   returns { play(), pause() } so off-screen scenes cost nothing.
   All scenes are drawn in a 400×400 box and coloured from CSS variables.
   ========================================================================== */
window.Scenes = (() => {
  const f = (n) => Math.round(n * 10) / 10;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const gs = () => window.gsap;
  const svg = (inner, cls) => `<svg class="sc ${cls}" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
  const marigold = (x, y, r, cls = '') => `<g class="${cls}" transform="translate(${f(x)} ${f(y)})"><circle r="${r}" fill="#F28C0F"/><circle r="${f(r * 0.8)}" fill="none" stroke="#FFC247" stroke-width="${f(r * 0.2)}" stroke-dasharray="${f(r * 0.26)} ${f(r * 0.2)}"/><circle r="${f(r * 0.52)}" fill="#F9A825"/><circle r="${f(r * 0.3)}" fill="#FFD466"/><circle r="${f(r * 0.12)}" fill="#C2410C"/></g>`;
  const leaf = (x, y, a, s = 1) => `<path d="M0 0C8 -8 9 -22 0 -34C-9 -22 -8 -8 0 0Z" transform="translate(${f(x)} ${f(y)}) rotate(${a}) scale(${s})" fill="#3E8E4E" stroke="#1E5A2C" stroke-width=".8"/>`;
  const sparkle = (x, y, s, d) => `<path class="spk" style="animation-delay:${d}s" d="M${f(x)} ${f(y - 9 * s)}L${f(x + 2 * s)} ${f(y - 2 * s)}L${f(x + 9 * s)} ${f(y)}L${f(x + 2 * s)} ${f(y + 2 * s)}L${f(x)} ${f(y + 9 * s)}L${f(x - 2 * s)} ${f(y + 2 * s)}L${f(x - 9 * s)} ${f(y)}L${f(x - 2 * s)} ${f(y - 2 * s)}Z"/>`;
  const idle = { play() {}, pause() {} };

  /* ---------------------------------------------------------------- MEHENDI
     A henna medallion that draws itself, ring by ring, as you scroll.      */
  function mehendi() {
    const rings = [[], [], [], [], [], [], []];
    const P = 'pathLength="1"';
    const place = (ri, d, n, r, off = 0, cls = '', tilt = 0) => {
      for (let i = 0; i < n; i++) rings[ri].push(`<path ${P} class="hn ${cls}" d="${d}" transform="rotate(${f(off + (i * 360) / n)}) translate(0 ${-r})${tilt ? ` rotate(${i % 2 ? tilt : -tilt})` : ''}"/>`);
    };
    const circle = (ri, r, cls = '') => rings[ri].push(`<circle ${P} class="hn ${cls}" r="${r}"/>`);
    place(0, 'M0 0C6 -6 6 -13 0 -19C-6 -13 -6 -6 0 0Z', 8, 0, 0, 'fillp');
    circle(0, 23);
    place(1, 'M0 0C-9 -4 -13 -17 -6 -27C0 -35 12 -32 12 -22C12 -15 5 -13 3 -18', 12, 34);
    place(1, 'M0 -7C-4 -10 -6 -16 -3 -21', 12, 34, 0, 'thin');
    circle(2, 74);
    place(2, 'M0 0C4 -4 4 -9 0 -12C-4 -9 -4 -4 0 0', 24, 74);
    circle(3, 98, 'thin');
    place(3, 'M0 0C5 -5 5 -13 0 -19C-5 -13 -5 -5 0 0', 24, 98, 0, '', 52);
    place(4, 'M0 0C15 -13 15 -42 0 -60C-15 -42 -15 -13 0 0Z', 16, 112, 0, 'fillp');
    place(4, 'M0 -9C6 -19 6 -34 0 -46', 16, 112, 0, 'thin');
    place(5, 'M0 0C9 -9 9 -24 0 -34C-9 -24 -9 -9 0 0Z', 16, 128, 11.25, '');
    circle(6, 176);
    place(6, 'M-12 0A12 12 0 0 1 12 0', 32, 176, 5.625);
    let dots = '';
    for (let i = 0; i < 16; i++) { const a = (i * 22.5 - 90) * Math.PI / 180; dots += `<circle class="hdot" cx="${f(Math.cos(a) * 180)}" cy="${f(Math.sin(a) * 180)}" r="3"/>`; }
    for (let i = 0; i < 16; i++) { const a = (i * 22.5 + 11.25 - 90) * Math.PI / 180; dots += `<circle class="hdot" cx="${f(Math.cos(a) * 166)}" cy="${f(Math.sin(a) * 166)}" r="2.2"/>`; }
    for (let i = 0; i < 12; i++) { const a = (i * 30 - 90) * Math.PI / 180; dots += `<circle class="hdot" cx="${f(Math.cos(a) * 29)}" cy="${f(Math.sin(a) * 29)}" r="1.8"/>`; }
    const html = svg(`<g transform="translate(200 200)"><g class="mh-spin"><circle r="5" class="hcore"/>${rings.map((r, i) => `<g class="mh-ring" data-ring="${i}">${r.join('')}</g>`).join('')}<g class="mh-dots">${dots}</g></g></g>`, 'sc--mehendi');
    return {
      html,
      init(el) {
        const g = gs();
        if (!g || !window.ScrollTrigger) return idle;
        const rs = el.querySelectorAll('.mh-ring');
        const tl = g.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 45%', scrub: 0.8 } });
        rs.forEach((r, i) => tl.to(r.querySelectorAll('.hn'), { strokeDashoffset: 0, duration: 1, stagger: 0.012, ease: 'none' }, i * 0.55));
        tl.to(el.querySelectorAll('.hdot'), { opacity: 1, scale: 1, duration: 0.5, stagger: 0.01 }, '>-0.6');
        tl.to(el.querySelectorAll('.fillp'), { fillOpacity: 0.14, duration: 0.8 }, '<');
        return idle;
      },
    };
  }

  /* ------------------------------------------------------------------ HALDI
     A brass urli of turmeric paste, sun rays and flying haldi splashes.    */
  function haldi() {
    let rays = '';
    for (let i = 0; i < 32; i++) rays += `<path d="M-5 -104L0 -196L5 -104Z" transform="rotate(${f(i * 11.25)})"/>`;
    let drops = '';
    for (let i = 0; i < 14; i++) drops += `<circle class="hd-drop" cx="200" cy="236" r="${f(rnd(3.5, 7.5))}"/>`;
    let band = '';
    for (let i = 0; i < 13; i++) { const t = i / 12, x = 96 + t * 208, y = 268 + Math.sin(t * Math.PI) * 22; band += `<circle cx="${f(x)}" cy="${f(y)}" r="2.4"/>`; }
    const html = svg(`
  <defs>
    <linearGradient id="hdB" x1="0" x2="1"><stop offset="0" stop-color="#7A3E0E"/><stop offset=".3" stop-color="#E0A43C"/><stop offset=".48" stop-color="#FFE6A0"/><stop offset=".62" stop-color="#D08A28"/><stop offset="1" stop-color="#6E340C"/></linearGradient>
    <linearGradient id="hdR" x1="0" x2="1"><stop offset="0" stop-color="#9A5A16"/><stop offset=".5" stop-color="#FFE9A8"/><stop offset="1" stop-color="#9A5A16"/></linearGradient>
    <radialGradient id="hdP" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#FFE15A"/><stop offset=".7" stop-color="#F5B000"/><stop offset="1" stop-color="#D98A00"/></radialGradient>
  </defs>
  <g transform="translate(200 196)"><g class="hd-rays" fill="#FFFFFF" fill-opacity=".26">${rays}</g></g>
  <circle cx="200" cy="196" r="110" fill="#FFF6C4" fill-opacity=".32"/><circle cx="200" cy="196" r="86" fill="#FFF9DA" fill-opacity=".34"/>
  <g class="hd-float" style="animation-delay:-1s">${leaf(58, 118, -30, 0.9)}${marigold(70, 128, 17)}</g>
  <g class="hd-float" style="animation-delay:-2.2s">${leaf(342, 98, 30, 0.9)}${marigold(330, 110, 15)}</g>
  <g class="hd-float" style="animation-delay:-0.4s">${marigold(112, 58, 11)}</g>
  <g class="hd-float" style="animation-delay:-3s">${marigold(296, 44, 12)}</g>
  <g class="hd-drops" fill="#F5B000" stroke="#C98300" stroke-width=".8">${drops}</g>
  <ellipse cx="200" cy="330" rx="62" ry="10" fill="#7A2E08" fill-opacity=".35"/>
  <path d="M168 326Q200 334 232 326L224 306Q200 313 176 306Z" fill="url(#hdB)"/>
  <path d="M78 238C84 298 140 320 200 320C260 320 316 298 322 238Z" fill="url(#hdB)"/>
  <path d="M94 262Q200 300 306 262" fill="none" stroke="#6E340C" stroke-opacity=".45" stroke-width="2"/>
  <g fill="#FFF0B8" fill-opacity=".75">${band}</g>
  <ellipse cx="200" cy="238" rx="124" ry="25" fill="url(#hdR)"/>
  <ellipse cx="200" cy="238" rx="113" ry="19" fill="url(#hdP)"/>
  <ellipse cx="176" cy="233" rx="40" ry="5" fill="#FFF3A6" fill-opacity=".5"/>
  ${marigold(152, 236, 10)}${marigold(214, 232, 11)}${marigold(252, 240, 9)}
  <path d="M188 240C184 236 186 230 192 232" fill="none" stroke="#2E7D32" stroke-width="2"/>`, 'sc--haldi');
    return {
      html,
      init(el) {
        const g = gs();
        if (!g) return idle;
        const tl = g.timeline({ repeat: -1, paused: true });
        el.querySelectorAll('.hd-drop').forEach((d, i) => {
          const x0 = rnd(-70, 70), dx = rnd(-120, 120), h = rnd(90, 170), t = rnd(1.1, 1.7), at = rnd(0, 2.6);
          tl.fromTo(d, { x: x0, y: 0, opacity: 0, scale: 0.6 }, { keyframes: [
            { x: x0 + dx * 0.5, y: -h, opacity: 1, scale: 1, duration: t * 0.5, ease: 'power2.out' },
            { x: x0 + dx, y: -h * 0.15, opacity: 0, scale: 0.8, duration: t * 0.5, ease: 'power2.in' },
          ] }, at);
        });
        return { play: () => tl.play(), pause: () => tl.pause() };
      },
    };
  }

  /* ---------------------------------------------------------------- SANGEET
     A dholak on the beat, sweeping stage lights, an equaliser and notes.   */
  function sangeet() {
    let bars = '';
    for (let i = 0; i < 18; i++) {
      const h = f(rnd(26, 78)), x = 34 + i * 19;
      bars += `<rect class="sg-bar" x="${x}" y="${f(378 - h)}" width="12" height="${h}" rx="3" style="animation-duration:${f(rnd(0.55, 1.2))}s;animation-delay:${f(-rnd(0, 1))}s"/>`;
    }
    const note1 = (x, y) => `<g transform="translate(${x} ${y})"><ellipse rx="7" ry="5" transform="rotate(-22)"/><path d="M6 -2V-34Q16 -28 18 -16" fill="none" stroke-width="3"/></g>`;
    const note2 = (x, y) => `<g transform="translate(${x} ${y})"><ellipse rx="6.5" ry="4.8" transform="rotate(-22)"/><ellipse cx="22" cy="-6" rx="6.5" ry="4.8" transform="rotate(-22 22 -6)"/><path d="M5.5 -2V-34L27.5 -40V-8" fill="none" stroke-width="3"/><path d="M5.5 -30L27.5 -36" stroke-width="5"/></g>`;
    const notes = [[120, 150, note1, 0], [270, 140, note2, -1.1], [160, 120, note2, -2.2], [240, 160, note1, -0.6], [205, 130, note1, -1.7]]
      .map(([x, y, n, d]) => `<g class="sg-note" style="animation-delay:${d}s">${n(x, y)}</g>`).join('');
    let cords = '';
    for (let i = 0; i < 6; i++) { const x0 = 124 + i * 28; cords += `M${x0} 180L${x0 + 14} 262L${x0 + 28} 180`; }
    let rings = '';
    for (let i = 0; i < 6; i++) rings += `<circle cx="${138 + i * 28}" cy="262" r="3.2"/>`;
    const html = svg(`
  <defs>
    <linearGradient id="sgBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE6FA" stop-opacity=".5"/><stop offset="1" stop-color="#FFB3E6" stop-opacity="0"/></linearGradient>
    <linearGradient id="sgWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E07A3C"/><stop offset=".45" stop-color="#A8431C"/><stop offset="1" stop-color="#5E1F0C"/></linearGradient>
    <radialGradient id="sgHead" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#FFF6E2"/><stop offset="1" stop-color="#E4C9A0"/></radialGradient>
  </defs>
  <g class="sg-beam sg-beam--l"><path d="M44 -20L-60 420H150Z" fill="url(#sgBeam)"/></g>
  <g class="sg-beam sg-beam--r"><path d="M356 -20L250 420H460Z" fill="url(#sgBeam)"/></g>
  <g class="sg-bars">${bars}</g>
  <g class="sg-notes">${notes}</g>
  <g class="sg-drum">
    <ellipse class="sg-ripple" cx="112" cy="221" rx="17" ry="50"/><ellipse class="sg-ripple sg-ripple--b" cx="288" cy="221" rx="17" ry="50"/>
    <path d="M112 172Q200 150 288 172L288 270Q200 292 112 270Z" fill="url(#sgWood)"/>
    <path d="M112 186Q200 166 288 186M112 256Q200 276 288 256" fill="none" stroke="#F6D08A" stroke-width="3"/>
    <path d="M112 194Q200 175 288 194M112 248Q200 268 288 248" fill="none" stroke="#F6D08A" stroke-width="1" stroke-opacity=".6"/>
    <path d="${cords}" fill="none" stroke="#FFF1D6" stroke-width="1.6" stroke-opacity=".85"/>
    <g fill="#F6D08A">${rings}</g>
    <ellipse cx="112" cy="221" rx="17" ry="50" fill="url(#sgHead)" stroke="#F6D08A" stroke-width="3"/>
    <ellipse cx="288" cy="221" rx="17" ry="50" fill="url(#sgHead)" stroke="#F6D08A" stroke-width="3"/>
    <ellipse cx="288" cy="221" rx="7" ry="22" fill="#3A1A10" fill-opacity=".55"/>
  </g>
  <g class="sg-spk">${sparkle(70, 90, 1, 0)}${sparkle(334, 70, 0.8, -0.7)}${sparkle(300, 318, 0.7, -1.3)}${sparkle(90, 300, 0.9, -0.3)}${sparkle(200, 60, 0.7, -1.8)}</g>`, 'sc--sangeet');
    return { html, init: () => idle };
  }

  /* ----------------------------------------------------------------- VIVAH
     The mandap, the sacred fire and seven diyas circling it — saat phere. */
  function wedding() {
    const pillar = (x, top, bottom, w, op = 1) => {
      let bands = '';
      for (let y = top + 40; y < bottom - 30; y += 46) bands += `<rect x="${f(x - w * 0.62)}" y="${f(y)}" width="${f(w * 1.24)}" height="${f(w * 0.34)}" fill="url(#vvG)"/>`;
      let garl = '';
      for (let y = top + 18, i = 0; y < bottom - 18; y += 9, i++) garl += `<circle cx="${f(x + Math.sin(i * 0.9) * w * 0.42)}" cy="${f(y)}" r="${f(w * 0.2)}" fill="${i % 2 ? '#F9A825' : '#F28C0F'}"/>`;
      return `<g opacity="${op}"><rect x="${f(x - w / 2)}" y="${top}" width="${w}" height="${bottom - top}" fill="url(#vvP)"/>${bands}${garl}
        <path d="M${f(x - w)} ${top}H${f(x + w)}L${f(x + w * 0.6)} ${f(top + w * 0.9)}H${f(x - w * 0.6)}Z" fill="url(#vvG)"/>
        <rect x="${f(x - w * 0.95)}" y="${f(bottom - w * 0.9)}" width="${f(w * 1.9)}" height="${f(w * 0.9)}" fill="url(#vvG)"/></g>`;
    };
    let swags = '';
    for (let i = 0; i < 4; i++) { const x0 = 42 + i * 79; swags += `M${x0} 104Q${x0 + 39.5} 138 ${x0 + 79} 104`; }
    const strand = (x, len, d) => {
      let s = '';
      for (let y = 112, i = 0; y < 112 + len; y += 10, i++) s += `<circle cx="${x}" cy="${y}" r="4.6" fill="${i % 2 ? '#F9A825' : '#F28C0F'}"/>`;
      return `<g class="vv-strand" style="transform-origin:${x}px 104px;animation-delay:${d}s"><path d="M${x} 104V${112 + len}" stroke="#7A3A0C" stroke-width="1.4"/>${s}${leaf(x, 116 + len, 180, 0.5)}</g>`;
    };
    let rangoli = '';
    for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2; rangoli += `<circle cx="${f(200 + Math.cos(a) * 156)}" cy="${f(350 + Math.sin(a) * 20)}" r="${i % 2 ? 1.8 : 2.8}"/>`; }
    let embers = '';
    for (let i = 0; i < 12; i++) embers += `<circle class="vv-ember" cx="${f(200 + rnd(-18, 18))}" cy="250" r="${f(rnd(1.2, 2.6))}" style="--dx:${f(rnd(-40, 40))}px;animation-delay:${f(-rnd(0, 2.4))}s;animation-duration:${f(rnd(1.8, 3))}s"/>`;
    const diya = `<g class="vv-diya"><path d="M-11 0Q0 12 11 0Z" fill="url(#vvG)"/><path d="M-12 0H12" stroke="#F3D58A" stroke-width="1.4"/><path class="vv-dflame" d="M0 -1C-3.5 -5 -3 -10 0 -15C3 -10 3.5 -5 0 -1Z" fill="#FFC44D"/></g>`;
    const html = svg(`
  <defs>
    <linearGradient id="vvG" x1="0" x2="1"><stop offset="0" stop-color="#9C7420"/><stop offset=".5" stop-color="#FBE7A6"/><stop offset="1" stop-color="#9C7420"/></linearGradient>
    <linearGradient id="vvP" x1="0" x2="1"><stop offset="0" stop-color="#C9A24A"/><stop offset=".45" stop-color="#FFF1C8"/><stop offset="1" stop-color="#B08A30"/></linearGradient>
    <linearGradient id="vvK" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D0662A"/><stop offset="1" stop-color="#7A2A10"/></linearGradient>
    <radialGradient id="vvGlow"><stop offset="0" stop-color="#FFC66B" stop-opacity=".75"/><stop offset=".5" stop-color="#FF8A2A" stop-opacity=".25"/><stop offset="1" stop-color="#FF6A00" stop-opacity="0"/></radialGradient>
    <linearGradient id="vvF1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E4501A"/><stop offset="1" stop-color="#FF9A2E" stop-opacity=".2"/></linearGradient>
    <linearGradient id="vvF2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF9A2E"/><stop offset="1" stop-color="#FFD27A"/></linearGradient>
  </defs>
  <circle class="vv-glow" cx="200" cy="286" r="120" fill="url(#vvGlow)"/>
  <ellipse cx="200" cy="350" rx="178" ry="27" fill="#000" fill-opacity=".18" stroke="#F3D58A" stroke-opacity=".5"/>
  <g fill="#F3D58A" fill-opacity=".8">${rangoli}</g>
  ${pillar(122, 112, 330, 10, 0.55)}${pillar(278, 112, 330, 10, 0.55)}
  <g class="vv-back"></g>
  <path d="M40 92Q200 22 360 92Z" fill="#B3121B" stroke="#F3D58A" stroke-width="2"/>
  <path d="M86 78Q200 38 314 78" fill="none" stroke="#F3D58A" stroke-width="1.2" stroke-dasharray="3 5"/>
  <g transform="translate(200 40)"><path d="M0 -8C-10 -8 -12 4 -8 10H8C12 4 10 -8 0 -8Z" fill="url(#vvG)"/><path d="M-4 -8L0 -22L4 -8" fill="#3E8E4E"/><circle cy="-24" r="3.4" fill="#F3D58A"/></g>
  <rect x="38" y="90" width="324" height="15" fill="url(#vvG)"/>
  <path d="M38 97.5H362" stroke="#8C1D12" stroke-width="1.6" stroke-dasharray="6 4"/>
  <path d="${swags}" fill="#C8141C" fill-opacity=".92" stroke="#F3D58A" stroke-width="1.6"/>
  ${strand(80, 56, 0)}${strand(160, 40, -0.8)}${strand(240, 40, -1.6)}${strand(320, 56, -2.4)}
  <path d="M130 338L270 338L258 318L142 318Z" fill="url(#vvK)" stroke="#F3D58A" stroke-width="1.4"/>
  <path d="M146 318L254 318L244 302L156 302Z" fill="url(#vvK)" stroke="#F3D58A" stroke-width="1.4"/>
  <path d="M160 302L240 302L232 290L168 290Z" fill="url(#vvK)" stroke="#F3D58A" stroke-width="1.4"/>
  <g class="vv-fire">
    <path class="fl fl1" d="M200 292C168 282 164 248 184 222C186 238 194 242 197 232C192 208 205 188 222 174C216 200 236 214 234 242C232 266 222 284 200 292Z" fill="url(#vvF1)"/>
    <path class="fl fl2" d="M200 292C178 284 176 258 190 238C193 250 199 252 201 244C199 226 208 212 218 204C215 222 228 234 226 254C224 272 216 286 200 292Z" fill="url(#vvF2)"/>
    <path class="fl fl3" d="M200 292C188 286 188 270 196 258C198 266 202 266 203 260C204 250 208 244 212 240C212 252 218 262 216 274C214 284 208 290 200 292Z" fill="#FFF3C4"/>
  </g>
  <ellipse cx="200" cy="290" rx="34" ry="5.5" fill="#3A0A08"/>
  <g fill="#FFD27A">${embers}</g>
  <g class="vv-front"></g>
  ${pillar(58, 104, 336, 16)}${pillar(342, 104, 336, 16)}`, 'sc--wedding');
    return {
      html,
      init(el) {
        const back = el.querySelector('.vv-back'), front = el.querySelector('.vv-front');
        const diyas = [];
        for (let i = 0; i < 7; i++) {
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.innerHTML = diya;
          front.appendChild(g);
          diyas.push({ g, a: (i / 7) * Math.PI * 2, side: 1 });
        }
        let angle = 0, running = false, last = 0;
        const place = () => {
          diyas.forEach((d) => {
            const a = d.a + angle, s = Math.sin(a);
            const x = 200 + Math.cos(a) * 150, y = 312 + s * 30;
            const depth = (s + 1) / 2;
            d.g.setAttribute('transform', `translate(${f(x)} ${f(y)}) scale(${f(0.72 + depth * 0.38)})`);
            d.g.setAttribute('opacity', f(0.55 + depth * 0.45));
            const side = s < 0 ? -1 : 1;
            if (side !== d.side) { (side < 0 ? back : front).appendChild(d.g); d.side = side; }
          });
        };
        const tick = (t) => { if (!running) return; const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t; angle += dt * 0.42; place(); requestAnimationFrame(tick); };
        place();
        return {
          play() { if (!running) { running = true; last = 0; requestAnimationFrame(tick); } },
          pause() { running = false; },
        };
      },
    };
  }

  /* ------------------------------------------------------------- RECEPTION
     A crystal chandelier swaying gently, candles and glinting crystals.    */
  function reception() {
    const cupsLow = [[62, 196], [106, 206], [154, 212], [246, 212], [294, 206], [338, 196]];
    const cupsHigh = [[124, 128], [164, 134], [236, 134], [276, 128]];
    const arm = ([cx, cy], hubY) => `M200 ${hubY}C${f(200 + (cx - 200) * 0.28)} ${f(hubY + 38)} ${f(cx)} ${f(cy + 44)} ${f(cx)} ${f(cy + 8)}`;
    const cup = ([cx, cy], d) => `<path d="M${cx - 10} ${cy + 6}Q${cx} ${cy + 15} ${cx + 10} ${cy + 6}Z" fill="url(#rcG)"/><rect x="${cx - 2.6}" y="${cy - 12}" width="5.2" height="18" rx="1.4" fill="#FFF8EA"/>
      <g class="rc-flame" style="transform-origin:${cx}px ${cy - 12}px;animation-delay:${d}s"><path d="M${cx} ${cy - 12}C${cx - 4} ${cy - 17} ${cx - 3.5} ${cy - 23} ${cx} ${cy - 29}C${cx + 3.5} ${cy - 23} ${cx + 4} ${cy - 17} ${cx} ${cy - 12}Z" fill="#FFC44D"/><circle cx="${cx}" cy="${cy - 18}" r="11" fill="url(#rcHalo)"/></g>
      <path d="M${cx} ${cy + 14}L${cx + 4} ${cy + 22}L${cx} ${cy + 33}L${cx - 4} ${cy + 22}Z" fill="#E8F1FF" fill-opacity=".8"/>`;
    const beads = (a, b, sag) => {
      let s = '';
      const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag];
      const n = Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 7);
      for (let i = 1; i < n; i++) { const t = i / n, u = 1 - t; s += `<circle cx="${f(u * u * a[0] + 2 * u * t * c[0] + t * t * b[0])}" cy="${f(u * u * a[1] + 2 * u * t * c[1] + t * t * b[1])}" r="1.6"/>`; }
      return s;
    };
    let sw = '';
    for (let i = 0; i < cupsLow.length - 1; i++) sw += beads([cupsLow[i][0], cupsLow[i][1] + 10], [cupsLow[i + 1][0], cupsLow[i + 1][1] + 10], 26);
    for (let i = 0; i < cupsHigh.length - 1; i++) sw += beads([cupsHigh[i][0], cupsHigh[i][1] + 10], [cupsHigh[i + 1][0], cupsHigh[i + 1][1] + 10], 16);
    let bokeh = '';
    for (let i = 0; i < 12; i++) bokeh += `<circle class="rc-bokeh" cx="${f(rnd(20, 380))}" cy="${f(rnd(260, 400))}" r="${f(rnd(6, 20))}" style="animation-delay:${f(-rnd(0, 9))}s;animation-duration:${f(rnd(7, 12))}s"/>`;
    let chain = '';
    for (let y = 8; y < 60; y += 7) chain += `<ellipse cx="200" cy="${y}" rx="${y % 14 ? 2.2 : 3.2}" ry="3.6" fill="none" stroke="url(#rcG)" stroke-width="1.6"/>`;
    const spk = [[62, 232], [154, 248], [246, 248], [338, 232], [200, 312], [124, 160], [276, 160], [106, 240], [294, 240], [200, 268]]
      .map(([x, y], i) => sparkle(x, y, 0.75, -i * 0.37)).join('');
    const html = svg(`
  <defs>
    <linearGradient id="rcG" x1="0" x2="1"><stop offset="0" stop-color="#9C7420"/><stop offset=".5" stop-color="#FFF0BE"/><stop offset="1" stop-color="#9C7420"/></linearGradient>
    <radialGradient id="rcHalo"><stop offset="0" stop-color="#FFD98A" stop-opacity=".6"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>
    <radialGradient id="rcBig"><stop offset="0" stop-color="#FFE7B0" stop-opacity=".35"/><stop offset="1" stop-color="#FFE7B0" stop-opacity="0"/></radialGradient>
  </defs>
  <g class="rc-bokehs">${bokeh}</g>
  <circle cx="200" cy="190" r="170" fill="url(#rcBig)"/>
  <ellipse cx="200" cy="4" rx="26" ry="7" fill="url(#rcG)"/>
  <g class="rc-swing">
    ${chain}
    <path d="M168 76Q200 54 232 76" fill="none" stroke="url(#rcG)" stroke-width="3"/>
    <ellipse cx="200" cy="72" rx="12" ry="9" fill="url(#rcG)"/>
    <path d="M190 86Q200 80 210 86L206 112Q200 118 194 112Z" fill="url(#rcG)"/>
    <ellipse cx="200" cy="122" rx="15" ry="7" fill="url(#rcG)"/>
    <path d="M192 128Q200 124 208 128L205 170Q200 174 195 170Z" fill="url(#rcG)"/>
    <ellipse cx="200" cy="178" rx="22" ry="9" fill="url(#rcG)"/>
    <path d="${cupsHigh.map((c) => arm(c, 124)).join('')}" fill="none" stroke="url(#rcG)" stroke-width="3.2" stroke-linecap="round"/>
    <path d="${cupsLow.map((c) => arm(c, 180)).join('')}" fill="none" stroke="url(#rcG)" stroke-width="3.6" stroke-linecap="round"/>
    <g fill="#E8F1FF" fill-opacity=".85">${sw}</g>
    ${cupsHigh.map((c, i) => cup(c, -i * 0.3)).join('')}${cupsLow.map((c, i) => cup(c, -i * 0.45)).join('')}
    <path d="M200 186V246" stroke="#E8F1FF" stroke-opacity=".7" stroke-width="1.4" stroke-dasharray="2 4"/>
    <path d="M200 246L212 268L200 304L188 268Z" fill="#E8F1FF" fill-opacity=".75" stroke="#FFFFFF" stroke-width=".8"/>
    <path d="M200 246V304M188 268H212" stroke="#9EC5FF" stroke-opacity=".6" stroke-width=".8"/>
    <g class="rc-spk">${spk}</g>
  </g>`, 'sc--reception');
    return { html, init: () => idle };
  }

  /* ---------------------------------------------------------------- KALASH
     Fallback for any other ceremony — an auspicious kalash with a halo.     */
  function kalash() {
    let rays = '';
    for (let i = 0; i < 24; i++) rays += `<path d="M-4 -120L0 -186L4 -120Z" transform="rotate(${i * 15})"/>`;
    const html = svg(`
  <defs><linearGradient id="klG" x1="0" x2="1"><stop offset="0" stop-color="#9C7420"/><stop offset=".45" stop-color="#FFF0BE"/><stop offset="1" stop-color="#9C7420"/></linearGradient></defs>
  <g transform="translate(200 200)"><g class="hd-rays" fill="currentColor" fill-opacity=".18">${rays}</g></g>
  <circle cx="200" cy="200" r="112" fill="currentColor" fill-opacity=".07"/>
  ${leaf(200, 150, -64, 1.5)}${leaf(200, 150, -32, 1.6)}${leaf(200, 150, 0, 1.7)}${leaf(200, 150, 32, 1.6)}${leaf(200, 150, 64, 1.5)}
  <ellipse cx="200" cy="140" rx="30" ry="36" fill="#8A5A2B"/><path d="M178 120Q200 100 222 120" stroke="#5E3A18" stroke-width="3" fill="none"/>
  <path d="M170 176H230L224 162H176Z" fill="url(#klG)"/>
  <path d="M176 176C120 196 120 300 200 312C280 300 280 196 224 176Z" fill="url(#klG)"/>
  <path d="M146 226Q200 246 254 226" stroke="#A4161A" stroke-width="5" fill="none"/>
  <g fill="#A4161A">${[150, 175, 200, 225, 250].map((x) => `<circle cx="${x}" cy="${x === 200 ? 262 : 258}" r="4"/>`).join('')}</g>
  <path d="M168 318H232L224 306H176Z" fill="url(#klG)"/>`, 'sc--kalash');
    return { html, init: () => idle };
  }

  /* shared bits for the puja scenes */
  const flameG = (id) => `<linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E4501A"/><stop offset=".55" stop-color="#FFB02E"/><stop offset="1" stop-color="#FFE9A0"/></linearGradient>`;
  const flame = (x, y, s, gid, d = 0) => `<g class="sfl" style="animation-delay:${d}s"><path d="M${f(x)} ${f(y)}C${f(x - 5 * s)} ${f(y - 6 * s)} ${f(x - 4 * s)} ${f(y - 14 * s)} ${f(x)} ${f(y - 22 * s)}C${f(x + 4 * s)} ${f(y - 14 * s)} ${f(x + 5 * s)} ${f(y - 6 * s)} ${f(x)} ${f(y)}Z" fill="url(#${gid})"/><path d="M${f(x)} ${f(y - 2 * s)}C${f(x - 2 * s)} ${f(y - 6 * s)} ${f(x - 1.6 * s)} ${f(y - 10 * s)} ${f(x)} ${f(y - 13 * s)}C${f(x + 1.6 * s)} ${f(y - 10 * s)} ${f(x + 2 * s)} ${f(y - 6 * s)} ${f(x)} ${f(y - 2 * s)}Z" fill="#FFF8E0"/></g>`;
  const diyaAt = (x, y, s, gold, fl, d = 0) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})"><path d="M-15 0Q0 15 15 0Z" fill="url(#${gold})"/><path d="M-16 0H16" stroke="#FFE3A8" stroke-width="1.4"/></g>${flame(x, y - 1 * s, 0.9 * s, fl, d)}`;
  const smoke = (x, y, d) => `<path class="smoke" pathLength="1" style="animation-delay:${d}s" d="M${x} ${y}C${x - 8} ${y - 20} ${x + 10} ${y - 36} ${x + 2} ${y - 56}C${x - 6} ${y - 76} ${x + 12} ${y - 92} ${x + 4} ${y - 116}"/>`;

  /* ---------------------------------------------------------- SHIVCHARCHA
     The Shivling with water dripping from the jaladhari, a trishul with a
     damru, bel leaves and a crescent moon over an indigo night.            */
  function shiv() {
    let drops = '';
    for (let i = 0; i < 4; i++) drops += `<ellipse class="sv-drop" cx="200" cy="110" rx="2.4" ry="3.4" style="animation-delay:${f(-i * 0.5)}s"/>`;
    const bel = (a) => `<path d="M0 0C6 -7 7 -17 0 -26C-7 -17 -6 -7 0 0Z" transform="translate(200 186) rotate(${a})" fill="#4E9A51" stroke="#1E5A2C" stroke-width=".8"/>`;
    const stars = [[48, 58, 0.6, 0], [112, 30, 0.5, -0.8], [262, 30, 0.45, -1.5], [370, 150, 0.5, -0.4], [40, 196, 0.45, -1.9]].map(([x, y, sc, d]) => sparkle(x, y, sc, d)).join('');
    const html = svg(`
  <defs>
    <radialGradient id="svGlow"><stop offset="0" stop-color="#A9BEFF" stop-opacity=".42"/><stop offset="1" stop-color="#A9BEFF" stop-opacity="0"/></radialGradient>
    <radialGradient id="svMoon" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#CBD5F5"/></radialGradient>
    <linearGradient id="svStone" x1="0" x2="1"><stop offset="0" stop-color="#171B36"/><stop offset=".42" stop-color="#4A5584"/><stop offset=".62" stop-color="#2C3358"/><stop offset="1" stop-color="#12152B"/></linearGradient>
    <linearGradient id="svCu" x1="0" x2="1"><stop offset="0" stop-color="#6E3210"/><stop offset=".5" stop-color="#EBA46A"/><stop offset="1" stop-color="#6E3210"/></linearGradient>
    <linearGradient id="svG" x1="0" x2="1"><stop offset="0" stop-color="#9C7420"/><stop offset=".5" stop-color="#FBE7A6"/><stop offset="1" stop-color="#9C7420"/></linearGradient>
    ${flameG('svFl')}
    <mask id="svCres"><rect x="270" y="30" width="100" height="100" fill="#fff"/><circle cx="333" cy="68" r="26" fill="#000"/></mask>
  </defs>
  <circle class="sv-halo" cx="200" cy="236" r="160" fill="url(#svGlow)"/>
  <circle cx="318" cy="78" r="48" fill="#A9BEFF" fill-opacity=".12"/>
  <circle cx="318" cy="78" r="30" fill="url(#svMoon)" mask="url(#svCres)"/>
  <g class="sg-spk">${stars}</g>
  <g stroke="url(#svG)" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M84 96C60 96 56 74 60 54" stroke-width="4"/><path d="M84 96C108 96 112 74 108 54" stroke-width="4"/><path d="M84 96V40" stroke-width="4"/>
    <path d="M72 104H96" stroke-width="3.4"/>
  </g>
  <rect x="81.5" y="76" width="5" height="258" rx="2" fill="url(#svG)"/>
  <path d="M84 26L77 44H91Z M60 42L53 58L66 57Z M108 42L102 57L115 58Z" fill="url(#svG)"/>
  <path d="M84 110C95 112 99 121 92 127" stroke="#D72638" stroke-width="3" fill="none" stroke-linecap="round"/>
  <g class="sv-damru">
    <path d="M68 118L84 128L100 118V142L84 132L68 142Z" fill="url(#svCu)" stroke="#F3D58A" stroke-width="1"/>
    <ellipse cx="68" cy="130" rx="4" ry="12" fill="#F6E7C8" stroke="#F3D58A"/><ellipse cx="100" cy="130" rx="4" ry="12" fill="#F6E7C8" stroke="#F3D58A"/>
    <path d="M84 131C80 142 76 150 78 158M84 131C88 142 92 150 90 158" stroke="#F3D58A" stroke-width="1" fill="none"/><circle cx="78" cy="160" r="2.6" fill="#F3D58A"/><circle cx="90" cy="160" r="2.6" fill="#F3D58A"/>
  </g>
  <g stroke="url(#svG)" stroke-width="1.4"><path d="M200 0V42M172 0L190 44M228 0L210 44"/></g>
  <path d="M186 42H214L210 50C228 58 230 84 212 94L205 99H195L188 94C170 84 172 58 190 50Z" fill="url(#svCu)" stroke="#F3D58A" stroke-width=".8"/>
  <path d="M190 56H210M188 76Q200 82 212 76" stroke="#F3D58A" stroke-width="1.2" fill="none"/>
  <path d="M196 99L200 108L204 99Z" fill="url(#svCu)"/>
  <g>${drops}</g>
  <path d="M92 300C92 284 158 276 200 276C236 276 292 280 316 288L358 290C366 291 366 305 358 306L316 308C292 316 236 324 200 324C152 324 92 316 92 300Z" fill="url(#svStone)" stroke="#C9D0F0" stroke-opacity=".45"/>
  <ellipse cx="200" cy="294" rx="92" ry="15" fill="#39406A"/>
  <path d="M312 295L356 297" stroke="#BFD4FF" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M168 296V208C168 176 232 176 232 208V296Z" fill="url(#svStone)" stroke="#C9D0F0" stroke-opacity=".6"/>
  <path d="M182 206C182 192 191 186 200 186" stroke="#FFFFFF" stroke-opacity=".22" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M172 222Q200 228 228 222M172 233Q200 239 228 233M172 244Q200 250 228 244" stroke="#F4F2EA" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <circle cx="200" cy="236" r="3.6" fill="#D72638"/>
  <ellipse class="sv-splash" cx="200" cy="182" rx="7" ry="2.2" fill="none" stroke="#BFD4FF" stroke-width="1.2"/>
  ${bel(-38)}${bel(0)}${bel(38)}
  ${marigold(118, 318, 9)}${marigold(146, 327, 8)}${marigold(254, 327, 8)}${marigold(282, 318, 9)}
  ${diyaAt(340, 340, 1.1, 'svG', 'svFl')}`, 'sc--shiv');
    return { html, init: () => idle };
  }

  /* ---------------------------------------------------------- SATYANARAYAN
     A kalash on a red-draped chowki under banana leaves, with diyas, a
     mango-leaf toran and incense curling up.                               */
  function satyanarayan() {
    const bLeaf = (L, W) => `M0 0C${f(L * 0.25)} ${f(-W)} ${f(L * 0.75)} ${f(-W * 1.05)} ${L} ${f(-W * 0.1)}C${f(L * 0.72)} ${f(W * 0.55)} ${f(L * 0.3)} ${f(W * 0.45)} 0 0Z`;
    const plant = (x, dir, d) => {
      const leaves = [[-164, 116], [-128, 130], [-92, 120], [-56, 108], [-22, 90]].map(([a, L]) => {
        const ang = dir > 0 ? a : -180 - a;
        return `<g transform="translate(${x} 150) rotate(${ang})${dir > 0 ? '' : ' scale(1 -1)'}"><path d="${bLeaf(L, 17)}" fill="url(#syLeaf)" stroke="#1E5A2C" stroke-width=".8"/><path d="M0 0Q${f(L * 0.5)} -6 ${L} -1.7" stroke="#DDF0C0" stroke-opacity=".7" fill="none"/></g>`;
      }).join('');
      return `<path d="M${x - 9} 362C${x - 10} 300 ${x - 6} 220 ${x - 3} 150H${x + 3}C${x + 6} 220 ${x + 10} 300 ${x + 9} 362Z" fill="url(#syStem)"/><g class="sy-plant" style="transform-origin:${x}px 150px;animation-delay:${d}s">${leaves}</g>`;
    };
    let toran = '';
    for (let i = 1; i < 12; i++) {
      const t = i / 12, x = 64 + t * 272, y = 132 + Math.sin(t * Math.PI) * 26;
      toran += leaf(x, y + 2, 180, 0.42);
    }
    let rays = '';
    for (let i = 0; i < 28; i++) rays += `<path d="M-4 -96L0 -170L4 -96Z" transform="rotate(${f(i * 360 / 28)})"/>`;
    let garland = '';
    for (let i = 0; i < 8; i++) garland += marigold(110 + i * 26, 306, 6);
    const html = svg(`
  <defs>
    <linearGradient id="syLeaf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2E7D32"/><stop offset="1" stop-color="#7BC67E"/></linearGradient>
    <linearGradient id="syStem" x1="0" x2="1"><stop offset="0" stop-color="#8DB46A"/><stop offset=".5" stop-color="#DDEFC2"/><stop offset="1" stop-color="#7FA85C"/></linearGradient>
    <linearGradient id="syG" x1="0" x2="1"><stop offset="0" stop-color="#9C7420"/><stop offset=".45" stop-color="#FFF0BE"/><stop offset="1" stop-color="#9C7420"/></linearGradient>
    <radialGradient id="syGlow"><stop offset="0" stop-color="#FFC66B" stop-opacity=".5"/><stop offset="1" stop-color="#FFC66B" stop-opacity="0"/></radialGradient>
    ${flameG('syFl')}
  </defs>
  <circle cx="200" cy="228" r="150" fill="url(#syGlow)"/>
  <g transform="translate(200 228)"><g class="hd-rays" fill="#FFE3A8" fill-opacity=".16">${rays}</g></g>
  ${plant(62, 1, 0)}${plant(338, -1, -2.2)}
  <path d="M64 132Q200 184 336 132" fill="none" stroke="#7A3A0C" stroke-width="1.6"/>${toran}
  <g class="sy-smokes">${smoke(300, 262, 0)}${smoke(308, 264, -1.6)}</g>
  <path d="M294 298L298 264M302 298L310 266" stroke="#5E2A10" stroke-width="1.6"/><circle cx="298" cy="263" r="1.8" fill="#FF7A2E"/><circle cx="310" cy="265" r="1.8" fill="#FF7A2E"/>
  <ellipse cx="200" cy="140" rx="30" ry="34" fill="#8A5A2B"/><path d="M178 122Q200 102 222 122" stroke="#5E3A18" stroke-width="3" fill="none"/>
  ${leaf(200, 176, -62, 1.2)}${leaf(200, 176, -30, 1.3)}${leaf(200, 176, 30, 1.3)}${leaf(200, 176, 62, 1.2)}
  <path d="M172 212H228L222 196H178Z" fill="url(#syG)"/>
  <path d="M178 212C130 228 132 294 200 300C268 294 270 228 222 212Z" fill="url(#syG)"/>
  <path d="M152 246Q200 264 248 246" stroke="#A4161A" stroke-width="5" fill="none"/>
  <g fill="#A4161A"><circle cx="172" cy="272" r="3.4"/><circle cx="200" cy="278" r="3.4"/><circle cx="228" cy="272" r="3.4"/></g>
  <path d="M92 298H308V330Q296 340 284 330Q272 340 260 330Q248 340 236 330Q224 340 212 330Q200 340 188 330Q176 340 164 330Q152 340 140 330Q128 340 116 330Q104 340 92 330Z" fill="#B3121B" stroke="#F3D58A" stroke-width="1.4"/>
  <path d="M92 312H308" stroke="#F3D58A" stroke-width="1.2" stroke-dasharray="4 4"/>
  <path d="M104 336V360M296 336V360" stroke="#5E2A10" stroke-width="6"/>
  ${garland}
  ${diyaAt(128, 296, 1.1, 'syG', 'syFl')}${diyaAt(272, 296, 1.1, 'syG', 'syFl', -0.3)}`, 'sc--satyanarayan');
    return { html, init: () => idle };
  }

  /* ------------------------------------------------------------- DEVPOOJAN
     An aarti thali with a five-flame diya circling in aarti, kumkum, haldi,
     rice and flowers, and a temple bell ringing.                           */
  function devpoojan() {
    let rim = '';
    for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; rim += `<circle cx="${f(200 + Math.cos(a) * 118)}" cy="${f(282 + Math.sin(a) * 27)}" r="1.8"/>`; }
    let rice = '';
    for (let i = 0; i < 16; i++) rice += `<ellipse cx="${f(272 + rnd(-14, 14))}" cy="${f(292 + rnd(-5, 5))}" rx="2" ry="1.1" transform="rotate(${f(rnd(0, 180))} ${f(272)} ${f(292)})"/>`;
    const wicks = [170, 185, 200, 215, 230];
    const stars = [[60, 90, 0.6, 0], [340, 180, 0.5, -1], [80, 210, 0.5, -1.6], [150, 60, 0.45, -0.6]].map(([x, y, sc, d]) => sparkle(x, y, sc, d)).join('');
    const html = svg(`
  <defs>
    <linearGradient id="dpG" x1="0" x2="1"><stop offset="0" stop-color="#9C7420"/><stop offset=".5" stop-color="#FFF0BE"/><stop offset="1" stop-color="#9C7420"/></linearGradient>
    <radialGradient id="dpGlow"><stop offset="0" stop-color="#FFD27A" stop-opacity=".55"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>
    <radialGradient id="dpHalo"><stop offset="0" stop-color="#FFE9A0" stop-opacity=".7"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>
    ${flameG('dpFl')}
  </defs>
  <text x="200" y="222" text-anchor="middle" font-family="'Tiro Devanagari Hindi', serif" font-size="230" fill="#FFE3A8" fill-opacity=".09">ॐ</text>
  <circle class="dp-glow" cx="200" cy="240" r="140" fill="url(#dpGlow)"/>
  <g class="sg-spk">${stars}</g>
  <g class="dp-bell">
    <path d="M330 0V52" stroke="#E9CC7A" stroke-width="2" stroke-dasharray="5 3"/>
    <circle cx="330" cy="54" r="4" fill="none" stroke="url(#dpG)" stroke-width="2"/>
    <path d="M312 104C312 74 318 60 330 58C342 60 348 74 348 104Z" fill="url(#dpG)"/>
    <path d="M306 104H354" stroke="#E9CC7A" stroke-width="4" stroke-linecap="round"/>
    <circle cx="330" cy="112" r="5" fill="url(#dpG)"/>
  </g>
  <g fill="none" stroke="#FFE3A8" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round">
    <path class="dp-w" d="M362 70Q374 84 362 98"/><path class="dp-w dp-w2" d="M372 62Q390 84 372 106"/>
    <path class="dp-w" d="M298 70Q286 84 298 98"/><path class="dp-w dp-w2" d="M288 62Q270 84 288 106"/>
  </g>
  <g class="dp-aarti">
    <ellipse cx="200" cy="294" rx="128" ry="30" fill="#2A0C02" fill-opacity=".35"/>
    <ellipse cx="200" cy="284" rx="124" ry="30" fill="url(#dpG)"/>
    <ellipse cx="200" cy="281" rx="110" ry="24" fill="#E7B95A"/>
    <g fill="#9C7420" fill-opacity=".8">${rim}</g>
    <ellipse cx="118" cy="282" rx="16" ry="6" fill="#B5121B"/><ellipse cx="118" cy="279" rx="10" ry="3.5" fill="#E0303A"/>
    <ellipse cx="148" cy="293" rx="14" ry="5" fill="#D9920F"/><ellipse cx="148" cy="291" rx="9" ry="3" fill="#F4B400"/>
    <g fill="#FFFBF0">${rice}</g>
    ${marigold(262, 270, 9)}${marigold(290, 280, 8)}
    <path d="M186 284H214L208 262H192Z" fill="url(#dpG)"/>
    <ellipse cx="200" cy="258" rx="40" ry="10" fill="url(#dpG)"/>
    <ellipse cx="200" cy="256" rx="34" ry="7" fill="#7A4A12"/>
    <circle cx="200" cy="238" r="46" fill="url(#dpHalo)"/>
    ${wicks.map((x, i) => flame(x, 256 - (i === 2 ? 2 : 0), 1, 'dpFl', -i * 0.17)).join('')}
  </g>`, 'sc--devpoojan');
    return {
      html,
      init(el) {
        const g = el.querySelector('.dp-aarti');
        let a = 0, running = false, last = 0;
        const tick = (t) => {
          if (!running) return;
          const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
          last = t; a += dt * 1.15;
          g.setAttribute('transform', `translate(${f(Math.cos(a) * 16)} ${f(Math.sin(a) * 8)})`);
          requestAnimationFrame(tick);
        };
        return { play() { if (!running) { running = true; last = 0; requestAnimationFrame(tick); } }, pause() { running = false; } };
      },
    };
  }

  const map = { mehendi, haldi, sangeet, wedding, reception, shiv, satyanarayan, devpoojan };
  return { make: (icon) => (map[icon] || kalash)() };
})();
