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

function getQuotes() {
  return fetch(baseUrl + "/quotes", { headers }).then(processResponse);
}

function getDecks() {
  return fetch(baseUrl + "/decks", { headers }).then(processResponse);
}

function getRandomQuote() {
  return fetch(baseUrl + "/quotes/random", { headers }).then(processResponse);
}

export { getQuotes, getDecks, getRandomQuote };
