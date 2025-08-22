const mongoose = require("mongoose");
const EmployeeProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeekerModel",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    profilePicture: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: "No experience listed",
    },
    projects: {
      type: [
        {
          title: {
            type: String,
            default: "Title Not Provided",
          },
          description: {
            type: String,
            default: "Description Not Provided",
          },
          skills: {
            type: [String],
            default: [],
          },
          technologies: {
            type: [String],
            default: [],
          },
          sourceCode: {
            type: String,
            default: "No Url Provided",
          },
          liveUrl: {
            type: String,
            default: "No Live Url Provided",
          },
        },
      ],
      default: [],
    },
    education: {
      type: [
        {
          degree: { type: String, default: "Not Provided" },
          institution: { type: String, default: "Not Provided" },
          year: { type: String, default: "Not Provided" },
          CGPA: { type: String, default: "Not Provided" },
        },
      ],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    linkedinProfile: {
      type: String,
      default: "Not Provided",
    },
    githubProfile: {
      type: String,
      default: "Not Provided",
    },
    location: {
      type: String,
      default: "Not specified",
    },
    about: {
      type: String,
      default: "No information provided",
    },
    resumeUrl: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "jobseeker",
      required: true,
    },
    portfolioUrl: {
      type: String,
      default: "Not Provided",
    },
    jobPreferences: {
      type: String,
      default: "Not specified",
    },
    availability: {
      type: String,
      default: "Available",
    },
    expectedSalary: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const JobSeekerProfileModel = mongoose.model(
  "JobSeekerProfileModel",
  EmployeeProfileSchema
);

module.exports = JobSeekerProfileModel;
