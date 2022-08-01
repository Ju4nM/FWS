
export default class ButtonDelete {

    constructor (productId) {
        this.productId = productId;
    }

    createButton () {

        let button = document.createElement("button");
        button.setAttribute("class", "btn btn-danger");
        button.textContent = "Borrar";
    }
}