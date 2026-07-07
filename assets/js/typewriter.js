/**
 * typewriter.js
 * Cycles through a list of strings with a typewriter effect.
 * No dependencies.
 */

const Typewriter = (() => {
  const STRINGS = [
    'Cybersecurity Student',
    'Python Builder',
    'Network Security',
    'Always Learning',
  ];

  const SPEED_TYPE   = 60;   // ms per character typed
  const SPEED_DELETE = 35;   // ms per character deleted
  const PAUSE_AFTER  = 1800; // ms to hold full string
  const PAUSE_BEFORE = 400;  // ms before typing next

  let el, index = 0, charIndex = 0, isDeleting = false;
  let isVisible = true;

  function tick() {
    if (!isVisible) {
      setTimeout(tick, 500); // Check again later
      return;
    }

    const current = STRINGS[index];

    if (!isDeleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        index = (index + 1) % STRINGS.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(tick, isDeleting ? SPEED_DELETE : SPEED_TYPE);
  }

  function init() {
    el = document.getElementById('typewriter');
    if (!el) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = STRINGS[0];
      return;
    }

    // Pause animation when out of viewport
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    });
    observer.observe(el);

    setTimeout(tick, 800);
  }

  return { init };
})();
