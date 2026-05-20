// ════════════════════════════════════════════
// PORTFOLIO SITE — Phase 4: GSAP + Lenis
// ════════════════════════════════════════════

(function () {
  'use strict';

  // ── Shared shuffle helpers (hoisted so preloader can use them too) ──
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];
  const isWS = (s) => /^\s+$/.test(s);
  const splitWords = (s) => s.split(/(\s+)/).filter(w => w.length > 0);

  function shuffleTo(el, toText, tickMs = 50) {
    return new Promise(resolve => {
      if (el._shuffleInterval) clearInterval(el._shuffleInterval);
      const words = splitWords(toText);
      const progress = words.map(w => isWS(w) ? w.length : 0);
      el.textContent = words.map(w => isWS(w) ? w : Array.from({ length: w.length }, randChar).join('')).join('');
      el._shuffleInterval = setInterval(() => {
        let done = true;
        const out = words.map((word, idx) => {
          if (isWS(word)) return word;
          if (progress[idx] < word.length) {
            done = false;
            progress[idx]++;
            let s = '';
            for (let h = 0; h < word.length; h++) {
              s += h < progress[idx] ? word[h] : randChar();
            }
            return s;
          }
          return word;
        });
        el.textContent = out.join('');
        if (done) {
          clearInterval(el._shuffleInterval);
          el.textContent = toText;
          resolve();
        }
      }, tickMs);
    });
  }

  function shuffleAway(el, tickMs = 50) {
    return new Promise(resolve => {
      if (el._shuffleInterval) clearInterval(el._shuffleInterval);
      const original = el.textContent;
      const words = splitWords(original);
      const progress = words.map(w => isWS(w) ? w.length : w.length);
      el._shuffleInterval = setInterval(() => {
        let done = true;
        const out = words.map((word, idx) => {
          if (isWS(word)) return word;
          if (progress[idx] > 0) {
            done = false;
            progress[idx]--;
            let s = '';
            for (let h = 0; h < word.length; h++) {
              s += h < progress[idx] ? randChar() : ' ';
            }
            return s;
          }
          return ' '.repeat(word.length);
        });
        el.textContent = out.join('');
        if (done) {
          clearInterval(el._shuffleInterval);
          el.textContent = '';
          resolve();
        }
      }, tickMs);
    });
  }

  function lockWidth(el, ...texts) {
    const cs = window.getComputedStyle(el);
    const probe = document.createElement('span');
    probe.style.cssText = 'visibility:hidden;position:absolute;left:-9999px;top:0;white-space:nowrap;';
    probe.style.font = cs.font;
    probe.style.letterSpacing = cs.letterSpacing;
    probe.style.textTransform = cs.textTransform;
    document.body.appendChild(probe);
    let max = 0;
    for (const t of texts) {
      probe.textContent = t || '';
      if (probe.offsetWidth > max) max = probe.offsetWidth;
    }
    document.body.removeChild(probe);
    el.style.display = 'inline-block';
    el.style.width = (max + 2) + 'px';
  }

  function isAncestorChainVisible(el) {
    if (el.checkVisibility) {
      return el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
    }
    let cur = el;
    while (cur && cur !== document.body) {
      const op = parseFloat(window.getComputedStyle(cur).opacity);
      if (op < 0.5) return false;
      cur = cur.parentElement;
    }
    return true;
  }

  function waitForVisible(el, cb, maxWait = 10000) {
    const start = performance.now();
    (function tick() {
      if (isAncestorChainVisible(el) || performance.now() - start > maxWait) cb();
      else requestAnimationFrame(tick);
    })();
  }

  // Wait for all deferred scripts to load
  window.addEventListener('DOMContentLoaded', init);

  function init() {
    runPreloader();
  }

  function startMain() {
    initLenis();
    initNavigation();
    initClock();
    initHeroAnimations();
    initScrollAnimations();
    initCarousel();
    initHeaderBlur();
    initProjectPageAnimations();
    initMagneticButtons();
    initShuffle();
  }

  // ────────────────────────────────────────
  // 0. PRELOADER — "Welcome" → scramble away → reveal home
  // ────────────────────────────────────────
  function runPreloader() {
    const loader = document.getElementById('preloader');
    if (!loader) {
      startMain();
      return Promise.resolve();
    }

    const title = loader.querySelector('[data-preloader-title]');
    const sub = loader.querySelector('[data-preloader-sub]');
    if (!title || !sub) {
      loader.remove();
      startMain();
      return Promise.resolve();
    }

    const titleText = title.textContent.trim();
    const subText = sub.textContent.trim();

    // Phase 1: scramble in (faster)
    const inP = Promise.all([
      shuffleTo(title, titleText, 30),
      shuffleTo(sub, subText, 25),
    ]);

    // Phase 2: brief hold, then scramble away. Kick off the home entrance
    // animations BEFORE the loader fades so GSAP locks each target at its
    // from-state behind the still-opaque overlay — no flash, no replay.
    return inP
      .then(() => new Promise(r => setTimeout(r, 300)))
      .then(() => Promise.all([
        shuffleAway(title, 22),
        shuffleAway(sub, 20),
      ]))
      .then(() => {
        startMain();
        loader.classList.add('is-done');
        return new Promise(r => setTimeout(r, 450));
      })
      .then(() => { loader.remove(); });
  }

  // ────────────────────────────────────────
  // 1. LENIS SMOOTH SCROLL
  // ────────────────────────────────────────
  let lenis;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.2,            // Scroll duration — higher = smoother
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Connect Lenis to GSAP's ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ────────────────────────────────────────
  // 2. NAVIGATION
  // ────────────────────────────────────────
  function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navOverlay = document.getElementById('navOverlay');
    if (!hamburger || !navOverlay) return;

    const navLinks = navOverlay.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
      const isOpen = navOverlay.classList.contains('active');

      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.id === 'navClose') e.preventDefault();
        closeNav();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
        closeNav();
      }
    });

    function openNav() {
      hamburger.classList.add('active');
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();

      // Stagger nav links entrance
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(navLinks,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'expo.out',
            delay: 0.3,
          }
        );
      }
    }

    function closeNav() {
      hamburger.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }
  }

  // ────────────────────────────────────────
  // 3. LIVE CLOCK
  // ────────────────────────────────────────
  function initClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;

    function tick() {
      const now = new Date();
      el.textContent =
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  // ────────────────────────────────────────
  // 4. HERO ENTRANCE ANIMATIONS (GSAP)
  // ────────────────────────────────────────
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    const heroSection = document.querySelector('[data-hero]');
    if (!heroSection) return;

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
    });

    // Header slides down
    tl.fromTo('header',
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      0
    );

    // Hero title lines — staggered slide up with clip reveal
    const heroLines = heroSection.querySelectorAll('[data-hero-line]');
    tl.fromTo(heroLines,
      { y: 80, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 1.2,
        stagger: 0.12,
      },
      0.2
    );

    // Subtitle
    const subtitles = heroSection.querySelectorAll('[data-hero-subtitle]');
    tl.fromTo(subtitles,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8,
        stagger: 0.08,
      },
      0.7
    );

    // Decorative line grows
    const heroLine = heroSection.querySelector('[data-hero-divider]');
    if (heroLine) {
      tl.fromTo(heroLine,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1.2 },
        0.5
      );
    }

    // Meta info (location, clock)
    const heroMeta = heroSection.querySelectorAll('[data-hero-meta]');
    tl.fromTo(heroMeta,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      1.0
    );

    // Contact CTA
    const heroCta = heroSection.querySelector('[data-hero-cta]');
    if (heroCta) {
      tl.fromTo(heroCta,
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8 },
        1.1
      );
    }
  }

  // ────────────────────────────────────────
  // 5. SCROLL-TRIGGERED ANIMATIONS
  // ────────────────────────────────────────
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // ─ Fade-up elements ─
    // Any element with data-scroll="fade-up" animates in when scrolled into view
    gsap.utils.toArray('[data-scroll="fade-up"]').forEach(el => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ─ Staggered children ─
    // Parent with data-scroll="stagger" will animate its [data-scroll-child] kids
    gsap.utils.toArray('[data-scroll="stagger"]').forEach(parent => {
      const children = parent.querySelectorAll('[data-scroll-child]');
      if (!children.length) return;

      gsap.fromTo(children,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: parent,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ─ Line grow ─
    gsap.utils.toArray('[data-scroll="line"]').forEach(el => {
      gsap.fromTo(el,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ─ Clip reveal (images) ─
    gsap.utils.toArray('[data-scroll="clip-up"]').forEach(el => {
      gsap.fromTo(el,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ─ Parallax on hero text ─
    const heroText = document.querySelector('[data-parallax-hero]');
    if (heroText) {
      gsap.to(heroText, {
        y: 120,
        ease: 'none',
        scrollTrigger: {
          trigger: heroText,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    }

    // ─ Project cards in carousel — scale up on scroll into view ─
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.fromTo(card,
        { scale: 0.92, opacity: 0.5 },
        {
          scale: 1, opacity: 1,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            start: 'left 90%',
            end: 'left 50%',
            scrub: false,
            toggleActions: 'play none none none',
            // Use horizontal container as scroller if needed
            containerAnimation: undefined,
          },
        }
      );
    });

    // ─ Archive rows stagger ─
    const archiveRows = gsap.utils.toArray('[data-archive-row]');
    if (archiveRows.length) {
      gsap.fromTo(archiveRows,
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: archiveRows[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }

  // ────────────────────────────────────────
  // 6. CAROUSEL
  // ────────────────────────────────────────
  function initCarousel() {
    const carousel = document.getElementById('projectCarousel');
    const currentSlideEl = document.getElementById('currentSlide');
    if (!carousel || !currentSlideEl) return;

    const cards = carousel.querySelectorAll('.project-card');

    carousel.addEventListener('scroll', () => {
      const cardWidth = cards[0]?.offsetWidth || 400;
      const index = Math.round(carousel.scrollLeft / (cardWidth + 24)) + 1;
      currentSlideEl.textContent = Math.min(index, cards.length);
    });
  }

  // ────────────────────────────────────────
  // 7. HEADER BLUR ON SCROLL
  // ────────────────────────────────────────
  function initHeaderBlur() {
    const header = document.querySelector('header');
    if (!header || typeof gsap === 'undefined') return;

    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => {
        if (self.direction === 1 && window.scrollY > 80) {
          header.style.backgroundColor = 'rgba(255, 255, 255, 0.78)';
          header.style.backdropFilter = 'blur(12px)';
          header.style.WebkitBackdropFilter = 'blur(12px)';
          header.style.borderBottom = '1px solid rgba(8, 8, 10, 0.06)';
        } else if (window.scrollY <= 80) {
          header.style.backgroundColor = 'transparent';
          header.style.backdropFilter = 'none';
          header.style.WebkitBackdropFilter = 'none';
          header.style.borderBottom = 'none';
        }
      }
    });
  }

  // ────────────────────────────────────────
  // 8. PROJECT PAGE ANIMATIONS
  // ────────────────────────────────────────
  function initProjectPageAnimations() {
    if (typeof gsap === 'undefined') return;

    const projectPage = document.querySelector('[data-project-page]');
    if (!projectPage) return;

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // Breadcrumb
    const breadcrumb = projectPage.querySelector('[data-project-breadcrumb]');
    if (breadcrumb) {
      tl.fromTo(breadcrumb, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);
    }

    // Project number + category
    const meta = projectPage.querySelector('[data-project-meta]');
    if (meta) {
      tl.fromTo(meta, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.1);
    }

    // Title — split by character for stagger
    const title = projectPage.querySelector('[data-project-title]');
    if (title) {
      tl.fromTo(title, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.2);
    }

    // Tags
    const tags = projectPage.querySelectorAll('[data-project-tag]');
    if (tags.length) {
      tl.fromTo(tags,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 },
        0.5
      );
    }

    // Hero image — clip reveal
    const heroImg = projectPage.querySelector('[data-project-hero]');
    if (heroImg) {
      tl.fromTo(heroImg,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.4 },
        0.6
      );
    }
  }

  // ────────────────────────────────────────
  // 9. MAGNETIC BUTTONS (hover effect)
  // ────────────────────────────────────────
  function initMagneticButtons() {
    if (typeof gsap === 'undefined') return;

    // Any element with data-magnetic will "pull" toward cursor on hover
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0, y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }

  // ────────────────────────────────────────
  // 10. SHUFFLE TEXT EFFECT (Rylan-style)
  // ────────────────────────────────────────
  function initShuffle() {
    document.querySelectorAll('[data-shuffle-load="single"]').forEach(el => {
      const original = el.textContent.trim();
      if (!original) return;
      if (el.hasAttribute('data-shuffle-lock')) lockWidth(el, original);
      waitForVisible(el, () => shuffleTo(el, original, 50));
    });

    // 10b. data-shuffle="button" — scramble on hover/leave
    document.querySelectorAll('[data-shuffle="button"]').forEach(container => {
      const text = container.querySelector('[data-shuffle="text"]');
      if (!text) return;
      const original = text.textContent.trim();
      const hoverText = text.getAttribute('data-shuffle-hover') || original;
      lockWidth(text, original, hoverText);
      text.textContent = original;
      let hovering = false;
      container.addEventListener('mouseenter', () => {
        if (hovering) return;
        hovering = true;
        shuffleTo(text, hoverText, 35);
      });
      container.addEventListener('mouseleave', () => {
        if (!hovering) return;
        hovering = false;
        shuffleTo(text, original, 35);
      });
    });
  }

})();
