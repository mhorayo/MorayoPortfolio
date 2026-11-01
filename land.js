/* Home: plain navbar; the hero builds around Momo after the intro, then on scroll she grows to the left as the story types out; the work drifts past as a tilted wall;
   the About frame flicks between Morayo and Momo like a burst shot; a sticky index for the rows below; Momo peeks over the footer. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Navbar: a hairline once you scroll; on phones a Menu button opens the links */
  var nav = document.getElementById('nav'), toggle = document.getElementById('navToggle');
  if (nav) {
    var onNav = function () { nav.classList.toggle('is-scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onNav, { passive: true }); onNav();
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open); toggle.textContent = open ? 'Close' : 'Menu';
    });
    $$('.nav__links a', nav).forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; });
    });
  }

  /* Hero + story, one pinned scene. Momo is already standing where the intro left her; the name rises behind her.
     Scrolling on, she grows and drifts to the left while the hero fades around her, and the story types out beside her. */
  var hero = document.getElementById('hero');
  if (hero) {
    var fig = document.getElementById('momoFig'), fades = $$('.hx__head, .hx__side, .hx__cue', hero);
    var story = hero.querySelector('.hx__story'), storyBeats = $$('.hx__sk, .hx__ln, .hx__slink', story);
    var built = false, S0 = 0.78, heroP = 0;
    var ease = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
    var renderHero = function () {
      if (!built) return;
      var vh = innerHeight, span = hero.offsetHeight - vh, y = clamp(window.scrollY - hero.offsetTop, 0, span);
      var p = ease(clamp(y / (vh * 0.8), 0, 1));                                   // her move
      heroP = p;
      fades.forEach(function (el) { el.style.opacity = clamp(1 - p * 1.7, 0, 1); el.style.transform = p ? 'translateY(' + (-p * 40) + 'px)' : ''; });
      if (p <= 0) { fig.classList.remove('is-moving'); fig.style.transform = ''; }
      else {
        fig.classList.add('is-moving');
        var phone = innerWidth <= 760, h = fig.offsetHeight, w = fig.offsetWidth;
        // she grows until she's framed from the bust up (her head top ~0.15 to her chest ~0.67 of the drawing fills the screen)
        var s1 = phone ? vh * 0.4 / (h * 0.52) : vh * 0.9 / (h * 0.52);
        var s = S0 + (s1 - S0) * p;
        var cx = fig.offsetLeft + w / 2, tx = phone ? innerWidth / 2 : innerWidth * 0.27;
        var cy = fig.offsetTop + 0.12 * h + s * 0.29 * h, ty = phone ? vh * 0.26 : vh * 0.52;   // the middle of that frame, scaling from 50% 12%
        fig.style.transform = 'translate(' + ((tx - cx) * p) + 'px,' + ((ty - cy) * p) + 'px) scale(' + s + ')';
      }
      // the story, in order as she arrives: the label, each line, the link last, all in by the time she has settled
      story.classList.toggle('is-on', p >= 0.3);
      storyBeats.forEach(function (el, i) { el.classList.toggle('is-in', p >= 0.35 + i * (0.6 / (storyBeats.length - 1)) - 0.001); });
    };
    /* Momo, alive, drawn live on one canvas from three parts cut out of her one drawing: the body, the arm and the two empty
       eye circles. Her arm bends like a noodle to wave (each row turns round the elbow 534,745: not at all at the elbow, fully at
       the fingertips, so the line never breaks). Her eyes look towards the cursor and blink now and then. When the cursor goes to
       her left she turns towards it like a person, a quarter turn to face front-left with her arms dropping (30 frames from a turn
       clip, momo/turn), and always finishes the turn rather than freezing half-way. She turns back as it returns, and faces right
       again as the page scrolls on. Hovering on her drawing itself (tap on a phone) makes her wave. */
    var hm = document.getElementById('hm'), cv = document.getElementById('hmCv');
    if (hm && cv) {
      var W = 720, H = 1280, ELB = { x: 534, y: 745, top: 470 }, EYES = [[362, 300], [421, 288]], EYE_SPLIT = 392;
      var ctx = cv.getContext('2d', { willReadFrequently: true });
      var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var P = {}, left = 3;
      ['base', 'arm', 'eyes'].forEach(function (k) {
        var im = new Image();
        im.onload = function () { P[k] = im; if (!--left) { hm.classList.add('is-ready'); requestAnimationFrame(frame); if (!still) setTimeout(loadTurn, 400); } };
        im.src = 'momo/' + k + '.png';
      });
      var st = { gx: 0, gy: 0, turn: 0, arm: 0, blink: 1 }, goal = { gx: 0, gy: 0, turn: 0 }, lastKey = '';
      var TURN = [], TN = 30, turnLeft = TN;
      var loadTurn = function () {   // after she's on screen, so the page itself isn't held up
        for (var i = 0; i < TN; i++) { var im = new Image(); im.onload = function () { turnLeft--; }; im.src = 'momo/turn/t' + (i < 10 ? '0' : '') + i + '.png'; TURN.push(im); }
      };
      var frameNo = function () { return turnLeft ? 0 : Math.round(st.turn * (TN - 1)); };
      var draw = function () {
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
        var f = frameNo();
        if (f) { ctx.drawImage(TURN[f], 0, 0, W, H); return; }   // turning: a frame of the turn
        ctx.drawImage(P.base, 0, 0);
        EYES.forEach(function (e, i) {   // each eye on its own, so it can squash shut round its own centre
          ctx.save(); ctx.beginPath();
          if (i) ctx.rect(EYE_SPLIT, 0, W - EYE_SPLIT, ELB.top); else ctx.rect(0, 0, EYE_SPLIT, ELB.top);
          ctx.clip(); ctx.translate(e[0] + st.gx, e[1] + st.gy); ctx.scale(1, st.blink); ctx.translate(-e[0], -e[1]);
          ctx.drawImage(P.eyes, 0, 0); ctx.restore();
        });
        ctx.drawImage(P.arm, 0, ELB.y, W, H - ELB.y, 0, ELB.y, W, H - ELB.y);
        for (var y = ELB.top; y < ELB.y; y++) {
          var a = st.arm * Math.PI / 180 * Math.pow((ELB.y - y) / (ELB.y - ELB.top), 1.25), c = Math.cos(a), sn = Math.sin(a);
          ctx.setTransform(c, sn, -sn, c, ELB.x - c * ELB.x + sn * ELB.y, ELB.y - sn * ELB.x - c * ELB.y);
          ctx.drawImage(P.arm, 0, y, W, 2, 0, y, W, 2);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      };
      // is this point on her drawing itself, not the empty space round her?
      var onHer = function (cx, cy) {
        var r = cv.getBoundingClientRect(); if (!r.width || !P.base) return false;
        var x = Math.round((cx - r.left) / r.width * W), y = Math.round((cy - r.top) / r.height * H);
        return x >= 0 && y >= 0 && x < W && y < H && ctx.getImageData(x, y, 1, 1).data[3] > 40;
      };
      // the wave: a small dip first, three easing swings, then she settles; her body leans a touch into it. Locked until done.
      var wKeys = [[0, 0], [0.10, 4], [0.26, -15], [0.42, 11], [0.58, -14], [0.74, 7], [0.88, -3], [1, 0]], waveT0 = -1;
      var angleAt = function (p) {
        for (var i = 1; i < wKeys.length; i++) if (p <= wKeys[i][0]) {
          var k = (p - wKeys[i - 1][0]) / (wKeys[i][0] - wKeys[i - 1][0]);
          return wKeys[i - 1][1] + (wKeys[i][1] - wKeys[i - 1][1]) * (1 - Math.cos(Math.PI * k)) / 2;
        }
        return 0;
      };
      var wave = function () {
        if (waveT0 >= 0 || still || !P.arm || frameNo()) return;   // she waves facing you, not mid-turn
        waveT0 = performance.now();
        var lean = document.getElementById('hmLean');
        if (lean.animate) lean.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-0.8deg)', offset: 0.3 }, { transform: 'rotate(-0.6deg)', offset: 0.7 }, { transform: 'rotate(0deg)' }], { duration: 1900, easing: 'ease-in-out' });
      };
      var over = false;
      window.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse' || still) return;
        var r = cv.getBoundingClientRect(), fx = r.left + r.width * 0.5, fy = r.top + r.height * 0.23;
        var nx = clamp((e.clientX - fx) / (innerWidth * 0.4), -1, 1), ny = clamp((e.clientY - fy) / (innerHeight * 0.4), -1, 1);
        goal.gx = nx * 4; goal.gy = ny * 3;                       // her eyes go first
        if (nx < -0.2) goal.turn = 1; else if (nx > -0.05) goal.turn = 0;   // cursor on her left: she turns to it; back in front or right: she turns back
        var now = onHer(e.clientX, e.clientY);
        if (now && !over) wave();
        over = now; fig.style.cursor = now ? 'pointer' : '';
      }, { passive: true });
      fig.addEventListener('click', function (e) { if (onHer(e.clientX, e.clientY)) wave(); });
      // a blink every 3–6 s, now and then a double one
      var blinkT0 = -1, blinks = 1;
      var queueBlink = function () { setTimeout(function () { if (!document.hidden) { blinkT0 = performance.now(); blinks = Math.random() < 0.2 ? 2 : 1; } queueBlink(); }, 3000 + Math.random() * 3000); };
      if (!still) queueBlink();
      var frame = function (now) {
        var on = heroP > 0 ? 0 : 1;   // once the page scrolls on, she faces right, towards the story
        st.gx += (goal.gx * on - st.gx) * 0.14; st.gy += (goal.gy * on - st.gy) * 0.14;   // eyes lead
        var tt = goal.turn * on, d = tt - st.turn;                                            // then she turns, all the way, never stopping
        st.turn = Math.abs(d) < 0.03 ? tt : st.turn + 0.03 * (d > 0 ? 1 : -1) * (0.45 + Math.sin(Math.PI * st.turn));   //   half-way; eased in and out
        var pr = clamp((heroP - 0.55) / 0.45, 0, 1); pr = pr * pr * (3 - 2 * pr);   // as she settles on the left, her arm reaches out
        st.arm = 32 * pr;                                                              // towards the story, presenting it
        if (waveT0 >= 0) { var p = Math.min(1, (now - waveT0) / 1900); st.arm += angleAt(p); if (p >= 1) waveT0 = -1; }
        if (blinkT0 >= 0) { var q = (now - blinkT0) / (150 * blinks); if (q >= 1) { blinkT0 = -1; st.blink = 1; } else st.blink = 1 - 0.92 * Math.sin(Math.PI * ((q * blinks) % 1)); }
        var key = [st.gx, st.gy, frameNo(), st.arm, st.blink].map(function (v) { return v.toFixed(2); }).join();
        if (key !== lastKey) { draw(); lastKey = key; }   // draw only when she has moved
        requestAnimationFrame(frame);
      };
    }
    window.addEventListener('scroll', renderHero, { passive: true });
    window.addEventListener('resize', renderHero);
    var build = function () { hero.classList.add('is-built'); built = true; renderHero(); };
    if (document.getElementById('intro') && !document.documentElement.classList.contains('no-intro')) {
      document.addEventListener('intro:done', function (e) { setTimeout(build, e.detail && e.detail.seamless ? 60 : 450); }, { once: true });
    } else setTimeout(build, 60);
  }

  /* Work: the cards line the inside of a curved wall, like standing in front of a cylinder. The middle of the wall is farthest
     away, so the card in the middle is smallest; towards the edges the wall curves forward, so cards grow, come closer and
     turn in towards the centre. Scrolling slides them right to left along the curve, scattered high and low, each with its own
     tilt. The motion eases after the scroll. The project nearest the middle is named. */
  var gw = document.getElementById('work'), wall = document.getElementById('gwWall');
  if (gw && wall) {
    var gpin = gw.querySelector('.gw__pin'), gcards = $$('.gw__card', wall), infos = $$('.gw__p', gw);
    var curP = -1, len = 0, R = 1, gP = 0, gT = 0, gRaf = 0;
    var layout = function () {
      var x = 0, gap = innerWidth * 0.025;
      R = innerWidth * 0.9;
      gpin.style.perspective = Math.round(innerWidth * 0.7) + 'px';
      gcards.forEach(function (c) {
        c._w = c.offsetWidth; c._h = c.offsetHeight; c._x = x; x += c._w + gap;
        c.style.marginLeft = -c._w / 2 + 'px'; c.style.marginTop = -c._h / 2 + 'px';
        c._y = parseFloat(c.style.getPropertyValue('--y')) * innerHeight / 100;
        c._z = parseFloat(c.style.getPropertyValue('--z'));
      });
      len = x - gap;
    };
    var drawGw = function () {
      var vw = innerWidth, off = vw * 0.55 - gP * (len - vw * 0.1), best = 1e9, bestP = 0;
      gcards.forEach(function (c) {
        var s = off + c._x + c._w / 2 - vw / 2, t = s / R;
        if (Math.abs(t) > 1.05) { c.style.visibility = 'hidden'; return; }
        c.style.visibility = '';
        c.style.transform = 'translate3d(' + R * Math.sin(t) + 'px,' + c._y + 'px,' + R * (1 - Math.cos(t)) + 'px) rotateY(' + (-t * 180 / Math.PI) + 'deg) rotateZ(' + c._z + 'deg)';
        if (Math.abs(s) < best) { best = Math.abs(s); bestP = +c.getAttribute('data-p'); }
      });
      if (bestP !== curP) { curP = bestP; infos.forEach(function (el, i) { el.classList.toggle('is-on', i === curP); }); }
    };
    var tickGw = function () {
      gP += (gT - gP) * 0.09;
      if (Math.abs(gT - gP) < 0.0002) gP = gT;
      drawGw();
      gRaf = gP !== gT ? requestAnimationFrame(tickGw) : 0;
    };
    var renderGw = function () {
      gT = clamp((window.scrollY - gw.offsetTop) / (gw.offsetHeight - innerHeight), 0, 1);
      if (reduce) { gP = gT; drawGw(); } else if (!gRaf) gRaf = requestAnimationFrame(tickGw);
    };
    wall.addEventListener('mouseover', function (e) { wall.classList.toggle('is-hover', !!e.target.closest('.gw__card')); });
    wall.addEventListener('mouseleave', function () { wall.classList.remove('is-hover'); });
    window.addEventListener('scroll', renderGw, { passive: true });
    window.addEventListener('resize', function () { layout(); drawGw(); });
    window.addEventListener('load', function () { layout(); drawGw(); });
    layout(); renderGw(); gP = gT; drawGw();
  }

  /* About: a burst shot — a quick run of frames flicking between Morayo and Momo, landing on the other one */
  var burst = document.getElementById('burst');
  if (burst) {
    var shots = $$('.ab__f', burst), count = burst.querySelector('.ab__count'), label = burst.querySelector('.ab__label');
    var names = ['Morayo', 'Momo'], on = 0, busy = false, seen = false;
    var show = function (i) {
      on = i; shots.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
      count.textContent = '0' + (i + 1); label.textContent = names[i];
    };
    var fire = function () {
      if (busy) return; busy = true;
      if (reduce) { show(1 - on); busy = false; return; }
      var flips = 7, k = 0;                                   // odd number of flips → lands on the other frame
      (function flick() {
        show(1 - on); burst.classList.add('is-snap');
        setTimeout(function () { burst.classList.remove('is-snap'); }, 40);
        if (++k < flips) setTimeout(flick, 70 + k * 12); else busy = false;
      })();
    };
    burst.addEventListener('click', fire);
    if ('IntersectionObserver' in window) {
      var timer = null;
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          clearInterval(timer);
          if (!e.isIntersecting) return;
          if (!seen) { seen = true; setTimeout(fire, 500); }
          if (!reduce) timer = setInterval(fire, 3600);
        });
      }, { threshold: 0.4 }).observe(burst);
    }
  }

  /* More: rows ease in; the sticky index follows the row in view */
  var rows = $$('.mo__row'), idx = $$('.mo__idx a'), moIo;
  if (rows.length && 'IntersectionObserver' in window) {
    moIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        idx.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-40% 0px -40% 0px' });
    rows.forEach(function (r) { moIo.observe(r); });
  } else rows.forEach(function (r) { r.classList.add('is-in'); });

  /* Footer: Momo peeps up from the line under the email, ducks back down, then pops up pointing at it — on a loop while it's in view */
  var peek = document.getElementById('peek');
  if (peek) {
    var beats = [['is-peek', 2300], ['', 900], ['is-point', 2500], ['', 1000]], bi = 0, bt = null;
    var play = function () {
      peek.className = 'fx__peek' + (beats[bi][0] ? ' ' + beats[bi][0] : '');
      bt = setTimeout(function () { bi = (bi + 1) % beats.length; play(); }, beats[bi][1]);
    };
    if (reduce) peek.classList.add('is-peek');
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        clearTimeout(bt);
        if (es[0].isIntersecting) { bi = 0; bt = setTimeout(play, 400); } else peek.className = 'fx__peek';
      }, { threshold: 0.3 }).observe(peek.parentNode);
    } else peek.classList.add('is-peek');
  }

  /* Chapter rail: the marker runs down the ticks with the page; the current chapter is named */
  var chap = document.getElementById('chap');
  if (chap) {
    var links = $$('a', chap), fill = chap.querySelector('.chap__fill');
    var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var renderChap = function () {
      var max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      fill.style.transform = 'translateY(' + (p * (chap.offsetHeight - 1)) + 'px)';
      var at = 0, line = window.scrollY + innerHeight * 0.45;
      secs.forEach(function (s, i) { if (s && s.offsetTop <= line) at = i; });
      if (p > 0.995) at = secs.length - 1;
      links.forEach(function (a, i) { a.classList.toggle('is-on', i === at); });
      chap.classList.toggle('is-end', secs[secs.length - 1].getBoundingClientRect().top < innerHeight * 0.6);   // out of the footer's way
    };
    window.addEventListener('scroll', renderChap, { passive: true });
    window.addEventListener('resize', renderChap);
    renderChap();
  }
})();
