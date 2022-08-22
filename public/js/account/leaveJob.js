import Message from "../message.js";

export default class LeaveJob {

    constructor (btnId) {
        this.btn = document.getElementById(btnId);
        this.eventListeners();
        this.message = new Message("message", "closeMsg");
    }

    eventListeners () {

        this.btn.addEventListener("click", () => this.leaveJob());
    }

    leaveJob () {

        fetch("/dashboard/leaveJob", {
            method: "POST"
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
                    this.btn.parentElement.parentElement.style.display = "none";
                    document.getElementById("idDisplayed").style.display = "";
                }

                this.message.show(res.msg);
            })
            .catch(error => console.log(error));
    }
}