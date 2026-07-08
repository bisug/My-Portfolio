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

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(true);
    });
  }

  // ---- Initialize Scroll Effects ----
  if (typeof ScrollEffects !== 'undefined') ScrollEffects.init();

  // ---- Smooth Scroll ----
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

});
