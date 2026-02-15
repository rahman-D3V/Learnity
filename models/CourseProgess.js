import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema,
);
