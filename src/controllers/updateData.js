import Validation from '../utils/fieldValidation.js';
import CookieAuth from '../utils/cookieAuth.js';
import Cipher from '../utils/Cipher.js';
import Boss from './boss.controller.js';
import Employee from './employee.controller.js';

export default async function updateData (req, res) {

    let data = {};
    for (const key in req.body) data[key] = req.body[key].trimEnd();

    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();
    if (!cookieIsExist) {return;}
    
    const { userType, userId } = cookieAuth.getData();
    let [ userData ] = userType === "boss" ? await Boss.getBossData(userId) : await Employee.getEmployeeData(userId);
    
    let isCorrectPassword = await Cipher.compareHashes(data.passwordConfirmation, userData.password);
    if (!isCorrectPassword) {
        res.json({ status: false, errors: ["La contraseña es incorrecta"] });
        return;
    }
    
    let validation = new Validation(userType);
    let errors = [];
    
    if (data.hasOwnProperty("name")) {
        if (data.name === userData.name && data.lastName === userData.lastName && data.secondLastName === userData.secondLastName) {
            errors.push("El nombre es el mismo")
        } else {

            validation.valNames(data.name, "nombre");
            validation.valNames(data.lastName, "apellido paterno");
            validation.valNames(data.secondLastName, "apellido materno");
        }
        userData.name = data.name;
        userData.lastName = data.lastName;
        userData.secondLastName = data.secondLastName;
    }
    
    if (data.hasOwnProperty("email")) {
        
        if (data.email === userData.email) {
            errors.push("El correo es el mismo");
        } else {
            await validation.valEmail(data.email);
        }
        userData.email = data.email;
    }

    if (data.hasOwnProperty("userName")) {
        if (data.userName === userData.userName) {
            errors.push("El nombre de usuario es el mismo");
        } else {
            await validation.valUserName(data.email);
        }
        userData.userName = data.userName;
    }

    if (data.hasOwnProperty("password")) {
        if (data.password === userData.password) {
            errors.push("La contraseña es la misma");
            if (data.password != data.repeatedPassword) {
                errors.push("Las contraseñas escritas no coinciden")
            }
        } else {
            validation.valPassword(data.password);
        }
        userData.password = data.password;
        console.log(data.password);
        console.log(userData);
    }
    
    errors = errors.concat(validation.getErrors());
    if (errors.length !== 0) {
        res.json ({ status: false, errors });
        return;
    }
    let result = {status: false};
    if (userType === "boss") {
        result = await Boss.updateData({ userId, ...userData });
    } else if (userType === "employee") {
        result = await Employee.updateData({ userId, ...userData });
    }
    
    if (result.status) {
        delete userData.password;
        res.cookie("sessid", result.sessid);
        res.json({ status: true, msg: "Los cambios se han realizado correctamente", data: userData });
    } else {
        res.json({ status: false, errors: ["Ocurrio un error"] });
    }

}