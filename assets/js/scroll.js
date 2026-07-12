/**
 * scroll.js
 * - Handles scroll progress bar
 * - Triggers .reveal animations via IntersectionObserver
 * - Highlights active nav link
 * - Smooth Parallax for Hero
 */

const ScrollEffects = (() => {

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

        // Subtle Hero Parallax
        if (heroName && scrollY < cachedViewportHeight) {
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // We keep observing for potential re-entry animations if desired,
            // but for Swiss style, one-time reveal is cleaner.
            observer.unobserve(entry.target);
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setActive(entry.target.getAttribute('id'));
        }
      });
    }, {
      threshold: [0.1, 0.5, 0.9],
      rootMargin: '-20% 0px -70% 0px'
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
