export default class ModalForm{
    constructor(formId){
        this.form= document.getElementById(formId)
        this.overlay = this.form.parentElement;

    }


    show(){
        this.overlay.style.display= "";
        this.form.style.display= "";
        
    }


}
