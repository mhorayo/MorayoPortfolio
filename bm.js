/* BroadMoney prototypes: her real screens play like a screen recording. Each frame holds, a tap dot lands where the finger
   would go (data-tap="x y" in %), then the next screen slides in; the step beside it lights up. Plays only while on screen. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-proto]').forEach(function (pr) {
    var imgs = [].slice.call(pr.querySelectorAll('.bm-ph img')), tap = pr.querySelector('.bm-tap'), steps = [].slice.call(pr.querySelectorAll('.bm-steps li'));
    var i = 0, timer = 0, live = false, HOLD = 2300;
    var show = function (n) {
      imgs.forEach(function (im, k) { im.classList.toggle('is-on', k === n); im.classList.toggle('is-off', k !== n && k === i); });
      steps.forEach(function (li, k) { li.classList.toggle('is-now', k === +imgs[n].dataset.step); });
      i = n;
    };
    var next = function () {
      if (!live) return;
      var t = imgs[i].dataset.tap;
      var go = function () { show((i + 1) % imgs.length); timer = setTimeout(next, HOLD); };
      if (t && tap) {
        var xy = t.split(' ');
        tap.style.left = xy[0] + '%'; tap.style.top = xy[1] + '%';
        tap.classList.remove('is-tap'); void tap.offsetWidth; tap.classList.add('is-tap');
        timer = setTimeout(go, 480);
      } else timer = setTimeout(go, 400);
    };
    show(0);
    if (reduce) return;   // still: the first screen, the steps readable
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !live) { live = true; timer = setTimeout(next, HOLD); }
        else if (!e.isIntersecting && live) { live = false; clearTimeout(timer); }
      });
    }, { threshold: 0.35 }).observe(pr);
  });
})();
