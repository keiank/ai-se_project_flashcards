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

function getDeckIndex(deckId) {
  return fetchedDecks.findIndex((deck) => deck._id === deckId);
}

function getCardIndex(deckId, cardId) {
  const deckIndex = getDeckIndex(deckId);
  if (deckIndex !== -1) {
    return fetchedDecks[deckIndex].cards.findIndex(
      (card) => card._id === cardId,
    );
  }
  return -1;
}

function removeCardById(deckId, cardId) {
  const deckIndex = getDeckIndex(deckId);
  const cardIndex = getCardIndex(deckId, cardId);
  if (deckIndex !== -1 && cardIndex !== -1) {
    fetchedDecks[deckIndex].cards.splice(cardIndex, 1);
  }
}

export { fetchedDecks, getDeckByID, getDeckIndex, removeCardById };
