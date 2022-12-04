import Message from "./message.js";

document.addEventListener("DOMContentLoaded", () => {

    const btnSignup = document.getElementById("btnSignup");
    const signupForm = document.getElementById("signupForm");

    btnSignup.onclick = e => {
        const data = new FormData(signupForm);

        const message = new Message("message", "closeMsg");

        fetch('/signup', {
            method: "POST",
            body: new URLSearchParams(data)
        }).then(res => {
            if(res.ok) {
                return res.json();
            } else {
                throw "Error";
            }
        }).then(response => {
            
            if (response.status) {
                message.show(response.response, () => location.href = "/login");
            } else {

                message.showErrors(response.response);
            }
            console.log(response);
        });
        e.preventDefault();
    }

});
