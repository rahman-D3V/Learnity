import { Tag } from "../models/Tag.js";

const createTag = async (req, res) => {
  const { tagName, tagDescription } = req.body;

  try {
    if (!tagName || !tagDescription) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isTagExist = await Tag.find({ name: tagName.trim() });

    if (isTagExist) {
      return res.status(409).json({
        success: false,
        message: "A tag with this name already exists",
      });
    }

    const newTag = await Tag.create({
      name: tagName.trim(),
      description: tagDescription.trim(),
    });
    console.log(tagDetails);

    return res.status(201).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create tag.",
      error: error.message,
    });
  }
};

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "Tags Fetched Successfully",
      tags: tags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tag.",
      error: error.message,
    });
  }
};

export { createTag, getAllTags };

// Tags are created only by the admin.
// Instructors and students are not allowed to create tags.
// Tags are currently created via Postman (admin access only).
