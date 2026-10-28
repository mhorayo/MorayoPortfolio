/* Momo as a line: a single stroke flows up from below, Momo draws in along it, and the stroke's tail
   slips out over her head. Played backwards she melts into the line and it slides away.
   Every [data-momo] element gets one; it forms when scrolled into view and dissolves when it leaves.
   data-momo="hero" waits for the intro, then now and then dissolves and reforms on its own. */
(function () {
  var spots = Array.prototype.slice.call(document.querySelectorAll('[data-momo]'));
  if (!spots.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  // one stroke through her body lines, curling past the bow and out of the top
  var D = 'M 210 1465 C 250 1260, 140 1120, 225 920 S 268 600, 250 430 S 190 200, 255 95 S 330 -60, 290 -240';
  var uid = 0;

  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function seg(path, L, a, b) {
    path.style.strokeDasharray = Math.max(0.001, b - a) + ' ' + L * 3;
    path.style.strokeDashoffset = -a;
    path.style.opacity = b - a > 1 ? 1 : 0;
  }

  function make(el) {
    var id = 'momoMask' + (uid++);
    el.innerHTML =
      '<svg viewBox="-40 -260 626 1725" preserveAspectRatio="xMidYMax meet">' +
        '<defs><mask id="' + id + '" maskUnits="userSpaceOnUse" x="-40" y="-260" width="626" height="1725">' +
          '<path class="momo__wipe" d="' + D + '" fill="none" stroke="#fff" stroke-width="1150" /></mask></defs>' +
        '<g class="momo__body"><image href="momo-char.png" x="0" y="0" width="546" height="1465" mask="url(#' + id + ')" /></g>' +
        '<path class="momo__line" d="' + D + '" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" />' +
      '</svg>';
    var line = el.querySelector('.momo__line'), wipe = el.querySelector('.momo__wipe');
    var L = line.getTotalLength();
    var s = { el: el, p: 0, to: 0, from: 0, t0: 0, dur: 1, raf: 0 };

    s.draw = function (p) {
      s.p = p;
      seg(line, L, L * ease(clamp((p - 0.5) / 0.5)), L * ease(clamp(p / 0.6)));   // the line: head first, tail follows out the top
      seg(wipe, L, 0, L * ease(clamp((p - 0.08) / 0.6)));                         // Momo fills in just behind the head
      el.classList.toggle('is-formed', p >= 1);
    };
    s.go = function (to, dur) {
      if (s.to === to && s.raf) return;
      s.from = s.p; s.to = to; s.dur = dur * Math.abs(to - s.from) || 1; s.t0 = 0;
      cancelAnimationFrame(s.raf);
      (function tick(now) {
        if (!s.t0) s.t0 = now;
        var k = clamp((now - s.t0) / s.dur);
        s.draw(s.from + (s.to - s.from) * k);
        s.raf = k < 1 ? requestAnimationFrame(tick) : 0;
      })(performance.now());
    };
    s.draw(0);
    return s;
  }

  var all = spots.map(make);
  if (reduce) { all.forEach(function (s) { s.draw(1); }); return; }

  var heroReady = false;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var s = all[spots.indexOf(e.target)];
      s.inView = e.isIntersecting;
      if (s.el.dataset.momo === 'hero' && !heroReady) return;
      if (e.isIntersecting) s.go(1, 1800);
      else s.go(0, 900);
    });
  }, { threshold: 0.35 });
  all.forEach(function (s) { io.observe(s.el); });

  // hero: as the intro fades she flows back in as a line, peeking from under the frame
  var hero = all.filter(function (s) { return s.el.dataset.momo === 'hero'; })[0];
  if (hero) {
    var start = function () {
      heroReady = true;
      setTimeout(function () { hero.go(1, 1800); }, 500);
      // every so often she slips into the line and back again
      setInterval(function () {
        if (!hero.inView || hero.raf || document.hidden) return;
        hero.go(0, 1300);
        setTimeout(function () { if (hero.inView) hero.go(1, 1800); }, 1700);
      }, 14000);
    };
    var intro = document.getElementById('intro');
    if (intro && !document.documentElement.classList.contains('no-intro')) document.addEventListener('intro:done', start, { once: true });
    else start();
  }
})();
