/* Intro reel — a ~7s kinetic-type opener, first visit of the session only.
   Every frame is drawn from one clock (render(t)), so motion stays in sync and ?reelAt=ms can freeze any moment.
   Click, tap or any key skips. */
(function () {
  var el = document.getElementById('intro');
  if (!el) return;
  var root = document.documentElement;
  if (root.classList.contains('no-intro')) { el.remove(); return; }

  var stage = el.querySelector('.intro__stage');
  var paper = '#F8F6F2', ink = '#111111', clay = '#B98C72';
  var work = ['bmp-tile.jpg', 'dox-tile.jpg', 'ren-tile.jpg', 'wc-tile.jpg', 'h2p-tile.jpg', 'own-tile.jpg'];
  var END = 7000, done = false, scene = '';
  var seek = (location.search.match(/[?&]reelAt=(\d+)/) || [])[1];
  seek = seek == null ? null : +seek;

  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
  var prog = function (t, a, b) { return clamp((t - a) / (b - a)); };
  var io = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };   // ease in-out
  var out = function (x) { return 1 - Math.pow(1 - x, 3); };
  var lerp = function (a, b, p) { return a + (b - a) * p; };
  var $ = function (s) { return stage.querySelector(s); };

  // build the DOM for a scene once, when the clock enters it
  function build(id, bg, fg, html) {
    if (scene === id) return false;
    scene = id; el.style.background = bg; el.style.color = fg; stage.innerHTML = html; return true;
  }

  function render(t) {
    // 1 · Hi, / I'm / Momo — hard cuts
    if (t < 380) { build('hi', ink, paper, '<div class="intro__scene"><span class="intro__word">Hi,</span></div>'); return; }
    if (t < 760) { build('im', ink, paper, '<div class="intro__scene"><span class="intro__word">I&rsquo;m</span></div>'); return; }
    if (t < 1250) {
      build('momo', paper, ink, '<div class="intro__scene"><span class="intro__word" id="iw">Momo</span></div>');
      $('#iw').style.transform = 'scale(' + lerp(0.92, 1, out(prog(t, 760, 1100))) + ')';
      return;
    }

    // 2 · Complex [card] Simple — a pill opens between the words, grows and swings in 3D,
    //     photos flick inside, the words squeeze/stretch, then the card takes the whole screen
    if (t < 3500) {
      if (build('cs', paper, ink,
        '<div class="intro__scene intro__3d"><div class="intro__line">' +
        '<span class="intro__l" id="il">Complex</span>' +
        '<span class="intro__card" id="ic"><img src="' + work[0] + '" alt=""></span>' +
        '<span class="intro__r" id="ir">Simple</span></div></div>')) { /* first frame */ }
      var L = $('#il'), R = $('#ir'), C = $('#ic'), img = C.firstChild;
      var open = io(prog(t, 1500, 1950)), grow = io(prog(t, 1950, 2800)), take = io(prog(t, 2850, 3450));
      // card size (em, relative to the line's font size) and 3D swing
      var w = lerp(0, 2.3, open) + grow * 1.5, h = lerp(0.95, 0.95, open) + grow * 2.2;
      var ry = -26 * grow * (1 - take), rx = 10 * grow * (1 - take), rz = -6 * grow * (1 - take);
      C.style.width = w + 'em'; C.style.height = h + 'em';
      C.style.borderRadius = lerp(999, 14, grow) + 'px';
      C.style.transform = 'perspective(900px) rotateY(' + ry + 'deg) rotateX(' + rx + 'deg) rotateZ(' + rz + 'deg)';
      var k = Math.min(work.length - 1, Math.floor(prog(t, 1950, 2850) * work.length));
      if (img.getAttribute('src') !== work[k]) img.src = work[k];
      // words: Complex squeezes, Simple stretches bold; then both fly off
      L.style.transform = 'translateX(' + (-70 * take) + 'vw) scaleX(' + lerp(1, 0.78, grow) + ')';
      R.style.transform = 'translateX(' + (70 * take) + 'vw) scaleX(' + lerp(1, 1.3, grow) + ')';
      R.style.fontWeight = grow > 0.5 ? 700 : 500;
      // takeover: a fixed full-bleed copy grows from the card to the whole screen on a diagonal
      var full = $('#icf');
      if (take > 0) {
        if (!full) { full = document.createElement('img'); full.id = 'icf'; full.className = 'intro__take'; full.alt = ''; stage.appendChild(full); }
        if (full.getAttribute('src') !== img.getAttribute('src')) full.src = img.getAttribute('src');
        var r = C.getBoundingClientRect(), vw = innerWidth, vh = innerHeight;
        var x = lerp(r.left, 0, take), y = lerp(r.top, 0, take), ww = lerp(r.width, vw, take), hh = lerp(r.height, vh, take);
        var diag = Math.sin(take * Math.PI) * -10;
        full.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + ww + 'px;height:' + hh + 'px;border-radius:' + lerp(14, 0, take) + 'px;transform:rotate(' + diag + 'deg) scale(' + (1 + Math.sin(take * Math.PI) * 0.25) + ')';
        C.style.opacity = 0;
      }
      return;
    }

    // 3 · Big words over full-bleed work — hard cuts, slow push on each photo
    var cuts = [[3500, 'bmp-tile.jpg', 'Fintech.'], [4000, 'ren-tile.jpg', 'AI.'], [4500, 'dox-tile.jpg', 'SaaS.']];
    if (t < 5000) {
      var c = cuts[t < 4000 ? 0 : t < 4500 ? 1 : 2];
      build('cut' + c[2], ink, '#fff', '<img class="intro__bleed" id="ib" src="' + c[1] + '" alt=""><div class="intro__corner"><span class="intro__big" id="iwrd">' + c[2] + '</span></div>');
      var lp = prog(t, c[0], c[0] + 500);
      $('#ib').style.transform = 'scale(' + lerp(1.12, 1, out(lp)) + ')';
      $('#iwrd').style.transform = 'translateY(' + lerp(40, 0, out(prog(t, c[0], c[0] + 260))) + '%)';
      return;
    }

    // 4 · "trusted" stretches wide while the work flies out around it in 3D, then warps wild
    //     and collapses into the signature
    if (t < 6400) {
      if (build('trust', paper, ink,
        '<div class="intro__scene intro__3d">' + work.map(function (s, i) { return '<img class="intro__fly" data-i="' + i + '" src="' + s + '" alt="">'; }).join('') +
        '<div class="intro__morph" id="im">' + 'trusted'.split('').map(function (ch) { return '<span>' + ch + '</span>'; }).join('') + '</div></div>')) { /* first frame */ }
      var fp = prog(t, 5000, 6100);
      stage.querySelectorAll('.intro__fly').forEach(function (f, i) {
        var a = (i / work.length) * Math.PI * 2 + 0.5, p = io(clamp(fp * 1.15 - i * 0.04));
        var rad = lerp(4, 62, p), z = lerp(0.25, 2.6, p);
        f.style.transform = 'translate(-50%,-50%) translate(' + Math.cos(a) * rad + 'vw,' + Math.sin(a) * rad * 0.7 + 'vh) rotate(' + lerp(0, (i % 2 ? 1 : -1) * 28, p) + 'deg) rotateY(' + lerp(0, (i % 2 ? -40 : 40), p) + 'deg) scale(' + z + ')';
        f.style.opacity = p < 0.85 ? 1 : lerp(1, 0, (p - 0.85) / 0.15);
      });
      var spans = stage.querySelectorAll('#im span'), mp = prog(t, 5000, 6400);
      var K = [
        { x: 0, y: 0, sx: 1, sy: 1, r: 0, sk: 0, o: 1 },
        { x: 0, y: 0, sx: 1.5, sy: 1, r: 0, sk: 0, o: 1 },           // stretch wide (variable-width feel)
        { x: 0, y: 4, sx: 1.25, sy: 2.4, r: 6, sk: 0, o: 1 },         // tall
        { x: 22, y: 60, sx: 2.6, sy: 1.1, r: -18, sk: -12, o: 1 },    // wild warp
        { x: -100, y: 0, sx: 0.05, sy: 0.05, r: 0, sk: 0, o: 0 }      // collapse to centre
      ], stops = [0, 0.3, 0.55, 0.78, 1];
      spans.forEach(function (s, i) {
        var kk = i - (spans.length - 1) / 2, seg = 0;
        while (seg < 3 && mp > stops[seg + 1]) seg++;
        var lt = io((mp - stops[seg]) / (stops[seg + 1] - stops[seg])), A = K[seg], B = K[seg + 1];
        var X = seg === 0 ? lerp(0, kk * 34, lt) : lerp(A.x * kk + (seg === 1 ? kk * 34 : 0), B.x * kk, lt);
        s.style.transform = 'translate(' + X + '%,' + lerp(A.y * (seg >= 2 ? Math.sin(i) : 1), B.y * Math.sin(i), lt) + '%) scale(' + lerp(A.sx, B.sx, lt) + ',' + lerp(A.sy, B.sy, lt) + ') rotate(' + lerp(A.r * kk, B.r * kk, lt) + 'deg) skewX(' + lerp(A.sk * kk, B.sk * kk, lt) + 'deg)';
        s.style.opacity = lerp(A.o, B.o, lt);
      });
      return;
    }

    // 5 · signature
    build('sign', paper, ink, '<div class="intro__scene"><img class="intro__sign" id="isg" src="signature.png" alt="Morayo Akinkunmi"></div>');
    var sp = out(prog(t, 6400, 6800)), sg = $('#isg');
    sg.style.opacity = sp; sg.style.transform = 'scale(' + lerp(0.7, 1, sp) + ')';
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
    var t = now - t0;
    render(t);
    if (t >= END) { finish(); return; }
    requestAnimationFrame(loop);
  })(performance.now());
  el.addEventListener('click', finish);
  window.addEventListener('keydown', finish, { once: true });
})();
