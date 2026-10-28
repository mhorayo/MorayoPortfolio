/* Intro — one continuous piece (~8s), first visit of the session only; click/tap/key skips.
   A · Momo (Morayo's line character) steps out of her door at double speed, walks over and waves;
       "Momo / Product Designer" types out beside her.
   B · Momo unwinds into a single ink line: it traces her body, straightens into a horizontal stroke,
       then wraps into the outline of a card.
   C · The card fills with the work and becomes the centre of a 3D orbit of project images.
   ?reelAt=ms (ms into phase B) freezes the line/orbit for review. */
(function () {
  var el = document.getElementById('intro');
  if (!el) return;
  var root = document.documentElement;
  if (root.classList.contains('no-intro')) { el.remove(); return; }

  var START = 0.8, RATE = 2.1, WAVE = 8.6;                      // video seconds
  var LINES = ['Momo', 'Product Designer'], CPS = 45;            // ms per character
  var CENTRE = ['bmp-web-dashboard.jpg', 'dox-clarity.jpg', 'own-project-2x.jpg', 'h2p-20-web-dashboard-flat.jpg'];
  var ORBIT = ['bmp-tile.jpg', 'ren-tile.jpg', 'dox-tile.jpg', 'wc-tile.jpg', 'h2p-tile.jpg', 'own-tile.jpg', 'bmp-home-new.jpg', 'ren-welcome.jpg',
               'wc-home.jpg', 'ren-live-watching.jpg', 'own-payments-2x.jpg', 'dox-signature.jpg', 'wc-matches.jpg', 'bmp-kyc-start.jpg', 'h2p-tile.jpg', 'ren-tile.jpg'];
  var N = 64;                                                    // points on the line

  var stage = el.querySelector('.intro__stage'), done = false;
  stage.innerHTML =
    '<div class="mi" id="miA">' +
      '<video class="mi__video" src="momo-intro.mp4" muted playsinline preload="auto"></video>' +
      '<p class="mi__text"><span class="mi__l1"></span><span class="mi__l2"></span><i class="mi__caret"></i></p>' +
    '</div>' +
    '<svg class="mi__svg" id="miLine"><polyline fill="none" /></svg>' +
    '<div class="mo" id="miC">' + ORBIT.map(function (s) { return '<img class="mo__card" src="' + s + '" alt="">'; }).join('') +
      '<div class="mo__centre"><img src="' + CENTRE[0] + '" alt=""></div></div>';

  var $ = function (s) { return stage.querySelector(s); };
  var A = $('#miA'), v = $('.mi__video'), l1 = $('.mi__l1'), l2 = $('.mi__l2'), caret = $('.mi__caret');
  var svg = $('#miLine'), line = svg.querySelector('polyline'), C = $('#miC'), centre = $('.mo__centre'), cimg = centre.firstChild;
  var cards = Array.prototype.slice.call(stage.querySelectorAll('.mo__card'));
  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
  var prog = function (t, a, b) { return clamp((t - a) / (b - a)); };
  var io = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var out = function (x) { return 1 - Math.pow(1 - x, 3); };
  var lerp = function (a, b, p) { return a + (b - a) * p; };

  // ---------- phase A: Momo ----------
  function renderA(vs, typed) {
    var k = io(clamp((vs - 5) / 3.2));
    v.style.transform = 'scale(' + (1 - 0.42 * k) + ')';
    var n = Math.max(0, Math.floor(typed / CPS));
    var a = Math.min(LINES[0].length, n), b = Math.max(0, Math.min(LINES[1].length, n - LINES[0].length - 2));
    l1.textContent = LINES[0].slice(0, a); l2.textContent = LINES[1].slice(0, b);
    caret.style.visibility = typed > 0 ? 'visible' : 'hidden';
    (b > 0 ? l2 : l1).after(caret);
  }
  var TYPE_MS = (LINES[0].length + 2 + LINES[1].length) * CPS + 350;

  // ---------- phase B/C: line → card → orbit ----------
  var shapes = null;
  function sample(fn) { var p = []; for (var i = 0; i < N; i++) p.push(fn(i / (N - 1))); return p; }
  function makeShapes() {
    var vw = innerWidth, vh = innerHeight, r = v.getBoundingClientRect();
    // her body: head → neck → soft S down to the hem (fractions of the video box)
    var body = [[0.47, 0.14], [0.44, 0.22], [0.46, 0.34], [0.5, 0.48], [0.49, 0.62], [0.45, 0.78], [0.43, 0.96]];
    var along = function (pts, u) {
      var f = u * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), t = f - i;
      return [lerp(pts[i][0], pts[i + 1][0], t), lerp(pts[i][1], pts[i + 1][1], t)];
    };
    var cw = Math.min(vw * 0.5, 780), ch = cw * 0.62, cx = vw / 2, cy = vh / 2;
    var rect = function (u) {                                     // perimeter, starting top-left, clockwise
      var P = 2 * (cw + ch), d = u * P, x0 = cx - cw / 2, y0 = cy - ch / 2;
      if (d < cw) return [x0 + d, y0]; d -= cw;
      if (d < ch) return [x0 + cw, y0 + d]; d -= ch;
      if (d < cw) return [x0 + cw - d, y0 + ch]; d -= cw;
      return [x0, y0 + ch - d];
    };
    shapes = {
      body: sample(function (u) { var p = along(body, u); return [r.left + p[0] * r.width, r.top + p[1] * r.height]; }),
      flat: sample(function (u) { return [lerp(cx - cw / 2, cx + cw / 2, u), cy - ch / 2]; }),   // = the card's top edge
      card: sample(rect),
      box: { w: cw, h: ch }, top: cw / (2 * (cw + ch))
    };
    svg.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
  }
  function mix(a, b, p) { return a.map(function (q, i) { return [lerp(q[0], b[i][0], p), lerp(q[1], b[i][1], p)]; }); }
  function setLine(pts, drawn) {
    line.setAttribute('points', pts.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '));
    var len = 0; for (var i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    line.style.strokeDasharray = len; line.style.strokeDashoffset = len * (1 - drawn);
  }

  var B_END = 4400;
  function renderB(t) {
    if (!shapes) makeShapes();
    // Momo fades out as the line traces her body
    A.style.opacity = 1 - io(prog(t, 0, 450));
    var draw = io(prog(t, 0, 450)), straighten = io(prog(t, 450, 950)), wrap = io(prog(t, 950, 1500));
    // the straight line lands as the card's top edge, then keeps drawing round the rest of the outline
    if (wrap > 0) setLine(shapes.card, lerp(shapes.top, 1, wrap));
    else setLine(mix(shapes.body, shapes.flat, straighten), draw);
    svg.style.opacity = 1 - io(prog(t, 1500, 1800));
    // the card fills and the orbit begins
    var fill = io(prog(t, 1450, 1800));
    C.style.opacity = fill > 0 ? 1 : 0;
    var tilt = prog(t, 1500, B_END);
    centre.style.width = shapes.box.w + 'px'; centre.style.height = shapes.box.h + 'px';
    centre.style.opacity = fill;
    centre.style.transform = 'translate(-50%,-50%) perspective(1200px) rotateY(' + lerp(0, -14, io(tilt)) + 'deg) rotateX(' + lerp(0, 6, io(tilt)) + 'deg)';
    var k = Math.min(CENTRE.length - 1, Math.floor(prog(t, 1800, B_END - 300) * CENTRE.length));
    if (cimg.getAttribute('src') !== CENTRE[k]) cimg.src = CENTRE[k];
    var spin = (t - 1500) / 1000 * 0.55, appear = io(prog(t, 1500, 2300));
    var vw = innerWidth, vh = innerHeight, R = Math.min(vw * 0.62, vh * 0.95);
    cards.forEach(function (c, i) {
      var lat = ((i * 0.61803) % 1 - 0.5) * 1.6, a = i / cards.length * Math.PI * 2 + spin;
      var x = Math.cos(a) * R * Math.cos(lat), z = Math.sin(a) * R * Math.cos(lat) * 0.7, y = Math.sin(lat) * R * 0.62;
      var s = 900 / (900 - z * 0.9) * lerp(0.2, 1, appear);
      c.style.transform = 'translate(-50%,-50%) translate(' + (x * appear) + 'px,' + (y * appear) + 'px) scale(' + s + ') rotate(' + (Math.sin(a + i) * 22) + 'deg) rotateY(' + (Math.cos(a) * -40) + 'deg)';
      c.style.zIndex = z > 0 ? 3 : 1;
      c.style.opacity = appear * (z > 0 && Math.abs(x) < shapes.box.w * 0.45 && Math.abs(y) < shapes.box.h * 0.45 ? 0.35 : 0.6 + 0.4 * (z / R + 1) / 2);
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
  if (seek != null) {                                            // review: freeze phase B at reelAt ms
    renderA(9.5, 99999); renderB(+seek);
    return;
  }

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
      var t = now - bAt; renderB(t);
      if (t >= B_END) { finish(); return; }
    }
    requestAnimationFrame(loop);
  })(performance.now());

  var p = v.play(); if (p && p.catch) p.catch(finish);
  setTimeout(function () { if (v.currentTime <= START) finish(); }, 3000);
  addEventListener('resize', function () { shapes = null; });
  el.addEventListener('click', finish);
  window.addEventListener('keydown', finish, { once: true });
})();
