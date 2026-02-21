import mongoose from "mongoose";
import { sendOTPMail } from "../utils/sendOTPMail.js";

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  OTP: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

// export async function sendVerificationMail(email, otp) {
//   try {
//     const mailResponse = await sendOTPMail(email, otp);
//     console.log("Email send successfully");
//   } catch (error) {
//     console.log("Error while sending mail", error.message);
//   }
// }

OTPSchema.pre("save", async function (next) {
  try {
    await sendOTPMail(this.email, this.OTP);
    console.log("Email send successfully");
    next();
  } catch (error) {
    console.log("Error while sending mail", error.message);
  }
});

export const OTP = mongoose.model("OTP", OTPSchema);
