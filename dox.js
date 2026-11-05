/* Doxflowy case: the small live pieces. Each one runs only while it's on screen, and sits still with reduced motion.
   - the website scrolls inside its window (the end point comes from the real image height)
   - a timer that really waits 13 seconds (her Clarity report: LCP 13s)
   - onboarding: the team-size answer changes the wording, the suggestion and the route
   - the AI assistant drafts a document from a prompt and drops the tags in
   - her calculation-tag prototype, live in an iframe, scaled to fit
   - loading: the branded mark, then the skeleton, then the real dashboard */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = function (el, on, off, th) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) on(); else if (off) off(); }); }, { threshold: th || 0.35 }).observe(el);
  };

  /* website scroll */
  document.querySelectorAll('.dx-scroll').forEach(function (w) {
    var box = w.querySelector('.dx-win__in'), img = box.querySelector('img');
    var set = function () { if (img.naturalWidth) w.style.setProperty('--y', -(img.offsetHeight - box.clientHeight) + 'px'); img.style.setProperty('--y', -(img.offsetHeight - box.clientHeight) + 'px'); };
    img.complete ? set() : img.addEventListener('load', set);
    window.addEventListener('resize', set);
  });

  /* 13 seconds */
  document.querySelectorAll('.dx-wait').forEach(function (w) {
    var t = w.querySelector('.dx-wait__t b'), bar = w.querySelector('.dx-wait__bar'), btn = w.querySelector('button'), raf = 0, done = false;
    var run = function () {
      cancelAnimationFrame(raf); var t0 = performance.now();
      (function f(now) { var s = Math.min(13, (now - t0) / 1000); t.textContent = s.toFixed(1); bar.style.setProperty('--p', (s / 13 * 100) + '%'); if (s < 13) raf = requestAnimationFrame(f); else done = true; })(t0);
    };
    if (reduce) { t.textContent = '13.0'; bar.style.setProperty('--p', '100%'); return; }
    seen(w, function () { if (!done && !raf) run(); }, null, 0.6);
    btn.addEventListener('click', function () { done = false; run(); });
  });

  /* onboarding */
  var ROUTES = {
    solo: { k: 'Route: solo', h: 'Let&rsquo;s get your first document signed.', p: 'No team to set up. We skip straight to the thing you came for.', li: ['Upload a PDF or start from a template', 'Add your signature fields', 'Send it in minutes'], cta: 'Sign my first document' },
    small: { k: 'Route: small team', h: 'Bring your team into one shared space.', p: 'A few people, many documents. Templates everyone can reuse come first.', li: ['Invite your teammates', 'Save shared templates', 'See who still needs to sign'], cta: 'Invite my team' },
    mid: { k: 'Route: growing team (10&ndash;50)', h: 'Set up roles, then let the templates do the work.', p: 'At this size the pain is repetition. We suggest the team plan and start with roles.', li: ['Roles for senders, signers and witnesses', 'Templates with tags filled in for you', 'A dashboard of what needs attention'], cta: 'Set up roles' },
    big: { k: 'Route: larger team (50&ndash;100+)', h: 'Approvals and workflows for every department.', p: 'At this size it&rsquo;s about control. We suggest a guided set-up with the team.', li: ['Approval steps and workflow tags', 'Integrations and admin settings', 'A guided set-up call'], cta: 'Book a guided set-up' }
  };
  document.querySelectorAll('.dx-ob').forEach(function (ob) {
    var btns = [].slice.call(ob.querySelectorAll('.dx-ob__opts button')), sw = ob.querySelector('.dx-ob__swap'), bars = ob.querySelectorAll('.dx-ob__bar i');
    var k = ob.querySelector('.dx-ob__k'), h = ob.querySelector('.dx-ob__r h4'), p = ob.querySelector('.dx-ob__r p'), ul = ob.querySelector('.dx-ob__r ul'), cta = ob.querySelector('.dx-ob__cta');
    var auto = !reduce, timer = 0, n = 2;
    var pick = function (i, fromUser) {
      if (fromUser) { auto = false; clearTimeout(timer); }
      btns.forEach(function (b, j) { b.classList.toggle('on', j === i); b.setAttribute('aria-pressed', j === i); });
      bars[1].classList.add('on');
      var r = ROUTES[btns[i].dataset.r];
      sw.classList.add('is-swap');
      setTimeout(function () { k.innerHTML = r.k; h.innerHTML = r.h; p.innerHTML = r.p; ul.innerHTML = r.li.map(function (x) { return '<li>' + x + '</li>'; }).join(''); cta.innerHTML = r.cta + ' &rarr;'; sw.classList.remove('is-swap'); }, 260);
      n = i;
    };
    btns.forEach(function (b, i) { b.addEventListener('click', function () { pick(i, true); }); });
    pick(2);
    var loop = function () { if (!auto) return; timer = setTimeout(function () { if (!auto) return; pick((n + 1) % btns.length); loop(); }, 3200); };
    seen(ob, function () { if (auto && !timer) loop(); }, function () { clearTimeout(timer); timer = 0; });
  });

  /* AI assistant */
  document.querySelectorAll('.dx-ai').forEach(function (ai) {
    var pr = ai.querySelector('.dx-ai__prompt'), go = ai.querySelector('.dx-ai__go'), sk = ai.querySelector('.dx-ai__skels');
    var paras = [].slice.call(ai.querySelectorAll('.dx-ai__paper [data-p]')), tags = [].slice.call(ai.querySelectorAll('.dx-ai__paper .dx-tag'));
    var log = [].slice.call(ai.querySelectorAll('.dx-ai__log li')), badge = ai.querySelector('.dx-ai__badge');
    var text = pr.dataset.text, live = false, timers = [];
    var later = function (ms, f) { timers.push(setTimeout(f, ms)); };
    var reset = function () {
      timers.forEach(clearTimeout); timers = [];
      pr.textContent = ''; sk.classList.add('off'); badge.classList.remove('on');
      paras.concat(tags, log).forEach(function (el) { el.classList.remove('on'); });
    };
    var finished = function () { pr.textContent = text; paras.concat(tags, log).forEach(function (el) { el.classList.add('on'); }); badge.classList.add('on'); };
    var play = function () {
      reset(); var t = 300;
      for (var i = 1; i <= text.length; i++) (function (i) { later(t + i * 38, function () { pr.textContent = text.slice(0, i); }); })(i);
      t += text.length * 38 + 500;
      later(t, function () { go.classList.add('press'); }); later(t + 180, function () { go.classList.remove('press'); sk.classList.remove('off'); });
      t += 1500;
      later(t, function () { sk.classList.add('off'); });
      paras.forEach(function (el, j) { later(t + 200 + j * 650, function () { el.classList.add('on'); }); });
      var t2 = t + 400;
      tags.forEach(function (el, j) { later(t2 + 300 + j * 380, function () { el.classList.add('on'); }); });
      t2 += tags.length * 380 + 600;
      log.forEach(function (el, j) { later(t2 + j * 450, function () { el.classList.add('on'); }); });
      t2 += log.length * 450 + 300;
      later(t2, function () { badge.classList.add('on'); });
      later(t2 + 4200, function () { if (live) play(); });
    };
    if (reduce) { finished(); return; }
    reset();
    seen(ai, function () { if (!live) { live = true; play(); } }, function () { live = false; timers.forEach(clearTimeout); timers = []; finished(); });
  });

  /* calculation-tag iframe: scale the 1440 x 900 prototype to its box */
  document.querySelectorAll('.dx-calc__fit').forEach(function (box) {
    var fit = function () { box.style.setProperty('--s', box.clientWidth / 1440); };
    fit(); window.addEventListener('resize', fit);
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(box);
  });

  /* loading: mark -> skeleton -> dashboard */
  document.querySelectorAll('.dx-load').forEach(function (l) {
    var ph = 0, timer = 0, T = [1100, 1900, 3600];
    var step = function () { l.dataset.phase = ph; timer = setTimeout(function () { ph = (ph + 1) % 3; step(); }, T[ph]); };
    if (reduce) { l.dataset.phase = 2; return; }
    l.dataset.phase = 0;
    seen(l, function () { if (!timer) step(); }, function () { clearTimeout(timer); timer = 0; });
  });
})();
