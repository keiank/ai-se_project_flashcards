import { createCard, updateCard, deleteCard } from "./api.js";
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

/**
 * Creates a DOM element for a flashcard based on the provided card object.
 * Includes flip functionality to toggle between question and answer sides.
 * @param {Object} card - The card object to display
 * @param {Object} deck - Deck information
 * @param {string} deck.deckId - The ID of the parent deck
 * @param {string} deck.deckHexColor - The hex color code for the deck
 * @returns {Element} The created card element with flip and delete functionality
 */
function createCardEl(card, { deckId, deckHexColor }) {
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

  const editBtn = cardEl.querySelector(".card__edit-btn");
  editBtn.addEventListener("click", (evt) => {
    const newCardBtn = makeNewCard(
      { _id: deckId, color: deckHexColor },
      card._id,
    );
    // pre-fill with existing card's data:
    const question = newCardBtn.querySelector(".new-card-template__question");
    const answer = newCardBtn.querySelector(".new-card-template__answer");
    question.value = card.question;
    answer.value = card.answer;
    // Replace original card with editable button
    cardEl.replaceWith(newCardBtn);
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
    const newCardEl = createCardEl(card, {
      deckId: deck._id,
      deckHexColor: deck.color,
    });
    galleryList.prepend(newCardEl);
  });
}

/**
 * Toggles the card's color between the deck color and white based on the side being displayed.
 * @param {Element} cardEl - The card DOM element to update
 * @param {string} deckColor - The color name string for the deck
 * @param {boolean} questionDisplayed - Whether the question side is currently displayed
 * @returns {boolean} The negated value of questionDisplayed (the new display state)
 */
function swapCardColor(cardEl, deckColor, questionDisplayed) {
  removeColorClasses(cardEl);
  if (questionDisplayed) {
    cardEl.classList.add(`card_color_white`);
  } else {
    cardEl.classList.add(`card_color_${deckColor}`);
  }
  return !questionDisplayed;
}

/**
 * Displays a form for creating a new card in the given deck.
 * Sets up card flipping and creation functionality.
 * @param {Object} deck - the deck to add the new card to
 * @param {?string} cardId - string if editing a card, otherwise null
 * @returns {void}
 */
function makeNewCard(deck, cardId) {
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
  let handlerFunc, targetId;
  if (cardId) {
    handlerFunc = updateCard;
    targetId = cardId;
  } else {
    handlerFunc = createCard;
    targetId = deck._id;
  }
  createBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    handlerFunc(targetId, {
      question: question.value,
      answer: answer.value,
    }).then((card) => {
      const index = getDeckIndex(deck._id);
      // add to browser storage
      fetchedDecks[index].cards.push(card);
      // add deck to list of cards without reloading page
      const cardEl = createCardEl(card, {
        deckId: deck._id,
        deckHexColor: deck.color,
      });
      // remove new card button from UI
      // and replace it with the card we committed to the DB
      newCardEl.replaceWith(cardEl);
    });
  });

  return newCardEl;
}

export { renderDeckView, makeNewCard };
