
export default class ModalInput {

    constructor (modalId, inputId, modalButtonId, closeButtonId) {
        
        this.modal = document.getElementById(modalId);
        this.overlay = this.modal.parentElement;
        this.input = document.getElementById(inputId);
        this.text = this.modal.querySelector("p");
        this.button = document.getElementById(modalButtonId);
        this.closeModal = document.getElementById(closeButtonId);
        this.#eventListeners();
    }

    #eventListeners () {
        this.closeModal.addEventListener("click", () => this.toggle());
        this.button.addEventListener("click", e => {

            this.toggle();
            e.preventDefault();
        });
    }

    toggle () {
        this.overlay.style.display = this.overlay.style.display === "none" ? "" : "none";
        this.modal.style.display = this.modal.style.display === "none" ? "" : "none";
    }

    request () {
        this.text.innerHTML = "Escriba su contrase&ntilde;a actual para confirmar los cambios:";
        this.input.style.display = "";
        this.toggle();
        
        return new Promise(resolve => {
            
            this.button.addEventListener("click", () => resolve(this.input.value));
            this.input.value = "";
        });
    }

    confirm (text) {
        this.text.innerHTML = text;
        this.input.style.display = "none";
        this.toggle();

        return new Promise(resolve => {
            
            this.button.addEventListener("click", () => resolve());
        });
    }
}