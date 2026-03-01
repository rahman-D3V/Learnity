import { Course } from "../models/Course.js";
import { Section } from "../models/Section.js";

const createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section name and course ID are required.",
      });
    }

    const section = await Section.create({
      sectionName,
    });

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: section._id },
      },
      { new: true },
    );

    // Populate section and subsection data so both are returned in the response.

    return res.status(201).json({
      success: true,
      message: "Section created successfully.",
    });
  } catch (error) {
    console.log("Error while creating section: ", error);

    return res.status(500).json({
      success: false,
      message: "Failed to Create section.",
      error: error.message,
    });
  }
};

const updateSection = async (req, res) => {
  try {
    const { newSectionName, sectionId } = req.body;

    if (!newSectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section ID and new section name are required.",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName: newSectionName },
      { new: true },
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Section updated successfully.",
      data: updatedSection,
    });
  } catch (error) {
    console.log("Error while updating section: ", error);

    return res.status(500).json({
      success: false,
      message: "Failed to Update section.",
      error: error.message,
    });
  }
};

const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section ID is required.",
      });
    }

    // TODO: Do we need to delete section from courseSchema?

    await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully.",
    });
  } catch (error) {
    console.log("Error while deleting section: ", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete section.",
      error: error.message,
    });
  }
};

export { createSection, updateSection, deleteSection };
