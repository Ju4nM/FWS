import Message from "../message.js";

export default class SaveButton {
    
    constructor (formId, productId, btnSave) {
        this.productId = productId;
        this.form = document.getElementById(formId);
        this.btnSave = btnSave;
        this.editButtons = [];
        this.message = new Message ("message", "closeMsg");
        this.eventListeners();
    }

    eventListeners () {

        this.form.addEventListener("submit", e => {
            e.preventDefault();
            this.editData();
        });
    }

    addEditButton (editButton) {
        this.editButtons.push(editButton);
    }

    isButtonsEditMode () {
        for (let i = 0; i < this.editButtons.length; i++) {
            let currentButton = this.editButtons[i];

            if (currentButton.getStatus()) return currentButton.getStatus();
        }
        return false;
    }

    toggleEdit () {
        
        let isEditingMode = this.isButtonsEditMode();

        if (!isEditingMode) {
            this.btnSave.setAttribute("disabled", "");
        }
    }

    editData () {

        let data = new FormData(this.form);

        fetch("/dashboard/product/edit", {
            method: "POST",
            body: new URLSearchParams(data)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw "Error: " + res;
                }
            })
            .then(res => {
                if (res.status) {
                    this.message.show(res.msg);
                    this.setNewData(res.productData);
                } else {
                    this.message.showErrors(res.errors);
                }
            })
            .catch(error => console.log(error));
    }

    setNewData (productData) {
        let { productName, description, solutions, unitPrice, stock, expirationDate } = productData;
        this.editButtons[0].setData([productName, description, solutions]);
        this.editButtons[1].setData([unitPrice, stock, expirationDate]);
        this.editButtons.forEach(button => button.lock());
    }
}