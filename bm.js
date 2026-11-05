/* Case prototypes: her real screens play like a screen recording. Each frame holds, a tap dot lands where the finger
   would go (data-tap="x y" in %), or a swipe-up gesture runs (data-swipe="x"), then the next screen slides in
   (sideways, or upwards for a feed with data-dir="up"); the step beside it lights up. Plays only while on screen.
   Before/after sliders: drag (or use the keyboard) to wipe between the two screens. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-proto]').forEach(function (pr) {
    var imgs = [].slice.call(pr.querySelectorAll('.bm-ph > [data-step]')), tap = pr.querySelector('.bm-tap'), steps = [].slice.call(pr.querySelectorAll('.bm-steps li'));
    var i = 0, timer = 0, live = false, HOLD = +(pr.dataset.hold || 2300);
    var show = function (n) {
      imgs.forEach(function (im, k) {
        im.classList.toggle('is-on', k === n); im.classList.toggle('is-off', k !== n && k === i);
        var v = im.tagName === 'VIDEO' ? im : im.querySelector && im.querySelector('video');   // a screen that is video plays while it's on
        if (v) { if (k === n && live) { try { v.currentTime = 0; } catch (e) {} var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } else v.pause(); }
      });
      steps.forEach(function (li, k) { li.classList.toggle('is-now', k === +imgs[n].dataset.step); });
      i = n;
    };
    var next = function () {
      if (!live) return;
      var t = imgs[i].dataset.tap, sw = imgs[i].dataset.swipe;
      var go = function () { show((i + 1) % imgs.length); timer = setTimeout(next, +(imgs[i].dataset.hold || HOLD)); };
      if ((t || sw) && tap) {
        tap.classList.remove('is-tap', 'is-swipe'); void tap.offsetWidth;
        if (sw) { tap.style.left = sw + '%'; tap.style.top = '72%'; tap.classList.add('is-swipe'); timer = setTimeout(go, 520); }
        else { var xy = t.split(' '); tap.style.left = xy[0] + '%'; tap.style.top = xy[1] + '%'; tap.classList.add('is-tap'); timer = setTimeout(go, 480); }
      } else timer = setTimeout(go, 400);
    };
    show(0);
    if (reduce) return;   // still: the first screen, the steps readable
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !live) { live = true; show(i); timer = setTimeout(next, +(imgs[i].dataset.hold || HOLD)); }
        else if (!e.isIntersecting && live) { live = false; clearTimeout(timer); show(i); }
      });
    }, { threshold: 0.35 }).observe(pr);
  });
  /* a real screen recording in the phone: it plays only while on screen, and the step beside it lights up at the
     times in data-times ("0 3.5 9.5" seconds) */
  document.querySelectorAll('[data-rec]').forEach(function (pr) {
    var v = pr.querySelector('video'), steps = [].slice.call(pr.querySelectorAll('.bm-steps li'));
    var ts = (v.dataset.times || '0').split(' ').map(Number);
    var mark = function () { var t = v.currentTime, k = 0; ts.forEach(function (x, j) { if (t >= x) k = j; }); steps.forEach(function (li, j) { li.classList.toggle('is-now', j === k); }); };
    v.addEventListener('timeupdate', mark); mark();
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); return; }
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } else v.pause(); }); }, { threshold: 0.3 }).observe(pr);
  });
  document.querySelectorAll('[data-compare]').forEach(function (c) {
    var r = c.querySelector('input[type=range]');
    var set = function () { c.style.setProperty('--p', r.value + '%'); };
    r.addEventListener('input', set); set();
    // a small hint: it eases from "before" to "after" once, the first time it's seen
    if (reduce) return;
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; io.disconnect();
      var t0 = performance.now();
      (function f(now) { var k = Math.min(1, (now - t0) / 1600), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; r.value = 85 - 70 * e; set(); if (k < 1) requestAnimationFrame(f); })(t0);
    }, { threshold: 0.5 });
    io.observe(c);
  });
  /* a real screen laid onto a photo's phone (data-quad="x1 y1 x2 y2 x3 y3 x4 y4" in % of the photo: top-left, top-right,
     bottom-right, bottom-left), so the flow plays on the phone in the picture, in its own perspective */
  var fit = function (el) {
    var q = el.dataset.quad.split(' ').map(Number), host = el.parentNode, W = host.clientWidth, H = host.clientHeight;
    var w = el.offsetWidth, h = el.offsetHeight, P = [];
    for (var k = 0; k < 8; k += 2) P.push([q[k] / 100 * W, q[k + 1] / 100 * H]);
    // homography from the element's own rectangle to the four corners
    var A = [], B = [], src = [[0, 0], [w, 0], [w, h], [0, h]];
    for (k = 0; k < 4; k++) {
      var x = src[k][0], y = src[k][1], X = P[k][0], Y = P[k][1];
      A.push([x, y, 1, 0, 0, 0, -X * x, -X * y]); B.push(X);
      A.push([0, 0, 0, x, y, 1, -Y * x, -Y * y]); B.push(Y);
    }
    for (var c = 0; c < 8; c++) {   // Gaussian elimination
      var m = c; for (var r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[m][c])) m = r;
      var tA = A[c]; A[c] = A[m]; A[m] = tA; var tB = B[c]; B[c] = B[m]; B[m] = tB;
      for (r = 0; r < 8; r++) if (r !== c) { var f = A[r][c] / A[c][c]; for (var s = c; s < 8; s++) A[r][s] -= f * A[c][s]; B[r] -= f * B[c]; }
    }
    var v = B.map(function (b, k2) { return b / A[k2][k2]; });
    el.style.transform = 'matrix3d(' + [v[0], v[3], 0, v[6], v[1], v[4], 0, v[7], 0, 0, 1, 0, v[2], v[5], 0, 1].join(',') + ')';
  };
  var quads = [].slice.call(document.querySelectorAll('[data-quad]'));
  var fitAll = function () { quads.forEach(fit); };
  if (quads.length) { fitAll(); window.addEventListener('resize', fitAll); window.addEventListener('load', fitAll); }
})();
