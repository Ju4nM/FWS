export default class SideButton {

    constructor (buttonId, titleElement, title, contentId, btnHandler) {
        this.button = document.getElementById(buttonId);
        this.contentElement = document.getElementById(contentId);
        this.titleElement = titleElement;
        this.title = title;
        this.handlerEvent = btnHandler;

        this.#eventsListeners();
    }
        
    #eventsListeners () {
        this.button.onclick = e => {
            this.handlerEvent(e);
            this.#showContent();
        }
    }

    #titleRename () {
        this.titleElement.innerHTML = this.title;
    }

    #showContent () {
        this.#titleRename();

        this.button.classList.add("controlButton-active");
        this.contentElement.style.display = "";
    }

    hideContent () {
        this.contentElement.style.display = "none";
        this.button.classList.remove("controlButton-active");
    }
}