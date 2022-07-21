export default class Spinner {
    
    constructor (spinnerId, textId) {
        this.spinner = document.getElementById(spinnerId);
        this.spinnerText = document.getElementById(textId);
    }

    showSpinner () {

        if (this.spinner.classList.contains("text-secondary")) this.spinner.classList.replace("text-secondary", "text-primary");
        if (!this.spinner.classList.contains("spinner-border")) this.spinner.classList.add("spinner-border");
        
        this.spinnerText.style.display = "none";
        this.spinner.style.display = "";
    }

    hide () {
        this.spinner.style.display = "none";
    }

    showText () {
        
        if (this.spinner.classList.contains("spinner-border")) this.spinner.classList.remove("spinner-border");
        if (this.spinner.classList.contains("text-primary")) this.spinner.classList.replace("text-primary", "text-secondary");
        
        this.spinnerText.style.display = "";
        this.spinner.style.display = "";
    }

    setText (text) {
        this.spinnerText.innerHTML = text;
    }
}