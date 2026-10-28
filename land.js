/* Home: plain navbar, hero name rising in, the hero frame wiping through the six projects */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Navbar: a hairline once you scroll; on phones a Menu button opens the links */
  var nav = document.getElementById('nav'), toggle = document.getElementById('navToggle');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open); toggle.textContent = open ? 'Close' : 'Menu';
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; });
    });
  }

  var hero = document.getElementById('hero');
  if (!hero) return;

  /* Hero orbit: the intro's cylinder of the six projects, carried on at the same angle; scrolling spins it */
  var ring = hero.querySelector('.ho__ring'), cards = Array.prototype.slice.call(ring.children);
  var angle = 0, boost = 0, last = 0, lastY = window.scrollY;
  function place() {
    var R = innerWidth <= 760 ? innerWidth * 0.26 : Math.min(innerWidth * 0.18, 300);
    cards.forEach(function (c, i) {
      var a = i / cards.length * 360, y = [-9, 7, -3, 10, -8, 4][i], tz = [4, -6, 8, -3, 6, -8][i];
      c.style.transform = 'translate(-50%,-50%) rotateY(' + a + 'deg) translateZ(' + R + 'px) translateY(' + y + 'vh) rotateZ(' + tz + 'deg)';
    });
  }
  place(); window.addEventListener('resize', place);
  window.addEventListener('scroll', function () { boost += Math.abs(window.scrollY - lastY) * 0.6; lastY = window.scrollY; }, { passive: true });
  (function spin(now) {
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
    if (!reduce) { angle += (14 + boost) * dt; boost *= Math.pow(0.04, dt); }
    ring.style.transform = 'rotateX(-8deg) rotateY(' + angle + 'deg)';
    requestAnimationFrame(spin);
  })(performance.now());

  /* After the intro: the orbit glides up and the headline rises in under it */
  var settle = function () { hero.classList.add('is-on'); };
  if (document.getElementById('intro') && !document.documentElement.classList.contains('no-intro')) {
    document.addEventListener('intro:done', function (e) { if (e.detail && e.detail.angle != null) angle = e.detail.angle; setTimeout(settle, 250); }, { once: true });
  } else requestAnimationFrame(function () { requestAnimationFrame(settle); });
})();
