/**
 * main.js
 * Entry point. Initialises all modules after DOM is ready.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navigation Logic (Hamburger Menu) ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

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

  // ---- Navbar Scroll Effect ----
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 0) {
      navbar.style.boxShadow = 'none';
    } else {
      navbar.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.1)';
    }
    lastScroll = currentScroll;
  }, { passive: true });

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
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Hover Sound / Haptic Simulation (Optional & Subtle) ----
  // Can be added here for a more "premium" feel if requested,
  // but for now we focus on visual precision.

});
