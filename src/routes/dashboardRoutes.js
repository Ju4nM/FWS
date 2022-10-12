import express from 'express';
import CookieAuth from "../utils/cookieAuth.js";
import updateData from "../controllers/updateData.js";
import Boss from '../controllers/boss.controller.js';
import Employee from '../controllers/employee.controller.js';
import productRoutes from "./productRoutes.js";
import employeeRoutes from "./employeeRoutes.js";
import cartRoutes from "./cartRoutes.js";

const router = express.Router();

router.use("/dashboard", productRoutes);
router.use("/dashboard", employeeRoutes);
router.use("/dashboard/shopping/", cartRoutes);

router.get("/dashboard/account", async (req, res) => {

    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();
    
    if (cookieIsExist) {
        
        const { userType, userId } = cookieAuth.getData();

        const [ userData ] = userType === "boss" ? await Boss.getBossData(userId) : await Employee.getEmployeeData(userId);
        delete userData.password;
        
        res.render("account", { userId, isBoss: userType === "boss", ...userData });
    } else {

        res.redirect("/login");
    }

});

router.post("/dashboard/account/updateData", updateData);

export default router;
