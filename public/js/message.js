export default class Message {

    constructor(messageId, btnCloseId) {
        this.message = document.getElementById(messageId);
        this.overlay = this.message.parentElement;
        
        document.getElementById(btnCloseId).onclick = () => {
            
            this.overlay.style.display = "none";
            this.message.style.display = "none";
        };
    }

    show (message) {
        
        this.overlay.style.display = "";
        this.message.lastElementChild.innerHTML = message;
        this.message.style.display = "";
    }

    showErrors (errors) {
        let errorTemplate = "<ul style = \"color: red\">"
        
        errorTemplate += errors.reduce((acc, item) => {
            return acc += `
                <li>${item}</li>
            `
        }, "");

        errorTemplate += "</ul>";

        this.message.lastElementChild.innerHTML = errorTemplate;
        this.overlay.style.display = "";
        this.message.style.display = "";
    }
}