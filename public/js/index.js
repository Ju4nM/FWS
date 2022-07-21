import Message from "./message.js";

document.addEventListener("DOMContentLoaded", () => {
    
    const btnLogin = document.getElementById("btnLogin");
    const loginForm = document.getElementById("loginForm");

    btnLogin.onclick = e => {
        const data = new FormData(loginForm);
        
        fetch('/login', {
            method: "POST",
            body: new URLSearchParams(data)
        })
            .then(res => {
                // console.log(res);
                if (res.ok) {
                    return res.json();
                } else { 
                    throw 'Error';
                }
            })
            .then(response => {
                
                if (response.status) {

                    // console.log(response.msg);
                    window.location.reload();
                } else {
                    
                    const message = new Message("message", "closeMsg");
                    message.show(response.msg);
                }

            })
            .catch (err => console.log(err));
        
        e.preventDefault();
    };
});