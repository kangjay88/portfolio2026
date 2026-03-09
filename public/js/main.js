// ════════════════════════════════════════════
// PORTFOLIO SITE — Main JavaScript
// Phase 1 & 2: Core interactions
// ════════════════════════════════════════════

(function () {
  'use strict';

  // ── DOM refs ──
  const hamburger = document.getElementById('hamburger');
  const navOverlay = document.getElementById('navOverlay');
  const liveClock = document.getElementById('liveClock');
  const carousel = document.getElementById('projectCarousel');
  const currentSlideEl = document.getElementById('currentSlide');

  // ── 1. Hamburger / Nav Overlay Toggle ──
  if (hamburger && navOverlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navOverlay.classList.toggle('active');

      // Prevent body scroll when overlay is open
      document.body.style.overflow = navOverlay.classList.contains('active')
        ? 'hidden'
        : '';
    });

    // Close overlay when a nav link is clicked
    navOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close overlay on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ── 2. Live Clock ──
  function updateClock() {
    if (!liveClock) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    liveClock.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── 3. Carousel Slide Counter ──
  if (carousel && currentSlideEl) {
    const cards = carousel.querySelectorAll('.project-card');

    carousel.addEventListener('scroll', () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = cards[0]?.offsetWidth || 400;
      const gap = 24; // 1.5rem = 24px
      const index = Math.round(scrollLeft / (cardWidth + gap)) + 1;
      currentSlideEl.textContent = Math.min(index, cards.length);
    });
  }

  // ── 4. Scroll-triggered Animations ──
  // Elements with [data-animate] will animate when they enter the viewport
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const animation = el.dataset.animate;
            const delay = el.dataset.delay || '';

            el.classList.add(animation);
            if (delay) el.classList.add(delay);

            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach(el => observer.observe(el));
  };

  animateOnScroll();

  // ── 5. Smooth reveal on load — remove loading state ──
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // ── 6. Header background on scroll ──
  const header = document.querySelector('header');
  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 80) {
        header.style.backgroundColor = 'rgba(8, 8, 10, 0.85)';
        header.style.backdropFilter = 'blur(12px)';
        header.style.WebkitBackdropFilter = 'blur(12px)';
      } else {
        header.style.backgroundColor = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.WebkitBackdropFilter = 'none';
      }

      lastScroll = currentScroll;
    });
  }

})();
