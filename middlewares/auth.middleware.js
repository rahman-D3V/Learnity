import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

export const isAuthenticated = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const isStudent = (req, res, next) => {
  if (req.user.accountType !== "Student") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Login as Student",
    });
  }
  next();
};

export const isInstructor = (req, res, next) => {
  if (req.user.accountType !== "Instructor") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Login as instrcutor",
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.accountType !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Login as Admin",
    });
  }
  next();
};
