/**
 * main.js
 * Entry point. Initialises all modules after DOM is ready.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navigation Logic (Hamburger Menu) ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    const toggleMenu = (forceClose = false) => {
      const isOpen = forceClose ? false : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpen);
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => toggleMenu());

    // Close menu on link click or Escape key
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(true);
    });
  }

  // ---- Initialize Modules ----
  // Typewriter is visual and high-priority for the hero section
  if (typeof Typewriter !== 'undefined') Typewriter.init();
  
  // ScrollEffects sets up the observer and initial scroll state
  if (typeof ScrollEffects !== 'undefined') ScrollEffects.init();

  // ---- Non-Critical Initialization ----
  // Use requestIdleCallback to avoid blocking the main thread for non-visual helpers
  const initNonCritical = () => {
    // Universal Helper Logic (Smooth Scroll)
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(initNonCritical);
  } else {
    setTimeout(initNonCritical, 100);
  }

});
