import express from 'express';
import app from "../app.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(app.get("views") + "index.html");
});

export default router;