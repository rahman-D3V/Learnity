import { Category } from "../models/Category.js";
import { Course } from "../models/Course.js";

const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const isCategoryExist = await Category.findOne({ name: name.trim() });

    if (isCategoryExist) {
      return res.status(409).json({
        success: false,
        message: "A Category with this name already exists",
      });
    }

    const newCategory = await Category.create({
      name: name.trim(),
      description: description?.trim(),
    });
    console.log(newCategory);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create Category.",
      error: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().select("name description");
    res.status(200).json({
      success: true,
      message: "Categories Fetched Successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
      error: error.message,
    });
  }
};

const categoryPageDetails = async (req, res) => {
  const { categoryId } = req.body;

  const selectedCateory = await Category.findById(categoryId).populate({
    path: "courses",
    select: "courseName courseDescription thumbnail price",
    populate: {
      path: "ratingAndReviews",
      select: "rating review",
    },
  });

  if (!selectedCateory) {
    console.log("Category not found.");
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  const differentCategories = await Category.find({
    _id: { $ne: categoryId },
  })
    .populate("courses")
    .exec();

  // most top-10 selling course
  const topSellingCourses = await Course.aggregate([
    {
      $addFields: {
        studentCount: { $size: "$studentsEnrolled" },
      },
    },
    {
      $sort: { studentCount: -1 },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "ratingAndReviews",
        localField: "ratingAndReviews",
        foreignField: "_id",
        as: "ratingAndReviews",
      },
    },
    {
      $project: {
        courseName: 1,
        courseDescription: 1,
        thumbnail: 1,
        price: 1,
        ratingAndReviews: {
          rating: 1,
        },
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    data: {
      selectedCateory,
      differentCategories,
      topSellingCourses,
    },
  });
};

export { createCategory, getAllCategories, categoryPageDetails };

// Tags are created only by the admin.
// Instructors and students are not allowed to create tags.
// Tags are currently created via Postman (admin access only).
