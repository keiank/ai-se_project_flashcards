import { fetchedDecks } from "./decks.js";

const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "019e5022-c45f-74eb-b66e-869402793f89",
};

function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

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

function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Remove the deck from DB, using its ID.
 */
function deleteDeck(deckID) {
  return fetch(`${baseUrl}/decks/${deckID}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

/**
 * Remove the deck from the fetchedDecks array, using its ID.
 */
function removeDeckByID(deckID) {
  const index = fetchedDecks.findIndex((currDeck) => currDeck._id === deckID);
  if (index !== -1) {
    fetchedDecks.splice(index, 1);
  }
}

export { getDecks, deleteDeck, removeDeckByID, addDeck };
