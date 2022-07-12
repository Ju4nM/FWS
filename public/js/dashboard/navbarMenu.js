export default class HamburgerMenu {
    
    constructor (buttonId, sideBarId, overlayId) {
        this.button = document.getElementById(buttonId);
        this.sideBar = document.getElementById(sideBarId);
        this.overlay = document.getElementById(overlayId);
        
        this.isActive = false;

        this.button.onclick = () => this.#toggle();
        
        this.overlay.onclick = () => {
            if (this.isActive) this.#toggle()
        };

        this.sideBar.onclick = () => {
            if (this.isActive) this.#toggle()
        };
    }

    #toggle () {
        let status = this.overlay.style.display == "none";
        this.isActive = status;
        this.overlay.style.display = status ? "grid" : "none";
        this.sideBar.style.display = status ? "flex" : "";
    }
}