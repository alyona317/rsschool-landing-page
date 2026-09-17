// Reset first, then our own styles.
import 'modern-normalize/modern-normalize.css';
import '../scss/main.scss';

// Highlight the nav link matching the current page.
function highlightActiveNavLink() {
  const links = document.querySelectorAll('.site-header__link');
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';

  links.forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/index.html';
    link.classList.toggle('is-active', linkPath === currentPath);
  });
}

document.addEventListener('DOMContentLoaded', highlightActiveNavLink);
