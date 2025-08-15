const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EmployerSchema = new Schema(
  {
    companyName: {
      //yes
      type: String,
      required: true,
    },
    fullName: {
      //yes
      type: String,
      required: true,
    },
    email: {
      //yes
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      //yes
      type: String,
      required: true,
    },
    password: {
      //yes
      type: String,
      required: true,
    },
    role: {
      //yes i have to pass or if not pass it will be employer
      type: String,
      enum: ["employer"],
      default: "employer",
    },
  },
  { timestamps: true }
);
const EmployerModel = mongoose.model("EmployerModel", EmployerSchema);
module.exports = EmployerModel;
