/* Typewriter: the big statements type themselves out the first time they come into view, with a blinking caret that
   leaves when the line is done. Only headlines and selling lines, never body text. Screen readers get the full line at once;
   with reduced motion the text simply shows. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.cs__big, .cs__sell, .pg__lead, .ab2__state, [data-type]');
  if (reduce || !('IntersectionObserver' in window)) return;
  var type = function (el) {
    var full = el.textContent, i = 0, speed = Math.max(14, Math.min(34, 1400 / full.length));
    el.setAttribute('aria-label', full);
    el.textContent = '';
    var txt = document.createElement('span'), caret = document.createElement('i');
    txt.setAttribute('aria-hidden', 'true'); caret.className = 'tw__caret'; caret.setAttribute('aria-hidden', 'true');
    el.appendChild(txt); el.appendChild(caret);
    (function step() {
      i += 1; txt.textContent = full.slice(0, i);
      if (i < full.length) setTimeout(step, speed); else setTimeout(function () { caret.remove(); }, 900);
    })();
  };
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); type(e.target); } });
  }, { threshold: 0.4 });
  els.forEach(function (el) { el.style.minHeight = el.offsetHeight + 'px'; io.observe(el); });
})();
