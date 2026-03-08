import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";
import { imageUpload } from "../utils/imageUploader.js";

const updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", gender, about = "", contactNumber } = req.body;
    const userId = req.user.id;

    if (!contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "Contact number and gender are required.",
      });
    }

    // Find user
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Find profile
    const profileDetails = await Profile.findById(
      userDetails.additionalDetails,
    );
    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    // Update fields
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: profileDetails,
    });
  } catch (error) {
    console.error("Error while updating profile:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
      error: error.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this account. Only students can perform this action.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete profile details
    const profileId = user.additionalDetails;
    await Profile.findByIdAndDelete(profileId);

    // delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user account",
      error: error.message,
    });
  }
};

const updateProfilePicture = async (req, res) => {
  // get image from req.file
  // profile pic upload
  // update link in userimage user schmea
  try {
    if (!req.file) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const imageUrl = await imageUpload(req.file);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        image: imageUrl,
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile update successfully",
      data: user.image,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: error.message,
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing in the request.",
      });
    }

    const user = await User.findById(userId)
      .populate("additionalDetails")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details.",
      error: error.message,
    });
  }
};

export { updateProfile, deleteAccount, updateProfilePicture, getUserDetails };
