import express from "express";
import path from "path";
import config from './config.js';
import bodyParser from 'body-parser';
import posts from './routes/posts.js';
import dashRoutes from "./routes/dashRoutes.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("views", path.resolve() + "\\src\\views\\");
app.set("port", config.port)


app.use("/", dashRoutes);
app.use("/", posts);

export default app;
