import express from 'express';
import app from "../app.js";
import login from '../controllers/login.js';

const router = express.Router();

router.post('/login', login);

export default router;