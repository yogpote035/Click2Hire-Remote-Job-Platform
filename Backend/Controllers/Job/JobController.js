const JobPostingModel = require("../../Models/Employer/JobPostingModel");
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await JobPostingModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await JobPostingModel.findById(req.params.id);
    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
