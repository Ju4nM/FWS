export default class Message {

    constructor(messageId, btnCloseId, seconds) {
        this.message = document.getElementById(messageId);
        this.overlay = this.message.parentElement;
        
        document.getElementById(btnCloseId).onclick = () => {
            
            this.overlay.style.display = "none";
            this.message.style.display = "none";
        };
    }

    show (message) {
        
        this.overlay.style.display = "grid";
        this.message.lastElementChild.innerHTML = message;
        this.message.style.display = "";
    }
}