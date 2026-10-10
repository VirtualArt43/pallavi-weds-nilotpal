/* ==========================================================================
   Intro film: the heart of the invitation, played full screen before the site, always with sound.
   Every visit, including a refresh, opens on the same first screen: the names and a gold "Tap to begin"
   medallion. Phones never let a page start sound by itself, and some browsers would allow it on a
   refresh but not on a first visit, so the film never tries to start on its own; that one tap starts it
   with Rudra's voice from the first word. When the film ends, the palace doors open by themselves into
   the site. A tiny, faint "skip" appears near the bottom after a few seconds. If the film gets paused
   (the phone locks, a call comes in), it carries on when the guest comes back, or after one more tap.
   ?nointro (or ?open) skips the film.
   ========================================================================== */
(() => {
  const intro = document.getElementById('intro');
  if (!intro) return;
  const q = new URLSearchParams(location.search);
  if (q.has('open') || q.has('nointro')) { intro.remove(); return; }

  // a refresh starts at the top, like a first visit, and never lands halfway down the page
  // (ScrollTrigger keeps its own copy of this setting and puts it back on every refresh, so tell it too)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (window.ScrollTrigger) ScrollTrigger.clearScrollMemory('manual');
  window.scrollTo(0, 0);

  const video = document.getElementById('intro-video');
  const begin = document.getElementById('intro-begin');
  const tapLabel = begin.querySelector('.intro__tap');
  const skipBtn = document.getElementById('intro-skip');
  // tall screens get the phone cut; wide screens get the film centred over its own soft glow
  const cut = innerWidth / innerHeight > 0.85 ? 'wide' : 'phone';
  video.poster = `assets/intro/poster-${cut}.jpg?v=6`;
  video.src = `assets/intro/intro-${cut}.mp4?v=6`;

  let started = false, leaving = false, failed = false, skipTimer = 0;
  const playing = () => {
    begin.classList.add('is-going');
    clearTimeout(skipTimer);
    skipTimer = setTimeout(() => skipBtn.classList.add('is-shown'), 6000);
  };
  const showBegin = () => {
    begin.classList.remove('is-going');
    begin.classList.add('is-shown');
  };

  // play() has to run inside the tap itself for phones to allow sound, so this stays synchronous
  function beginWithSound() {
    if (leaving) return;
    if (failed) { enter(); return; }                         // the film could not load: go straight in
    video.muted = false;
    if (!started || video.ended) video.currentTime = 0;      // a second tap after a pause carries on
    started = true;
    const p = video.play();
    playing();
    if (p && p.catch) p.catch(showBegin);
  }

  // the film was paused from outside (screen locked, app switched, back from another page): carry on
  function resume() {
    if (!started || leaving || document.hidden || !video.paused || video.ended) return;
    tapLabel.textContent = 'Tap to continue';
    const p = video.play();
    if (p && p.catch) p.catch(showBegin);
  }

  async function enter() {
    if (leaving) return;
    leaving = true;
    clearTimeout(skipTimer);
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
  video.addEventListener('error', () => { failed = true; if (started) enter(); });
  document.addEventListener('visibilitychange', resume);
  window.addEventListener('pageshow', resume);
  showBegin();

  // A phone can keep an older copy of this page for up to 10 minutes after an update (GitHub Pages lets
  // browsers cache pages that long). Ask the server which version is live; if it is newer than this copy,
  // reload once onto it, before the film has started. Versions are the ?v= on js/intro.js in index.html.
  const mine = (document.querySelector('script[src*="js/intro.js"]')?.getAttribute('src').match(/v=(\d+)/) || [])[1];
  fetch(`./?live=${Date.now()}`, { cache: 'no-store' })
    .then((r) => (r.ok ? r.text() : ''))
    .then((html) => {
      const live = (html.match(/js\/intro\.js\?v=(\d+)/) || [])[1];
      if (!live || !mine || Number(live) <= Number(mine) || started || leaving || q.get('v') === live) return;
      const u = new URL(location.href);
      u.searchParams.set('v', live);
      location.replace(u);
    })
    .catch(() => { /* offline or blocked: keep this copy */ });
})();
