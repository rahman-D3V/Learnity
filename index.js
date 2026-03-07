import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.config.js";

configDotenv();
const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
  res.send("Hola");
});

app.get("/test", (req, res) => {
  res.send(`<h1>Testing Route<h1/>`);
});

app.listen(process.env.PORT, () => {
  console.log("server start successfully");
});
