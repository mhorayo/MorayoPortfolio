/* Intro reel — first visit of the session only; click, tap or any key skips it. */
(function () {
  var el = document.getElementById('intro');
  if (!el) return;
  var root = document.documentElement;
  if (root.classList.contains('no-intro')) { el.remove(); return; }
  var stage = el.querySelector('.intro__stage'), timers = [], done = false;
  var paper = '#F8F6F2', ink = '#111111', olive = '#7A7866', clay = '#B98C72';
  // ?reelAt=ms freezes the reel at that moment (for previews/QA only)
  var seek = (location.search.match(/[?&]reelAt=(\d+)/) || [])[1];
  seek = seek == null ? null : +seek;
  if (seek != null) el.classList.add('is-seek');
  var queue = [];
  var at = function (ms, fn) {
    if (seek == null) { timers.push(setTimeout(fn, ms)); return; }
    if (ms <= seek) queue.push([ms, fn]);
  };
  var nowMs = function () { return seek; };
  var scene = function (bg, fg, html) {
    el.style.background = bg; el.style.color = fg;
    stage.innerHTML = '<div class="intro__scene">' + html + '</div>';
    return stage.firstChild;
  };
  var word = function (t) { return '<span class="intro__word">' + t + '</span>'; };

  var finish = function () {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem('momoReel', '1'); } catch (e) {}
    el.classList.add('is-out');
    document.dispatchEvent(new Event('intro:done'));
    setTimeout(function () { el.remove(); }, 800);
  };

  // 1. Hi, / I'm / Momo — hard cuts on black
  scene(ink, paper, word('Hi,'));
  at(380, function () { scene(ink, paper, word('I&rsquo;m')); });
  at(760, function () { scene(paper, ink, word('Momo')); });

  // 2. Complex [image] Simple — the gap opens and flicks through the work, then fills the screen
  var shots = ['bmp-tile.jpg', 'dox-tile.jpg', 'ren-tile.jpg', 'wc-tile.jpg'];
  at(1350, function () { scene(paper, ink, '<div class="intro__line"><span>Complex</span><span class="intro__gap"><img src="' + shots[0] + '" alt=""></span><span>Simple</span></div>'); });
  at(1700, function () { var g = stage.querySelector('.intro__gap'); if (g) g.style.width = '2.3em'; });
  [2150, 2450, 2750].forEach(function (t, i) {
    at(t, function () { var im = stage.querySelector('.intro__gap img'); if (im) im.src = shots[i + 1]; });
  });
  at(3050, function () {
    var g = stage.querySelector('.intro__gap'); if (!g) return;
    var r = g.getBoundingClientRect(), full = document.createElement('img');
    full.src = g.querySelector('img').src; full.className = 'intro__full';
    full.style.cssText = 'inset:auto;position:absolute;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;transition:all 0.55s cubic-bezier(0.76,0,0.24,1)';
    el.appendChild(full);
    var grow = function () { full.style.left = '0'; full.style.top = '0'; full.style.width = '100%'; full.style.height = '100%'; };
    if (seek != null) { full.style.transition = 'none'; if (seek >= 3600) grow(); } else requestAnimationFrame(function () { requestAnimationFrame(grow); });
    if (seek == null) setTimeout(function () { full.remove(); }, 600);
    else if (seek >= 3650) full.remove();
  });

  // 3. Big words over full-bleed work
  [[3600, 'bmp-tile.jpg', 'Fintech.'], [4100, 'ren-tile.jpg', 'AI.'], [4600, 'dox-tile.jpg', 'SaaS.']].forEach(function (s) {
    at(s[0], function () { scene(ink, '#fff', '<img class="intro__full" src="' + s[1] + '" alt=""><span class="intro__word intro__over">' + s[2] + '</span>'); });
  });

  // 4. "trusted" warps wild, then collapses into the signature
  at(5150, function () {
    var letters = 'trusted'.split('').map(function (c) { return '<span>' + c + '</span>'; }).join('');
    var sc = scene(clay, ink, '<div class="intro__morph">' + letters + '</div>');
    var spans = Array.prototype.slice.call(sc.querySelectorAll('.intro__morph span'));
    // keyframes per letter: calm → tall stretch → wide twisted warp → collapse to the centre
    var ease = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var t0 = performance.now(), D = 1300, frozen = seek != null ? Math.max(0, Math.min(1, (seek - 5150) / D)) : null;
    var step = function (now) {
      if (done) return;
      var p = frozen != null ? frozen : Math.min(1, (now - t0) / D);
      spans.forEach(function (s, i) {
        var k = i - (spans.length - 1) / 2;
        var K = [
          { x: 0, y: 0, sx: 1, sy: 1, r: 0, sk: 0, o: 1 },
          { x: 0, y: k * 4, sx: 1.25, sy: 2.4, r: k * 6, sk: 0, o: 1 },
          { x: k * 22, y: Math.sin(i) * 60, sx: 2.6, sy: 1.1, r: k * -18, sk: k * -12, o: 1 },
          { x: -k * 100, y: 0, sx: 0.05, sy: 0.05, r: 0, sk: 0, o: 0 }
        ];
        var stops = [0, 0.35, 0.7, 1], seg = 0;
        while (seg < 2 && p > stops[seg + 1]) seg++;
        var lt = ease((p - stops[seg]) / (stops[seg + 1] - stops[seg])), A = K[seg], B = K[seg + 1];
        s.style.transform = 'translate(' + lerp(A.x, B.x, lt) + '%,' + lerp(A.y, B.y, lt) + '%) scale(' + lerp(A.sx, B.sx, lt) + ',' + lerp(A.sy, B.sy, lt) + ') rotate(' + lerp(A.r, B.r, lt) + 'deg) skewX(' + lerp(A.sk, B.sk, lt) + 'deg)';
        s.style.opacity = lerp(A.o, B.o, lt);
      });
      if (frozen == null && p < 1) requestAnimationFrame(step);
    };
    if (frozen != null) step(0); else requestAnimationFrame(step);
  });
  at(6350, function () {
    var sc = scene(paper, ink, '<img class="intro__sign" src="signature.png" alt="Morayo Akinkunmi">');
    requestAnimationFrame(function () { sc.querySelector('.intro__sign').classList.add('is-on'); });
  });
  at(7200, finish);

  if (seek != null) { queue.sort(function (a, b) { return a[0] - b[0]; }).forEach(function (q) { if (q[1] !== finish) q[1](); }); return; }
  el.addEventListener('click', finish);
  window.addEventListener('keydown', finish, { once: true });
})();
