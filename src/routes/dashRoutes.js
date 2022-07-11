import express from 'express';
import app from "../app.js";
import dashboard from "../controllers/dashboard.controller.js";
import CookieAuth from '../utils/cookieAuth.js';

const router = express.Router();

router.get("/", async (req, res) => {
    
    let cookieAuth = new CookieAuth(req.cookies);
    let cookieIsExist = await cookieAuth.auth();
    
    if (!cookieIsExist) {
        res.clearCookie("sessid");
        res.render("index");
    } else {
        res.redirect("/dashboard");
    }
});

router.get("/signup", (req, res) => {
    res.clearCookie("sessid");
    res.render("signup");
});

router.get("/dashboard", dashboard);

router.get("/login", async (req, res) => {

    let cookieAuth = new CookieAuth(req.cookies);
    let cookieIsExist = await cookieAuth.auth();
    
    if (!cookieIsExist) {
        res.clearCookie("sessid");
        res.render("login");
    } else {
        res.redirect("/dashboard");
    }
});

router.get("/about", (req, res) => {
    res.render("acercade");
});

router.get("/logout", (req, res) => {
    res.clearCookie("sessid");
    res.send("Hola mundo");
})

export default router;