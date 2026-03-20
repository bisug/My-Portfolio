/**
 * scroll.js
 * - Adds .scrolled class to nav when page is scrolled
 * - Triggers .reveal animations via IntersectionObserver
 */

const ScrollEffects = (() => {
  const NAV_THRESHOLD = 40;

  function initNavScroll() {
    const nav = document.getElementById('nav');
    const heroScroll = document.querySelector('.hero__scroll');
    if (!nav) return;

    const update = () => {
      nav.classList.toggle('scrolled', window.scrollY > NAV_THRESHOLD);
      if (heroScroll) {
        heroScroll.classList.toggle('hidden', window.scrollY > 150);
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    update(); // run once on load
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

    items.forEach((el, i) => {
      // Stagger siblings that share a parent
      el.style.transitionDelay = `${(i % 6) * 80}ms`;
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
      rootMargin: '-50% 0px -50% 0px' // Trigger when section is in middle of viewport
    });

    sections.forEach(section => observer.observe(section));
  }

  function init() {
    initNavScroll();
    initReveal();
    initActiveNav();
  }

  return { init };
})();
