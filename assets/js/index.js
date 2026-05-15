import { gallery, getDeckByID } from "./gallery.js";
import { hexToString, removeColorClasses } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";

const homeSection = document.querySelector("#home");
const deckSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
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
  deleteBtn.addEventListener("click", (event) => {
    newCard.remove();
  });

  return newCard;
}

function renderDeckEl(item) {
  const galleryList = homeSection.querySelector(".gallery__list");
  const card = createDeckEl(item);
  galleryList.prepend(card);
}

gallery.forEach(renderDeckEl);

function renderHomeView() {
  homeSection.style.display = "block";
  deckSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  main.classList.remove(carouselStyle);
}

function renderNotFoundView() {
  homeSection.style.display = "none";
  deckSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "block";
  main.classList.remove(carouselStyle);
}

function displayCarouselSection() {
  homeSection.style.display = "none";
  deckSection.style.display = "none";
  carouselSection.style.display = "flex";
  notFoundSection.style.display = "none";
  main.classList.add(carouselStyle);
}

let currentDeck = null;
const practiceBtn = deckSection.querySelector(".gallery__practice-btn");
practiceBtn.onclick = () => {
  window.location.hash = `carousel/${currentDeck.id}`;
};

function router() {
  const hash = window.location.hash.slice(1) || "home";
  if (hash === "home" || hash === "") {
    renderHomeView();
  } else if (hash.startsWith("deck/")) {
    const deckID = hash.split("/")[1];
    const deck = getDeckByID(deckID);
    if (deck) {
      renderDeckView(deck);
      currentDeck = deck;
    } else {
      renderNotFoundView();
    }
  } else if (hash.startsWith("carousel/")) {
    displayCarouselSection();
    const deckID = hash.split("/")[1];
    const deck = getDeckByID(deckID);
    renderCarouselView(deck);
  } else {
    renderNotFoundView();
  }
}

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
