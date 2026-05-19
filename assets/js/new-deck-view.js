import { gallery } from "./gallery.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\W*$/g, "")
    .replace(/^\W+/g, "")
    .replace(/\W+/g, "-");
}

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
  const jsonData = JSON.parse(formObj.deckdata);
  const color = normalizeColor(formObj.color);
  console.log(color);
  const deckID = `${slugify(jsonData.name)}-${Date.now()}`;
  console.log(color);
  const newDeck = {
    id: deckID,
    name: jsonData.name,
    description: "",
    cards: jsonData.cards,
    color,
  };
  gallery.push(newDeck);

  window.location.hash = "deck/" + deckID;
});

export { disableSubmitBtn };
