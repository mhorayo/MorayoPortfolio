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

  /* Work: one project at a time. As the section pins, a reel of pictures runs up through the card's frame and stops on the
     first project; its name then fades in, grey to ink, huge along the bottom behind the card. Each project holds still for a
     while; then its card grows, tilts and flies off to one side (alternating left and right) to show the next card waiting
     underneath, peeking out on the other side, while the strip of names glides on to the next. After the last card leaves,
     the six cards come back small, scattered like a constellation. Eased after the scroll. */
  var pw = document.getElementById('work'), pstack = document.getElementById('pwStack');
  if (pw && pstack) {
    var pcards = $$('.pw__card', pstack), pnames = $$('.pw__name', pw), pinfos = $$('.pw__p', pw);
    var ptrack = pw.querySelector('.pw__names'), pinfo = pw.querySelector('.pw__info');
    var pveil = pw.querySelector('.pw__veil'), phead = pw.querySelector('.pw__head');
    var preel = pw.querySelector('.pw__reel'), pframes = $$('img', preel);
    var pN = pcards.length, curW = -2, wP = 0, wT = 0, wRaf = 0, noff = [], nend = 0;
    var E1 = 0.09, E2 = 0.12, X = 0.86, C = 0.9, SEG = (X - E2) / pN, HOLD = 0.5;
    var spots = [[-0.24, -0.2, -4], [0.2, -0.26, 3], [-0.07, 0.04, -2], [0.27, 0.1, 5], [-0.3, 0.16, 2], [0.06, -0.16, -3]];
    var sm = function (x) { return x * x * (3 - 2 * x); };
    var outc = function (x) { return 1 - Math.pow(1 - x, 3); };
    var mix = function (a, b, t) { return a + (b - a) * t; };
    var measure = function () { noff = pnames.map(function (n) { return n.offsetLeft; }); nend = ptrack.scrollWidth + innerWidth * 0.1; };
    var pshow = function (c, on) {
      if (c._on === on) return;
      c._on = on; c.style.visibility = on ? 'visible' : 'hidden';
      var v = c.querySelector('video');
      if (v) { if (on && !reduce) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause(); }
    };
    var pplace = function (c, x, y, s, rz, z) {
      c.style.zIndex = z;
      c.style.transform = 'translate(-50%,-50%) translate(' + x + 'px,' + y + 'px) rotate(' + rz + 'deg) scale(' + s + ')';
    };
    var drawPw = function () {
      var vh = innerHeight, vw = innerWidth, H = preel.offsetHeight;
      if (!noff.length) measure();
      // the opening: frames rise from below one after another; each stops in the card's place, over the one before; the
      // last to land is the first project
      var e1 = clamp(wP / E1, 0, 1), landed = e1 >= 1, gap = H * 0.55, nf = pframes.length;
      preel.style.visibility = landed ? 'hidden' : 'visible';
      pveil.style.opacity = clamp(e1 * 3, 0, 1); phead.style.opacity = clamp(e1 * 2 - 1, 0, 1);
      if (!landed) {
        var base = mix(vh * 0.75, -(nf - 1) * gap, outc(e1));
        pframes.forEach(function (f, k) { f.style.transform = 'translateY(' + Math.max(0, base + k * gap) + 'px)'; });
      }
      // which project, and how far through its hand-off to the next
      var q = clamp((wP - E2) / SEG, 0, pN - 0.0001), i = Math.floor(q), t = sm(clamp(((q - i) - HOLD) / (1 - HOLD), 0, 1));
      if (wP >= X) { i = pN - 1; t = 1; }
      var cst = outc(clamp((wP - C) / (1 - C), 0, 1)), dir = i % 2 ? 1 : -1;
      pcards.forEach(function (c, k) {
        if (cst > 0) {                                     // the cluster: gathers small in the middle, then flies out past you
          var sp = spots[k % spots.length], a = clamp(cst * 3 - k * 0.12, 0, 1), z = mix(0.12, 2.6, Math.pow(cst, 1.6));
          pshow(c, a > 0 && cst < 0.995); pplace(c, sp[0] * vw * z, sp[1] * vh * z, mix(0.05, 0.7, Math.pow(cst, 1.4)), sp[2], k); c.style.opacity = a; return;
        }
        c.style.opacity = '';
        if (!landed) { pshow(c, false); return; }
        if (k === i) { pshow(c, t < 1); pplace(c, dir * t * vw * 0.62, -t * vh * 0.04, 1 + 0.22 * t, dir * t * 9, 3); }
        else if (k === i + 1 && t > 0) { pshow(c, true); pplace(c, -dir * (1 - t) * vw * 0.05, 0, 0.97 + 0.03 * t, -dir * (1 - t) * 3, 2); }
        else pshow(c, false);
      });
      // the name strip: holds on the name in focus, then glides on to the next (and off, after the last)
      var pad = parseFloat(getComputedStyle(pw.querySelector('.pw__head')).left) || 24;
      var from = noff[i], to = i < pN - 1 ? noff[i + 1] : nend;
      ptrack.style.transform = 'translateX(' + (pad - mix(from, to, t)) + 'px)';
      var nIn = clamp((wP - E1) / (E2 - E1), 0, 1);
      pnames.forEach(function (n, k) {
        var o = k <= i ? 1 : k === i + 1 ? mix(0.08, 1, t) : 0.08;
        n.style.opacity = o * nIn;
      });
      var top = Math.min(pN - 1, Math.round(i + t));
      pinfo.style.opacity = nIn * (wP >= X - SEG * 0.25 ? 0 : 1);
      if (top !== curW) { curW = top; pinfos.forEach(function (el, k) { el.classList.toggle('is-on', k === top); }); }
    };
    var tickPw = function () {
      wP += (wT - wP) * 0.12;
      if (Math.abs(wT - wP) < 0.0002) wP = wT;
      drawPw();
      wRaf = wP !== wT ? requestAnimationFrame(tickPw) : 0;
    };
    var renderPw = function () {
      wT = clamp((window.scrollY - pw.offsetTop) / (pw.offsetHeight - innerHeight), 0, 1);
      if (reduce) { wP = wT; drawPw(); } else if (!wRaf) wRaf = requestAnimationFrame(tickPw);
    };
    window.addEventListener('scroll', renderPw, { passive: true });
    window.addEventListener('resize', function () { measure(); drawPw(); });
    window.addEventListener('load', function () { measure(); drawPw(); });
    renderPw(); wP = wT; drawPw();
  }

  /* My story: twelve small pictures of the six projects on a ring (an oval, wider than tall) that grows in from the middle
     and turns slowly as you scroll, each card on its own tilt; one short paragraph in the middle changes beat by beat. Near
     the end the ring flies apart off the screen and the last line stays. */
  var po = document.getElementById('story-ring');
  if (po) {
    var pits = $$('.po__it', po), pbeats = $$('.po__b', po), oP = 0, oT = 0, oRaf = 0, curB = -1;
    var oout = function (x) { return 1 - Math.pow(1 - x, 3); };
    var drawPo = function () {
      var vw = innerWidth, vh = innerHeight, n = pits.length;
      var grow = oout(clamp(oP / 0.14, 0, 1)), fly = Math.pow(clamp((oP - 0.72) / 0.16, 0, 1), 1.5);
      var rx = Math.min(vw * 0.36, vh * 0.62) * (grow + fly * 1.6), ry = vh * 0.42 * (grow + fly * 1.6), turn = oP * 4.2;
      pits.forEach(function (it, k) {
        var on = grow > 0 && fly < 1;
        if (it._on !== on) {
          it._on = on; it.style.visibility = on ? 'visible' : 'hidden';
          var v = it.querySelector('video');
          if (v) { if (on && !reduce) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause(); }
        }
        if (!on) return;
        var ang = k / n * Math.PI * 2 + turn;
        it.style.transform = 'translate(' + Math.cos(ang) * rx + 'px,' + Math.sin(ang) * ry + 'px) rotate(calc(' + it.style.getPropertyValue('--t') + ' + ' + turn * 20 + 'deg)) scale(' + (0.3 + 0.7 * grow + fly * 0.8) + ')';
        it.style.opacity = 1 - fly;
      });
      var b = oP < 0.1 ? -1 : oP >= 0.72 ? pbeats.length - 1 : Math.min(pbeats.length - 2, Math.floor((oP - 0.1) / 0.62 * (pbeats.length - 1)));
      if (b !== curB) { curB = b; pbeats.forEach(function (el, k) { el.classList.toggle('is-on', k === b); }); }
    };
    var tickPo = function () {
      oP += (oT - oP) * 0.1;
      if (Math.abs(oT - oP) < 0.0002) oP = oT;
      drawPo();
      oRaf = oP !== oT ? requestAnimationFrame(tickPo) : 0;
    };
    var renderPo = function () {
      oT = clamp((window.scrollY - po.offsetTop) / (po.offsetHeight - innerHeight), 0, 1);
      if (reduce) { oP = oT; drawPo(); } else if (!oRaf) oRaf = requestAnimationFrame(tickPo);
    };
    window.addEventListener('scroll', renderPo, { passive: true });
    window.addEventListener('resize', drawPo);
    renderPo(); oP = oT; drawPo();
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
