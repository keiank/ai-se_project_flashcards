const confirmationModal = document.querySelector("#confirmation-modal");
const modalText = confirmationModal.querySelector(".modal__text");
const cancelBtnModal = confirmationModal.querySelector(
  ".modal__btn_type_cancel",
);
const confirmBtnModal = confirmationModal.querySelector(
  ".modal__btn_type_confirm",
);

function confirmDeletion(type, doFirst) {
  confirmationModal.classList.add("modal_visible");
  modalText.textContent = `Are you sure you want to delete this ${type}?`;
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
