export default class Validation {
    
    constructor() {
        this.errors = []; 
    }

    getErrors () {
        return this.errors;
    }

    isValid() {
        return this.errors === [];
    }

    valNames(name, campo) {
        if (name == "") {
            this.errors.push("El " + campo + " no puede estar vacio");
        } else if (/[0-9]|\s+$/g.test(name)) {
            this.errors.push("El " + campo + " no puede estar vacio y solo se permiten letras");
        }
    }

    valUserName (userName) {
        if (!/\w/g.test(userName)) this.errors.push("Solo se permiten caracteres alfanumericos");
    }

    valEmail (email) {
        if (!/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@([a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+))+$/.test(email)) 
            this.errors.push("Se debe introducir un correo valido");
    }

    valPassword (password) {
        if (!/.{8,}/g.test(password)) this.errors.push("La contraseña debe tener 8 caracteres minimo");
    }
}
