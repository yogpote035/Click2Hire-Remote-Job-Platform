const JobSeekerModel = require("../../../Models/Employee/JobSeekerModel");
const EmployerModel = require("../../../Models/Employer/EmployerModel");
const bcrypt = require("bcrypt");
const CreateToken = require("../../../Middleware/CreateToken");

module.exports.JobSeekerSignup = async (req, res) => {
  console.log("Received request for Job Seeker Signup");
  const { fullName, email, mobileNumber, password } = req.body;
  if (!fullName || !email || !mobileNumber || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const existingUserJob = await JobSeekerModel.findOne({ email });
    if (existingUserJob) {
      return res
        .status(203)
        .json({ message: "Email already exists. As Employee" });
    }

    const existingUserEmployer = await EmployerModel.findOne({ email });
    if (existingUserEmployer) {
      return res
        .status(203)
        .json({ message: "Email already exists. As Employer" });
    }

    const existingUserPhoneJobSeeker = await JobSeekerModel.findOne({
      mobileNumber,
    });

    if (existingUserPhoneJobSeeker) {
      return res
        .status(204)
        .json({ message: "Phone Number Already exists. As Employee" });
    }

    const existingUserPhoneEmployer = await EmployerModel.findOne({
      mobileNumber,
    });

    if (existingUserPhoneEmployer) {
      return res
        .status(204)
        .json({ message: "Phone Number Already exists. As Employer" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new JobSeekerModel({
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
    });
    await newUser.save();
    console.log("Call Goes to CreateToken To Signup Jobseeker");
    const token = await CreateToken(
      newUser._id,
      newUser.role,
      newUser.email,
      newUser.fullName
    );
    console.log("Call Back from CreateToken To Signup Jobseeker");
    res.status(200).json({
      message: "Login successful!",
      id: newUser._id,
      fullName: newUser.fullName,
      role: newUser.role,
      token: token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.EmployerSignup = async (req, res) => {
  console.log("Received request for Employer Signup");
  const { fullName, email, mobileNumber, password, companyName } = req.body;
  if (!fullName || !email || !mobileNumber || !password || !companyName) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const existingUserEmployer = await EmployerModel.findOne({ email });
    const existingUserJobseeker = await JobSeekerModel.findOne({ email });
    if (existingUserEmployer) {
      return res
        .status(203)
        .json({ message: "Email already exists. As Employer" });
    }
    if (existingUserJobseeker) {
      return res
        .status(203)
        .json({ message: "Email already exists. As Employee" });
    }

    let existingUserPhoneEmployer = await EmployerModel.findOne({
      mobileNumber,
    });
    let existingUserPhoneEmployee = await JobSeekerModel.findOne({
      mobileNumber,
    });
    if (existingUserPhoneEmployer) {
      return res
        .status(204)
        .json({ message: "Phone Number already exists. As Employer" });
    }
    if (existingUserPhoneEmployee) {
      return res
        .status(204)
        .json({ message: "Phone Number already exists. As Employee" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new EmployerModel({
      fullName,
      email,
      mobileNumber,
      companyName,
      password: hashedPassword,
    });
    await newUser.save();
    console.log("Call Goes to CreateToken To Signup Employer");
    const token = await CreateToken(
      newUser._id,
      newUser.role,
      newUser.email,
      newUser.fullName
    );
    console.log("Call Back from CreateToken To Signup Employer");
    res.status(200).json({
      message: "Signup successful!",
      id: newUser._id,
      fullName: newUser.fullName,
      role: newUser.role,
      token: token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
