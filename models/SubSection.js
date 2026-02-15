import mongoose from "mongoose";

const SubSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
});

export const SubSection = mongoose.model("SubSection", SubSectionSchema);
