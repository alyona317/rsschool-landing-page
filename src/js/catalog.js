const CARDS_PER_PAGE = 3;
let visibleCount = CARDS_PER_PAGE;
let currentCategory = "все";

export async function renderDirectionCards() {
  const grid = document.querySelector(".direction-grid__inner");
  if (!grid) return;

  const response = await fetch("/catalog.json");
  const data = await response.json();

  grid.innerHTML = data.directions
    .map(
      (direction, index) =>
        `           <article class="direction-card" data-category="${direction.category}" data-index="${index}">
          <div class="direction-card__media">
            <img src="${direction.image}" alt="${direction.name}" loading="lazy" />
          </div>
          <div class="direction-card__body">
            <h3 class="direction-card__title">${direction.name}</h3>
            <p class="direction-card__description">${direction.description}</p>
            <div class="direction-card__meta">
              <span class="direction-card__tag">${direction.duration}</span>
            </div>
          </div>
        </article>`,
    )
    .join("");
  initDirectionModal(grid, data.directions);
  initLoadMore();
  updateCardVisibility();
}

export const addTagClickHandler = function () {
  const tag = document.querySelector(".category-tabs__inner");
  if (!tag) return;

  tag.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-tabs__btn")) {
      console.log("works");

      let clickedTag = e.target;
      removeSelectedTags();
      selectedTag(clickedTag);
      currentCategory = e.target.innerText.toLowerCase();
      visibleCount = CARDS_PER_PAGE;
      if (e.target.innerText.toLowerCase() === "все") {
        showAllCards();
      } else {
        filterCardBySelectorTag(e.target.innerText);
        updateCardVisibility();
      }
    }
  });
};
const removeSelectedTags = function () {
  const tags = document.querySelectorAll(".category-tabs__btn");
  console.log(tags);
  tags.forEach((tag) => tag.classList.remove("is-active"));
};

const selectedTag = function (clickedTag) {
  clickedTag.classList.add("is-active");
};

const showAllCards = function () {
  const cards = document.querySelectorAll(".direction-card");

  cards.forEach((card) => card.classList.remove("hidden"));
  // cards.forEach((card) => card.classList.add("visible"));
};

const filterCardBySelectorTag = function (selectedTag) {
  const cards = document.querySelectorAll(".direction-card");

  cards.forEach((card) => {
    // card.classList.add("hidden");
    const cardTag = card.getAttribute("data-category");
    console.log(cardTag);

    if (cardTag.toLowerCase() === selectedTag.toLowerCase()) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
};

const initLoadMore = function () {
  const loadButton = document.querySelector(".direction-grid__more");
  if (loadButton) {
    loadButton.addEventListener("click", () => {
      visibleCount += CARDS_PER_PAGE;
      updateCardVisibility();
    });
  }
};

const updateCardVisibility = function () {
  const cards = document.querySelectorAll(".direction-card:not(.hidden)");
  let visibleIndex = 0;

  cards.forEach((card) => {
    if (visibleIndex < visibleCount) {
      card.style.display = "";
      visibleIndex++;
    } else {
      card.style.display = "none";
    }
  });

  updateLoadMoreButton(cards.length, visibleCount);
};

const updateLoadMoreButton = function (totalVisible, currentVisible) {
  const loadMoreBtn = document.querySelector(".direction-grid__more");

  if (!loadMoreBtn) return;

  if (currentVisible >= totalVisible) {
    hideLoadMoreButton();
  } else {
    loadMoreBtn.style.display = "block";
  }
};

const hideLoadMoreButton = function () {
  const loadMoreBtn = document.querySelector(".direction-grid__more");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = "none";
  }
};

window.addEventListener("resize", () => {
  updateCardVisibility();
});

const BASE_PRICE_BY_CATEGORY = {
  одиночные: 650,
  парные: 750,
  другое: 700,
};
const DEFAULT_BASE_PRICE = 650;

const COUNT_OPTIONS = {
  1: { label: "1 занятие", factor: 1 },
  4: { label: "4 занятия", factor: 0.92 },
  8: { label: "8 занятий", factor: 0.85 },
};

const TIME_OPTIONS = {
  утро: { label: "Утро", factor: 0.95 },
  вечер: { label: "Вечер", factor: 1 },
  день: { label: "Весь день", factor: 1.1 },
};

const calcPrice = function (direction, count, time) {
  const base = BASE_PRICE_BY_CATEGORY[direction.category] ?? DEFAULT_BASE_PRICE;
  const countOption = COUNT_OPTIONS[count];
  const timeOption = TIME_OPTIONS[time];
  const raw = base * count * countOption.factor * timeOption.factor;
  return Math.round(raw / 10) * 10;
};

const formatPrice = function (price) {
  return `${price.toLocaleString("ru-RU")} ₽`;
};

const initDirectionModal = function (grid, directions) {
  const overlay = document.querySelector(".modal-overlay");
  if (!overlay || !grid) return;

  const imageEl = overlay.querySelector(".modal__image");
  const titleEl = overlay.querySelector(".modal__title");
  const descriptionEl = overlay.querySelector(".modal__description");
  const tagEl = overlay.querySelector(".modal__tag");
  const summaryEl = overlay.querySelector(".modal__summary");
  const totalValueEl = overlay.querySelector(".modal__total-value");
  const countButtons = overlay.querySelectorAll("[data-count]");
  const timeButtons = overlay.querySelectorAll("[data-time]");
  const closeTriggers = overlay.querySelectorAll("[data-modal-close]");

  let currentDirection = null;
  let selectedCount = 1;
  let selectedTime = "вечер";
  let lastFocusedElement = null;

  const syncActiveButtons = function () {
    countButtons.forEach((btn) => {
      btn.classList.toggle(
        "is-active",
        Number(btn.dataset.count) === selectedCount,
      );
    });
    timeButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.time === selectedTime);
    });
  };

  const updateModalInfo = function () {
    if (!currentDirection) return;
    const price = calcPrice(currentDirection, selectedCount, selectedTime);
    totalValueEl.textContent = formatPrice(price);
    summaryEl.textContent = `${COUNT_OPTIONS[selectedCount].label} · ${TIME_OPTIONS[selectedTime].label}`;
  };

  const openModal = function (direction) {
    currentDirection = direction;
    selectedCount = 1;
    selectedTime = "вечер";

    imageEl.src = direction.image;
    imageEl.alt = direction.name;
    titleEl.textContent = direction.name;
    descriptionEl.textContent = direction.description;
    tagEl.textContent = direction.duration;

    syncActiveButtons();
    updateModalInfo();

    lastFocusedElement = document.activeElement;
    overlay.hidden = false;
    overlay.classList.add("is-open");
    document.body.classList.add("no-scroll");

    const closeBtn = overlay.querySelector(".modal__close");
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = function () {
    overlay.classList.remove("is-open");
    overlay.hidden = true;
    document.body.classList.remove("no-scroll");
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".direction-card");
    if (!card) return;
    const index = Number(card.dataset.index);
    const direction = directions[index];
    if (direction) openModal(direction);
  });

  countButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedCount = Number(btn.dataset.count);
      syncActiveButtons();
      updateModalInfo();
    });
  });

  timeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedTime = btn.dataset.time;
      syncActiveButtons();
      updateModalInfo();
    });
  });

  closeTriggers.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeModal();
    }
  });
};
