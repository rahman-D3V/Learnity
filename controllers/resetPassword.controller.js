import { User } from "../models/User.js";
import { sendResetPasswordMail } from "../utils/mailTemplates/sendResetPasswordMail.js";
import bcrypt from "bcrypt";

const resetPasswordToken = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register",
      });
    }

    const token = crypto.randomUUID();

    await User.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: token,
        resetPasswordExpiresIn: Date.now() + 5 * 60 * 1000,
      },
    );

    const url = `http://localhost:3000/reset-password/${token}`;

    // await sendResetPasswordMail(email, url); --> send mail

    return res.status(200).json({
      success: true,
      message: "Reset password email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const resetPassword = async (req, res) => {
  const { password, confirmPassword, token } = req.body;

  if (!password || !confirmPassword || !token) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  try {
    const userDetails = await User.findOne({
      resetPasswordToken: token,
    });

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (Date.now() > userDetails.resetPasswordExpiresIn) {
      return res.status(400).json({
        success: false,
        message: "Token expired. Please request a new one.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    userDetails.password = hashedPassword;
    userDetails.resetPasswordToken = undefined;
    userDetails.resetPasswordExpiresIn = undefined;

    await userDetails.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
