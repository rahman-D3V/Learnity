import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./controllers/database.js";
import cookieParser from "cookie-parser";


configDotenv();
const app = express();

app.use(express.json());
app.use(cookieParser())

connectDB();

app.get("/", (req, res) => {
  res.send("Hola");
});


app.listen(process.env.PORT, () => {
  console.log("server start successfully");
});
