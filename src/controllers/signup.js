import Boss from './boss.controller.js'
import Employee from "./employee.controller.js";
import Validation from '../utils/fieldValidation.js';

async function signup (req,res) {
    
    for (let key in req.body) req.body[key] = req.body[key].trimEnd();

    let {signupName, signupLastName, signupSecondLastN, signupUserName, signupEmail, signupPasswd, signupUserType} = req.body
    
    const validation = new Validation(signupUserType);
        
    await validation.valFields(signupName, signupLastName, signupSecondLastN, signupUserName, signupPasswd, signupEmail);
    // validation.valNames(signupName, "nombre");
    // validation.valNames(signupLastName, "apellido paterno");
    // validation.valNames(signupSecondLastN, "apellido materno");
    // validation.valUserName(signupUserName);
    // validation.valEmail(signupEmail);
    // validation.valPassword(signupPasswd);

    const errors = validation.getErrors();

    let response;

    if (errors.length >= 1) {
        // console.log(errors);
        response = {status: false, response: errors};
    } else {

        let result;

        if (signupUserType == "boss") {
            
            result = await Boss.signup(signupName, signupLastName, signupSecondLastN, signupUserName, signupEmail, signupPasswd)
        } else if (signupUserType == "employee") {

            result = await Employee.signup(signupName, signupLastName, signupSecondLastN, signupUserName, signupEmail, signupPasswd)
        }


        if (result) {
            response = {status: true, response: "Se ha registrado correctamente"};
        } else {
            response = {status: false, response: "No se ha podido registrar"};
        }
    }

    res.json(response);
}

export default signup;