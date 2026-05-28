import { fetchedDecks } from "./decks.js";

const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "019e5022-c45f-74eb-b66e-869402793f89",
};

/**
 * Processes the fetch response and returns JSON data if successful.
 * Rejects the promise if the response is not ok.
 * @param {Response} res - The fetch response object
 * @returns {Promise<Object>} Promise resolving to the JSON data or rejecting with error message
 */
function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

/**
 * Adds a new deck to the database with the provided name, color, and cards.
 * @param {Object} options - The deck options
 * @param {string} options.name - The name of the deck
 * @param {string} options.color - The hex color code for the deck
 * @param {Array<Object>} options.cards - Array of card objects
 * @returns {Promise<Object>} Promise resolving to the created deck object
 */
function addDeck({ name, color, cards }) {
  const deck = { name, color, cards };
  let body;
  try {
    body = JSON.stringify(deck);
  } catch (err) {
    return Promise.reject(
      `Error: problem converting deck object to deck string - ${err}`,
    );
  }
  return fetch(`${baseUrl}/decks`, { method: "POST", headers, body }).then(
    processResponse,
  );
}

/**
 * Retrieves all decks from the database.
 * @returns {Promise<Array<Object>>} Promise resolving to an array of deck objects
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Remove the deck from DB, using its ID.
 * @param {string} deckID - the unique ID of the deck to delete.
 * @returns {Promise<Object>} Promise resolving to the deletion response from the server.
 */
function deleteDeck(deckID) {
  return fetch(`${baseUrl}/decks/${deckID}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

/**
 * Remove the card from DB, using its ID.
 * @param {string} cardID - the unique ID of the card to delete.
 * @returns {Promise<Object>} Promise resolving to the deletion response from the server.
 */
function deleteCard(cardID) {
  return fetch(`${baseUrl}/cards/${cardID}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

/**
 * Creates a new card in a specific deck with the provided question and answer.
 * @param {string} deckId - The unique ID of the deck to add the card to
 * @param {Object} card - The card information
 * @param {string} card.question - The question text for the card
 * @param {string} card.answer - The answer text for the card
 * @returns {Promise<Object>} Promise resolving to the created card object
 */
function createCard(deckId, { question, answer }) {
  let card;
  try {
    card = JSON.stringify({ question, answer });
  } catch (err) {
    return Promise.reject(`Problem creating card - ${err}`);
  }
  return fetch(`${baseUrl}/cards/${deckId}`, {
    method: "POST",
    headers,
    body: card,
  }).then(processResponse);
}

/**
 * Update the card information in the DB, using its ID.
 * @param {string} cardID - the unique ID of the card to delete.
 * @param {Object} card - the card information
 * @param {string} card.question - the question side of the card
 * @param {string} card.answer - the answer side of the card
 * @returns {Promise<Object>} Promise resolving to the deletion response from the server.
 */
function updateCard(cardID, { question, answer }) {
  let body;
  try {
    body = JSON.stringify({ question, answer });
  } catch (err) {
    return Promise.reject(`Problem editing card - ${err}`);
  }
  return fetch(`${baseUrl}/cards/${cardID}`, {
    method: "PUT",
    headers,
    body,
  }).then(processResponse);
}

export { getDecks, deleteDeck, addDeck, deleteCard, createCard, updateCard };
