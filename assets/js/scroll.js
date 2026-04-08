/**
 * scroll.js
 * - Adds .scrolled class to nav when page is scrolled
 * - Triggers .reveal animations via IntersectionObserver
 */

const ScrollEffects = (() => {

  function initScrollHandler() {
    const nav = document.getElementById('nav');
    const heroScroll = document.querySelector('.hero__scroll');
    const progressBar = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');
    
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
        
        // Nav state
        if (nav) nav.classList.toggle('scrolled', scrollY > 40);
        
        // Hero explore button
        if (heroScroll) heroScroll.classList.toggle('hidden', scrollY > 150);
        
        // Back to top
        if (backToTop) backToTop.classList.toggle('visible', scrollY > 400);
        
        // Progress bar
        if (progressBar) {
          const depth = cachedHeight - cachedViewportHeight;
          progressBar.style.width = (depth > 0 ? (scrollY / depth) * 100 : 0) + '%';
        }
        
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      // Small debounce not strictly needed for just height-caching, but good practice
      updateDimensions();
    });

    updateDimensions(); // initial state
    onScroll(); // initial state
  }

  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => {
      observer.observe(el);
    });
  }

  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
    
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
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
