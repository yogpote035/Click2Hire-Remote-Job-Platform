const EmployerProfileModel = require("../../../Models/Employer/EmployerProfileModel");

// Validate Email
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

// Validate Mobile
const isValidMobile = (mobile) => /^[0-9]{10,15}$/.test(mobile);

// Validate URL
const isValidURL = (url) => /^https?:\/\/.+\..+/.test(url);

exports.createEmployerProfile = async (req, res) => {
  console.log("Request receive in createProfile Employer");

  try {
    const {
      companyName,
      email,
      mobileNumber,
      companyLogo,
      companyWebsite,
      industry,
      companySize,
      location,
      companyDescription,
      contactEmail,
      socialLinks,
      jobPostLimit,
      activeJobPosts,
      hiringStatus,
      role,
    } = req.body;

    const userId = req.body.userId || req.header("userId");
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!companyName || !email || !mobileNumber) {
      return res
        .status(400)
        .json({ message: "Company name, email & mobile number are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (!isValidMobile(mobileNumber)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    if (contactEmail && !isValidEmail(contactEmail)) {
      return res.status(400).json({ message: "Invalid contact email" });
    }

    if (socialLinks && Array.isArray(socialLinks)) {
      for (const link of socialLinks) {
        if (link.url && !isValidURL(link.url)) {
          return res
            .status(400)
            .json({ message: `Invalid social link URL: ${link.url}` });
        }
      }
    }

    const existingProfile = await EmployerProfileModel.findOne({ userId });
    if (existingProfile) {
      return res.status(208).json({
        message: "Profile already exists, you can edit or delete it",
      });
    }

    const profile = await EmployerProfileModel.create({
      userId,
      companyName,
      email,
      mobileNumber,
      companyLogo,
      companyWebsite,
      industry,
      companySize,
      location,
      companyDescription,
      contactEmail,
      socialLinks,
      jobPostLimit,
      activeJobPosts,
      hiringStatus,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Employer profile created successfully",
      data: profile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating employer profile",
      error: error.message,
    });
  }
};

exports.getAllEmployers = async (req, res) => {
  try {
    const profiles = await EmployerProfileModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employer profiles",
      error: error.message,
    });
  }
};

exports.getEmployerById = async (req, res) => {
  console.log("Request receive in get pro Employer");

  try {
    const profile = await EmployerProfileModel.find({
      userId: req.params.id || req.user.userId,
    });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Employer profile not found" });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employer profile",
      error: error.message,
    });
  }
};

exports.updateEmployerProfile = async (req, res) => {
  console.log("Request receive in update employer pro");

  try {
    const updates = req.body;

    if (updates.email && !isValidEmail(updates.email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (updates.mobileNumber && !isValidMobile(updates.mobileNumber)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    if (updates.contactEmail && !isValidEmail(updates.contactEmail)) {
      return res.status(400).json({ message: "Invalid contact email" });
    }

    if (updates.socialLinks && Array.isArray(updates.socialLinks)) {
      for (const link of updates.socialLinks) {
        if (link.url && !isValidURL(link.url)) {
          return res
            .status(400)
            .json({ message: `Invalid social link URL: ${link.url}` });
        }
      }
    }

    const profile = await EmployerProfileModel.findOneAndUpdate(
      { userId: req?.params?.id || req?.user?.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Employer profile not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employer profile updated successfully",
      data: profile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating employer profile",
      error: error.message,
    });
  }
};

exports.deleteEmployerProfile = async (req, res) => {
  console.log("Request receive in delete Employer pro");

  try {
    const profile = await EmployerProfileModel.findOneAndDelete({
      userId: req.params.id || req.user.userId,
    });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Employer profile not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employer profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting employer profile",
      error: error.message,
    });
  }
};

// exports.incrementJobPosts = async (req, res) => {
//   try {
//     const profile = await EmployerProfileModel.findById(req.params.id);

//     if (!profile) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Employer profile not found" });
//     }

//     if (profile.activeJobPosts >= profile.jobPostLimit) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Job post limit reached" });
//     }

//     profile.activeJobPosts += 1;
//     await profile.save();

//     res.status(200).json({
//       success: true,
//       message: "Job post count incremented",
//       data: profile,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error incrementing job posts",
//       error: error.message,
//     });
//   }
// };

// exports.decrementJobPosts = async (req, res) => {
//   try {
//     const profile = await EmployerProfileModel.findById(req.params.id);

//     if (!profile) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Employer profile not found" });
//     }

//     if (profile.activeJobPosts > 0) {
//       profile.activeJobPosts -= 1;
//       await profile.save();
//     }

//     res.status(200).json({
//       success: true,
//       message: "Job post count decremented",
//       data: profile,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error decrementing job posts",
//       error: error.message,
//     });
//   }
// };
