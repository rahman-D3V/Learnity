import mongoose from "mongoose";
import { Course } from "../models/Course.js";
import { RatingAndReview } from "../models/RatingAndReview.js";

const createRating = async (req, res) => {
  // is user pucrhased it
  // is it frist time review
  // attach it to course of that particular course
  try {
    const { rating, review, courseId } = req.body;

    if (!rating || !review || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Rating, review and course ID are required.",
      });
    }

    const courseDetails = await Course.findById(courseId);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const isEnrolled = courseDetails.studentsEnrolled.some((id) =>
      id.equals(req.user.id),
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course to leave a review.",
      });
    }

    const alreadyReviewed = await RatingAndReview.findOne({
      course: courseId,
      user: req.user.id,
    });

    if (alreadyReviewed) {
      return res.status(409).json({
        success: false,
        message: "Course is already review by user",
      });
    }

    const newRatingAndReview = await RatingAndReview.create({
      rating,
      review,
      user: req.user.id,
      course: courseId,
    });

    courseDetails.ratingAndReviews.push(newRatingAndReview._id);
    await courseDetails.save();

    return res.status(201).json({
      success: true,
      message: "Review added successfully.",
      data: newRatingAndReview,
    });
  } catch (error) {
    console.error("Error while creating review:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add review.",
      error: error.message,
    });
  }
};

const getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const average = result.length > 0 ? result[0].averageRating : 0;

    return res.status(200).json({
      success: true,
      message: "Average rating calculated successfully.",
      data: average,
    });
  } catch (error) {
    console.error("Average rating error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const getAllRating = async (req, res) => {
  try {
    const ratingReview = await RatingAndReview.find()
      .sort({ rating: -1 })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Ratings fetched successfully.",
      data: ratingReview,
    });
  } catch (error) {
    console.error("Get all rating error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export { createRating, getAverageRating, getAllRating };
