/* Intro — Momo (Morayo's line-drawn character) steps out of a little door, walks over and waves; as she waves,
   "Momo / Product Designer" types out beside her. First visit of the session only; click/tap/key skips.
   The video's own clock drives everything; ?reelAt=ms freezes a moment for review. */
(function () {
  var el = document.getElementById('intro');
  if (!el) return;
  var root = document.documentElement;
  if (root.classList.contains('no-intro')) { el.remove(); return; }

  var WAVE = 8.6, LINES = ['Momo', 'Product Designer'], CPS = 0.065, END = 11.2;   // seconds
  var stage = el.querySelector('.intro__stage'), done = false;
  stage.innerHTML =
    '<div class="mi">' +
      '<video class="mi__video" src="momo-intro.mp4" muted playsinline preload="auto"></video>' +
      '<p class="mi__text"><span class="mi__l1"></span><span class="mi__l2"></span><i class="mi__caret"></i></p>' +
    '</div>';
  var v = stage.querySelector('.mi__video'), l1 = stage.querySelector('.mi__l1'), l2 = stage.querySelector('.mi__l2'), caret = stage.querySelector('.mi__caret');
  var seek = (location.search.match(/[?&]reelAt=(\d+)/) || [])[1];
  seek = seek == null ? null : +seek / 1000;

  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
  var io = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  function render(s) {
    // she walks toward the camera from ~5s; shrink the video so she seems to stay put
    var k = io(clamp((s - 5) / 3.2));
    v.style.transform = 'scale(' + (1 - 0.42 * k) + ')';
    // typewriter once she waves
    var n = Math.max(0, Math.floor((s - WAVE) / CPS));
    var a = Math.min(LINES[0].length, n), b = Math.max(0, Math.min(LINES[1].length, n - LINES[0].length - 3));
    l1.textContent = LINES[0].slice(0, a); l2.textContent = LINES[1].slice(0, b);
    caret.style.visibility = s >= WAVE ? 'visible' : 'hidden';
    (b > 0 ? l2 : l1).after(caret);
  }

  function finish() {
    if (done) return; done = true;
    try { sessionStorage.setItem('momoReel', '1'); } catch (e) {}
    el.classList.add('is-out');
    document.dispatchEvent(new Event('intro:done'));
    setTimeout(function () { el.remove(); }, 800);
  }

  if (seek != null) {
    v.addEventListener('loadeddata', function () { v.currentTime = Math.min(seek, v.duration - 0.05); }, { once: true });
    v.addEventListener('seeked', function () { render(seek); }, { once: true });
    return;
  }

  // clock: the video while it plays, then wall time once it has ended (she holds her last frame)
  var endedAt = null;
  v.addEventListener('ended', function () { endedAt = performance.now(); });
  (function loop(now) {
    if (done) return;
    var s = endedAt == null ? v.currentTime : v.duration + (now - endedAt) / 1000;
    render(s);
    if (s >= END) { finish(); return; }
    requestAnimationFrame(loop);
  })(performance.now());

  var p = v.play(); if (p && p.catch) p.catch(finish);                 // autoplay blocked → straight to the site
  setTimeout(function () { if (v.currentTime === 0) finish(); }, 2500); // video failed to start → don't hold anyone up
  el.addEventListener('click', finish);
  window.addEventListener('keydown', finish, { once: true });
})();
