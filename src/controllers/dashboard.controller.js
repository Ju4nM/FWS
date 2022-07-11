import CookieAuth from "../utils/cookieAuth.js";

export default async function dashboard (req, res) {
    let cookieAuth = new CookieAuth(req.cookies);
    let cookieIsExist = await cookieAuth.auth();
    
    if (!cookieIsExist) {
        
        res.redirect("/");
    } else {

        let data = cookieAuth.getData();
        let resView;
        
        if (data.userType === "boss") {
            resView = "bossDashboard";
        } else if (userType == "employee") {
            resView = "employeeDashboard";
        } else {
            res.redirect("/");
        }
        
        res.render(resView, {userName: data.userName});
    }

}