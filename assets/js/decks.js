let fetchedDecks = [];

/**
 * Retrieves a deck object by its ID from the decks array.
 *
 * @param {string} deckId - The unique identifier of the deck to retrieve
 * @returns {object|undefined} The deck object if found, undefined otherwise
 */
function getDeckByID(deckId) {
  return fetchedDecks.find((deck) => deck._id === deckId);
}

/**
 * Retrieves the index of a deck in the fetchedDecks array by its ID.
 * @param {string} deckId - The unique identifier of the deck
 * @returns {number} The index of the deck if found, -1 otherwise
 */
function getDeckIndex(deckId) {
  return fetchedDecks.findIndex((deck) => deck._id === deckId);
}

/**
 * Retrieves the index of a card within a specific deck by their IDs.
 * @param {string} deckId - The unique identifier of the deck
 * @param {string} cardId - The unique identifier of the card
 * @returns {number} The index of the card if found, -1 otherwise
 */
function getCardIndex(deckId, cardId) {
  const deckIndex = getDeckIndex(deckId);
  if (deckIndex !== -1) {
    return fetchedDecks[deckIndex].cards.findIndex(
      (card) => card._id === cardId,
    );
  }
  return -1;
}

/**
 * Removes a card from a deck in the browser decks array by their IDs.
 * @param {string} deckId - The unique identifier of the deck with the card to remove
 * @param {string} cardId - The unique identifier of the card to remove
 * @returns {void}
 */
function removeCardById(deckId, cardId) {
  const deckIndex = getDeckIndex(deckId);
  const cardIndex = getCardIndex(deckId, cardId);
  if (deckIndex !== -1 && cardIndex !== -1) {
    fetchedDecks[deckIndex].cards.splice(cardIndex, 1);
  }
}

export {
  fetchedDecks,
  getDeckByID,
  getDeckIndex,
  getCardIndex,
  removeCardById,
};
