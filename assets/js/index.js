import { decks, getDeckByID } from "./decks.js";
import { hexToString } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";

function createDeckEl(item) {
  const deckTemplate = document.querySelector(".deck-template");
  const newDeck = deckTemplate.content.querySelector(".deck").cloneNode(true);

  // Set deck title
  const title = newDeck.querySelector(".deck__title");
  title.textContent = item.name;
  // Set deck color
  const deckColor = hexToString(item.color);
  newDeck.classList.add(`deck_color_${deckColor}`);
  // Set deck card count
  const cardCount = newDeck.querySelector(".deck__count");
  cardCount.textContent = `${item.cards.length} cards`;
  // Link to cards in deck
  const deckLink = newDeck.querySelector(".deck__link");
  deckLink.href = `#carousel/${item.id}`;
  // Delete deck from DOM when delete button clicked
  const deleteBtn = newDeck.querySelector(".deck__delete-btn");
  deleteBtn.addEventListener("click", (event) => {
    newDeck.remove();
  });

  return newDeck;
}

function renderDeckEl(item) {
  const deckList = document.querySelector(".decks__list");
  const deck = createDeckEl(item);
  deckList.prepend(deck);
}

decks.forEach(renderDeckEl);

const homeSection = document.querySelector("#home");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const main = document.querySelector("main");
const carouselStyle = "page__main-content_type_carousel";

function renderHomeView() {
  homeSection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  main.classList.remove(carouselStyle);
}

function renderNotFoundView() {
  homeSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "block";
  main.classList.remove(carouselStyle);
}

function displayCarouselSection() {
  homeSection.style.display = "none";
  carouselSection.style.display = "flex";
  notFoundSection.style.display = "none";
  main.classList.add(carouselStyle);
}

function router() {
  const hash = window.location.hash.slice(1) || "home";
  if (hash === "home" || hash === "") {
    renderHomeView();
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
