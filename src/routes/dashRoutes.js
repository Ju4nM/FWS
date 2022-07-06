import express from 'express';
import app from "../app.js";
import CookieAuth from '../utils/cookieAuth.js';

const router = express.Router();

router.get("/", async (req, res) => {
    
    let cookieAuth = new CookieAuth(req.cookies);
    let cookieIsExist = await cookieAuth.auth();
    
    if (!cookieIsExist) {
        res.clearCookie("sessid");
        res.sendFile(app.get("views") + "index.html");
    } else {
        res.redirect("/dashboard");
    }
});

router.get("/signup", (req, res) => {
    res.clearCookie("sessid");
    res.sendFile(app.get("views") + "signup.html");
});

router.get("/dashboard", async (req, res) => {
    
    let cookieAuth = new CookieAuth(req.cookies);
    let cookieIsExist = await cookieAuth.auth();
    
    if (!cookieIsExist) {
        // res.setHeader("Content-Type", "text/html");
        res.redirect("/");
    }

    let userType = cookieAuth.getUserType();
    let resFile = app.get("views");
    
    if (userType === "boss") {
        resFile += "bossDashboard.html";
    } else if (userType == "employee") {
        resFile += "employeeDashboard.html";
    }
    
    // resFile += "bossDashboard.html";
    res.sendFile(resFile);
});

export default router;