import { gallery, getDeckByID } from "./gallery.js";
import { hexToString, removeColorClasses } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { confirmDeletion } from "./modal.js";

const page = document.querySelector(".page");
const homeSection = document.querySelector("#home");
const deckSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const modal = document.querySelector(".modal");

const sections = [homeSection, deckSection, carouselSection, notFoundSection];

const main = document.querySelector("main");
const carouselStyle = "page__main-content_type_carousel";

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
    confirmDeletion(() => newCard.remove());
  });

  return newCard;
}

function renderDeckEl(item) {
  const galleryList = homeSection.querySelector(".gallery__list");
  const card = createDeckEl(item);
  galleryList.prepend(card);
}

gallery.forEach(renderDeckEl);

function showView(section, displayValue) {
  for (const sec of sections) {
    sec.style.display = "none";
  }
  if (section === carouselSection) {
    main.classList.add(carouselStyle);
    page.classList.add("page_no-mobile-bar");
  } else {
    main.classList.remove(carouselStyle);
    page.classList.remove("page_no-mobile-bar");
  }
  // edge case to remove gradient on mobile:
  if (section == notFoundSection) {
    page.classList.add("page_no-mobile-bar");
  }
  section.style.display = displayValue;
}

const practiceBtn = deckSection.querySelector(".gallery__practice-btn");
practiceBtn.onclick = () => {
  window.location.hash = `carousel/${currentDeck.id}`;
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
  } else {
    showView(notFoundSection, "block");
  }
}

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
