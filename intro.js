/* Intro — one continuous piece (~8s), first visit of the session only; click/tap/key skips.
   A · Momo (Morayo's line character) steps out of her door at double speed, walks over and waves;
       "Momo / Product Designer" types out beside her.
   B · Her line unravels into curving ribbons that flow out, and the six project images revolve on a 3D cylinder.
   ?reelAt=ms (ms into phase B) freezes a moment for review. */
(function () {
  var el = document.getElementById('intro');
  if (!el) return;
  var root = document.documentElement;
  if (root.classList.contains('no-intro')) { el.remove(); return; }

  var WORK = ['bmp-tile.jpg', 'ren-tile.jpg', 'dox-tile.jpg', 'wc-tile.jpg', 'own-tile.jpg', 'h2p-tile.jpg'];
  var START = 0.8, RATE = 2.1, WAVE = 8.6;                       // video seconds: door → walk → wave, at double speed
  var LINES = ['Momo', 'Product Designer'], CPS = 45;             // typewriter, ms per character
  var TYPE_MS = (LINES[0].length + 2 + LINES[1].length) * CPS + 450;
  var T = { flow: [0, 1100], orbit: 800, end: 3300 };             // phase B, ms after the typing finishes

  var stage = el.querySelector('.intro__stage'), done = false;
  stage.innerHTML =
    '<div class="mi" id="miA">' +
      '<video class="mi__video" src="momo-intro.mp4" muted playsinline preload="auto"></video>' +
      '<p class="mi__text"><span class="mi__l1"></span><span class="mi__l2"></span><i class="mi__caret"></i></p>' +
    '</div>' +
    '<svg class="mm__flow"></svg>' +
    '<div class="mm__orbit"><div class="mm__ring">' + WORK.map(function (s) { return '<img class="mm__card" src="' + s + '" alt="">'; }).join('') + '</div></div>';
  var $ = function (s) { return stage.querySelector(s); };
  var A = $('#miA'), v = $('.mi__video'), l1 = $('.mi__l1'), l2 = $('.mi__l2'), caret = $('.mi__caret');
  var flow = $('.mm__flow'), orbit = $('.mm__orbit'), ring = $('.mm__ring');
  var cards = Array.prototype.slice.call(stage.querySelectorAll('.mm__card'));

  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
  var prog = function (t, a, b) { return clamp((t - a) / (b - a)); };
  var io = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var out = function (x) { return 1 - Math.pow(1 - x, 3); };
  var lerp = function (a, b, p) { return a + (b - a) * p; };
  var typed = function (s, t0, t, ms) { return s.slice(0, Math.max(0, Math.floor((t - t0) / ms))); };

  // ribbons: six curves from points on her body out to the six orbit slots
  var ribbons = null;
  function makeRibbons() {
    var vw = innerWidth, vh = innerHeight, r = v.getBoundingClientRect();
    flow.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
    var body = [[0.47, 0.16], [0.43, 0.26], [0.46, 0.38], [0.5, 0.5], [0.48, 0.64], [0.45, 0.8]];
    var cx = vw / 2, cy = vh / 2, rx = Math.min(vw * 0.36, 620), ry = vh * 0.18;
    flow.innerHTML = body.map(function (b, i) {
      var sx = r.left + b[0] * r.width, sy = r.top + b[1] * r.height;
      var a = i / 6 * Math.PI * 2 - Math.PI / 2, ex = cx + Math.cos(a) * rx, ey = cy + Math.sin(a) * ry;
      // two soft S-bends per ribbon so the line swirls rather than shoots
      var mx = lerp(sx, ex, 0.5) + (i % 2 ? 1 : -1) * vw * 0.08, my = lerp(sy, ey, 0.5) - vh * (0.22 - i * 0.05);
      var c1x = sx - vw * (0.1 + i * 0.02), c1y = sy - vh * 0.28, c2x = mx + vw * 0.12, c2y = my + vh * 0.16;
      var c3x = mx - vw * 0.12, c3y = my - vh * 0.16, c4x = ex + (i % 2 ? -1 : 1) * vw * 0.1, c4y = ey - vh * 0.18;
      return '<path d="M' + sx + ' ' + sy + ' C' + c1x + ' ' + c1y + ' ' + c2x + ' ' + c2y + ' ' + mx + ' ' + my + ' C' + c3x + ' ' + c3y + ' ' + c4x + ' ' + c4y + ' ' + ex + ' ' + ey + '"/>';
    }).join('');
    ribbons = Array.prototype.slice.call(flow.querySelectorAll('path')).map(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L; return { p: p, L: L }; });
  }

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

  // phase B — her line unravels into curving ribbons, then the six images revolve
  function render(t) {
    var fl = prog(t, T.flow[0], T.flow[1]);
    A.style.opacity = 1 - io(clamp(fl / 0.35));
    if (!ribbons) makeRibbons();
    ribbons.forEach(function (r, i) {
      var p = io(clamp((fl - i * 0.04) / 0.8));
      r.p.style.strokeDashoffset = r.L * (1 - p * 2);
      r.p.style.opacity = p > 0 && p < 1 ? 1 : 0;
    });
    var ap = io(prog(t, T.orbit, T.orbit + 600));
    orbit.style.opacity = ap;
    var spin = (t - T.orbit) / 1000 * 38;
    ring.style.transform = 'rotateX(-8deg) rotateY(' + spin + 'deg) scale(' + lerp(0.7, 1, ap) + ')';
    var R = innerWidth <= 760 ? innerWidth * 0.4 : Math.min(innerWidth * 0.3, 460);
    cards.forEach(function (c, i) {
      var a = i / cards.length * 360, y = [-14, 10, -4, 16, -12, 6][i], tz = [4, -6, 8, -3, 6, -8][i];
      c.style.transform = 'translate(-50%,-50%) rotateY(' + a + 'deg) translateZ(' + R + 'px) translateY(' + y + 'vh) rotateZ(' + tz + 'deg)';
    });
  }

  function finish() {
    if (done) return; done = true;
    try { sessionStorage.setItem('momoReel', '1'); } catch (e) {}
    el.classList.add('is-out');
    document.dispatchEvent(new Event('intro:done'));
    setTimeout(function () { el.remove(); }, 800);
  }

  var seek = (location.search.match(/[?&]reelAt=(\d+)/) || [])[1];
  if (seek != null) { renderA(9.5, 99999); render(+seek); return; }   // review: freeze phase B at reelAt ms

  var waveAt = null, bAt = null;
  v.addEventListener('loadedmetadata', function () { v.currentTime = START; v.playbackRate = RATE; }, { once: true });
  (function loop(now) {
    if (done) return;
    if (waveAt == null) {
      renderA(v.currentTime, 0);
      if (v.currentTime >= WAVE) { waveAt = now; v.playbackRate = 1; }
    } else if (bAt == null) {
      renderA(v.currentTime, now - waveAt);
      if (now - waveAt >= TYPE_MS) { bAt = now; v.pause(); }
    } else {
      var t = now - bAt; render(t);
      if (t >= T.end) { finish(); return; }
    }
    requestAnimationFrame(loop);
  })(performance.now());
  var pl = v.play(); if (pl && pl.catch) pl.catch(finish);              // autoplay blocked → straight to the site
  setTimeout(function () { if (v.currentTime <= START) finish(); }, 3000);
  addEventListener('resize', function () { ribbons = null; });
  el.addEventListener('click', finish);
  window.addEventListener('keydown', finish, { once: true });
})();
