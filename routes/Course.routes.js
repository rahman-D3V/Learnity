import express from "express";
import multer from "multer";
import { isAdmin, isAuthenticated, isInstructor, isStudent } from "../middlewares/auth.middleware.js";
import { createCourse, getAllCourses, getCourseDetails } from "../controllers/Course.controller.js";
import { createSection, deleteSection, updateSection } from "../controllers/Section.controller.js";
import { createSubsection, deleteSubsection, updateSubsection } from "../controllers/Subsection.controller.js";
import { categoryPageDetails, createCategory, getAllCategories } from "../controllers/Category.controller.js";
import { createRating, getAllRating, getAverageRating } from "../controllers/RatingAndReview.controller.js";

const router = express.Router();
const upload = multer();


// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", isAuthenticated, isInstructor, upload.single("thumbnailImage"), createCourse)
//Add a Section to a Course
router.post("/addSection", isAuthenticated, isInstructor, createSection)
// Update a Section
router.post("/updateSection", isAuthenticated, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", isAuthenticated, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", isAuthenticated, isInstructor, updateSubsection)
// Delete Sub Section
router.post("/deleteSubSection", isAuthenticated, isInstructor, deleteSubsection)
// Add a Sub Section to a Section
router.post("/addSubSection", isAuthenticated, isInstructor, upload.single("video"), createSubsection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)


// // Get Details for a Specific Courses
// router.post("/getFullCourseDetails", isAuthenticated, getFullCourseDetails)
// Edit Course routes
// router.post("/editCourse", isAuthenticated, isInstructor, editCourse)
// // Get all Courses Under a Specific Instructor
// router.get("/getInstructorCourses", isAuthenticated, isInstructor, getInstructorCourses)
// // Delete a Course
// router.delete("/deleteCourse", deleteCourse)

// router.post("/updateCourseProgress", isAuthenticated, isStudent, updateCourseProgress);




// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
router.post("/createCategory", isAuthenticated, isAdmin, createCategory)
router.get("/showAllCategories", getAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)




// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", isAuthenticated, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)



export default router