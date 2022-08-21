import CookieAuth from "../utils/cookieAuth.js";
import Boss from "./boss.controller.js";
import Product from "./product.controller.js";
import Employee from "./employee.controller.js";

export default async function dashboard (req, res) {
    let cookieAuth = new CookieAuth(req.cookies);
    let cookieIsExist = await cookieAuth.auth();
    
    if (!cookieIsExist) {
        
        res.redirect("/");
    } else {

        const cookieData = cookieAuth.getData();
        let { userId, userType, userName } = cookieData;
        let data = {userName, userType, hasJob: false};

        if (userType === "employee") {
            let employeeData = await Employee.getEmployeeData(userId);
            data.hasJob = employeeData[0].bossId !== null;
        }

        res.render("dashboard", data);
    }
}