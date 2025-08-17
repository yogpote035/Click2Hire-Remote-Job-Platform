// models/JobApplication.js
const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    jobPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPostingModel",
      required: true,
    },
    //fix
    userProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeekerProfileModel",
      required: true, //fix
    },

    resume: {
      type: String,
      required: true,
    }, //think

    coverLetter: {
      type: String,
      required: true,
    }, //think

    status: {
      type: String,
      enum: [
        "Applied", //def [employer decide next]
        "Under Review",
        "Shortlisted",
        "Interview",
        "Offered",
        "Rejected",
        "Withdrawn",
      ],
      default: "Applied",
      required: true,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// After save --> increment application count in JobPosting
jobApplicationSchema.post("save", async function (doc) {
  try {
    const JobPostingModel = require("../Employer/JobPostingModel");
    const job = await JobPostingModel.findById(doc.jobPostId);
    if (job) await job.incrementApplications();
  } catch (err) {
    console.error("Error incrementing application count:", err);
  }
});

// After remove --> decrement application count in JobPosting
jobApplicationSchema.post("delete", async function (doc) {
  try {
    const JobPostingModel = require("../Employer/JobPostingModel");
    const job = await JobPostingModel.findById(doc.jobPostId);
    if (job) await job.decrementApplications();
  } catch (err) {
    console.error("Error decrementing application count:", err);
  }
});

const JobApplicationModel = mongoose.model(
  "JobApplicationModel",
  jobApplicationSchema
);

module.exports = JobApplicationModel;
