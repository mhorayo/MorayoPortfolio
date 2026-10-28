/* Intro — first visit of the session only.
   A · Momo (Morayo's line character) steps out of her door at double speed, walks over and waves;
       "Momo / Product Designer" types out beside her.
   B · She dissolves into a 3D cylinder of the six project images that answers to scroll; Momo peeps up from the
       bottom-right corner and the start of the story types out. Scrolling on, a click or Enter opens the site.
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
  var HELLO = 'Hi, I\u2019m Momo.';
  var STORY = 'I design fintech and AI products people trust.';
  var T = { vanish: [0, 700], orbit: [300, 1100], peep: [900, 1600], hello: 1500, story: 2200 };   // phase B, ms after the typing
  var LEAVE = 1400;                                               // px of scrolling that opens the site

  var stage = el.querySelector('.intro__stage'), done = false;
  stage.innerHTML =
    '<div class="mi" id="miA">' +
      '<video class="mi__video" src="momo-intro.mp4" muted playsinline preload="auto"></video>' +
      '<p class="mi__text"><span class="mi__l1"></span><span class="mi__l2"></span><i class="mi__caret"></i></p>' +
    '</div>' +
    '<div class="mm__orbit"><div class="mm__ring">' + WORK.map(function (s) { return '<img class="mm__card" src="' + s + '" alt="">'; }).join('') + '</div></div>' +
    '<img class="mm__girl" src="momo-char.png" alt="">' +
    '<div class="mm__text"><p class="mm__hello"></p><p class="mm__story"></p></div>' +
    '<span class="mm__hint">Scroll</span>';
  var $ = function (s) { return stage.querySelector(s); };
  var A = $('#miA'), v = $('.mi__video'), l1 = $('.mi__l1'), l2 = $('.mi__l2'), caret = $('.mi__caret');
  var orbit = $('.mm__orbit'), ring = $('.mm__ring'), girl = $('.mm__girl'), text = $('.mm__text'), hello = $('.mm__hello'), story = $('.mm__story'), hint = $('.mm__hint');
  var cards = Array.prototype.slice.call(stage.querySelectorAll('.mm__card'));

  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
  var prog = function (t, a, b) { return clamp((t - a) / (b - a)); };
  var io = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var out = function (x) { return 1 - Math.pow(1 - x, 3); };
  var lerp = function (a, b, p) { return a + (b - a) * p; };
  var typed = function (s, t0, t, ms) { return s.slice(0, Math.max(0, Math.floor((t - t0) / ms))); };

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

  // phase B — Momo dissolves away; the six images revolve (and answer to scroll); Momo peeps in and her story types out
  var spinBoost = 0, scrolled = 0, lastT = 0, angle = 0, caretB = document.createElement('i'); caretB.className = 'mm__caret';
  function render(t) {
    var va = io(prog(t, T.vanish[0], T.vanish[1]));
    A.style.opacity = 1 - va;
    A.style.filter = 'blur(' + (va * 10) + 'px)';
    A.style.transform = 'scale(' + lerp(1, 0.94, va) + ')';
    var ap = io(prog(t, T.orbit[0], T.orbit[1]));
    orbit.style.opacity = ap;
    var dt = Math.max(0, t - lastT) / 1000; lastT = t;
    angle += (14 + spinBoost) * dt; spinBoost *= Math.pow(0.04, dt);                 // slow drift + scroll momentum
    ring.style.transform = 'rotateX(-8deg) rotateY(' + angle + 'deg) scale(' + lerp(0.7, 1, ap) + ')';
    var R = innerWidth <= 760 ? innerWidth * 0.26 : Math.min(innerWidth * 0.18, 300);
    cards.forEach(function (c, i) {
      var a = i / cards.length * 360, y = [-9, 7, -3, 10, -8, 4][i], tz = [4, -6, 8, -3, 6, -8][i];
      c.style.transform = 'translate(-50%,-50%) rotateY(' + a + 'deg) translateZ(' + R + 'px) translateY(' + y + 'vh) rotateZ(' + tz + 'deg)';
    });
    var pe = out(prog(t, T.peep[0], T.peep[1]));
    girl.style.transform = 'translateY(' + lerp(60, 0, pe) + '%) rotate(' + lerp(-4, -16, pe) + 'deg)';     // rises and tilts out of the corner to peek
    girl.style.opacity = pe > 0 ? 1 : 0;
    hello.textContent = typed(HELLO, T.hello, t, 55);
    story.textContent = typed(STORY, T.story, t, 40);
    caretB.style.visibility = t >= T.hello ? 'visible' : 'hidden';
    (story.textContent ? story : hello).appendChild(caretB);
    hint.style.opacity = io(prog(t, T.story + STORY.length * 40, T.story + STORY.length * 40 + 500));
  }

  function finish() {
    if (done) return; done = true;
    try { sessionStorage.setItem('momoReel', '1'); } catch (e) {}
    // the orbit flies apart as the intro fades, uncovering the hero's scattered field of the same work
    // (on the home hero the same orbit carries on underneath at the same angle, so this one just fades)
    if (!document.querySelector('.ho__ring')) ring.style.transform = ring.style.transform.replace(/scale\([^)]*\)/, '') + ' scale(2.6)';
    el.classList.add('is-out');
    document.dispatchEvent(new CustomEvent('intro:done', { detail: { angle: angle } }));
    setTimeout(function () { el.remove(); }, 1100);
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
      render(now - bAt);
    }
    requestAnimationFrame(loop);
  })(performance.now());
  var pl = v.play(); if (pl && pl.catch) pl.catch(finish);              // autoplay blocked → straight to the site
  setTimeout(function () { if (v.currentTime <= START) finish(); }, 3000);
  // in the orbit scene, scrolling spins the work; keep going and the site opens
  var onScroll = function (dy) {
    if (bAt == null) return;
    spinBoost += dy * 0.35; scrolled += Math.abs(dy);
    if (scrolled > LEAVE) finish();
  };
  el.addEventListener('wheel', function (e) { e.preventDefault(); onScroll(e.deltaY || e.deltaX); }, { passive: false });
  var ty = null;
  el.addEventListener('touchstart', function (e) { ty = e.touches[0].clientY; }, { passive: true });
  el.addEventListener('touchmove', function (e) { if (ty == null) return; var y = e.touches[0].clientY; onScroll((ty - y) * 2); ty = y; e.preventDefault(); }, { passive: false });
  el.addEventListener('click', finish);
  window.addEventListener('keydown', function (e) { if (['Enter', ' ', 'Escape', 'ArrowDown', 'PageDown'].indexOf(e.key) > -1) finish(); });
})();
