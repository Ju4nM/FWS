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

        let { userType, userName } = cookieAuth.getData();
        let data = {userName, userType};
        
        // if (userType === "boss") {

        //     data.employees = employees;
        // } else if (userType !== "employee") {
            
            // resView = "employeeDashboard";
            // res.redirect("/");
        // }
        
        // console.log(data);
        res.render("dashboard", data);
    }
}