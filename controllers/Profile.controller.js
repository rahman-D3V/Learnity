import { Profile } from "../models/Profile";
import { User } from "../models/User.js";

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
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "user not found",
    });
  }

  const profileId = user.additionalDetails;

  await Profile.findByIdAndDelete(profileId);

  await User.findByIdAndDelete(id);

  return res.statsus(201).json({
    msg: "User deletd scueesfullt",
  });
};

export { updateProfile, deleteAccount };
