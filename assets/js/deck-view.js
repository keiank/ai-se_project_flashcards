import { hexToString, removeColorClasses } from "./colorMap.js";

/**
 * Renders the deck view for a given deck object.
 * @param {Object} deck - The deck object to render.
 */
export function renderDeckView(deck) {
  const page = document.querySelector(".page");
  const deckSection = document.querySelector("#deck-view");
  const main = document.querySelector("main");
  const homeSection = document.querySelector("#home");
  const carouselSection = document.querySelector("#carousel");
  const notFoundSection = document.querySelector("#not-found");

  homeSection.style.display = "none";
  deckSection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";

  const carouselStyle = "page__main-content_type_carousel";
  main.classList.remove(carouselStyle);

  page.classList.remove("page_no-mobile-bar");

  const title = deckSection.querySelector(".gallery__title");
  title.textContent = deck.name;

  const galleryList = deckSection.querySelector(".gallery__list");
  galleryList.textContent = "";
  const template = document.querySelector(".flashcard-template");
  const cardColor = hexToString(deck.color);
  deck.cards.forEach((card) => {
    const cardEl = template.content.querySelector(".card").cloneNode(true);
    removeColorClasses(cardEl);
    cardEl.classList.add(`card_color_${cardColor}`);
    const cardTitle = cardEl.querySelector(".card__title");
    cardTitle.textContent = card.question;

    const flipBtn = cardEl.querySelector(".card__flip-btn");
    let flipped = false;
    flipBtn.onclick = () => {
      flipped = !flipped;
      cardTitle.textContent = flipped ? card.answer : card.question;
      removeColorClasses(cardEl);
      cardEl.classList.add(
        flipped ? "card_color_white" : `card_color_${cardColor}`,
      );
    };

    const deleteBtn = cardEl.querySelector(".card__delete-btn");
    deleteBtn.onclick = () => {
      cardEl.remove();
    };

    galleryList.prepend(cardEl);
  });
}
