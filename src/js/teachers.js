export function initTeachersCarousel() {
  const track = document.querySelector('.teachers__track');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.teacher-card'));
  const controlButtons = document.querySelectorAll('.teachers__control-btn');
  const prevBtn = controlButtons[0];
  const nextBtn = controlButtons[1];
  const dotsContainer = document.querySelector('.teachers__dots');

  if (cards.length < 2) return;

  let currentIndex = 0;

  if (dotsContainer) {
    dotsContainer.innerHTML = cards
      .map(
        (_, i) =>
          `<button class="teachers__dot" type="button" role="tab" aria-label="Педагог ${i + 1}"></button>`,
      )
      .join('');
  }
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.teachers__dot')) : [];

  const getStep = () => {
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    return cards[0].getBoundingClientRect().width + gap;
  };

  const updateDots = () => {
    dots.forEach((dot, i) => {
      const isActive = i === currentIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  };

  const goTo = (index, behavior = 'smooth') => {
    currentIndex = (index + cards.length) % cards.length;
    track.scrollTo({ left: getStep() * currentIndex, behavior });
    updateDots();
  };

  prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => goTo(currentIndex, 'auto'), 150);
  });

  updateDots();
}
