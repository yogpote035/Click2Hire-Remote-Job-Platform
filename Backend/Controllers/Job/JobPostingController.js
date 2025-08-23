const JobPosting = require("../../Models/Employer/JobPostingModel");
const EmployerProfileModel = require("../../Models/Employer/EmployerProfileModel");
const JobApplicationModel = require("../../Models/Employee/JobApplicationModel");
const nodemailer = require("nodemailer");

exports.createJobPosting = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const employerId = req.user.userId; // from auth middleware
    const employerProfile = await EmployerProfileModel.findOne({
      userId: employerId,
    });

    if (!employerProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Create your profile first." });
    }

    const job = new JobPosting({
      ...req.body,
      employerId,
      employerProfileId: employerProfile._id,
    });

    await job.save();
    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Error creating job", error: err.message });
  }
};

// Get single job posting
exports.getJobById = async (req, res) => {
  try {
    const employerId = req.user.userId; // from auth middleware
    const employerProfile = await EmployerProfileModel.findOne({
      userId: employerId,
    });

    if (!employerProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Create your profile first." });
    }
    const job = await JobPosting.findById(req.params.id).populate(
      "employerProfileId",
      "companyName industry companyLogo"
    );

    console.log("Job: ", job);

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job", error: err.message });
  }
};

// Get jobs posted by logged-in employer
exports.getMyJobs = async (req, res) => {
  try {
    console.log("Request in my Job Employer Post ");
    const employerId = req.user.userId; // from auth middleware
    const employerProfile = await EmployerProfileModel.findOne({
      userId: employerId,
    });

    if (!employerProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Create your profile first." });
    }
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const jobs = await JobPosting.find({ employerId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching employer jobs", error: err.message });
  }
};

// Update a job posting
exports.updateJobPosting = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }
    const employerId = req.user.userId; // from auth middleware
    const employerProfile = await EmployerProfileModel.findOne({
      userId: employerId,
    });

    if (!employerProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Create your profile first." });
    }
    const job = await JobPosting.findOneAndUpdate(
      { _id: req.params.id, employerId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!job)
      return res.status(404).json({ message: "Job not found or unauthorized" });

    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Error updating job", error: err.message });
  }
};

// Delete a job posting
exports.deleteJobPosting = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const employerId = req.user.userId; // from auth middleware
    const employerProfile = await EmployerProfileModel.findOne({
      userId: employerId,
    });

    if (!employerProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Create your profile first." });
    }
    const job = await JobPosting.findOneAndDelete({
      _id: req.params.id,
      employerId: req.user.userId,
    });

    if (!job)
      return res.status(404).json({ message: "Job not found or unauthorized" });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
};

// Close job (mark as closed)
exports.closeJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const employerId = req.user.userId; // from auth middleware
    const employerProfile = await EmployerProfileModel.findOne({
      userId: employerId,
    });

    if (!employerProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Create your profile first." });
    }

    const job = await JobPosting.findOneAndUpdate(
      { _id: req.params.id, employerId: req.user.userId },
      { status: "Closed", isActive: false },
      { new: true }
    );

    if (!job)
      return res.status(404).json({ message: "Job not found or unauthorized" });

    res.json({ message: "Job closed successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Error closing job", error: err.message });
  }
};

exports.AllApplicationForJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const employerId = req.user.userId; // from auth middleware
    const employerProfile = await EmployerProfileModel.findOne({
      userId: employerId,
    });

    if (!employerProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Create your profile first." });
    }

    const jobId = req.params.id;
    const allApplication = await JobApplicationModel.find({
      jobPostId: jobId,
    }).populate("userProfileId");
    res.status(200).json(allApplication);
  } catch (err) {
    res.status(500).json({ message: `Error, ${err?.message}` });
  }
};

exports.SingleApplicationForJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const employerId = req.user.userId; // from auth middleware
    const employerProfile = await EmployerProfileModel.findOne({
      userId: employerId,
    });

    if (!employerProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Create your profile first." });
    }

    const jobId = req.params.id;
    const profileId = req.params.profileId;
    if (!jobId || !profileId) {
      return res.status(400).json({ message: "Missing required Fields..." });
    }

    const application = await JobApplicationModel.find({
      jobPostId: jobId,
      userProfileId: profileId,
    })
      .populate("userProfileId")
      .populate("jobPostId");
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: `Error, ${err?.message}` });
  }
};

exports.SingleApplicationForJobUpdateStatusByEmployer = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const employerId = req.user.userId; // from auth middleware
    const employerProfile = await EmployerProfileModel.findOne({
      userId: employerId,
    });

    if (!employerProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Create your profile first." });
    }

    const { status } = req.body;
    const applicationId = req.params.id;

    if (!applicationId || !status) {
      return res.status(400).json({ message: "Missing required fields..." });
    }

    // Update application
    const application = await JobApplicationModel.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true, runValidators: true }
    )
      .populate("userProfileId") // applicant profile
      .populate("jobPostId"); // job info

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    if (application.userProfileId?.email) {
      const applicantEmail = application.userProfileId.email;
      const applicantName = application.userProfileId.fullName;
      const companyName = employerProfile.companyName || "Our Company";
      const companyLogo =
        employerProfile.companyLogo?.url ||
        "https://via.placeholder.com/120x60?text=Logo";
      const jobTitle =
        application.jobPostId?.title || "the job you applied for";

      // setup mail transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.Mail_User, // email
          pass: process.env.Mail_Password, // app password
        },
      });

      const statusColors = {
        Accepted: "#28a745",
        Rejected: "#dc3545",
        "Under Review": "#ff9800",
        "In Progress": "#0073e6",
      };
      const mailOptions = {
        from: `"${companyName}" <${process.env.Mail_User}>`,
        to: applicantEmail,
        subject: `Application Status Update – ${jobTitle}`,
        html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f6f9; padding:30px;">
    <div style="max-width:650px; margin:auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08); border:1px solid #e0e0e0;">
      
      <!-- Header -->
      <div style="background:linear-gradient(90deg, #3B82F6, #FB923C); padding:25px; text-align:center; color:#fff;">
        <!-- Inline Logo -->
        <div style="font-size:38px; font-weight:700; letter-spacing:2px; margin-bottom:8px;">
          <span style="color:#1e3a8a;">C</span>
          <span style="color:#f97316;">2</span>
          <span style="color:#1e3a8a;">H</span>
        </div>
        <h1 style="margin:0; font-size:22px; font-weight:500;">${companyName}</h1>
      </div>
      
      <!-- Body -->
      <div style="padding:30px; color:#333; line-height:1.6;">
        <p style="font-size:16px;">Dear <b>${applicantName}</b>,</p>
        <p>Your application status for <b>${jobTitle}</b> has been updated:</p>
        
        <!-- Status Badge -->
        <div style="margin:20px 0; text-align:center;">
          <span style="background:${
            statusColors[status] || "#0073e6"
          }; color:#fff; padding:10px 20px; border-radius:50px; font-size:16px; font-weight:bold;">
            ${status}
          </span>
        </div>
        
        <!-- Job Card -->
        <div style="background:#fafafa; padding:20px; border-radius:8px; border:1px solid #eee; margin-bottom:20px;">
          <h3 style="margin-top:0; color:#1e3a8a;">📌 Job Details</h3>
          <p><b>Title:</b> ${jobTitle}</p>
          <p><b>Location:</b> ${application.jobPostId.location}</p>
          <p><b>Type:</b> ${application.jobPostId.employmentType}</p>
          <p><b>Salary:</b> ${application.jobPostId.salaryRange.min} - ${
          application.jobPostId.salaryRange.max
        } ${application.jobPostId.salaryRange.currency}</p>
          <p><b>Perks:</b> ${application.jobPostId.companyPerks.join(", ")}</p>
        </div>

        <!-- Applicant Card -->
        <div style="background:#eef6ff; padding:20px; border-radius:8px; border:1px solid #d0e2ff; margin-bottom:20px;">
          <h3 style="margin-top:0; color:#005bb5;">👤 Your Profile</h3>
          <p><b>Name:</b> ${applicantName}</p>
          <p><b>Email:</b> ${applicantEmail}</p>
          <p><b>Portfolio:</b> <a href="${
            application.userProfileId.portfolioUrl
          }" target="_blank" style="color:#0073e6;">${
          application.userProfileId.portfolioUrl
        }</a></p>
          <p><b>Resume:</b> <a href="${
            application.userProfileId.resumeUrl.url
          }" target="_blank" style="color:#0073e6;">📄 Download Resume</a></p>
          
          <!-- Skills Section -->
          <div style="margin-top:10px;">
            <b>Skills:</b><br/>
            ${application.userProfileId.skills
              .map(
                (skill) => `
              <span style="display:inline-block; background:#1e3a8a; color:#fff; padding:6px 12px; border-radius:20px; font-size:13px; margin:5px;">${skill}</span>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- CTA Buttons -->
        <div style="text-align:center; margin:30px 0;">
          <a href="${
            application.userProfileId.linkedinProfile
          }" target="_blank" style="background:#0073e6; color:#fff; padding:12px 25px; border-radius:30px; text-decoration:none; font-size:15px; font-weight:bold; margin:5px;">View LinkedIn</a>
          <a href="${
            application.userProfileId.githubProfile
          }" target="_blank" style="background:#24292e; color:#fff; padding:12px 25px; border-radius:30px; text-decoration:none; font-size:15px; font-weight:bold; margin:5px;">View GitHub</a>
        </div>
        
        <p>If you have questions, reach us at <a href="mailto:${
          process.env.Mail_User
        }" style="color:#0073e6;">${process.env.Mail_User}</a>.</p>
        <p>Best regards,<br><b>${companyName} Hiring Team</b></p>
      </div>
      
      <!-- Footer -->
      <div style="background:#f1f1f1; padding:15px; font-size:12px; text-align:center; color:#777;">
        © ${new Date().getFullYear()} ${companyName}. All Rights Reserved.
      </div>
    </div>
  </div>
  `,
      };

      // send mail
      try {
        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent to:", applicantEmail);
      } catch (emailErr) {
        console.error("Error sending email:", emailErr.message);
      }
    }

    res.status(200).json({
      message: `Application Status Updated to: ${status}`,
      application,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ success: false, message: `Error, ${err?.message}` });
  }
};
