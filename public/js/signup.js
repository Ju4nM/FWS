// import { response } from "express";
import Message from "./message.js";

document.addEventListener("DOMContentLoaded", () => {

const btnSignup = document.getElementById("btnSignup");
const signupForm = document.getElementById("signupForm");

btnSignup.onclick = () => {
    const data = new FormData(signupForm);
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
        console.log(response);
    });
}

});