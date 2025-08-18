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

const JobApplicationModel = mongoose.model(
  "JobApplicationModel",
  jobApplicationSchema
);

module.exports = JobApplicationModel;
