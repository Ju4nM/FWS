export default class Message {

    constructor(messageId, btnCloseId) {
        this.overlay = document.getElementById(messageId);
        this.btnClose = document.getElementById(btnCloseId);
    }

    show (message) {
        // this.overlay.style.display = "";
        // this.overlay
    }
}