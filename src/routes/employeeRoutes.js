import express from 'express';
import CookieAuth from "../utils/cookieAuth.js";
import Employee from "../controllers/employee.controller.js";
import Validation from '../utils/fieldValidation.js';

const router = express.Router();

router.get("/getEmployeeData", async (req, res) => {
    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();
    
    if (cookieIsExist) {
        
        const { userType, userId } = cookieAuth.getData();

        if (userType === "boss") {
            let employeeData = await Employee.getAllEmployees(userId);
            
            res.json(employeeData);
        } else {
            res.sendStatus(404);
        }
    } else {

        res.redirect("/dashboard");
    }

});

router.post("/uncoupleEmployee", async (req, res) => {
    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();
    
    if (cookieIsExist) {
        
        const { userType, userId } = cookieAuth.getData();
        const { employeeId } = req.body;
        let response = {};
        
        if (userType === "boss") {
            let isUncoupled = await Employee.uncouple(employeeId, userId);
            response = { msg: isUncoupled ? "Desacoplado correctamente" : "No se pudo desacoplar" };
            response.status = isUncoupled;
        } else {
            response = {status: false, msg: "No se puede desacoplar"}
        }
        console.log(response);
        res.json(response);
    } 
});

router.post("/addEmployee", async (req, res) => {

    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();

    if(!cookieIsExist) {
        res.sendStatus(401);
        return;
    }
    
    const cookieData = cookieAuth.getData();
    let { employeeId } = req.body;
    let { userType, userId } = cookieData;
    employeeId = employeeId.trim();

    if (employeeId === "") {
        res.json({status: false, msg: "El id esta vacio"});
        return;
    }

    if (!userType === "boss") {
        res.sendStatus(401);
        return;
    }

    let validator = new Validation();
    validator.validateId(employeeId);

    if (!validator.isValid()) {
        console.log(validator.getErrors());
        res.json({ status: false, errors: validator.getErrors() });
        return;
    }

    let result = await Employee.addEmployee(employeeId, userId);

    if (result.length === 1) {
        res.json({status: true, msg: "Se ha acoplado correctamente", employeeData: result[0]});
    } else {
        res.json({status: false, msg: "No se pudo acoplar el empleado"});
    }
});

router.post("/leaveJob", async (req, res) => {
    
    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();

    if (cookieIsExist) {
        let { userId, userType } = cookieAuth.getData();
        
        if (userType === "employee") {
            let [ employeeData ] = await Employee.getEmployeeData(userId);
            if (employeeData.bossId !== null) {
                let result = await Employee.leaveJob(userId, employeeData.bossId);

                if (result) {
                    res.json({ status: result, msg: "Se ha dejado el empleo" })
                } else {

                    res.json({ status: result, msg: "No se pudo dejar el empleo" })
                }
                // ------------------------------ Here
            }
        } else {
            res.sendStatus(404);
        }
    }
})

export default router;
