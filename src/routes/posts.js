import express from 'express';
import login from '../controllers/login.js';
import signup from '../controllers/signup.js';
const router = express.Router();

router.post('/login', login);

<<<<<<< HEAD
=======
// router.get("/", (req, res) => {
//     res.sendFile(path.resolve() + "\\public\\controlPanel.html");
// })

router.post('/signup', signup);

router.get("/dashboard", (req, res) => {
    // res.sendFile(controlPanel.html");
    // res.send(path.resolve + "\\public\\controlPanel.html");
});
>>>>>>> 38dd209d8e1cd6af1412fc1db1db86c5ac6b9a41

export default router;