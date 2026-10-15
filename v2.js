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

  /* ---------- Menu ---------- */
  var menu = document.getElementById('menu'), menuBtn = document.getElementById('menuBtn');
  function openMenu() { if (!menu) return; menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('is-open'); }); menuBtn.setAttribute('aria-expanded', 'true'); document.getElementById('menuClose').focus(); }
  function closeMenu() { menu.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); setTimeout(function () { menu.hidden = true; }, 500); menuBtn.focus(); }
  if (menu) {
    menuBtn.addEventListener('click', openMenu);
    document.getElementById('markBtn').addEventListener('click', openMenu);
    document.getElementById('menuClose').addEventListener('click', closeMenu);
    menu.addEventListener('click', function (e) { if (e.target === menu) closeMenu(); });
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

  /* ---------- Case pages: images bend in 3D with scroll speed, then settle flat ---------- */
  var bendImgs = Array.prototype.slice.call(document.querySelectorAll('.shots img'));
  if (bendImgs.length && !reduce) {
    var lastY = scrollY, smooth = 0, bendRaf = null;
    function bend() {
      var y = scrollY, vel = y - lastY; lastY = y;
      smooth += (vel - smooth) * 0.14;
      var k = Math.max(-1, Math.min(1, smooth / 38));
      var vh = innerHeight, vw = innerWidth;
      for (var i = 0; i < bendImgs.length; i++) {
        var img = bendImgs[i], r = img.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        var d = ((r.top + r.height / 2) - vh / 2) / (vh / 2);   // -1 top … 1 bottom
        var hx = ((r.left + r.width / 2) - vw / 2) / (vw / 2);  // -1 left … 1 right
        img.style.transform = 'perspective(1000px) rotateX(' + (-k * 24 * d).toFixed(2) + 'deg) skewY(' + (k * 9 * hx).toFixed(2) + 'deg) scale(' + (1 - Math.abs(k) * 0.05).toFixed(3) + ')';
      }
      if (Math.abs(smooth) < 0.05 && Math.abs(vel) < 0.05) {
        bendImgs.forEach(function (im) { im.style.transform = ''; });
        bendRaf = null; return;
      }
      bendRaf = requestAnimationFrame(bend);
    }
    window.addEventListener('scroll', function () { if (!bendRaf) bendRaf = requestAnimationFrame(bend); }, { passive: true });
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

  /* Cursor: Drag / View */
  var cursor = document.getElementById('cursor');
  if (cursor && !reduce && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', function (e) {
      cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
      var t = e.target.closest ? e.target : null;
      cursor.textContent = t && t.closest('.item__media') ? 'View' : 'Drag';
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
