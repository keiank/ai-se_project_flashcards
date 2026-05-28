import { fetchedDecks, getDeckByID, removeDeckByID } from "./decks.js";
import { hexToString, removeColorClasses } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView, makeNewCard } from "./deck-view.js";
import { confirmDeletion } from "./modal.js";
import { renderNewDeckView } from "./new-deck-view.js";
import { getDecks, deleteDeck } from "./api.js";
import { showError } from "./new-deck-view.js";

const page = document.querySelector(".page");
const homeSection = document.querySelector("#home");
const deckSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const newDeckSection = document.querySelector("#new-deck-view");
const aboutSection = document.querySelector("#about");
const notFoundSection = document.querySelector("#not-found");
const modal = document.querySelector(".modal");

const sections = [
  homeSection,
  deckSection,
  carouselSection,
  newDeckSection,
  aboutSection,
  notFoundSection,
];

/**
 * Creates a DOM element for a deck card based on the provided deck object.
 * Sets up the card's title, color, card count, and delete functionality.
 * @param {Object} deck - The deck object
 * @param {string} deck._id - The unique identifier of the deck
 * @param {string} deck.name - The name of the deck
 * @param {string} deck.color - The hex color code for the deck
 * @param {Array<Object>} deck.cards - Array of cards in the deck
 * @returns {Element} The created deck card element
 */
function createDeckEl(deck) {
  const cardTemplate = document.querySelector(".card-template");
  const newDeck = cardTemplate.content.querySelector(".card").cloneNode(true);

  // Set deck title
  const title = newDeck.querySelector(".card__title");
  title.textContent = deck.name;
  // Set deck color
  const cardColor = hexToString(deck.color);
  newDeck.classList.add(`card_color_${cardColor}`);
  // Set deck card count
  const cardCount = newDeck.querySelector(".card__count");
  cardCount.textContent = `${deck.cards.length} cards`;
  // Link to deck view
  const cardLink = newDeck.querySelector(".card__link");
  cardLink.href = `#deck/${deck._id}`;

  // Delete deck from DOM when delete button clicked
  const deleteBtn = newDeck.querySelector(".card__delete-btn");
  deleteBtn.addEventListener("click", () => {
    confirmDeletion("deck", () => {
      deleteDeck(deck._id)
        .then(() => {
          newDeck.remove();
          removeDeckByID(deck._id);
        })
        .catch(() => {
          showError("Error: Unable to delete deck");
        });
    });
  });

  return newDeck;
}

/**
 * Renders a deck element in the gallery list on the home section.
 * @param {Object} deck - The deck object to render
 * @returns {void}
 */
function renderDeckEl(deck) {
  const galleryList = homeSection.querySelector(".gallery__list");
  const card = createDeckEl(deck);
  galleryList.prepend(card);
}

/**
 * Shows a specific section and hides all other sections.
 * Applies appropriate styling classes based on the section type.
 * @param {Element} section - The section element to display
 * @param {string} displayValue - The CSS display value (e.g., 'block', 'flex', 'none')
 * @returns {void}
 */
function showView(section, displayValue) {
  for (const sec of sections) {
    sec.style.display = "none";
  }

  const main = document.querySelector("main");
  const carouselStyle = "page__main-content_type_carousel";
  if (section === carouselSection) {
    main.classList.add(carouselStyle);
    page.classList.add("page_no-mobile-bar");
  } else if (section === newDeckSection || section === aboutSection) {
    main.classList.add("page__main-content_type_centered");
  } else {
    main.classList.remove(carouselStyle);
    main.classList.remove("page__main-content_type_centered");
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
  window.location.hash = `carousel/${currentDeck._id}`;
};

const homeNewDeckBtn = homeSection.querySelector(".gallery__new-card-btn");
homeNewDeckBtn.onclick = () => {
  window.location.hash = "#new-deck-view";
};

const deckViewNewCardBtn = deckSection.querySelector(
  ".gallery__new-card-btn_location_deck-view",
);
deckViewNewCardBtn.addEventListener("click", () => {
  const galleryList = deckSection.querySelector(".gallery__list");
  const newCardBtn = makeNewCard(currentDeck, null);
  galleryList.append(newCardBtn);
});

/**
 * Routes to the appropriate view based on the current URL hash.
 * Handles navigation between home, deck, carousel, new-deck, and about views.
 * @returns {void}
 */
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
    renderNewDeckView();
    page.classList.remove("page_no-mobile-bar");
  } else if (hash.startsWith("about")) {
    showView(aboutSection, "block");
  } else {
    showView(notFoundSection, "block");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      fetchedDecks.push(...decks);
      decks.forEach(renderDeckEl);
    })
    .catch(() => {
      showError("Error: Unable to render decks.");
    })
    .finally(router);
});
window.addEventListener("hashchange", router);
