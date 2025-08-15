const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const JobSeekerSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["jobseeker"],
      default: "jobseeker",
    },
  },
  { timestamps: true }
);
const JobSeekerModel = mongoose.model("JobSeekerModel", JobSeekerSchema);
module.exports = JobSeekerModel;