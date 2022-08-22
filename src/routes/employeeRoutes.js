import express from 'express';
import CookieAuth from "../utils/cookieAuth.js";
import Employee from "../controllers/employee.controller.js";

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

    if(cookieIsExist) {
        const cookieData = cookieAuth.getData();
        let { employeeId } = req.body;
        let { userType, userId } = cookieData;
        employeeId = employeeId.trim();
        
        if (employeeId === "") {
            res.json({status: false, msg: "El id esta vacio"});
        } else {

            if (userType === "boss") {
                let result = await Employee.addEmployee(employeeId, userId);
                
                if (result.length === 1) {
                    res.json({status: true, msg: "Se ha acoplado correctamente", employeeData: result[0]});
                } else {
                    res.json({status: false, msg: "No se pudo acoplar el empleado"})
                }
            } else {
                res.sendStatus(404);
            }
        }
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
                
            }
        } else {
            res.sendStatus(404);
        }
    }
})

export default router;