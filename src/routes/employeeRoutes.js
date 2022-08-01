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

export default router;