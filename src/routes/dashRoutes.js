import express from 'express';
import app from "../app.js";

const router = express.Router();

router.get("/", (req, res) => {
    
    res.sendFile(app.get("views") + "index.html");
});

router.get("/signup", (req, res) => {
    // res.clearCookie("sessid");
    res.sendFile(app.get("views") + "signup.html");
});

export default router;