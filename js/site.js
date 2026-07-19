/* Nav scroll */
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* Mobile nav toggle */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function setMenuOpen(open) {
  if (!navToggle || !navLinks) return;
  navLinks.classList.toggle('open', open);
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (mainNav) mainNav.classList.toggle('menu-open', open);
  document.body.classList.toggle('menu-open', open);
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    setMenuOpen(!navLinks.classList.contains('open'));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });
}

/* Fade-up observer */
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-up').forEach((el) => obs.observe(el));

/* Portfolio card click-throughs */
document.querySelectorAll('.portfolio .product-card, .featured .product-card').forEach((card) => {
  const link = card.querySelector('.pc-name[href]');
  if (!link) return;
  card.addEventListener('click', (event) => {
    const clickedLink = event.target.closest('.pc-name[href]');
    if (clickedLink) return;
    window.open(link.href, '_blank');
  });
});
