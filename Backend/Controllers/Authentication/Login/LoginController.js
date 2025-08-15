const OtpModel = require("../../../Models/OtpModel");
const JobSeekerModel = require("../../../Models/JobSeekerModel");
const EmployerModel = require("../../../Models/EmployerModel");
const bcrypt = require("bcrypt");
const CreateToken = require("../../../Middleware/CreateToken");
const nodemailer = require("nodemailer");

module.exports.LoginWithMobileAndPassword = async (req, res) => {
  console.log("Received request for Login with Mobile and Password");
  const { number: mobileNumber, password } = req.body;
  console.log("Request Body:", req.body);
  if (!mobileNumber || !password) {
    return res
      .status(400)
      .json({ message: "Mobile Number and Password are required." });
  }
  try {
    const user =
      (await JobSeekerModel.findOne({ mobileNumber })) ||
      (await EmployerModel.findOne({ mobileNumber }));

    if (!user) {
      return res.status(203).json({
        message:
          "Mobile Number Not Found. Please try again,or Verify Mobile Number.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(204).json({
        message:
          "Password Not Match. Please try Again And Verify Credentials...",
      });
    }

    console.log("Call Goes to CreateToken To Login With Mobile and Password");
    const token = await CreateToken(
      user._id,
      user.role,
      user.email,
      user.fullName
    );
    console.log("Call Back from CreateToken To Login");

    res.status(200).json({
      message: "Login successful!",
      id: user._id,
      fullName: user.fullName,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.LoginWithEmailAndPassword = async (req, res) => {
  console.log("Received request for Login with Email and Password");
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and Password are required." });
  }
  try {
    const user =
      (await JobSeekerModel.findOne({ email })) ||
      (await EmployerModel.findOne({ email }));
    if (!user) {
      return res.status(203).json({
        message: "Email Not Found. Please try again,or Verify Email.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(204).json({
        message:
          "Password Not Match. Please try Again And Verify Credentials...",
      });
    }
    console.log("Call Goes to CreateToken");
    const token = await CreateToken(
      user._id,
      user.role,
      user.email,
      user.fullName
    );
    console.log("Call Back from CreateToken To Login Email Password");

    res.status(200).json({
      message: "Login successful!",
      id: user._id,
      fullName: user.fullName,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.SentOtp = async (req, res) => {
  console.log("Received request to send OTP");
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const user =
    (await JobSeekerModel.findOne({ email })) ||
    (await EmployerModel.findOne({ email }));

  if (!user) {
    return res.status(203).json({
      message: "Email not found. Please try again or verify your email.",
    });
  }

  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Check if an OTP already exists for this email -> update instead of inserting new
    let otpRecord = await OtpModel.findOne({ email });
    if (otpRecord) {
      otpRecord.otp = otp;
      otpRecord.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    } else {
      otpRecord = new OtpModel({
        email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });
    }
    await otpRecord.save();

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or 'smtp'
      auth: {
        user: process.env.Mail_User, // your email
        pass: process.env.Mail_Password, // your email password / app password
      },
    });

    // Email content
    const mailOptions = {
      from: `"Click2Hire" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <p>Hello ${user.fullName || "User"},</p>
        <p>Your One Time Password (OTP) is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "OTP sent successfully to your email!",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.LoginEmailWithOtp = async (req, res) => {
  console.log("Received request for Login with Email and OTP");
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }
  try {
    const user =
      (await JobSeekerModel.findOne({ email })) ||
      (await EmployerModel.findOne({ email }));
    if (!user) {
      return res.status(203).json({
        message: "Email Not Found. Please try again,or Verify Email.",
      });
    }
    const otpRecord = await OtpModel.findOne({
      email: email,
    });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(204).json({
        message: "Invalid OTP. Please try again.",
      });
    }

    console.log("Call Goes to CreateToken");
    const token = await CreateToken(
      user._id,
      user.role,
      user.email,
      user.fullName
    );
    console.log("Call Back from CreateToken To Login Email With OTP");
    res.status(200).json({
      message: "Login successful!",
      id: user._id,
      fullName: user.fullName,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
