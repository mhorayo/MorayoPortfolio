/* Intro reel — ~5.5s kinetic-type opener modelled shot-for-shot on the reference film, first visit only.
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
  var END = 5600, done = false, scene = '';
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

  function render(t) {
    // 1 · Welcome / to the work / of
    if (t < 350) return word('welcome', paper, ink, 'Welcome');
    if (t < 750) return word('tothe', nude, ink, 'to the work');
    if (t < 1000) return word('of', paper, ink, 'of');

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

    // 3 · Fintech AI · SaaS — a pill opens, the words widen, the work scatters around in 3D and flies apart
    if (t < 4300) {
      build('fas', paper, ink,
        work.map(function (s, i) { return card(s, 'ir-fly', ' data-i="' + i + '"'); }).join('') +
        '<div class="ir-line ir-3d"><span class="ir-l" id="a">Fintech AI</span>' + card(work[1], 'ir-pill', ' id="c"') + '<span class="ir-r" id="b">SaaS</span></div>');
      var A2 = $('#a'), B2 = $('#b'), P = $('#c');
      var op = io(prog(t, 2800, 3150)), wide = io(prog(t, 3100, 3600)), fly = prog(t, 3200, 4250), gone = io(prog(t, 3950, 4300));
      P.style.width = lerp(0, 1, op) + 'em'; P.style.height = lerp(0.85, 1.2, op) + 'em';
      P.style.opacity = 1 - io(prog(t, 3700, 3950));
      A2.style.transform = 'scaleX(' + lerp(1, 0.9, wide) + ')'; B2.style.transform = 'scaleX(' + lerp(1, 1.35, wide) + ')';
      A2.style.opacity = B2.style.opacity = 1 - gone;
      $$('.ir-fly').forEach(function (f, i) {
        var a = (i / work.length) * Math.PI * 2 + 0.3, p = io(clamp(fly * 1.2 - i * 0.05));
        var rad = lerp(6, 32, Math.min(1, p * 1.4)) + Math.max(0, p - 0.7) * 120;
        f.style.transform = 'translate(-50%,-50%) translate(' + Math.cos(a) * rad + 'vw,' + Math.sin(a) * rad * 0.62 + 'vh) rotate(' + ((i % 2 ? 1 : -1) * (12 + 26 * p)) + 'deg) rotateY(' + ((i % 2 ? -1 : 1) * 30 * p) + 'deg) scale(' + lerp(0.2, 1, Math.min(1, p * 1.6)) + ')';
        f.style.opacity = p <= 0 ? 0 : 1;
      });
      return;
    }

    // 4 · Research. (cards slide behind) / Design. / Ship.
    if (t < 4800) {
      build('research', nude, ink, [0, 1, 2].map(function (i) { return card(work[i + 2], 'ir-slide', ' data-i="' + i + '"'); }).join('') + '<span class="ir-w ir-front">Research.</span>');
      var sp = prog(t, 4300, 4800);
      $$('.ir-slide').forEach(function (s, i) { s.style.transform = 'translate(-50%,-50%) translateX(' + lerp(90 - i * 30, -30 - i * 30, sp) + 'vw)'; });
      return;
    }
    if (t < 5100) return word('design', tile, ink, 'Design.');
    if (t < 5400) return word('ship', clay, ink, 'Ship.');

    return word('ship', clay, ink, 'Ship.');
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
