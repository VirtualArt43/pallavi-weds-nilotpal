/* ==========================================================================
   Intro film: the heart of the invitation, played full screen before the site, always with sound.
   Where the browser allows sound on its own (some computers), it simply plays. Phones never let a page
   start sound by itself, so there the first screen shows the names and a gold "Tap to begin" medallion;
   that one tap starts the film with Rudra's voice from the first word. When the film ends, the palace
   doors open by themselves into the site. A tiny, faint "skip" appears near the bottom after a few
   seconds. ?nointro (or ?open) skips the film; ?tap always shows the first screen.
   ========================================================================== */
(() => {
  const intro = document.getElementById('intro');
  if (!intro) return;
  const q = new URLSearchParams(location.search);
  if (q.has('open') || q.has('nointro')) { intro.remove(); return; }

  const video = document.getElementById('intro-video');
  const begin = document.getElementById('intro-begin');
  const skipBtn = document.getElementById('intro-skip');
  // tall screens get the phone cut; wide screens get the film centred over its own soft glow
  const cut = innerWidth / innerHeight > 0.85 ? 'wide' : 'phone';
  video.poster = `assets/intro/poster-${cut}.jpg?v=6`;
  video.src = `assets/intro/intro-${cut}.mp4?v=6`;

  let leaving = false, failed = false, skipTimer = 0;
  const playing = () => {
    begin.classList.add('is-going');
    clearTimeout(skipTimer);
    skipTimer = setTimeout(() => skipBtn.classList.add('is-shown'), 6000);
  };

  // play() has to run inside the tap itself for phones to allow sound, so this stays synchronous
  function beginWithSound() {
    if (leaving) return;
    if (failed) { enter(); return; }                         // the film could not load: go straight in
    video.muted = false;
    video.currentTime = 0;
    const p = video.play();
    playing();
    if (p && p.catch) p.catch(() => { begin.classList.remove('is-going'); begin.classList.add('is-shown'); });
  }

  async function start() {
    if (!q.has('tap')) {
      try { video.muted = false; await video.play(); playing(); return; } catch (_) { /* this browser needs a tap for sound */ }
    }
    video.pause();
    begin.classList.add('is-shown');
  }

  async function enter() {
    if (leaving) return;
    leaving = true;
    skipBtn.classList.remove('is-shown');
    await (window.__siteReady || Promise.resolve());
    if (window.__openGate) window.__openGate();              // the doors swing open, with the temple bell
    const v0 = video.volume, t0 = performance.now();
    const fadeOut = () => {                                   // the film's sound falls away as it fades
      const k = Math.min(1, (performance.now() - t0) / 800);
      video.volume = v0 * (1 - k);
      if (k < 1) requestAnimationFrame(fadeOut); else video.pause();
    };
    fadeOut();
    intro.classList.add('is-leaving');
    setTimeout(() => intro.remove(), 1000);
  }

  begin.addEventListener('click', beginWithSound);
  skipBtn.addEventListener('click', enter);
  video.addEventListener('ended', enter);                    // the film ends: straight into the site
  video.addEventListener('error', () => { failed = true; if (!begin.classList.contains('is-shown') && !leaving) enter(); });
  start();
})();
