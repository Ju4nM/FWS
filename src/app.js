import express from "express";
import config from './config.js';
import bodyParser from 'body-parser';
import routesAction from './routes/actions.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('port', config.port)


app.use('/', routesAction);

export default app;
