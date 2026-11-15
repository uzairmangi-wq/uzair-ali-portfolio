(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  document.getElementById('yr').textContent = new Date().getFullYear();
  burger.addEventListener('click', function () {
    var o = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
  });

  var lenis = null;
  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    // Lenis drives ScrollTrigger from one ticker so the two never fight
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
      if (lenis) { e.preventDefault(); lenis.scrollTo(t, { offset: -64, duration: 1.4 }); }
    });
  });

  // Active nav link follows scroll position (works with or without animation)
  var links = [].slice.call(document.querySelectorAll('#menu a')), secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function active() {
    var y = window.scrollY + innerHeight * 0.35, cur = 0;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === cur); a.removeAttribute('aria-current'); if (i === cur) a.setAttribute('aria-current', 'true'); });
    document.getElementById('bar').style.transform = 'scaleX(' + Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)) + ')';
  }
  addEventListener('scroll', active, { passive: true }); addEventListener('resize', active); active();

  if (!window.gsap || !window.ScrollTrigger || reduce) return;

  // Split big title into letters, section titles into words
  document.querySelectorAll('.split').forEach(function (el) {
    el.innerHTML = el.textContent.split('').map(function (c) { return '<i>' + c + '</i>'; }).join('');
  });
  document.querySelectorAll('.rv').forEach(function (el) {
    el.innerHTML = el.textContent.split(' ').map(function (w) { return '<span class="split"><i>' + w + '</i></span>'; }).join(' ');
  });

  // Give each letter its slice of one shared gradient so the title reads as a single gradient
  function tint() {
    var h = document.querySelector('.hero h1'), hb = h.getBoundingClientRect();
    h.querySelectorAll('i').forEach(function (l) {
      var r = l.getBoundingClientRect(), ty = gsap.getProperty(l, 'y') || 0, tp = gsap.getProperty(l, 'yPercent') || 0;
      var top = r.top - hb.top - ty - (tp / 100) * r.height;
      l.style.backgroundSize = hb.width + 'px ' + hb.height + 'px';
      l.style.backgroundPosition = -(r.left - hb.left) + 'px ' + -top + 'px';
    });
  }
  tint(); addEventListener('resize', tint);

  // One orchestrated load sequence for the hero
  gsap.from('.hero .split i', { yPercent: 115, rotate: 6, duration: 1.2, ease: 'expo.out', stagger: 0.06, delay: 0.1 });
  gsap.from('.kick,.lead,.hero .btn', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.7 });

  var mm = gsap.matchMedia();
  function rev(targets, vars, trig, start) {
    // play on enter, reverse on leaving upward
    gsap.from(targets, Object.assign({ scrollTrigger: { trigger: trig, start: start || 'top 82%', toggleActions: 'play none none reverse' } }, vars));
  }
  mm.add('(min-width: 901px)', function () {
    // hero drifts and softens as the page flows into About
    gsap.to('.hero .wrap', { yPercent: -14, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.b1', { yPercent: 30, xPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.b2', { yPercent: -25, xPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    // cinematic mask reveal of the portrait, scrubbed so it reverses on scroll up
    gsap.fromTo('.photo', { clipPath: 'inset(100% 0 0 0 round 28px)' }, { clipPath: 'inset(0% 0 0 0 round 28px)', ease: 'none', scrollTrigger: { trigger: '.photo', start: 'top 90%', end: 'top 35%', scrub: 0.6 } });
    gsap.fromTo('.photo img', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.photo', start: 'top 90%', end: 'bottom 30%', scrub: true } });
    // projects: mask wipe plus layered parallax between card and its lettering
    gsap.utils.toArray('.proj').forEach(function (p) {
      var v = p.querySelector('.pvis');
      gsap.fromTo(v, { clipPath: 'inset(0 100% 0 0 round 26px)' }, { clipPath: 'inset(0 0% 0 0 round 26px)', ease: 'none', scrollTrigger: { trigger: p, start: 'top 85%', end: 'top 40%', scrub: 0.6 } });
      gsap.fromTo(p.querySelector('.pv'), { yPercent: -35 }, { yPercent: 35, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });
  mm.add('(max-width: 900px)', function () {
    rev('.photo', { opacity: 0, y: 40, duration: 1 }, '.photo');
    gsap.utils.toArray('.pvis').forEach(function (v) { rev(v, { opacity: 0, y: 30, duration: 0.9 }, v); });
  });

  gsap.utils.toArray('.rv').forEach(function (h) { rev(h.querySelectorAll('i'), { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.07 }, h); });
  rev('.rvp', { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }, '#about p');
  gsap.utils.toArray('.cards').forEach(function (g) { rev(g.children, { y: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, g); });
  gsap.utils.toArray('.pt').forEach(function (p) { rev(p.children, { y: 30, opacity: 0, duration: 0.8, stagger: 0.08 }, p); });
  rev('.sub', { y: 20, opacity: 0, duration: 0.9 }, '.sub');

  // timelines draw as you scroll; li items rise in turn
  gsap.utils.toArray('.tl').forEach(function (t) {
    gsap.fromTo(t.querySelector('.line'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: t, start: 'top 75%', end: 'bottom 70%', scrub: true } });
    rev(t.querySelectorAll('li'), { x: -24, opacity: 0, duration: 0.8, stagger: 0.15 }, t);
  });
  // counter
  var c = document.querySelector('[data-count]');
  if (c) { var o = { v: 0 }; gsap.to(o, { v: 2, duration: 1.4, ease: 'power2.out', onUpdate: function () { c.textContent = Math.round(o.v); }, scrollTrigger: { trigger: '.hi', start: 'top 80%', toggleActions: 'restart none none reset' } }); }
  // contact section blooms in
  gsap.from('.contact .wrap', { scale: 0.94, y: 60, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top 85%', end: 'top 35%', scrub: true } });
  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
