export async function renderDirectionCards() {
  const grid = document.querySelector(".direction-grid__inner");
  if (!grid) return;

  const response = await fetch("/catalog.json");
  const data = await response.json();

  grid.innerHTML = data.directions
    .map(
      (direction) =>
        `           <article class="direction-card" data-category="${direction.category}">
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
}

export const addTagClickHandler = function () {
  const tag = document.querySelector(".category-tabs__inner");

  tag.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-tabs__btn")) {
      console.log("works");

      let clickedTag = e.target;
      removeSelectedTags();
      selectedTag(clickedTag);
      if (e.target.innerText.toLowerCase() === "все") {
        showAllCards();
      } else {
        filterCardBySelectorTag(e.target.innerText);
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
