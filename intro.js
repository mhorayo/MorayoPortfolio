/* Intro — plays once per browser (then the home page opens straight on the hero; ?intro replays it).
   Momo (Morayo's line character) steps out of her door at double speed, walks over and waves;
   "Don't wait for change. / Design it." types out beside her. Then the intro hands over to the hero without a cut:
   the hero underneath is the same frame (same Momo, same words, same place), so the overlay simply goes
   and the page builds around her (land.js). Scrolling, a click or a key skips straight to the site. */
(function () {
  var el = document.getElementById('intro');
  if (!el) return;
  var root = document.documentElement;
  if (root.classList.contains('no-intro')) { el.remove(); return; }
  try { localStorage.setItem('mk_intro_seen', '1'); } catch (e) {}   // plays once per browser; ?intro replays it

  var START = 0.8, RATE = 2.1, WAVE = 8.6;                       // video seconds: door → walk → wave, at double speed
  var LINES = ['Don’t wait for change.', 'Design it.'], CPS = 32;             // typewriter, ms per character
  var TYPE_MS = (LINES[0].length + 2 + LINES[1].length) * CPS + 450;
  var BEAT = 650;                                                 // a breath on the finished frame before the page builds

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  document.body.classList.add('intro-on');

  var stage = el.querySelector('.intro__stage'), done = false;
  stage.innerHTML =
    '<div class="mi" id="miA">' +
      '<video class="mi__video" src="momo-intro.mp4" muted playsinline preload="auto"></video>' +
      '<p class="mi__text"><span class="mi__l1"></span><span class="mi__l2"></span><i class="mi__caret"></i></p>' +
    '</div>';
  var $ = function (s) { return stage.querySelector(s); };
  var v = $('.mi__video'), l1 = $('.mi__l1'), l2 = $('.mi__l2'), caret = $('.mi__caret');

  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
  var io = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  // phase A — Momo out of her door; she shrinks back as she walks forward; her name types out as she waves
  function renderA(vs, typed) {
    var k = io(clamp((vs - 5) / 3.2));
    v.style.transform = 'scale(' + (1 - 0.42 * k) + ')';
    var n = Math.max(0, Math.floor(typed / CPS));
    var a = Math.min(LINES[0].length, n), b = Math.max(0, Math.min(LINES[1].length, n - LINES[0].length - 2));
    l1.textContent = LINES[0].slice(0, a); l2.textContent = LINES[1].slice(0, b);
    caret.style.visibility = typed > 0 ? 'visible' : 'hidden';
    (b > 0 ? l2 : l1).after(caret);
  }

  // seamless: the intro's last frame matches the hero, so the overlay goes at once; otherwise (a skip) it fades
  function finish(seamless) {
    if (done) return; done = true;
    document.body.classList.remove('intro-on');
    document.dispatchEvent(new CustomEvent('intro:done', { detail: { seamless: !!seamless } }));
    if (seamless) { el.remove(); return; }
    el.classList.add('is-out');
    setTimeout(function () { el.remove(); }, 1100);
  }

  var waveAt = null;
  v.addEventListener('loadedmetadata', function () { v.currentTime = START; v.playbackRate = RATE; }, { once: true });
  (function loop(now) {
    if (done) return;
    if (waveAt == null) {
      renderA(v.currentTime, 0);
      if (v.currentTime >= WAVE) { waveAt = now; v.playbackRate = 1; }
    } else {
      renderA(v.currentTime, now - waveAt);
      if (now - waveAt >= TYPE_MS + BEAT && (v.ended || v.currentTime >= v.duration - 0.05)) { finish(true); return; }
    }
    requestAnimationFrame(loop);
  })(performance.now());
  var pl = v.play(); if (pl && pl.catch) pl.catch(function () { finish(false); });   // autoplay blocked → straight to the site
  setTimeout(function () { if (v.currentTime <= START) finish(false); }, 3000);
  // any scroll, click or key skips to the site
  var pushed = 0;
  el.addEventListener('wheel', function (e) { e.preventDefault(); pushed += Math.abs(e.deltaY || e.deltaX); if (pushed > 60) finish(false); }, { passive: false });
  var ty = null;
  el.addEventListener('touchstart', function (e) { ty = e.touches[0].clientY; }, { passive: true });
  el.addEventListener('touchmove', function (e) { if (ty == null) return; e.preventDefault(); if (Math.abs(ty - e.touches[0].clientY) > 30) finish(false); }, { passive: false });
  el.addEventListener('click', function () { finish(false); });
  window.addEventListener('keydown', function (e) { if (['Enter', ' ', 'Escape', 'ArrowDown', 'PageDown'].indexOf(e.key) > -1) finish(false); });
})();
