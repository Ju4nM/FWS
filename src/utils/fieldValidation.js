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

    // product fields
    productName (name) {
        if (name.length === 0) {
            this.errors.push("El nombre del producto esta vacio");
        } else if (!/^[A-Za-z0-9\s]+$/.test(name)) {
            this.errors.push("Solo carateres alfanumericos en el nombre");
        }
    }

    productDescription (description) {
        if (description.length === 0) {
            this.errors.push("La descripcion esta vacia");
        } else if (!/^[A-Za-z0-9\s]+$/.test(description)) {
            this.errors.push("Solo caracteres alfanumericos en la descripcion");
        }
    }

    productSolutions (solutions) {
        if (solutions.length === 0) {
            this.errors.push("La solucion esta vacia");
        } else if (!/^[A-Za-z0-9\s]+$/.test(solutions)) {
            this.errors.push("Solo caracteres alfanumericos en las soluciones");
        }
    } 

    expirationDate (date) {
        if (!/^(?:3[01]|[12][0-9]|0?[1-9])([\-/.])(0?[1-9]|1[1-2])\1\d{4}$/.test(date)) {
            this.errors.push("La fecha debe tener el formato dd/mm/yyyy");
        }
    }

    productStockAndPrice (value, customError) {
        if (!/^[0-9]+$/.test(value)) {
            this.errors.push(customError);
        }
    }

    validateAllProductFields(productData) {
        let { productName, description, solutions, expirationDate, stock, unitPrice } = productData;
        this.productName(productName);
        this.productDescription(description);
        this.productSolutions(solutions);
        this.productStockAndPrice(stock, "El valor de las existencias no es correcto");
        this.productStockAndPrice(unitPrice, "El valor del precio no es correcto");
        expirationDate = expirationDate.split(/-|\//).reverse().join("-");
        console.log(expirationDate);
        this.expirationDate(expirationDate);
    }

    // others
    validateId (id) {
        if (!/^[0-9]$/.test(id)) this.errors.push("El ID solo ser numerico");
    }
    
    // validate the the data for search
    validateSearchInput (input) {
        if (!/^[A-Za-z0-9\s]+?$/.test(input)) this.errors.push("El termino de busqueda solo puede tener letras y/o numeros");
    }
}
