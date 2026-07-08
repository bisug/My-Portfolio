/**
 * scroll.js
 * - Handles scroll progress bar
 * - Triggers .reveal animations via IntersectionObserver
 * - Highlights active nav link
 */

const ScrollEffects = (() => {

  function initScrollHandler() {
    const progressBar = document.getElementById('scrollProgress');
    
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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.getAttribute('id'));
        }
      });
    }, {
      rootMargin: '-50% 0px -50% 0px'
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
