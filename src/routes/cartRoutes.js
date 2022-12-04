import express from 'express';
import Sale from "../controllers/sale.controller.js";
import CookieAuth from "../utils/cookieAuth.js";

let router = express.Router();

router.post("/createSale", async (req, res) => {
    let body = req.body;
    let cookieAuth = new CookieAuth(req.cookies);

    // verify cookie
    let isAuthorized = cookieAuth.auth();
    if (!isAuthorized) return;

    let userData = cookieAuth.getData();

    if (userData.userType == "boss") {
        Sale.createSale(userData.userId);
    } else if (userData.userType == "employee") {
        Sale.createSale(userData.bossId, userData.userId);
    } else {
        return;
    }

    
    res.json(userData);
});

export default router;
