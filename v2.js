/* Portfolio v2 — shared behaviour for the homepage and case studies. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  /* ---------- Local time (GMT+1) ---------- */
  var hh = document.getElementById('hh'), mm = document.getElementById('mm');
  function tick() {
    if (!hh) return;
    var t = new Date(Date.now() + (new Date().getTimezoneOffset() + 60) * 60000);
    hh.textContent = String(t.getHours()).padStart(2, '0');
    mm.textContent = String(t.getMinutes()).padStart(2, '0');
  }
  tick(); setInterval(tick, 15000);

  /* ---------- Navbar background on scroll ---------- */
  var bar = document.querySelector('.bar');
  if (bar) {
    var setBar = function () { bar.classList.toggle('is-scrolled', window.scrollY > 8); };
    setBar(); window.addEventListener('scroll', setBar, { passive: true });
  }

  /* ---------- Menu ---------- */
  var menu = document.getElementById('menu'), menuBtn = document.getElementById('menuBtn');
  function openMenu() { if (!menu) return; menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('is-open'); }); menuBtn.setAttribute('aria-expanded', 'true'); document.getElementById('menuClose').focus(); }
  function closeMenu() { menu.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); setTimeout(function () { menu.hidden = true; }, 500); menuBtn.focus(); }
  if (menu) {
    menuBtn.addEventListener('click', openMenu);
    var markBtn = document.getElementById('markBtn'); if (markBtn) markBtn.addEventListener('click', openMenu);
    document.getElementById('menuClose').addEventListener('click', closeMenu);
    menu.addEventListener('click', function (e) { if (e.target === menu && !menuDragged) closeMenu(); });
    // Scroll the cards sideways with the mouse wheel, trackpad or a drag
    menu.addEventListener('wheel', function (e) {
      var d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!d) return; e.preventDefault(); menu.scrollLeft += d;
    }, { passive: false });
    var menuDown = false, menuDragged = false, mStartX = 0, mStartL = 0;
    menu.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; menuDown = true; menuDragged = false; mStartX = e.clientX; mStartL = menu.scrollLeft; });
    window.addEventListener('pointermove', function (e) { if (!menuDown) return; var dx = e.clientX - mStartX; if (Math.abs(dx) > 5) { menuDragged = true; menu.classList.add('is-dragging'); } menu.scrollLeft = mStartL - dx; });
    window.addEventListener('pointerup', function () { if (!menuDown) return; menuDown = false; setTimeout(function () { menuDragged = false; menu.classList.remove('is-dragging'); }, 0); });
    menu.addEventListener('click', function (e) { if (menuDragged && e.target.closest('.card')) e.preventDefault(); }, true);
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(); });
  }

  /* ---------- Mark: dot travels with scroll ---------- */
  var dot = document.getElementById('markDot');
  function moveDot(p) { if (dot) dot.style.transform = 'rotate(' + (p * 360) + 'deg) translateX(' + (p * 22) + 'px)'; }

  /* ---------- Case pages: reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduce || !('IntersectionObserver' in window)) reveals.forEach(function (el) { el.classList.add('is-in'); });
    else {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { threshold: 0.12 });
      reveals.forEach(function (el) { io.observe(el); });
    }
    window.addEventListener('scroll', function () {
      var m = document.documentElement.scrollHeight - innerHeight; moveDot(m > 0 ? scrollY / m : 0);
    }, { passive: true });
  }

  /* ---------- About: the field flows past with inertia, loops, and curves into a globe with speed ----------
     Each image's four corners are projected onto a sphere (orthographic, like looking at the earth)
     and the image is warped to that quad, so the whole field bends together as one surface. */
  var sc = document.getElementById('scatter');
  if (sc) {
    var field = document.getElementById('scatterField');
    var pin = sc.querySelector('.scatter__pin');
    var figs = Array.prototype.slice.call(sc.querySelectorAll('.scatter__img'));
    var setH = field.firstElementChild.offsetHeight;
    var cur = 0, prev = 0, vel = 0, scRaf = null;

    function solve(A, b) { // Gaussian elimination, 8x8
      var n = b.length;
      for (var i = 0; i < n; i++) {
        var p = i; for (var r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
        var t = A[i]; A[i] = A[p]; A[p] = t; var tb = b[i]; b[i] = b[p]; b[p] = tb;
        for (var r2 = i + 1; r2 < n; r2++) { var f = A[r2][i] / A[i][i]; for (var c = i; c < n; c++) A[r2][c] -= f * A[i][c]; b[r2] -= f * b[i]; }
      }
      var x = new Array(n);
      for (var i2 = n - 1; i2 >= 0; i2--) { var sum = b[i2]; for (var c2 = i2 + 1; c2 < n; c2++) sum -= A[i2][c2] * x[c2]; x[i2] = sum / A[i2][i2]; }
      return x;
    }
    function quad(w, h, to) { // matrix3d mapping the box (0,0)-(w,h) onto quad `to`
      var from = [[0, 0], [w, 0], [w, h], [0, h]], A = [], b = [];
      for (var i = 0; i < 4; i++) {
        var X = from[i][0], Y = from[i][1], u = to[i][0], v = to[i][1];
        A.push([X, Y, 1, 0, 0, 0, -X * u, -Y * u]); b.push(u);
        A.push([0, 0, 0, X, Y, 1, -X * v, -Y * v]); b.push(v);
      }
      var h8 = solve(A, b);
      return 'matrix3d(' + [h8[0], h8[3], 0, h8[6], h8[1], h8[4], 0, h8[7], 0, 0, 1, 0, h8[2], h8[5], 0, 1].map(function (n) { return n.toFixed(6); }).join(',') + ')';
    }
    function targetOffset() {
      var r = sc.getBoundingClientRect(), span = sc.offsetHeight - innerHeight;
      var p = Math.max(0, Math.min(1, -r.top / span));
      return p * setH * 1.6;
    }
    function frame() {
      setH = field.firstElementChild.offsetHeight;
      var t = targetOffset();
      cur += (t - cur) * (reduce ? 1 : 0.075);
      vel += ((cur - prev) - vel) * 0.2; prev = cur;
      var fy = -(cur % setH);
      field.style.transform = 'translate3d(0,' + fy.toFixed(2) + 'px,0)';
      var sv = reduce ? 0 : Math.max(-1, Math.min(1, vel / 14));   // + scrolling down, - scrolling up
      var s = Math.abs(sv);
      var vw = innerWidth, vh = innerHeight, cx = vw / 2, cy = vh / 2;
      var pinTop = pin.getBoundingClientRect().top;
      var R = (Math.max(vw, vh) * 0.75) / (0.0001 + s * 1.6);   // sphere radius: huge = flat, small = round
      var half = Math.max(vw, vh) / 2;
      function proj(x, y) {
        var dx = x - cx, dy = y - cy, r = Math.sqrt(dx * dx + dy * dy);
        if (r < 0.001 || s < 0.002) return [x, y];
        var a = Math.min(r / R, Math.PI / 2), k2 = (R * Math.sin(a)) / r;   // globe, in either scroll direction
        return [cx + dx * k2, cy + dy * k2];
      }
      for (var i = 0; i < figs.length; i++) {
        var el = figs[i], set = el.parentElement;
        var left = el.offsetLeft, top = pinTop + fy + set.offsetTop + el.offsetTop;
        var w = el.offsetWidth, h = el.offsetHeight;
        if (top + h < -300 || top > vh + 300) { el.style.transform = ''; continue; }
        if (s < 0.002) { el.style.transform = ''; continue; }
        var c = [proj(left, top), proj(left + w, top), proj(left + w, top + h), proj(left, top + h)]
          .map(function (p) { return [p[0] - left, p[1] - top]; });
        el.style.transform = quad(w, h, c);
      }
      if (Math.abs(t - cur) < 0.3 && Math.abs(vel) < 0.02) {
        cur = t; field.style.transform = 'translate3d(0,' + (-(cur % setH)).toFixed(2) + 'px,0)';
        figs.forEach(function (el) { el.style.transform = ''; });
        scRaf = null; return;
      }
      scRaf = requestAnimationFrame(frame);
    }
    function kick() { if (!scRaf) scRaf = requestAnimationFrame(frame); }
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    kick();
  }

  /* ---------- Home gallery ---------- */
  var track = document.getElementById('track');
  if (!track) return;
  var originals = Array.prototype.slice.call(track.children);
  // Clone the set on both sides so the row loops endlessly
  originals.forEach(function (n) { var c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1; track.appendChild(c); });
  originals.slice().reverse().forEach(function (n) { var c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1; track.insertBefore(c, track.firstChild); });
  var setW = 0;
  function measure() { setW = originals[0].offsetLeft - track.firstChild.offsetLeft; }
  measure(); window.addEventListener('resize', function () { measure(); });
  var target = setW, current = setW, raf = null;
  track.scrollLeft = setW;
  function wrap() {
    if (current >= setW * 2) { current -= setW; target -= setW; }
    if (current < setW * 0.5) { current += setW; target += setW; }
  }
  function loop() {
    current += (target - current) * (reduce ? 1 : 0.1);
    if (Math.abs(target - current) < 0.4) current = target;
    wrap(); track.scrollLeft = current; moveDot(((current - setW) / setW + 1) % 1);
    raf = current === target ? null : requestAnimationFrame(loop);
  }
  function go(x) { target = x; if (!raf) raf = requestAnimationFrame(loop); }
  track.addEventListener('wheel', function (e) { e.preventDefault(); go(target + (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX)); }, { passive: false });
  var down = false, startX = 0, startT = 0, moved = 0, lastX = 0, vel = 0;
  track.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = 0; startX = lastX = e.clientX; startT = target; });
  window.addEventListener('pointermove', function (e) {
    if (!down) return; var dx = e.clientX - startX; moved = Math.abs(dx); vel = e.clientX - lastX; lastX = e.clientX;
    if (moved > 4) track.classList.add('is-dragging'); go(startT - dx * 1.4);
  });
  window.addEventListener('pointerup', function () { if (!down) return; down = false; go(target - vel * 14); setTimeout(function () { track.classList.remove('is-dragging'); }, 0); });
  track.addEventListener('scroll', function () { if (!raf && !down) { current = target = track.scrollLeft; wrap(); if (track.scrollLeft !== current) track.scrollLeft = current; } }, { passive: true });
  window.addEventListener('keydown', function (e) {
    if (menu && menu.classList.contains('is-open')) return;
    if (e.key === 'ArrowRight') go(target + track.clientWidth * 0.5);
    if (e.key === 'ArrowLeft') go(target - track.clientWidth * 0.5);
  });

  /* Hint: tells first-time visitors the row moves sideways, then fades on first interaction */
  var hint = document.getElementById('hint');
  if (hint) {
    var hintText = hint.querySelector('.hint__text');
    var placeHint = function () {
      var bar = document.querySelector('.bar'), title = originals[0].querySelector('.item__title');
      var top = bar ? bar.getBoundingClientRect().bottom : 0, bottom = title ? title.getBoundingClientRect().top : innerHeight / 2;
      hint.style.top = Math.max(top + 8, (top + bottom) / 2 - hint.offsetHeight / 2) + 'px';
    };
    placeHint(); window.addEventListener('resize', placeHint);
    if (hintText && !window.matchMedia('(pointer: fine)').matches) hintText.textContent = 'Swipe to explore';
    var hideHint = function () {
      hint.classList.remove('is-on');
      ['wheel', 'pointerdown', 'touchstart'].forEach(function (ev) { track.removeEventListener(ev, hideHint); });
      window.removeEventListener('keydown', hideHint);
    };
    ['wheel', 'pointerdown', 'touchstart'].forEach(function (ev) { track.addEventListener(ev, hideHint, { passive: true }); });
    window.addEventListener('keydown', hideHint);
    setTimeout(function () {
      hint.classList.add('is-on');
      if (!reduce) { var from = target; go(from + 90); setTimeout(function () { go(from); }, 650); }
    }, reduce ? 300 : 2900);
  }

  /* Cursor: Scroll / View */
  var cursor = document.getElementById('cursor');
  if (cursor && !reduce && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', function (e) {
      cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
      var t = e.target.closest ? e.target : null;
      cursor.textContent = t && t.closest('.item__media') ? 'View' : 'Scroll';
      cursor.classList.toggle('is-on', !!(t && t.closest('.track')));
    }, { passive: true });
  }

  /* Intro: images stack and shuffle in the centre, then open into the row */
  if (!reduce) {
    root.classList.add('is-intro');
    var visible = Array.prototype.filter.call(track.querySelectorAll('.item'), function (it) {
      var r = it.getBoundingClientRect(); return r.right > 0 && r.left < innerWidth;
    });
    var cx = innerWidth / 2, cy = innerHeight / 2;
    visible.forEach(function (it, i) {
      var m = it.querySelector('.item__media'), r = m.getBoundingClientRect();
      var dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2);
      m.style.transition = 'none';
      m.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0.3)';
      m.style.opacity = '0';
      m.style.zIndex = String(10 + i);
      m.style.position = 'relative';
    });
    var step = 0, order = visible.slice();
    var shuffle = setInterval(function () {
      order.forEach(function (it, i) { it.querySelector('.item__media').style.opacity = i <= step ? '1' : '0'; });
      var top = order[step % order.length];
      if (top) top.querySelector('.item__media').style.zIndex = String(50 + step);
      step++;
      if (step > order.length + 2) {
        clearInterval(shuffle);
        visible.forEach(function (it, i) {
          var m = it.querySelector('.item__media');
          m.style.transition = 'transform 1.2s cubic-bezier(0.22,1,0.36,1) ' + (i * 0.05) + 's';
          m.style.transform = 'none'; m.style.opacity = '1';
        });
        setTimeout(function () {
          root.classList.remove('is-intro');
          visible.forEach(function (it) { var m = it.querySelector('.item__media'); m.style.cssText = ''; });
        }, 1500);
      }
    }, 170);
  }

  /* Click: other projects fade, the chosen image grows towards the case hero, then navigate */
  track.addEventListener('click', function (e) {
    var a = e.target.closest('a.item'); if (!a || reduce) return;
    if (track.classList.contains('is-dragging')) { e.preventDefault(); return; }
    e.preventDefault();
    var m = a.querySelector('.item__media'), r = m.getBoundingClientRect();
    var tw = innerWidth * 0.46, th = innerHeight - 96 - 20;
    var tx = innerWidth - 20 - tw, ty = 96;
    var s = Math.max(tw / r.width, th / r.height);
    a.classList.add('is-picked'); root.classList.add('is-leaving');
    m.style.position = 'relative'; m.style.zIndex = '60';
    m.style.transition = 'transform 0.75s cubic-bezier(0.22,1,0.36,1)';
    m.style.transformOrigin = '0 0';
    m.style.transform = 'translate(' + (tx - r.left) + 'px,' + (ty - r.top) + 'px) scale(' + s.toFixed(3) + ')';
    setTimeout(function () { location.href = a.href; }, 700);
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted) location.reload(); });
})();
