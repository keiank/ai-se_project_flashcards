import { getDeckByID } from "./gallery.js";
import { hexToString, removeColorClasses } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { confirmDeletion } from "./modal.js";
import { disableSubmitBtn } from "./new-deck-view.js";
import { getDecks } from "./api.js";
import { showError } from "./new-deck-view.js";

const page = document.querySelector(".page");
const homeSection = document.querySelector("#home");
const deckSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const newDeckSection = document.querySelector("#new-deck-view");
const notFoundSection = document.querySelector("#not-found");
const modal = document.querySelector(".modal");

const sections = [
  homeSection,
  deckSection,
  carouselSection,
  newDeckSection,
  notFoundSection,
];

function createDeckEl(item) {
  const cardTemplate = document.querySelector(".card-template");
  const newCard = cardTemplate.content.querySelector(".card").cloneNode(true);

  // Set deck title
  const title = newCard.querySelector(".card__title");
  title.textContent = item.name;
  // Set deck color
  const cardColor = hexToString(item.color);
  newCard.classList.add(`card_color_${cardColor}`);
  // Set deck card count
  const cardCount = newCard.querySelector(".card__count");
  cardCount.textContent = `${item.cards.length} cards`;
  // Link to deck view
  const cardLink = newCard.querySelector(".card__link");
  cardLink.href = `#deck/${item.id}`;

  // Delete deck from DOM when delete button clicked
  const deleteBtn = newCard.querySelector(".card__delete-btn");
  deleteBtn.addEventListener("click", () => {
    confirmDeletion("deck", () => newCard.remove());
  });

  return newCard;
}

function renderDeckEl(item) {
  const galleryList = homeSection.querySelector(".gallery__list");
  const card = createDeckEl(item);
  galleryList.prepend(card);
}

function showView(section, displayValue) {
  for (const sec of sections) {
    sec.style.display = "none";
  }

  const main = document.querySelector("main");
  const carouselStyle = "page__main-content_type_carousel";
  if (section === carouselSection) {
    main.classList.add(carouselStyle);
    page.classList.add("page_no-mobile-bar");
  } else if (section === newDeckSection) {
    main.classList.add("page__main-content_type_new-deck-view");
  } else {
    main.classList.remove(carouselStyle);
    main.classList.remove("page__main-content_type_new-deck-view");
    page.classList.remove("page_no-mobile-bar");
  }
  // edge case to remove gradient on mobile:
  if (section == notFoundSection) {
    page.classList.add("page_no-mobile-bar");
  }
  section.style.display = displayValue;
}

let currentDeck = null;
const practiceBtn = deckSection.querySelector(".gallery__practice-btn");
practiceBtn.onclick = () => {
  window.location.hash = `carousel/${currentDeck.id}`;
};

const homeNewDeckBtn = homeSection.querySelector(".gallery__new-card-btn");
homeNewDeckBtn.onclick = () => {
  window.location.hash = "#new-deck-view";
};

function router() {
  const hash = window.location.hash.slice(1) || "home";
  if (hash === "home" || hash === "") {
    showView(homeSection, "block");
  } else if (hash.startsWith("deck/")) {
    const deckID = hash.split("/")[1];
    const deck = getDeckByID(deckID);
    if (deck) {
      page.classList.remove("page_no-mobile-bar");
      showView(deckSection, "block");
      renderDeckView(deck);
      currentDeck = deck;
    } else {
      showView(notFoundSection, "block");
    }
  } else if (hash.startsWith("carousel/")) {
    showView(carouselSection, "flex");
    const deckID = hash.split("/")[1];
    const deck = getDeckByID(deckID);
    renderCarouselView(deck);
  } else if (hash.startsWith("new-deck-view")) {
    showView(newDeckSection, "block");
    disableSubmitBtn();
    page.classList.remove("page_no-mobile-bar");
  } else {
    showView(notFoundSection, "block");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      decks.forEach(renderDeckEl);
    })
    .catch(() => {
      showError("Error: Unable to render decks.");
    })
    .finally(router);
});
window.addEventListener("hashchange", router);
