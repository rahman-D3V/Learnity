import { SubSection } from "../models/SubSection.js";
import { Section } from "../models/Section.js";
import { imageUpload } from "../utils/imageUploader.js";

const createSubsection = async (req, res) => {
  try {
    const { title, description, timeDuration, sectionId } = req.body;
    const video = req.file;

    if (!title || !description || !timeDuration || !sectionId || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    //upload video to imagekit and get the url;
    // Reject files larger than 99MB on the frontend.
    const uploadedVideo = await imageUpload(video);

    const subSection = await SubSection.create({
      description,
      title,
      timeDuration,
      uploadedVideo,
    });

    await Section.findByIdAndUpdate(sectionId, {
      $push: { subSection: subSection._id },
    });

    return res.status(201).json({
      success: true,
      message: "Subsection created successfully.",
      data: subSection,
    });
  } catch (error) {
    console.error("Error while creating subsection:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Subsection",
      error: error.message,
    });
  }
};

const updateSubsection = async (req, res) => {
  try {
    const { title, description, timeDuration, subSectionId } = req.body;

    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "Subsection ID is required.",
      });
    }

    const updatedSubSectionDetails = {};

    if (title) updateSubsection.title = title;
    if (description) updateSubsection.description = description;
    if (timeDuration) updateSubsection.timeDuration = timeDuration;

    if (Object.keys(updatedSubSectionDetails).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update.",
      });
    }

    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      updatedSubSectionDetails,
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Subsection updated successfully.",
      data: updatedSubSection,
    });
  } catch (error) {
    console.error("Error while updating subsection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update Subsection.",
      error: error.message,
    });
  }
};

const deleteSubsection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Subsection ID and Section ID are required.",
      });
    }

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found.",
      });
    }

    await SubSection.findByIdAndDelete(subSectionId);

    //now delete subsection id from section schema
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { subSection: subSectionId },
    });

    return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully.",
    });
  } catch (error) {
    console.error("Error while deleting subsection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete subsection.",
      error: error.message,
    });
  }
};

export { createSubsection, updateSubsection, deleteSubsection };
