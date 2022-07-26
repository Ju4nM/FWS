import Boss from "../controllers/boss.controller.js";
import Employee from "../controllers/employee.controller.js";

export default class Validation {
    
    constructor(userType) {
        this.errors = []; 
        this.userType = userType;
    }

    getErrors () {
        return [ ...this.errors ];
    }

    isValid() {
        return this.errors.length === 0;
    }

    valNames(name, campo) {
        // if (name == "") {
        //     this.errors.push("El " + campo + " no puede estar vacio");
        // } else if (/[0-9]|\s+$/g.test(name)) {
        //     this.errors.push("El " + campo + " no puede estar vacio y solo se permiten letras");
        // }
        if (name == "") {
            this.errors.push("El " + campo + " no puede estar vacio");
        } else if (!/^[a-zA-Z\u00E0-\u00FC\s]+$/g.test(name)) {
            this.errors.push("El " + campo + " solo permite letras");
        }
    }

    async valUserName (userName) {
        if (!/\w/g.test(userName)) {
            this.errors.push("Solo se permiten caracteres alfanumericos");
            return;
        }

        let isExist = false;
        if (this.userType === "boss") {
            isExist = await Boss.userNameExist(userName)
        } else {
            isExist = await Employee.userNameExist(userName)
        }
        
        if (isExist) this.errors.push("El usuario ya esta en uso");
    }

    async valEmail (email) {
        if (!/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@([a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+))+$/.test(email)) {
            this.errors.push("Se debe introducir un correo valido")
            return;
        };

        let isExist = false;
        if (this.userType === "boss") {
            isExist = await Boss.emailExist(email)
        } else {
            isExist = await Employee.emailExist(email)
        }
        
        if (isExist) {
            this.errors.push("El correo ya esta en uso");
        }
    }

    valPassword (password) {
        if (!/.{8,}/g.test(password)) this.errors.push("La contraseña debe tener 8 caracteres minimo");
    }

    async valFields (name, lastName, secondLastName, userName, password, email) {
        
        this.valNames(name, "nombre");
        this.valNames(lastName, "apellido paterno");
        this.valNames(secondLastName, "apellido materno");
        await this.valUserName(userName);
        this.valPassword(password);
        await this.valEmail(email);
    }
}
