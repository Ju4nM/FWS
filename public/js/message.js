export default class Message {

    constructor(messageId, btnCloseId, seconds) {
        this.message = document.getElementById(messageId);
        this.overlay = this.message.parentElement;
        
        document.getElementById(btnCloseId).onclick = () => {
            
            // this.message.style.animation = "hiddenMsg";
            // setTimeout(() => {
            //     this.message.style.display = "none";
            // }, 500);
            
            // this.overlay.style.animation = "hiddenOverlay";
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