const confirmationModal = document.querySelector("#confirmation-modal");
const modalText = confirmationModal.querySelector(".modal__text");
const cancelBtnModal = confirmationModal.querySelector(
  ".modal__btn_type_cancel",
);
const confirmBtnModal = confirmationModal.querySelector(
  ".modal__btn_type_confirm",
);

/**
 * Displays a confirmation modal asking the user to confirm deletion.
 * @param {string} type - The type of item being deleted (e.g., 'deck', 'card')
 * @param {Function} doFirst - Callback function to execute first if the user confirms deletion
 */
function confirmDeletion(type, doFirst) {
  confirmationModal.classList.add("modal_visible");
  modalText.textContent = `Are you sure you want to delete this ${type}?`;
  /**
   * Closes the confirmation modal and removes attached event listeners.
   */
  function closeModal() {
    confirmationModal.classList.remove("modal_visible");
    confirmBtnModal.removeEventListener("click", handleConfirm);
    cancelBtnModal.removeEventListener("click", closeModal);
  }

  /**
   * Handles the confirm button click: performs the provided action
   * and then closes the modal.
   */
  function handleConfirm() {
    doFirst();
    closeModal();
  }

  confirmBtnModal.addEventListener("click", handleConfirm);
  cancelBtnModal.addEventListener("click", closeModal);
}

export { confirmDeletion };
