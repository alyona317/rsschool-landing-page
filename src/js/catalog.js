export async function renderDirectionCards(){
    const grid =document.querySelector(".direction-grid__inner");
    if (!grid) return;

    const response = await fetch("/catalog.json");
    const data = await response.json();

    grid.innerHTML = data.directions.map(direction =>

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
        </article>`
      ).join("");


}
