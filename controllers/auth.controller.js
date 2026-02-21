import { OTP } from "../models/OTP.js";
import { User } from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Profile } from "../models/Profile.js";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email field is required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    let otp = crypto.randomInt(100000, 1000000).toString();

    let result = await OTP.findOne({ OTP: otp });

    while (result) {
      otp = crypto.randomInt(100000, 1000000).toString();
      result = await OTP.findOne({ OTP: otp });
    }

    await OTP.create({
      email,
      OTP: otp,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

const signUP = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    otp,
  } = req.body;

  try {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "ALL fields are required",
      });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({
        success: false,
        message: "password and confirmPassword should be same",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp[0].OTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const additionalProfileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const newUser = await User.create({
      firstName,
      lastName,
      accountType,
      additionalDetails: additionalProfileDetails._id,
      email,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "user successfully created",
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        accountType: newUser.accountType,
        image: newUser.image,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong. Please try again",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        success: true,
        token,
        user: payload,
        message: "Login Successful",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error. Try again",
    });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    //send mail that password updated successfully

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// https://api.dicebear.com/5.x/initials/svg?seed=${Asus}%20${Vivobook}
