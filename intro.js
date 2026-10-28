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

  // Momo — Morayo's own line drawing. She has no legs, so she "walks" in steps: each step lifts, pushes
  // forward and lands softly with a little side-to-side weight shift, one after another.
  var GIRL = '<img class="ir-girl" src="momo-char.png" alt="">';
  var STEPS = 5, STEP = 300;                                            // 5 steps, 0.3s each

  function girl(t, waving) {
    var g = $('.ir-girl'); if (!g) return;
    var x, y = 0, r = 0, sy = 1;
    if (!waving) {
      var s = Math.min(STEPS - 1, Math.floor(t / STEP)), f = clamp((t - s * STEP) / STEP);
      var push = out(f);                                                 // forward push of this step
      x = lerp(-58, 0, (s + push) / STEPS);
      y = -Math.sin(f * Math.PI) * 4;                                    // lift, then land
      r = (s % 2 ? 1 : -1) * 3 * Math.sin(f * Math.PI) + 2;              // lean into the step, shift weight
      sy = 1 - Math.max(0, Math.sin((f - 0.85) / 0.15 * Math.PI)) * 0.03; // soft squash on landing
    } else {
      var w = (t - STEPS * STEP);
      x = 0; y = -Math.abs(Math.sin(w / 160)) * 1.5;
      r = Math.sin(w / 160) * 3.5 * Math.max(0, 1 - w / 1800) + 1;     // happy little sway while she waves
    }
    g.style.transform = 'translateX(' + x + 'vw) translateY(' + y + '%) rotate(' + r + 'deg) scaleY(' + sy + ')';
  }

  function render(t) {
    // 1 · she walks in, stops and waves; Welcome / to the work / of appear beside her
    if (t < 3600) {
      if (build('hello', paper, ink, '<div class="ir-hello">' + GIRL + '<span class="ir-w ir-side" id="hw"></span></div>')) {}
      girl(t, t >= STEPS * STEP);
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
