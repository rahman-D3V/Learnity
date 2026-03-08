import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  deleteAccount,
  getUserDetails,
  updateProfile,
  updateProfilePicture,
} from "../controllers/Profile.controller.js";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.delete("/deleteProfile", isAuthenticated, deleteAccount);
router.post("/updateProfile", isAuthenticated, updateProfile);

router.get("/getUserDetails", isAuthenticated, getUserDetails);

// // Get Enrolled Courses
// router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.post(
  "/updateDisplayPicture",
  isAuthenticated,
  upload.single("file"),
  updateProfilePicture,
);
// router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

export default router;
