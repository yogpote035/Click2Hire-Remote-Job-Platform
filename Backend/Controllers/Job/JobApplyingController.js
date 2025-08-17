// controllers/jobApplicationController.js
const JobApplicationModel = require("../../Models/Employee/JobApplicationModel");
const JobPostingModel = require("../../Models/Employer/JobPostingModel");
const JobSeekerProfileModel = require("../../Models/Employee/EmployeeProfileModel");

exports.applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(401).json({ message: "Only jobseekers can apply" });
    }

    const { jobPostId, resume, coverLetter } = req.body;
    if (!jobPostId || !resume) {
      return res.status(400).json({ message: "Job and Resume are required" });
    }

    const profile = await JobSeekerProfileModel.findOne({
      userId: req.user.userId,
    });
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Complete your profile first." });
    }

    const activeJob = JobPostingModel.findById(jobPostId);
    if (activeJob.status === "Closed") {
      return res
        .status(401)
        .json({ message: "Job is Closed No Longer Application Accepting" });
    }
    const application = new JobApplicationModel({
      jobPostId,
      userProfileId: profile._id,
      resume,
      coverLetter,
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications of logged-in jobseeker
exports.getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const profile = await JobSeekerProfileModel.findOne({
      userId: req.user.userId,
    });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const applications = await JobApplicationModel.find({
      userProfileId: profile._id,
    })
      .populate("jobPostId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single application (jobseeker can see their own)
exports.getApplication = async (req, res) => {
  try {
    const profile =
      req.user.role === "jobseeker"
        ? await JobSeekerProfileModel.findOne({ userId: req.user.userId })
        : null;

    const query = { _id: req.params.id };
    if (req.user.role === "jobseeker") query.userProfileId = profile._id;

    const application = await JobApplicationModel.findOne(query)
      .populate("jobPostId")
      .populate("userProfileId");

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Withdraw (Delete) Application
exports.withdrawApplication = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(401).json({ message: "Only jobseekers can withdraw" });
    }

    const profile = await JobSeekerProfileModel.findOne({
      userId: req.user.userId,
    });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const application = await JobApplicationModel.findOne({
      _id: req.params.id,
      userProfileId: profile._id,
    });

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    await JobApplicationModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
