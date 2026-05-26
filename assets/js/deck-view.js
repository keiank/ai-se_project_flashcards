import { createCard, deleteCard } from "./api.js";
import { hexToString, removeColorClasses } from "./colorMap.js";
import { confirmDeletion } from "./modal.js";
import {
  fetchedDecks,
  getDeckByID,
  getDeckIndex,
  removeCardById,
} from "./decks.js";

const deckSection = document.querySelector("#deck-view");
const galleryList = deckSection.querySelector(".gallery__list");

function createNewCard(card, { deckId, deckHexColor }) {
  const template = document.querySelector(".flashcard-template");
  const cardEl = template.content.querySelector(".card").cloneNode(true);
  removeColorClasses(cardEl);
  const cardColor = hexToString(deckHexColor);
  cardEl.classList.add(`card_color_${cardColor}`);

  const cardTitle = cardEl.querySelector(".card__title");
  cardTitle.textContent = card.question;

  const flipBtn = cardEl.querySelector(".card__flip-btn");
  let flipped = false;
  flipBtn.addEventListener("click", () => {
    flipped = !flipped;
    cardTitle.textContent = flipped ? card.answer : card.question;
    removeColorClasses(cardEl);
    cardEl.classList.add(
      flipped ? "card_color_white" : `card_color_${cardColor}`,
    );
  });

  const deleteBtn = cardEl.querySelector(".card__delete-btn");
  deleteBtn.onclick = () => {
    confirmDeletion("card", () => {
      deleteCard(card._id)
        .then(() => {
          // remove from UI
          cardEl.remove();
          // remove from browser storage - so it doesn't reload when navigating back
          // to deck view
          removeCardById(deckId, card._id);
        })
        .catch((err) => console.error(`Error: unable to delete card ${err}`));
    });
  };

  return cardEl;
}

/**
 * Renders the deck view for a given deck object.
 * @param {Object} deck - The deck object to render.
 * @param {string} deck.name - The name of the deck
 * @param {string} deck.color - The hex color code for the deck
 * @param {Array<Object>} deck.cards - Array of card objects with question and answer properties
 */
function renderDeckView(deck) {
  const title = deckSection.querySelector(".gallery__title");
  title.textContent = deck.name;
  galleryList.textContent = "";

  deck.cards.forEach((card) => {
    const newCardEl = createNewCard(card, {
      deckId: deck._id,
      deckHexColor: deck.color,
    });
    galleryList.prepend(newCardEl);
  });
}

function swapCardColor(cardEl, deckColor, questionDisplayed) {
  removeColorClasses(cardEl);
  if (questionDisplayed) {
    cardEl.classList.add(`card_color_white`);
  } else {
    cardEl.classList.add(`card_color_${deckColor}`);
  }
  return !questionDisplayed;
}

function showNewCard(deck) {
  const newCardTemplate = document.querySelector("#new-card-template");
  const newCardEl = newCardTemplate.content
    .querySelector(".new-card-template__form")
    .cloneNode(true);
  // Initial side should be question side - deck color, question input field shown
  const cardColor = hexToString(deck.color);
  const answer = newCardEl.querySelector(".new-card-template__answer");
  const question = newCardEl.querySelector(".new-card-template__question");
  const visibleClass = "new-card-template_side_visible";
  newCardEl.classList.add(`card_color_${cardColor}`);
  question.classList.toggle(visibleClass);
  let isQuestionSide = true;

  const flipBtn = newCardEl.querySelector(".card__flip-btn");
  flipBtn.addEventListener("click", () => {
    // Show the other input field
    answer.classList.toggle(visibleClass);
    question.classList.toggle(visibleClass);
    // Toggle color between deck color and white
    isQuestionSide = swapCardColor(newCardEl, cardColor, isQuestionSide);
  });

  const createBtn = newCardEl.querySelector(".card__create-btn");
  createBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    createCard(deck._id, {
      question: question.value,
      answer: answer.value,
    }).then((card) => {
      const index = getDeckIndex(deck._id);
      // add to browser storage
      fetchedDecks[index].cards.push(card);
      // add deck to list of cards without reloading page
      const cardEl = createNewCard(card, {
        deckId: deck._id,
        deckHexColor: deck.color,
      });
      // remove new card button from UI
      // and replace it with the card we committed to the DB
      newCardEl.replaceWith(cardEl);
    });
  });

  galleryList.append(newCardEl);
}

export { renderDeckView, showNewCard };
