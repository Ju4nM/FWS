import express from "express";
// import path from "path";
// import sesion from "express-session"
import config from './config.js';
import bodyParser from 'body-parser';
import posts from './routes/posts.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('port', config.port)


app.use('/', posts);

export default app;
