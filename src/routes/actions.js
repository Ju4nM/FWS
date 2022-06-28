import express from 'express';
import Jefe from './../controllers/jefes.controller.js'
import Cipher from './../helpers/crypt.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    let {userName, password, userType} = req.body;
    
    let data = await Jefe.login(userName, password)
    
    await Cipher.hash(password);

    console.log(data);
    res.send(JSON.stringify(data));
    // console.log(JSON.stringify(data));
    // res.send(JSON.stringify(data));
    // res.send(`Datos recibidos ${userName}, ${password}, ${userType}`);
    // console.log(req.body);
});

export default router;