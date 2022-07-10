export default class SideButton {

    constructor (buttonId, titleElement, title, contentId, eventFunction) {
        this.button = document.getElementById(buttonId);
        this.contentElement = document.getElementById(contentId);
        this.titleElement = titleElement;
        this.title = title;

        this.button.onclick = e => {
            eventFunction(e);
            this.#showContent();
            this.#titleRename();
        }
    }

    

}