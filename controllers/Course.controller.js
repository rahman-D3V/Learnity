import { Course } from "../models/Course";
import { Tag } from "../models/Tag.js";
import { User } from "../models/User.js";
import { imageUpload } from "../utils/imageUploader.js";

const createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, price, whatYouWillLearn, tag } =
      req.body;

    if (
      !courseName?.trim() ||
      !courseDescription?.trim() ||
      !price ||
      !whatYouWillLearn?.trim() ||
      !tag
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

    // Validate tag ID (extra safety for Postman/manual requests).

    const tagDetails = await Tag.findById(tag);

    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Invalid tag provided.",
      });
    }

    // Upload course thumbnail to ImageKit
    const uploadThumbnail = await imageUpload(req.file);

    const newCourse = await Course.create({
      courseName: courseName.trim(),
      courseDescription: courseDescription.trim(),
      price,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn.trim(),
      tag,
      thumbnail: uploadThumbnail,
    });

    // Add the newly created course ID to the instructor's courses array
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true },
    );

    // Add the new course ID to the tag's courses array
    await Tag.findByIdAndUpdate(tag, {
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

export { createCourse, getAllCourses };
