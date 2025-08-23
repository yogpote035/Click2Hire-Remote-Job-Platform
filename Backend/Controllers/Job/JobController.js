const JobSeekerProfileModel = require("../../Models/Employee/JobSeekerProfileModel");
const EmployerProfileModel = require("../../Models/Employer/EmployerProfileModel");
const JobPostingModel = require("../../Models/Employer/JobPostingModel");
exports.getAllJobs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await JobSeekerProfileModel.findOne({ userId: userId });
    if (!profile) {
      return res.status(404).json({
        message:
          "Your Job Profile Is Missing, Please Create Your Job Profile first",
      });
    }
    if (req.user.role !== "jobseeker") {
      return res.status(400).json({
        message: "This Feature Only For Employee",
      });
    }
    const userSkills = profile?.skills;

    const jobs = await JobPostingModel.aggregate([
      {
        $addFields: {
          matchedSkills: {
            $filter: {
              input: "$skillsRequired",
              as: "req",
              cond: {
                $or: userSkills.map((skill) => ({
                  $regexMatch: { input: "$$req", regex: skill, options: "i" },
                })),
              },
            },
          },
        },
      },
      {
        $addFields: { matchedCount: { $size: "$matchedSkills" } },
      },
      { $match: { matchedCount: { $gt: 0 } } }, // only jobs with at least 1 match
      { $sort: { matchedCount: -1 } }, // best matches first
    ]);

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getJobById = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const job = await JobPostingModel.findById(req.params.id).populate(
      "employerProfileId",
      "companyName companyLogo"
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    //  get user profile to compare skills
    const userProfile = await JobSeekerProfileModel.findOne({ userId }).select(
      "skills"
    );

    let matchedSkills = [];
    let matchCount = 0;

    if (userProfile?.skills?.length > 0 && job.skillsRequired?.length > 0) {
      matchedSkills = job.skillsRequired.filter((skill) =>
        userProfile.skills.includes(skill)
      );
      matchCount = matchedSkills.length;
    }

    res.status(200).json({
      success: true,
      job: {
        ...job.toObject(),
        matchedSkills,
        matchCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchJobs = async (req, res) => {
  try {
    console.log("Request in Search Job: ");
    const { query, location } = req.query;

    if (!query && !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least skills/title or location",
      });
    }

    console.log("Query: ", query);
    console.log("Location: ", location);
    let filters = {};

    // Case-insensitive search on title or skills
    if (query) {
      filters.$or = [
        { title: { $regex: query, $options: "i" } },
        { skillsRequired: { $regex: query, $options: "i" } },
      ];
    }

    if (location) {
      filters.location = { $regex: location, $options: "i" };
    }

    const jobs = await JobPostingModel.find(filters).populate(
      "employerProfileId",
      "companyName companyLogo"
    );

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
