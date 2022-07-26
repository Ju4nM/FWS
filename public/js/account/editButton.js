export default class EditButton {

    constructor (idButton, typeFields, fnForEvent) {
        this.editButton = document.getElementById(idButton);
        this.dataCard = this.editButton.parentElement.parentElement;
        this.fields = Array.from(this.dataCard.querySelectorAll(`input[type=${typeFields}]`));
        this.fnForEvent = fnForEvent;
        this.isEditing = false;
        
        if (this.fnForEvent === undefined) this.fnForEvent = () => false; // in case there isn't custom function
        
        this.defaultData = this.fields.map(field => field.value); // saves default values
        this.#eventListeners();
    }

    #eventListeners () {

        this.editButton.addEventListener("click", () => {
            this.toggle();
            this.fnForEvent(this.dataCard, this.isEditing); // custom function 
        });
    }

    toggle () {

        if (!this.isEditing) {
            this.fields.forEach(field => field.removeAttribute("disabled"))
            this.editButton.innerHTML = "<i class=\"fa-solid fa-ban\"></i>"; // changes icon to circle with slash
            this.isEditing = true; // switch mode to "editing"
        } else {
            // change icon to square with pen
            this.editButton.innerHTML = "<i class=\"fa-solid fa-pen-to-square\"></i>";
            this.fields.forEach(field => field.setAttribute("disabled", "")); // disable all fields
            this.fields.forEach((field, index) => field.value = this.defaultData[index]); // returns fields to default values
            this.isEditing = false;
        }
    }

    lock () {
        if (this.isEditing) this.toggle();
    }

    getStatus () {
        return this.isEditing;
    }

    setData (newData) {
        this.defaultData = this.defaultData.map ((_, index) => newData[index]);
    }
}