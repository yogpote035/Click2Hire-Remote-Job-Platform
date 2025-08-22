const OtpModel = require("../../../Models/OtpModel");
const JobSeekerModel = require("../../../Models/Employee/JobSeekerModel");
const EmployerModel = require("../../../Models/Employer/EmployerModel");
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
    const mailOptions = {
  from: `"Click2Hire" <${process.env.Mail_User}>`,
  to: email,
  subject: "🔑 Your OTP Code - C2H",
  html: `
  <!DOCTYPE html>
  <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <style>
       body {
         font-family: Arial, sans-serif;
         background-color: #f9fafb;
         margin: 0;
         padding: 0;
       }
       .container {
         max-width: 600px;
         margin: 30px auto;
         background: #ffffff;
         border-radius: 10px;
         overflow: hidden;
         box-shadow: 0 6px 16px rgba(0,0,0,0.1);
         border: 1px solid #e5e7eb;
       }
       .header {
         background: linear-gradient(90deg, #1e3a8a, #f97316);
         padding: 25px 20px;
         text-align: center;
         color: #fff;
       }
       .logo {
         font-size: 42px;
         font-weight: 700;
         letter-spacing: 2px;
         margin-bottom: 8px;
       }
       .logo .c, .logo .h {
         color: #1e3a8a; /* Indigo */
       }
       .logo .two {
         color: #f97316; /* Orange */
       }
       .header h1 {
         margin: 5px 0 0 0;
         font-size: 20px;
         font-weight: 500;
         color: #fff;
       }
       .content {
         padding: 30px 25px;
         text-align: center;
         color: #374151;
       }
       .otp-box {
         display: inline-block;
         padding: 15px 30px;
         margin: 25px 0;
         border: 2px dashed #1e3a8a;
         border-radius: 8px;
         font-size: 26px;
         font-weight: bold;
         color: #f97316;
         letter-spacing: 6px;
         background: #f9fafb;
       }
       .footer {
         background: #f3f4f6;
         padding: 15px;
         text-align: center;
         font-size: 13px;
         color: #6b7280;
       }
       a {
         color: #f97316;
         text-decoration: none;
         font-weight: 600;
       }
     </style>
   </head>
   <body>
     <div class="container">
       <!-- Header -->
       <div class="header">
         <div class="logo">
           <span class="c">C</span><span class="two">2</span><span class="h">H</span>
         </div>
         <h1>Security Verification</h1>
       </div>

       <!-- Content -->
       <div class="content">
         <p>Hello <strong>${user.fullName || "User"}</strong>,</p>
         <p>We received a request to verify your account. Please use the OTP below to complete the process:</p>
         <div class="otp-box">${otp}</div>
         <p>This code will expire in <strong>5 minutes</strong>.</p>
         <p>If you did not request this, you can safely ignore this email.</p>
       </div>

       <!-- Footer -->
       <div class="footer">
         <p>© 2025 C2H (Click2Hire). All rights reserved.</p>
         <p><a href="https://click2-hire-remote-job-platform.vercel.app/">Visit our website</a></p>
       </div>
     </div>
   </body>
  </html>
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
