import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseDescription: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    whatYouWillLearn: {
      type: String,
    },
    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
    ratingAndReview: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
      },
    ],
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    //   language: {
    //     type: String,
    //     required: true,
    //   },
  },
  { timestamps: true },
);

export const Course = mongoose.model("Course", courseSchema);
