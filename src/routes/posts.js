import express from 'express';
import login from '../controllers/login.js';
import signup from '../controllers/signup.js';
const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);

// router.get("/dashboard", (req, res) => {
    // res.sendFile(controlPanel.html");
    // res.send(path.resolve + "\\public\\controlPanel.html");
// });

export default router;