class Validation {
constructor() {
    this.emptyField = [];
}


valNames(string) {
    if (string == "") 
    {
        this.emptyField.push("Este campo esta vacio");
    }
}
}

export default new Validation();