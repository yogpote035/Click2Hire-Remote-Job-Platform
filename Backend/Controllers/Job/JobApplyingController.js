// controllers/jobApplicationController.js
const JobApplicationModel = require("../../Models/Employee/JobApplicationModel");
const JobPostingModel = require("../../Models/Employer/JobPostingModel");
const JobSeekerProfileModel = require("../../Models/Employee/EmployeeProfileModel");

exports.applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(401).json({ message: "Only jobseekers can apply" });
    }

    const { jobPostId, resume, coverLetter } = req.body;
    if (!jobPostId || !resume) {
      return res.status(400).json({ message: "Job and Resume are required" });
    }

    const profile = await JobSeekerProfileModel.findOne({
      userId: req.user.userId,
    });
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Complete your profile first." });
    }

    const activeJob = JobPostingModel.findById(jobPostId);
    if (activeJob.status === "Closed") {
      return res
        .status(401)
        .json({ message: "Job is Closed No Longer Application Accepting" });
    }
    const application = new JobApplicationModel({
      jobPostId,
      userProfileId: profile._id,
      resume,
      coverLetter,
    });

    await application.save();

    await JobPostingModel.updateOne(
      { _id: jobPostId },
      { $inc: { applicationCount: 1 } }
    );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications of logged-in jobseeker
exports.getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const profile = await JobSeekerProfileModel.findOne({
      userId: req.user.userId,
    });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const applications = await JobApplicationModel.find({
      userProfileId: profile._id,
    })
      .populate("jobPostId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single application (jobseeker can see their own)
exports.getApplication = async (req, res) => {
  try {
    const profile =
      req.user.role === "jobseeker"
        ? await JobSeekerProfileModel.findOne({ userId: req.user.userId })
        : null;

    const query = { _id: req.params.id };
    if (req.user.role === "jobseeker") query.userProfileId = profile._id;

    const application = await JobApplicationModel.findOne(query)
      .populate("jobPostId")
      .populate("userProfileId");

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Withdraw (Delete) Application
exports.withdrawApplication = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(401).json({ message: "Only jobseekers can withdraw" });
    }

    const profile = await JobSeekerProfileModel.findOne({
      userId: req.user.userId,
    });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const application = await JobApplicationModel.findOne({
      _id: req.params.id,
      userProfileId: profile._id,
    });

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    await JobApplicationModel.findByIdAndDelete(req.params.id);
    await JobPostingModel.updateOne(
      { _id: req.query.jobId },
      { $inc: { applicationCount: -1 } }
    );

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.downloadApplication = async (req, res) => {
  let puppeteer, browser;

  try {
    const application = await JobApplicationModel.findById(req.params.id)
      .populate("jobPostId")
      .populate("userProfileId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Choose puppeteer depending on environment
    if (process.env.NODE_ENV === "production") {
      puppeteer = require("puppeteer-core");
      const chromium = require("@sparticuz/chromium");
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      puppeteer = require("puppeteer");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
    }

    const page = await browser.newPage();

    // Build HTML content dynamically
    const htmlContent = `
      <html>
        <head>
          <title>Job Application</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            h2 { margin-top: 20px; }
            p { margin: 5px 0; }
            .section { margin-bottom: 20px; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Job Application</h1>

          <div class="section">
            <h2>Job Information</h2>
            <p><span class="bold">Title:</span> ${
              application.jobPostId.title
            }</p>
            <p><span class="bold">Description:</span> ${
              application.jobPostId.description
            }</p>
            <p><span class="bold">Location:</span> ${
              application.jobPostId.location
            }</p>
            <p><span class="bold">Employment Type:</span> ${
              application.jobPostId.employmentType
            }</p>
            <p><span class="bold">Deadline:</span> ${new Date(
              application.jobPostId.deadline
            ).toDateString()}</p>
          </div>

          <div class="section">
            <h2>Applicant Information</h2>
            <p><span class="bold">Name:</span> ${
              application.userProfileId.fullName
            }</p>
            <p><span class="bold">Email:</span> ${
              application.userProfileId.email
            }</p>
            <p><span class="bold">Mobile:</span> ${
              application.userProfileId.mobileNumber
            }</p>
            <p><span class="bold">Location:</span> ${
              application.userProfileId.location
            }</p>
            <p><span class="bold">About:</span> ${
              application.userProfileId.about
            }</p>
            <p><span class="bold">Skills:</span> ${application.userProfileId.skills.join(
              ", "
            )}</p>
          </div>

          <div class="section">
            <h2>Application Details</h2>
            <p><span class="bold">Status:</span> ${application.status}</p>
            <p><span class="bold">Applied At:</span> ${new Date(
              application.appliedAt
            ).toDateString()}</p>
            <p><span class="bold">Resume:</span> <a href="${
              application.resume
            }">View Resume</a></p>
            <p><span class="bold">Cover Letter:</span> <a href="${
              application.coverLetter
            }">View Cover Letter</a></p>
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="application_${application._id}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Download Application Error:", err);
    if (browser) await browser.close();
    res.status(500).json({ message: "Failed to download application" });
  }
};
