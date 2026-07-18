/**
 * main.js
 * Entry point. Initialises all modules after DOM is ready.
 */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Navigation Logic (Hamburger Menu) ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  // ---- Copy email to clipboard ----
  const copyEmail = document.getElementById('copyEmail');
  if (copyEmail) {
    const status = copyEmail.querySelector('.contact__copy-status');
    copyEmail.addEventListener('click', async () => {
      const email = copyEmail.getAttribute('data-email');
      try {
        await navigator.clipboard.writeText(email);
        if (status) {
          status.textContent = 'Copied';
          setTimeout(() => { status.textContent = ''; }, 2000);
        }
      } catch (e) {
        if (status) status.textContent = 'Copy failed';
      }
    });
  }

  // ---- Theme toggle (dark / light) ----
  // (Manual toggle removed; dark mode follows the OS preference via CSS.)

  if (navToggle && navLinks) {
    // Element that had focus before the menu opened (to restore on close)
    let lastFocused = null;

    const focusable = () =>
      [...navLinks.querySelectorAll('a'), navToggle]
        .filter(el => el.offsetParent !== null);

    const trapFocus = (e) => {
      if (e.key !== 'Tab' || !navLinks.classList.contains('open')) return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const toggleMenu = (forceClose = false) => {
      const isOpen = forceClose ? false : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpen);
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      syncToTop();

      if (isOpen) {
        lastFocused = document.activeElement;
        const firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
      } else if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
        lastFocused = null;
      }
    };

    navToggle.addEventListener('click', () => toggleMenu());

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(true);
      else trapFocus(e);
    });
  }

  // ---- Back-to-top button ----
  const toTop = document.getElementById('toTop');
  // Hide the FAB while the full-screen mobile menu is open so it doesn't
  // overlap the overlay (it sits at z-index 1050, above the menu's 999).
  const syncToTop = () => {
    if (!toTop) return;
    if (navLinks && navLinks.classList.contains('open')) {
      toTop.setAttribute('hidden', '');
    } else if (window.pageYOffset > 600) {
      toTop.removeAttribute('hidden');
    }
  };
  if (toTop) {
    let toTopTicking = false;
    const onToTopScroll = () => {
      if (window.pageYOffset > 600) toTop.removeAttribute('hidden');
      else toTop.setAttribute('hidden', '');
      toTopTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!toTopTicking) {
        requestAnimationFrame(onToTopScroll);
        toTopTicking = true;
      }
    }, { passive: true });
    syncToTop();
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
    onToTopScroll();
  }

  // ---- Navbar Scroll Effect: shadow on scroll + hide on scroll-down / show on scroll-up ----
  if (navbar) {
    let lastY = window.pageYOffset;
    let ticking = false;
    function onNavScroll() {
      const y = window.pageYOffset;
      const goingDown = y > lastY;
      if (y <= 0) {
        navbar.classList.remove('nav--hidden');
        navbar.style.boxShadow = 'none';
      } else {
        navbar.style.boxShadow = '0 10px 30px -10px var(--nav-shadow)';
        // Hide only once past the header; never while the mobile menu is open.
        if (goingDown && y > 80 && (!navLinks || !navLinks.classList.contains('open'))) {
          navbar.classList.add('nav--hidden');
        } else if (!goingDown) {
          navbar.classList.remove('nav--hidden');
        }
      }
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(onNavScroll);
        ticking = true;
      }
    }, { passive: true });
    onNavScroll();
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
        navbar.classList.remove('nav--hidden');
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

});
