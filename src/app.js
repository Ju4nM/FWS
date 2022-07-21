import express from "express";
import bodyParser from 'body-parser';
import config from './config.js';
import path from "path";
import cookieParser from "cookie-parser";
import posts from './routes/posts.js';
import dashRoutes from "./routes/dashRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.set("views", path.resolve() + "\\src\\views\\");
app.set("view engine", "ejs");
app.set("port", config.port)

// Routes
app.use("/", dashRoutes);
app.use("/", posts);
app.use("/", productRoutes);

export default app;
