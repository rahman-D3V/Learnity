import { Category } from "../models/Category.js";
import { Course } from "../models/Course.js";
import { User } from "../models/User.js";
import { imageUpload } from "../utils/imageUploader.js";

const createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      price,
      whatYouWillLearn,
      category,
      tags,
    } = req.body;

    if (
      !courseName?.trim() ||
      !courseDescription?.trim() ||
      !price ||
      !whatYouWillLearn?.trim() ||
      !category ||
      !tags
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // req.file is added by multer middleware (upload.single("file")).
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Course thumbnail is required.",
      });
    }

    // checking for instructor

    const userID = req.user.id;

    const instructorDetails = await User.findById(userID);

    if (!instructorDetails) {
      return res.status(500).json({
        success: false,
        message: "Instructor not found.",
      });
    }

    // Validate category ID (extra safety for Postman/manual requests).

    const categoryDetails = await Category.findById(category);

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Invalid category provided.",
      });
    }

    // Upload course thumbnail to ImageKit
    const uploadThumbnail = await imageUpload(req.file);

    const tagsArray = tags.split(",").map(tag => tag.trim());

    const newCourse = await Course.create({
      courseName: courseName.trim(),
      courseDescription: courseDescription.trim(),
      price,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn.trim(),
      category: categoryDetails._id,
      thumbnail: uploadThumbnail,
      tags: tagsArray,
    });

    // Add the newly created course ID to the instructor's courses array
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true },
    );

    // Add the new course ID to the category's schema courses array
    await Category.findByIdAndUpdate(category, {
      $push: { courses: newCourse._id },
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: newCourse,
    });
  } catch (error) {
    console.log("Error while creating course:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the course.",
      error: error.message,
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReview: true,
        studentsEnrolled: true,
      },
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully.",
      data: courses,
    });
  } catch (error) {
    console.log("Error while Fetching courses: ", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses.",
      error: error.message,
    });
  }
};

const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course details retrieved successfully.",
      data: courseDetails,
    });
  } catch (error) {
    console.error("Error while fetching course details:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching course details.",
      error: error.message,
    });
  }
};

export { createCourse, getAllCourses, getCourseDetails };
