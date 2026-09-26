/* ==========================================================================
   SOUND — a synthesised temple bell (no audio file needed) and optional
   background music. Nothing plays until the guest taps to open the doors.
   ========================================================================== */
window.Sound = (() => {
  let ctx = null;
  const audio = () => {
    if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (A) ctx = new A(); }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  // additive synthesis: inharmonic partials with long exponential decays, slightly detuned for shimmer
  function bell({ freq = 587, volume = 0.18, delay = 0 } = {}) {
    const c = audio();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const out = c.createGain();
    out.gain.value = volume;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 5200;
    out.connect(lp); lp.connect(c.destination);
    [[1, 1, 4.2], [1.004, 0.55, 4.0], [2.0, 0.45, 2.6], [2.76, 0.32, 2.0], [4.07, 0.2, 1.4], [5.4, 0.14, 1.0], [8.93, 0.06, 0.6]].forEach(([ratio, amp, dur]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'sine';
      o.frequency.value = freq * ratio;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(amp, t0 + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(out);
      o.start(t0); o.stop(t0 + dur + 0.1);
    });
  }
  return {
    unlock: audio,
    chime() { bell({ freq: 587, volume: 0.16 }); bell({ freq: 880, volume: 0.07, delay: 0.55 }); },
    bell,
  };
})();
