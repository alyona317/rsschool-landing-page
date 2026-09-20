import 'modern-normalize/modern-normalize.css';
import '../scss/main.scss';
import { renderDirectionCards } from './catalog.js';

document.addEventListener('DOMContentLoaded', () => {
  renderDirectionCards();
 function highlightActiveNavLink() {
  const links = document.querySelectorAll('.site-header__link');
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';

  links.forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/index.html';
    link.classList.toggle('is-active', linkPath === currentPath);
  });
}

document.addEventListener('DOMContentLoaded', highlightActiveNavLink);

   const button = document.querySelector("[data-theme-toggle]")
    button.addEventListener('click', ()=>{
        const newTheme = currentThemeSetting === 'dark' ? 'light' : 'dark';
        const newText = newTheme === 'dark' ? "Change to light theme" : "Change to dark theme";
        button.setAttribute("aria-lable", newText);
        document.querySelector("html").setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        currentThemeSetting = newTheme;
    })

})

// Получаем необходимые элементы
const hamburgerButton = document.querySelector('.hamburger-button');
const menuItems = document.querySelector('.menu-items');

// Обработчик клика по кнопке-гамбургеру
hamburgerButton.addEventListener('click', () => {
// Переключаем активные классы для кнопки и меню
hamburgerButton.classList.toggle('active');
menuItems.classList.toggle('active');

// Обновляем атрибут aria-expanded для доступности
const isExpanded = hamburgerButton.classList.contains('active');
hamburgerButton.setAttribute('aria-expanded', isExpanded);
});

// Закрываем меню при клике вне его области
document.addEventListener('click', (event) => {
const isClickInside = hamburgerButton.contains(event.target) || 
menuItems.contains(event.target);

if (!isClickInside && menuItems.classList.contains('active')) {
hamburgerButton.classList.remove('active');
menuItems.classList.remove('active');
hamburgerButton.setAttribute('aria-expanded', 'false');
}
});


