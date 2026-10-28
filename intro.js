/* Intro reel — ~12s kinetic-type opener modelled shot-for-shot on the reference film, first visit only.
   One clock drives every frame (render(t)); ?reelAt=ms freezes any moment for review. Click/tap/key skips.
   Images are always cards — never full-screen. */
(function () {
  var el = document.getElementById('intro');
  if (!el) return;
  var root = document.documentElement;
  if (root.classList.contains('no-intro')) { el.remove(); return; }

  var stage = el.querySelector('.intro__stage');
  var paper = '#F8F6F2', ink = '#111111', clay = '#B98C72', olive = '#7A7866', tile = '#ECE8E0';
  var work = ['bmp-tile.jpg', 'ren-tile.jpg', 'dox-tile.jpg', 'wc-tile.jpg', 'h2p-tile.jpg', 'own-tile.jpg'];
  var phones = ['bmp-home-new.jpg', 'ren-live-watching.jpg', 'h2p-n-wallets.png'];
  var END = 12300, done = false, scene = '';
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
    // 1 · Welcome / to / to the work / of
    if (t < 450) return word('welcome', paper, ink, 'Welcome');
    if (t < 750) return word('to', ink, paper, 'to');
    if (t < 1200) return word('tothe', ink, paper, 'to the work');
    if (t < 1500) return word('of', paper, ink, 'of');

    // 2 · Morayo · Akinkunmi — a dot grows into a card, the card swings in 3D through the work, then turns diagonal
    if (t < 3900) {
      build('name', paper, ink, '<div class="ir-line ir-3d"><span class="ir-l" id="a">Morayo</span>' + card(work[0], '', ' id="c"') + '<span class="ir-r" id="b">Akinkunmi</span></div>');
      var A = $('#a'), B = $('#b'), C = $('#c'), im = C.firstChild;
      var dot = io(prog(t, 1750, 2050)), grow = io(prog(t, 2050, 2700)), swing = io(prog(t, 2700, 3400)), diag = io(prog(t, 3300, 3900));
      var w = lerp(0.12, 1.1, dot) + grow * 1.1 + swing * 1.4, h = lerp(0.12, 1.0, dot) + grow * 0.9 + swing * 1.8;
      C.style.width = w + 'em'; C.style.height = h + 'em';
      C.style.borderRadius = (dot < 1 ? 999 : lerp(10, 8, grow)) + 'px';
      C.style.transform = 'perspective(900px) rotateY(' + (-30 * swing) + 'deg) rotateX(' + (8 * swing) + 'deg) rotate(' + lerp(0, -24, diag) + 'deg) scale(' + lerp(1, 2.1, diag) + ')';
      var k = Math.min(work.length - 1, Math.floor(prog(t, 2300, 3700) * work.length));
      if (im.getAttribute('src') !== work[k]) im.src = work[k];
      A.style.fontWeight = B.style.fontWeight = grow > 0.4 ? 700 : 400;
      A.style.transform = 'translateX(' + (-60 * diag) + 'vw) scaleX(' + lerp(1, 0.82, swing) + ')';
      B.style.transform = 'translateX(' + (60 * diag) + 'vw) scale(' + lerp(1, 1.25, grow) + ')';
      el.style.background = diag > 0.35 ? clay : paper;
      return;
    }

    // 3 · A / Product Designer
    if (t < 4250) return word('a', paper, ink, 'A');
    if (t < 4900) {
      word('pd', ink, paper, 'Product Designer', 'ir-lg');
      $('.ir-w').style.transform = 'scale(' + lerp(1.08, 1, out(prog(t, 4250, 4600))) + ')';
      return;
    }

    // 4 · Fintech · AI · SaaS — a pill opens, the words widen, the work scatters around in 3D and flies apart
    if (t < 7000) {
      build('fas', paper, ink,
        work.map(function (s, i) { return card(s, 'ir-fly', ' data-i="' + i + '"'); }).join('') +
        '<div class="ir-line ir-3d"><span class="ir-l" id="a">Fintech AI</span>' + card(work[1], 'ir-pill', ' id="c"') + '<span class="ir-r" id="b">SaaS</span></div>');
      var A2 = $('#a'), B2 = $('#b'), P = $('#c');
      var op = io(prog(t, 5150, 5550)), wide = io(prog(t, 5500, 6100)), fly = prog(t, 5600, 6900);
      P.style.width = lerp(0, 1.25, op) + 'em'; P.style.height = lerp(0.9, 1.5, op) + 'em';
      P.style.opacity = 1 - io(prog(t, 6200, 6500));
      A2.style.transform = 'scaleX(' + lerp(1, 0.86, wide) + ')'; B2.style.transform = 'scaleX(' + lerp(1, 1.55, wide) + ')';
      A2.style.fontWeight = B2.style.fontWeight = wide > 0.3 ? 800 : 400;
      var gone = io(prog(t, 6550, 6950));
      A2.style.opacity = B2.style.opacity = 1 - gone;
      $$('.ir-fly').forEach(function (f, i) {
        var a = (i / work.length) * Math.PI * 2 + 0.3, p = io(clamp(fly * 1.2 - i * 0.05));
        var rad = lerp(6, 38, Math.min(1, p * 1.4)) + Math.max(0, p - 0.7) * 120;
        f.style.transform = 'translate(-50%,-50%) translate(' + Math.cos(a) * rad + 'vw,' + Math.sin(a) * rad * 0.62 + 'vh) rotate(' + ((i % 2 ? 1 : -1) * (14 + 30 * p)) + 'deg) rotateY(' + ((i % 2 ? -1 : 1) * 35 * p) + 'deg) scale(' + lerp(0.2, 1, Math.min(1, p * 1.6)) + ')';
        f.style.opacity = p <= 0 ? 0 : 1;
      });
      return;
    }

    // 5 · Research. (cards slide behind) / tile grid ripple / Design. / Ship.
    if (t < 7650) {
      build('research', olive, paper, [0, 1, 2, 3].map(function (i) { return card(work[i + 1], 'ir-slide', ' data-i="' + i + '"'); }).join('') + '<span class="ir-w ir-lg ir-front">Research.</span>');
      var sp = prog(t, 7000, 7650);
      $$('.ir-slide').forEach(function (s, i) { s.style.transform = 'translate(-50%,-50%) translateX(' + lerp(120 - i * 34, -40 - i * 34, sp) + 'vw)'; });
      return;
    }
    if (t < 8200) {
      if (build('grid', clay, ink, '<div class="ir-grid">' + new Array(24).join('<span></span>') + '<span></span></div>')) { /* 24 tiles */ }
      var gp = (t - 7650) / 550;
      $$('.ir-grid span').forEach(function (s, i) {
        var x = i % 6, y = Math.floor(i / 6), ph = gp * Math.PI * 2 + x * 0.7 + y * 0.9;
        s.style.transform = 'translate(' + Math.sin(ph) * 14 + '%,' + Math.cos(ph * 0.8) * 12 + '%) rotate(' + Math.sin(ph + 1) * 8 + 'deg) scale(' + (0.9 + Math.sin(ph) * 0.12) + ',' + (0.9 + Math.cos(ph) * 0.12) + ')';
      });
      return;
    }
    if (t < 8600) return word('design', tile, ink, 'Design.', 'ir-xl');
    if (t < 9000) return word('ship', clay, ink, 'Ship.', 'ir-xl');

    // 6 · one card turning through the phone screens, ending as a triptych
    if (t < 10100) {
      build('trip', ink, paper, phones.map(function (s, i) { return card(s, 'ir-phone', ' data-i="' + i + '"'); }).join(''));
      var tp = io(prog(t, 9550, 10050)), spin = prog(t, 9000, 9600);
      $$('.ir-phone').forEach(function (p, i) {
        var off = i - 1, showAlone = Math.floor(spin * 3) === i;
        var x = off * 23 * tp, ry = tp < 1 ? lerp(spin * 720 % 360 > 180 ? -25 : 25, off * -18, tp) : off * -18;
        p.style.transform = 'translate(-50%,-50%) translateX(' + x + 'vw) perspective(900px) rotateY(' + ry + 'deg) scale(' + lerp(1.1, 1, tp) + ')';
        p.style.opacity = tp > 0.02 ? 1 : (showAlone ? 1 : 0);
        p.style.zIndex = off === 0 ? 2 : 1;
      });
      return;
    }

    // 7 · The future of / fintech / is / simple — then "simple" bends like a ribbon and collapses into the signature
    if (t < 10400) return word('fut', paper, ink, 'The future of');
    if (t < 10750) return word('fin', ink, paper, 'fintech', 'ir-xl');
    if (t < 11000) return word('is', paper, ink, 'is');
    if (t < 11800) {
      build('simple', paper, ink, '<div class="ir-ribbon" id="rb">' + 'simple'.split('').map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>');
      var rp = prog(t, 11000, 11800), bend = io(clamp(rp / 0.7)), col = io(prog(t, 11550, 11800));
      var L = $$('#rb span'), n = L.length;
      L.forEach(function (s, i) {
        var u = i / (n - 1) - 0.5;                                   // -0.5 … 0.5 along the word
        var wave = Math.sin(u * Math.PI * 2.2 + rp * 4);
        var sy = lerp(1, 3.2 + Math.abs(wave) * 1.6, bend), sx = lerp(1, 1.6, bend);
        var r = lerp(0, Math.cos(u * Math.PI * 2.2 + rp * 4) * 34, bend);
        var x = lerp(0, u * 140, bend), y = lerp(0, wave * 70, bend);
        s.style.transform = 'translate(' + lerp(x, 0, col) + '%,' + lerp(y, 0, col) + '%) rotate(' + lerp(r, 0, col) + 'deg) scale(' + lerp(sx, 0.02, col) + ',' + lerp(sy, 0.02, col) + ')';
      });
      return;
    }
    build('end', ink, paper, '<img class="ir-sign" id="sg" src="signature.png" alt="Morayo Akinkunmi">');
    var ep = out(prog(t, 11800, 12150)), sg = $('#sg');
    sg.style.opacity = ep; sg.style.transform = 'scale(' + lerp(0.5, 1, ep) + ')';
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
