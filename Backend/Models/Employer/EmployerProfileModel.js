const mongoose = require("mongoose");

const EmployerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployerModel",
      required: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      match: [/^[0-9]{10,15}$/, "Please enter a valid phone number"],
    },

    companyLogo: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/company-icon-simple-element-illustration-company-concept-symbol-design-can-be-used-web-mobile_159242-7784.jpg",
    },

    companyWebsite: {
      type: String,
      default: "Not Provided",
      match: [/^https?:\/\/.+\..+/, "Please enter a valid website URL"],
    },

    industry: {
      type: String,
      default: "Not specified",
    },

    companySize: {
      type: String,
      default: "Not specified",
    },

    location: {
      type: String,
      default: "Not specified",
    },

    companyDescription: {
      type: String,
      default: "No description provided",
    },

    contactEmail: {
      type: String,
      default: "Not Provided",
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    // Flexible social links
    socialLinks: {
      type: [
        {
          platform: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
            match: [/^https?:\/\/.+\..+/, "Please enter a valid URL"],
          },
        },
      ],
      default: [],
    },

    jobPostLimit: {
      type: Number,
      default: 10000,
    },

    activeJobPosts: {
      type: Number,
      default: 0, // Keep track of how many jobs employer has posted
    },

    hiringStatus: {
      type: String,
      enum: ["Hiring", "Not Hiring", "On Hold"],
      default: "Hiring",
    },

    role: {
      type: String,
      enum: ["employer"],
      default: "employer",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EmployerProfileModel = mongoose.model(
  "EmployerProfile",
  EmployerProfileSchema
);

module.exports = EmployerProfileModel;
