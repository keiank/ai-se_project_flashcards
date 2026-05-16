const confirmationModal = document.querySelector("#confirmation-modal");
const cancelBtnModal = confirmationModal.querySelector(
  ".modal__btn_type_cancel",
);
const confirmBtnModal = confirmationModal.querySelector(
  ".modal__btn_type_confirm",
);

function confirmDeletion(doFirst) {
  confirmationModal.classList.add("modal_visible");
  function closeModal() {
    confirmationModal.classList.remove("modal_visible");
    confirmBtnModal.removeEventListener("click", handleConfirm);
    cancelBtnModal.removeEventListener("click", closeModal);
  }

  function handleConfirm() {
    doFirst();
    closeModal();
  }

  confirmBtnModal.addEventListener("click", handleConfirm);
  cancelBtnModal.addEventListener("click", closeModal);
}

export { confirmDeletion };
