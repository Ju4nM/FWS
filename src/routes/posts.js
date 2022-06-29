import express from 'express';
import login from '../controllers/login.js';

const router = express.Router();

router.post('/login', login);

// router.get("/", (req, res) => {
//     res.sendFile(path.resolve() + "\\public\\controlPanel.html");
// })

router.get("/dashboard", (req, res) => {
    // res.sendFile(controlPanel.html");
    // res.send(path.resolve + "\\public\\controlPanel.html");
});

export default router;