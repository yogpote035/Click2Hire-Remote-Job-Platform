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
    }, //done
    email: {
      type: String,
      required: true,
      unique: true,
    }, //done
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    }, //done
    profilePicture: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    }, //done
    skills: {
      type: [String],
      default: [],
    }, //done
    experience: {
      type: String,
      default: "No experience listed",
    }, //done
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
    }, //done
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
    }, //customized
    languages: {
      type: [String],
      default: [],
    }, //customized
    linkedinProfile: {
      type: String,
      default: "Not Provided",
    }, //Customized
    githubProfile: {
      type: String,
      default: "Not Provided",
    }, //done
    location: {
      type: String,
      default: "Not specified",
    }, //done
    about: {
      type: String,
      default: "No information provided",
    }, //done
    resumeUrl: {
      type: String,
      default: "Not Provided",
    }, //done
    role: {
      type: String,
      default: "jobseeker",
      required: true,
    }, //customized
    portfolioUrl: {
      type: String,
      default: "Not Provided",
    }, //done
    jobPreferences: {
      type: String,
      default: "Not specified",
    }, //customized
    availability: {
      type: String,
      default: "Available",
    }, //customized
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
