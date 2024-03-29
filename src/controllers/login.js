import Boss from '../controllers/boss.controller.js'
import Employee from "../controllers/employee.controller.js";
// import Cipher from '../utils/Cipher.js';

async function login (req, res) {

    let { userName, password, userType } = req.body;
    let result;

    if (userType == "boss") {
        result = await Boss.login(userName, password);
    } else if (userType == "employee") {
        result = await Employee.login(userName, password);
    }

    // console.log(result);
    let response;
    if (result.status) {
        res.cookie("sessid", result.cookieData);
        response = {status: true, msg: "Inicio de sesion exitoso"};
    } else {
        response = {status: false, msg: "La contraseña y/o usuario son incorrectos"};
    }

    res.send(JSON.stringify(response));
}

export default login;