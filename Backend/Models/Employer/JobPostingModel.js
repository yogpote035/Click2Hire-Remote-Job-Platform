// models/JobPosting.js
const mongoose = require("mongoose");

const jobPostingSchema = new mongoose.Schema(
  {
    employerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployerProfile",
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployerModel",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },

    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Remote"],
      default: "Full-Time",
      required: true,
    },

    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "INR" },
    },

    skillsRequired: [{ type: String, required: true }],

    experienceLevel: {
      type: String,
      enum: ["Entry", "Mid", "Senior", "Lead"],
      required: true,
    },

    vacancies: {
      type: Number,
      default: 1,
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    jobCategory: {
      type: String, // e.g. "IT", "Finance", "Marketing"
    },

    educationRequired: {
      type: String, // e.g. "Bachelor's in CS", "MBA"
    },

    benefits: {
      type: [String], // e.g. "Health Insurance", "Flexible Hours", "Free Lunch"
    },

    remoteOption: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      default: "On-site",
      required: true,
    },

    applicationCount: {
      type: Number,
      default: 0,
      required: true,
    },

    status: {
      type: String,
      enum: ["Open", "Closed", "Draft"],
      default: "Open",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },

    // Extra Professional Fields
    jobLevel: {
      type: String,
      enum: [
        "Internship",
        "Entry-Level",
        "Mid-Level",
        "Senior-Level",
        "Director",
        "Executive",
      ],
      default: "Entry-Level",
      required: true,
    },

    workSchedule: {
      type: String,
      enum: ["Day Shift", "Night Shift", "Flexible", "Rotational"],
      required: true,
    },

    languagesRequired: [{ type: String }], // e.g. ["English", "Hindi"]

    applicationMethod: {
      type: String,
      enum: ["Easy Apply", "External Link", "Email"],
      default: "Easy Apply",
    },

    companyPerks: {
      type: [String], // e.g. ["Gym Membership", "Stock Options"]
    },

    postedBy: {
      type: String, // Recruiter/HR name
    },
  },
  { timestamps: true }
);

// Increment Application Count
jobPostingSchema.methods.incrementApplications = async function () {
  this.applicationCount += 1;
  await this.save();
};

// Decrement Application Count
jobPostingSchema.methods.decrementApplications = async function () {
  if (this.applicationCount > 0) {
    this.applicationCount -= 1;
    await this.save();
  }
};

const JobPostingModel = mongoose.model("JobPostingModel", jobPostingSchema);
module.exports = JobPostingModel;
