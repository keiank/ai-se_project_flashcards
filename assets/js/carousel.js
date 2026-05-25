import { hexToString, removeColorClasses } from "./colorMap.js";

/**
 * Renders a carousel view for studying a deck of flashcards.
 * Sets handlers for card navigation, flipping, and arrow button states.
 * @param {Object} deck - The deck object containing cards to display
 * @param {string} deck.name - The name of the deck
 * @param {string} deck.color - The hex color code for the deck
 * @param {Array<Object>} deck.cards - Array of card objects with question and answer properties
 */
function renderCarouselView(deck) {
  let currentIndex = 0;
  let showingQuestion = true;
  const cards = deck.cards;

  const carouselEl = document.querySelector(".carousel");
  const cardEl = carouselEl.querySelector(".carousel__card");
  const leftBtn = carouselEl.querySelector(".carousel__btn_type_left");
  const rightBtn = carouselEl.querySelector(".carousel__btn_type_right");
  const flipBtn = carouselEl.querySelector(".carousel__btn_type_flip");
  const cardTextEl = carouselEl.querySelector(".carousel__card-text");

  /**
   * Updates the carousel's title to match the deck's name.
   * @param {number} - current card number displayed.
   */
  function updateTitleString(cardN) {
    const deckTitleEl = carouselEl.querySelector(".carousel__title");
    deckTitleEl.textContent = `${deck.name} · ${cardN}/${cards.length}`;
  }

  removeColorClasses(cardEl);
  const deckColor = hexToString(deck.color);
  cardEl.classList.add(`carousel__card_color_${deckColor}`);

  /**
   * Disables a button on the carousel view.
   * @param {Element} - the button html DOM element to disable.
   */
  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }

  /**
   * Enables a button on the carousel view.
   * @param {Element} - the button html DOM element to enable.
   */
  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

  /**
   * Ensures buttons are disabled when we reach the beginning and end
   * of the carousel.
   */
  function updateArrows() {
    if (currentIndex === 0) {
      disableButton(leftBtn);
    } else {
      enableButton(leftBtn);
    }

    if (currentIndex === cards.length - 1) {
      disableButton(rightBtn);
    } else {
      enableButton(rightBtn);
    }
  }

  /**
   * Keeps the carousel view current with after each event
   * on the UI.
   */
  function updateDisplay() {
    if (!showingQuestion) {
      cardTextEl.textContent = cards[currentIndex].answer;
      cardEl.classList.add("carousel__card_color_white");
    } else {
      cardTextEl.textContent = cards[currentIndex].question;
      cardEl.classList.remove("carousel__card_color_white");
    }
    updateTitleString(currentIndex + 1);
    updateArrows();
  }

  rightBtn.addEventListener("click", () => {
    if (currentIndex < cards.length - 1) {
      showingQuestion = true;
      currentIndex++;
      updateDisplay();
    }
  });

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      showingQuestion = true;
      currentIndex--;
      updateDisplay();
    }
  });

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  });

  updateDisplay();
}

export { renderCarouselView };
