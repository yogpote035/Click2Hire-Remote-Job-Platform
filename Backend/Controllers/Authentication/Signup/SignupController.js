const JobSeekerModel = require("../../../Models/JobSeekerModel");
const EmployerModel = require("../../../Models/EmployerModel");
const bcrypt = require("bcrypt");
const CreateToken = require("../../../Middleware/CreateToken");

module.exports.JobSeekerSignup = async (req, res) => {
  console.log("Received request for Job Seeker Signup");
  const { fullName, email, mobileNumber, password } = req.body;
  if (!fullName || !email || !mobileNumber || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const existingUser = await JobSeekerModel.findOne({ email });
    if (existingUser) {
      return res.status(203).json({ message: "Email already exists." });
    }
    const existingUserPhone = await JobSeekerModel.findOne({ mobileNumber });
    if (!existingUser && existingUserPhone) {
      return res.status(204).json({ message: "Phone Number Already exists." });
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
    let existingUser;
    existingUser = await EmployerModel.findOne({ email });
    if (existingUser) {
      return res.status(203).json({ message: "Email already exists." });
    }
    let existingUserPhone = await EmployerModel.findOne({ mobileNumber });
    if (existingUserPhone) {
      return res.status(204).json({ message: "Phone Number already exists." });
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
