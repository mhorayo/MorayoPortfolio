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

  /* Name: letters rise in one after another */
  hero.querySelectorAll('.hero-l__title .ln').forEach(function (ln, row) {
    var t = ln.textContent; ln.textContent = '';
    t.split('').forEach(function (c, i) {
      var sp = document.createElement('span'); sp.className = 'ch'; sp.textContent = c;
      sp.style.transitionDelay = (row * 0.12 + i * 0.035) + 's';
      ln.appendChild(sp);
    });
  });
  var on = function () { hero.classList.add('is-on'); };
  if (document.getElementById('intro') && !document.documentElement.classList.contains('no-intro')) document.addEventListener('intro:done', on, { once: true });
  else requestAnimationFrame(function () { requestAnimationFrame(on); });

  /* Frame: each project wipes up over the last; caption follows */
  var media = hero.querySelector('.hero-l__media');
  var imgs = Array.prototype.slice.call(media.querySelectorAll('img'));
  var no = document.getElementById('heroNo'), name = document.getElementById('heroName');
  var cur = 0;
  if (!reduce) setInterval(function () {
    if (document.hidden) return;
    var prev = imgs[cur]; cur = (cur + 1) % imgs.length;
    imgs.forEach(function (im) { im.classList.remove('is-prev'); });
    prev.classList.remove('is-on'); prev.classList.add('is-prev');
    imgs[cur].classList.add('is-on');
    no.textContent = '0' + (cur + 1) + ' / 0' + imgs.length;
    name.textContent = imgs[cur].dataset.name;
  }, 3200);

  /* A gentle tilt toward the pointer */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    media.addEventListener('mousemove', function (e) {
      var r = media.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      media.style.transform = 'perspective(1200px) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 4) + 'deg)';
    });
    media.addEventListener('mouseleave', function () { media.style.transform = ''; });
  }
})();
