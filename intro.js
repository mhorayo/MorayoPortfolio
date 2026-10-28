/* Intro — one continuous piece (~6.8s), first visit of the session only; click/tap/key skips.
   1 · Momo (Morayo's line drawing) peeps in from the bottom-right corner; her story types out beside her.
   2 · She flows away: her line unravels into curving ribbons that stream to where the work appears.
   3 · The six project images revolve on a 3D cylinder, as in the reference.
   One clock drives every frame (render(t)); ?reelAt=ms freezes any moment for review. */
(function () {
  var el = document.getElementById('intro');
  if (!el) return;
  var root = document.documentElement;
  if (root.classList.contains('no-intro')) { el.remove(); return; }

  var WORK = ['bmp-tile.jpg', 'ren-tile.jpg', 'dox-tile.jpg', 'wc-tile.jpg', 'own-tile.jpg', 'h2p-tile.jpg'];
  var HELLO = 'Hi, I’m Momo.', STORY = 'I design fintech and AI products people trust.';
  var T = { peep: [0, 800], hello: 900, story: 1650, flow: [3500, 4600], orbit: 4300, end: 6800 };

  var stage = el.querySelector('.intro__stage'), done = false;
  stage.innerHTML =
    '<img class="mm__girl" src="momo-char.png" alt="">' +
    '<div class="mm__text"><p class="mm__hello"></p><p class="mm__story"></p></div>' +
    '<svg class="mm__flow"></svg>' +
    '<div class="mm__orbit"><div class="mm__ring">' + WORK.map(function (s) { return '<img class="mm__card" src="' + s + '" alt="">'; }).join('') + '</div></div>';
  var $ = function (s) { return stage.querySelector(s); };
  var girl = $('.mm__girl'), text = $('.mm__text'), hello = $('.mm__hello'), story = $('.mm__story'), flow = $('.mm__flow'), orbit = $('.mm__orbit'), ring = $('.mm__ring');
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
    var vw = innerWidth, vh = innerHeight, r = girl.getBoundingClientRect();
    flow.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
    var body = [[0.42, 0.10], [0.36, 0.24], [0.40, 0.36], [0.47, 0.5], [0.44, 0.66], [0.40, 0.82]];
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

  function render(t) {
    // 1 · peep in from the bottom-right corner, leaning in
    var pe = out(prog(t, T.peep[0], T.peep[1])), fl = prog(t, T.flow[0], T.flow[1]);
    girl.style.transform = 'translateY(' + lerp(100, 0, pe) + '%) rotate(' + lerp(-14, -6, pe) + 'deg) scaleY(' + lerp(1, 1.08, io(clamp(fl * 2))) + ')';
    girl.style.opacity = 1 - io(clamp((fl - 0.05) / 0.35));
    hello.textContent = typed(HELLO, T.hello, t, 45);
    story.textContent = typed(STORY, T.story, t, 34);
    text.style.opacity = 1 - io(clamp(fl / 0.3));
    // 2 · her line unravels into ribbons that travel out to the work
    if (t >= T.flow[0] - 50 && !ribbons) makeRibbons();
    if (ribbons) ribbons.forEach(function (r, i) {
      var p = io(clamp((fl - i * 0.04) / 0.8));
      r.p.style.strokeDashoffset = r.L * (1 - p * 2);              // draws out, then the tail follows: a travelling line
      r.p.style.opacity = p > 0 && p < 1 ? 1 : 0;
    });
    // 3 · the six images revolve on a cylinder
    var ap = io(prog(t, T.orbit, T.orbit + 600));
    orbit.style.opacity = ap;
    var spin = (t - T.orbit) / 1000 * 38;                           // degrees per second
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
  if (seek != null) { if (+seek >= T.flow[0]) makeRibbons(); render(+seek); return; }
  var t0 = null;
  (function loop(now) {
    if (done) return;
    if (t0 == null) t0 = now;
    var t = now - t0; render(t);
    if (t >= T.end) { finish(); return; }
    requestAnimationFrame(loop);
  })(performance.now());
  addEventListener('resize', function () { ribbons = null; });
  el.addEventListener('click', finish);
  window.addEventListener('keydown', finish, { once: true });
})();
