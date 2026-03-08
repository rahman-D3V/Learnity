import express from "express";
import {
  changePassword,
  login,
  sendOTP,
  signup,
} from "../controllers/Auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  resetPassword,
  resetPasswordToken,
} from "../controllers/ResetPassword.controller.js";

const router = express.Router();


// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP);

// Route for Changing the password
router.post("/changepassword", isAuthenticated, changePassword);


// ********************************************************************************************************
//                                      Reset Password routes
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);

// Export the router for use in the main application

export default router;
