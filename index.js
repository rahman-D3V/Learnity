import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/database.config.js";

import courseRoutes from "./routes/Course.routes.js";
import contactRoutes from "./routes/Contact.routes.js";
import paymentRoutes from "./routes/Payment.routes.js";
import profileRoutes from "./routes/Profile.routes.js";
import userRoutes from "./routes/User.routes.js";

configDotenv();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

connectDB();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send(`<h1>Server is up and running</h1>`);
});

app.listen(PORT, () => {
  console.log("server start successfully");
});
