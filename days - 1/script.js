const themeToggle = document.querySelector('.theme-toggle');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.textContent = isDark ? 'Terangin sih' : 'Gelapin lagi';
  });
}

const year = document.querySelector('#year');
if (year) {
  year.textContent = new Date().getFullYear();
}

if (!prefersReducedMotion.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.hero-copy, .skills .section-heading, .skill-card, .contact-box, .site-footer')
    .forEach((element) => {
      element.classList.add('reveal');
      revealObserver.observe(element);
    });
}
