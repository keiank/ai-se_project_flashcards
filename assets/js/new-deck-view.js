import { fetchedDecks } from "./decks.js";
import { addDeck } from "./api.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!color || !HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}

const newDeckForm = document.querySelector("#new-deck-form");
const newDeckData = newDeckForm.querySelector("#card-data");
const submitBtn = newDeckForm.querySelector(".new-deck-view__submit-btn");

function disableSubmitBtn() {
  submitBtn.disabled = false;
}

newDeckForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formObj = Object.fromEntries(formData.entries());
  let jsonData = parseJSON(formObj.deckdata);
  if (!jsonData) {
    showError("Invalid JSON");
    return;
  }

  if (!validateName(jsonData.name)) {
    showError("Name must be between 2 and 80 characters");
    return;
  }

  if (!Array.isArray(jsonData.cards)) {
    const errorMsg = `JSON must have member like: "cards": [...card objects here...]`;
    showError(errorMsg);
    return;
  }

  const color = normalizeColor(formObj.color);
  if (jsonData.color) {
    if (typeof jsonData.color !== "string") {
      showError("Invalid JSON: color is not a string.");
      return;
    }
    if (jsonData.color.toLowerCase() !== color) {
      showError(
        "Invalid card color use one of: #64D583, #91A8F9, #EE92D7, #AA8EF0, #EE955E, #F5D770",
      );
      return;
    }
  }

  addDeck({
    name: jsonData.name,
    cards: jsonData.cards,
    color,
  })
    .then((newDeck) => {
      fetchedDecks.push(newDeck);
      window.location.hash = "deck/" + newDeck._id;
    })
    .catch(showError);
});

const errorModal = document.querySelector("#new-deck-error-modal");
const errorMessage = errorModal.querySelector(".modal__error");
const closeModalBtn = errorModal.querySelector(".modal__btn_type_dismiss");

closeModalBtn.addEventListener("click", () => {
  errorModal.classList.remove("modal_visible");
});

function showError(message) {
  errorMessage.textContent = message;
  errorModal.classList.add("modal_visible");
}

function validateName(name) {
  if (typeof name != "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

export { disableSubmitBtn, showError };
