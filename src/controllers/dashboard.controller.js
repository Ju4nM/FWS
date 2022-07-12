import CookieAuth from "../utils/cookieAuth.js";
import Boss from "./boss.controller.js";
import Employee from "./employee.controller.js";

export default async function dashboard (req, res) {
    let cookieAuth = new CookieAuth(req.cookies);
    let cookieIsExist = await cookieAuth.auth();
    
    if (!cookieIsExist) {
        
        res.redirect("/");
    } else {

        let cookieData = cookieAuth.getData();
        let resView;
        let data = {userName: cookieData.userName};
        if (cookieData.userType === "boss") {

            resView = "bossDashboard";
            let products = await Boss.getProducts(cookieData.bossId);
            data.products = products;
        } else if (cookieData.userType == "employee") {
            
            resView = "employeeDashboard";
        } else {
            res.redirect("/");
        }
        
        // console.log(data);
        res.render(resView, data);
    }
}