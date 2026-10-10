/* ==========================================================================
   APP — builds the page from js/config.js and choreographs every movement.
   ========================================================================== */
(() => {
  const W = window.WEDDING;
  const { gsap, ScrollTrigger } = window;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const TZ = 'Asia/Kolkata';
  if (reduce) document.documentElement.classList.add('no-motion');
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ------------------------------------------------------------ helpers */
  const parseDate = (date, time = '00:00') => new Date(`${date}T${time}:00+05:30`);
  const fmt = (d, o) => new Intl.DateTimeFormat('en-IN', { timeZone: TZ, ...o }).format(d);
  const ordinal = (n) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
  const longDate = (d) => `${fmt(d, { weekday: 'long' })}, ${ordinal(+fmt(d, { day: 'numeric' }))} ${fmt(d, { month: 'long' })} ${fmt(d, { year: 'numeric' })}`;
  const time12 = (hhmm) => { if (!hhmm) return ''; const [h, m] = hhmm.split(':').map(Number); return `${((h + 11) % 12) + 1}${m ? ':' + String(m).padStart(2, '0') : ''} ${h >= 12 ? 'PM' : 'AM'}`; };
  const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), W);
  const mapsDir = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const weddingDate = parseDate(W.wedding.date, W.wedding.time);
  const [yy, mm, dd] = W.wedding.date.split('-');
  const initials = [W.bride.name[0], W.groom.name[0]];
  const timeSpan = (ev) => (!ev.end || ev.end >= '23:30' ? `${time12(ev.start)} onwards` : `${time12(ev.start)} – ${time12(ev.end)}`);

  let lenis = null, opened = false, petals = null, heroSky = null, finaleSky = null, heroTl = null;
  // the intro film (js/intro.js) waits for this before it opens the doors
  let siteReady;
  window.__siteReady = new Promise((resolve) => { siteReady = resolve; });

  /* ------------------------------------------------------------ text */
  function bindText() {
    $$('[data-w]').forEach((el) => { const v = get(el.dataset.w); if (v === '' || v == null) el.hidden = !v; if (v) el.textContent = v; });
    document.title = `${W.bride.name} & ${W.groom.name} — Wedding Invitation`;
    $('#hero-date').textContent = `${fmt(weddingDate, { weekday: 'long' })} · ${ordinal(+dd)} ${fmt(weddingDate, { month: 'long' })} ${yy}`;
    $('#gate-date').textContent = `${dd} · ${mm} · ${yy}`;
    $('#finale-date').textContent = longDate(weddingDate);
    $$('[data-ornament]').forEach((el) => { el.innerHTML = Art.ornament(el.dataset.ornament || Art.GOLD); });
    $$('[data-icon]').forEach((el) => { el.innerHTML = Art.icons[el.dataset.icon] || ''; });
    document.documentElement.style.setProperty('--jaal', Art.jaal('#D4AF37', 0.07));
    document.documentElement.style.setProperty('--jaal-ink', Art.jaal('#7A1528', 0.06));
  }
  function addCorners(sel, color) {
    $$(sel).forEach((el) => ['tl', 'tr', 'br', 'bl'].forEach((p) => { const c = document.createElement('i'); c.className = `corner corner--${p}`; c.innerHTML = Art.corner(color); el.appendChild(c); }));
  }

  /* ------------------------------------------------------------ gate */
  function gateWall(vw, vh, d) {
    const k = Art.id('gw');
    const spr = (o) => Math.min(0.9, (d.spring * d.h + o) / (d.h + o));
    const arch = (o) => Art.archPath(d.w + o * 2, d.h + o, { cusps: 9, bulge: 0.28, spring: spr(o) }, [1, 1], [d.x - o, d.y - o]);
    const hole = arch(0);
    const sy = d.y + d.spring * d.h;
    const pw = Math.max(10, Math.min(22, d.w * 0.04));
    const pillar = (x) => `<rect x="${x}" y="${sy}" width="${pw}" height="${vh - sy}" fill="url(#${k}p)"/><rect x="${x - 5}" y="${sy - 10}" width="${pw + 10}" height="10" fill="url(#${k}g)"/><path d="M${x + pw / 2} ${sy + 10}V${vh}" stroke="#6E4F12" stroke-opacity=".6" stroke-width="1"/>`;
    const gap = 30;
    let niches = '';
    if (d.x > 280) {
      [d.x / 2, vw - d.x / 2].forEach((cx) => {
        const nw = Math.min(150, d.x * 0.42), nh = nw * 1.5, ny = vh * 0.3;
        const np = Art.archPath(nw, nh, { cusps: 7, bulge: 0.28, spring: 0.42 }, [1, 1], [cx - nw / 2, ny]);
        niches += `<path d="${np}" fill="url(#${k}n)" stroke="url(#${k}g)" stroke-width="2"/><path d="${Art.archPath(nw + 20, nh + 10, { cusps: 7, bulge: 0.28, spring: 0.45 }, [1, 1], [cx - nw / 2 - 10, ny - 10])}" fill="none" stroke="#D4AF37" stroke-opacity=".45"/>`;
        niches += `<rect x="${cx - nw / 2 - 16}" y="${ny + nh}" width="${nw + 32}" height="10" fill="url(#${k}g)"/>`;
      });
    }
    return `<svg viewBox="0 0 ${vw} ${vh}" width="${vw}" height="${vh}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="${k}bg" cx="50%" cy="55%" r="75%"><stop offset="0" stop-color="#4E0F1C"/><stop offset=".6" stop-color="#2E0811"/><stop offset="1" stop-color="#16030A"/></radialGradient>
    <linearGradient id="${k}g" x1="0" x2="1"><stop offset="0" stop-color="#8C6A1C"/><stop offset=".5" stop-color="#F6E3A8"/><stop offset="1" stop-color="#8C6A1C"/></linearGradient>
    <linearGradient id="${k}p" x1="0" x2="1"><stop offset="0" stop-color="#6E4F12"/><stop offset=".4" stop-color="#E9CC7A"/><stop offset="1" stop-color="#6E4F12"/></linearGradient>
    <radialGradient id="${k}n" cx="50%" cy="70%" r="70%"><stop offset="0" stop-color="#FFB85C" stop-opacity=".75"/><stop offset=".6" stop-color="#9A3A16" stop-opacity=".5"/><stop offset="1" stop-color="#2A0810"/></radialGradient>
    <pattern id="${k}j" width="60" height="90" patternUnits="userSpaceOnUse"><path d="M30 0C30 20 0 25 0 45C0 65 30 70 30 90M30 0C30 20 60 25 60 45C60 65 30 70 30 90" fill="none" stroke="#D4AF37" stroke-opacity=".11"/><path d="M30 38C27 42 27 48 30 52C33 48 33 42 30 38Z" fill="#D4AF37" fill-opacity=".12"/></pattern>
  </defs>
  <path d="M0 0H${vw}V${vh}H0Z${hole}" fill-rule="evenodd" fill="url(#${k}bg)"/>
  <path d="M0 0H${vw}V${vh}H0Z${hole}" fill-rule="evenodd" fill="url(#${k}j)"/>
  ${niches}
  <path d="${arch(gap + 14)}" fill="none" stroke="#D4AF37" stroke-opacity=".35" stroke-width="1"/>
  <path d="${arch(gap)}" fill="none" stroke="url(#${k}g)" stroke-width="2.5"/>
  <path d="${arch(16)}" fill="none" stroke="#D4AF37" stroke-width="1.2" stroke-dasharray="3 6"/>
  <path d="${arch(5)}" fill="none" stroke="url(#${k}g)" stroke-width="5"/>
  ${pillar(d.x - gap - pw - 8)}${pillar(d.x + d.w + gap + 8)}
  <g transform="translate(${d.x + d.w / 2} ${d.y - gap - 30}) scale(${Math.min(1.3, d.w / 360)})">${Art.lotus('#E0BE62', 1.2)}</g>
</svg>`;
  }

  let gateGeom = null;
  function buildGate() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const mobile = vw < 640;
    const w = Math.round(Math.min(vw - (mobile ? 36 : 140), vh * 0.6, 560));
    const y = Math.round(mobile ? Math.max(96, vh * 0.13) : Math.max(110, vh * 0.15));
    const h = vh - y, x = Math.round((vw - w) / 2);
    const spring = Math.min(0.6, (w * 0.55) / h);
    gateGeom = { x, y, w, h, spring };
    const box = { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` };
    Object.assign($('#gate-doorway').style, box);
    Object.assign($('#gate-content').style, box);
    const seal = Math.round(Math.min(w * 0.46, 184));
    const gate = $('#gate');
    gate.style.setProperty('--seal', `${seal}px`);
    gate.style.setProperty('--seal-y', `${Math.max(34, Math.min(42, ((w * 0.55 + seal * 0.2) / h) * 100))}%`);
    $$('.gate__leaf-art').forEach((el) => { el.innerHTML = Art.doorLeaf(w / 2, h); });
    $$('.gate__seal').forEach((el) => { el.innerHTML = Art.monogram(initials[0], initials[1]); });
    $('#gate-wall').innerHTML = gateWall(vw, vh, gateGeom);
    $('#gate-toran').innerHTML = Art.garland(vw + 8, { compact: vw < 700 });
    const room = (vw - w) / 2 - 70;
    [['#gate-lamp-l', x - 60], ['#gate-lamp-r', x + w + 60]].forEach(([sel, cx], i) => {
      const el = $(sel);
      el.hidden = room < 110;
      if (el.hidden) return;
      el.innerHTML = Art.samai();
      const lw = Math.min(130, room * 0.8);
      Object.assign(el.style, { width: `${lw}px`, left: `${i ? cx : cx - lw}px` });
    });
    $('#gate-scene').style.transformOrigin = `${x + w / 2}px ${y + h * 0.5}px`;
  }

  function gateIntro() {
    if (reduce) return;
    gsap.timeline()
      .from('#gate-toran', { yPercent: -100, duration: 1.6, ease: 'elastic.out(1, .7)' }, 0)
      .from('.gate__seal', { scale: 0.3, rotation: -60, opacity: 0, duration: 1.5, ease: 'back.out(1.5)' }, 0.2)
      .from('.gate__vivah, .gate__below > *', { y: 20, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out' }, 0.5)
      .from('.gate__lamp', { y: 80, opacity: 0, duration: 1.2, ease: 'power3.out' }, 0.3);
  }

  function openGate() {
    if (opened) return;
    opened = true;
    const gate = $('#gate');
    gate.classList.add('is-opening');
    try { if (W.bell) window.Sound.chime(); } catch (_) { /* audio unavailable */ }
    music.start();
    startAmbient();
    const seal = $('.gate__seal').getBoundingClientRect();
    const cx = seal.right, cy = seal.top + seal.height / 2;
    if (reduce) {
      gsap.to(gate, { opacity: 0, duration: 0.6, onComplete: finishOpen });
      heroTl && heroTl.progress(1);
      return;
    }
    gsap.timeline({ onComplete: finishOpen })
      .to('#gate-content', { opacity: 0, y: -12, duration: 0.45, ease: 'power2.in' }, 0)
      .to('.gate__seal', { scale: 1.1, duration: 0.25, ease: 'power1.out' }, 0)
      .add(() => petals && petals.burst(cx, cy, 34), 0.2)
      .to('.gate__leaf--l', { rotationY: 104, duration: 2.1, ease: 'power3.inOut' }, 0.25)
      .to('.gate__leaf--r', { rotationY: -104, duration: 2.1, ease: 'power3.inOut' }, 0.25)
      .to('.gate__shade', { opacity: 1, duration: 1.6, ease: 'power1.in' }, 0.4)
      .fromTo('#home', { scale: 1.16 }, { scale: 1, duration: 2.6, ease: 'power2.out', clearProps: 'transform' }, 0.3)
      .to('#gate-scene', { scale: 2.8, opacity: 0, duration: 1.5, ease: 'power2.in' }, 1.15)
      .add(() => heroTl && heroTl.play(), 0.95);
  }
  function finishOpen() {
    $('#gate').classList.add('is-gone');
    document.body.classList.remove('is-locked');
    if (lenis) lenis.start();
    ScrollTrigger.refresh();
  }

  /* ------------------------------------------------------------ hero */
  function palaceLayers(p, far = true) {
    return `${far ? `<div class="pl-far">${Art.skyline()}</div>` : ''}<div class="pl-sil">${p.silhouette}</div><div class="pl-win">${p.windows}</div><div class="pl-flk">${p.flicker}</div>${p.bulbs.map((b, i) => `<div class="pl-bulb b${i}">${b}</div>`).join('')}`;
  }
  function buildHero() {
    $('#hero-palace').innerHTML = palaceLayers(Art.palace());
    $('#hero-mandala').innerHTML = `<div>${Art.mandala({ color: '#E9CC7A' })}</div>`;
    $('#hero-ganesha').innerHTML = Art.ganesha('#E6C46E');
    renderToran();
    const small = window.innerWidth < 700;
    const lamps = small ? [[3, 38, 5.2], [97, 64, 6]] : [[4.5, 150, 5], [13, 60, 6.2], [87, 90, 5.6], [95.5, 170, 4.8]];
    $('#hero-lamps').innerHTML = lamps.map(([l, drop, d], i) => `<div class="lamp" style="left:${l}%;--drop:${drop}px;margin-left:calc(clamp(34px, 4.2vw, 58px) / -2)"><div class="lamp__swing" style="animation-duration:${d}s;animation-delay:${-i * 1.7}s">${Art.lantern()}</div></div>`).join('');
  }
  let toranW = 0;
  function renderToran() {
    const w = window.innerWidth;
    if (Math.abs(w - toranW) < 30) return;
    toranW = w;
    $('#hero-toran').innerHTML = Art.garland(w + 8, { compact: w < 700 });
  }

  function prepareHeroIntro() {
    if (reduce) { gsap.set('#hero-ganesha .gd', { strokeDashoffset: 0 }); gsap.set('#hero-ganesha .gdot', { opacity: 1 }); return; }
    heroTl = gsap.timeline({ paused: true })
      .from('#hero-palace', { y: 90, opacity: 0, duration: 2.2, ease: 'power3.out' }, 0)
      .from('#hero-moon', { opacity: 0, scale: 0.7, duration: 2.4, ease: 'power2.out' }, 0)
      .from('#hero-toran', { yPercent: -100, duration: 1.8, ease: 'elastic.out(1, .7)' }, 0.1)
      .from('.lamp', { y: -340, duration: 2, ease: 'elastic.out(1, .55)', stagger: 0.14 }, 0.2)
      .to('#hero-ganesha .gd', { strokeDashoffset: 0, duration: 1.7, stagger: 0.025, ease: 'power2.inOut' }, 0.3)
      .to('#hero-ganesha .gdot', { opacity: 1, duration: 0.5, stagger: 0.04 }, 1.3)
      .from('.hero__vivah', { y: 18, opacity: 0, duration: 1, ease: 'power3.out' }, 0.7)
      .fromTo('.hero__name', { clipPath: 'inset(-30% 100% -30% -12%)' }, { clipPath: 'inset(-30% -12% -30% -12%)', duration: 1.7, stagger: 0.55, ease: 'power2.inOut' }, 0.95)
      .from('.hero__amp', { opacity: 0, scale: 0.4, rotation: -20, duration: 0.9, ease: 'back.out(2)' }, 1.55)
      .from('.hero__sub', { opacity: 0, y: 14, duration: 1 }, 2.2)
      .from('.hero__orn', { scaleX: 0, opacity: 0, duration: 1.3, ease: 'power3.inOut' }, 2.25)
      .from('.hero__date, .hero__city, .hero__invite', { opacity: 0, y: 18, duration: 1, stagger: 0.12, ease: 'power3.out' }, 2.45)
      .from('.cd', { opacity: 0, y: 24, scale: 0.85, duration: 1, stagger: 0.08, ease: 'back.out(1.7)' }, 2.75)
      .from('.hero__actions .btn', { opacity: 0, y: 18, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 3.05)
      .from('.hero__cue', { opacity: 0, duration: 1 }, 3.4);
  }

  function initHeroMotion() {
    if (reduce) return;
    const st = { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('#hero-content', { yPercent: -14, opacity: 0.15, ease: 'none', scrollTrigger: st });
    gsap.to('#hero-palace', { yPercent: 14, ease: 'none', scrollTrigger: st });
    gsap.to('#hero-moon', { yPercent: 40, ease: 'none', scrollTrigger: st });
    gsap.to('#hero-lamps', { yPercent: -18, ease: 'none', scrollTrigger: st });
    gsap.to('#hero-mandala', { rotation: 50, ease: 'none', scrollTrigger: st });
    if (coarse) return;
    const q = (sel, prop, dur) => gsap.quickTo(sel, prop, { duration: dur, ease: 'power3.out' });
    const layers = [[q('#hero-palace', 'x', 1.2), 14], [q('#hero-moon', 'x', 1.6), -26], [q('#hero-lamps', 'x', 1), 20], [q('#hero-content', 'x', 1.4), -8], [q('#hero-mandala', 'x', 2), 30]];
    $('#home').addEventListener('pointermove', (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      layers.forEach(([fn, amt]) => fn(nx * amt));
    });
  }

  /* ------------------------------------------------------------ countdown */
  function buildCountdown() {
    const host = $('#countdown');
    const units = [['d', 'Days'], ['h', 'Hours'], ['m', 'Minutes'], ['s', 'Seconds']];
    host.innerHTML = units.map(([k, l]) => `<div class="cd" data-k="${k}"><svg viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="46"/><circle class="bar" cx="50" cy="50" r="46" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg><div class="cd__num"><span>00</span></div><div class="cd__label">${l}</div></div>`).join('');
    const cells = Object.fromEntries(units.map(([k]) => { const c = host.querySelector(`[data-k="${k}"]`); return [k, { num: c.querySelector('.cd__num'), bar: c.querySelector('.bar') }]; }));
    const roll = (el, text) => {
      const cur = el.firstElementChild;
      if (cur.textContent === text) return;
      if (reduce || document.hidden || !opened) { cur.textContent = text; return; }
      const nxt = document.createElement('span');
      nxt.textContent = text;
      el.appendChild(nxt);
      gsap.to([cur, nxt], { yPercent: -100, duration: 0.55, ease: 'power2.inOut', onComplete: () => { cur.remove(); gsap.set(nxt, { yPercent: 0 }); } });
    };
    let timer;
    const tick = () => {
      const diff = weddingDate - Date.now();
      if (diff <= 0) { host.innerHTML = `<p class="countdown__done">${esc(W.bride.name)} &amp; ${esc(W.groom.name)} are now married! ${esc(W.hashtag || '')}</p>`; clearInterval(timer); return; }
      const s = Math.floor(diff / 1000);
      const v = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
      const max = { d: Math.max(100, v.d), h: 24, m: 60, s: 60 };
      for (const k in v) { roll(cells[k].num, String(v[k]).padStart(2, '0')); cells[k].bar.style.strokeDashoffset = (1 - v[k] / max[k]).toFixed(4); }
    };
    tick();
    timer = setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------ marquee */
  function buildMarquee() {
    const lotus = `<svg viewBox="-40 -26 80 44" aria-hidden="true">${Art.lotus('currentColor', 2.6)}</svg>`;
    const items = [`<span class="sc">${esc(W.bride.name)}</span>`, lotus, '<span class="hi">शुभ विवाह</span>', lotus, `<span class="sc">${esc(W.groom.name)}</span>`, lotus, `<span>${dd} · ${mm} · ${yy}</span>`, lotus, '<span>Save the date</span>', lotus];
    const one = `<span class="marquee__item">${items.join('')}</span>`;
    const fill = (id) => { $(id).innerHTML = one.repeat(3) + one.repeat(3); };
    fill('#mq-front'); fill('#mq-back');
    if (reduce) return;
    const a = gsap.to('#mq-front', { xPercent: -50, duration: 46, ease: 'none', repeat: -1 });
    const b = gsap.fromTo('#mq-back', { xPercent: -50 }, { xPercent: 0, duration: 54, ease: 'none', repeat: -1 });
    let boost = 1;
    ScrollTrigger.create({ trigger: '.marquee', start: 'top bottom', end: 'bottom top', onUpdate: (self) => { boost = Math.max(boost, 1 + Math.min(Math.abs(self.getVelocity()) / 260, 7)); } });
    gsap.ticker.add(() => { boost += (1 - boost) * 0.06; a.timeScale(boost); b.timeScale(boost); });
  }

  /* ------------------------------------------------------------ invitation scroll */
  function buildInvite() {
    const d = weddingDate;
    $('#scroll-watermark').innerHTML = Art.mandala({ color: '#7A1528', fill: false });
    const lines = [
      `<div class="inv__ganesha">${Art.ganesha('#B8902A')}</div>`,
      '<p class="inv__shree">॥ श्री गणेशाय नमः ॥</p>',
      `<p class="inv__shloka">${W.shloka.lines.map(esc).join('<br>')}</p>`,
      `<p class="inv__meaning">${esc(W.shloka.meaning)}</p>`,
      `<div class="inv__orn">${Art.ornament('#B8902A')}</div>`,
      '<p class="inv__lead">With the blessings of our elders and the grace of the Almighty,</p>',
      `<p class="inv__hosts">${esc(W.bride.parents)}</p>`,
      '<p class="inv__lead">request the honour of your presence at the wedding of their beloved daughter</p>',
      `<p class="inv__name">${esc(W.bride.fullName || W.bride.name)}</p>`,
      '<p class="inv__with">with</p>',
      `<p class="inv__name">${esc(W.groom.fullName || W.groom.name)}</p>`,
      `<p class="inv__small">son of ${esc(W.groom.parents)}</p>`,
      `<div class="inv__when"><span>${fmt(d, { weekday: 'long' })}</span><span class="d">${fmt(d, { day: 'numeric' })}</span><span>${fmt(d, { month: 'long' })} ${yy}</span></div>`,
      `<p class="inv__time">from ${time12(W.wedding.time)} onwards</p>`,
      `<p class="inv__venue">${esc(W.venue.name)}<small>${esc(W.venue.address)}</small></p>`,
      '<p class="inv__cordial">You and your family are cordially invited.</p>',
      '<p class="inv__hindi hindi">आपकी उपस्थिति ही हमारे लिए आशीर्वाद है।</p>',
      `<div class="inv__seal">${Art.monogram(initials[0], initials[1])}</div>`,
    ];
    $('#scroll-content').innerHTML = lines.map((l) => `<div class="sc-line">${l}</div>`).join('');
  }
  function initInvite() {
    const scroll = $('#scroll'), paper = $('#scroll-paper');
    const lines = $$('.sc-line', paper);
    if (reduce) { scroll.style.setProperty('--reveal', '100000px'); lines.forEach((l) => l.classList.add('is-in')); return; }
    const MIN = 66;
    let H = paper.offsetHeight, tops = [];
    const measure = () => { H = paper.offsetHeight; tops = lines.map((l) => l.offsetTop + Math.min(l.offsetHeight, 60)); };
    measure();
    const proxy = { p: 0 };
    const set = () => {
      const r = MIN + (H - MIN) * proxy.p;
      scroll.style.setProperty('--reveal', `${r.toFixed(1)}px`);
      lines.forEach((l, i) => { if (tops[i] < r - 10) l.classList.add('is-in'); });
    };
    gsap.to(proxy, { p: 1, ease: 'none', onUpdate: set, scrollTrigger: { trigger: paper, start: 'top 68%', end: 'bottom 84%', scrub: 0.7, invalidateOnRefresh: true } });
    ScrollTrigger.addEventListener('refreshInit', measure);
    set();
  }

  /* ------------------------------------------------------------ couple */
  const ARCH = { w: 600, h: 900, cusps: 9, spring: 0.3 };
  function paperBackdrop() {
    const { w, h, cusps, spring } = ARCH;
    const k = Art.id('pb');
    const tones = ['#3A0A14', '#4D0F1D', '#621627', '#781E31', '#8C2839'];
    const layers = tones.map((c, i) => {
      const inset = i * 30, lw = w - inset * 2, lh = h - inset;
      const sp = Math.max(0.05, (spring * h - inset * 0.9) / lh);
      return `<g class="pb-layer" data-depth="${i}"><path d="${Art.archPath(lw, lh, { cusps, bulge: 0.3, spring: sp }, [1, 1], [inset, inset])}" fill="${c}" stroke="#D4AF37" stroke-opacity="${0.18 + i * 0.05}" stroke-width="1.5" filter="url(#${k}s)"/></g>`;
    }).join('');
    const m = Art.mandala({ color: '#E9CC7A', fill: false, sw: 3 }).replace('<svg ', `<svg x="${w / 2 - 190}" y="${h * 0.14}" width="380" height="380" opacity=".14" `);
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <filter id="${k}s" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#12030A" flood-opacity=".6"/></filter>
    <radialGradient id="${k}g" cx="50%" cy="42%" r="55%"><stop offset="0" stop-color="#FFC878" stop-opacity=".45"/><stop offset=".5" stop-color="#E07A3A" stop-opacity=".14"/><stop offset="1" stop-color="#E07A3A" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#2A070D"/>
  ${layers}
  <rect width="${w}" height="${h}" fill="url(#${k}g)"/>
  ${m}
</svg>`;
  }
  function buildCouple() {
    $('#couple-mandala').innerHTML = Art.mandala({ color: '#E9CC7A' });
    $('#portrait-backdrop').innerHTML = paperBackdrop();
    $('#portrait-finial').innerHTML = `<svg viewBox="-40 -26 80 44" aria-hidden="true">${Art.lotus('currentColor', 1.8)}</svg>`;
    const B = W.backdrop || {};
    if (B.wide || B.tall) {
      const pic = $('#portrait-bg'), img = $('#portrait-bg-img');
      if (B.tall) $('#portrait-bg-tall').srcset = B.tall;
      img.onload = () => { pic.hidden = false; $('#portrait-backdrop').hidden = true; };
      img.src = B.wide || B.tall;
    }
    if (B.frontWide || B.frontTall) {
      const fg = $('#portrait-fg'), fimg = $('#portrait-fg-img');
      if (B.frontTall) $('#portrait-fg-tall').srcset = B.frontTall;
      fimg.onload = () => { fg.hidden = false; };
      fimg.src = B.frontWide || B.frontTall;
    }
  }
  function initCouple() {
    const portrait = $('#portrait');
    if (reduce) { gsap.set('.curtain', { autoAlpha: 0 }); return; }
    // The curtains open, with a shower of flowers, every time the portrait comes into view,
    // whether you scroll down to it or come back up to it from below. Once it has almost left
    // the screen (either way) they draw closed again, ready to open on the next visit.
    const reveal = gsap.timeline({ paused: true })
      .set('.curtain', { autoAlpha: 1 })
      .to('.curtain--l', { xPercent: -100, scaleX: 0.5, duration: 2.1, ease: 'power3.inOut' }, 0)
      .to('.curtain--r', { xPercent: 100, scaleX: 0.5, duration: 2.1, ease: 'power3.inOut' }, 0)
      .fromTo('#portrait-img', { scale: 1.15 }, { scale: 1, duration: 2.6, ease: 'power2.out' }, 0)
      .set('.curtain', { autoAlpha: 0 });
    let isOpen = false, showerTimer = 0, stopShower = null;
    const openCurtains = () => {
      if (isOpen) return;
      isOpen = true;
      reveal.timeScale(1).play();
      clearTimeout(showerTimer);
      showerTimer = setTimeout(() => { if (petals) stopShower = petals.shower(portrait); }, 600);
    };
    const closeCurtains = () => {
      if (!isOpen) return;
      isOpen = false;
      clearTimeout(showerTimer);
      if (stopShower) { stopShower(); stopShower = null; }
      reveal.timeScale(1.8).reverse();
    };
    // open once a good part of it is on screen: its top at 72% going down, its bottom at 40% coming back up
    ScrollTrigger.create({ trigger: portrait, start: 'top 72%', end: 'bottom 40%', onEnter: openCurtains, onEnterBack: openCurtains });
    // close when only a thin strip is left: its top at 88% going up, its bottom at 12% going down
    ScrollTrigger.create({ trigger: portrait, start: 'top 88%', end: 'bottom 12%', onLeave: closeCurtains, onLeaveBack: closeCurtains });
    gsap.fromTo('#couple-mandala', { rotation: -30 }, { rotation: 30, ease: 'none', scrollTrigger: { trigger: '#couple', start: 'top bottom', end: 'bottom top', scrub: true } });
    if (!coarse) gsap.fromTo('#portrait-bg', { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: portrait, start: 'top bottom', end: 'bottom top', scrub: true } });
    if (!coarse) gsap.fromTo('#portrait-fg', { yPercent: 1.5 }, { yPercent: -1.5, ease: 'none', scrollTrigger: { trigger: portrait, start: 'top bottom', end: 'bottom top', scrub: true } });
    if (coarse) return;
    gsap.set(portrait, { transformPerspective: 1400 });
    const rx = gsap.quickTo(portrait, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    const ry = gsap.quickTo(portrait, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    portrait.addEventListener('pointermove', (e) => { const r = portrait.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 9); rx(-((e.clientY - r.top) / r.height - 0.5) * 7); });
    portrait.addEventListener('pointerleave', () => { rx(0); ry(0); });
  }

  /* ------------------------------------------------------------ celebrations */
  const PAL = {
    shiv: ['#070A22', '#26307A', '#10164A'], satyanarayan: ['#2E0412', '#8A1636', '#4E0A20'], devpoojan: ['#3A1003', '#B04A0E', '#5E1C05'],
    mehendi: ['#08251B', '#1C6446', '#0E3B2C'], haldi: ['#E49B12', '#FFD650', '#F4B52A'], sangeet: ['#1B072E', '#6D1A66', '#3A0C4E'],
    wedding: ['#360407', '#921519', '#5A080D'], reception: ['#050E22', '#1E3A70', '#0B1A3A'], kalash: ['#3A0A12', '#6E1528', '#2A070D'],
  };
  const sceneKey = (ev) => (PAL[ev.icon] && ev.icon !== 'kalash' ? ev.icon : 'kalash');
  const controllers = [];
  function buildEvents() {
    $('#events-layers').innerHTML = '<div class="events__layer is-on" data-l="-1" style="--c1:#22050C;--c2:#4A0E1A;--c3:#1C040B"></div>'
      + W.events.map((ev, i) => { const [c1, c2, c3] = PAL[sceneKey(ev)]; return `<div class="events__layer" data-l="${i}" style="--c1:${c1};--c2:${c2};--c3:${c3}"></div>`; }).join('');
    $('#events-mandala').innerHTML = Art.mandala({ color: '#FFFFFF', fill: false });
    const made = [];
    $('#scenes').innerHTML = W.events.map((ev, i) => {
      const sc = Scenes.make(ev.icon);
      made.push(sc);
      const d = parseDate(ev.date, ev.start);
      return `<article class="scene scene--${sceneKey(ev)}" id="ev-${i}" data-i="${i}">
        <span class="scene__word" aria-hidden="true">${esc(ev.hindi || ev.title)}</span>
        <div class="scene__art">${sc.html}</div>
        <div class="scene__info">
          <p class="scene__kicker" data-r>${fmt(d, { weekday: 'long' })}</p>
          <div class="scene__head" data-r>
            <div class="scene__date"><b>${fmt(d, { day: 'numeric' })}</b><span>${fmt(d, { month: 'short' })}</span></div>
            <div><h3 class="scene__title">${esc(ev.title)}</h3><span class="scene__hindi">${esc(ev.hindi || '')}</span>${ev.subtitle ? `<span class="scene__sub">${esc(ev.subtitle)}</span>` : ''}</div>
          </div>
          <p class="scene__desc" data-r>${esc(ev.description || '')}</p>
          <ul class="scene__meta" data-r>
            <li>${Art.icons.clock}<span>${timeSpan(ev)}</span></li>
            <li>${Art.icons.pin}<span>${esc(ev.venue)}${ev.address ? `<small>${esc(ev.address)}</small>` : ''}</span></li>
          </ul>
          ${ev.schedule ? `<ul class="scene__schedule" data-r>${ev.schedule.map(([t, l]) => `<li><span>${esc(t)}</span>${esc(l)}</li>`).join('')}</ul>` : ''}
          ${ev.dress ? `<p class="scene__dress" data-r><span>Dress code</span>${ev.dressColors ? `<span class="swatches">${ev.dressColors.map((c) => `<i style="background:${esc(c)}"></i>`).join('')}</span>` : ''}<span>${esc(ev.dress)}</span></p>` : ''}
          <div class="scene__actions" data-r>
            <button type="button" class="btn btn--sm" data-ics="${i}">${Art.icons.calendar}Add to calendar</button>
            <a class="btn btn--sm" href="${esc(ev.mapLink || mapsDir(ev.mapQuery || ev.address || ev.venue))}" target="_blank" rel="noopener">${Art.icons.directions}Directions</a>
          </div>
        </div>
      </article>`;
    }).join('');
    $$('.scene').forEach((el, i) => controllers.push(made[i].init(el.querySelector('.scene__art'))));
    $('#events-rail').innerHTML = W.events.map((ev, i) => `<a href="#ev-${i}" data-scroll data-i="${i}"><i></i><span>${esc(ev.title)}</span></a>`).join('');
    $('#scenes').addEventListener('click', (e) => { const b = e.target.closest('[data-ics]'); if (b) downloadIcs([W.events[+b.dataset.ics]]); });
  }
  function initEvents() {
    const layers = $$('.events__layer'), rail = $('#events-rail'), links = $$('a', rail);
    const setActive = (i) => {
      layers.forEach((l) => l.classList.toggle('is-on', +l.dataset.l === i));
      links.forEach((a) => a.classList.toggle('is-active', +a.dataset.i === i));
      rail.style.setProperty('--rail-ink', i >= 0 && sceneKey(W.events[i]) === 'haldi' ? '#3E0D08' : '#FFF6E2');
    };
    $$('.scene').forEach((s, i) => {
      ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && setActive(i), onLeaveBack: () => i === 0 && setActive(-1) });
    });
    ScrollTrigger.create({ trigger: '#events', start: 'top 40%', end: 'bottom 60%', onToggle: (self) => rail.classList.toggle('is-on', self.isActive) });
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      const i = +en.target.dataset.i;
      en.target.classList.toggle('is-live', en.isIntersecting);
      const c = controllers[i];
      if (c) (en.isIntersecting ? c.play() : c.pause());
    }), { rootMargin: '15% 0px' });
    $$('.scene').forEach((s) => io.observe(s));
    $$('.scene__word').forEach((w) => gsap.set(w, { xPercent: -50, yPercent: -50 }));
    if (reduce) { gsap.set('.scene [data-r]', { opacity: 1 }); return; }
    $$('.scene').forEach((s) => {
      gsap.timeline({ scrollTrigger: { trigger: s, start: 'top 72%', once: true } })
        .from(s.querySelector('.scene__art'), { opacity: 0, scale: 0.82, rotation: -8, duration: 1.5, ease: 'power3.out' }, 0)
        .from(s.querySelectorAll('[data-r]'), { opacity: 0, y: 30, duration: 1, stagger: 0.09, ease: 'power3.out' }, 0.15);
      gsap.fromTo(s.querySelector('.scene__word'), { y: 120 }, { y: -120, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ------------------------------------------------------------ venue */
  function buildVenue() {
    $('#venue-art').insertAdjacentHTML('afterbegin', `<div class="pl">${palaceLayers(Art.palace(), false).replace(/class="pl-/g, 'class="pl pl-')}</div>`);
    $('#btn-directions').href = W.venue.mapLink || mapsDir(W.venue.mapQuery || W.venue.address);
    $('#map').src = `https://www.google.com/maps?q=${encodeURIComponent(W.venue.mapQuery || W.venue.address)}&z=15&output=embed`;
    const shield = $('#map-shield'), mapBox = $('.venue__map');
    shield.addEventListener('click', () => shield.classList.add('is-off'));
    mapBox.addEventListener('pointerleave', () => shield.classList.remove('is-off'));
    $('#travel').innerHTML = (W.travel || []).map((t) => `<div class="travel__item" data-reveal><span class="travel__icon">${Art.icons[t.icon] || Art.icons.pin}</span><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div>`).join('');
  }

  /* ------------------------------------------------------------ family */
  function buildFamily() {
    const F = W.families || {};
    const diya = `<span>${Art.icons.diya}</span>`;
    const bl = $('#blessings');
    if (F.blessings && F.blessings.length) bl.innerHTML = `<p class="blessings__label">With the blessings of</p><p class="blessings__names">${F.blessings.map(esc).join('<br>')}</p><div class="blessings__diyas">${diya}${diya}${diya}</div>`;
    else bl.hidden = true;
    const lotusSvg = `<svg viewBox="-40 -26 80 44" aria-hidden="true">${Art.lotus('currentColor', 1.8)}</svg>`;
    $('#families').innerHTML = [F.bride, F.groom].filter(Boolean).map((f) => `<div class="fam" data-reveal><div class="fam__icon">${lotusSvg}</div><h3>${esc(f.title)}</h3><ul>${(f.members || []).map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div>`).join('');
    const mh = $('#manuhar');
    if (F.manuhar) mh.innerHTML = `<p>${esc(F.manuhar)}</p><p>— ${esc(F.manuharFrom || '')}</p>`;
    else mh.hidden = true;
  }

  /* ------------------------------------------------------------ contacts */
  function buildContacts() {
    $('#contacts').innerHTML = (W.contacts || []).map((c, i) => {
      const tel = (c.phone || '').replace(/[^\d+]/g, ''), wa = tel.replace(/\D/g, '');
      return `<div class="person-card" data-reveal style="--i:${i}">
        <div class="person-card__ring">${Art.icons.phone}</div>
        <h3>${esc(c.name)}</h3><p class="person-card__rel">${esc(c.relation || '')}</p>
        <a class="person-card__phone" href="tel:${esc(tel)}">${esc(c.phone)}</a>
        <div class="person-card__actions"><a class="btn btn--sm" href="tel:${esc(tel)}">${Art.icons.phone}Call</a><a class="btn btn--sm" href="https://wa.me/${esc(wa)}" target="_blank" rel="noopener">${Art.icons.whatsapp}WhatsApp</a></div>
      </div>`;
    }).join('');
    $$('.person-card__ring svg, .person-card__ring').forEach((el, i) => { el.style.animationDelay = `${-(Math.floor(i / 2) * 1.3)}s`; });
  }

  /* ------------------------------------------------------------ finale */
  function buildFinale() {
    $('#finale-palace').innerHTML = palaceLayers(Art.palace());
    $('#finale-diyas').innerHTML = Array.from({ length: 5 }, (_, i) => `<span style="--i:${i}">${Art.icons.diya}</span>`).join('');
    if (coarse) $('#finale-hint').textContent = 'Tap the sky to light a firework';
    else $('#finale-hint').textContent = 'Click anywhere in the sky to light a firework';
  }

  /* ------------------------------------------------------------ ambient fx */
  function startAmbient() {
    if (reduce) return;
    petals.start();
    heroSky = heroSky || FX.Sky($('#hero-fx'), { stars: 130, lanterns: 11, every: [2.8, 5.6], skyFrac: 0.66, lanternFloor: 0.9 });
    finaleSky = finaleSky || FX.Sky($('#finale-fx'), { stars: 150, lanterns: 14, every: [1.3, 2.8], skyFrac: 0.8, lanternFloor: 0.95 });
    const watch = (el, sky) => new IntersectionObserver(([en]) => (en.isIntersecting ? sky.start() : sky.stop()), { rootMargin: '10% 0px' }).observe(el);
    watch($('#home'), heroSky);
    watch($('#finale'), finaleSky);
    $('#finale').addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button')) return;
      const r = $('#finale-fx').getBoundingClientRect();
      finaleSky.launch(e.clientX - r.left, e.clientY - r.top);
    });
  }

  /* ------------------------------------------------------------ nav */
  function buildNav() {
    const secs = $$('main section[data-nav]');
    $('#nav-links').innerHTML = secs.map((s) => `<li><a href="#${s.id}" data-scroll>${s.dataset.nav}</a></li>`).join('');
    $('#menu-links').innerHTML = secs.map((s, i) => `<li><a href="#${s.id}" data-scroll style="--i:${i}">${s.dataset.nav}<small>${s.dataset.navHi || ''}</small></a></li>`).join('');
    $('#nav-seal').innerHTML = Art.monogram(initials[0], initials[1]);
    $('#menu-mandala').innerHTML = Art.mandala({ color: '#E9CC7A', fill: false });
    const nav = $('#nav'), menu = $('#menu'), burger = $('#nav-burger');
    const setMenu = (open) => {
      nav.classList.toggle('is-open', open); menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open);
      if (lenis) (open ? lenis.stop() : lenis.start());
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-scroll]');
      if (!a) return;
      e.preventDefault();
      if (nav.classList.contains('is-open')) setMenu(false);
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      if (lenis) lenis.scrollTo(t, { offset: t.id === 'home' ? 0 : -4, duration: 1.6 });
      else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
    ScrollTrigger.create({ trigger: '#home', start: 'bottom 55%', onEnter: () => nav.classList.add('is-shown'), onLeaveBack: () => nav.classList.remove('is-shown') });
    gsap.to('#nav-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
    const map = new Map($$('#nav-links a').map((a) => [a.getAttribute('href').slice(1), a]));
    secs.forEach((s) => ScrollTrigger.create({ trigger: s, start: 'top 50%', end: 'bottom 50%', onToggle: (self) => { if (self.isActive) { map.forEach((a) => a.classList.remove('is-active')); const a = map.get(s.id); if (a) a.classList.add('is-active'); } } }));
  }

  /* ------------------------------------------------------------ reveals */
  function initReveals() {
    $$('.shead__title').forEach((t) => { t.innerHTML = t.textContent.split(' ').map((w) => `<span class="w"><span>${esc(w)}</span></span>`).join(' '); });
    if (reduce) return;
    ScrollTrigger.batch('[data-reveal]', { start: 'top 90%', once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', overwrite: true }) });
    $$('.shead').forEach((h) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: h, start: 'top 84%', once: true } });
      tl.from(h.querySelector('.shead__hi'), { opacity: 0, y: 14, duration: 0.9, ease: 'power3.out' }, 0)
        .from(h.querySelectorAll('.shead__title .w > span'), { yPercent: 115, duration: 1.2, stagger: 0.08, ease: 'power4.out' }, 0.08)
        .from(h.querySelector('.shead__orn'), { scaleX: 0, opacity: 0, duration: 1.3, ease: 'power3.inOut' }, 0.3);
      const intro = h.querySelector('.shead__intro');
      if (intro) tl.from(intro, { opacity: 0, y: 16, duration: 1, ease: 'power3.out' }, 0.5);
    });
  }

  /* ------------------------------------------------------------ calendar */
  function icsText(events) {
    const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const clean = (s = '') => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
    const out = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'CALSCALE:GREGORIAN'];
    events.forEach((ev, i) => {
      const s = parseDate(ev.date, ev.start || '00:00');
      const e = ev.end ? parseDate(ev.date, ev.end) : new Date(s.getTime() + 4 * 3600e3);
      out.push('BEGIN:VEVENT', `UID:${ev.date}-${i}-${(ev.title || 'event').toLowerCase().replace(/\W+/g, '')}@wedding`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(s)}`, `DTEND:${f(e)}`,
        `SUMMARY:${clean(`${ev.title} — ${W.bride.name} & ${W.groom.name}`)}`, `LOCATION:${clean([ev.venue, ev.address].filter(Boolean).join(', '))}`, `DESCRIPTION:${clean(ev.description || '')}`, 'END:VEVENT');
    });
    out.push('END:VCALENDAR');
    return out.join('\r\n');
  }
  function downloadIcs(events, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([icsText(events)], { type: 'text/calendar;charset=utf-8' }));
    a.download = name || `${events[0].title}-${W.bride.name}-${W.groom.name}.ics`.replace(/\s+/g, '-');
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  /* ------------------------------------------------------------ photos */
  const loadImg = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  async function loadPortrait() {
    const n = new URLSearchParams(location.search).get('portrait');
    const base = n ? `assets/photos/portrait-${n.replace(/\W/g, '')}` : W.portrait;
    for (const ext of ['webp', 'png', 'jpg', 'jpeg']) { const img = await loadImg(`${base}.${ext}`); if (img) return img; }
    return null;
  }
  async function initPhotos() {
    const found = await loadPortrait();
    const img = $('#portrait-img');
    const src = found ? found.src : W.photo;
    img.src = src;
    const standIn = !found && W.photoIsPlaceholder;
    $('#portrait').classList.toggle('is-stand-in', standIn);
    $('#portrait').classList.toggle('is-cutout', !!found);
    $('#portrait-note').hidden = !standIn;
  }

  /* ------------------------------------------------------------ music */
  const music = (() => {
    const audio = $('#bgm'), btn = $('#music');
    if (!W.music) return { start() {} };
    audio.preload = 'metadata';
    audio.src = W.music;
    audio.addEventListener('loadedmetadata', () => { btn.hidden = false; }, { once: true });
    audio.addEventListener('error', () => { btn.hidden = true; });
    const sync = () => btn.classList.toggle('is-playing', !audio.paused);
    btn.addEventListener('click', () => { if (audio.paused) audio.play().catch(() => {}); else audio.pause(); });
    audio.addEventListener('play', sync); audio.addEventListener('pause', sync);
    return { start() { audio.volume = 0; audio.play().then(() => gsap.to(audio, { volume: 0.55, duration: 3 })).catch(() => {}); } };
  })();

  /* ------------------------------------------------------------ interactions */
  function initInteractions() {
    petals = FX.Petals($('#fx-petals'), { count: 30 });
    document.addEventListener('pointerdown', (e) => {
      if (!opened || e.target.closest('a, button, input, iframe, .venue__map, #finale, .menu')) return;
      petals.burst(e.clientX, e.clientY, 12);
    });
    if (!coarse && !reduce) {
      let lx = 0, ly = 0;
      window.addEventListener('pointermove', (e) => {
        if (!opened || Math.hypot(e.clientX - lx, e.clientY - ly) < 22) return;
        lx = e.clientX; ly = e.clientY;
        petals.spark(e.clientX, e.clientY);
      }, { passive: true });
    }
    $('#btn-save').addEventListener('click', () => {
      const main = W.events.find((e) => e.icon === 'wedding') || { title: 'Wedding', date: W.wedding.date, start: W.wedding.time, venue: W.venue.name, address: W.venue.address };
      downloadIcs([main], `Wedding-${W.bride.name}-${W.groom.name}.ics`);
    });
    $('#btn-all-ics').addEventListener('click', () => downloadIcs(W.events, `All-celebrations-${W.bride.name}-${W.groom.name}.ics`));
    const gate = $('#gate');
    gate.addEventListener('click', openGate);
    gate.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGate(); } });
  }

  /* ------------------------------------------------------------ housekeeping */
  function initOffscreen() {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => en.target.classList.toggle('is-offscreen', !en.isIntersecting)), { rootMargin: '12% 0px' });
    $$('main > section, .marquee').forEach((s) => { if (s.id !== 'events') io.observe(s); });
    if (reduce) return;
    const names = $$('.hero__name');
    setInterval(() => {
      if (!opened || document.hidden || $('#home').classList.contains('is-offscreen')) return;
      names.forEach((n) => { n.classList.remove('is-shine'); void n.offsetWidth; n.classList.add('is-shine'); });
    }, 6500);
  }

  /* ------------------------------------------------------------ boot */
  async function init() {
    bindText();
    $('#loader-ganesha').innerHTML = Art.ganesha('#E6C46E');
    if (!reduce && !coarse && window.Lenis) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    }
    buildGate(); buildHero(); buildMarquee(); buildInvite(); buildCouple(); buildEvents(); buildVenue(); buildFamily(); buildContacts(); buildFinale(); buildNav(); buildCountdown();
    addCorners('.fam', '#D4AF37'); addCorners('.person-card', '#B8902A'); addCorners('#portrait-frame', '#D4AF37');
    prepareHeroIntro();
    initInteractions(); initReveals(); initHeroMotion(); initInvite(); initCouple(); initEvents(); initOffscreen();
    initPhotos();
    window.addEventListener('resize', debounce(() => { if (!opened) buildGate(); renderToran(); }, 200));

    const started = performance.now();
    await Promise.race([document.fonts.ready, wait(3500)]);
    ScrollTrigger.refresh();
    const minShow = reduce ? 0 : 2300;
    await wait(Math.max(0, minShow - (performance.now() - started)));
    $('#loader').classList.add('is-done');
    gateIntro();
    window.__openGate = openGate;
    siteReady();
    const q = new URLSearchParams(location.search);
    if (q.has('open')) setTimeout(openGate, 400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
