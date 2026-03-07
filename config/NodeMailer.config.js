import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";

configDotenv();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
