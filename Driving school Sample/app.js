/* ===== Right 2 Drive — interactions ===== */
(function () {
  'use strict';

  // --- Fill star ratings ---
  var STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
  document.querySelectorAll('[data-stars]').forEach(function (el) {
    el.innerHTML = STAR.repeat(5);
  });

  // --- Inject Google "G" logo ---
  var GLOGO = '<svg viewBox="0 0 48 48" width="100%" height="100%"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/></svg>';
  document.querySelectorAll('.glogo, .glogo-sm, .glogo-xs').forEach(function (el) {
    el.innerHTML = GLOGO;
    el.style.display = 'inline-block';
    if (el.classList.contains('glogo-xs')) { el.style.width = '14px'; el.style.height = '14px'; }
  });

  // --- Mobile drawer ---
  var drawer = document.getElementById('drawer');
  var backdrop = document.getElementById('backdrop');
  function openDrawer() { drawer.classList.add('open'); backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { drawer.classList.remove('open'); backdrop.classList.remove('open'); document.body.style.overflow = ''; }
  document.getElementById('openDrawer').addEventListener('click', openDrawer);
  document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', closeDrawer);
  });

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // close others
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        a.style.maxHeight = null;
      } else {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // --- Form validation ---
  var form = document.getElementById('enquiryForm');
  var success = document.getElementById('formSuccess');
  function setError(field, on) { field.closest('.field').classList.toggle('error', on); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.querySelector('#f-name');
    var phone = form.querySelector('#f-phone');
    var email = form.querySelector('#f-email');
    var ok = true;
    if (!name.value.trim()) { setError(name, true); ok = false; } else setError(name, false);
    if (!phone.value.trim()) { setError(phone, true); ok = false; } else setError(phone, false);
    var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!emailValid) { setError(email, true); ok = false; } else setError(email, false);
    if (!ok) {
      form.querySelector('.field.error input').focus();
      return;
    }
    form.style.display = 'none';
    success.classList.add('show');
  });
  // clear error on input
  form.querySelectorAll('input').forEach(function (input) {
    input.addEventListener('input', function () { setError(input, false); });
  });

  // --- Horizontal carousels: arrow buttons (desktop) ---
  document.querySelectorAll('.carousel').forEach(function (car) {
    var scroller = car.querySelector('.hscroll');
    if (!scroller) return;
    var head = car.previousElementSibling;
    var btns = head ? head.querySelectorAll('[data-dir]') : [];
    function step() {
      // scroll by one visible page (minus horizontal padding)
      return Math.max(scroller.clientWidth - 48, 240);
    }
    function update() {
      var max = scroller.scrollWidth - scroller.clientWidth - 2;
      btns.forEach(function (b) {
        var dir = parseInt(b.getAttribute('data-dir'), 10);
        if (dir < 0) b.disabled = scroller.scrollLeft <= 2;
        else b.disabled = scroller.scrollLeft >= max;
      });
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var dir = parseInt(b.getAttribute('data-dir'), 10);
        scroller.scrollBy({ left: dir * step(), behavior: 'smooth' });
      });
    });
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // --- Mobile carousels: wrap + dot indicators + swipe hint ---
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
  var mq = window.matchMedia('(max-width: 700px)');
  var carouselDefs = [
    { scroller: document.querySelector('#lessons .grid-4'), card: '.lesson-card' },
    { scroller: document.querySelector('.story-scroll'), card: '.story-card' },
    { scroller: document.querySelector('#reviews .grid-3'), card: '.review-card' },
    { scroller: document.querySelector('.pkg-grid'), card: '.pkg-card', center: '.popular' }
  ];

  carouselDefs.forEach(function (def) {
    var scroller = def.scroller;
    if (!scroller) return;

    // wrap so the swipe hint can sit over the cards
    var wrap = document.createElement('div');
    wrap.className = 'scroll-wrap';
    scroller.parentNode.insertBefore(wrap, scroller);
    wrap.appendChild(scroller);

    var cards = Array.prototype.slice.call(scroller.querySelectorAll(def.card));
    if (!cards.length) return;

    // dot indicators
    var dots = document.createElement('div');
    dots.className = 'dots';
    cards.forEach(function (c, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to item ' + (i + 1));
      d.addEventListener('click', function () {
        var pl = parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
        var delta = c.getBoundingClientRect().left - scroller.getBoundingClientRect().left - pl;
        scroller.scrollBy({ left: delta, behavior: 'smooth' });
      });
      dots.appendChild(d);
    });
    wrap.parentNode.insertBefore(dots, wrap.nextSibling);
    var dotEls = dots.children;

    // swipe hint (fades after a moment / on first scroll)
    var hint = document.createElement('div');
    hint.className = 'swipe-hint';
    hint.innerHTML = 'Swipe ' + ARROW;
    wrap.appendChild(hint);
    var hintTimer = setTimeout(function () { hint.classList.add('hide'); }, 2600);
    var dismissed = false;

    function syncDots() {
      var mid = scroller.scrollLeft + scroller.clientWidth / 2;
      var best = 0, bd = Infinity;
      cards.forEach(function (c, i) {
        var cc = c.offsetLeft + c.offsetWidth / 2;
        var dd = Math.abs(cc - mid);
        if (dd < bd) { bd = dd; best = i; }
      });
      for (var i = 0; i < dotEls.length; i++) {
        dotEls[i].classList.toggle('active', i === best);
      }
    }

    scroller.addEventListener('scroll', function () {
      syncDots();
      if (!dismissed) {
        dismissed = true;
        clearTimeout(hintTimer);
        hint.classList.add('hide');
      }
    }, { passive: true });

    // center the "Most Popular" package on mobile load
    if (def.center && mq.matches) {
      var pop = scroller.querySelector(def.center);
      if (pop) {
        var centerPopular = function () {
          var prev = scroller.style.scrollBehavior;
          scroller.style.scrollBehavior = 'auto';
          var delta = pop.getBoundingClientRect().left - scroller.getBoundingClientRect().left
                    - (scroller.clientWidth - pop.offsetWidth) / 2;
          scroller.scrollLeft += delta;
          scroller.style.scrollBehavior = prev;
          syncDots();
        };
        requestAnimationFrame(centerPopular);
        window.addEventListener('load', centerPopular);
      }
    }
    syncDots();
  });

  // --- Header shadow on scroll ---
  var header = document.querySelector('.header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 8) header.style.boxShadow = '0 4px 20px rgba(16,33,54,0.06)';
    else header.style.boxShadow = 'none';
  });
})();
