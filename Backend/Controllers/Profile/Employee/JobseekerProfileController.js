const EmployeeProfileModel = require("../../../Models/Employee/JobSeekerProfileModel");

// Create new profile
exports.createProfile = async (req, res) => {
  console.log("Request receive in createProfile job");
  try {
    const userId = req.body.userId || req.user.userId;
    if (req.user.role === "employer") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const { fullName, email, mobileNumber } = req.body;
    if (!userId || !fullName || !email || !mobileNumber) {
      return res.status(406).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingProfile = await EmployeeProfileModel.findOne({ userId });
    if (existingProfile) {
      return res.status(208).json({
        success: false,
        message: "Profile already exists. You can edit or delete it.",
      });
    }

    // merge uploadResults into body
    const profileData = {
      ...req.body,
      userId,
    };

    if (req?.uploadResults?.profilePicture) {
      profileData.profilePicture = {
        url: req?.uploadResults?.profilePicture?.url,
        publicId: req?.uploadResults?.profilePicture?.publicId,
      };
    }

    if (req?.uploadResults?.resumeUrl) {
      profileData.resumeUrl = {
        url: req.uploadResults.resumeUrl.url,
        publicId: req.uploadResults.resumeUrl.publicId,
      };
    }
    console.log("profile obj: ", profileData.profilePicture);
    console.log("------++++++++++++********////++++++++------------");
    console.log("resume obj: ", profileData.resumeUrl);
    console.log("------------------------------++++++++------------");
    console.log("profile data before add: ", profileData);

    const profile = new EmployeeProfileModel(profileData);
    await profile.save();

    res.status(201).json({
      success: true,
      message: "Employee profile created successfully",
      data: profile,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Error creating profile",
      error: error.message,
    });
  }
};

// Get profile by User ID
exports.getProfileById = async (req, res) => {
  console.log("Request receive in getProfileById job");
  try {
    const userId = req.params.userId || req.user.userId;
    if (req.user.role === "employer") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const profile = await EmployeeProfileModel.findOne({ userId });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  console.log("Request receive in updateProfile job");

  try {
    const userId = req.params.userId || req.user.userId;
    if (req.user.role === "employer") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const existingProfile = await EmployeeProfileModel.findOne({ userId });
    if (!existingProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const profileData = {
      ...req.body,
    };

    if (req?.uploadResults?.profilePicture) {
      profileData.profilePicture = {
        url: req?.uploadResults?.profilePicture?.url,
        publicId: req?.uploadResults?.profilePicture?.publicId,
      };
    }

    if (req?.uploadResults?.resumeUrl) {
      profileData.resumeUrl = {
        url: req.uploadResults.resumeUrl.url,
        publicId: req.uploadResults.resumeUrl.publicId,
      };
    }
    console.log("profile obj: ", profileData.profilePicture);
    console.log("------++++++++++++********////++++++++------------");
    console.log("resume obj: ", profileData.resumeUrl);
    console.log("------------------------------++++++++------------");

    const updatedProfile = await EmployeeProfileModel.findOneAndUpdate(
      { userId },
      profileData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Delete profile
exports.deleteProfile = async (req, res) => {
  console.log("Request receive in deleteProfile job");

  try {
    const userId = req.params.userId || req.user.userId;
    if (req.user.role === "employer") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const profile = await EmployeeProfileModel.findOneAndDelete({ userId });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting profile",
      error: error.message,
    });
  }
};
