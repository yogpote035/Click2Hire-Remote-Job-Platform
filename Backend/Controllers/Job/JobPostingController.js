const JobPosting = require("../../Models/Employer/JobPostingModel");
const EmployerProfileModel = require("../../Models/Employer/EmployerProfileModel");

exports.createJobPosting = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const employerId = req.user.userId; // from auth middleware
    const employerProfile = await EmployerProfileModel.findOne({
      userId: employerId,
    });

    if (!employerProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Create your profile first." });
    }

    const job = new JobPosting({
      ...req.body,
      employerId,
      employerProfileId: employerProfile._id,
    });

    await job.save();
    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Error creating job", error: err.message });
  }
};

// Get single job posting
exports.getJobById = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id).populate(
      "employerProfileId",
      "companyName industry companyLogo"
    );

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job", error: err.message });
  }
};

// Get jobs posted by logged-in employer
exports.getMyJobs = async (req, res) => {
  try {
    console.log("Request in my Job Employer Post ");
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const jobs = await JobPosting.find({ employerId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching employer jobs", error: err.message });
  }
};

// Update a job posting
exports.updateJobPosting = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }
    const job = await JobPosting.findOneAndUpdate(
      { _id: req.params.id, employerId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!job)
      return res.status(404).json({ message: "Job not found or unauthorized" });

    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Error updating job", error: err.message });
  }
};

// Delete a job posting
exports.deleteJobPosting = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const job = await JobPosting.findOneAndDelete({
      _id: req.params.id,
      employerId: req.user.userId,
    });

    if (!job)
      return res.status(404).json({ message: "Job not found or unauthorized" });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
};

// Close job (mark as closed)
exports.closeJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const job = await JobPosting.findOneAndUpdate(
      { _id: req.params.id, employerId: req.user.userId },
      { status: "Closed", isActive: false },
      { new: true }
    );

    if (!job)
      return res.status(404).json({ message: "Job not found or unauthorized" });

    res.json({ message: "Job closed successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Error closing job", error: err.message });
  }
};
