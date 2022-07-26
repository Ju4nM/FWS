import ModalInput from "../modalInput.js";
import Message from "../message.js";
import EditButton from "./editButton.js";

export default class SaveButton {

    constructor (buttonId) {
        this.saveButton = document.getElementById(buttonId);
        this.form = document.getElementById("formUserData");
        this.buttons = [];
        this.isEnable = false;
        this.modal = new ModalInput("modalInput", "modalField", "modalButton", "closeModal");
        this.message = new Message("message", "closeMsg");
        this.#eventListeners();
    }

    #eventListeners () {
        
        this.saveButton.addEventListener ("click", e => {
            this.modal.request()
                .then(passwordConfirmation => {

                    let data = {};
                    new FormData(this.form).forEach((value, key) => data[key] = value);
                    this.sendData({ passwordConfirmation, ...data});
                });
            
            e.preventDefault();
        })

        const editUserInf = new EditButton ("editUserInf", "text", () => this.toggle()); // section with name, lastname, secondlastname
        const editSessionInf = new EditButton ("editSessionInf", "text", () => this.toggle()); // section with user name and password (only manage user name)
        const editContactInf = new EditButton ("editContactInf", "text", () => this.toggle()); // section with email
        const editPassword = new EditButton ("editPassword", "password", (dataCard, isEditing) => { // section with two password fields (password and confirm password)

            let passwFields = Array.from(dataCard.querySelectorAll("input[type=password]"));

            if (isEditing) {

                passwFields.forEach(field => { // remove password fields content
                    field.style.display = ""
                    field.value = "";
                });
            } else {
                passwFields[1].style.display = "none"; // hides the second field
            }
            this.toggle();
        });
        
        this.buttons = [editUserInf, editSessionInf, editContactInf, editPassword]
    }

    toggle () {

        if (this.isEnable) {
            this.disable();
        } else {
            this.enable();
        }
    }

    disable () {
        let buttonsEnabled = this.buttons.filter(button => button.getStatus() === true);
        if (buttonsEnabled.length === 0) { // if there aren't buttons enabled then disable save button
            this.buttons
            this.saveButton.setAttribute("disabled", "");
            this.isEnable = false;
        }
    }

    enable () {
        this.saveButton.removeAttribute("disabled");
        this.isEnable = true;
    }

    sendData (data) {
        
        fetch ("/dashboard/account/updateData", {
            method: "POST",
            body: new URLSearchParams (data)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw "Error";
                }
            })
            .then (res => {
                
                if (res.status) {
                    console.log(res.data);
                    this.message.show(res.msg);
                    this.#loadNewData(res.data);
                } else {
                    this.message.showErrors(res.errors);
                }
            });
    }

    #loadNewData (data) {
        
        if (data.hasOwnProperty("name")) this.buttons[0].setData([ data.name, data.lastName, data.secondLastName ]);
        if (data.hasOwnProperty("userName")) this.buttons[1].setData([ data.userName ]);
        if (data.hasOwnProperty("email")) this.buttons[2].setData([ data.email ]);
        this.buttons.forEach(button => button.lock());
    }
}