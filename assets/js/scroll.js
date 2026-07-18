/**
 * scroll.js
 * - Handles scroll progress bar
 * - Triggers .reveal animations via IntersectionObserver
 * - Highlights active nav link
 * - Smooth Parallax for Hero
 */

const ScrollEffects = (() => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initScrollHandler() {
    const progressBar = document.getElementById('scrollProgress');
    const heroName = document.querySelector('.hero__name');
    
    let ticking = false;
    let cachedHeight = 0;
    let cachedViewportHeight = 0;

    function updateDimensions() {
      cachedHeight = document.documentElement.scrollHeight;
      cachedViewportHeight = document.documentElement.clientHeight;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        
        // Progress bar
        if (progressBar) {
          const depth = cachedHeight - cachedViewportHeight;
          progressBar.style.width = (depth > 0 ? (scrollY / depth) * 100 : 0) + '%';
        }

        // Subtle Hero Parallax (skipped when the user prefers reduced motion)
        if (heroName && !reduceMotion && scrollY < cachedViewportHeight) {
          heroName.style.transform = `translateY(${scrollY * 0.15}px)`;
        }
        
        ticking = false;
      });
    }

    let resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDimensions, 100);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    updateDimensions();
    onScroll();
  }

  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // Safety net: if IntersectionObserver is unsupported or never fires (e.g. a
    // section already in view at load on an odd browser), reveal everything
    // after a short delay so content can never get stuck invisible.
    let revealed = false;
    const revealAll = () => {
      if (revealed) return;
      revealed = true;
      items.forEach((el) => el.classList.add('visible'));
    };

    if (!('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // one-time reveal
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px' // Trigger slightly before it hits the viewport
      }
    );

    items.forEach((el) => {
      observer.observe(el);
    });

    // Fallback in case the observer never reports (rare engine quirks).
    setTimeout(revealAll, 2500);
  }

  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const setActive = (id) => {
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    // A thin horizontal band ~40% down the viewport. A section is "active" when
    // it crosses that band. Using isIntersecting (not a ratio threshold) means
    // even sections taller than the viewport activate correctly as you scroll
    // through them — the old 0.5-ratio rule silently failed on tall sections.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.getAttribute('id'));
        }
      });
    }, {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
  }

  function init() {
    initScrollHandler();
    initReveal();
    initActiveNav();
  }

  return { init };
})();
