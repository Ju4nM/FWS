export default class ModalForm{

    constructor(formId){
        this.form= document.getElementById(formId)
        this.overlay = this.form.parentElement;
        this.btnClose = this.form.querySelector("button[type=button]");
        this.eventListeners();
    }

    eventListeners() {
        this.btnClose.addEventListener("click", () => this.hide());
    }

    show(){
        this.overlay.style.display = "";
        this.form.style.display = "";
    }

    hide () {
        this.overlay.style.display = "none";
        this.form.style.display = "none";
        this.form.reset();
    }
}
