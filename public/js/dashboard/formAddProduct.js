import Message from "../message.js";

export default class FormAddProduct {

    constructor (formId, listProducts, modalForm) {
        this.form = document.getElementById(formId);
        this.listProducts = listProducts;
        this.modalForm = modalForm;
        this.message = new Message("message", "closeMsg");
        this.eventListeners();
    }

    eventListeners () {
        this.form.addEventListener("submit", e => {
            e.preventDefault();
            this.addProduct();
        })
    }

    addProduct () {
        let data = new FormData(this.form);

        this.modalForm.hide();
        fetch("/dashboard/product/add", {
            method: "POST",
            body: new URLSearchParams(data)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else{ 
                    throw "Error: " + res;
                }
            })
            .then(res => {
                
                if (res.status) {
                    this.listProducts.addProduct(res.productData)
                    this.message.show(res.msg);
                } else {
                    
                    if (res.msg) {
                        this.message.message(res.msg);
                    } else {
                        this.message.showErrors(res.errors);
                    }
                }
            })
            .catch(error => console.log(error));
    }
}
