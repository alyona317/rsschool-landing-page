import 'modern-normalize/modern-normalize.css';
import '../scss/main.scss';
import { renderDirectionCards } from './catalog.js';
import {addTagClickHandler } from './catalog.js';
import { initTeachersCarousel } from './teachers.js';

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
  button.addEventListener('click', () => {
    const newTheme = currentThemeSetting === 'dark' ? 'light' : 'dark';
    const newText = newTheme === 'dark' ? "Change to light theme" : "Change to dark theme";
    button.setAttribute("aria-lable", newText);
    document.querySelector("html").setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    currentThemeSetting = newTheme;
  })

  initTeachersCarousel();
  addTagClickHandler();
  addTabClickHandler();

})

const hamburgerButton = document.querySelector('.hamburger-button');
const menuItems = document.querySelector('.menu-items');

hamburgerButton.addEventListener('click', () => {

  hamburgerButton.classList.toggle('active');
  menuItems.classList.toggle('active');

  const isExpanded = hamburgerButton.classList.contains('active');
  hamburgerButton.setAttribute('aria-expanded', isExpanded);
  if (isExpanded) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

document.addEventListener('click', (event) => {
  const isClickInside = hamburgerButton.contains(event.target) ||
    menuItems.contains(event.target);

  if (!isClickInside && menuItems.classList.contains('active')) {
    hamburgerButton.classList.remove('active');
    menuItems.classList.remove('active');
    hamburgerButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; 
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hamburgerButton.classList.remove('active');
    menuItems.classList.remove('active');
    hamburgerButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; 
  }
});


//direction tags

const addTabClickHandler = async function () {
  const tab = document.querySelector(".directions__tabs");
  if (!tab) return;

  const response = await fetch("/catalog.json");
  const data = await response.json();

  tab.addEventListener("click", (e) => {
    if (e.target.classList.contains("directions__tab")) {
      let clickedTab = e.target;

      removeSelectedTabs();
      selectedTab(clickedTab);
      const directionName = document.querySelector('.directions__name');
      const directionDescription = document.querySelector('.directions__description');

      const directionIndex = data.directions_descriptions.findIndex(item => item.id === e.target.textContent.trim().toLowerCase());
      if (directionIndex === -1) return;

      directionName.textContent = clickedTab.textContent.trim();
      directionDescription.textContent = data.directions_descriptions[directionIndex].description;
    }
  });
};
const removeSelectedTabs = function () {
  const tabs = document.querySelectorAll(".directions__tab");
  tabs.forEach((tab) => tab.classList.remove("is-active"));
};

const selectedTab = function (clickedTab) {
  clickedTab.classList.add("is-active");
};
