/* ==========================================================================
   Intro film: plays first, full screen, before the palace doors.
   It starts with sound where the browser allows it; otherwise it starts muted with a "Tap for sound"
   chip, and that tap restarts it with sound so the whole narration is heard. When it ends, "Open
   Invitation" opens the doors into the site; Skip goes straight in. ?open or ?nointro skips the film.
   ========================================================================== */
(() => {
  const intro = document.getElementById('intro');
  if (!intro) return;
  const q = new URLSearchParams(location.search);
  if (q.has('open') || q.has('nointro')) { intro.remove(); return; }

  const video = document.getElementById('intro-video');
  const soundBtn = document.getElementById('intro-sound');
  const label = soundBtn.querySelector('span');
  const skipBtn = document.getElementById('intro-skip');
  const openBtn = document.getElementById('intro-open');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // tall screens get the phone cut; wide screens get the film centred over its own soft glow
  const cut = innerWidth / innerHeight > 0.85 ? 'wide' : 'phone';
  video.poster = `assets/intro/poster-${cut}.jpg?v=5`;
  video.src = `assets/intro/intro-${cut}.mp4?v=5`;

  let sound = false, leaving = false;
  const chip = (text) => { if (text) label.textContent = text; soundBtn.classList.toggle('is-shown', !!text); };
  const showOpen = () => { openBtn.classList.add('is-shown'); openBtn.tabIndex = 0; intro.classList.add('is-ended'); };

  async function start() {
    try { video.muted = false; await video.play(); sound = true; return; } catch (_) { /* this browser wants a tap first */ }
    try { video.muted = true; await video.play(); chip('Tap for sound'); }
    catch (_) { chip('Tap to play'); }                     // autoplay blocked entirely, e.g. low power mode
  }

  function withSound() {
    if (leaving || video.ended || (sound && !video.paused)) return;
    const restart = !sound && video.currentTime > 1.5;     // so the narration is heard from the start
    sound = true; video.muted = false; chip(null);
    if (restart) video.currentTime = 0;
    video.play().catch(() => {});
  }

  async function enter() {
    if (leaving) return;
    leaving = true; chip(null);
    await (window.__siteReady || Promise.resolve());
    if (window.__openGate) window.__openGate();              // the doors swing open, with the temple bell
    const v0 = video.volume, t0 = performance.now();
    const fadeOut = () => {                                   // the film's sound falls away as it fades
      const k = Math.min(1, (performance.now() - t0) / 700);
      video.volume = v0 * (1 - k);
      if (k < 1) requestAnimationFrame(fadeOut); else video.pause();
    };
    fadeOut();
    intro.classList.add('is-leaving');
    setTimeout(() => intro.remove(), 900);
  }

  intro.addEventListener('click', (e) => { if (!e.target.closest('.intro__skip, .intro__open')) withSound(); });
  skipBtn.addEventListener('click', enter);
  openBtn.addEventListener('click', enter);
  video.addEventListener('timeupdate', () => { if (video.duration && video.currentTime > video.duration - 2) showOpen(); });
  video.addEventListener('ended', () => { showOpen(); chip(null); });
  video.addEventListener('error', showOpen);                 // if the film can't play, guests can still go in

  if (reduce) { chip('Tap to play'); showOpen(); } else start();
})();
