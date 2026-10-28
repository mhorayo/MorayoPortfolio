/* Intro reel — ~5.6s: Momo walks in and waves, the words appear beside her, then her name opens onto the work kinetic-type opener modelled shot-for-shot on the reference film, first visit only.
   One clock drives every frame (render(t)); ?reelAt=ms freezes any moment for review. Click/tap/key skips.
   Images are always cards — never full-screen. */
(function () {
  var el = document.getElementById('intro');
  if (!el) return;
  var root = document.documentElement;
  if (root.classList.contains('no-intro')) { el.remove(); return; }

  var stage = el.querySelector('.intro__stage');
  var paper = '#F8F6F2', ink = '#111111', clay = '#B98C72', tile = '#ECE8E0', nude = '#E6D5C5';
  var work = ['bmp-tile.jpg', 'ren-tile.jpg', 'dox-tile.jpg', 'wc-tile.jpg', 'h2p-tile.jpg', 'own-tile.jpg'];
  var END = 3600 + (2700 - 1000) * 1.15 + 100, done = false, scene = '';
  var seek = (location.search.match(/[?&]reelAt=(\d+)/) || [])[1];
  seek = seek == null ? null : +seek;

  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
  var prog = function (t, a, b) { return clamp((t - a) / (b - a)); };
  var io = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var out = function (x) { return 1 - Math.pow(1 - x, 3); };
  var lerp = function (a, b, p) { return a + (b - a) * p; };
  var $ = function (s) { return stage.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(stage.querySelectorAll(s)); };
  var card = function (src, cls, extra) { return '<span class="ir-card ' + (cls || '') + '"' + (extra || '') + '><img src="' + src + '" alt=""></span>'; };

  function build(id, bg, fg, html) {
    if (scene === id) return false;
    scene = id; el.style.background = bg; el.style.color = fg;
    stage.innerHTML = '<div class="ir-scene">' + html + '</div>'; return true;
  }
  var word = function (id, bg, fg, txt, cls) { build(id, bg, fg, '<span class="ir-w ' + (cls || '') + '">' + txt + '</span>'); };

  // Momo, our own single-line character: round head, bow, soft dress, real legs (thigh + shin) and arms.
  var GIRL = '<svg class="ir-girl" viewBox="0 0 200 420" aria-hidden="true">' +
    '<g id="gb">' +
      '<g id="lgB" transform="translate(92 262)"><path d="M0 0 L0 70"/><g class="sh" transform="translate(0 70)"><path d="M0 0 L0 66 L12 70"/></g></g>' +
      '<g id="arB" transform="translate(84 130)"><path d="M0 0 C-4 30 -6 60 -4 86"/></g>' +
      '<path class="fill" d="M100 104 C78 104 74 124 72 150 C68 200 62 240 58 268 L142 268 C138 240 132 200 128 150 C126 124 122 104 100 104 Z"/>' +
      '<g id="lgF" transform="translate(108 262)"><path d="M0 0 L0 70"/><g class="sh" transform="translate(0 70)"><path d="M0 0 L0 66 L12 70"/></g></g>' +
      '<g id="arF" transform="translate(116 130)"><path d="M0 0 C4 30 6 60 4 86"/><path class="hand" d="M4 86 c-4 6 -2 12 3 12 c5 0 6 -6 3 -12"/></g>' +
      '<path class="fill" d="M100 30 C78 30 66 46 66 66 C66 88 82 100 100 100 C118 100 134 88 134 66 C134 46 122 30 100 30 Z"/>' +
      '<circle cx="88" cy="62" r="7"/><circle cx="112" cy="62" r="7"/><circle class="dot" cx="89" cy="63" r="2"/><circle class="dot" cx="113" cy="63" r="2"/>' +
      '<path d="M90 80 C96 86 104 86 110 80"/>' +
      '<path class="fill" d="M112 34 C104 18 92 18 96 30 C100 40 110 38 112 34 C114 38 124 40 128 30 C132 18 120 18 112 34 Z"/><circle class="fill" cx="112" cy="33" r="4"/>' +
    '</g></svg>';

  function girl(t, x, waving) {
    var g = $('.ir-girl'); if (!g) return;
    g.style.transform = 'translateX(' + x + 'vw)';
    var walking = !waving && t < 1500, ph = t / 300 * Math.PI;           // ~1.6 steps per second
    var sw = walking ? Math.sin(ph) : 0, bob = walking ? Math.abs(Math.sin(ph)) * 5 : 0;
    var rot = function (id, deg, knee) {
      var n = g.querySelector('#' + id); if (!n) return;
      var base = n.getAttribute('transform').split(' rotate')[0];
      n.setAttribute('transform', base + ' rotate(' + deg + ')');
      if (knee != null) { var s = n.querySelector('.sh'); s.setAttribute('transform', 'translate(0 70) rotate(' + knee + ')'); }
    };
    // legs: thighs swing opposite; the knee bends as each leg passes under the body
    rot('lgF', 24 * sw, walking ? Math.max(0, Math.sin(ph + 1.2)) * 34 : 0);
    rot('lgB', -24 * sw, walking ? Math.max(0, Math.sin(ph + 1.2 + Math.PI)) * 34 : 0);
    // arms swing against the legs; the front arm waves once she stops
    rot('arB', 18 * sw);
    if (waving) { var wv = clamp((t - 1500) / 250); rot('arF', lerp(0, -150, wv) + Math.sin((t - 1500) / 110) * 14 * wv); }
    else rot('arF', -18 * sw);
    g.querySelector('#gb').setAttribute('transform', 'translate(0 ' + (-bob) + ')');
  }

  function render(t) {
    // 1 · she walks in, stops and waves; Welcome / to the work / of appear beside her
    if (t < 3600) {
      if (build('hello', paper, ink, '<div class="ir-hello">' + GIRL + '<span class="ir-w ir-side" id="hw"></span></div>')) {}
      var x = lerp(-60, 0, out(prog(t, 0, 1500)));
      girl(t, x, t >= 1500);
      var hw = $('#hw'), txt = t < 2000 ? '' : t < 2600 ? 'Welcome' : t < 3150 ? 'to the work' : 'of';
      if (hw.textContent !== txt) hw.textContent = txt;
      el.style.background = (t >= 2600 && t < 3150) ? nude : paper;
      hw.style.opacity = txt ? out(prog(t, t < 2600 ? 2000 : t < 3150 ? 2600 : 3150, (t < 2600 ? 2000 : t < 3150 ? 2600 : 3150) + 200)) : 0;
      return;
    }
    // the rest runs on the original timeline, slowed down a little
    t = 1000 + (t - 3600) / 1.15;

    // 2 · Morayo · Akinkunmi — a dot grows into a card that swings in 3D through the work
    if (t < 2700) {
      build('name', paper, ink, '<div class="ir-line ir-3d"><span class="ir-l" id="a">Morayo</span>' + card(work[0], '', ' id="c"') + '<span class="ir-r" id="b">Akinkunmi</span></div>');
      var A = $('#a'), B = $('#b'), C = $('#c'), im = C.firstChild;
      var dot = io(prog(t, 1150, 1400)), grow = io(prog(t, 1400, 1900)), swing = io(prog(t, 1900, 2450)), leave = io(prog(t, 2400, 2700));
      C.style.width = (lerp(0.12, 1, dot) + grow * 0.7 + swing * 0.5) + 'em';
      C.style.height = (lerp(0.12, 0.9, dot) + grow * 0.6 + swing * 0.7) + 'em';
      C.style.borderRadius = (dot < 1 ? 999 : 8) + 'px';
      C.style.transform = 'perspective(900px) rotateY(' + (-26 * swing) + 'deg) rotateX(' + (7 * swing) + 'deg) scale(' + (1 - leave) + ')';
      var k = Math.min(work.length - 1, Math.floor(prog(t, 1500, 2500) * work.length));
      if (im.getAttribute('src') !== work[k]) im.src = work[k];
      A.style.transform = 'translateX(' + (-60 * leave) + 'vw) scaleX(' + lerp(1, 0.86, swing) + ')';
      B.style.transform = 'translateX(' + (60 * leave) + 'vw) scaleX(' + lerp(1, 1.18, grow) + ')';
      return;
    }

  }

  function finish() {
    if (done) return; done = true;
    try { sessionStorage.setItem('momoReel', '1'); } catch (e) {}
    el.classList.add('is-out');
    document.dispatchEvent(new Event('intro:done'));
    setTimeout(function () { el.remove(); }, 800);
  }

  if (seek != null) { render(seek); return; }
  var t0 = null;
  (function loop(now) {
    if (done) return;
    if (t0 == null) t0 = now;
    var t = now - t0; render(t);
    if (t >= END) { finish(); return; }
    requestAnimationFrame(loop);
  })(performance.now());
  el.addEventListener('click', finish);
  window.addEventListener('keydown', finish, { once: true });
})();
