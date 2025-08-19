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

    console.log("Job: ",job);

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
      const companyLogo = employerProfile.companyLogo || "https://via.placeholder.com/120x60?text=Logo";
      const jobTitle = application.jobPostId?.title || "the job you applied for";

      // setup mail transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.Mail_User, // email
          pass: process.env.Mail_Password, // app password
        },
      });

      const mailOptions = {
        from: `"${companyName}" <${process.env.Mail_User}>`,
        to: applicantEmail,
        subject: `Update on Your Job Application - ${jobTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; border:1px solid #ddd;">
              
              <!-- Header -->
              <div style="background: #0073e6; color: #fff; padding: 20px; display: flex; align-items: center; justify-content: space-between;">
                <img src="${companyLogo}" alt="${companyName}" style="height:50px; border-radius:4px;" />
                <h2 style="margin:0; font-size:20px;">${companyName}</h2>
              </div>
              
              <!-- Body -->
              <div style="padding: 20px; color:#333;">
                <p>Dear <b>${applicantName}</b>,</p>
                <p>We wanted to inform you that your application status for the position of 
                  <b>${jobTitle}</b> at <b>${companyName}</b> has been updated.</p>

                <p><b>New Status:</b> 
                  <span style="color:#0073e6; font-weight:600;">${status}</span>
                </p>

                <h3 style="margin-top:20px; font-size:16px; border-bottom:1px solid #ddd; padding-bottom:5px;">Application Details</h3>
                <p><b>Job Title:</b> ${jobTitle}</p>
                <p><b>Applicant:</b> ${applicantName}</p>
                <p><b>Email:</b> ${applicantEmail}</p>
                <p><b>Applied On:</b> ${new Date(application.appliedAt).toDateString()}</p>

                <hr style="margin:20px 0;" />

                <p style="font-size:14px; color:#555;">If you have any questions, feel free to contact us at <a href="mailto:${process.env.Mail_User}" style="color:#0073e6;">${process.env.Mail_User}</a>.</p>
                
                <p style="margin-top:20px;">Best regards,</p>
                <p><b>${companyName} Hiring Team</b></p>
              </div>
              
              <!-- Footer -->
              <div style="background:#f1f1f1; padding:10px 20px; font-size:12px; text-align:center; color:#777;">
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

