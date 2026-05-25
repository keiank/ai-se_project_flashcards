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
  } catch (e) {
    return Promise.reject(
      `Error: problem converting deck object to deck string - ${e}`,
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
 * Remove the deck from the fetchedDecks array, using its ID.
 * @param {string} deckID - the unique ID of the deck to remove from the browser local array.
 */
function removeDeckByID(deckID) {
  const index = fetchedDecks.findIndex((currDeck) => currDeck._id === deckID);
  if (index !== -1) {
    fetchedDecks.splice(index, 1);
  }
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

export { getDecks, deleteDeck, removeDeckByID, addDeck, deleteCard };
